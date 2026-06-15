import { getCliClient } from 'sanity/cli';

async function dedupe() {
  const client = getCliClient();
  const allPodcasts = await client.fetch(`*[_type == 'podcast']{ _id, slug, podbeanId }`);
  
  const slugs = new Map();
  const toDelete = [];

  for (const pod of allPodcasts) {
    if (!pod.slug?.current) continue;
    const s = pod.slug.current;
    
    if (!slugs.has(s)) {
      slugs.set(s, []);
    }
    slugs.get(s).push(pod);
  }

  for (const [slug, pods] of slugs.entries()) {
    if (pods.length > 1) {
      // Find the one without podbeanId and mark for deletion
      const oldPod = pods.find((p: any) => !p.podbeanId);
      if (oldPod) {
        toDelete.push(oldPod._id);
      } else {
        // if both have podbeanId, just delete the second one
        toDelete.push(pods[1]._id);
      }
    }
  }

  console.log(`Found ${toDelete.length} duplicates to delete.`);
  
  if (toDelete.length > 0) {
    const transaction = client.transaction();
    for (const id of toDelete) {
      transaction.delete(id);
    }
    await transaction.commit();
    console.log('Duplicates deleted!');
  }
}

dedupe().catch(console.error);
