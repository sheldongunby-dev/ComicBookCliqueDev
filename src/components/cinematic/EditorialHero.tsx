"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Article } from "@/lib/schema/article.schema";
import { InterviewCard } from "@/components/editorial/InterviewCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function EditorialHero({ featuredStories }: { featuredStories?: Article[] }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!featuredStories || featuredStories.length <= 1 || isHovered) return;
        
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % featuredStories.length);
        }, 6000); // 6 seconds per slide
        
        return () => clearInterval(interval);
    }, [featuredStories, isHovered]);

    const nextSlide = () => {
        if (!featuredStories) return;
        setActiveIndex((current) => (current + 1) % featuredStories.length);
    };

    const prevSlide = () => {
        if (!featuredStories) return;
        setActiveIndex((current) => (current - 1 + featuredStories.length) % featuredStories.length);
    };

    if (!featuredStories || featuredStories.length === 0) {
        return null;
    }

    const currentStory = featuredStories[activeIndex];

    return (
        <section 
            className="w-full bg-cover bg-center bg-no-repeat pt-[6.625rem] md:pt-[7.625rem] pb-12 lg:pb-20 border-b border-cbc-border relative overflow-hidden"
            style={{ backgroundImage: "url('/images/brand/cbc-hero-bg.png')" }}
        >
            <div className="absolute inset-0 bg-cbc-black/60 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-hero-vignette opacity-80 pointer-events-none" />
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="mb-6 lg:mb-10 flex flex-col items-center text-center max-w-2xl mx-auto">
                    <h1 className="sr-only">Comic Book Clique</h1>
                    <div className="relative w-48 sm:w-56 mb-3">
                        <div className="absolute inset-0 blur-xl scale-75 bg-cbc-crimson/20 rounded-full" />
                        <Image
                            src="https://images.squarespace-cdn.com/content/v1/5d56e145f80b7500016ba502/7d465348-669a-430a-b559-9fd6f2e01b9a/CBCDSR+Banner.png?format=original"
                            alt="Comic Book Clique"
                            width={224}
                            height={70}
                            className="relative w-full h-auto object-contain drop-shadow-2xl"
                            priority
                        />
                    </div>
                    <p className="text-cbc-faint font-heading text-sm sm:text-base uppercase tracking-[0.2em]">
                        Your Premier Fandom Media Network
                    </p>
                </div>
                
                {/* The Top Story Carousel */}
                <div 
                    className="relative min-h-[400px] group/slider"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            <InterviewCard article={currentStory} variant="hero" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Arrow Navigation */}
                    {featuredStories.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-cbc-black/40 text-cbc-white backdrop-blur-md border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cbc-crimson hover:scale-110"
                                aria-label="Previous story"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-cbc-black/40 text-cbc-white backdrop-blur-md border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-cbc-crimson hover:scale-110"
                                aria-label="Next story"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>
                
                {/* Carousel Controls */}
                {featuredStories.length > 1 && (
                    <div className="flex justify-center gap-3 mt-8">
                        {featuredStories.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveIndex(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={cn(
                                    "h-1.5 transition-all duration-300 rounded-full",
                                    activeIndex === idx 
                                        ? "w-8 bg-cbc-crimson" 
                                        : "w-2 bg-cbc-border hover:bg-cbc-muted"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
