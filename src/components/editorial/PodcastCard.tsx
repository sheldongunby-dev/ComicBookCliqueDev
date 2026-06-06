"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { formatDateShort, cn } from "@/lib/utils/helpers";
import type { PodcastEpisode } from "@/lib/schema/podcast.schema";

interface PodcastCardProps {
    episode: PodcastEpisode;
    variant?: "default" | "featured" | "compact";
    className?: string;
}

export function PodcastCard({ episode, variant = "default", className }: PodcastCardProps) {
    const isFeatured = variant === "featured";
    const isCompact = variant === "compact";

    if (isFeatured) {
        return (
            <motion.article
                className={cn(
                    "group relative card-cinematic card-cinematic-purple overflow-hidden bg-gradient-to-br from-cbc-purple/5 to-cbc-surface",
                    className
                )}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="flex flex-col sm:flex-row gap-0">
                    {/* Image */}
                    {episode.heroImage && (
                        <div className="relative w-full sm:w-48 aspect-square shrink-0 overflow-hidden">
                            <Image
                                src={episode.heroImage.url}
                                alt={episode.heroImage.alt || episode.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, 192px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cbc-surface/40" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="tag-chip bg-cbc-purple/20 text-cbc-purple border border-cbc-purple/30">
                                    <Mic size={9} />
                                    Podcast
                                </span>
                                <span className="text-xs text-cbc-muted font-mono">
                                    Ep. {episode.episodeNumber}
                                </span>
                            </div>

                            <h3 className="text-xl font-heading font-semibold text-cbc-white leading-snug mb-2 group-hover:text-cbc-purple transition-colors duration-300">
                                {episode.title}
                            </h3>

                            {episode.description && (
                                <p className="text-sm text-cbc-muted line-clamp-3 leading-relaxed mb-4">
                                    {episode.description}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            {episode.spotifyUrl && (
                                <a
                                    href={episode.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-cbc-purple hover:bg-cbc-purple/80 text-white text-sm font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide"
                                >
                                    <span>▶</span> Listen on Spotify
                                </a>
                            )}
                            <Link
                                href={`/podcast/${episode.slug}`}
                                className="text-xs font-label font-semibold tracking-widest uppercase text-cbc-muted hover:text-cbc-white transition-colors duration-200"
                            >
                                Episode details →
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.article>
        );
    }

    // Default / Compact
    return (
        <motion.article
            className={cn("group card-cinematic card-cinematic-purple overflow-hidden", className)}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/podcast/${episode.slug}`} className="block focus-cbc">
                <div className={cn(
                    "relative overflow-hidden bg-cbc-charcoal",
                    isCompact ? "aspect-[4/3]" : "aspect-square"
                )}>
                    {episode.heroImage ? (
                        <Image
                            src={episode.heroImage.url}
                            alt={episode.heroImage.alt || episode.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cbc-purple/20 to-cbc-charcoal">
                            <Mic size={40} className="text-cbc-purple/40" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3">
                        <span className="tag-chip bg-cbc-purple/90 text-white">
                            <Mic size={8} /> Ep. {episode.episodeNumber}
                        </span>
                    </div>
                </div>

                <div className="p-4">
                    <h4 className="text-sm font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-purple transition-colors duration-300 mb-1.5">
                        {episode.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-cbc-faint">
                        {episode.publishDate && (
                            <time dateTime={episode.publishDate}>
                                {formatDateShort(episode.publishDate)}
                            </time>
                        )}
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
