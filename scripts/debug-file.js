const fs = require('fs');
const path = require('path');

async function debug() {
  const filePath = path.join(process.cwd(), 'src/content/news/xmen-97-season-2-and-3-new-headwriter.mdoc');
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log('File content snapshot:');
  console.log(content.slice(0, 500));
}

debug().catch(console.error);
