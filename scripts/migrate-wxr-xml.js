const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Preserve iframes for embedded players (podcasts, YouTube, etc.)
turndownService.addRule('iframes', {
    filter: 'iframe',
    replacement: function(content, node) {
        return `\n\n${node.outerHTML}\n\n`;
    }
});

const XML_FILES = [
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026.xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (1).xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (2).xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (3).xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (4).xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (5).xml",
  "C:\\Users\\Sheldon G\\Downloads\\Squarespace-Wordpress-Export-06-09-2026 (6).xml"
];

const DEST_DIR = path.join(__dirname, '../src/content');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images/imported');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });

async function downloadImage(url, destFilePath) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 sec timeout to prevent hanging
        
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(destFilePath, Buffer.from(arrayBuffer));
        return true;
    } catch (e) {
        console.warn(`[Image Downloader] Skipped image ${url}: ${e.message}`);
        return false;
    }
}

function getTagValue(itemText, tag) {
    const escapedTag = tag.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`<${escapedTag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${escapedTag}>`, 'i');
    const match = itemText.match(regex);
    return match ? match[1].trim() : '';
}

function getCategoriesAndTags(itemText) {
    const categories = [];
    const tags = [];
    const regex = /<category\s+domain="([^"]+)"(?:\s+nicename="([^"]+)")?[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\\]\\]>)?<\/category>/gi;
    let match;
    while ((match = regex.exec(itemText)) !== null) {
        const domain = match[1];
        const value = match[3].replace(/\]\]>$/, '').trim();
        if (domain === 'category') {
            categories.push(value);
        } else if (domain === 'post_tag') {
            tags.push(value);
        }
    }
    return { categories, tags };
}

function getThumbnailId(itemText) {
    const regex = /<wp:postmeta>\s*<wp:meta_key>_thumbnail_id<\/wp:meta_key>\s*<wp:meta_value>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/wp:meta_value>\s*<\/wp:postmeta>/i;
    const match = itemText.match(regex);
    return match ? match[1] : '';
}

// Maps author email/slug to a friendly name
function mapAuthor(emailOrLogin) {
    if (!emailOrLogin) return 'ComicBook Clique';
    if (emailOrLogin.includes('fit4aking03')) return 'George Serrano';
    if (emailOrLogin.includes('gst_jr')) return 'Gregory Thomas Jr.';
    if (emailOrLogin.includes('frank.jarome')) return 'Frank Jarome';
    if (emailOrLogin.includes('officialgabef')) return 'Gabe Foster';
    if (emailOrLogin.includes('aogarcia81')) return 'Alex Garcia';
    if (emailOrLogin.includes('flar420')) return 'Jonathan Escudero';
    if (emailOrLogin.includes('nclarocco1')) return 'Nicholas Larocco';
    if (emailOrLogin.includes('jameusmooney')) return 'Jameus Mooney';
    if (emailOrLogin.includes('untouchablemkwo')) return 'Mathew Sarpraicone';
    if (emailOrLogin.includes('brittnee.jones88')) return 'Brittnee Jones';
    if (emailOrLogin.includes('abelloza45')) return 'Abel Loza';
    if (emailOrLogin.includes('jack42309')) return 'Jack Richardson';
    if (emailOrLogin.includes('prub.gill')) return 'Prub Gill';
    if (emailOrLogin.includes('russellhartman10')) return 'Russell Hartman';
    if (emailOrLogin.includes('jake.kent2525')) return 'Jacob Kent';
    if (emailOrLogin.includes('sidsinha426')) return 'Siddharth Sinha';
    if (emailOrLogin.includes('sawdawg421')) return 'Sawyer Peek';
    if (emailOrLogin.includes('j.roberts25')) return 'Jessica Roberts';
    if (emailOrLogin.includes('mikecassandra')) return 'Mike Cassandra';
    return 'ComicBook Clique';
}

async function runMigration() {
    console.log('--- STARTING XML MIGRATION TO KEYSTATIC ---');
    
    const attachmentMap = new Map(); // post_id -> attachment_url
    const postsList = [];            // List of post item texts
    
    // PASS 1: Read all XML files to index attachments and collect post text
    for (const xmlPath of XML_FILES) {
        if (!fs.existsSync(xmlPath)) {
            console.log(`Warning: XML file not found at ${xmlPath}`);
            continue;
        }
        
        console.log(`Reading file: ${xmlPath}`);
        const content = fs.readFileSync(xmlPath, 'utf8');
        
        // Split file content into <item> blocks
        const itemBlocks = content.split('<item>');
        // Remove first element (header info before first <item>)
        itemBlocks.shift();
        
        console.log(`Found ${itemBlocks.length} items to process in current file.`);
        
        for (const itemText of itemBlocks) {
            // Clean closing tag if split left it attached
            const cleanText = itemText.split('</item>')[0];
            
            const postType = getTagValue(cleanText, 'wp:post_type');
            
            if (postType === 'attachment') {
                const postId = getTagValue(cleanText, 'wp:post_id');
                const attachmentUrl = getTagValue(cleanText, 'wp:attachment_url');
                if (postId && attachmentUrl) {
                    attachmentMap.set(postId, attachmentUrl);
                }
            } else if (postType === 'post') {
                const status = getTagValue(cleanText, 'wp:status');
                if (status === 'publish') {
                    postsList.push(cleanText);
                }
            }
        }
    }
    
    console.log(`Indexed ${attachmentMap.size} media attachments.`);
    console.log(`Collected ${postsList.length} published blog posts for migration.`);
    
    let stats = { articles: 0, news: 0, reviews: 0, podcasts: 0 };
    
    // PASS 2: Migrate posts
    for (let i = 0; i < postsList.length; i++) {
        const postText = postsList[i];
        try {
            const title = getTagValue(postText, 'title') || 'Untitled';
            const link = getTagValue(postText, 'link');
            
            let slug = getTagValue(postText, 'wp:post_name');
            if (!slug && link) {
                const parts = link.split('/').filter(Boolean);
                if (parts.length > 0) slug = parts[parts.length - 1];
            }
            if (!slug) {
                slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            // Clean slug to remove any character that is illegal in filesystems or could break paths
            const safeSlug = slug
                .replace(/[\/\\:\*\?"<>\|]/g, '-')
                .replace(/\s+/g, '-')
                .toLowerCase();
                
            let pubDate = '2026-06-09';
            const rawPubDate = getTagValue(postText, 'pubDate') || getTagValue(postText, 'wp:post_date');
            if (rawPubDate) {
                try {
                    pubDate = new Date(rawPubDate).toISOString().split('T')[0];
                } catch(e) {}
            }
            
            const creator = getTagValue(postText, 'dc:creator');
            const authorName = mapAuthor(creator);
            const bodyHtml = getTagValue(postText, 'content:encoded') || '';
            const excerpt = getTagValue(postText, 'excerpt:encoded') || 
                            bodyHtml.replace(/<[^>]*>?/gm, '').substring(0, 160).trim() + '...';
            
            const { categories, tags } = getCategoriesAndTags(postText);
            
            // Determine collection
            let collection = 'news';
            if (link.includes('/majorarticles/')) {
                collection = 'articles';
            } else if (link.includes('/majorreviews/')) {
                collection = 'reviews';
            } else if (link.includes('/majorissues/') || link.includes('/dirtsheetradio/') || link.includes('/podcast/')) {
                collection = 'podcasts';
            } else if (link.includes('/comicnews/') || link.includes('/popculturenews/') || link.includes('/wrestling-news/') || link.includes('/gamingnews/')) {
                collection = 'news';
            } else {
                const combined = [...categories, ...tags].map(s => s.toLowerCase());
                if (combined.some(s => s.includes('review'))) {
                    collection = 'reviews';
                } else if (combined.some(s => s.includes('article') || s.includes('feature'))) {
                    collection = 'articles';
                } else if (combined.some(s => s.includes('podcast') || s.includes('radio'))) {
                    collection = 'podcasts';
                }
            }
            
            // Resolve Featured Image
            let heroImageUrl = '';
            const thumbnailId = getThumbnailId(postText);
            if (thumbnailId && attachmentMap.has(thumbnailId)) {
                heroImageUrl = attachmentMap.get(thumbnailId);
            }
            
            let localHeroImageUrl = heroImageUrl;
            
            // Map specific fields
            let frontmatter = `---
title: ${JSON.stringify(title)}
publishDate: "${pubDate}"
category: "${categories[0] || collection}"
excerpt: ${JSON.stringify(excerpt)}
author_name: ${JSON.stringify(authorName)}
featured: false
`;

            if (collection === 'reviews') {
                frontmatter += `rating: 8.0\n`; // default rating
            }
            
            if (collection === 'podcasts') {
                let epNum = 0;
                for (const tag of tags) {
                    const num = parseInt(tag, 10);
                    if (!isNaN(num) && num > 0) {
                        epNum = num;
                        break;
                    }
                }
                
                let spotifyUrl = '';
                const spotifyMatch = bodyHtml.match(/https:\/\/open\.spotify\.com\/embed-podcast\/show\/[a-zA-Z0-9]+/i) || 
                                     bodyHtml.match(/https:\/\/open\.spotify\.com\/show\/[a-zA-Z0-9]+/i) ||
                                     bodyHtml.match(/https:\/\/open\.spotify\.com\/embed\/episode\/[a-zA-Z0-9]+/i);
                if (spotifyMatch) {
                    spotifyUrl = spotifyMatch[0];
                }
                
                frontmatter += `episodeNumber: ${epNum}\n`;
                if (spotifyUrl) frontmatter += `spotifyUrl: "${spotifyUrl}"\n`;
            }
            
            if (localHeroImageUrl) {
                frontmatter += `heroImage_url: "${localHeroImageUrl}"\n`;
                frontmatter += `heroImage_alt: ${JSON.stringify(title)}\n`;
            }
            
            frontmatter += `---\n\n`;
            
            // Convert body HTML to Markdown
            let markdownBody = '';
            if (bodyHtml) {
                try {
                    markdownBody = turndownService.turndown(bodyHtml);
                } catch (e) {
                    markdownBody = bodyHtml;
                }
            }
            
            // Ensure target directory exists
            const collectionDir = path.join(DEST_DIR, collection);
            if (!fs.existsSync(collectionDir)) {
                fs.mkdirSync(collectionDir, { recursive: true });
            }
            
            // Write to mdoc file
            const outPath = path.join(collectionDir, `${safeSlug}.mdoc`);
            fs.writeFileSync(outPath, frontmatter + markdownBody);
            stats[collection]++;
            
            if ((i + 1) % 50 === 0 || i === postsList.length - 1) {
                console.log(`Processed ${i + 1}/${postsList.length} posts...`);
            }
            
        } catch (postError) {
            console.error(`Error processing post at index ${i}:`, postError.message);
        }
    }
    
    console.log('--- XML MIGRATION COMPLETE ---');
    console.log('Stats:', stats);
}

runMigration().catch(console.error);
