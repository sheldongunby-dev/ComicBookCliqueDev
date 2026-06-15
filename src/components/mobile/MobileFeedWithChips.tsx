"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Newspaper, Headphones, Zap, Gamepad2, Tv } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { formatDateShort } from "@/lib/utils/helpers";

// ── Types ────────────────────────────────────────────────────────────────────

type FeedCategory = "all" | "reviews" | "news" | "features" | "podcast";

interface FeedItem {
  id: string;
  title: string;
  excerpt?: string;
  slug: string;
  href: string;
  category: FeedCategory;
  imageUrl?: string;
  imageAlt?: string;
  date?: string;
  author?: string;
  rating?: number;
  tag: string;
  tagColor: string;
}

interface Props {
  reviews: any[];
  news: any[];
  articles: any[];
  podcasts: any[];
}

// ── Chip config ───────────────────────────────────────────────────────────────

const CHIPS: { id: FeedCategory; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Tv },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "news", label: "News", icon: Newspaper },
  { id: "features", label: "Features", icon: Zap },
  { id: "podcast", label: "Podcast", icon: Headphones },
];

const CHIP_ACTIVE: Record<FeedCategory, string> = {
  all: "bg-cbc-crimson text-white border-cbc-crimson",
  reviews: "bg-cbc-crimson text-white border-cbc-crimson",
  news: "bg-cbc-gold text-cbc-black border-cbc-gold",
  features: "bg-cbc-cyan text-cbc-black border-cbc-cyan",
  podcast: "bg-cbc-purple text-white border-cbc-purple",
};

// ── Rating badge ──────────────────────────────────────────────────────────────

function RatingPill({ rating }: { rating: number }) {
  const color =
    rating >= 9 ? "text-cbc-gold border-cbc-gold/40 bg-cbc-gold/10" :
    rating >= 7.5 ? "text-cbc-cyan border-cbc-cyan/40 bg-cbc-cyan/10" :
    "text-cbc-muted border-cbc-border bg-cbc-surface";
  return (
    <span className={cn("inline-flex items-end gap-px px-1.5 py-0.5 rounded border font-mono text-xs font-bold shrink-0", color)}>
      {rating.toFixed(1)}<span className="text-[9px] opacity-60 mb-px">/10</span>
    </span>
  );
}

// ── Single feed card (horizontal thumb + text) ────────────────────────────────

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <Link
      href={item.href}
      className="group flex gap-3 p-3 rounded-xl border border-cbc-border/60 bg-cbc-surface/60 hover:border-cbc-border active:scale-[0.98] transition-all duration-150"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-cbc-charcoal">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.imageAlt || item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cbc-charcoal to-cbc-surface" />
        )}
        {/* Category tag overlay */}
        <span
          className={cn(
            "absolute bottom-1 left-1 text-[8px] font-label font-bold tracking-widest uppercase px-1 py-px rounded",
            item.tagColor
          )}
        >
          {item.tag}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
        <h3 className="text-sm font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-crimson transition-colors duration-200">
          {item.title}
        </h3>
        <div className="flex items-center justify-between mt-1 gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {item.author && (
              <span className="text-[11px] font-label text-cbc-muted truncate">{item.author}</span>
            )}
            {item.date && (
              <time dateTime={item.date} className="text-[11px] text-cbc-faint shrink-0">
                · {formatDateShort(item.date)}
              </time>
            )}
          </div>
          {item.rating !== undefined && <RatingPill rating={item.rating} />}
        </div>
      </div>
    </Link>
  );
}

// ── View-all link per category ────────────────────────────────────────────────

const CATEGORY_LINKS: Record<FeedCategory, { href: string; label: string; colorClass: string } | null> = {
  all: null,
  reviews: { href: "/reviews", label: "All Reviews", colorClass: "text-cbc-crimson" },
  news: { href: "/news", label: "All News", colorClass: "text-cbc-gold" },
  features: { href: "/features", label: "All Features", colorClass: "text-cbc-cyan" },
  podcast: { href: "/major-issues", label: "All Episodes", colorClass: "text-cbc-purple" },
};

// ── Main component ────────────────────────────────────────────────────────────

export function MobileFeedWithChips({ reviews, news, articles, podcasts }: Props) {
  const [active, setActive] = useState<FeedCategory>("all");
  const chipsRef = useRef<HTMLDivElement>(null);

  // Normalize all content into a unified feed item shape
  const allItems: FeedItem[] = [
    ...reviews.slice(0, 8).map((r: any) => ({
      id: r.id,
      title: r.title,
      excerpt: r.excerpt,
      slug: r.slug,
      href: `/reviews/${r.slug}`,
      category: "reviews" as FeedCategory,
      imageUrl: r.heroImage?.url,
      imageAlt: r.heroImage?.alt || r.title,
      date: r.publishDate,
      author: r.author?.name,
      rating: r.rating,
      tag: "Review",
      tagColor: "bg-cbc-crimson/90 text-white",
    })),
    ...news.slice(0, 8).map((n: any) => ({
      id: n.id,
      title: n.title,
      excerpt: n.excerpt,
      slug: n.slug,
      href: `/news/${n.slug}`,
      category: "news" as FeedCategory,
      imageUrl: n.heroImage?.url,
      imageAlt: n.heroImage?.alt || n.title,
      date: n.publishDate,
      author: n.author?.name,
      tag: n.breaking ? "Breaking" : "News",
      tagColor: n.breaking ? "bg-cbc-crimson/90 text-white" : "bg-cbc-gold/90 text-cbc-black",
    })),
    ...articles.slice(0, 8).map((a: any) => ({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      slug: a.slug,
      href: `/features/${a.slug}`,
      category: "features" as FeedCategory,
      imageUrl: a.heroImage?.url,
      imageAlt: a.heroImage?.alt || a.title,
      date: a.publishDate,
      author: a.author?.name,
      tag: "Feature",
      tagColor: "bg-cbc-cyan/90 text-cbc-black",
    })),
    ...podcasts.slice(0, 6).map((p: any) => ({
      id: p.id,
      title: p.title,
      excerpt: p.description,
      slug: p.slug,
      href: `/major-issues/${p.slug}`,
      category: "podcast" as FeedCategory,
      imageUrl: p.coverImage?.url || p.heroImage?.url,
      imageAlt: p.title,
      date: p.publishDate || p.pubDate,
      tag: "Podcast",
      tagColor: "bg-cbc-purple/90 text-white",
    })),
  ].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const filtered = active === "all" ? allItems : allItems.filter((i) => i.category === active);
  const viewAll = CATEGORY_LINKS[active];

  return (
    <section className="px-4 pt-5 pb-4">
      {/* Section label */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-label font-bold tracking-[0.2em] uppercase text-cbc-muted">
          Latest
        </h2>
      </div>

      {/* Filter chips — horizontally scrollable */}
      <div
        ref={chipsRef}
        className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {CHIPS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-label font-bold tracking-wide whitespace-nowrap",
                "transition-all duration-200 active:scale-95 shrink-0",
                isActive
                  ? CHIP_ACTIVE[id]
                  : "bg-cbc-surface/60 border-cbc-border/60 text-cbc-muted hover:border-cbc-border hover:text-cbc-white"
              )}
            >
              <Icon size={12} strokeWidth={2.5} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-2.5 mt-1">
        {filtered.length === 0 ? (
          <p className="text-center text-cbc-faint text-sm py-8">Nothing here yet.</p>
        ) : (
          filtered.map((item) => <FeedCard key={`${item.category}-${item.id}`} item={item} />)
        )}
      </div>

      {/* View all link */}
      {viewAll && (
        <Link
          href={viewAll.href}
          className={cn(
            "flex items-center justify-center gap-2 mt-4 py-3 rounded-xl border border-cbc-border/60 text-sm font-label font-semibold tracking-widest uppercase",
            "transition-colors duration-200 hover:border-cbc-border",
            viewAll.colorClass
          )}
        >
          {viewAll.label} <ArrowRight size={14} />
        </Link>
      )}
    </section>
  );
}
