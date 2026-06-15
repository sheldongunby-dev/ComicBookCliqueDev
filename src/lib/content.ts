import type { Article, Review } from '@/lib/schema/article.schema'
import type { PodcastEpisode } from '@/lib/schema/podcast.schema'
import { sanityClient } from '@/sanity/client'
import {
  articlesQuery,
  featuredArticlesQuery,
  articleBySlugQuery,
  articleSlugsQuery,
  newsQuery,
  latestNewsQuery,
  newsBySlugQuery,
  newsSlugsQuery,
  reviewsQuery,
  featuredReviewsQuery,
  reviewBySlugQuery,
  reviewSlugsQuery,
  podcastsQuery,
  latestEpisodeQuery,
  podcastBySlugQuery,
  podcastSlugsQuery,
  podcastsByCategoryQuery,
  latestEpisodeByCategoryQuery,
  podcastSlugsByCategoryQuery,
  podcastReviewsQuery,
  homepageFeaturedQuery,
  siteSettingsQuery,
} from '@/lib/sanityQueries'

// ── Type union for all content ──
export type ContentItem = Article | Review

// ─────────────────────────────────────────────
// ARTICLES / FEATURES
// ─────────────────────────────────────────────

export async function getArticles(): Promise<Article[]> {
  const data = await sanityClient.fetch(articlesQuery, {}, { next: { revalidate: 60 } })
  return (data ?? []).map(normalizeItem('article'))
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const data = await sanityClient.fetch(featuredArticlesQuery, {}, { next: { revalidate: 60 } })
  return (data ?? []).map(normalizeItem('article'))
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const data = await sanityClient.fetch(articleBySlugQuery, { slug }, { next: { revalidate: 60 } })
  if (!data) return undefined
  return normalizeItem('article')(data)
}

export async function getArticleSlugs(): Promise<string[]> {
  const data = await sanityClient.fetch(articleSlugsQuery, {}, { next: { revalidate: 300 } })
  return (data ?? []).map((d: any) => d.slug).filter(Boolean)
}

// ─────────────────────────────────────────────
// BREAKING NEWS
// ─────────────────────────────────────────────

export async function getNews(): Promise<ContentItem[]> {
  const data = await sanityClient.fetch(newsQuery, {}, { next: { revalidate: 30 } })
  return (data ?? []).map(normalizeItem('news'))
}

export async function getLatestNews(count = 6): Promise<ContentItem[]> {
  const data = await sanityClient.fetch(latestNewsQuery, { count }, { next: { revalidate: 30 } })
  return (data ?? []).map(normalizeItem('news'))
}

export async function getNewsBySlug(slug: string): Promise<ContentItem | undefined> {
  const data = await sanityClient.fetch(newsBySlugQuery, { slug }, { next: { revalidate: 30 } })
  if (!data) return undefined
  return normalizeItem('news')(data)
}

export async function getNewsSlugs(): Promise<string[]> {
  const data = await sanityClient.fetch(newsSlugsQuery, {}, { next: { revalidate: 300 } })
  return (data ?? []).map((d: any) => d.slug).filter(Boolean)
}

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

export async function getReviews(): Promise<Review[]> {
  const data = await sanityClient.fetch(reviewsQuery, {}, { next: { revalidate: 60 } })
  return (data ?? []).map(normalizeItem('review'))
}

export async function getFeaturedReviews(): Promise<Review[]> {
  const all = await sanityClient.fetch(featuredReviewsQuery, {}, { next: { revalidate: 60 } })
  const featured = (all ?? []).map(normalizeItem('review'))
  return featured.length > 0 ? featured : (await getReviews()).slice(0, 6)
}

export async function getReviewBySlug(slug: string): Promise<Review | undefined> {
  const data = await sanityClient.fetch(reviewBySlugQuery, { slug }, { next: { revalidate: 60 } })
  if (!data) return undefined
  return normalizeItem('review')(data)
}

export async function getReviewSlugs(): Promise<string[]> {
  const data = await sanityClient.fetch(reviewSlugsQuery, {}, { next: { revalidate: 300 } })
  return (data ?? []).map((d: any) => d.slug).filter(Boolean)
}

// ─────────────────────────────────────────────
// PODCASTS
// ─────────────────────────────────────────────

export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const data = await sanityClient.fetch(podcastsQuery, {}, { next: { revalidate: 60 } })
  return (data ?? []).map(normalizeItem('podcast'))
}

export async function getLatestEpisode(): Promise<PodcastEpisode | undefined> {
  const data = await sanityClient.fetch(latestEpisodeQuery, {}, { next: { revalidate: 60 } })
  if (!data) return undefined
  return normalizeItem('podcast')(data)
}

export async function getEpisodeBySlug(slug: string): Promise<PodcastEpisode | undefined> {
  const data = await sanityClient.fetch(podcastBySlugQuery, { slug }, { next: { revalidate: 60 } })
  if (!data) return undefined
  return normalizeItem('podcast')(data)
}

export async function getPodcastSlugs(): Promise<string[]> {
  const data = await sanityClient.fetch(podcastSlugsQuery, {}, { next: { revalidate: 300 } })
  return (data ?? []).map((d: any) => d.slug).filter(Boolean)
}

// ── Category-filtered podcast fetchers ──

export async function getPodcastEpisodesByCategory(category: string): Promise<PodcastEpisode[]> {
  const data = await sanityClient.fetch(podcastsByCategoryQuery, { category }, { next: { revalidate: 60 } })
  return (data ?? []).map(normalizeItem('podcast'))
}

export async function getLatestEpisodeByCategory(category: string): Promise<PodcastEpisode | undefined> {
  const data = await sanityClient.fetch(latestEpisodeByCategoryQuery, { category }, { next: { revalidate: 60 } })
  if (!data) return undefined
  return normalizeItem('podcast')(data)
}

export async function getPodcastSlugsByCategory(category: string): Promise<string[]> {
  const data = await sanityClient.fetch(podcastSlugsByCategoryQuery, { category }, { next: { revalidate: 300 } })
  return (data ?? []).map((d: any) => d.slug).filter(Boolean)
}

// ─────────────────────────────────────────────
// PODCAST REVIEWS
// ─────────────────────────────────────────────

export async function getPodcastReviews() {
  const data = await sanityClient.fetch(podcastReviewsQuery, {}, { next: { revalidate: 60 } })
  return data ?? []
}

// ─────────────────────────────────────────────
// HOMEPAGE — combined single fetch
// ─────────────────────────────────────────────

export async function getHomepageData() {
  return sanityClient.fetch(homepageFeaturedQuery, {}, { next: { revalidate: 60 } })
}

export async function getSiteSettings() {
  return sanityClient.fetch(siteSettingsQuery, {}, { next: { revalidate: 60 } })
}

// ─────────────────────────────────────────────
// AUTHORS
// ─────────────────────────────────────────────

export function getAuthors() {
  // Author profiles are managed in Sanity Studio — no static fallback needed
  return []
}

// ─────────────────────────────────────────────
// INTERNAL: data normalizer
// Maps Sanity document shape → app schema shape
// ─────────────────────────────────────────────

function normalizeItem(type: string) {
  return (doc: any): any => {
    const base = {
      _id: doc._id,
      id: doc.slug ?? doc.id,
      slug: doc.slug ?? doc.id,
      type,
      title: doc.title ?? doc.showName ?? '',
      publishDate: doc.publishDate ?? new Date().toISOString().split('T')[0],
      category: doc.category ?? type,
      excerpt: doc.excerpt ?? '',
      featured: doc.featured ?? false,
      tags: doc.tags ?? [],
      author: doc.author ?? { name: 'ComicBook Clique', avatar: null },
      heroImage: doc.heroImage?.url
        ? {
            url: doc.heroImage.url,
            alt: doc.heroImage.alt ?? doc.title ?? '',
            caption: doc.heroImage.caption ?? undefined,
            hotspot: doc.heroImage.hotspot,
            crop: doc.heroImage.crop,
          }
        : undefined,
      // Portable text content (for detail pages)
      content: doc.content ?? null,
      // SEO
      seoTitle: doc.seoTitle ?? undefined,
      seoDescription: doc.seoDescription ?? undefined,
      ogImage: doc.ogImage ?? undefined,
    }

    if (type === 'review') {
      return {
        ...base,
        rating: doc.rating ?? undefined,
        verdict: doc.verdict ?? undefined,
        pros: doc.pros ?? [],
        cons: doc.cons ?? [],
      }
    }

    if (type === 'podcast') {
      return {
        ...base,
        episodeNumber: doc.episodeNumber ?? 0,
        spotifyUrl: doc.spotifyUrl ?? undefined,
        appleUrl: doc.appleUrl ?? undefined,
        youtubeUrl: doc.youtubeUrl ?? undefined,
        duration: doc.duration ?? undefined,
      }
    }

    if (type === 'interview') {
      return {
        ...base,
        interviewee: doc.interviewee ?? undefined,
        intervieweeRole: doc.intervieweeRole ?? undefined,
      }
    }

    return base
  }
}
