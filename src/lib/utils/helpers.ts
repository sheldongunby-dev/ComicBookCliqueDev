import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

export function getAccentClass(color: "crimson" | "gold" | "cyan" | "purple"): string {
    const map = {
        crimson: "text-cbc-crimson",
        gold: "text-cbc-gold",
        cyan: "text-cbc-cyan",
        purple: "text-cbc-purple",
    };
    return map[color];
}

export function getAccentBgClass(color: "crimson" | "gold" | "cyan" | "purple"): string {
    const map = {
        crimson: "bg-cbc-crimson",
        gold: "bg-cbc-gold",
        cyan: "bg-cbc-cyan",
        purple: "bg-cbc-purple",
    };
    return map[color];
}
