import { z } from "zod";

export const AuthorSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    social: z.object({
        twitter: z.string().optional(),
        instagram: z.string().optional(),
    }).optional(),
});

export const CategorySchema = z.object({
    id: z.string(),
    label: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    color: z.enum(["crimson", "gold", "cyan", "purple"]).default("crimson"),
    icon: z.string().optional(),
});

export const TagSchema = z.object({
    id: z.string(),
    label: z.string(),
    slug: z.string(),
    count: z.number().default(0),
});

export const MediaAssetSchema = z.object({
    url: z.string(),
    alt: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    type: z.enum(["image", "video", "audio"]).default("image"),
});

export type Author = z.infer<typeof AuthorSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Tag = z.infer<typeof TagSchema>;
export type MediaAsset = z.infer<typeof MediaAssetSchema>;
