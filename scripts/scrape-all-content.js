const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://comicbookclique.com';
const TARGET_DIR = path.join(__dirname, '../src/content/generated');

// Map endpoints to our local JSON schema generators
const ENDPOINTS = [
    {
        url: '/majorarticles',
        filename: 'articles.json',
        type: 'article',
        defaultSection: 'features',
        defaultCategory: 'features'
    },
    {
        url: '/comicnews',
        filename: 'news.json',
        type: 'news',
        defaultSection: 'news',
        defaultCategory: 'news'
    },
    {
        url: '/majorreviews',
        filename: 'reviews.json',
        type: 'review',
        defaultSection: 'reviews',
        defaultCategory: 'reviews'
    },
    {
        url: '/majorissues',
        filename: 'podcast-episodes.json',
        type: 'podcast',
        defaultSection: 'podcast',
        defaultCategory: 'major-issues'
    },
    {
        url: '/dirtsheetradio',
        filename: 'dirtsheetradio-episodes.json',
        type: 'podcast',
        defaultSection: 'podcast',
        defaultCategory: 'dirtsheetradio'
    },
    {
        url: '/popculturenews',
        filename: 'popculture-news.json',
        type: 'news',
        defaultSection: 'news',
        defaultCategory: 'pop-culture'
    },
    {
        url: '/wrestling-news',
        filename: 'wrestling-news.json',
        type: 'news',
        defaultSection: 'news',
        defaultCategory: 'wrestling'
    },
    {
        url: '/gamingnews',
        filename: 'gaming-news.json',
        type: 'news',
        defaultSection: 'news',
        defaultCategory: 'gaming'
    }
];

// Helper to convert Squarespace Item to our Article/Review/News schema
function mapContentItem(item, config) {
    if (!item) return null;

    let pubDate = new Date().toISOString().split('T')[0];
    if (item.publishOn) {
        try {
            pubDate = new Date(item.publishOn).toISOString().split('T')[0];
        } catch (e) {
            console.warn(`[Scraper] Invalid publish date on item ID ${item.id || "unknown"}, fallback to current date.`, e);
        }
    }
    
    // Attempt to extract reading time or rating from tags/excerpt if needed
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const isFeatured = !!item.starred;
    const authorName = item.author?.displayName || 'ComicBook Clique';
    
    // Basic formatting mapping
    const mapped = {
        id: item.id || `gen-${Math.random().toString(36).substr(2, 9)}`,
        type: config.type,
        title: item.title || 'Untitled Publication',
        slug: item.urlId || `untitled-${Math.random().toString(36).substr(2, 9)}`,
        canonicalUrl: item.fullUrl ? `${BASE_URL}${item.fullUrl}` : BASE_URL,
        section: config.defaultSection,
        category: (Array.isArray(item.categories) && item.categories.length > 0) ? item.categories[0] : config.defaultCategory,
        tags: tags,
        author: {
            id: item.author?.id || 'comicbook-clique',
            name: authorName,
            slug: authorName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        },
        publishDate: pubDate,
        excerpt: typeof item.excerpt === 'string' ? item.excerpt.replace(/<[^>]*>?/gm, '').trim() : '', 
        bodyHtml: item.body || '',
        heroImage: item.assetUrl ? {
            url: item.assetUrl,
            alt: item.title || 'Hero image'
        } : undefined,
        featured: isFeatured
    };

    if (config.type === 'article') {
        const wordCount = typeof item.body === 'string' ? item.body.split(/\s+/).length : 0;
        mapped.readingTime = Math.max(1, Math.round(wordCount / 200));
    }
    
    if (config.type === 'review') {
        mapped.rating = 8.0; 
        mapped.publisher = "Indie";
    }

    if (config.type === 'podcast') {
        let epNum = 0;
        if (tags.length) {
            const parsed = parseInt(tags[0]);
            if (!isNaN(parsed)) epNum = parsed;
        }
        
        return {
            id: mapped.id,
            slug: mapped.slug,
            title: mapped.title,
            episodeNumber: epNum,
            publishDate: pubDate,
            description: mapped.excerpt,
            embedCode: item.body || '',
            heroImage: mapped.heroImage,
            spotifyUrl: "",
            appleUrl: "",
            youtubeUrl: ""
        };
    }

    return mapped;
}

async function fetchPaginatedEndpoint(config) {
    let allItems = [];
    let currentUrl = `${BASE_URL}${config.url}?format=json`;

    console.log(`Starting scrape for ${config.url}...`);

    while (currentUrl) {
        try {
            const res = await fetch(currentUrl);
            const data = await res.json();
            
            if (!data || !data.items || !data.items.length) {
                break;
            }

            const mappedItems = [];
            for (const item of data.items) {
                try {
                    const mapped = mapContentItem(item, config);
                    if (mapped) mappedItems.push(mapped);
                } catch (e) {
                    console.error(`[Scraper] Failed to map single item ID ${item?.id || "unknown"}:`, e);
                }
            }
            
            allItems = allItems.concat(mappedItems);

            if (data.pagination && data.pagination.nextPage) {
                currentUrl = `${BASE_URL}${data.pagination.nextPageUrl}&format=json`;
                console.log(`  -> Fetching next page: ${data.pagination.nextPageUrl}`);
            } else {
                currentUrl = null;
            }
            
            // Artificial delay to play nice with Squarespace rate limits
            await new Promise(r => setTimeout(r, 500));
        } catch (error) {
            console.error(`Error fetching ${currentUrl}:`, error);
            break;
        }
    }

    console.log(`Finished ${config.url}. Total items: ${allItems.length}`);
    return allItems;
}

async function main() {
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    for (const config of ENDPOINTS) {
        const items = await fetchPaginatedEndpoint(config);
        const outputPath = path.join(TARGET_DIR, config.filename);
        
        fs.writeFileSync(outputPath, JSON.stringify(items, null, 2));
        console.log(`Saved ${items.length} items to ${config.filename}\n`);
    }

    console.log('All scraping complete!');
}

main().catch(console.error);
