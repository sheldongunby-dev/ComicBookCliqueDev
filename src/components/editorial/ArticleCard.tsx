"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDateShort, cn } from "@/lib/utils/helpers";
import type { Article } from "@/lib/schema/article.schema";

interface ArticleCardProps {
    article: Article;
    variant?: "default" | "featured" | "compact" | "horizontal";
    className?: string;
}

export function ArticleCard({ article, variant = "default", className }: ArticleCardProps) {
    const isFeatured = variant === "featured";
    const isHorizontal = variant === "horizontal";
    const isCompact = variant === "compact";

    if (isHorizontal) {
        return (
            <motion.article
                className={cn("group flex gap-4 card-cinematic card-cinematic-cyan p-4 overflow-hidden", className)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
                <Link href={`/features/${article.slug}`} className="flex gap-4 w-full focus-cbc">
                    {article.heroImage && (
                        <div className="relative w-24 h-20 shrink-0 rounded-cbc overflow-hidden bg-cbc-charcoal">
                            <Image
                                src={article.heroImage.url}
                                alt={article.heroImage.alt || article.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="96px"
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-between min-w-0">
                        <h4 className="text-sm font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-cyan transition-colors duration-200">
                            {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-cbc-faint">
                            {article.author && <span className="text-cbc-muted">{article.author.name}</span>}
                            {article.publishDate && (
                                <time dateTime={article.publishDate}>{formatDateShort(article.publishDate)}</time>
                            )}
                            {article.readingTime && <span>· {article.readingTime} min read</span>}
                        </div>
                    </div>
                </Link>
            </motion.article>
        );
    }

    return (
        <motion.article
            className={cn(
                "group relative card-cinematic card-cinematic-cyan overflow-hidden",
                isFeatured && "lg:col-span-2",
                className
            )}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/features/${article.slug}`} className="block focus-cbc">
                {/* Hero image */}
                <div className={cn(
                    "relative overflow-hidden bg-cbc-charcoal",
                    isCompact ? "aspect-[16/7]" : isFeatured ? "aspect-[21/9]" : "aspect-[16/9]"
                )}>
                    {article.heroImage ? (
                        <Image
                            src={article.heroImage.url}
                            alt={article.heroImage.alt || article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-cbc-charcoal via-cbc-surface to-cbc-charcoal halftone" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/80 via-transparent to-transparent" />

                    {/* Section tag */}
                    <div className="absolute top-3 left-3">
                        <span className="tag-chip bg-cbc-cyan/90 text-cbc-black">
                            Feature
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className={cn("p-4", isFeatured && "p-6")}>
                    {/* Author + date */}
                    {(article.author || article.publishDate) && (
                        <div className="flex items-center gap-2 text-xs text-cbc-muted mb-2 font-label">
                            {article.author && <span className="font-semibold">{article.author.name}</span>}
                            {article.publishDate && (
                                <>
                                    <span className="text-cbc-faint">·</span>
                                    <time dateTime={article.publishDate} className="text-cbc-faint">
                                        {formatDateShort(article.publishDate)}
                                    </time>
                                </>
                            )}
                            {article.readingTime && (
                                <>
                                    <span className="text-cbc-faint">·</span>
                                    <span className="text-cbc-faint">{article.readingTime} min</span>
                                </>
                            )}
                        </div>
                    )}

                    <h3 className={cn(
                        "font-heading font-semibold text-cbc-white line-clamp-2 group-hover:text-cbc-cyan transition-colors duration-300 leading-tight mb-2",
                        isFeatured ? "text-xl" : "text-base"
                    )}>
                        {article.title}
                    </h3>

                    {!isCompact && article.excerpt && (
                        <p className="text-sm text-cbc-muted line-clamp-2 leading-relaxed">
                            {article.excerpt}
                        </p>
                    )}
                </div>
            </Link>
        </motion.article>
    );
}
