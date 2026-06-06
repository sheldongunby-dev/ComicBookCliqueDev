"use client";

import { useEffect, useState } from "react";
import { Radio, Calendar, Youtube, Play, Headphones, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DsrLiveStream() {
    const [liveStatus, setLiveStatus] = useState<{ isLive: boolean; streamUrl: string | null } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLive = async () => {
            try {
                const res = await fetch("/api/dsr-live");
                const data = await res.json();
                setLiveStatus({
                    isLive: !!data.isLive,
                    streamUrl: data.streamUrl || null
                });
            } catch (error) {
                console.error("Failed to check DSR live status:", error);
                setLiveStatus({ isLive: false, streamUrl: null });
            } finally {
                setIsLoading(false);
            }
        };

        checkLive();
        const interval = setInterval(checkLive, 60000); // Check every 60 seconds
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full aspect-video rounded-2xl border border-white/5 bg-cbc-darker/60 flex flex-col items-center justify-center gap-4 relative overflow-hidden p-6">
                <div className="absolute inset-0 halftone opacity-20" />
                <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-dsr-orange animate-spin" />
                <p className="text-sm font-heading font-semibold text-cbc-muted tracking-wider uppercase animate-pulse">Connecting to DSR Broadcast Tower...</p>
            </div>
        );
    }

    const isLive = liveStatus?.isLive && liveStatus?.streamUrl;

    return (
        <div className="w-full relative">
            <AnimatePresence mode="wait">
                {isLive ? (
                    <motion.div
                        key="live"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full rounded-2xl overflow-hidden border border-dsr-orange/30 shadow-[0_0_50px_rgba(255,107,0,0.15)] bg-cbc-black relative"
                    >
                        {/* Live Header Strip */}
                        <div className="bg-dsr-orange px-4 py-3 flex items-center justify-between gap-4 select-none">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-white animate-on-air" />
                                <span className="font-label text-xs font-black tracking-[0.2em] uppercase text-white">ON AIR NOW</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold tracking-wider text-white/80 bg-black/25 px-2 py-0.5 rounded-sm uppercase">YouTube Live Player</span>
                            </div>
                        </div>

                        {/* Interactive Video Embed */}
                        <div className="relative w-full aspect-video">
                            <iframe
                                src={liveStatus.streamUrl!}
                                title="Dirt Sheet Radio Live Broadcast"
                                className="absolute inset-0 w-full h-full border-0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="offline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="w-full relative rounded-2xl border border-white/5 bg-gradient-to-br from-[#0c0904] to-cbc-darker p-8 sm:p-12 text-center overflow-hidden flex flex-col items-center justify-center min-h-[380px] shadow-2xl"
                    >
                        {/* Halftone BG decorative */}
                        <div className="absolute inset-0 halftone opacity-10 pointer-events-none" />
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-dsr-orange/5 rounded-full blur-[100px] pointer-events-none" />

                        {/* Animated waveform animation */}
                        <div className="w-16 h-16 rounded-full bg-dsr-orange/10 border border-dsr-orange/20 flex items-center justify-center text-dsr-orange mb-6 relative group">
                            <Radio size={28} className="text-dsr-orange group-hover:scale-110 transition-transform duration-300" />
                            <span className="absolute inset-0 rounded-full border border-dsr-orange/30 animate-ping opacity-50" />
                        </div>

                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 text-cbc-muted text-[10px] font-label font-bold tracking-[0.2em] uppercase rounded-full mb-3">
                            <Calendar size={11} className="text-cbc-faint" /> Offline
                        </span>
                        
                        <h3 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wide leading-none mb-3">
                            Next Broadcast Coming Soon
                        </h3>
                        <p className="text-cbc-muted max-w-sm text-sm leading-relaxed mb-6 font-body">
                            We stream live every week! Catch our unfiltered wrestling analysis, hot takes, and direct fan calls.
                        </p>

                        {/* Show Schedule Detail */}
                        <div className="w-full max-w-xs p-3 rounded-lg border border-white/5 bg-white/[0.01] mb-8">
                            <p className="font-label text-[10px] tracking-widest text-dsr-orange uppercase font-bold mb-1">Standard Broadcasting Schedule</p>
                            <p className="text-sm font-heading font-semibold text-white">Wednesdays @ 8:00 PM EST</p>
                        </div>

                        {/* Interactive CTAs */}
                        <div className="flex flex-wrap justify-center gap-3 relative z-10">
                            <a
                                href="https://www.youtube.com/@dirtsheetradio?sub_confirmation=1"
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
                                className="flex items-center gap-2 px-5 py-2.5 border border-white/10 hover:border-dsr-orange/40 text-cbc-muted hover:text-white font-heading font-bold rounded-sm text-xs uppercase tracking-wider transition-all duration-300"
                            >
                                <Headphones size={14} /> Listen on Spotify
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
