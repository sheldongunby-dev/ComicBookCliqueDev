import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata, articleJsonLd } from "@/lib/seo/metadata";
import { getReviewBySlug, getReviews } from "@/lib/content";
import { formatDate } from "@/lib/utils/helpers";
import { SectionShell } from "@/components/layout/SectionShell";
import { ReviewCard } from "@/components/editorial/ReviewCard";
import { PortableTextContent } from "@/components/editorial/PortableTextContent";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";


interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const reviews = await getReviews();
    return reviews.slice(0, 50).map((r) => ({ slug: r.slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const review = await getReviewBySlug(slug);
    if (!review) return buildMetadata({ noIndex: true });

    return buildMetadata({
        title: review.title,
        description: review.excerpt,
        image: review.heroImage?.url,
        path: `/reviews/${slug}`,
        type: "article",
        publishDate: review.publishDate,
        author: review.author?.name,
    });
}

export default async function ReviewDetailPage({ params }: Props) {
    const { slug } = await params;
    const review = await getReviewBySlug(slug);
    if (!review) notFound();

    const allReviews = await getReviews();
    const related = allReviews.filter((r) => r.id !== review.id).slice(0, 3);

    const jsonLd = articleJsonLd({
        title: review.title,
        description: review.excerpt,
        image: review.heroImage?.url,
        publishDate: review.publishDate,
        authorName: review.author?.name,
        url: review.canonicalUrl,
    });

    const ratingColor =
        (review.rating ?? 0) >= 9 ? "text-cbc-gold" :
            (review.rating ?? 0) >= 7.5 ? "text-cbc-cyan" :
                "text-cbc-muted";

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <div className="relative min-h-[50vh] flex items-end bg-cbc-darker pt-24">
                {review.heroImage && (
                    <div className="absolute inset-0">
                        <Image
                            src={review.heroImage.url}
                            alt={review.heroImage.alt || review.title}
                            fill
                            className="object-cover opacity-20"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cbc-darker via-cbc-darker/80 to-cbc-darker/30" />
                    </div>
                )}
                <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 pb-12 w-full">
                    {/* Breadcrumb */}
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-cbc-faint font-label mb-6">
                        <Link href="/" className="hover:text-cbc-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/reviews" className="hover:text-cbc-white transition-colors">Reviews</Link>
                        <span>/</span>
                        <span className="text-cbc-muted">{review.title}</span>
                    </nav>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="tag-chip bg-cbc-crimson/90 text-white">Review</span>
                        {review.publisher && (
                            <span className="tag-chip bg-cbc-elevated border border-cbc-border text-cbc-muted">
                                {review.publisher}
                            </span>
                        )}
                        {review.tags?.slice(0, 2).slice(0, 50).map((tag) => (
                            <span key={tag} className="tag-chip bg-cbc-elevated border border-cbc-border text-cbc-muted">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-cbc-white leading-tight mb-4 max-w-4xl">
                        {review.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {review.author && (
                            <span className="text-cbc-muted font-label font-medium">By {review.author.name}</span>
                        )}
                        {review.publishDate && (
                            <time dateTime={review.publishDate} className="text-cbc-faint">
                                {formatDate(review.publishDate)}
                            </time>
                        )}
                        {review.rating !== undefined && (
                            <div className={`font-mono font-bold text-2xl ${ratingColor}`}>
                                {review.rating.toFixed(1)}<span className="text-sm text-cbc-faint">/10</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body with Cinematic Reading Sheet */}
            <div className="relative z-10 -mt-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-cbc-gold/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                    
                    <div className="card-cinematic bg-cbc-darker/65 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden">
                        <div className="px-5 sm:px-12 py-10 sm:py-20">
                            <div className="max-w-3xl mx-auto">
                                {/* Lead excerpt */}
                                {review.excerpt && (
                                    <p className="text-2xl text-cbc-white/90 font-heading leading-tight mb-12 border-l-4 border-cbc-crimson pl-8 italic">
                                        {review.excerpt}
                                    </p>
                                )}

                                <PortableTextContent value={(review as any).content} />

                                {/* Rating verdict */}
                                {review.rating !== undefined && (
                                    <div className="mt-16 p-8 bg-cbc-surface/50 border border-white/5 rounded-2xl backdrop-blur-sm shadow-inner">
                                        <div className="flex items-center justify-between gap-6 flex-wrap">
                                            <div>
                                                <p className="font-label text-xs tracking-[0.2em] uppercase text-cbc-muted mb-2">Final Verdict</p>
                                                <p className="font-heading text-2xl font-bold text-cbc-white">
                                                    {review.verdict || (review.rating >= 9 ? "Essential" : review.rating >= 7.5 ? "Recommended" : review.rating >= 6 ? "Worth Reading" : "Skip It")}
                                                </p>
                                            </div>
                                            <div className={`font-mono font-bold text-6xl ${ratingColor} drop-shadow-[0_0_15px_rgba(245,166,35,0.3)]`}>
                                                {review.rating.toFixed(1)}
                                                <span className="text-xl text-cbc-faint">/10</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recirculation Trigger */}
                    <div className="mt-16 text-center">
                        <Link 
                            href="/reviews"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-white hover:border-cbc-gold/50 rounded-cbc transition-all duration-300 font-label tracking-widest uppercase text-sm"
                        >
                            Read More Reviews <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related reviews */}
            {related.length > 0 && (
                <SectionShell background="darker">
                    <h2 className="font-heading text-xl font-bold text-cbc-white mb-6">More Reviews</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {related.slice(0, 50).map((r) => (
                            <ReviewCard key={r.id} review={r} variant="compact" />
                        ))}
                    </div>
                </SectionShell>
            )}
        </>
    );
}
