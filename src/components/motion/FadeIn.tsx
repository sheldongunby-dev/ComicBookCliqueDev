"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
    once?: boolean;
}

export function FadeIn({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 0.6,
    once = true,
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-80px 0px" });

    const directionMap = {
        up: { y: 32 },
        down: { y: -32 },
        left: { x: 32 },
        right: { x: -32 },
        none: {},
    };

    const variants: Variants = {
        hidden: { opacity: 0, ...directionMap[direction] },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
    once?: boolean;
}

export function StaggerContainer({
    children,
    className,
    stagger = 0.1,
    delay = 0,
    once = true,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once, margin: "-60px 0px" });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={containerVariants}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const staggerChild: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

interface RevealTextProps {
    text: string;
    className?: string;
    delay?: number;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function RevealText({
    text,
    className,
    delay = 0,
    as: Tag = "h2",
}: RevealTextProps) {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-40px 0px" });

    const words = text.split(" ");

    return (
        <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} aria-label={text}>
            <span className="inline" aria-hidden="true">
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        className="inline-block overflow-hidden"
                        style={{ marginRight: "0.25em" }}
                    >
                        <motion.span
                            className="inline-block"
                            initial={{ y: "110%", opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: delay + i * 0.05,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                        >
                            {word}
                        </motion.span>
                    </motion.span>
                ))}
            </span>
        </Tag>
    );
}
