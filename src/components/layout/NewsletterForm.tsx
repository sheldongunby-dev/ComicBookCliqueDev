"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setStatus("error");
            setMessage("Please enter your email address.");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("success");
                setMessage(data.message || "Thank you for subscribing!");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to subscribe. Please try again.");
            }
        } catch (error) {
            console.error("Newsletter form error:", error);
            setStatus("error");
            setMessage("An unexpected error occurred. Please check your connection.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-10">
            <form onSubmit={handleSubmit} className="relative flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === "error") setStatus("idle");
                        }}
                        disabled={status === "loading" || status === "success"}
                        placeholder="your@email.com"
                        aria-label="Email address"
                        className="w-full px-4 py-3 bg-cbc-surface/60 backdrop-blur-sm border border-cbc-border hover:border-cbc-border-hover focus:border-cbc-crimson/50 text-cbc-white placeholder:text-cbc-faint focus:outline-none focus:ring-1 focus:ring-cbc-crimson/25 rounded-cbc transition-all duration-300 font-body text-sm disabled:opacity-50"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                        {status === "loading" && (
                            <Loader2 size={16} className="text-cbc-faint animate-spin" />
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="group relative px-6 py-3 bg-cbc-crimson hover:bg-cbc-crimson-dim text-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide shadow-cbc text-sm whitespace-nowrap overflow-hidden flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:bg-cbc-crimson"
                >
                    <span>Subscribe</span>
                    <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    
                    {/* Hover glow layer */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                </button>
            </form>

            <AnimatePresence mode="wait">
                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 text-xs font-heading font-medium text-cbc-crimson mt-3 bg-cbc-crimson/10 border border-cbc-crimson/20 p-2.5 rounded-cbc"
                    >
                        <AlertTriangle size={14} className="shrink-0" />
                        <span>{message}</span>
                    </motion.div>
                )}

                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-2 text-xs font-heading font-medium text-cbc-gold mt-3 bg-cbc-gold/10 border border-cbc-gold/20 p-2.5 rounded-cbc"
                    >
                        <CheckCircle size={14} className="shrink-0 text-cbc-gold" />
                        <span>{message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
