const { createReader } = require('@keystatic/core/reader');
const keystaticConfig = require('./keystatic.config').default;
const path = require('path');

async function debug() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const episodes = await reader.collections.podcasts.all();
  if (episodes.length > 0) {
    const ep = episodes[0];
    const content = await ep.entry.content();
    console.log('Content type:', typeof content);
    console.log('Is Array:', Array.isArray(content));
    console.log('Content sample:', JSON.stringify(content).slice(0, 200));
  }
}

debug().catch(console.error);
