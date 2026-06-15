import { getCliClient } from 'sanity/cli';
import dotenv from 'dotenv';
import Parser from 'rss-parser';

dotenv.config({ path: '.env.local' });

async function syncPodbean() {
  const client = getCliClient();
  const clientId = process.env.PODBEAN_CLIENT_ID;
  const clientSecret = process.env.PODBEAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Podbean credentials not found in .env.local');
    process.exit(1);
  }

  console.log('Fetching OAuth token...');
  const tokenResponse = await fetch('https://api.podbean.com/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!tokenResponse.ok) {
    console.error('Failed to get token:', await tokenResponse.text());
    process.exit(1);
  }

  const { access_token } = await tokenResponse.json();

  console.log('Fetching episodes from Podbean...');
  const episodesResponse = await fetch(`https://api.podbean.com/v1/episodes?access_token=${access_token}&limit=50`);
  
  if (!episodesResponse.ok) {
    console.error('Failed to fetch episodes:', await episodesResponse.text());
    process.exit(1);
  }

  const { episodes } = await episodesResponse.json();
  console.log(`Found ${episodes.length} episodes. Syncing to Sanity...`);

  const transaction = client.transaction();
  let count = 0;

  for (const ep of episodes) {
    const safeSlug = ep.title
      .replace(/[\/\\:\*\?"<>\|]/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();
      
    const epMatch = ep.title.match(/Ep(?:isode)?\s*(\d+)/i);
    const epNum = epMatch ? parseInt(epMatch[1]) : undefined;

    const pubDate = new Date(ep.publish_time * 1000).toISOString().split('T')[0];
    const plainExcerpt = ep.content ? ep.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...' : '';

    // Podbean is exclusively for Major Issues Podcast
    let showCategory = 'major-issues';

    const docId = `podcast-podbean-${ep.id}`;

    transaction.createIfNotExists({
      _id: docId,
      _type: 'podcast',
      title: ep.title,
      slug: { _type: 'slug', current: safeSlug },
      podbeanId: ep.id,
      category: showCategory,
      publishDate: pubDate,
      episodeNumber: epNum,
      audioUrl: ep.media_url,
      excerpt: plainExcerpt,
      featured: false,
    });
    count++;
  }

  await transaction.commit();
  console.log(`Successfully synced ${count} Major Issues episodes to Sanity.`);

  // ----------------------------------------------------
  // Sync Dirt Sheet Radio from Libsyn RSS
  // ----------------------------------------------------
  console.log('Fetching Dirt Sheet Radio from Libsyn RSS...');
  const parser = new Parser();
  const dsrFeed = await parser.parseURL('https://feeds.libsyn.com/302210/spotify');

  const dsrTransaction = client.transaction();
  let dsrCount = 0;

  for (const ep of dsrFeed.items) {
    if (!ep.title) continue;

    const safeSlug = ep.title
      .replace(/[\/\\:\*\?"<>\|]/g, '-')
      .replace(/\s+/g, '-')
      .toLowerCase();

    const epMatch = ep.title.match(/Ep(?:\.|isode)?\s*(\d+)/i);
    const epNum = epMatch ? parseInt(epMatch[1]) : undefined;

    const pubDate = ep.pubDate ? new Date(ep.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const plainExcerpt = ep.contentSnippet ? ep.contentSnippet.slice(0, 200) + '...' : '';

    const showCategory = 'dirt-sheet-radio';
    const docId = `podcast-libsyn-${ep.guid || safeSlug}`;

    dsrTransaction.createIfNotExists({
      _id: docId,
      _type: 'podcast',
      title: ep.title,
      slug: { _type: 'slug', current: safeSlug },
      category: showCategory,
      publishDate: pubDate,
      episodeNumber: epNum,
      audioUrl: ep.enclosure?.url || '',
      excerpt: plainExcerpt,
      featured: false,
    });
    dsrCount++;
  }

  await dsrTransaction.commit();
  console.log(`Successfully synced ${dsrCount} Dirt Sheet Radio episodes to Sanity.`);
}

syncPodbean().catch(console.error);
