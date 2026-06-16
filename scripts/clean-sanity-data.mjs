import { createClient } from 'next-sanity';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'huoyli9r',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-06-07',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

function cleanPlainText(text) {
  if (!text || typeof text !== 'string') return text;
  let cleaned = text;
  // HTML tags
  cleaned = cleaned.replace(/<[^>]*>?/gm, '');
  // WordPress shortcodes
  cleaned = cleaned.replace(/\[\/?.*?\]/g, '');
  // HTML entities
  cleaned = cleaned.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  // Literal escaped characters
  cleaned = cleaned.replace(/\\[nrt]/g, ' ');
  // Actual newlines/tabs
  cleaned = cleaned.replace(/[\n\r\t]+/g, ' ');
  // Multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

function cleanPortableText(blocks) {
  if (!blocks || !Array.isArray(blocks)) return blocks;
  
  return blocks.map(block => {
    if (block._type === 'block' && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map(child => {
          if (child._type === 'span' && typeof child.text === 'string') {
            return {
              ...child,
              text: cleanPlainText(child.text)
            };
          }
          return child;
        })
      };
    }
    return block;
  });
}

async function runCleanup() {
  console.log("Fetching all documents...");
  const query = `*[_type in ["review", "article", "podcast", "news"]] {
    _id,
    _type,
    excerpt,
    description,
    seoDescription,
    content
  }`;
  
  const docs = await client.fetch(query);
  console.log(`Found ${docs.length} documents. Analyzing...`);
  
  const mutations = [];

  for (const doc of docs) {
    const patches = {};
    
    // Check and clean text fields
    if (doc.excerpt) {
      const cleaned = cleanPlainText(doc.excerpt);
      if (cleaned !== doc.excerpt) patches.excerpt = cleaned;
    }
    if (doc.description) {
      const cleaned = cleanPlainText(doc.description);
      if (cleaned !== doc.description) patches.description = cleaned;
    }
    if (doc.seoDescription) {
      const cleaned = cleanPlainText(doc.seoDescription);
      if (cleaned !== doc.seoDescription) patches.seoDescription = cleaned;
    }
    if (doc.content) {
      const cleanedContent = cleanPortableText(doc.content);
      if (JSON.stringify(cleanedContent) !== JSON.stringify(doc.content)) {
        patches.content = cleanedContent;
      }
    }
    
    if (Object.keys(patches).length > 0) {
      mutations.push({
        id: doc._id,
        patches
      });
    }
  }

  console.log(`Found ${mutations.length} documents needing cleanup. Committing in batches...`);
  
  // Batch updates in groups of 50 to avoid rate limits
  const BATCH_SIZE = 50;
  for (let i = 0; i < mutations.length; i += BATCH_SIZE) {
    const batch = mutations.slice(i, i + BATCH_SIZE);
    let transaction = client.transaction();
    
    for (const m of batch) {
      transaction = transaction.patch(m.id, (p) => p.set(m.patches));
    }
    
    try {
      await transaction.commit();
      console.log(`Committed batch ${i / BATCH_SIZE + 1} of ${Math.ceil(mutations.length / BATCH_SIZE)}`);
    } catch (err) {
      console.error(`Failed to commit batch ${i / BATCH_SIZE + 1}:`, err.message);
    }
  }
  
  console.log("Cleanup complete!");
}

runCleanup().catch(console.error);
