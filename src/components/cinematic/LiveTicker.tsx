"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import Image from "next/image";

export interface TickerHeadline {
    label: string;
    text: string;
    href: string;
    image: string | null;
}

export function LiveTicker({ headlines }: { headlines: TickerHeadline[] }) {
    if (!headlines || headlines.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-[calc(4rem+2px)] md:top-[calc(5rem+2px)] left-0 right-0 w-full bg-[#0A0A0F] border-b border-white/5 h-9 flex items-center overflow-hidden z-40">
            {/* DSR Live badge */}
            <div className="shrink-0 flex items-center gap-2 px-4 bg-dsr-orange h-full z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-on-air" />
                <span className="font-label text-[10px] font-bold tracking-[0.2em] uppercase text-white whitespace-nowrap">Live</span>
                <Radio size={12} className="text-white" />
            </div>

            {/* Scrolling headlines */}
            <div className="overflow-hidden flex-1 relative">
                <div
                    className="flex animate-ticker whitespace-nowrap"
                    style={{ willChange: "transform" }}
                >
                    {[...headlines, ...headlines].map((item, i) => (
                        <Link
                            key={i}
                            href={item.href}
                            className="inline-flex items-center gap-3 px-6 hover:opacity-80 transition-opacity duration-200 shrink-0"
                        >
                            {/* Small rounded article thumbnail */}
                            {item.image && (
                                <div className="relative w-5 h-5 rounded-full overflow-hidden border border-white/10 shrink-0 bg-cbc-charcoal">
                                    <Image
                                        src={item.image}
                                        alt=""
                                        fill
                                        sizes="20px"
                                        className="object-cover"
                                    />
                                </div>
                            )}

                            <span className={`font-label text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-sm ${
                                item.label === "BREAKING" ? "bg-cbc-crimson/20 text-cbc-crimson" :
                                item.label === "DSR" ? "bg-dsr-orange/20 text-dsr-orange" :
                                item.label === "REVIEW" ? "bg-cbc-gold/20 text-cbc-gold" :
                                "bg-cbc-cyan/20 text-cbc-cyan"
                            }`}>
                                {item.label}
                            </span>
                            <span className="font-body text-[12px] text-cbc-muted max-w-[320px] truncate">
                                {item.text}
                            </span>
                            <span className="text-cbc-faint text-xs">•</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Fade edges */}
            <div className="absolute left-[100px] top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0A0F] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0A0A0F] to-transparent pointer-events-none z-10" />
        </div>
    );
}
