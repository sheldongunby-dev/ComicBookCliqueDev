const https = require('https');
const fs = require('fs');
const path = require('path');
const TurndownService = require('turndown');

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const FEED_URL = 'https://comicbookclique.podbean.com/feed.xml';
const DEST_DIR = path.join(__dirname, '../src/content/podcasts');

if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR, { recursive: true });

async function scrape() {
    try {
        const response = await fetch(FEED_URL);
        const data = await response.text();
        const items = data.split('<item>').slice(1);
        let count = 0;
        
        for (const item of items) {
            try {
                const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
                const title = titleMatch ? titleMatch[1] : 'Untitled';
                
                const linkMatch = item.match(/<link>(.*?)<\/link>/);
                const link = linkMatch ? linkMatch[1] : '';

                const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
                const date = dateMatch ? new Date(dateMatch[1]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

                const epMatch = item.match(/<itunes:episode>(.*?)<\/itunes:episode>/) || title.match(/Ep (\d+)/i);
                const epNum = epMatch ? parseInt(epMatch[1]) : 0;

                const descMatch = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) || item.match(/<description>([\s\S]*?)<\/description>/);
                const desc = descMatch ? descMatch[1] : '';

                const safeSlug = title.replace(/[\/\\:\*\?"<>\|]/g, '-').replace(/\s+/g, '-').toLowerCase();

                let frontmatter = `---\n`;
                frontmatter += `title: ${JSON.stringify(title)}\n`;
                frontmatter += `publishDate: "${date}"\n`;
                frontmatter += `category: "major-issues"\n`;
                frontmatter += `episodeNumber: ${epNum}\n`;
                if (link) frontmatter += `spotifyUrl: "${link}"\n`;
                frontmatter += `---\n\n`;

                const markdown = turndownService.turndown(desc);
                const outPath = path.join(DEST_DIR, safeSlug + '.mdoc');
                
                fs.writeFileSync(outPath, frontmatter + markdown);
                count++;
            } catch (e) {
                console.error("Error processing item", e);
            }
        }
        console.log(`Scraped ${count} episodes from Podbean`);
    } catch (e) {
        console.error(e);
    }
}
scrape();
