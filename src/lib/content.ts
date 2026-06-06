import type { Article, Review } from "@/lib/schema/article.schema";
import type { PodcastEpisode } from "@/lib/schema/podcast.schema";
import { reader } from './keystatic';
import fs from 'fs';
import path from 'path';

// Helper to get raw markdown from .mdoc files (bypassing AST parsing)
function getRawMarkdown(collection: string, slug: string): string {
    try {
        const filePath = path.join(process.cwd(), 'src/content', collection, `${slug}.mdoc`);
        const content = fs.readFileSync(filePath, 'utf-8');
        // Split by --- to remove YAML frontmatter
        const parts = content.split('---');
        if (parts.length >= 3) {
            // Rejoin everything after the second '---'
            return parts.slice(2).join('---').trim();
        }
        return content;
    } catch (e) {
        console.error(`Error reading raw markdown for ${collection}/${slug}:`, e);
        return '';
    }
}

// ── Type union for all content ──
export type ContentItem = Article | Review;

// Mapping helpers to format Keystatic data to our schema
async function mapKeystaticItem(slug: string, entry: any, type: 'article' | 'news' | 'review' | 'podcast'): Promise<any> {
    const base = {
        id: slug,
        slug,
        type,
        title: entry.title,
        publishDate: entry.publishDate || new Date().toISOString().split('T')[0],
        category: entry.category || type,
        excerpt: entry.excerpt || '',
        featured: entry.featured || false,
        author: { name: entry.author_name || 'ComicBook Clique' },
        heroImage: entry.heroImage_url ? { url: entry.heroImage_url, alt: entry.heroImage_alt || entry.title } : undefined,
    };

    if (type === 'review') {
        return { ...base, rating: entry.rating || undefined };
    }
    
    if (type === 'podcast') {
        return { 
            ...base, 
            episodeNumber: entry.episodeNumber || 0,
            spotifyUrl: entry.spotifyUrl || undefined
        };
    }

    return base;
}

// ── Reviews ──
export async function getReviews(): Promise<Review[]> {
    const raw = await reader.collections.reviews.all();
    return Promise.all(raw.map(r => mapKeystaticItem(r.slug, r.entry, 'review')));
}

export async function getFeaturedReviews(): Promise<Review[]> {
    const all = await getReviews();
    const featured = all.filter((r) => r.featured);
    return featured.length > 0 ? featured.slice(0, 6) : all.slice(0, 6);
}

export async function getReviewBySlug(slug: string): Promise<Review | undefined> {
    const entry = await reader.collections.reviews.read(slug);
    if (!entry) return undefined;
    const mapped = await mapKeystaticItem(slug, entry, 'review');
    mapped.rawMarkdoc = getRawMarkdown('reviews', slug);
    return mapped;
}

// ── Articles / Features ──
export async function getArticles(): Promise<Article[]> {
    const raw = await reader.collections.articles.all();
    return Promise.all(raw.map(a => mapKeystaticItem(a.slug, a.entry, 'article')));
}

export async function getFeaturedArticles(): Promise<Article[]> {
    const all = await getArticles();
    return all.filter((a) => a.featured).slice(0, 4);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
    const entry = await reader.collections.articles.read(slug);
    if (!entry) return undefined;
    const mapped = await mapKeystaticItem(slug, entry, 'article');
    mapped.rawMarkdoc = getRawMarkdown('articles', slug);
    return mapped;
}

// ── News ──
export async function getNews(): Promise<ContentItem[]> {
    const raw = await reader.collections.news.all();
    return Promise.all(raw.map(n => mapKeystaticItem(n.slug, n.entry, 'news')));
}

export async function getLatestNews(count = 6): Promise<ContentItem[]> {
    const news = await getNews();
    return news.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, count);
}

export async function getNewsBySlug(slug: string): Promise<ContentItem | undefined> {
    const entry = await reader.collections.news.read(slug);
    if (!entry) return undefined;
    const mapped = await mapKeystaticItem(slug, entry, 'news');
    mapped.rawMarkdoc = getRawMarkdown('news', slug);
    return mapped;
}

// ── Podcast ──
export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
    const raw = await reader.collections.podcasts.all();
    return Promise.all(raw.map(p => mapKeystaticItem(p.slug, p.entry, 'podcast')));
}

export async function getLatestEpisode(): Promise<PodcastEpisode | undefined> {
    const episodes = await getPodcastEpisodes();
    return episodes.sort((a, b) => b.episodeNumber - a.episodeNumber)[0];
}

export async function getEpisodeBySlug(slug: string): Promise<PodcastEpisode | undefined> {
    const entry = await reader.collections.podcasts.read(slug);
    if (!entry) return undefined;
    const mapped = await mapKeystaticItem(slug, entry, 'podcast');
    mapped.rawMarkdoc = getRawMarkdown('podcasts', slug);
    return mapped;
}

// ── Authors ──
export function getAuthors() {
    return [];
}
