"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "@/components/editorial/ReviewCard";
import type { Review } from "@/lib/schema/article.schema";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Star, X, Calendar, User, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ReviewsListProps {
    initialReviews: Review[];
}

type SortField = "publishDate" | "title" | "author" | "rating";
type SortOrder = "asc" | "desc";
type RatingFilter = "all" | "9+" | "7.5+" | "under7.5";

export function ReviewsList({ initialReviews }: ReviewsListProps) {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<SortField>("publishDate");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

    // Extract unique publishers for secondary filtering
    const publishers = useMemo(() => {
        const pubs = new Set(initialReviews.map((r) => r.publisher).filter((p): p is string => !!p));
        return ["all", ...Array.from(pubs).sort()];
    }, [initialReviews]);
    const [selectedPublisher, setSelectedPublisher] = useState("all");

    // Filter & Sort reviews
    const processedReviews = useMemo(() => {
        let items = [...initialReviews];

        // 1. Search Query
        if (search.trim()) {
            const query = search.toLowerCase();
            items = items.filter(
                (r) =>
                    r.title.toLowerCase().includes(query) ||
                    (r.excerpt && r.excerpt.toLowerCase().includes(query)) ||
                    (r.author?.name && r.author.name.toLowerCase().includes(query)) ||
                    (r.publisher && r.publisher.toLowerCase().includes(query)) ||
                    (r.writer && r.writer.toLowerCase().includes(query)) ||
                    (r.artist && r.artist.toLowerCase().includes(query))
            );
        }

        // 2. Rating Filter
        if (ratingFilter !== "all") {
            items = items.filter((r) => {
                const rating = r.rating ?? 0;
                if (ratingFilter === "9+") return rating >= 9.0;
                if (ratingFilter === "7.5+") return rating >= 7.5;
                if (ratingFilter === "under7.5") return rating < 7.5 && rating > 0;
                return true;
            });
        }

        // 3. Publisher Filter
        if (selectedPublisher !== "all") {
            items = items.filter((r) => r.publisher === selectedPublisher);
        }

        // 4. Sort
        items.sort((a, b) => {
            let valA: any = "";
            let valB: any = "";

            if (sortBy === "publishDate") {
                valA = a.publishDate || "";
                valB = b.publishDate || "";
            } else if (sortBy === "title") {
                valA = a.title || "";
                valB = b.title || "";
            } else if (sortBy === "author") {
                valA = a.author?.name || "";
                valB = b.author?.name || "";
            } else if (sortBy === "rating") {
                valA = a.rating ?? 0;
                valB = b.rating ?? 0;
            }

            if (valA === valB) return 0;

            // Handle string comparisons
            if (typeof valA === "string" && typeof valB === "string") {
                return sortOrder === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            // Handle numeric comparisons
            return sortOrder === "asc"
                ? (valA > valB ? 1 : -1)
                : (valB > valA ? 1 : -1);
        });

        return items;
    }, [initialReviews, search, sortBy, sortOrder, ratingFilter, selectedPublisher]);

    const handleSortChange = (field: SortField) => {
        if (sortBy === field) {
            // Toggle order
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(field);
            // Default to desc for date and rating, asc for strings
            setSortOrder(field === "publishDate" || field === "rating" ? "desc" : "asc");
        }
    };

    const clearFilters = () => {
        setSearch("");
        setSortBy("publishDate");
        setSortOrder("desc");
        setRatingFilter("all");
        setSelectedPublisher("all");
    };

    return (
        <div className="space-y-8">
            {/* ── Search & Filter Panel ── */}
            <div className="relative p-6 rounded-cbc border border-cbc-border bg-cbc-surface/20 halftone shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                    
                    {/* Search Bar */}
                    <div className="relative flex-1 group">
                        <Search
                            size={16}
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cbc-faint group-focus-within:text-cbc-cyan transition-colors"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reviews by comic title, publisher, writer, artist, or author..."
                            className="w-full pl-10 pr-10 py-2.5 rounded-cbc bg-cbc-charcoal/40 border border-cbc-border text-sm text-cbc-white placeholder-cbc-muted/50 focus:outline-none focus:border-cbc-cyan/50 focus:bg-cbc-charcoal/60 transition-all font-body"
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

                    {/* Sorting Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cbc-faint mr-1">
                            Sort By:
                        </span>
                        
                        {(
                            [
                                { field: "publishDate", label: "Date", icon: Calendar },
                                { field: "title", label: "Title", icon: FileText },
                                { field: "author", label: "Author", icon: User },
                                { field: "rating", label: "Verdict", icon: Star },
                            ] as const
                        ).map(({ field, label, icon: Icon }) => {
                            const active = sortBy === field;
                            return (
                                <button
                                    key={field}
                                    onClick={() => handleSortChange(field)}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-cbc text-xs font-label font-bold uppercase tracking-wider transition-all duration-200 ${
                                        active
                                            ? "bg-cbc-cyan/10 border-cbc-cyan/40 text-cbc-cyan shadow-sm shadow-cbc-cyan/10"
                                            : "border-cbc-border text-cbc-muted hover:text-cbc-white hover:bg-cbc-surface/50"
                                    }`}
                                >
                                    <Icon size={12} />
                                    <span>{label}</span>
                                    {active && (
                                        <span className="ml-0.5">
                                            {sortOrder === "asc" ? (
                                                <ArrowUp size={10} className="text-cbc-cyan" />
                                            ) : (
                                                <ArrowDown size={10} className="text-cbc-cyan" />
                                            )}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Second Row: Filter Tabs & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5 pt-4 border-t border-cbc-border/50">
                    {/* Rating Filters */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cbc-faint mr-1.5">
                            Verdict:
                        </span>
                        {(
                            [
                                { filter: "all", label: "All Verdicts" },
                                { filter: "9+", label: "Masterpieces (9.0+)" },
                                { filter: "7.5+", label: "Recommended (7.5+)" },
                                { filter: "under7.5", label: "Mixed / Indie (< 7.5)" },
                            ] as const
                        ).map(({ filter, label }) => {
                            const active = ratingFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setRatingFilter(filter)}
                                    className={`px-3 py-1.5 rounded-cbc text-[10px] font-label font-bold uppercase tracking-wider transition-all duration-200 border ${
                                        active
                                            ? "bg-cbc-crimson/15 border-cbc-crimson/40 text-cbc-crimson font-bold"
                                            : "border-cbc-border/60 text-cbc-muted hover:border-cbc-muted/40 hover:text-cbc-white"
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Publisher Filter */}
                    {publishers.length > 2 && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-cbc-faint shrink-0">
                                Publisher:
                            </span>
                            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x snap-mandatory touch-pan-x max-w-full">
                                {["all", "Marvel", "DC", "Image", "Boom", "IDW"].map((pub) => {
                                    const available = publishers.includes(pub) || pub === "all";
                                    if (!available) return null;
                                    const active = selectedPublisher === pub;
                                    return (
                                        <button
                                            key={pub}
                                            onClick={() => setSelectedPublisher(pub)}
                                            className={`px-3 py-1 rounded-cbc text-[10px] font-label font-bold uppercase tracking-wider transition-all duration-200 border snap-start whitespace-nowrap cursor-pointer ${
                                                active
                                                    ? "bg-cbc-cyan/15 border-cbc-cyan/40 text-cbc-cyan font-bold"
                                                    : "border-cbc-border text-cbc-muted hover:border-cbc-muted/40 hover:text-cbc-white"
                                            }`}
                                        >
                                            {pub === "all" ? "All" : pub}
                                        </button>
                                    );
                                })}
                                {/* Fallback select for other publishers not in the quick access list */}
                                {publishers.filter(p => !["all", "Marvel", "DC", "Image", "Boom", "IDW"].includes(p)).length > 0 && (
                                    <select
                                        value={["all", "Marvel", "DC", "Image", "Boom", "IDW"].includes(selectedPublisher) ? "all" : selectedPublisher}
                                        onChange={(e) => {
                                            if (e.target.value !== "all") {
                                                setSelectedPublisher(e.target.value);
                                            }
                                        }}
                                        className="pl-2 pr-6 py-1 rounded-cbc bg-cbc-charcoal/40 border border-cbc-border text-[10px] text-cbc-muted font-label font-bold uppercase tracking-wider focus:outline-none focus:border-cbc-cyan/50 appearance-none cursor-pointer hover:border-cbc-muted/40 transition-colors"
                                    >
                                        <option value="all" className="bg-cbc-black text-cbc-white">More...</option>
                                        {publishers
                                            .filter((p) => !["all", "Marvel", "DC", "Image", "Boom", "IDW"].includes(p))
                                            .map((pub) => (
                                                <option key={pub} value={pub} className="bg-cbc-black text-cbc-white">
                                                    {pub}
                                                </option>
                                            ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter Status Reset Bar */}
                {(search || sortBy !== "publishDate" || sortOrder !== "desc" || ratingFilter !== "all" || selectedPublisher !== "all") && (
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-cbc-border/30 text-[10px] font-mono text-cbc-muted/60 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Found {processedReviews.length} matching reviews</span>
                            <span>•</span>
                            <span>Sorted by {sortBy === "publishDate" ? "date" : sortBy} ({sortOrder})</span>
                        </div>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-cbc-crimson hover:text-cbc-white hover:underline transition-all"
                        >
                            <X size={10} /> Clear All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* ── Reviews Grid ── */}
            <div>
                {processedReviews.length === 0 ? (
                    <div className="text-center py-24 rounded-cbc border border-dashed border-cbc-border bg-cbc-surface/5">
                        <Star size={24} className="text-cbc-faint mx-auto mb-3 animate-pulse" />
                        <p className="font-heading text-lg text-cbc-white mb-1 uppercase tracking-wide">No Reviews Found</p>
                        <p className="text-cbc-muted text-sm max-w-sm mx-auto font-body">
                            No major reviews match your filter settings. Try adjusting your search query or verdict filters.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-4 py-2 border border-cbc-border text-xs font-label font-bold uppercase tracking-widest text-cbc-white hover:bg-cbc-charcoal/50 rounded-cbc transition-all"
                        >
                            Reset Search
                        </button>
                    </div>
                ) : (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {processedReviews.map((review) => (
                                <motion.div
                                    key={review.id}
                                    layout
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <ReviewCard review={review} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
