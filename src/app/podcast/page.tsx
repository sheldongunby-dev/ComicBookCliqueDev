import { buildMetadata } from "@/lib/seo/metadata";
import { getLatestEpisodeByCategory, getPodcastEpisodesByCategory } from "@/lib/content";
import { PodcastCard } from "@/components/editorial/PodcastCard";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Mic, Radio, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Podcasts — Comic Book Clique",
    description: "All podcasts from the Comic Book Clique network. Major Issues covers comics, movies, and TV. Dirt Sheet Radio delivers unfiltered wrestling commentary.",
    path: "/podcast",
});

export default async function PodcastHubPage() {
    const [miEpisodes, dsrEpisodes] = await Promise.all([
        getPodcastEpisodesByCategory('major-issues'),
        getPodcastEpisodesByCategory('dirt-sheet-radio'),
    ]);

    const latestMI = miEpisodes[0];
    const latestDSR = dsrEpisodes[0];

    // Combine and sort all recent episodes for the mixed feed
    const allRecent = [...miEpisodes.slice(0, 8), ...dsrEpisodes.slice(0, 8)]
        .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        .slice(0, 12);

    return (
        <>
            {/* Hub Hero */}
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-purple/10 via-transparent to-dsr-orange/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-cbc-purple/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-dsr-orange/5 rounded-full blur-3xl" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-px bg-cbc-purple" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-purple">
                            CBC Podcast Network
                        </span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase mb-4">
                        Podcasts
                    </h1>
                    <p className="text-cbc-muted leading-relaxed mb-6 text-lg max-w-2xl">
                        Two shows. Two lanes. Major Issues covers comics, movies, and TV. Dirt Sheet Radio covers wrestling. Both unfiltered.
                    </p>
                </div>
            </div>

            {/* Show Cards — AIPT-style show selector */}
            <SectionShell background="dark">
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {/* Major Issues Card */}
                    <Link 
                        href="/major-issues"
                        className="group relative overflow-hidden rounded-2xl border border-white/5 hover:border-cbc-purple/30 bg-cbc-surface transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cbc-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cbc-purple/10 border border-cbc-purple/20 flex items-center justify-center">
                                    <Mic size={22} className="text-cbc-purple" />
                                </div>
                                <div>
                                    <Image 
                                        src="/images/brand/major-issues-logo.png" 
                                        alt="Major Issues" 
                                        width={200} 
                                        height={100} 
                                        className="h-8 w-auto mb-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                    />
                                    <p className="text-cbc-muted text-sm">Comics • Movies • TV</p>
                                </div>
                            </div>
                            <p className="text-cbc-muted text-sm leading-relaxed mb-4">
                                The #1 podcast covering comic books and comic book media. 418+ episodes and counting.
                            </p>
                            {latestMI && (
                                <div className="flex items-center gap-2 text-xs text-cbc-faint font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cbc-purple" />
                                    Latest: {latestMI.title.length > 50 ? latestMI.title.slice(0, 50) + '...' : latestMI.title}
                                </div>
                            )}
                            <div className="mt-6 flex items-center gap-2 text-cbc-purple font-label text-xs uppercase tracking-wider font-bold group-hover:gap-3 transition-all">
                                Browse Episodes <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>

                    {/* Dirt Sheet Radio Card */}
                    <Link 
                        href="/dirtsheetradio"
                        className="group relative overflow-hidden rounded-2xl border border-white/5 hover:border-dsr-orange/30 bg-cbc-surface transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-dsr-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-dsr-orange/10 border border-dsr-orange/20 flex items-center justify-center">
                                    <Radio size={22} className="text-dsr-orange" />
                                </div>
                                <div>
                                    <Image 
                                        src="/images/brand/cbc-dsr-banner.png" 
                                        alt="Dirt Sheet Radio" 
                                        width={200} 
                                        height={100} 
                                        className="h-8 w-auto mb-1 drop-shadow-[0_0_10px_rgba(255,107,0,0.35)]" 
                                    />
                                    <p className="text-cbc-muted text-sm">Wrestling • Live • Unfiltered</p>
                                </div>
                            </div>
                            <p className="text-cbc-muted text-sm leading-relaxed mb-4">
                                Wrestling{"'"}s most unfiltered commentary. Live reactions, hot takes, and breaking reports.
                            </p>
                            {latestDSR && (
                                <div className="flex items-center gap-2 text-xs text-cbc-faint font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-dsr-orange" />
                                    Latest: {latestDSR.title.length > 50 ? latestDSR.title.slice(0, 50) + '...' : latestDSR.title}
                                </div>
                            )}
                            <div className="mt-6 flex items-center gap-2 text-dsr-orange font-label text-xs uppercase tracking-wider font-bold group-hover:gap-3 transition-all">
                                Browse Episodes <ArrowRight size={14} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Combined Recent Feed */}
                <SectionHeader
                    label="All Shows"
                    title="Recent Episodes"
                    description="Latest drops across the CBC podcast network."
                    titleAccent="purple"
                />
                <FadeIn>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {allRecent.map((ep) => (
                            <PodcastCard key={ep.id} episode={ep} variant="default" />
                        ))}
                    </div>
                </FadeIn>
            </SectionShell>
        </>
    );
}
