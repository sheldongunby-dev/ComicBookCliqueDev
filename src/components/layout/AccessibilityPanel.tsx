"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAccessibility, TextSize, ContrastMode, SpacingLevel, TrackingLevel } from "@/lib/context/AccessibilityContext";
import { Accessibility, X, Type, Eye, AlignLeft, EyeOff, Activity, RotateCcw, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/helpers";

export function AccessibilityPanel() {
    const {
        textSize,
        contrast,
        dyslexiaFont,
        lineSpacing,
        letterSpacing,
        reducedMotion,
        focusRuler,
        focusRulerMask,
        setTextSize,
        setContrast,
        setDyslexiaFont,
        setLineSpacing,
        setLetterSpacing,
        setReducedMotion,
        setFocusRuler,
        setFocusRulerMask,
        resetPreferences,
    } = useAccessibility();

    const [isOpen, setIsOpen] = useState(false);
    const [mouseY, setMouseY] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);

    // Track mouse Y coordinate for the focus ruler and reading mask
    useEffect(() => {
        if (!focusRuler && !focusRulerMask) return;

        const handleMouseMove = (e: MouseEvent) => {
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [focusRuler, focusRulerMask]);

    // Close panel on pressing Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Close panel when clicking outside on desktop
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                // Ignore the floating trigger button
                const trigger = document.getElementById("cbc-accessibility-trigger");
                if (trigger && trigger.contains(e.target as Node)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener("mousedown", handleClickOutside);
        }
        return () => window.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <>
            {/* ── Interactive Focus Ruler ── */}
            {focusRuler && (
                <div
                    className="cbc-reading-ruler"
                    style={{ transform: `translateY(${mouseY - 2}px)` }}
                    aria-hidden="true"
                />
            )}

            {/* ── Interactive Focus Reading Mask ── */}
            {focusRulerMask && (
                <>
                    <div
                        className="cbc-reading-mask-top"
                        style={{ height: `${Math.max(0, mouseY - 45)}px` }}
                        aria-hidden="true"
                    />
                    <div
                        className="cbc-reading-mask-bottom"
                        style={{ top: `${mouseY + 45}px` }}
                        aria-hidden="true"
                    />
                </>
            )}

            {/* ── Floating Action Button (FAB) Trigger ── */}
            <button
                id="cbc-accessibility-trigger"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-[45] flex h-12 w-12 items-center justify-center rounded-full bg-cbc-surface/90 border border-cbc-border text-cbc-white shadow-card backdrop-blur-md transition-all hover:scale-105 active:scale-95 group focus-cbc",
                    isOpen ? "border-cbc-crimson text-cbc-crimson ring-2 ring-cbc-crimson" : "hover:border-cbc-crimson/50 hover:text-cbc-crimson"
                )}
                aria-label="Open accessibility options"
                aria-expanded={isOpen}
            >
                <Accessibility size={22} className={cn("transition-transform duration-300", isOpen && "rotate-90")} />
                <span className="absolute right-14 scale-0 group-hover:scale-100 transition-all origin-right bg-cbc-charcoal text-cbc-white text-[11px] font-label font-bold uppercase tracking-widest px-3 py-1.5 border border-cbc-border rounded-cbc pointer-events-none whitespace-nowrap shadow-md">
                    Accessibility Modes
                </span>
            </button>

            {/* ── Sliding Panel Drawer ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ x: "100%", opacity: 0.9 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="fixed top-0 right-0 bottom-0 z-[49] w-[340px] max-w-full bg-cbc-darker/95 border-l border-cbc-border shadow-card backdrop-blur-xl flex flex-col overflow-hidden text-cbc-white"
                        role="dialog"
                        aria-label="Accessibility Settings Node"
                    >
                        {/* Drawer Header */}
                        <div className="p-5 border-b border-cbc-border flex items-center justify-between bg-cbc-surface/20">
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-cbc bg-cbc-crimson/10 border border-cbc-crimson/20 flex items-center justify-center text-cbc-crimson">
                                    <Accessibility size={16} />
                                </div>
                                <div>
                                    <h2 className="font-display text-lg tracking-wider uppercase leading-none">Accessibility</h2>
                                    <span className="text-[9px] font-mono tracking-widest text-cbc-muted uppercase">Preference Matrix</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-sm text-cbc-muted hover:text-cbc-white hover:bg-cbc-surface border border-transparent hover:border-cbc-border transition-all focus-cbc"
                                aria-label="Close panel"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Drawer Options Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {/* SECTION 1: Typography */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cbc-crimson flex items-center gap-1.5">
                                    <Type size={12} /> Typography & Size
                                </h3>

                                {/* Text Size */}
                                <div className="space-y-1.5 p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <label className="text-xs font-label font-bold tracking-wider uppercase text-cbc-muted">
                                        Base Text Scale
                                    </label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {(["sm", "base", "lg", "xl"] as TextSize[]).map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setTextSize(size)}
                                                className={cn(
                                                    "py-1.5 text-xs font-heading font-semibold tracking-wider rounded-cbc border transition-all uppercase focus-cbc",
                                                    textSize === size
                                                        ? "bg-cbc-crimson border-cbc-crimson text-white shadow-cbc/20"
                                                        : "bg-cbc-charcoal/40 border-cbc-border/60 text-cbc-muted hover:text-cbc-white hover:border-cbc-muted/30"
                                                )}
                                            >
                                                {size === "sm" && "Small"}
                                                {size === "base" && "Default"}
                                                {size === "lg" && "Large"}
                                                {size === "xl" && "X-Large"}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dyslexia Switch */}
                                <div className="flex items-center justify-between p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <div>
                                        <label htmlFor="dyslexia-switch" className="block text-xs font-label font-bold tracking-wider uppercase text-cbc-muted cursor-pointer">
                                            Dyslexia Reader
                                        </label>
                                        <span className="text-[10px] font-body text-cbc-faint block mt-0.5">
                                            High-discrimination layout
                                        </span>
                                    </div>
                                    <button
                                        id="dyslexia-switch"
                                        role="switch"
                                        aria-checked={dyslexiaFont}
                                        onClick={() => setDyslexiaFont(!dyslexiaFont)}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-cbc",
                                            dyslexiaFont ? "bg-cbc-crimson" : "bg-cbc-charcoal"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-card transition duration-200 ease-in-out",
                                                dyslexiaFont ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* SECTION 2: Spacing Matrix */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cbc-gold flex items-center gap-1.5">
                                    <AlignLeft size={12} /> Spacing Matrices
                                </h3>

                                {/* Line Height */}
                                <div className="space-y-1.5 p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <label className="text-xs font-label font-bold tracking-wider uppercase text-cbc-muted">
                                        Line Height (Leading)
                                    </label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {(["normal", "relaxed", "spacious"] as SpacingLevel[]).map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setLineSpacing(level)}
                                                className={cn(
                                                    "py-1 text-[10px] font-heading font-semibold tracking-wider rounded-cbc border transition-all uppercase focus-cbc",
                                                    lineSpacing === level
                                                        ? "bg-cbc-gold border-cbc-gold text-cbc-black"
                                                        : "bg-cbc-charcoal/40 border-cbc-border/60 text-cbc-muted hover:text-cbc-white hover:border-cbc-muted/30"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Letter Spacing */}
                                <div className="space-y-1.5 p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <label className="text-xs font-label font-bold tracking-wider uppercase text-cbc-muted">
                                        Letter Tracking
                                    </label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {(["normal", "wide", "widest"] as TrackingLevel[]).map((level) => (
                                            <button
                                                key={level}
                                                onClick={() => setLetterSpacing(level)}
                                                className={cn(
                                                    "py-1 text-[10px] font-heading font-semibold tracking-wider rounded-cbc border transition-all uppercase focus-cbc",
                                                    letterSpacing === level
                                                        ? "bg-cbc-gold border-cbc-gold text-cbc-black"
                                                        : "bg-cbc-charcoal/40 border-cbc-border/60 text-cbc-muted hover:text-cbc-white hover:border-cbc-muted/30"
                                                )}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 3: Color Contrast */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cbc-cyan flex items-center gap-1.5">
                                    <Eye size={12} /> Color & Contrast
                                </h3>

                                <div className="space-y-1.5 p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <label className="text-xs font-label font-bold tracking-wider uppercase text-cbc-muted">
                                        Contrast Modes
                                    </label>
                                    <div className="flex flex-col gap-1.5">
                                        {([
                                            { mode: "default", label: "Default Dark Theme", desc: "Premium brand palette" },
                                            { mode: "high-dark", label: "High Contrast Dark", desc: "White-on-black layout" },
                                            { mode: "high-light", label: "High Contrast Light", desc: "Black-on-white layout" },
                                        ] as { mode: ContrastMode; label: string; desc: string }[]).map((item) => (
                                            <button
                                                key={item.mode}
                                                onClick={() => setContrast(item.mode)}
                                                className={cn(
                                                    "w-full text-left p-2 rounded-cbc border transition-all flex flex-col focus-cbc",
                                                    contrast === item.mode
                                                        ? "bg-cbc-cyan/15 border-cbc-cyan text-cbc-white shadow-cbc-cyan/5"
                                                        : "bg-cbc-charcoal/40 border-cbc-border/60 hover:border-cbc-muted/30 text-cbc-muted hover:text-cbc-white"
                                                )}
                                            >
                                                <span className={cn("text-xs font-heading font-bold uppercase tracking-wide", contrast === item.mode && "text-cbc-cyan")}>
                                                    {item.label}
                                                </span>
                                                <span className="text-[9px] font-body text-cbc-faint block mt-0.5">
                                                    {item.desc}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SECTION 4: Assistive Aids */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cbc-purple flex items-center gap-1.5">
                                    <EyeOff size={12} /> Focus & Reading Aids
                                </h3>

                                {/* Focus Ruler */}
                                <div className="flex items-center justify-between p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <div>
                                        <label htmlFor="ruler-switch" className="block text-xs font-label font-bold tracking-wider uppercase text-cbc-muted cursor-pointer">
                                            Reading Focus Ruler
                                        </label>
                                        <span className="text-[10px] font-body text-cbc-faint block mt-0.5">
                                            Horizontal row guide line
                                        </span>
                                    </div>
                                    <button
                                        id="ruler-switch"
                                        role="switch"
                                        aria-checked={focusRuler}
                                        onClick={() => setFocusRuler(!focusRuler)}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-cbc",
                                            focusRuler ? "bg-cbc-purple" : "bg-cbc-charcoal"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-card transition duration-200 ease-in-out",
                                                focusRuler ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>

                                {/* Focus Ruler Mask */}
                                <div className="flex items-center justify-between p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <div>
                                        <label htmlFor="mask-switch" className="block text-xs font-label font-bold tracking-wider uppercase text-cbc-muted cursor-pointer">
                                            Reading Mask Overlay
                                        </label>
                                        <span className="text-[10px] font-body text-cbc-faint block mt-0.5">
                                            Darkens top/bottom surrounding text
                                        </span>
                                    </div>
                                    <button
                                        id="mask-switch"
                                        role="switch"
                                        aria-checked={focusRulerMask}
                                        onClick={() => setFocusRulerMask(!focusRulerMask)}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-cbc",
                                            focusRulerMask ? "bg-cbc-purple" : "bg-cbc-charcoal"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-card transition duration-200 ease-in-out",
                                                focusRulerMask ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* SECTION 5: Vestibular/Motion */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cbc-white flex items-center gap-1.5">
                                    <Activity size={12} /> Motion & Interactivity
                                </h3>

                                <div className="flex items-center justify-between p-3 rounded-cbc bg-cbc-surface/40 border border-cbc-border/30">
                                    <div>
                                        <label htmlFor="motion-switch" className="block text-xs font-label font-bold tracking-wider uppercase text-cbc-muted cursor-pointer">
                                            Block Layout Motion
                                        </label>
                                        <span className="text-[10px] font-body text-cbc-faint block mt-0.5">
                                            Halts scrolling & floating FX
                                        </span>
                                    </div>
                                    <button
                                        id="motion-switch"
                                        role="switch"
                                        aria-checked={reducedMotion}
                                        onClick={() => setReducedMotion(!reducedMotion)}
                                        className={cn(
                                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus-cbc",
                                            reducedMotion ? "bg-cbc-muted" : "bg-cbc-charcoal"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-card transition duration-200 ease-in-out",
                                                reducedMotion ? "translate-x-4" : "translate-x-0"
                                            )}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer Actions */}
                        <div className="p-4 border-t border-cbc-border bg-cbc-surface/40 grid grid-cols-2 gap-2">
                            <button
                                onClick={resetPreferences}
                                className="flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-label font-bold uppercase tracking-widest border border-cbc-border hover:border-cbc-muted/30 text-cbc-muted hover:text-cbc-white rounded-cbc transition-all bg-cbc-charcoal/20 focus-cbc"
                            >
                                <RotateCcw size={10} /> Reset Matrix
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="py-2.5 text-[10px] font-label font-bold uppercase tracking-widest bg-cbc-crimson hover:bg-cbc-crimson-dim text-white rounded-cbc transition-all shadow-cbc/10 focus-cbc"
                            >
                                Confirm Settings
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
