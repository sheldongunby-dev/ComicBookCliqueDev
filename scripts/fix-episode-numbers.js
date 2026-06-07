const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/podcasts');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdoc'));

let updated = 0;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the title line
    const titleMatch = content.match(/title:\s*"(.*?)"/);
    if (!titleMatch) continue;

    const title = titleMatch[1];
    
    // Extract episode number from title (e.g. Ep 431, Ep. 214, Episode 10)
    const epMatch = title.match(/Ep(?:isode)?\.?\s*(\d+)/i);
    
    if (epMatch) {
        const epNum = epMatch[1];
        // Replace episodeNumber: 0 with episodeNumber: <num>
        const newContent = content.replace(/episodeNumber:\s*0/, `episodeNumber: ${epNum}`);
        
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            updated++;
        }
    }
}

console.log(`Updated ${updated} podcast files with extracted episode numbers.`);
