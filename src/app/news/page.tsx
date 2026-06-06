import { buildMetadata } from "@/lib/seo/metadata";
import { getNews } from "@/lib/content";
import { SectionShell } from "@/components/layout/SectionShell";
import { NewsList } from "./NewsList";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Comic & Geek Culture News — Comic Book Clique",
    description: "Breaking comic book news, publisher announcements, wrestling updates, gaming reports, and pop culture coverage from the Comic Book Clique team.",
    path: "/news",
});

export default async function NewsPage() {
    const allNews = await getNews();

    return (
        <>
            {/* Section hero */}
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-gold/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-cbc-gold/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-cbc-cyan/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-gold" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-gold">The Feed</span>
                    </div>
                    <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none text-cbc-white uppercase tracking-tight">What's Happening Now</h1>
                    <p className="text-cbc-muted mt-3 max-w-lg leading-relaxed font-body">
                        Breaking reports, publisher updates, wrestling scoops, and pop culture announcements. Filtered by category, sorted instantly.
                    </p>
                </div>
            </div>

            <SectionShell background="dark" halftone>
                <NewsList initialNews={allNews} />
            </SectionShell>
        </>
    );
}
