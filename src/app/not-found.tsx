"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen-safe bg-cbc-black flex items-center justify-center px-4">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cbc-crimson/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cbc-purple/5 rounded-full blur-3xl" />
                <div className="absolute inset-0 halftone opacity-20" />
            </div>

            <div className="relative text-center max-w-lg">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* 404 display */}
                    <div className="font-display text-[12rem] text-cbc-surface leading-none select-none mb-0 relative">
                        <span className="absolute inset-0 flex items-center justify-center font-display text-[12rem]" style={{
                            WebkitTextStroke: "1px rgba(229,25,58,0.3)",
                            color: "transparent",
                        }}>
                            404
                        </span>
                        404
                    </div>

                    <div className="-mt-4 mb-6">
                        <div className="inline-flex items-center gap-2 mb-3">
                            <div className="w-8 h-px bg-cbc-crimson" />
                            <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-crimson">
                                Page Not Found
                            </span>
                            <div className="w-8 h-px bg-cbc-crimson" />
                        </div>
                        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-cbc-white mb-3">
                            This panel doesn&apos;t exist
                        </h1>
                        <p className="text-cbc-muted leading-relaxed">
                            The page you&apos;re looking for has been moved, retconned, or never existed in this universe. Let&apos;s get you back to the story.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-3 bg-cbc-crimson hover:bg-cbc-crimson-dim text-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm shadow-cbc"
                        >
                            <Home size={15} /> Go Home
                        </Link>
                        <Link
                            href="/reviews"
                            className="flex items-center gap-2 px-6 py-3 border border-cbc-border hover:border-cbc-gold/40 text-cbc-muted hover:text-cbc-gold font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm"
                        >
                            <ArrowLeft size={14} /> Read Reviews
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
