import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'huoyli9r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-07',
  useCdn: false,
});

async function runAudit() {
  console.log("Fetching all documents (reviews, news, podcasts)...");
  
  const query = `*[_type in ["review", "article", "podcast", "news"]] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    description,
    seoDescription,
    content
  }`;
  
  const docs = await client.fetch(query);
  console.log(`Found ${docs.length} documents. Auditing for raw HTML, shortcodes, and newlines...`);
  
  let issues = 0;
  
  // Recursively search Portable Text for suspicious strings
  function scanPortableText(blocks) {
    let rawText = '';
    if (!blocks || !Array.isArray(blocks)) return rawText;
    
    for (const block of blocks) {
      if (block._type === 'block' && block.children) {
        for (const child of block.children) {
          if (child.text) rawText += child.text + '\\n';
        }
      }
    }
    return rawText;
  }

  for (const doc of docs) {
    const fieldsToScan = [
      { name: 'excerpt', text: doc.excerpt },
      { name: 'description', text: doc.description },
      { name: 'seoDescription', text: doc.seoDescription },
      { name: 'content', text: scanPortableText(doc.content) }
    ];
    
    for (const field of fieldsToScan) {
      if (!field.text) continue;
      
      const suspicious = [];
      
      // Look for HTML tags
      if (/<[a-z][\s\S]*>/i.test(field.text)) suspicious.push('HTML tags');
      // Look for shortcodes like [caption]
      if (/\[\/?caption/.test(field.text)) suspicious.push('WordPress [caption] shortcode');
      // Look for literal \n strings (not actual newlines, but backslash n)
      if (/\\n/.test(field.text)) suspicious.push('Literal \\n string');
      
      if (suspicious.length > 0) {
        console.log(`- [${doc._type.toUpperCase()}] "${doc.title}"`);
        console.log(`  -> Issue in '${field.name}': found ${suspicious.join(', ')}`);
        // console.log(`     Preview: ${field.text.substring(0, 100)}...`);
        issues++;
      }
    }
  }
  
  console.log(`\\nAudit complete. Found ${issues} text leakage issues across ${docs.length} documents.`);
}

runAudit().catch(console.error);
