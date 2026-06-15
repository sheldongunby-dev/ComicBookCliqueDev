import { buildMetadata } from "@/lib/seo/metadata";
import { getPodcastEpisodesByCategory } from "@/lib/content";
import { PodcastCard } from "@/components/editorial/PodcastCard";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Mic, ArrowRight, Radio, Star, Landmark, Layers } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = buildMetadata({
    title: "Major Issues Podcast — Comic Book Clique",
    description: "The official Comic Book Clique podcast. Weekly reviews, hot takes, and discussions on comic books, movies, TV, and pop culture.",
    path: "/major-issues",
});

export default async function MajorIssuesPage() {
    const episodes = await getPodcastEpisodesByCategory('major-issues');
    const latestEpisode = episodes[0];
    const archiveEpisodes = episodes.slice(1);

    return (
        <div className="min-h-screen bg-cbc-black pb-24">
            {/* Cinematic Hero */}
            <div className="relative pt-32 pb-20 border-b border-cbc-border overflow-hidden bg-gradient-to-b from-[#110A1A] via-cbc-black to-cbc-black">
                {/* Visual Glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cbc-purple/10 rounded-full blur-[120px]" />
                    <div className="absolute left-1/4 bottom-0 w-[300px] h-[300px] bg-cbc-cyan/5 rounded-full blur-[100px]" />
                </div>
                
                {/* Halftone texture overlay */}
                <div className="absolute inset-0 halftone opacity-[0.05] pointer-events-none" />

                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 z-10">
                    <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-center">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cbc-purple/10 border border-cbc-purple/20 text-cbc-purple text-xs font-label font-bold tracking-[0.2em] uppercase rounded-sm">
                                    <Mic size={12} /> Comic Book Podcast
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-cbc-purple animate-pulse" />
                                <span className="text-cbc-faint text-xs font-mono tracking-widest uppercase">Weekly Show</span>
                            </div>
                            <div className="mb-6 max-w-[400px]">
                                <Image 
                                    src="/images/brand/major-issues-logo.png" 
                                    alt="Major Issues Podcast" 
                                    width={800} 
                                    height={400} 
                                    className="w-full h-auto drop-shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                                    priority
                                />
                                <h1 className="sr-only">Major Issues</h1>
                            </div>
                            <p className="text-cbc-muted text-lg sm:text-xl leading-relaxed mb-8">
                                Comic Book Clique{"'"}s flagship show. Join the crew every week as they dissect the biggest stories in comic books, review the latest Marvel/DC drops, and track the expansion of comic book media.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-cbc-purple hover:bg-cbc-purple/90 text-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm flex items-center gap-2 shadow-lg"
                                >
                                    Listen on Spotify
                                </a>
                                <a
                                    href="https://podcasts.apple.com/us/podcast/major-issues-podcast/id1321720972"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 border border-cbc-border hover:border-cbc-purple/40 text-cbc-muted hover:text-cbc-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm flex items-center gap-2"
                                >
                                    Apple Podcasts
                                </a>
                            </div>
                        </div>

                        {/* Featured Episode Display */}
                        {latestEpisode && (
                            <div className="w-full">
                                <div className="text-center sm:text-left mb-3">
                                    <span className="tag-chip bg-cbc-purple/20 text-cbc-purple border border-cbc-purple/30">
                                        Latest Broadcast
                                    </span>
                                </div>
                                <div className="relative group rounded-2xl overflow-hidden border border-cbc-border bg-cbc-darker hover:border-cbc-purple/40 transition-all duration-300 shadow-2xl">
                                    {/* Link wrapper for the featured episode */}
                                    <Link href={`/major-issues/${latestEpisode.slug}`} className="block">
                                        <PodcastCard episode={latestEpisode} variant="featured" />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Episode Archive List */}
            <SectionShell background="dark" id="archive">
                <div className="max-w-screen-2xl mx-auto">
                    <SectionHeader
                        label="Full Broadcast History"
                        title="The Major Issues Library"
                        description={`${episodes.length}+ episodes of pure comic book debate, theories, and analysis.`}
                        titleAccent="purple"
                    />

                    <FadeIn>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {archiveEpisodes.map((ep) => (
                                <Link key={ep.id} href={`/major-issues/${ep.slug}`} className="block group">
                                    <PodcastCard episode={ep} variant="default" />
                                </Link>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </SectionShell>
        </div>
    );
}
