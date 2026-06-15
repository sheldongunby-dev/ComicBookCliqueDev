import { getCliClient } from 'sanity/cli';

async function fixDsr() {
  const client = getCliClient();
  const dsrPodcasts = await client.fetch(`*[_type == 'podcast' && category == 'DSR Pod']`);
  
  console.log(`Found ${dsrPodcasts.length} DSR Pods to fix.`);
  
  const transaction = client.transaction();
  for (const doc of dsrPodcasts) {
    transaction.patch(doc._id, (p) => p.set({ category: 'dirt-sheet-radio' }));
  }
  
  await transaction.commit();
  console.log('Fixed categories!');
}

fixDsr().catch(console.error);
