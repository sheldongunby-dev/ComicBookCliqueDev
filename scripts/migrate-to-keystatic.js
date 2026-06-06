const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

// Configure Turndown to keep some basic formatting or handle specific Squarespace quirks if needed
turndownService.addRule('iframes', {
    filter: 'iframe',
    replacement: function(content, node) {
        return `\n\n${node.outerHTML}\n\n`;
    }
});

const SRC_DIR = path.join(__dirname, '../src/content/generated');
const DEST_DIR = path.join(__dirname, '../src/content');

const COLLECTIONS = {
    'articles.json': 'articles',
    'news.json': 'news',
    'popculture-news.json': 'news',
    'wrestling-news.json': 'news',
    'gaming-news.json': 'news',
    'reviews.json': 'reviews',
    'podcast-episodes.json': 'podcasts',
    'dirtsheetradio-episodes.json': 'podcasts'
};

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

for (const [file, collection] of Object.entries(COLLECTIONS)) {
    const filePath = path.join(SRC_DIR, file);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${file} - not found`);
        continue;
    }

    const collectionDir = path.join(DEST_DIR, collection);
    if (!fs.existsSync(collectionDir)) fs.mkdirSync(collectionDir, { recursive: true });

    let items;
    try {
        items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.error(`Failed to parse ${file}`);
        continue;
    }
    console.log(`Migrating ${items.length} items from ${file} to /${collection}...`);

    for (const item of items) {
        try {
            if (!item || !item.slug) {
                console.warn(`[Migrator] Skipping invalid item in ${file} (missing slug):`, item?.title || "untitled");
                continue;
            }
            
            // Clean slug to remove any character that is illegal in filesystems or could break paths
            const safeSlug = String(item.slug)
                .replace(/[\/\\:\*\?"<>\|]/g, '-')
                .replace(/\s+/g, '-')
                .toLowerCase();

            let actualCollection = collection;
            const hasPodcastTag = item.tags && Array.isArray(item.tags) && item.tags.some(t => typeof t === 'string' && (t.toLowerCase().includes('podcast') || t.toLowerCase().includes('dirt sheet')));
            if (hasPodcastTag) {
                actualCollection = 'podcasts';
            }

            const outCollectionDir = path.join(DEST_DIR, actualCollection);
            if (!fs.existsSync(outCollectionDir)) {
                fs.mkdirSync(outCollectionDir, { recursive: true });
            }

            // Default properties
            let frontmatter = `---
title: ${JSON.stringify(item.title || 'Untitled')}
publishDate: "${item.publishDate || new Date().toISOString().split('T')[0]}"
category: "${item.category || 'general'}"
`;

            if (item.excerpt) frontmatter += `excerpt: ${JSON.stringify(item.excerpt)}\n`;
            if (item.author?.name) frontmatter += `author_name: ${JSON.stringify(item.author.name)}\n`;
            if (item.featured !== undefined) frontmatter += `featured: ${!!item.featured}\n`;
            
            if (actualCollection === 'reviews') {
                frontmatter += `rating: ${item.rating || 8}\n`;
            }
            
            if (actualCollection === 'podcasts') {
                frontmatter += `episodeNumber: ${item.episodeNumber || 0}\n`;
                if (item.spotifyUrl) frontmatter += `spotifyUrl: "${item.spotifyUrl}"\n`;
            }
            
            if (item.heroImage?.url) {
                frontmatter += `heroImage_url: "${item.heroImage.url}"\n`;
                if (item.heroImage.alt) frontmatter += `heroImage_alt: ${JSON.stringify(item.heroImage.alt)}\n`;
            }

            frontmatter += `---\n\n`;

            // Convert body to markdown
            let markdownBody = '';
            const rawHtml = item.bodyHtml || item.embedCode || '';
            if (rawHtml) {
                try {
                    markdownBody = turndownService.turndown(rawHtml);
                } catch (e) {
                    console.error(`[Migrator] Error converting HTML for ${item.slug}, falling back to raw html.`, e);
                    markdownBody = rawHtml;
                }
            }

            const outPath = path.join(outCollectionDir, `${safeSlug}.mdoc`);
            fs.writeFileSync(outPath, frontmatter + markdownBody);
        } catch (itemError) {
            console.error(`[Migrator] Devastating error processing individual item: ${item?.title || item?.slug || "unknown"}:`, itemError);
        }
    }
}

console.log('Migration to Keystatic complete!');
