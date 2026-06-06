"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ArrowUpDown, Calendar, Clock, BookOpen, Layers, Newspaper, Zap, Gamepad2, Tv } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDateShort } from "@/lib/utils/helpers";
import type { ContentItem } from "@/lib/content";

interface NewsListProps {
    initialNews: ContentItem[];
}

const CATEGORIES = [
    { value: "all", label: "All News", icon: Newspaper, color: "text-cbc-gold", border: "hover:border-cbc-gold/30", activeBg: "bg-cbc-gold/15 border-cbc-gold/45 text-cbc-gold shadow-[0_0_15px_rgba(229,185,25,0.1)]" },
    { value: "news", label: "Comics", icon: BookOpen, color: "text-cbc-cyan", border: "hover:border-cbc-cyan/30", activeBg: "bg-cbc-cyan/15 border-cbc-cyan/45 text-cbc-cyan shadow-[0_0_15px_rgba(25,230,225,0.1)]" },
    { value: "wrestling", label: "Wrestling", icon: Zap, color: "text-dsr-orange", border: "hover:border-dsr-orange/30", activeBg: "bg-dsr-orange/15 border-dsr-orange/45 text-dsr-orange shadow-[0_0_15px_rgba(255,107,0,0.1)]" },
    { value: "gaming", label: "Gaming", icon: Gamepad2, color: "text-cbc-purple", border: "hover:border-cbc-purple/30", activeBg: "bg-cbc-purple/15 border-cbc-purple/45 text-cbc-purple shadow-[0_0_15px_rgba(168,85,247,0.1)]" },
    { value: "pop-culture", label: "Pop Culture", icon: Tv, color: "text-cbc-crimson", border: "hover:border-[#E5193A]/30", activeBg: "bg-[#E5193A]/15 border-[#E5193A]/45 text-[#E5193A] shadow-[0_0_15px_rgba(229,25,58,0.1)]" },
];

export function NewsList({ initialNews }: NewsListProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
    const categoryScrollRef = useRef<HTMLDivElement>(null);

    // Filter and Sort News
    const filteredNews = useMemo(() => {
        let items = [...initialNews];

        // 1. Category Filter
        if (selectedCategory !== "all") {
            items = items.filter((item) => item.category === selectedCategory);
        }

        // 2. Search Query
        if (search.trim()) {
            const query = search.toLowerCase();
            items = items.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    (item.excerpt && item.excerpt.toLowerCase().includes(query)) ||
                    item.tags?.some((t: string) => t.toLowerCase().includes(query)) ||
                    (item.author?.name && item.author.name.toLowerCase().includes(query))
            );
        }

        // 3. Sorting
        items.sort((a, b) => {
            const dateA = new Date(a.publishDate).getTime();
            const dateB = new Date(b.publishDate).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

        return items;
    }, [initialNews, selectedCategory, search, sortBy]);

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("all");
        setSortBy("newest");
    };

    return (
        <div className="space-y-8">
            {/* ── Search & Responsive Category Slider ── */}
            <div className="relative p-5 rounded-cbc border border-cbc-border bg-cbc-surface/20 halftone shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-lg group">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cbc-faint group-focus-within:text-cbc-gold transition-colors"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search news, reviews, announcements..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-cbc bg-cbc-charcoal/40 border border-cbc-border text-sm text-cbc-white placeholder-cbc-muted/50 focus:outline-none focus:border-cbc-gold/50 focus:bg-cbc-charcoal/60 transition-all font-body"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-cbc-muted hover:text-cbc-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Sorting Select */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cbc-faint">
                            Date:
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                            className="pl-3 pr-8 py-2 rounded-cbc bg-cbc-charcoal/40 border border-cbc-border text-xs text-cbc-muted font-label font-bold uppercase tracking-wider focus:outline-none focus:border-cbc-gold/50 appearance-none cursor-pointer hover:border-cbc-muted/40 transition-colors"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>

                {/* Mobile-optimized sliding category bar */}
                <div className="mt-5 pt-4 border-t border-cbc-border/50">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-cbc-faint mb-3 select-none">
                        Browse by Category:
                    </p>
                    
                    <div 
                        ref={categoryScrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory touch-pan-x -mx-5 px-5 md:mx-0 md:px-0"
                    >
                        {CATEGORIES.map(({ value, label, icon: Icon, color, border, activeBg }) => {
                            const active = selectedCategory === value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => setSelectedCategory(value)}
                                    className={`snap-start inline-flex items-center gap-2 px-4 py-2 border rounded-cbc text-xs font-label font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                        active
                                            ? activeBg
                                            : `border-cbc-border bg-cbc-surface/40 text-cbc-muted ${color} ${border}`
                                    }`}
                                >
                                    <Icon size={14} />
                                    <span>{label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Filter Indicators */}
                {(search || selectedCategory !== "all" || sortBy !== "newest") && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-cbc-border/30 text-[10px] font-mono text-cbc-muted/60 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Found {filteredNews.length} articles</span>
                            <span>•</span>
                            <span>Filtered by {selectedCategory === "all" ? "all categories" : selectedCategory}</span>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-cbc-crimson hover:text-cbc-white hover:underline transition-all"
                        >
                            <X size={10} /> Reset
                        </button>
                    </div>
                )}
            </div>

            {/* ── News Articles Grid ── */}
            <div>
                {filteredNews.length === 0 ? (
                    <div className="text-center py-24 rounded-cbc border border-dashed border-cbc-border bg-cbc-surface/5">
                        <Layers size={24} className="text-cbc-faint mx-auto mb-3 animate-pulse" />
                        <p className="font-heading text-lg text-cbc-white mb-1 uppercase tracking-wide">No News Found</p>
                        <p className="text-cbc-muted text-sm max-w-sm mx-auto font-body">
                            No articles match your selection. Try adjusting your search query or selecting another category.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 border border-cbc-border text-xs font-label font-bold uppercase tracking-widest text-cbc-white hover:bg-cbc-charcoal/50 rounded-cbc transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredNews.map((i) => (
                                <motion.div
                                    key={i.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={`/news/${i.slug}`}
                                        className="group block h-full rounded-card border border-cbc-border bg-cbc-surface hover:bg-cbc-elevated hover:border-cbc-gold/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl flex flex-col justify-between"
                                    >
                                        <div>
                                            {i.heroImage && (
                                                <div className="relative aspect-[16/10] overflow-hidden bg-cbc-charcoal">
                                                    <Image
                                                        src={i.heroImage.url}
                                                        alt={i.heroImage.alt || i.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/80 via-transparent to-transparent opacity-80" />
                                                    
                                                    {/* Floating Category Badge */}
                                                    <div className="absolute top-3 left-3 flex gap-2">
                                                        <span className={`tag-chip py-1 px-2.5 font-bold rounded bg-cbc-black/75 backdrop-blur-sm border text-[9px] ${
                                                            i.category === "wrestling" ? "text-dsr-orange border-dsr-orange/30" :
                                                            i.category === "gaming" ? "text-cbc-purple border-cbc-purple/30" :
                                                            i.category === "pop-culture" ? "text-cbc-crimson border-cbc-crimson/30" :
                                                            "text-cbc-cyan border-cbc-cyan/30"
                                                        }`}>
                                                            {i.category === "news" ? "Comics" : i.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="p-5">
                                                <h3 className="font-heading font-bold text-lg text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-gold transition-colors duration-300 mb-2">
                                                    {i.title}
                                                </h3>
                                                {i.excerpt && (
                                                    <p className="text-cbc-muted text-sm line-clamp-2 mb-4 leading-relaxed font-body">
                                                        {i.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-cbc-faint font-label">
                                            {i.author && <span className="text-cbc-muted font-semibold">{i.author.name}</span>}
                                            {i.publishDate && (
                                                <time dateTime={i.publishDate}>{formatDateShort(i.publishDate)}</time>
                                            )}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
