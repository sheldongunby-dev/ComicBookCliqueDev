"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TextSize = "sm" | "base" | "lg" | "xl";
export type ContrastMode = "default" | "high-dark" | "high-light";
export type SpacingLevel = "normal" | "relaxed" | "spacious";
export type TrackingLevel = "normal" | "wide" | "widest";

interface AccessibilityPreferences {
    textSize: TextSize;
    contrast: ContrastMode;
    dyslexiaFont: boolean;
    lineSpacing: SpacingLevel;
    letterSpacing: TrackingLevel;
    reducedMotion: boolean;
    focusRuler: boolean;
    focusRulerMask: boolean;
}

interface AccessibilityContextType extends AccessibilityPreferences {
    setTextSize: (size: TextSize) => void;
    setContrast: (mode: ContrastMode) => void;
    setDyslexiaFont: (active: boolean) => void;
    setLineSpacing: (level: SpacingLevel) => void;
    setLetterSpacing: (level: TrackingLevel) => void;
    setReducedMotion: (active: boolean) => void;
    setFocusRuler: (active: boolean) => void;
    setFocusRulerMask: (active: boolean) => void;
    resetPreferences: () => void;
}

const DEFAULT_PREFERENCES: AccessibilityPreferences = {
    textSize: "base",
    contrast: "default",
    dyslexiaFont: false,
    lineSpacing: "normal",
    letterSpacing: "normal",
    reducedMotion: false,
    focusRuler: false,
    focusRulerMask: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [preferences, setPreferences] = useState<AccessibilityPreferences>(DEFAULT_PREFERENCES);
    const [mounted, setMounted] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem("cbc-accessibility-preferences");
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure all fields are populated and valid
                setPreferences({
                    ...DEFAULT_PREFERENCES,
                    ...parsed,
                });
            } else {
                // Respect system preferences for reduced motion if no user setting exists
                const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (prefersReduced) {
                    setPreferences((prev) => ({ ...prev, reducedMotion: true }));
                }
            }
        } catch (e) {
            console.error("Failed to load accessibility preferences from localStorage", e);
        }
    }, []);

    // Apply attributes on document.documentElement whenever preferences change
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;

        // Apply Text Size
        root.setAttribute("data-text-size", preferences.textSize);

        // Apply Contrast Theme
        root.setAttribute("data-contrast", preferences.contrast);
        if (preferences.contrast === "high-light") {
            root.classList.remove("dark");
            root.classList.add("light");
        } else {
            root.classList.remove("light");
            root.classList.add("dark");
        }

        // Apply Dyslexia-friendly Typography
        root.setAttribute("data-font-dyslexia", String(preferences.dyslexiaFont));

        // Apply Line & Letter Spacing
        root.setAttribute("data-line-spacing", preferences.lineSpacing);
        root.setAttribute("data-letter-spacing", preferences.letterSpacing);

        // Apply Reduced Motion Override
        root.setAttribute("data-reduced-motion", String(preferences.reducedMotion));

        // Save to localStorage
        try {
            localStorage.setItem("cbc-accessibility-preferences", JSON.stringify(preferences));
        } catch (e) {
            console.error("Failed to save accessibility preferences to localStorage", e);
        }
    }, [preferences, mounted]);

    const updatePreference = <K extends keyof AccessibilityPreferences>(
        key: K,
        value: AccessibilityPreferences[K]
    ) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    };

    const resetPreferences = () => {
        setPreferences(DEFAULT_PREFERENCES);
    };

    return (
        <AccessibilityContext.Provider
            value={{
                ...preferences,
                setTextSize: (size) => updatePreference("textSize", size),
                setContrast: (mode) => updatePreference("contrast", mode),
                setDyslexiaFont: (active) => updatePreference("dyslexiaFont", active),
                setLineSpacing: (level) => updatePreference("lineSpacing", level),
                setLetterSpacing: (level) => updatePreference("letterSpacing", level),
                setReducedMotion: (active) => updatePreference("reducedMotion", active),
                setFocusRuler: (active) => updatePreference("focusRuler", active),
                setFocusRulerMask: (active) => updatePreference("focusRulerMask", active),
                resetPreferences,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
}

export function useAccessibility() {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    }
    return context;
}
