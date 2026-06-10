import { groq } from 'next-sanity'

// ── Author fragment (reused in all content queries) ──
const authorFragment = groq`
  "author": coalesce(
    author->{ name, "avatar": avatar.asset->url, role },
    { "name": author_name, "avatar": null, "role": null }
  )
`

// ── Hero image fragment ──
const heroImageFragment = groq`
  "heroImage": {
    "url": coalesce(heroImage.asset->url, _heroImageUrl),
    "alt": coalesce(heroImage.alt, _heroImageAlt),
    "caption": heroImage.caption,
    "hotspot": heroImage.hotspot,
    "crop": heroImage.crop
  }
`

// ─────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────

export const articlesQuery = groq`
  *[_type == "article"] | order(publishDate desc) {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    tags,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const featuredArticlesQuery = groq`
  *[_type == "article" && featured == true] | order(publishDate desc)[0...4] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    tags,
    content,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const articleSlugsQuery = groq`
  *[_type == "article"] { "slug": slug.current }
`

// ─────────────────────────────────────────────
// NEWS
// ─────────────────────────────────────────────

export const newsQuery = groq`
  *[_type == "news"] | order(publishDate desc) {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    tags,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const latestNewsQuery = groq`
  *[_type == "news"] | order(publishDate desc)[0...$count] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const newsBySlugQuery = groq`
  *[_type == "news" && slug.current == $slug][0] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    content,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const newsSlugsQuery = groq`
  *[_type == "news"] { "slug": slug.current }
`

// ─────────────────────────────────────────────
// REVIEWS
// ─────────────────────────────────────────────

export const reviewsQuery = groq`
  *[_type == "review"] | order(publishDate desc) {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    rating,
    verdict,
    tags,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const featuredReviewsQuery = groq`
  *[_type == "review" && featured == true] | order(publishDate desc)[0...6] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    rating,
    verdict,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const reviewBySlugQuery = groq`
  *[_type == "review" && slug.current == $slug][0] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    rating,
    verdict,
    pros,
    cons,
    content,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const reviewSlugsQuery = groq`
  *[_type == "review"] { "slug": slug.current }
`

// ─────────────────────────────────────────────
// PODCASTS
// ─────────────────────────────────────────────

export const podcastsQuery = groq`
  *[_type == "podcast"] | order(episodeNumber desc, publishDate desc) {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    episodeNumber,
    spotifyUrl,
    appleUrl,
    youtubeUrl,
    duration,
    tags,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const latestEpisodeQuery = groq`
  *[_type == "podcast"] | order(episodeNumber desc, publishDate desc)[0] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    episodeNumber,
    spotifyUrl,
    appleUrl,
    youtubeUrl,
    duration,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const podcastBySlugQuery = groq`
  *[_type == "podcast" && slug.current == $slug][0] {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    title,
    publishDate,
    category,
    excerpt,
    featured,
    episodeNumber,
    spotifyUrl,
    appleUrl,
    youtubeUrl,
    duration,
    content,
    seoTitle,
    seoDescription,
    "ogImage": ogImage.asset->url,
    ${authorFragment},
    ${heroImageFragment}
  }
`

export const podcastSlugsQuery = groq`
  *[_type == "podcast"] { "slug": slug.current }
`

// ─────────────────────────────────────────────
// PODCAST REVIEWS
// ─────────────────────────────────────────────

export const podcastReviewsQuery = groq`
  *[_type == "podcastReview"] | order(publishDate desc) {
    _id,
    "type": _type,
    "id": slug.current,
    "slug": slug.current,
    "title": showName,
    showName,
    episodeTitle,
    publishDate,
    category,
    excerpt,
    featured,
    rating,
    verdict,
    badge,
    ${authorFragment},
    ${heroImageFragment}
  }
`

// ─────────────────────────────────────────────
// HOMEPAGE — combined featured content
// ─────────────────────────────────────────────

export const homepageFeaturedQuery = groq`
  {
    "featuredArticles": *[_type == "article" && featured == true] | order(publishDate desc)[0...4] {
      _id, "id": slug.current, "slug": slug.current, "type": "article",
      title, publishDate, category, excerpt, ${heroImageFragment}
    },
    "latestNews": *[_type == "news"] | order(publishDate desc)[0...8] {
      _id, "id": slug.current, "slug": slug.current, "type": "news",
      title, publishDate, category, excerpt, ${heroImageFragment}
    },
    "featuredReviews": *[_type == "review" && featured == true] | order(publishDate desc)[0...6] {
      _id, "id": slug.current, "slug": slug.current, "type": "review",
      title, publishDate, category, excerpt, rating, verdict, ${heroImageFragment}
    },
    "latestEpisode": *[_type == "podcast"] | order(episodeNumber desc)[0] {
      _id, "id": slug.current, "slug": slug.current, "type": "podcast",
      title, publishDate, episodeNumber, spotifyUrl, duration, excerpt, ${heroImageFragment}
    }
  }
`

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    showHero,
    manualHeroArticles[]-> {
      _id, "type": _type, "id": slug.current, "slug": slug.current,
      title, publishDate, category, excerpt, ${heroImageFragment}
    },
    merchMainLink,
    merchItems[] {
      title, url, "image": image.asset->url, hoverColor
    },
    sponsorText,
    sponsorEmail
  }
`
