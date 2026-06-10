import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

/**
 * Sanity client for server-side data fetching.
 * Uses the CDN for published content (fast), bypasses it for draft previews.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Helper: build a Sanity image URL from a reference object.
 * Usage: urlFor(heroImage).width(800).url()
 */
export { default as imageUrlBuilder } from '@sanity/image-url'
