import { buildMetadata } from "@/lib/seo/metadata";
import { getReviews } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import { Headphones, Star, TrendingUp, Filter } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Podcast Reviews — Is It Worth Your Time?",
    description: "In-depth reviews of the best (and worst) podcasts in comics, wrestling, and pop culture.",
    path: "/reviews/podcast",
});

const PODCAST_REVIEWS = [
    {
        id: "pr1",
        showName: "SmackDown Rundown",
        episode: "Episode 312 — Cody's Next Chapter",
        rating: 8.5,
        verdict: "Essential",
        category: "wrestling",
        excerpt: "Jon and Nick break down every segment with the precision of surgeons and the passion of superfans. This one's required listening.",
        badge: "On The Air",
    },
    {
        id: "pr2",
        showName: "Panel to Panel",
        episode: "DC Absolute Universe Deep Dive",
        rating: 9.1,
        verdict: "Masterful",
        category: "comics",
        excerpt: "The definitive breakdown of DC's Absolute Universe rollout. If you read one podcast review this week, make it this.",
        badge: null,
    },
    {
        id: "pr3",
        showName: "Wrestling Observer",
        episode: "AEW Dynasty Review",
        rating: 6.8,
        verdict: "Divisive",
        category: "wrestling",
        excerpt: "Dave's analysis is sharp but the runtime is punishing. Recommended for the hardcore observer, not the casual listener.",
        badge: null,
    },
    {
        id: "pr4",
        showName: "Off Panel",
        episode: "Grant Morrison: A Life in Comics",
        rating: 9.4,
        verdict: "Essential",
        category: "comics",
        excerpt: "A near-perfect exploration of the most ambitious writer in comics. Essential for anyone who takes the medium seriously.",
        badge: "Must Listen",
    },
    {
        id: "pr5",
        showName: "Kinda Funny Games",
        episode: "Sony State of Play Breakdown",
        rating: 7.2,
        verdict: "Recommended",
        category: "gaming",
        excerpt: "Energetic and informed. Greg and Tim bring genuine excitement to every announcement. A reliable listen.",
        badge: null,
    },
    {
        id: "pr6",
        showName: "Fatman Beyond",
        episode: "Superman 2025 — Our Take",
        rating: 8.0,
        verdict: "Recommended",
        category: "movies",
        excerpt: "Kevin Smith's love for comics shines through every frame of analysis. The enthusiasm is infectious.",
        badge: null,
    },
];

function RatingBadge({ rating }: { rating: number }) {
    const color = rating >= 9 ? "text-cbc-gold" : rating >= 7.5 ? "text-pod-teal" : rating >= 6 ? "text-cbc-muted" : "text-cbc-crimson";
    const glow = rating >= 9 ? "shadow-glow-gold" : rating >= 7.5 ? "shadow-glow-teal" : "";
    return (
        <div className={`font-mono font-bold text-3xl ${color} tabular-nums`}>
            {rating.toFixed(1)}
            <span className="text-base text-cbc-faint font-normal">/10</span>
        </div>
    );
}

const CATEGORY_FILTERS = ["All", "Wrestling", "Comics", "Gaming", "Movies"];

const CATEGORY_COLORS: Record<string, string> = {
    wrestling: "text-cbc-crimson bg-cbc-crimson/10 border-cbc-crimson/20",
    comics: "text-cbc-gold bg-cbc-gold/10 border-cbc-gold/20",
    gaming: "text-cbc-cyan bg-cbc-cyan/10 border-cbc-cyan/20",
    movies: "text-cbc-purple bg-cbc-purple/10 border-cbc-purple/20",
};

export default async function PodcastReviewsPage() {
    return (
        <div className="min-h-screen bg-[#07060A]">

            {/* ── HERO ── */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#001a14] via-[#07060A] to-[#07060A]" />
                <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-pod-teal/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-cbc-purple/6 rounded-full blur-[80px]" />

                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Headphones size={18} className="text-pod-teal" />
                        <div className="w-10 h-px bg-pod-teal" />
                        <span className="font-label text-xs font-bold tracking-[0.3em] uppercase text-pod-teal">
                            Podcast Reviews
                        </span>
                    </div>
                    <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none text-white uppercase mb-4">
                        Is It Worth<br />
                        <span className="text-pod-teal [text-shadow:0_0_50px_rgba(0,229,180,0.4)]">Your Time?</span>
                    </h1>
                    <p className="text-cbc-muted text-lg max-w-2xl leading-relaxed">
                        We listen so you don{"'"}t have to. Honest, unfiltered reviews of the podcasts covering
                        comics, wrestling, gaming, and pop culture — rated and ranked by the Clique.
                    </p>
                </div>
            </div>

            {/* ── STATS BAR ── */}
            <div className="border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 py-6">
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-6 max-w-lg">
                        {[
                            { value: "48+", label: "Shows Reviewed" },
                            { value: "8.1", label: "Avg Rating" },
                            { value: "12", label: "This Month" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="font-mono text-2xl font-bold text-pod-teal">{stat.value}</p>
                                <p className="font-label text-[11px] tracking-widest uppercase text-cbc-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── REVIEWS GRID ── */}
            <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 py-20">
                {/* Filter tabs */}
                <div className="flex items-center gap-2 flex-wrap mb-12">
                    {CATEGORY_FILTERS.map((filter, i) => (
                        <button
                            key={filter}
                            className={`px-5 py-2 rounded-sm font-label font-semibold text-sm tracking-widest uppercase transition-all duration-200 ${
                                i === 0
                                    ? "bg-pod-teal text-black"
                                    : "border border-white/10 text-cbc-muted hover:border-pod-teal/40 hover:text-pod-teal"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Reviews */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {PODCAST_REVIEWS.map((review) => (
                        <div
                            key={review.id}
                            className="group relative rounded-2xl border border-white/5 hover:border-pod-teal/30 bg-white/[0.02] hover:bg-pod-teal/[0.03] transition-all duration-500 overflow-hidden p-6 flex flex-col gap-4 hover:shadow-cinematic-teal"
                        >
                            {/* Top accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pod-teal/60 to-transparent" />

                            {/* Category + badge */}
                            <div className="flex items-center justify-between">
                                <span className={`font-label text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded-sm border ${CATEGORY_COLORS[review.category] || "text-cbc-muted bg-white/5 border-white/10"}`}>
                                    {review.category}
                                </span>
                                {review.badge && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-pod-teal/15 border border-pod-teal/30 rounded-sm">
                                        <span className="w-1.5 h-1.5 rounded-full bg-pod-teal animate-on-air" />
                                        <span className="font-label text-[10px] font-bold tracking-widest uppercase text-pod-teal">{review.badge}</span>
                                    </span>
                                )}
                            </div>

                            {/* Show info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-heading font-bold text-lg text-cbc-white leading-tight mb-1 group-hover:text-pod-teal transition-colors duration-300">
                                            {review.showName}
                                        </h3>
                                        <p className="font-label text-xs text-cbc-muted tracking-wide">{review.episode}</p>
                                    </div>
                                    <RatingBadge rating={review.rating} />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <p className="text-cbc-muted text-sm leading-relaxed border-l-2 border-pod-teal/30 pl-3 italic">
                                {review.excerpt}
                            </p>

                            {/* Verdict */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <div>
                                    <p className="font-label text-[9px] tracking-[0.2em] uppercase text-cbc-faint mb-0.5">Verdict</p>
                                    <p className="font-heading font-bold text-sm text-pod-teal">{review.verdict}</p>
                                </div>
                                <Headphones size={16} className="text-cbc-faint group-hover:text-pod-teal transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="border-t border-white/5 py-20">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 text-center">
                    <h2 className="font-display text-5xl text-white uppercase mb-4">Suggest a Show</h2>
                    <p className="text-cbc-muted mb-8 text-lg">Know a podcast that deserves the CBC treatment? Hit us up.</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-pod-teal text-black font-heading font-bold text-sm rounded-sm hover:bg-pod-teal-dim transition-all duration-300 tracking-wide"
                    >
                        <TrendingUp size={16} /> Suggest a Podcast
                    </Link>
                </div>
            </div>
        </div>
    );
}
