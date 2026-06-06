"use client";

import Link from "next/link";
import Image from "next/image";
import { Radio, Headphones, Mic2, Play, ExternalLink } from "lucide-react";

// Animated waveform bars
function Waveform({ color = "#FF6B00", bars = 12 }: { color?: string; bars?: number }) {
    return (
        <div className="flex items-end gap-[3px] h-8">
            {Array.from({ length: bars }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-full animate-waveform"
                    style={{
                        width: "3px",
                        backgroundColor: color,
                        height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${(i * 0.1) % 1.2}s`,
                        animationDuration: `${0.8 + (i % 4) * 0.15}s`,
                        opacity: 0.6 + (i % 3) * 0.15,
                    }}
                />
            ))}
        </div>
    );
}

interface DsrCardProps {
    episode: {
        id: string;
        slug: string;
        title: string;
        episodeNumber?: number;
        description?: string;
        publishDate?: string;
        heroImage?: { url: string; alt?: string };
        duration?: string;
        spotifyUrl?: string;
    };
    variant?: "featured" | "compact" | "list";
}

export function DsrCard({ episode, variant = "compact" }: DsrCardProps) {
    if (variant === "featured") {
        return (
            <div className="relative rounded-2xl overflow-hidden border border-dsr-orange/20 bg-gradient-to-br from-[#1a0e00] to-[#0d0d10] group hover:border-dsr-orange/40 transition-all duration-500 shadow-cinematic-orange">
                {episode.heroImage && (
                    <div className="relative w-full h-64 overflow-hidden">
                        <Image
                            src={episode.heroImage.url}
                            alt={episode.heroImage.alt || episode.title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/60 to-transparent" />
                        {/* Waveform overlay */}
                        <div className="absolute bottom-4 left-4">
                            <Waveform color="#FF6B00" bars={16} />
                        </div>
                    </div>
                )}
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-dsr-orange/20 border border-dsr-orange/30 rounded-sm">
                            <Radio size={10} className="text-dsr-orange" />
                            <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-dsr-orange">
                                Dirt Sheet Radio
                            </span>
                        </span>
                        {episode.episodeNumber && (
                            <span className="font-mono text-xs text-cbc-faint">Ep. {episode.episodeNumber}</span>
                        )}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-cbc-white leading-tight mb-3 group-hover:text-dsr-orange transition-colors duration-300">
                        {episode.title}
                    </h3>
                    {episode.description && (
                        <p className="text-cbc-muted text-sm leading-relaxed line-clamp-2 mb-4">
                            {episode.description}
                        </p>
                    )}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/podcast/${episode.slug}`}
                            className="flex items-center gap-2 px-4 py-2 bg-dsr-orange hover:bg-dsr-orange-dim text-white font-heading font-bold text-sm rounded-sm transition-all duration-300 tracking-wide"
                        >
                            <Play size={14} className="fill-current" /> Play Episode
                        </Link>
                        {episode.spotifyUrl && (
                            <a href={episode.spotifyUrl} target="_blank" rel="noopener noreferrer"
                                className="p-2 border border-white/10 rounded-sm text-cbc-muted hover:text-cbc-white transition-colors">
                                <ExternalLink size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "list") {
        return (
            <Link
                href={`/podcast/${episode.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-dsr-orange/30 bg-white/[0.02] hover:bg-dsr-orange/5 transition-all duration-300"
            >
                {episode.heroImage ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <Image src={episode.heroImage.url} alt={episode.heroImage.alt || episode.title} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-lg bg-dsr-orange/10 border border-dsr-orange/20 flex items-center justify-center shrink-0">
                        <Radio size={20} className="text-dsr-orange" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {episode.episodeNumber && (
                            <span className="font-mono text-[10px] text-dsr-orange">EP. {episode.episodeNumber}</span>
                        )}
                        <span className="text-cbc-faint text-[10px]">•</span>
                        {episode.duration && <span className="font-mono text-[10px] text-cbc-faint">{episode.duration}</span>}
                    </div>
                    <p className="font-heading font-semibold text-sm text-cbc-white line-clamp-2 leading-snug group-hover:text-dsr-orange transition-colors">
                        {episode.title}
                    </p>
                </div>
                <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-dsr-orange/10 group-hover:bg-dsr-orange flex items-center justify-center transition-all duration-300">
                        <Play size={12} className="text-dsr-orange group-hover:text-white fill-current transition-colors" />
                    </div>
                </div>
            </Link>
        );
    }

    // Compact default
    return (
        <Link
            href={`/podcast/${episode.slug}`}
            className="group block rounded-xl overflow-hidden border border-white/5 hover:border-dsr-orange/30 bg-white/[0.02] hover:shadow-cinematic-orange transition-all duration-300"
        >
            {episode.heroImage && (
                <div className="relative w-full h-36 overflow-hidden">
                    <Image src={episode.heroImage.url} alt={episode.heroImage.alt || episode.title} fill className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                        <Waveform color="#FF6B00" bars={8} />
                    </div>
                </div>
            )}
            <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <Radio size={10} className="text-dsr-orange" />
                    {episode.episodeNumber && (
                        <span className="font-mono text-[10px] text-dsr-orange">EP. {episode.episodeNumber}</span>
                    )}
                </div>
                <p className="font-heading font-semibold text-sm text-cbc-white line-clamp-2 leading-snug group-hover:text-dsr-orange transition-colors">
                    {episode.title}
                </p>
            </div>
        </Link>
    );
}
