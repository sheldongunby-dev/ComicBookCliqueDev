"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Newspaper, Headphones, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Features", href: "/features", icon: Newspaper },
  { label: "Podcast", href: "/major-issues", icon: Headphones },
] as const;

const STORAGE_KEY = "cbc-bottom-nav-pinned";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [pinned, setPinned] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Load pin preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setPinned(true);
    } catch {}
  }, []);

  // Scroll-hide / scroll-show logic
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (!pinned) {
          if (delta > 8 && currentY > 80) {
            // Scrolling down — hide
            setVisible(false);
          } else if (delta < -6) {
            // Scrolling up — show
            setVisible(true);
          }
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pinned]);

  const handlePin = () => {
    const next = !pinned;
    setPinned(next);
    setVisible(true);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {}
  };

  // Don't render on desktop (handled via CSS as well for SSR safety)
  // Don't render in the studio
  if (pathname?.startsWith("/studio")) return null;

  return (
    <nav
      aria-label="Mobile navigation"
      className={cn(
        // Only visible on mobile — hidden on md and up
        "md:hidden fixed bottom-0 left-0 right-0 z-50",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Blur backdrop + border top */}
      <div className="relative bg-cbc-darker/95 backdrop-blur-md border-t border-cbc-border/60">
        {/* Top crimson accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cbc-crimson/60 to-transparent" />

        <div className="flex items-center justify-around px-2 pt-1 pb-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            // Active state: exact match for home, starts-with for others
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname?.startsWith(href) ?? false;

            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg",
                  "transition-all duration-200 active:scale-95 min-w-[56px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cbc-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-cbc-darker"
                )}
              >
                <span
                  className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-cbc-crimson/15 text-cbc-crimson"
                      : "text-cbc-muted"
                  )}
                >
                  {/* Active indicator dot above icon */}
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cbc-crimson" />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    className={cn(
                      "transition-all duration-200",
                      isActive && "drop-shadow-[0_0_6px_rgba(229,25,58,0.5)]"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-label font-semibold tracking-wide transition-colors duration-200",
                    isActive ? "text-cbc-crimson" : "text-cbc-muted/70"
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Pin toggle */}
          <button
            onClick={handlePin}
            aria-label={pinned ? "Unpin navigation bar" : "Pin navigation bar"}
            title={pinned ? "Unpin nav" : "Pin nav always visible"}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg",
              "transition-all duration-200 active:scale-95 min-w-[44px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cbc-crimson"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                pinned ? "bg-cbc-gold/15 text-cbc-gold" : "text-cbc-muted/50"
              )}
            >
              {pinned ? (
                <Pin size={16} strokeWidth={2.5} className="drop-shadow-[0_0_4px_rgba(245,166,35,0.4)]" />
              ) : (
                <PinOff size={16} strokeWidth={1.75} />
              )}
            </span>
            <span
              className={cn(
                "text-[9px] font-label font-semibold tracking-wide transition-colors duration-200",
                pinned ? "text-cbc-gold/80" : "text-cbc-muted/40"
              )}
            >
              {pinned ? "Pinned" : "Pin"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
