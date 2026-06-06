"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDateShort, cn } from "@/lib/utils/helpers";

// Inline minimal news card to avoid circular deps
interface NewsItem {
    id: string;
    title: string;
    slug: string;
    category: string;
    author?: { name: string };
    publishDate?: string;
    excerpt?: string;
    heroImage?: { url: string; alt?: string };
    breaking?: boolean;
    tags?: string[];
}

interface NewsCardProps {
    item: NewsItem;
    section?: string;
    className?: string;
}

export function NewsCard({ item, section = "news", className }: NewsCardProps) {
    const href = `/${section}/${item.slug}`;

    return (
        <motion.article
            className={cn("group card-editorial overflow-hidden", className)}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={href} className="flex gap-4 p-4 focus-cbc">
                {item.heroImage && (
                    <div className="relative w-20 h-16 shrink-0 rounded-cbc overflow-hidden bg-cbc-charcoal">
                        <Image
                            src={item.heroImage.url}
                            alt={item.heroImage.alt || item.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="80px"
                        />
                    </div>
                )}
                <div className="flex flex-col justify-between min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {item.breaking && (
                            <span className="tag-chip bg-cbc-crimson/90 text-white text-[9px]">
                                Breaking
                            </span>
                        )}
                        {item.tags && item.tags[0] && (
                            <span className="tag-chip bg-cbc-elevated border border-cbc-border text-cbc-muted text-[9px]">
                                {item.tags[0]}
                            </span>
                        )}
                    </div>
                    <h4 className="text-sm font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-gold transition-colors duration-200">
                        {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-cbc-faint font-label">
                        {item.author && <span className="text-cbc-muted font-medium">{item.author.name}</span>}
                        {item.publishDate && (
                            <>
                                <span>·</span>
                                <time dateTime={item.publishDate}>{formatDateShort(item.publishDate)}</time>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
