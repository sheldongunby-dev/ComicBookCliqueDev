/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // CBC Brand Palette
                "cbc-black": "#08080A",
                "cbc-darker": "#0D0D10",
                "cbc-charcoal": "#141417",
                "cbc-surface": "#1C1C21",
                "cbc-elevated": "#242429",
                "cbc-border": "#2C2C34",
                // Accent system
                "cbc-crimson": "#E5193A",
                "cbc-crimson-dim": "#B01229",
                "cbc-gold": "#F5A623",
                "cbc-gold-dim": "#C47D0F",
                "cbc-cyan": "#00D4FF",
                "cbc-cyan-dim": "#0099BB",
                "cbc-purple": "#9F6FF7",
                "cbc-purple-dim": "#7B4DD4",
                // New channel brands
                "dsr-orange": "#FF6B00",
                "dsr-orange-dim": "#CC5500",
                "pod-teal": "#00E5B4",
                "pod-teal-dim": "#00B890",
                // Text
                "cbc-white": "#FAFAFA",
                "cbc-muted": "#8B8B9A",
                "cbc-faint": "#4A4A57",
            },
            fontFamily: {
                display: ["var(--font-bebas)", "Impact", "sans-serif"],
                heading: ["var(--font-oswald)", "sans-serif"],
                body: ["var(--font-outfit)", "system-ui", "sans-serif"],
                label: ["var(--font-rajdhani)", "sans-serif"],
                mono: ["var(--font-space-mono)", "monospace"],
            },
            fontSize: {
                "display-2xl": ["clamp(4rem, 10vw, 10rem)", { lineHeight: "0.9" }],
                "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "0.95" }],
                "display-lg": ["clamp(2rem, 5vw, 4.5rem)", { lineHeight: "1" }],
                "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
            },
            spacing: {
                "section": "clamp(4rem, 8vw, 8rem)",
                "18": "4.5rem",
                "22": "5.5rem",
                "30": "7.5rem",
            },
            backgroundImage: {
                "cbc-gradient": "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(229,25,58,0.15), transparent)",
                "cbc-glow": "conic-gradient(from 180deg at 50% 50%, #E5193A, #F5A623, #00D4FF, #8B5CF6, #E5193A)",
                "hero-vignette": "radial-gradient(ellipse at center, transparent 40%, rgba(8,8,10,0.8) 100%)",
                "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)",
                "ink-texture": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%2308080A'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23141417' opacity='0.4'/%3E%3C/svg%3E\")",
            },
            boxShadow: {
                "cbc": "0 0 40px -10px rgba(229,25,58,0.3)",
                "cbc-gold": "0 0 40px -10px rgba(245,166,35,0.3)",
                "cbc-cyan": "0 0 40px -10px rgba(0,212,255,0.3)",
                "card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
                "card-hover": "0 8px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)",
                "cinematic": "0 10px 30px -10px rgba(0,0,0,0.5)",
                "cinematic-hover": "0 20px 40px -10px rgba(0,0,0,0.8)",
                "cinematic-crimson": "0 20px 40px -10px rgba(229,25,58,0.2)",
                "cinematic-gold": "0 20px 40px -10px rgba(245,166,35,0.2)",
                "cinematic-cyan": "0 20px 40px -10px rgba(0,212,255,0.2)",
                "cinematic-purple": "0 20px 40px -10px rgba(139,92,246,0.2)",
                "cinematic-orange": "0 20px 40px -10px rgba(255,107,0,0.25)",
                "cinematic-teal": "0 20px 40px -10px rgba(0,229,180,0.2)",
                "glow-crimson": "0 0 60px rgba(229,25,58,0.4), 0 0 120px rgba(229,25,58,0.15)",
                "glow-gold": "0 0 60px rgba(245,166,35,0.4), 0 0 120px rgba(245,166,35,0.15)",
                "glow-orange": "0 0 60px rgba(255,107,0,0.5), 0 0 120px rgba(255,107,0,0.2)",
                "glow-teal": "0 0 60px rgba(0,229,180,0.4), 0 0 120px rgba(0,229,180,0.15)",
                "hero": "inset 0 -1px 0 rgba(255,255,255,0.05)",
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "glow-pulse": "glow-pulse 3s ease-in-out infinite",
                "scan-line": "scan-line 8s linear infinite",
                "gradient-shift": "gradient-shift 8s ease infinite",
                "shimmer": "shimmer 2s linear infinite",
                "ticker": "ticker 30s linear infinite",
                "waveform": "waveform 1.2s ease-in-out infinite",
                "on-air": "on-air 1.5s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0px) rotate(-1deg)" },
                    "50%": { transform: "translateY(-20px) rotate(1deg)" },
                },
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.4" },
                    "50%": { opacity: "0.8" },
                },
                "scan-line": {
                    "0%": { transform: "translateY(-100%)" },
                    "100%": { transform: "translateY(100vh)" },
                },
                "gradient-shift": {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-1000px 0" },
                    "100%": { backgroundPosition: "1000px 0" },
                },
                ticker: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                waveform: {
                    "0%, 100%": { transform: "scaleY(0.3)" },
                    "50%": { transform: "scaleY(1)" },
                },
                "on-air": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.2" },
                },
            },
            borderRadius: {
                "cbc": "2px",
                "card": "6px",
            },
            transitionTimingFunction: {
                "cbc": "cubic-bezier(0.16, 1, 0.3, 1)",
                "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
