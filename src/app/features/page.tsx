import { buildMetadata } from "@/lib/seo/metadata";
import { getArticles } from "@/lib/content";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Major Articles — Features & Deep Dives",
    description: "In-depth features, interviews, editorial analysis, and spoiler coverage from the Comic Book Clique team.",
    path: "/features",
});

export default async function FeaturesPage() {
    const articles = await getArticles();
    const featured = articles.filter((a) => a.featured);
    const rest = articles.filter((a) => !a.featured);

    return (
        <>
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-cyan/5 via-transparent to-transparent" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-cyan" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-cyan">Major Articles</span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase">Editorial Deep Dives</h1>
                    <p className="text-cbc-muted mt-3 max-w-lg leading-relaxed">
                        Features, interviews, spoiler breakdowns, and analysis. The stories behind the stories.
                    </p>
                </div>
            </div>

            <SectionShell background="dark">
                {featured.length > 0 && (
                    <div className="mb-8">
                        <SectionHeader label="Featured" title="Editor's Picks" titleAccent="cyan" />
                        <FadeIn>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {featured.map((a) => <ArticleCard key={a.id} article={a} variant="featured" />)}
                            </div>
                        </FadeIn>
                    </div>
                )}

                {rest.length > 0 && (
                    <div>
                        <SectionHeader label="More" title="All Articles" titleAccent="cyan" />
                        <FadeIn>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
                            </div>
                        </FadeIn>
                    </div>
                )}
            </SectionShell>
        </>
    );
}
