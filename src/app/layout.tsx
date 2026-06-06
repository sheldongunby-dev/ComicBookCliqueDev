import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { LiveTicker } from "@/components/cinematic/LiveTicker";
import { buildMetadata, organizationJsonLd } from "@/lib/seo/metadata";
import { AccessibilityProvider } from "@/lib/context/AccessibilityContext";
import { AccessibilityPanel } from "@/components/layout/AccessibilityPanel";
import { getLatestNews, getReviews, getArticles } from "@/lib/content";
import Image from "next/image";

export const metadata: Metadata = buildMetadata();

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const orgSchema = organizationJsonLd();
    let headlines: any[] = [];
    try {
            const latestNews = await getLatestNews(10);
            const reviews = await getReviews();
            const latestReviews = reviews.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 10);
            const articles = await getArticles();
            const latestArticles = articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 10);

            headlines = [
                ...latestNews.map(n => ({
                    label: (n as any).breaking ? "BREAKING" : "NEWS",
                    text: n.title,
                    href: `/news/${n.slug}`,
                    image: n.heroImage?.url || null,
                    date: n.publishDate
                })),
                ...latestReviews.map(r => ({
                    label: "REVIEW",
                    text: r.title,
                    href: `/reviews/${r.slug}`,
                    image: r.heroImage?.url || null,
                    date: r.publishDate
                })),
                ...latestArticles.map(a => ({
                    label: "FEATURE",
                    text: a.title,
                    href: `/features/${a.slug}`,
                    image: a.heroImage?.url || null,
                    date: a.publishDate
                }))
            ]
                .filter(h => h.image)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 12);
        } catch (e) {
            console.error("Failed to build dynamic ticker headlines:", e);
        }

    return (
        <html lang="en" className="dark scroll-smooth">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Rajdhani:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
                />
            </head>
            <body className="bg-cbc-black text-cbc-white font-body antialiased min-h-screen-safe flex flex-col">
                <AccessibilityProvider>
                        <>
                            {/* Global Brand Watermark (Hidden temporarily) */}
                            {/*
                            <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] sm:opacity-5 mix-blend-screen select-none z-0">
                                <Image
                                    src="/images/brand/cbc-watermark.png"
                                    alt="Brand Watermark"
                                    width={1200}
                                    height={1200}
                                    className="w-[150vw] sm:w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-[1200px] h-auto object-contain grayscale"
                                    priority
                                />
                            </div>
                            */}
                            <SiteHeader />
                            <LiveTicker headlines={headlines} />
                            <main className="flex-1 relative z-10">{children}</main>
                            <SiteFooter />
                            <AccessibilityPanel />
                        </>
                </AccessibilityProvider>
            </body>
        </html>
    );
}
