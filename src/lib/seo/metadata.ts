import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://comicbookclique.com";

interface PageMetaOptions {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
    type?: "website" | "article";
    publishDate?: string;
    author?: string;
    noIndex?: boolean;
}

export function buildMetadata({
    title,
    description,
    image,
    path = "/",
    type = "website",
    publishDate,
    author,
    noIndex = false,
}: PageMetaOptions = {}): Metadata {
    const fullTitle = title
        ? `${title} | Comic Book Clique`
        : "Comic Book Clique — Your Premier Fandom Media Network";

    const fullDescription =
        description ||
        "Comic Book Clique is your home for comic book reviews, news, features, the Major Issues Podcast, wrestling, gaming, and collector culture.";

    const ogImage = image || `${BASE_URL}/og-default.jpg`;
    const canonicalUrl = `${BASE_URL}${path}`;

    return {
        title: fullTitle,
        description: fullDescription,
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: fullTitle,
            description: fullDescription,
            url: canonicalUrl,
            siteName: "Comic Book Clique",
            type,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
            ...(publishDate && { publishedTime: publishDate }),
            ...(author && { authors: [author] }),
        },
        twitter: {
            card: "summary_large_image",
            site: "@MajorIssuesCBC",
            title: fullTitle,
            description: fullDescription,
            images: [ogImage],
        },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
    };
}

// ── JSON-LD Structured Data ──
export function articleJsonLd({
    title,
    description,
    image,
    publishDate,
    authorName,
    url,
}: {
    title: string;
    description?: string;
    image?: string;
    publishDate?: string;
    authorName?: string;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        image,
        datePublished: publishDate,
        author: authorName
            ? { "@type": "Person", name: authorName }
            : { "@type": "Organization", name: "Comic Book Clique" },
        publisher: {
            "@type": "Organization",
            name: "Comic Book Clique",
            url: BASE_URL,
        },
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
    };
}

export function podcastEpisodeJsonLd({
    title,
    description,
    publishDate,
    episodeNumber,
    url,
}: {
    title: string;
    description?: string;
    publishDate?: string;
    episodeNumber?: number;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        name: title,
        description,
        datePublished: publishDate,
        episodeNumber,
        url,
        partOfSeries: {
            "@type": "PodcastSeries",
            name: "Major Issues Podcast",
            url: `${BASE_URL}/podcast`,
        },
    };
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Comic Book Clique",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        sameAs: [
            "https://www.facebook.com/comicbookclique",
            "https://www.instagram.com/comicbookclique",
            "https://www.youtube.com/comicbookclique",
            "https://www.x.com/MajorIssuesCBC",
            "https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK",
        ],
        description: "Comic Book Clique is a fandom media network covering comic books, reviews, the Major Issues Podcast, wrestling, gaming, and pop culture.",
    };
}
