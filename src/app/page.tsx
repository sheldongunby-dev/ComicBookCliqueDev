import { getFeaturedReviews, getReviews, getLatestNews, getPodcastEpisodes, getArticles, getNews } from "@/lib/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { EditorialHero } from "@/components/cinematic/EditorialHero";
import { ReviewCard } from "@/components/editorial/ReviewCard";
import { ArticleCard } from "@/components/editorial/ArticleCard";
import { PodcastCard } from "@/components/editorial/PodcastCard";
import { DsrCard } from "@/components/editorial/DsrCard";
import { InterviewCard } from "@/components/editorial/InterviewCard";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Newspaper, Mic, Zap, Gamepad2, Tv, ShoppingBag, Radio, Headphones } from "lucide-react";
import { formatDateShort } from "@/lib/utils/helpers";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/layout/NewsletterForm";


export const metadata: Metadata = buildMetadata();

const CATEGORY_HUBS = [
    { label: "Reviews", href: "/reviews", icon: Star, accentText: "text-cbc-crimson", accentBg: "bg-cbc-crimson/10", accentBorder: "border-cbc-crimson/20", hoverBorder: "hover:border-cbc-crimson/40", hoverBg: "group-hover:bg-cbc-crimson/20", description: "Detailed comic reviews" },
    { label: "Comic News", href: "/news", icon: Newspaper, accentText: "text-cbc-gold", accentBg: "bg-cbc-gold/10", accentBorder: "border-cbc-gold/20", hoverBorder: "hover:border-cbc-gold/40", hoverBg: "group-hover:bg-cbc-gold/20", description: "Breaking news" },
    { label: "Major Issues", href: "/podcast", icon: Mic, accentText: "text-cbc-purple", accentBg: "bg-cbc-purple/10", accentBorder: "border-cbc-purple/20", hoverBorder: "hover:border-cbc-purple/40", hoverBg: "group-hover:bg-cbc-purple/20", description: "The podcast" },
    { label: "Wrestling", href: "/wrestling", icon: Zap, accentText: "text-cbc-crimson", accentBg: "bg-cbc-crimson/10", accentBorder: "border-cbc-crimson/20", hoverBorder: "hover:border-cbc-crimson/40", hoverBg: "group-hover:bg-cbc-crimson/20", description: "Dirt Sheet Radio" },
    { label: "Gaming", href: "/gaming", icon: Gamepad2, accentText: "text-cbc-cyan", accentBg: "bg-cbc-cyan/10", accentBorder: "border-cbc-cyan/20", hoverBorder: "hover:border-cbc-cyan/40", hoverBg: "group-hover:bg-cbc-cyan/20", description: "Video game coverage" },
    { label: "Pop Culture", href: "/pop-culture", icon: Tv, accentText: "text-cbc-gold", accentBg: "bg-cbc-gold/10", accentBorder: "border-cbc-gold/20", hoverBorder: "hover:border-cbc-gold/40", hoverBg: "group-hover:bg-cbc-gold/20", description: "Movies & TV" },
];

export default async function HomePage() {
    const featuredReviews = await getFeaturedReviews();
    const latestNews = await getLatestNews(5);
    const podcastEpisodes = await getPodcastEpisodes();
    const topPodcasts = podcastEpisodes.slice(0, 4);
    
    const allReviews = await getReviews();
    const featuredList = allReviews.filter(r => r.featured);
    const topReviews = featuredList.length >= 9 ? featuredList : allReviews;
    
    const heroReviews = topReviews.slice(0, 3) as any[];
    const gridReviews = topReviews.slice(3, 9);
    
    const latestEpisode = topPodcasts[0];

    return (
        <>
            {/* ── Editorial Hero Carousel ── */}
            <EditorialHero featuredStories={heroReviews} />

            {/* ── News + Podcast Split ── */}
            <SectionShell background="darker" id="news-podcast">
                <div className="grid lg:grid-cols-[1fr_400px] gap-12">
                    {/* News column */}
                    <div>
                        <SectionHeader
                            label="Comic Book News"
                            title="What's Happening Now"
                            titleAccent="gold"
                            action={
                                <Link href="/news" className="flex items-center gap-2 text-sm font-label font-semibold tracking-widest uppercase text-cbc-gold hover:text-cbc-white transition-colors duration-200">
                                    All News <ArrowRight size={14} />
                                </Link>
                            }
                        />
                        <FadeIn>
                            <div className="flex flex-col gap-3">
                                {latestNews.map((item) => {
                                    const n = item as { id: string; slug: string; title: string; excerpt?: string; publishDate?: string; author?: { name: string }; heroImage?: { url: string; alt?: string }; breaking?: boolean; tags?: string[] };
                                    return (
                                        <Link
                                            key={n.id}
                                            href={`/news/${n.slug}`}
                                            className="group flex gap-3 p-3 rounded-card border border-cbc-border hover:border-cbc-gold/30 bg-cbc-surface hover:bg-cbc-elevated transition-all duration-200"
                                        >
                                            {n.heroImage && (
                                                <div className="relative w-16 h-12 shrink-0 rounded-cbc overflow-hidden bg-cbc-charcoal">
                                                    <Image src={n.heroImage.url} alt={n.heroImage.alt || n.title} fill className="object-cover" sizes="64px" />
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0 gap-0.5">
                                                {n.breaking && (
                                                    <span className="tag-chip inline-flex w-fit bg-cbc-crimson/80 text-white text-[9px]">Breaking</span>
                                                )}
                                                <h4 className="text-sm font-heading font-semibold text-cbc-white line-clamp-2 leading-snug group-hover:text-cbc-gold transition-colors duration-200">
                                                    {n.title}
                                                </h4>
                                                {n.publishDate && (
                                                    <time dateTime={n.publishDate} className="text-xs text-cbc-faint font-label">
                                                        {formatDateShort(n.publishDate)}
                                                    </time>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </FadeIn>
                    </div>

                    {/* Latest Podcast */}
                    <div>
                        <SectionHeader
                            label="Major Issues Podcast"
                            title="Latest Episode"
                            titleAccent="purple"
                            action={
                                <Link href="/podcast" className="flex items-center gap-2 text-sm font-label font-semibold tracking-widest uppercase text-cbc-purple hover:text-cbc-white transition-colors duration-200">
                                    All Episodes <ArrowRight size={14} />
                                </Link>
                            }
                        />
                        <FadeIn delay={0.1}>
                            {latestEpisode && (
                                <PodcastCard episode={latestEpisode} variant="featured" />
                            )}
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {podcastEpisodes.slice(1, 3).map((ep) => (
                                    <PodcastCard key={ep.id} episode={ep} variant="compact" />
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </SectionShell>

            {/* ── Featured Reviews ── */}
            <SectionShell id="reviews" background="dark">
                <SectionHeader
                    label="Major Reviews"
                    title="The Clique's Verdict"
                    titleAccent="crimson"
                    action={
                        <Link
                            href="/reviews"
                            className="flex items-center gap-2 text-sm font-label font-semibold tracking-widest uppercase text-cbc-crimson hover:text-cbc-white transition-colors duration-200"
                        >
                            All Reviews <ArrowRight size={14} />
                        </Link>
                    }
                />
                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gridReviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </FadeIn>
            </SectionShell>

            {/* ── Features ── */}
            <SectionShell background="darker" id="features">
                <SectionHeader
                    label="Explore"
                    title="The Clique Universe"
                    description="Every corner of fandom culture, covered by passionate fans."
                    titleAccent="gold"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {CATEGORY_HUBS.map(({ label, href, icon: Icon, accentText, accentBg, accentBorder, hoverBorder, hoverBg, description }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`group flex flex-col items-center gap-3 p-5 rounded-card bg-cbc-surface border border-cbc-border ${hoverBorder} transition-all duration-300 text-center`}
                        >
                            <div className={`w-12 h-12 rounded-full ${accentBg} flex items-center justify-center border ${accentBorder} ${hoverBg} transition-colors duration-300`}>
                                <Icon size={22} className={accentText} />
                            </div>
                            <div>
                                <div className={`text-sm font-heading font-semibold text-cbc-white group-hover:${accentText} transition-colors duration-200`}>{label}</div>
                                <div className="text-xs text-cbc-faint mt-0.5">{description}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </SectionShell>

            {/* ── Dirt Sheet Radio Spotlight ── */}
            <div className="relative overflow-hidden bg-[#0d0900] border-y border-dsr-orange/15 py-16 sm:py-24" id="dsr">
                {/* BG glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-dsr-orange/8 to-transparent" />
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-cbc-crimson/5 rounded-full blur-3xl" />
                </div>
                {/* Waveform decoration */}
                <div className="absolute right-0 top-0 bottom-0 flex items-end gap-[2px] px-8 opacity-10 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="rounded-full bg-dsr-orange animate-waveform"
                            style={{ width: "2px", height: `${15 + Math.sin(i * 0.4) * 50 + 30}%`, animationDelay: `${(i * 0.06) % 1.2}s`, animationDuration: `${0.9 + (i % 4) * 0.1}s` }} />
                    ))}
                </div>

                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="grid lg:grid-cols-[1fr_480px] gap-12 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex items-center gap-2 px-3 py-1.5 border border-dsr-orange/40 rounded-sm bg-dsr-orange/10">
                                    <span className="w-2 h-2 rounded-full bg-dsr-orange animate-on-air" />
                                    <Radio size={12} className="text-dsr-orange" />
                                    <span className="font-label text-[10px] font-bold tracking-[0.25em] uppercase text-dsr-orange">Now Broadcasting</span>
                                </span>
                            </div>
                            <h2 className="font-display text-display-xl text-white uppercase leading-none mb-4">
                                Dirt Sheet<br />
                                <span className="text-dsr-orange [text-shadow:0_0_40px_rgba(255,107,0,0.4)]">Radio</span>
                            </h2>
                            <p className="text-cbc-muted text-lg leading-relaxed mb-8 max-w-lg">
                                Wrestling{"'"}s most unfiltered commentary show. Hot takes, live reactions, and the real dirt on pro wrestling — every week.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/dirtsheetradio"
                                    className="flex items-center gap-2 px-6 py-3 bg-dsr-orange hover:bg-dsr-orange-dim text-white font-heading font-bold tracking-wide rounded-sm transition-all duration-300 text-sm shadow-glow-orange"
                                >
                                    <Radio size={16} /> Enter DSR Hub
                                </Link>
                                <Link
                                    href="/reviews/podcast"
                                    className="flex items-center gap-2 px-6 py-3 border border-pod-teal/40 text-pod-teal hover:bg-pod-teal hover:text-black font-heading font-bold tracking-wide rounded-sm transition-all duration-300 text-sm"
                                >
                                    <Headphones size={16} /> Podcast Reviews
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {topPodcasts.slice(0, 3).map((ep) => (
                                <DsrCard key={ep.id} episode={ep} variant="list" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Merch Spotlight ── */}
            <SectionShell background="dark" id="merch">
                <div className="relative overflow-hidden rounded-card border border-cbc-border bg-gradient-to-br from-cbc-surface via-cbc-charcoal to-cbc-darker p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
                    <div className="absolute inset-0 halftone opacity-20 rounded-card pointer-events-none" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cbc-gold/5 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative max-w-xl flex-1 text-center lg:text-left">
                        <span className="tag-chip bg-cbc-gold/20 border border-cbc-gold/30 text-cbc-gold mb-4 inline-flex items-center mx-auto lg:mx-0">
                            <ShoppingBag size={12} className="mr-1.5" />
                            Official Merch
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl lg:text-display-lg text-cbc-white leading-tight mb-4 drop-shadow-lg">
                            Rep The Clique
                        </h2>
                        <p className="text-lg text-cbc-muted leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
                            Official Comic Book Clique merchandise. Tees, hoodies, and collector items for the real fans. Show your colors.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <a
                                href="https://www.teepublic.com/stores/comicbook-clique?utm_campaign=9513&utm_medium=affiliate&utm_source=ComicBook%2BClique"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 bg-cbc-gold hover:bg-cbc-gold-dim text-cbc-black font-heading font-bold uppercase tracking-widest rounded-cbc transition-all duration-300 shadow-cbc-gold text-sm flex items-center gap-2 group"
                            >
                                Shop TeePublic
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="relative flex-1 w-full max-w-lg mx-auto grid grid-cols-2 gap-4 lg:gap-6">
                        {/* We The Worthy Tee */}
                        <a 
                            href="https://www.teepublic.com/t-shirt/59681125-acknowledge-the-motto?store_id=222268" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group relative aspect-[4/5] rounded-xl bg-cbc-darker border border-cbc-border overflow-hidden flex flex-col items-center justify-center hover:border-cbc-gold/40 transition-colors shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/95 via-cbc-black/25 to-transparent z-10 flex flex-col justify-end p-5 transition-opacity duration-300">
                                <span className="text-cbc-white font-heading text-sm text-center uppercase tracking-wider group-hover:text-cbc-gold transition-colors">We The Worthy Tee</span>
                            </div>
                            <Image 
                                src="https://images.teepublic.com/derived/production/designs/59681125_2/1714066412/i_p:c_191919,s_313,q_90.jpg" 
                                alt="We The Worthy Tee" 
                                fill 
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
                                sizes="(max-width: 640px) 50vw, 25vw"
                                loading="lazy" 
                            />
                        </a>

                        {/* Red Guardian Limo Service Tee */}
                        <a 
                            href="https://www.teepublic.com/t-shirt/74864888-red-guardian-limo-service?store_id=222268" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group relative aspect-[4/5] rounded-xl bg-cbc-darker border border-cbc-border overflow-hidden flex flex-col items-center justify-center hover:border-cbc-crimson/40 transition-colors shadow-xl lg:translate-y-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/95 via-cbc-black/25 to-transparent z-10 flex flex-col justify-end p-5 transition-opacity duration-300">
                                <span className="text-cbc-white font-heading text-sm text-center uppercase tracking-wider group-hover:text-cbc-crimson transition-colors">Red Guardian Tee</span>
                            </div>
                            <Image 
                                src="https://images.teepublic.com/derived/production/designs/74864888_2/1746412153/i_p:c_6e2229,s_313,q_90.jpg" 
                                alt="Red Guardian Limo Service Tee" 
                                fill 
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" 
                                sizes="(max-width: 640px) 50vw, 25vw"
                                loading="lazy" 
                            />
                        </a>
                    </div>
                </div>
            </SectionShell>

            {/* ── Newsletter ── */}
            <SectionShell background="darker" id="community">
                <div className="text-center max-w-2xl mx-auto">
                    <FadeIn>
                        <span className="tag-chip bg-cbc-crimson/20 border border-cbc-crimson/30 text-cbc-crimson mb-4 inline-flex">
                            Join the Clique
                        </span>
                        <h2 className="font-display text-display-lg text-cbc-white leading-tight mb-3">
                            Stay in the Loop
                        </h2>
                        <p className="text-cbc-muted leading-relaxed mb-8">
                            Comic book spoilers, podcast episodes, and fandom culture. All the things worth knowing.
                        </p>
                        <NewsletterForm />
                        <p className="text-xs text-cbc-faint mt-3">No spam. Just comics.</p>

                    </FadeIn>
                </div>
            </SectionShell>

            {/* ── Sponsor Block ── */}
            <SectionShell background="dark" id="sponsors">
                <div className="border border-dashed border-cbc-border rounded-card p-8 text-center">
                    <p className="text-sm text-cbc-faint font-label tracking-widest uppercase mb-2">Partner With Us</p>
                    <h3 className="text-cbc-muted font-heading text-lg mb-3">Reach the Fandom</h3>
                    <p className="text-xs text-cbc-faint max-w-sm mx-auto mb-4">
                        Comic Book Clique reaches thousands of passionate comic readers and pop culture fans weekly.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-cbc-border hover:border-cbc-gold/40 text-sm font-heading font-semibold text-cbc-muted hover:text-cbc-gold rounded-cbc transition-all duration-300 tracking-wide"
                    >
                        Sponsorship Inquiries <ArrowRight size={14} />
                    </Link>
                </div>
            </SectionShell>
        </>
    );
}
