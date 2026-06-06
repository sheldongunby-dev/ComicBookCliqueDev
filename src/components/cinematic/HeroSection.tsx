"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight, Star, Mic, Newspaper, ChevronDown } from "lucide-react";

const STATS = [
    { value: "418+", label: "Podcast Episodes", color: "text-cbc-purple" },
    { value: "500+", label: "Articles & Reviews", color: "text-cbc-crimson" },
    { value: "Weekly", label: "New Content", color: "text-cbc-gold" },
];

// Real review covers from comicbookclique.com
const FEATURED_COVERS = [
    {
        src: "https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/1772581774415-06MBEQH2NR2K91HNKIB4/The+Bat-Man+-+Second+Knight+003+%282026%29+%28Digital%29+%28Pyrate-DCP%29-000.jpg?format=500w",
        alt: "The Bat-Man: The Second Knight #3",
        rating: "7.5",
        href: "/reviews",
        rotate: "-rotate-6",
        zIndex: "z-10",
    },
    {
        src: "https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/1770157639850-5D5G5RV2BFAEJ9WH9KS6/Screenshot+2026-01-27+233013.png?format=500w",
        alt: "Major Issues Podcast Ep 418",
        rating: null,
        href: "/podcast",
        rotate: "rotate-3",
        zIndex: "z-20",
    },
    {
        src: "https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/1762806935454-ALN1F54TKDEKGOSVH140/processed_1000088929.jpg?format=500w",
        alt: "Bendis Feature",
        rating: null,
        href: "/features",
        rotate: "rotate-6",
        zIndex: "z-10",
    },
];

export function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-cbc-black"
            aria-label="Hero — Comic Book Clique"
        >
            {/* ── FULL-BLEED background: banner image faded underneath ── */}
            <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
                {/* Real banner as subtle background texture */}
                <div className="absolute inset-0">
                    <Image
                        src="https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/1739419705518-KS1TTFMYUMMG3EV0AG7R/CBCDSR+Banner.png?format=1500w"
                        alt=""
                        fill
                        className="object-cover object-center opacity-[0.07] scale-110"
                        priority
                        sizes="100vw"
                        aria-hidden="true"
                    />
                </div>

                {/* Deep gradient overlays to cinematic-ify */}
                <div className="absolute inset-0 bg-gradient-to-b from-cbc-black via-cbc-black/95 to-cbc-black" />
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-crimson/8 via-transparent to-cbc-purple/6" />

                {/* Large radial glows */}
                <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-cbc-crimson/10 to-transparent" />
                <div className="absolute top-1/4 left-[10%] w-[600px] h-[600px] rounded-full bg-cbc-crimson/8 blur-[140px]" />
                <div className="absolute bottom-1/4 right-[5%] w-[500px] h-[500px] rounded-full bg-cbc-purple/10 blur-[120px]" />
                <div className="absolute top-1/2 right-[20%] w-[300px] h-[300px] rounded-full bg-cbc-gold/4 blur-[100px]" />

                {/* Halftone surface texture */}
                <div className="absolute inset-0 halftone opacity-30" />

                {/* Animated scan line */}
                <div className="absolute inset-0 overflow-hidden opacity-15">
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cbc-cyan/60 to-transparent"
                        animate={{ y: ["-10vh", "110vh"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Left side vertical line decoration */}
                <div className="absolute left-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cbc-crimson/30 to-transparent hidden lg:block" />
                <div className="absolute right-6 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-cbc-purple/30 to-transparent hidden lg:block" />
            </motion.div>

            {/* ── MAIN CONTENT ── */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 pt-28 pb-20"
            >
                <div className="grid lg:grid-cols-[1fr_520px] gap-16 xl:gap-24 items-center min-h-[75vh]">

                    {/* ── LEFT: HERO TEXT ── */}
                    <div className="flex flex-col items-start">

                        {/* Live badge */}
                        <motion.div
                            className="flex items-center gap-2.5 mb-8"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cbc-crimson opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-cbc-crimson" />
                            </span>
                            <span className="text-xs font-label font-semibold tracking-[0.25em] uppercase text-cbc-crimson">
                                Your Premier Fandom Media Network
                            </span>
                        </motion.div>

                        {/* ── THE BIG LOGO ── */}
                        <motion.div
                            className="relative w-full max-w-[520px] mb-6"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                        >
                            {/* Glow behind logo */}
                            <div className="absolute inset-0 blur-2xl scale-75 bg-cbc-crimson/20 rounded-full" />
                            <Image
                                src="https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/7d465348-669a-430a-b559-9fd6f2e01b9a/CBCDSR+Banner.png?format=original"
                                alt="Comic Book Clique & Dirt Sheet Radio"
                                width={520}
                                height={160}
                                className="relative w-full h-auto object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            className="text-base sm:text-lg text-cbc-muted leading-relaxed max-w-lg mb-8 font-body"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            Reviews, news, the{" "}
                            <span className="text-cbc-purple font-semibold">Major Issues Podcast</span>,
                            wrestling, gaming, and collector culture — all in one place.
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div
                            className="flex flex-wrap gap-3 mb-10"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link
                                href="/podcast"
                                className="group flex items-center gap-2.5 px-6 py-3.5 bg-cbc-crimson hover:bg-cbc-crimson-dim text-white font-heading font-bold rounded-cbc transition-all duration-300 shadow-cbc tracking-wide text-sm"
                            >
                                <Play size={15} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                                Listen to the Podcast
                            </Link>
                            <Link
                                href="/reviews"
                                className="group flex items-center gap-2.5 px-6 py-3.5 border border-cbc-border hover:border-cbc-gold/50 bg-cbc-surface/40 backdrop-blur-sm text-cbc-white hover:text-cbc-gold font-heading font-bold rounded-cbc transition-all duration-300 tracking-wide text-sm"
                            >
                                <Star size={15} />
                                Read Reviews
                                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/news"
                                className="group flex items-center gap-2.5 px-6 py-3.5 border border-cbc-border hover:border-cbc-cyan/40 bg-transparent text-cbc-muted hover:text-cbc-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm"
                            >
                                <Newspaper size={15} />
                                Latest News
                            </Link>
                        </motion.div>

                        {/* Stats strip */}
                        <motion.div
                            className="flex flex-wrap gap-8 pt-6 border-t border-cbc-border/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            {STATS.map(({ value, label, color }) => (
                                <div key={label} className="flex flex-col gap-0.5">
                                    <span className={`font-display text-2xl font-bold leading-none tracking-tight ${color}`}>{value}</span>
                                    <span className="text-xs text-cbc-faint font-label tracking-widest uppercase">{label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── RIGHT: FLOATING COVER STACK ── */}
                    <div className="hidden lg:flex items-center justify-center relative h-[520px]">
                        {/* Ambient glow behind covers */}
                        <div className="absolute inset-0 bg-gradient-radial from-cbc-crimson/10 via-transparent to-transparent rounded-full blur-3xl" />

                        {/* Cover stack - overlapping fan */}
                        {FEATURED_COVERS.map((cover, i) => (
                            <motion.div
                                key={i}
                                className={`absolute ${cover.rotate} ${cover.zIndex} cursor-pointer group`}
                                style={{
                                    left: `${20 + i * 18}%`,
                                    top: i === 1 ? "10%" : i === 0 ? "25%" : "20%",
                                }}
                                initial={{ opacity: 0, y: 40, rotate: parseInt(cover.rotate) - 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.6 + i * 0.15,
                                    duration: 0.8,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                whileHover={{
                                    scale: 1.06,
                                    rotate: 0,
                                    zIndex: 30,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Link href={cover.href} className="block">
                                    <div className="relative w-44 rounded-card overflow-hidden shadow-2xl border border-white/10 group-hover:border-cbc-crimson/40 transition-colors duration-300">
                                        <Image
                                            src={cover.src}
                                            alt={cover.alt}
                                            width={176}
                                            height={264}
                                            className="w-full aspect-[2/3] object-cover"
                                            sizes="176px"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-cbc-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Rating badge */}
                                        {cover.rating && (
                                            <div className="absolute top-2 right-2 bg-cbc-crimson/90 text-white text-xs font-mono font-bold px-2 py-1 rounded-cbc">
                                                {cover.rating}
                                            </div>
                                        )}

                                        {/* Bottom label on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-xs text-white font-heading font-semibold line-clamp-1">{cover.alt}</p>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* The Major Issues podcast logo below covers */}
                        <motion.div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link href="/podcast" className="group block">
                                <div className="relative p-3 bg-cbc-surface/80 backdrop-blur-sm rounded-card border border-cbc-border group-hover:border-cbc-purple/40 transition-colors duration-300">
                                    <Image
                                        src="https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/880f6249-ff99-4cb4-92ce-c39160c8ff84/MajorIssuesLogo.png"
                                        alt="Major Issues Podcast"
                                        width={200}
                                        height={80}
                                        className="w-full h-auto object-contain"
                                    />
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-cbc-border/50">
                                        <div className="flex items-center gap-1.5">
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cbc-purple opacity-75" />
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cbc-purple" />
                                            </span>
                                            <span className="text-[10px] font-label text-cbc-purple font-semibold tracking-wider uppercase">New Episode</span>
                                        </div>
                                        <span className="text-[10px] text-cbc-faint font-mono">EP 418</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cbc-black to-transparent pointer-events-none" />

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.6 }}
            >
                <span className="text-[10px] text-cbc-faint font-label tracking-[0.3em] uppercase">Explore</span>
                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown size={16} className="text-cbc-faint" />
                </motion.div>
            </motion.div>
        </section>
    );
}
