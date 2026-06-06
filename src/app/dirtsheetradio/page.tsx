import { buildMetadata } from "@/lib/seo/metadata";
import { getNews } from "@/lib/content";
import { DsrLiveStream } from "@/components/editorial/DsrLiveStream";
import { NewsCard } from "@/components/editorial/NewsCard";
import Link from "next/link";
import { Radio, Mic2, Headphones, ExternalLink, Play, Zap, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { formatDateShort } from "@/lib/utils/helpers";


export const metadata: Metadata = buildMetadata({
    title: "Dirt Sheet Radio — Wrestling's Realest Show",
    description: "The unfiltered wrestling show from Comic Book Clique. Live reactions, hot takes, and wrestling news every week.",
    path: "/dirtsheetradio",
});

const DSR_HOSTS = [
    { name: "Jon Escudero", role: "Host & Creator", handle: "@JonEscudero" },
    { name: "Nick LaRocco", role: "Co-Host & Analyst", handle: "@NickLaRocco" },
];

const DSR_SHOW_LINKS = [
    { label: "Spotify", href: "https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK", color: "bg-[#1DB954]" },
    { label: "YouTube", href: "https://www.youtube.com/comicbookclique", color: "bg-[#FF0000]" },
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/major-issues-podcast/id1321720972", color: "bg-[#B66DFF]" },
];

export default async function DirtSheetRadioPage() {
    // Load Keystatic news and filter for wrestling category
    const allNews = await getNews();
    const wrestlingNewsAll = allNews.filter(n => n.category === 'wrestling');

    // Sort by publication date descending
    const sortedWrestlingNews = wrestlingNewsAll.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    // Separate wrestling podcast episodes vs wrestling news articles
    const dsrEpisodes = sortedWrestlingNews.filter(n => 
        n.title.toLowerCase().includes('dirt sheet radio') || 
        n.title.toLowerCase().includes('dsr') || 
        n.title.toLowerCase().includes('episode') ||
        n.tags?.some((t: string) => t.toLowerCase().includes('podcast'))
    );
    const wrestlingNews = sortedWrestlingNews.filter(n => !dsrEpisodes.some(ep => ep.id === n.id));

    // Get slice of latest episodes and news
    const latestEpisode = dsrEpisodes[0];
    const recentEpisodes = dsrEpisodes.slice(1, 7);
    const recentWrestlingNews = wrestlingNews.slice(0, 6);

    return (
        <div className="min-h-screen bg-[#07060A] text-cbc-white pb-24">
            {/* ── BROADCAST HERO ── */}
            <div className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-b from-[#1E0C02] via-[#0D0803] to-[#07060A] border-b border-white/5">
                {/* Visual Glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-dsr-orange/10 rounded-full blur-[120px]" />
                    <div className="absolute left-10 bottom-0 w-[300px] h-[300px] bg-cbc-crimson/5 rounded-full blur-[100px]" />
                </div>
                
                {/* Noise overlay */}
                <div className="absolute inset-0 opacity-[0.02] halftone pointer-events-none" />

                <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            {/* Show label */}
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-dsr-orange/15 border border-dsr-orange/30 text-dsr-orange text-xs font-label font-bold tracking-[0.2em] uppercase rounded-sm">
                                    <Radio size={12} /> Broadcast Center
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-dsr-orange animate-ping" />
                            </div>

                            {/* Show title */}
                            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-none text-white uppercase mb-6 tracking-tight">
                                Dirt
                                <br />
                                <span className="text-dsr-orange [text-shadow:0_0_40px_rgba(255,107,0,0.35)]">Sheet</span>
                                <br />
                                Radio
                            </h1>

                            <p className="text-cbc-muted text-lg sm:text-xl leading-relaxed mb-8 max-w-xl font-body">
                                Wrestling{"'"}s most unfiltered commentary. Join Jon Escudero and Nick LaRocco as they deliver the real story behind pro wrestling, live call-ins, and breaking WWE/AEW/TNA reports.
                            </p>

                            {/* Listen buttons */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                {DSR_SHOW_LINKS.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-dsr-orange/30 bg-cbc-surface hover:bg-cbc-elevated text-white font-heading font-bold text-xs uppercase tracking-wider rounded-sm transition-all duration-300"
                                    >
                                        <Play size={12} className="fill-current text-dsr-orange" /> {link.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Real-time YouTube Embed / Offline Card */}
                        <div className="w-full">
                            <DsrLiveStream />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── BROADCAST RECIRCULATION & SPOTIFY PLAYER ── */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                    {/* Wrestling News Feed */}
                    <div>
                        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-6 h-px bg-dsr-orange" />
                                    <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-dsr-orange">Wrestling Reports</span>
                                </div>
                                <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide">The Dirt Sheet Feed</h2>
                            </div>
                            <Link href="/wrestling" className="flex items-center gap-1.5 text-xs font-label font-bold uppercase tracking-wider text-dsr-orange hover:text-white transition-colors">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>

                        {recentWrestlingNews.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {recentWrestlingNews.map((item) => (
                                    <NewsCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 rounded-xl border border-dashed border-white/10 bg-cbc-surface/20 text-center">
                                <p className="text-sm text-cbc-muted">No recent wrestling articles found. Check back soon!</p>
                            </div>
                        )}
                    </div>

                    {/* Spotify Podcast Player & Episodes */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-px bg-dsr-orange" />
                                <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-dsr-orange">Spotify Player</span>
                            </div>
                            <div className="rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-cbc-darker/60 p-1">
                                <iframe 
                                    style={{ borderRadius: '12px' }} 
                                    src="https://open.spotify.com/embed/show/6JieQia6J6lQ8vU4Mj3djK?utm_source=generator&theme=0" 
                                    width="100%" 
                                    height="352" 
                                    frameBorder="0" 
                                    allowFullScreen 
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Recent show list */}
                        {recentEpisodes.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-6 h-px bg-dsr-orange" />
                                    <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-dsr-orange">Recent Audio Drops</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {recentEpisodes.map((ep) => (
                                        <Link 
                                            key={ep.id} 
                                            href={`/news/${ep.slug}`}
                                            className="group flex gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-dsr-orange/5 hover:border-dsr-orange/20 transition-all duration-200"
                                        >
                                            {ep.heroImage && (
                                                <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden">
                                                    <img src={ep.heroImage.url} alt={ep.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-cbc-faint font-mono">{formatDateShort(ep.publishDate)}</p>
                                                <h4 className="text-sm font-heading font-semibold text-white group-hover:text-dsr-orange transition-colors truncate">
                                                    {ep.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── THE HOSTS ── */}
            <div className="bg-[#0b0805] border-y border-white/5 py-20">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-8 h-px bg-dsr-orange" />
                        <span className="font-label text-[11px] font-bold tracking-[0.25em] uppercase text-dsr-orange">The Hosts</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                        {DSR_HOSTS.map((host) => (
                            <div key={host.name} className="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.01] hover:border-dsr-orange/20 transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-dsr-orange/10 border border-dsr-orange/20 flex items-center justify-center shrink-0">
                                    <Mic2 size={20} className="text-dsr-orange" />
                                </div>
                                <div>
                                    <p className="font-heading font-bold text-white">{host.name}</p>
                                    <p className="text-cbc-muted text-sm">{host.role}</p>
                                    <p className="font-mono text-[11px] text-dsr-orange mt-0.5">{host.handle}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
