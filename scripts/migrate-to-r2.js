const { createClient } = require('@sanity/client');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2023-01-01',
});

// Initialize Cloudflare R2 Client
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

async function migrateImagesToR2() {
  console.log('Starting migration to Cloudflare R2...');

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
    console.error('Missing Cloudflare R2 credentials in .env.local. Aborting.');
    process.exit(1);
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('Missing SANITY_API_TOKEN in .env.local. Aborting.');
    process.exit(1);
  }

  // Find all documents with a _heroImageUrl (the old Squarespace fallback)
  // that haven't been natively migrated yet.
  const query = `*[_type in ["article", "news", "review", "podcast", "podcastReview", "interview"] && defined(_heroImageUrl)] {
    _id,
    _type,
    title,
    _heroImageUrl
  }`;

  const documents = await sanityClient.fetch(query);
  console.log(`Found ${documents.length} documents to migrate.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    console.log(`[${i + 1}/${documents.length}] Processing ${doc._id} ("${doc.title}")`);

    try {
      // 1. Fetch the image from Squarespace
      const imageResponse = await fetch(doc._heroImageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: HTTP ${imageResponse.status}`);
      }

      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Generate a unique filename and upload to R2
      const urlObject = new URL(doc._heroImageUrl);
      // Try to extract an extension, default to jpg
      let ext = urlObject.pathname.split('.').pop();
      if (!['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext?.toLowerCase() || '')) {
        ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      }

      const uniqueId = crypto.randomUUID();
      const datePrefix = new Date().toISOString().split('T')[0];
      const key = `migrated/${datePrefix}/${uniqueId}.${ext}`;

      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await s3Client.send(command);

      // 3. Format the final public URL
      const baseUrl = R2_PUBLIC_URL?.replace(/\/$/, '') || `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
      const publicUrl = `${baseUrl}/${key}`;

      // 4. Update the document in Sanity
      await sanityClient.patch(doc._id)
        .set({
          heroImage: {
            _type: 'r2-image',
            url: publicUrl,
            alt: doc.title
          }
        })
        .unset(['_heroImageUrl']) // Remove the old fallback URL
        .commit();

      console.log(`✅ Success: Uploaded to R2 and updated Sanity`);
      successCount++;

      // Small delay to prevent rate-limiting on Squarespace/Sanity
      await new Promise((resolve) => setTimeout(resolve, 200));

    } catch (error) {
      console.error(`❌ Failed to process ${doc._id}:`, error.message);
      failCount++;
    }
  }

  console.log(`\nMigration Complete!`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Failed to migrate: ${failCount}`);
}

migrateImagesToR2().catch((err) => {
  console.error('Migration crashed:', err);
  process.exit(1);
});
