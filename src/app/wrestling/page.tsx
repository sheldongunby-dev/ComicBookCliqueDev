import { buildMetadata } from "@/lib/seo/metadata";
import { getNews } from "@/lib/content";
import { SectionShell } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils/helpers";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Wrestling & Dirt Sheet Radio",
    description: "Pro wrestling coverage, rumors, and Dirt Sheet Radio podcast.",
    path: "/wrestling",
});

export default async function WrestlingPage() {
    const allNews = await getNews();
    const wrestlingNews = allNews.filter(n => n.category === 'wrestling').sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    return (
        <>
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-crimson/5 via-transparent to-transparent" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-crimson" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-crimson">Wrestling</span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase">Inside the Ring</h1>
                    <p className="text-cbc-muted mt-3 max-w-lg leading-relaxed">
                        Dirt Sheet Radio, industry shoot interviews, and pro wrestling coverage.
                    </p>
                </div>
            </div>

            <SectionShell background="dark">
                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {wrestlingNews.map((item) => {
                            const i = item as any;
                            return (
                                <Link key={i.id} href={`/news/${i.slug}`} className="group card-cinematic hover:bg-cbc-crimson/5 overflow-hidden block border border-cbc-border/50">
                                    {i.heroImage && (
                                        <div className="relative aspect-[16/9] overflow-hidden bg-cbc-charcoal">
                                            <Image src={i.heroImage.url} alt={i.heroImage.alt || i.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/70 via-transparent to-transparent" />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-crimson transition-colors duration-300 mb-2">
                                            {i.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-cbc-faint font-label">
                                            {i.author && <span className="text-cbc-muted font-medium">{i.author.name}</span>}
                                            {i.publishDate && (<><span>·</span><time dateTime={i.publishDate}>{formatDateShort(i.publishDate)}</time></>)}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    {wrestlingNews.length === 0 && <p className="text-cbc-muted mt-8 text-center">No posts yet.</p>}
                </FadeIn>
            </SectionShell>
        </>
    );
}
