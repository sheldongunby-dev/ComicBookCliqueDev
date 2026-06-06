import { z } from "zod";
import { MediaAssetSchema } from "./brand.schema";

export const PodcastEpisodeSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    episodeNumber: z.number(),
    canonicalUrl: z.string().url(),
    publishDate: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    heroImage: MediaAssetSchema.optional(),
    bodyHtml: z.string().optional(),
    embedCode: z.string().optional(),
    spotifyUrl: z.string().url().optional(),
    appleUrl: z.string().url().optional(),
    youtubeUrl: z.string().url().optional(),
    libsynUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    hosts: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    metaDescription: z.string().optional(),
});

export const MerchItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    price: z.string().optional(),
    image: MediaAssetSchema.optional(),
    url: z.string().url(),
    store: z.enum(["teepublic", "own", "dsr"]),
    brand: z.enum(["cbc", "dsr"]),
    tags: z.array(z.string()).default([]),
});

export const SocialChannelSchema = z.object({
    platform: z.enum(["facebook", "twitter", "instagram", "youtube", "spotify", "libsyn", "tiktok"]),
    url: z.string().url(),
    handle: z.string(),
    brand: z.enum(["cbc", "dsr"]),
});

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>;
export type MerchItem = z.infer<typeof MerchItemSchema>;
export type SocialChannel = z.infer<typeof SocialChannelSchema>;
