import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";

const CBC_LINKS = [
    { label: "Reviews", href: "/reviews" },
    { label: "News", href: "/news" },
    { label: "Features", href: "/features" },
    { label: "Podcast", href: "/podcast" },
    { label: "Wrestling", href: "/wrestling" },
    { label: "Gaming", href: "/gaming" },
    { label: "Pop Culture", href: "/pop-culture" },
    { label: "Merch", href: "/merch" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const MERCH_LINKS = [
    { label: "Shop CBC on TeePublic", href: "https://www.teepublic.com/stores/comicbook-clique?utm_campaign=9513&utm_medium=affiliate&utm_source=ComicBook%2BClique", external: true },
    { label: "Dirt Sheet Radio Store", href: "/merch#dsr", external: false },
    { label: "CBC Merch", href: "/merch", external: false },
];

const CBC_SOCIAL = [
    { icon: Facebook, href: "https://www.facebook.com/comicbookclique", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/comicbookclique", label: "Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/comicbookclique", label: "YouTube" },
    { icon: Twitter, href: "https://www.x.com/MajorIssuesCBC", label: "X / Twitter" },
];

const DSR_SOCIAL = [
    { icon: Facebook, href: "https://www.facebook.com/DirtSheetRadio", label: "DSR Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/officialDirtSheetRadio", label: "DSR Instagram" },
    { icon: Youtube, href: "https://www.youtube.com/@dirtsheetradio", label: "DSR YouTube" },
    { icon: Twitter, href: "https://www.x.com/DirtSheetRadio", label: "DSR X / Twitter" },
];

export function SiteFooter() {
    return (
        <footer className="relative bg-cbc-darker border-t border-cbc-border overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-cbc-gradient opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-cbc-crimson/5 blur-3xl pointer-events-none" />

            <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 pt-16 pb-8">
                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-4 group" aria-label="Comic Book Clique — Home">
                            <Image
                                src="/images/brand/cbc-logo-main.jpg"
                                alt="Comic Book Clique & Dirt Sheet Radio"
                                width={761}
                                height={500}
                                className="h-14 w-auto object-contain group-hover:opacity-80 transition-opacity duration-300 drop-shadow-[0_2px_10px_rgba(255,193,7,0.2)]"
                            />
                        </Link>
                        <p className="text-cbc-muted text-sm leading-relaxed mb-4">
                            Your premier fandom media network. Comics, reviews, the Major Issues Podcast, wrestling, gaming, and collector culture.
                        </p>
                        {/* CBC Social */}
                        <div className="flex items-center gap-3">
                            {CBC_SOCIAL.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-8 h-8 flex items-center justify-center rounded-cbc bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-crimson hover:border-cbc-crimson/40 transition-all duration-200"
                                >
                                    <Icon size={14} />
                                </a>
                            ))}
                            {/* Spotify custom icon */}
                            <a
                                href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Spotify"
                                className="w-8 h-8 flex items-center justify-center rounded-cbc bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-cyan hover:border-cbc-cyan/40 transition-all duration-200 font-label text-xs font-bold tracking-widest"
                            >
                                ♫
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-label text-xs font-semibold tracking-[0.2em] uppercase text-cbc-gold mb-4">
                            Navigate
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {CBC_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-cbc-muted hover:text-cbc-white transition-colors duration-200 font-body"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Merch */}
                    <div>
                        <h3 className="font-label text-xs font-semibold tracking-[0.2em] uppercase text-cbc-gold mb-4">
                            Shop
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {MERCH_LINKS.map((link) => (
                                <li key={link.href}>
                                    <a
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="text-sm text-cbc-muted hover:text-cbc-gold transition-colors duration-200 font-body"
                                    >
                                        {link.label}
                                        {link.external && (
                                            <span className="ml-1 text-cbc-faint">↗</span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* DSR Sub-brand */}
                        <div className="mt-8">
                            <h3 className="font-label text-xs font-semibold tracking-[0.2em] uppercase text-cbc-crimson mb-3">
                                Dirt Sheet Radio
                            </h3>
                            <p className="text-xs text-cbc-muted mb-3">
                                Wrestling coverage and the Dirt Sheet Radio podcast.
                            </p>
                            <div className="flex items-center gap-2">
                                {DSR_SOCIAL.map(({ icon: Icon, href, label }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-7 h-7 flex items-center justify-center rounded-cbc bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-crimson hover:border-cbc-crimson/40 transition-all duration-200"
                                    >
                                        <Icon size={12} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Podcast CTA */}
                    <div>
                        <h3 className="font-label text-xs font-semibold tracking-[0.2em] uppercase text-cbc-cyan mb-4">
                            Latest Episode
                        </h3>
                        <div className="bg-cbc-surface border border-cbc-border rounded-card p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="tag-chip bg-cbc-purple/20 text-cbc-purple border border-cbc-purple/20">
                                    Podcast
                                </span>
                                <span className="text-xs text-cbc-muted font-label">Ep. 418</span>
                            </div>
                            <p className="text-sm font-heading text-cbc-white leading-snug mb-3">
                                Major Issues Podcast: Dissecting Absolute Superman
                            </p>
                            <a
                                href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-xs font-label font-semibold tracking-widest uppercase text-cbc-cyan hover:text-cbc-white transition-colors duration-200"
                            >
                                Listen now ↗
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-cbc-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-cbc-faint font-label tracking-wide" suppressHydrationWarning={true}>
                        © {new Date().getFullYear()} Comic Book Clique. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/contact" className="text-xs text-cbc-faint hover:text-cbc-muted transition-colors duration-200 font-label tracking-wide">Contact</Link>
                        <span className="text-cbc-faint">·</span>
                        <span className="text-xs text-cbc-faint font-label tracking-wide">Built with passion for fandom</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
