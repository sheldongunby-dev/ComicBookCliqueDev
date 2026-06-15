import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

// Create a Sanity client that has write access
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security check so not anyone can trigger the sync
    if (secret !== process.env.SYNC_SECRET && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.PODBEAN_CLIENT_ID || !process.env.PODBEAN_CLIENT_SECRET) {
      return NextResponse.json({ error: 'Podbean credentials not configured in environment' }, { status: 500 });
    }

    // 1. Get Podbean OAuth Token
    const tokenResponse = await fetch('https://api.podbean.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.PODBEAN_CLIENT_ID,
        client_secret: process.env.PODBEAN_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error('Podbean token error:', err);
      return NextResponse.json({ error: 'Failed to authenticate with Podbean' }, { status: 500 });
    }

    const { access_token } = await tokenResponse.json();

    // 2. Fetch Episodes from Podbean
    const episodesResponse = await fetch(`https://api.podbean.com/v1/episodes?access_token=${access_token}&limit=50`);
    
    if (!episodesResponse.ok) {
      const err = await episodesResponse.text();
      console.error('Podbean episodes error:', err);
      return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
    }

    const { episodes } = await episodesResponse.json();

    // 3. Sync to Sanity
    const transaction = writeClient.transaction();
    let syncedCount = 0;

    for (const ep of episodes) {
      // Basic formatting
      const safeSlug = ep.title
        .replace(/[\/\\:\*\?"<>\|]/g, '-')
        .replace(/\s+/g, '-')
        .toLowerCase();
        
      // Try to extract episode number from title (e.g., "Ep 45")
      const epMatch = ep.title.match(/Ep(?:isode)?\s*(\d+)/i);
      const epNum = epMatch ? parseInt(epMatch[1]) : undefined;

      // Convert UNIX timestamp to YYYY-MM-DD
      const pubDate = new Date(ep.publish_time * 1000).toISOString().split('T')[0];

      // Convert HTML description to plain text for excerpt (very basic strip, if complex we might need a parser, but this is okay for a quick excerpt)
      const plainExcerpt = ep.content ? ep.content.replace(/<[^>]+>/g, '').slice(0, 200) + '...' : '';

      // Determine category from title
      let showCategory = 'major-issues'; // Default fallback
      const lowerTitle = ep.title.toLowerCase();
      
      if (lowerTitle.includes('dirt sheet')) {
        showCategory = 'dirt-sheet-radio';
      } else if (lowerTitle.includes('gaming')) {
        showCategory = 'gaming';
      } else if (lowerTitle.includes('pop culture')) {
        showCategory = 'pop-culture';
      }

      // Prepare Sanity Document
      // We use the Podbean ID as part of the sanity document ID to easily upsert
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
        // Optional: map the content to PortableText if needed, 
        // for now we set it as plain text in excerpt. If rich text is heavily used, 
        // we'd need to convert HTML to PortableText blocks.
        // We'll leave content empty to be populated manually or add a basic string.
        featured: false,
      });

      // If we wanted to constantly update it instead of just createIfNotExists, 
      // we'd use createOrReplace, but we don't want to overwrite manual Sanity edits (like adding cover art or rich text).
      
      syncedCount++;
    }

    await transaction.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${syncedCount} episodes.`,
    });

  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
