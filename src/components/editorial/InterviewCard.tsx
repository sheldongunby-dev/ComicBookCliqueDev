import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageSquare } from "lucide-react";
import { formatDateShort } from "@/lib/utils/helpers";
import type { Article } from "@/lib/schema/article.schema";

export function InterviewCard({ article, variant = "split" }: { article: Article, variant?: "split" | "hero" | "compact" }) {
    if (variant === "hero") {
        return (
            <Link href={`/features/${article.slug}`} className="group relative block w-full overflow-hidden rounded-xl bg-cbc-charcoal">
                <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/90 via-cbc-black/40 to-transparent z-10" />
                {article.heroImage && (
                    <>
                        <Image
                            src={article.heroImage.url}
                            alt=""
                            fill
                            className="object-cover opacity-30 blur-2xl scale-110 pointer-events-none"
                        />
                        <Image
                            src={article.heroImage.url}
                            alt={article.heroImage.alt || article.title}
                            fill
                            className="object-contain object-center lg:object-right transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </>
                )}
                
                <div className="relative z-20 flex flex-col justify-end h-full min-h-[500px] p-6 sm:p-10 lg:p-14">
                    <div className="max-w-3xl">
                        <div className="mb-6 relative">
                            <Image 
                                src="/images/brand/cbc-logo-med.png" 
                                alt="Comic Book Clique" 
                                width={160}
                                height={48}
                                className="h-10 w-auto object-contain drop-shadow-lg"
                            />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cbc-crimson text-white text-xs font-label font-bold tracking-widest uppercase rounded-sm">
                                <MessageSquare size={12} className="fill-current" />
                                Exclusive Interview
                            </span>
                            {article.publishDate && (
                                <time className="text-white/70 text-sm font-mono">{formatDateShort(article.publishDate)}</time>
                            )}
                        </div>
                        
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-white leading-[0.9] mb-4 group-hover:text-cbc-crimson transition-colors duration-300">
                            {article.title.replace(/^EXCLUSIVE:\s*/i, '')}
                        </h2>
                        
                        {article.excerpt && (
                            <p className="text-lg sm:text-xl text-cbc-white/80 font-body leading-relaxed max-w-2xl mb-6">
                                {article.excerpt}
                            </p>
                        )}
                        
                        <div className="inline-flex items-center gap-2 font-heading font-semibold text-cbc-crimson tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                            Read the full interview <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Default 'split' variant for within page flows
    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-center p-6 lg:p-10 card-cinematic card-cinematic-crimson">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 text-cbc-crimson text-xs font-label font-bold tracking-widest uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cbc-crimson animate-pulse" />
                        Exclusive Interview
                    </span>
                    <div className="h-px w-10 bg-cbc-border" />
                    {article.publishDate && (
                        <time className="text-cbc-faint text-xs font-mono">{formatDateShort(article.publishDate)}</time>
                    )}
                </div>
                
                <Link href={`/features/${article.slug}`} className="group block space-y-4">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display text-cbc-white leading-[1.05] group-hover:text-cbc-crimson transition-colors duration-300">
                        {article.title.replace(/^EXCLUSIVE:\s*/i, '')}
                    </h3>
                    
                    {article.excerpt && (
                        <p className="text-cbc-muted font-body leading-relaxed max-w-xl">
                            {article.excerpt}
                        </p>
                    )}
                    
                    <div className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-cbc-white group-hover:text-cbc-crimson transition-colors duration-300 mt-2">
                        Read full conversation <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                    </div>
                </Link>
            </div>
            
            {article.heroImage && (
                <Link href={`/features/${article.slug}`} className="relative w-full md:w-1/3 aspect-[4/5] md:aspect-square overflow-hidden rounded-md flex-shrink-0 group">
                    <Image
                        src={article.heroImage.url}
                        alt={article.heroImage.alt || article.title}
                        fill
                        className="object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                    />
                    {/* Vignette overlay for cinematic shadow */}
                    <div className="absolute inset-0 shadow-[inset_0_-20px_50px_rgba(0,0,0,0.8)] pointer-events-none" />
                </Link>
            )}
        </div>
    );
}
