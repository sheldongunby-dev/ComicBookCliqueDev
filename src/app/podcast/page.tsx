import { buildMetadata } from "@/lib/seo/metadata";
import { getPodcastEpisodes } from "@/lib/content";
import { PodcastCard } from "@/components/editorial/PodcastCard";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Mic, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Major Issues Podcast",
    description: "The #1 podcast covering the latest and greatest things to come to comic books and comic book media. We cover comics, movies, TV and more!",
    path: "/podcast",
});

export default async function PodcastPage() {
    const episodes = await getPodcastEpisodes();
    const latestEpisode = episodes[0];

    return (
        <>
            {/* Section hero */}
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-purple/10 via-transparent to-transparent" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-cbc-purple/5 rounded-full blur-3xl" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-px bg-cbc-purple" />
                                <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-purple">
                                    Major Issues Podcast
                                </span>
                            </div>
                            <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase mb-4">
                                The Major<br />Issues Podcast
                            </h1>
                            <p className="text-cbc-muted leading-relaxed mb-6 text-lg">
                                The #1 podcast covering the latest and greatest in comic books and comic book media. Comics, movies, TV, and more — with passionate opinions every week.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-cbc-purple hover:bg-cbc-purple/80 text-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm"
                                >
                                    <Mic size={16} /> Listen on Spotify
                                </a>
                                <a
                                    href="http://www.youtube.com/comicbookclique"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 border border-cbc-border hover:border-cbc-crimson/40 text-cbc-muted hover:text-cbc-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm"
                                >
                                    <ExternalLink size={14} /> YouTube
                                </a>
                            </div>
                        </div>

                        {/* Latest episode card */}
                        {latestEpisode && (
                            <div>
                                <PodcastCard episode={latestEpisode} variant="featured" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Episode archive */}
            <SectionShell background="dark">
                <SectionHeader
                    label="Episode Archive"
                    title="All Episodes"
                    description="418+ episodes and counting. Every major comic book moment, covered."
                    titleAccent="purple"
                />
                <FadeIn>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {episodes.map((ep) => (
                            <PodcastCard key={ep.id} episode={ep} variant="default" />
                        ))}
                    </div>
                </FadeIn>
            </SectionShell>
        </>
    );
}
