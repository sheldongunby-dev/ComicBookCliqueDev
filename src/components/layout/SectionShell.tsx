import { type ReactNode } from "react";
import { cn } from "@/lib/utils/helpers";

interface SectionShellProps {
    children: ReactNode;
    className?: string;
    id?: string;
    fullBleed?: boolean;
    noPadding?: boolean;
    background?: "dark" | "darker" | "surface" | "transparent";
    halftone?: boolean;
}

export function SectionShell({
    children,
    className,
    id,
    fullBleed = false,
    noPadding = false,
    background = "transparent",
    halftone = false,
}: SectionShellProps) {
    const bgMap = {
        dark: "bg-cbc-black",
        darker: "bg-cbc-darker",
        surface: "bg-cbc-surface",
        transparent: "bg-transparent",
    };

    return (
        <section
            id={id}
            className={cn(
                bgMap[background],
                "relative overflow-hidden",
                !noPadding && "py-section",
                className
            )}
        >
            {halftone && (
                <div className="absolute inset-0 bg-transparent halftone opacity-40 pointer-events-none" />
            )}
            
            <div className="relative z-10">
                {fullBleed ? children : (
                    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
}

interface SectionHeaderProps {
    label?: string;
    title: string;
    description?: string;
    titleAccent?: "crimson" | "gold" | "cyan" | "purple";
    align?: "left" | "center";
    action?: ReactNode;
}

export function SectionHeader({
    label,
    title,
    description,
    titleAccent = "crimson",
    align = "left",
    action,
}: SectionHeaderProps) {
    const accentMap = {
        crimson: "text-cbc-crimson",
        gold: "text-cbc-gold",
        cyan: "text-cbc-cyan",
        purple: "text-cbc-purple",
    };

    const accentBorderMap = {
        crimson: "bg-cbc-crimson",
        gold: "bg-cbc-gold",
        cyan: "bg-cbc-cyan",
        purple: "bg-cbc-purple",
    };

    return (
        <div className={cn(
            "flex items-end justify-between mb-8 gap-4",
            align === "center" && "flex-col items-center text-center"
        )}>
            <div>
                {label && (
                    <div className="flex items-center gap-3 mb-2">
                        <div className={cn("w-8 h-px", accentBorderMap[titleAccent])} />
                        <span className={cn(
                            "font-label text-xs font-semibold tracking-[0.25em] uppercase",
                            accentMap[titleAccent]
                        )}>
                            {label}
                        </span>
                    </div>
                )}
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-cbc-white tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="text-cbc-muted text-sm mt-1 leading-relaxed max-w-xl">
                        {description}
                    </p>
                )}
            </div>
            {action && align !== "center" && (
                <div className="shrink-0">{action}</div>
            )}
        </div>
    );
}

interface CategoryPillProps {
    label: string;
    href: string;
    color?: "crimson" | "gold" | "cyan" | "purple";
    active?: boolean;
}

export function CategoryPill({ label, href, color = "crimson", active = false }: CategoryPillProps) {
    const colorMap = {
        crimson: active
            ? "bg-cbc-crimson text-white border-cbc-crimson"
            : "text-cbc-muted border-cbc-border hover:border-cbc-crimson/40 hover:text-cbc-crimson",
        gold: active
            ? "bg-cbc-gold text-cbc-black border-cbc-gold"
            : "text-cbc-muted border-cbc-border hover:border-cbc-gold/40 hover:text-cbc-gold",
        cyan: active
            ? "bg-cbc-cyan text-cbc-black border-cbc-cyan"
            : "text-cbc-muted border-cbc-border hover:border-cbc-cyan/40 hover:text-cbc-cyan",
        purple: active
            ? "bg-cbc-purple text-white border-cbc-purple"
            : "text-cbc-muted border-cbc-border hover:border-cbc-purple/40 hover:text-cbc-purple",
    };

    return (
        <a
            href={href}
            className={cn(
                "inline-flex items-center px-4 py-1.5 border rounded-full text-sm font-label font-semibold tracking-wide transition-all duration-200 whitespace-nowrap",
                colorMap[color]
            )}
        >
            {label}
        </a>
    );
}
