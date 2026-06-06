import { z } from "zod";
import { AuthorSchema, MediaAssetSchema } from "./brand.schema";

const BaseContentSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    canonicalUrl: z.string().url(),
    section: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    author: AuthorSchema.optional(),
    publishDate: z.string(),
    updateDate: z.string().optional(),
    excerpt: z.string().optional(),
    bodyHtml: z.string().optional(),
    heroImage: MediaAssetSchema.optional(),
    galleryImages: z.array(MediaAssetSchema).default([]),
    relatedLinks: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    ogImage: z.string().optional(),
});

export const ArticleSchema = BaseContentSchema.extend({
    type: z.literal("article"),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
});

export const ReviewSchema = BaseContentSchema.extend({
    type: z.literal("review"),
    featured: z.boolean().default(false),
    rating: z.number().min(0).max(10).optional(),
    publisher: z.string().optional(),
    issueNumber: z.string().optional(),
    writer: z.string().optional(),
    artist: z.string().optional(),
    verdict: z.string().optional(),
});

export const NewsPostSchema = BaseContentSchema.extend({
    type: z.literal("news"),
    breaking: z.boolean().default(false),
    source: z.string().optional(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type NewsPost = z.infer<typeof NewsPostSchema>;
