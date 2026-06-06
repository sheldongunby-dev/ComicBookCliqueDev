"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/helpers";

import Image from "next/image";

const NAV_LINKS = [
    { label: "Home", href: "/", accent: "none" },
    { label: "Reviews", href: "/reviews", accent: "crimson" },
    { label: "News", href: "/news", accent: "gold" },
    { label: "Features", href: "/features", accent: "cyan" },
    { label: "Podcast", href: "/podcast", accent: "purple" },
    { label: "DSR", href: "/dirtsheetradio", accent: "orange" },
    {
        label: "More",
        href: "#",
        accent: "none",
        children: [
            { label: "Podcast Reviews", href: "/reviews/podcast" },
            { label: "Wrestling", href: "/wrestling" },
            { label: "Gaming", href: "/gaming" },
            { label: "Pop Culture", href: "/pop-culture" },
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
        ],
    },
] as const;

const MERCH_LINKS = [
    { label: "CBC Merch", href: "/merch" },
    { label: "Shop TeePublic", href: "https://www.teepublic.com/stores/comicbook-clique?utm_campaign=9513&utm_medium=affiliate&utm_source=ComicBook%2BClique", external: true },
];

const accentMap: Record<string, string> = {
    crimson: "text-cbc-crimson",
    gold: "text-cbc-gold",
    cyan: "text-cbc-cyan",
    purple: "text-cbc-purple",
    orange: "text-dsr-orange",
};

const accentBgMap: Record<string, string> = {
    orange: "bg-dsr-orange",
};

export function SiteHeader() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const checkLive = async () => {
            try {
                const res = await fetch("/api/dsr-live");
                const data = await res.json();
                setIsLive(!!data.isLive);
            } catch (e) {
                console.error("DSR Live Header Check Failed:", e);
            }
        };
        checkLive();
        const interval = setInterval(checkLive, 120000); // Check every 2 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-cover bg-center bg-no-repeat",
                    scrolled
                        ? "shadow-lg border-b border-cbc-border before:absolute before:inset-0 before:bg-cbc-darker/95 before:backdrop-blur-md before:-z-10"
                        : ""
                )}
                style={{ backgroundImage: "url('/images/brand/cbc-header-bg.png')" }}
            >
                {/* Top accent bar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-cbc-crimson via-cbc-gold to-cbc-cyan" />

                <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center focus-cbc group"
                        aria-label="Comic Book Clique — Home"
                    >
                        <Image
                            src="/images/brand/cbc-logo-main.jpg"
                            alt="Comic Book Clique & Dirt Sheet Radio"
                            width={761}
                            height={500}
                            className="h-10 sm:h-12 md:h-14 w-auto object-contain group-hover:opacity-85 transition-opacity duration-300 drop-shadow-[0_2px_12px_rgba(255,193,7,0.25)]"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            if (link.label === "More") {
                                return (
                                    <div
                                        key="more"
                                        className="relative"
                                        onMouseEnter={() => setDropdownOpen(true)}
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <button
                                            className="flex items-center gap-1 px-4 py-2 text-base font-heading font-medium text-cbc-muted hover:text-cbc-white transition-colors duration-200 rounded-sm"
                                            aria-haspopup="true"
                                            aria-expanded={dropdownOpen}
                                        >
                                            More <ChevronDown size={14} className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")} />
                                        </button>
                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="absolute top-full left-0 mt-1 w-52 bg-cbc-charcoal border border-cbc-border rounded-card shadow-card overflow-hidden"
                                                >
                                                    {link.children?.map((child) => (
                                                        <Link
                                                            key={child.href}
                                                            href={child.href}
                                                            className="block px-4 py-2.5 text-base font-heading text-cbc-muted hover:text-cbc-white hover:bg-cbc-surface transition-colors duration-150"
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            }

                            if (link.label === "DSR") {
                                return (
                                    <Link
                                        key="dsr"
                                        href="/dirtsheetradio"
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 text-base font-heading font-bold text-dsr-orange border rounded-sm transition-all duration-200",
                                            isLive 
                                                ? "border-dsr-orange bg-dsr-orange/5 shadow-[0_0_15px_rgba(255,107,0,0.15)] animate-glow-pulse" 
                                                : "border-dsr-orange/30 hover:bg-dsr-orange hover:text-white"
                                        )}
                                    >
                                        {isLive && <span className="w-1.5 h-1.5 rounded-full bg-dsr-orange animate-on-air" />}
                                        DSR {isLive && <span className="text-[9px] font-mono tracking-widest text-dsr-orange/80 uppercase font-semibold ml-1">LIVE</span>}
                                    </Link>
                                );
                            }

                            const accent = "accent" in link ? link.accent : "none";

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-base font-heading font-medium text-cbc-muted hover:text-cbc-white transition-colors duration-200 relative group",
                                        accentMap[accent]
                                            ? `hover:${accentMap[accent]}`
                                            : ""
                                    )}
                                >
                                    <span className={cn("group-hover:" + (accentMap[accent] ?? "text-cbc-white"))}>
                                        {link.label}
                                    </span>
                                    <span
                                        className={cn(
                                            "absolute bottom-0 left-4 right-4 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                                            accent === "crimson" && "bg-cbc-crimson",
                                            accent === "gold" && "bg-cbc-gold",
                                            accent === "cyan" && "bg-cbc-cyan",
                                            accent === "purple" && "bg-cbc-purple",
                                        )}
                                    />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/dirtsheetradio"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 text-base font-heading font-bold border rounded-sm transition-all duration-300 tracking-wide",
                                isLive 
                                    ? "border-dsr-orange text-dsr-orange bg-dsr-orange/5 animate-glow-pulse shadow-[0_0_15px_rgba(255,107,0,0.15)]" 
                                    : "border-dsr-orange/40 text-dsr-orange hover:bg-dsr-orange hover:text-white"
                            )}
                        >
                            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-dsr-orange animate-on-air" />}
                            DSR {isLive && <span className="text-[9px] font-mono tracking-widest text-dsr-orange/80 uppercase font-semibold ml-1">LIVE</span>}
                        </Link>
                        <Link
                            href="/merch"
                            className="px-4 py-2 text-base font-heading font-semibold border border-cbc-gold/40 text-cbc-gold hover:bg-cbc-gold hover:text-cbc-black rounded-cbc transition-all duration-300 tracking-wide"
                        >
                            Shop Merch
                        </Link>
                        <Link
                            href="/podcast"
                            className="px-4 py-2 text-base font-heading font-semibold bg-cbc-crimson hover:bg-cbc-crimson-dim text-white rounded-cbc transition-all duration-300 tracking-wide shadow-cbc"
                        >
                            Listen
                        </Link>
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        className="md:hidden p-2 text-cbc-muted hover:text-cbc-white transition-colors focus-cbc"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-40 bg-cbc-darker/98 backdrop-blur-md flex flex-col pt-20 px-6 pb-8 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => {
                                if (link.label === "More") {
                                    return (
                                        <div key="more" className="flex flex-col gap-1">
                                            {link.children?.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="py-3 text-lg font-heading text-cbc-muted hover:text-cbc-white pl-4 border-l border-cbc-border hover:border-cbc-gold transition-all duration-200"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                }

                                const accent = "accent" in link ? link.accent : "none";
                                const colorClass =
                                    accent === "crimson" ? "text-cbc-crimson" :
                                        accent === "gold" ? "text-cbc-gold" :
                                            accent === "cyan" ? "text-cbc-cyan" :
                                                accent === "purple" ? "text-cbc-purple" :
                                                    accent === "orange" ? "text-dsr-orange" :
                                                    "text-cbc-white";

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            "py-3 text-2xl font-heading font-bold transition-colors duration-200 flex items-center gap-2", 
                                            colorClass
                                        )}
                                    >
                                        {link.label}
                                        {link.label === "DSR" && isLive && (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-dsr-orange animate-on-air" />
                                                <span className="text-[10px] font-mono tracking-widest text-dsr-orange uppercase font-semibold py-0.5 px-1.5 rounded-sm bg-dsr-orange/10 border border-dsr-orange/20">LIVE</span>
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-cbc-border flex flex-col gap-3">
                            <Link
                                href="/merch"
                                onClick={() => setMobileOpen(false)}
                                className="text-center py-3 border border-cbc-gold/40 text-cbc-gold font-heading font-semibold rounded-cbc hover:bg-cbc-gold hover:text-cbc-black transition-all duration-300 tracking-wide"
                            >
                                Shop Merch
                            </Link>
                            <Link
                                href="/podcast"
                                onClick={() => setMobileOpen(false)}
                                className="text-center py-3 bg-cbc-crimson text-white font-heading font-semibold rounded-cbc hover:bg-cbc-crimson-dim transition-all duration-300 tracking-wide shadow-cbc"
                            >
                                Listen to Major Issues
                            </Link>
                        </div>

                        {/* Social links */}
                        <div className="mt-auto pt-6 flex items-center gap-4">
                            <a href="https://www.youtube.com/comicbookclique" target="_blank" rel="noopener noreferrer" className="text-cbc-muted hover:text-cbc-crimson transition-colors text-sm font-label tracking-widest uppercase">YT</a>
                            <a href="https://www.instagram.com/comicbookclique" target="_blank" rel="noopener noreferrer" className="text-cbc-muted hover:text-cbc-gold transition-colors text-sm font-label tracking-widest uppercase">IG</a>
                            <a href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK" target="_blank" rel="noopener noreferrer" className="text-cbc-muted hover:text-cbc-cyan transition-colors text-sm font-label tracking-widest uppercase">Spotify</a>
                            <a href="https://www.x.com/MajorIssuesCBC" target="_blank" rel="noopener noreferrer" className="text-cbc-muted hover:text-cbc-white transition-colors text-sm font-label tracking-widest uppercase">X</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
