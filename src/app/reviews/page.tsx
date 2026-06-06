import { buildMetadata } from "@/lib/seo/metadata";
import { getReviews } from "@/lib/content";
import { ReviewsList } from "./ReviewsList";
import { SectionShell } from "@/components/layout/SectionShell";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Major Reviews — Comic Book Clique",
    description: "Reviewing the latest and greatest comics on shelves today! Honest, passionate reviews from the Comic Book Clique team.",
    path: "/reviews",
});

export default async function ReviewsPage() {
    const reviews = await getReviews();

    return (
        <>
            {/* Section hero */}
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-16">
                {/* ── Ambient Background Glows ── */}
                <div className="absolute inset-0 bg-cbc-gradient opacity-40" />
                <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-cbc-cyan/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-[300px] h-[200px] bg-cbc-crimson/5 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-cyan" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-cyan">
                            Major Reviews
                        </span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase tracking-tight">
                        The Clique's Verdict
                    </h1>
                    <p className="text-cbc-muted mt-3 max-w-lg leading-relaxed font-body">
                        Honest, passionate reviews of the latest comics on shelves. No fluff, no filler — just real opinions from real fans.
                    </p>
                </div>
            </div>

            <SectionShell background="dark" halftone>
                <ReviewsList initialReviews={reviews} />
            </SectionShell>
        </>
    );
}

