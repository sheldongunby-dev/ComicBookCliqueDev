"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDateShort, cn } from "@/lib/utils/helpers";
import type { Review } from "@/lib/schema/article.schema";

interface ReviewCardProps {
    review: Review;
    variant?: "default" | "featured" | "compact";
    className?: string;
}

function RatingBadge({ rating }: { rating: number }) {
    const color =
        rating >= 9 ? "text-cbc-gold bg-cbc-gold/10 border-cbc-gold/30" :
            rating >= 7.5 ? "text-cbc-cyan bg-cbc-cyan/10 border-cbc-cyan/30" :
                rating >= 6 ? "text-cbc-white bg-cbc-surface border-cbc-border" :
                    "text-cbc-muted bg-cbc-surface border-cbc-border";

    return (
        <div className={cn(
            "inline-flex items-end gap-0.5 px-2 py-1 border rounded-cbc font-mono text-xs font-bold",
            color
        )}>
            <span className="text-base leading-none">{rating.toFixed(1)}</span>
            <span className="text-[10px] opacity-60 mb-px">/10</span>
        </div>
    );
}

export function ReviewCard({ review, variant = "default", className }: ReviewCardProps) {
    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";
    
    // Determine card hover color based on rating
    const ratingValue = review.rating ?? 0;
    const hoverClass = 
        ratingValue >= 9 ? "card-cinematic-gold" :
        ratingValue >= 7.5 ? "card-cinematic-cyan" :
        ratingValue >= 6 ? "card-cinematic-purple" : 
        "";

    return (
        <motion.article
            className={cn(
                "group relative card-cinematic overflow-hidden",
                hoverClass,
                isFeatured && "lg:col-span-2",
                className
            )}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/reviews/${review.slug}`} className="block focus-cbc" tabIndex={0}>
                {/* Hero image */}
                <div className={cn(
                    "relative overflow-hidden bg-cbc-charcoal",
                    isCompact ? "aspect-[16/7]" : isFeatured ? "aspect-[21/9]" : "aspect-[4/3]"
                )}>
                    {review.heroImage ? (
                        <Image
                            src={review.heroImage.url}
                            alt={review.heroImage.alt || review.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-cbc-charcoal to-cbc-surface halftone" />
                    )}

                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/80 via-transparent to-transparent" />

                    {/* Rating badge */}
                    {review.rating !== undefined && (
                        <div className="absolute top-3 right-3">
                            <RatingBadge rating={review.rating} />
                        </div>
                    )}

                    {/* Section tag */}
                    <div className="absolute top-3 left-3">
                        <span className="tag-chip bg-cbc-crimson/90 text-white">
                            Review
                        </span>
                    </div>

                    {/* Publisher badge */}
                    {review.publisher && (
                        <div className="absolute bottom-3 left-3">
                            <span className="tag-chip bg-cbc-black/70 border border-cbc-border/50 text-cbc-muted backdrop-blur-sm">
                                {review.publisher}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={cn("p-4", isFeatured && "p-6")}>
                    {/* Tags */}
                    {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {review.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="tag-chip bg-cbc-elevated text-cbc-muted border border-cbc-border text-[10px]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className={cn(
                        "font-heading font-semibold text-cbc-white line-clamp-2 group-hover:text-cbc-crimson transition-colors duration-300 leading-tight mb-2",
                        isFeatured ? "text-xl" : "text-base"
                    )}>
                        {review.title}
                    </h3>

                    {/* Excerpt */}
                    {!isCompact && review.excerpt && (
                        <p className="text-sm text-cbc-muted line-clamp-2 leading-relaxed mb-3">
                            {review.excerpt}
                        </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-cbc-faint">
                            {review.author && (
                                <span className="font-label font-medium text-cbc-muted">
                                    {review.author.name}
                                </span>
                            )}
                            {review.publishDate && (
                                <>
                                    <span>·</span>
                                    <time dateTime={review.publishDate}>
                                        {formatDateShort(review.publishDate)}
                                    </time>
                                </>
                            )}
                        </div>
                        <span className="text-xs text-cbc-crimson font-label font-semibold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Read →
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
