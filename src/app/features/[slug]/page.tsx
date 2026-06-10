import { getArticleBySlug, getArticles } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableTextContent } from "@/components/editorial/PortableTextContent";
import { formatDateShort } from "@/lib/utils/helpers";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SectionShell } from "@/components/layout/SectionShell";

interface Props {
    params: Promise<{ slug: string }>;
}

// Generate static params for all articles
export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.slice(0, 50).map((article) => ({
        slug: article.slug,
    }));
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-cbc-surface pb-24">
            {/* Hero Section */}
            <div className="relative w-full h-[60vh] min-h-[500px] max-h-[800px] bg-cbc-darker">
                {article.heroImage && (
                    <Image
                        src={article.heroImage.url}
                        alt={article.heroImage.alt || article.title}
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                        priority
                    />
                )}
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_-100px_100px_rgba(10,12,16,1)] pointer-events-none" />
                
                {/* Back Button */}
                <div className="absolute top-24 left-4 sm:left-8 z-20">
                    <Link 
                        href="/features" 
                        className="inline-flex items-center gap-2 text-sm font-label uppercase tracking-widest text-cbc-muted hover:text-cbc-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Features
                    </Link>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-20 z-10 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cbc-cyan/20 border border-cbc-cyan/30 text-cbc-cyan text-xs font-label font-bold tracking-widest uppercase rounded-sm backdrop-blur-sm">
                                Feature
                            </span>
                            {article.publishDate && (
                                <time className="text-cbc-faint text-sm font-mono tracking-wider">
                                    {formatDateShort(article.publishDate)}
                                </time>
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-white leading-[1.05] tracking-tight mb-4 drop-shadow-2xl">
                            {article.title}
                        </h1>
                        {article.author && (
                            <p className="text-cbc-muted font-heading font-medium tracking-wide">
                                By <span className="text-cbc-white">{article.author.name}</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body with Cinematic Reading Sheet */}
            <div className="relative z-10 -mt-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-cbc-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                    
                    <div className="card-cinematic bg-cbc-darker/65 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
                        <div className="px-5 sm:px-12 py-10 sm:py-20">
                            <PortableTextContent value={(article as any).content} />
                        </div>
                    </div>

                    {/* Recirculation Trigger */}
                    <div className="mt-16 text-center">
                        <Link 
                            href="/features"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-white hover:border-cbc-cyan/50 rounded-cbc transition-all duration-300 font-label tracking-widest uppercase text-sm"
                        >
                            Explore More Features <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
