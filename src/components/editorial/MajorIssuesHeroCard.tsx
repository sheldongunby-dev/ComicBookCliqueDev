"use client";

import { Mic, Calendar, Youtube, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export function MajorIssuesHeroCard() {
    return (
        <div className="w-full relative">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full relative rounded-2xl border border-white/5 bg-gradient-to-br from-[#110A1A] to-cbc-darker p-8 sm:p-12 text-center overflow-hidden flex flex-col items-center justify-center min-h-[380px] shadow-2xl"
            >
                {/* Halftone BG decorative */}
                <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-cbc-purple/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Animated waveform animation */}
                <div className="w-16 h-16 rounded-full bg-cbc-purple/10 border border-cbc-purple/20 flex items-center justify-center text-cbc-purple mb-6 relative group">
                    <Mic size={28} className="text-cbc-purple group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute inset-0 rounded-full border border-cbc-purple/30 animate-ping opacity-50" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-cbc-muted text-[10px] font-label font-bold tracking-[0.2em] uppercase rounded-full mb-3">
                    <Calendar size={11} className="text-cbc-faint" /> In Production
                </span>
                
                <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide leading-none mb-3">
                    Next Episode Dropping Soon
                </h3>
                <p className="text-cbc-muted max-w-sm text-sm leading-relaxed mb-6 font-body">
                    We release new episodes every week! Catch our latest comic reviews, movie reactions, and pop culture deep dives.
                </p>

                {/* Show Schedule Detail */}
                <div className="w-full max-w-xs p-3 rounded-lg border border-white/5 bg-white/[0.01] mb-8">
                    <p className="font-label text-[10px] tracking-widest text-cbc-purple uppercase font-bold mb-1">Standard Release Schedule</p>
                    <p className="text-sm font-heading font-semibold text-white">New Episodes Every Tuesday</p>
                </div>

                {/* Interactive CTAs */}
                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                    <a
                        href="https://www.youtube.com/comicbookclique"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-heading font-bold rounded-sm text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        <Youtube size={14} /> Subscribe on YouTube
                    </a>
                    <a
                        href="https://open.spotify.com/show/6JieQia6J6lQ8vU4Mj3djK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-cbc-purple/40 text-cbc-muted hover:text-white font-heading font-bold rounded-sm text-xs uppercase tracking-wider transition-all duration-300"
                    >
                        <Headphones size={14} /> Listen on Spotify
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
