import { buildMetadata } from "@/lib/seo/metadata";
import { ShoppingBag, ExternalLink, Sparkles, Tag } from "lucide-react";
import { SectionShell, SectionHeader } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = buildMetadata({
    title: "Official Store — Comic Book Clique Merch",
    description: "Official Comic Book Clique and Dirt Sheet Radio shirts, hoodies, stickers, and fan apparel on TeePublic.",
    path: "/merch",
});

const STORES = [
    {
        id: "teepublic",
        name: "Comic Book Clique Store",
        description: "Official Comic Book Clique merchandise. Tees, hoodies, stickers, and fan gear on TeePublic.",
        href: "https://www.teepublic.com/stores/comicbook-clique?utm_campaign=9513&utm_medium=affiliate&utm_source=ComicBook%2BClique",
        external: true,
        accent: "cbc-crimson" as const,
        label: "Shop CBC Store",
    },
    {
        id: "dsr",
        name: "Dirt Sheet Radio Store",
        description: "Official DSR wrestling merchandise. Heavyweight tees, hoodies, and decals for the hardcore wrestling fan.",
        href: "https://www.teepublic.com/stores/comicbook-clique?query=dirt+sheet+radio&utm_campaign=9513&utm_medium=affiliate&utm_source=ComicBook%2BClique",
        external: true,
        accent: "cbc-gold" as const,
        label: "Shop DSR Store",
    },
];

const FEATURED_PRODUCTS = [
    {
        id: "we-the-worthy-tee",
        name: "We The Worthy Tee",
        category: "T-Shirts",
        price: "$22.00",
        originalPrice: "$26.00",
        tag: "Bestseller",
        accent: "cbc-crimson" as const,
        imagePath: "https://images.teepublic.com/derived/production/designs/59681125_2/1714066412/i_p:c_191919,s_313,q_90.jpg",
        href: "https://www.teepublic.com/t-shirt/59681125-acknowledge-the-motto?store_id=222268",
    },
    {
        id: "red-guardian-limo-tee",
        name: "Red Guardian Limo Service Tee",
        category: "T-Shirts",
        price: "$22.00",
        originalPrice: "$26.00",
        tag: "Hot Drop",
        accent: "cbc-crimson" as const,
        imagePath: "https://images.teepublic.com/derived/production/designs/74864888_2/1746412153/i_p:c_6e2229,s_313,q_90.jpg",
        href: "https://www.teepublic.com/t-shirt/74864888-red-guardian-limo-service?store_id=222268",
    },
    {
        id: "wcv-thunderbolts-tee",
        name: "WCV Thunderbolts Tee",
        category: "T-Shirts",
        price: "$22.00",
        originalPrice: "$26.00",
        tag: "New Release",
        accent: "cbc-gold" as const,
        imagePath: "https://images.teepublic.com/derived/production/designs/74803950_1/1746202509/i_p:c_fffffe,b_heather_texture,s_313,q_90.jpg",
        href: "https://www.teepublic.com/t-shirt/74803950-wcv-thunderbolts?store_id=222268",
    },
    {
        id: "tchalla-4ever-tee",
        name: "TChalla 4Ever Tee",
        category: "T-Shirts",
        price: "$22.00",
        originalPrice: "$26.00",
        tag: "Legacy",
        accent: "cbc-gold" as const,
        imagePath: "https://images.teepublic.com/derived/production/designs/36123619_0/1667137231/i_p:c_191919,s_313,q_90.jpg",
        href: "https://www.teepublic.com/t-shirt/36123619-tchalla-4ever?store_id=222268",
    }
];

const ACCENT_STYLES = {
    "cbc-crimson": {
        border: "border-cbc-crimson/20 hover:border-cbc-crimson/40",
        topBorder: "bg-cbc-crimson",
        icon: "text-cbc-crimson",
        button: "bg-cbc-crimson hover:bg-cbc-crimson-dim text-cbc-white shadow-cbc/20 focus-cbc hover:shadow-cbc/40",
    },
    "cbc-gold": {
        border: "border-cbc-gold/20 hover:border-cbc-gold/40",
        topBorder: "bg-cbc-gold",
        icon: "text-cbc-gold",
        button: "bg-cbc-gold hover:bg-cbc-gold-dim text-cbc-black shadow-cbc-gold/20 focus-cbc hover:shadow-cbc-gold/40",
    }
} as const;

export default function MerchPage() {
    return (
        <>
            {/* ── Page Hero ── */}
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-cbc-crimson/5 via-transparent to-transparent" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cbc-gold/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-gold" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-gold">Official Hub</span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase mb-3">Rep the Clique</h1>
                    <p className="text-cbc-muted max-w-lg leading-relaxed font-body">
                        Official Comic Book Clique and Dirt Sheet Radio apparel. Cozy heavyweight tees, hoodies, and premium collector decals.
                    </p>
                </div>
            </div>

            {/* ── Official Store Nodes ── */}
            <SectionShell background="dark" className="border-b border-cbc-border/40">
                <FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {STORES.map((store) => {
                            const styles = ACCENT_STYLES[store.accent];
                            return (
                                <div
                                    key={store.id}
                                    className={`card-cinematic p-8 relative overflow-hidden border ${styles.border}`}
                                >
                                    <div className={`absolute top-0 left-0 w-full h-[2px] ${styles.topBorder}`} />
                                    <ShoppingBag size={28} className={`${styles.icon} mb-4`} />
                                    <h2 className="font-heading text-2xl font-bold text-cbc-white mb-2">{store.name}</h2>
                                    <p className="text-cbc-muted text-sm leading-relaxed mb-6">{store.description}</p>
                                    <a
                                        href={store.href}
                                        target={store.external ? "_blank" : undefined}
                                        rel={store.external ? "noopener noreferrer" : undefined}
                                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide text-sm w-full sm:w-auto ${styles.button}`}
                                    >
                                        {store.external && <ExternalLink size={14} />}
                                        {store.label}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </FadeIn>
            </SectionShell>

            {/* ── Dynamic Shirt Previews Showcase ── */}
            <SectionShell background="darker">
                <SectionHeader
                    label="Official Catalog"
                    title="Featured Apparel"
                    description="Take a preview of our premium, high-quality shirts and fan gear. Select any item to customize colors and order details."
                    titleAccent="gold"
                />

                <FadeIn>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_PRODUCTS.map((prod) => (
                            <div
                                key={prod.id}
                                className="group relative bg-cbc-surface/40 border border-cbc-border/60 rounded-cbc overflow-hidden flex flex-col hover:border-cbc-gold/30 hover:bg-cbc-surface/60 transition-all duration-300 shadow-cinematic hover:shadow-cbc-gold/5"
                            >
                                {/* Real Product Photo Backdrop */}
                                <div className="relative aspect-square bg-cbc-darker border-b border-cbc-border/40 overflow-hidden flex items-center justify-center p-0">
                                    <Image
                                        src={prod.imagePath}
                                        alt={prod.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                                        loading="lazy"
                                    />
                                    
                                    {/* Glowing product tag */}
                                    <span className="absolute top-4 left-4 bg-cbc-black/85 backdrop-blur-md border border-cbc-border/80 text-cbc-gold text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-1 rounded-sm flex items-center gap-1 z-10 shadow-lg">
                                        <Sparkles size={8} /> {prod.tag}
                                    </span>
                                    
                                    {/* Category badge */}
                                    <span className="absolute bottom-4 left-4 bg-cbc-black/80 backdrop-blur-sm border border-cbc-border/30 text-cbc-muted text-[10px] font-label font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm z-10 shadow-md">
                                        {prod.category}
                                    </span>
                                </div>

                                {/* Product details */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-heading text-lg font-bold text-cbc-white mb-2 leading-tight group-hover:text-cbc-gold transition-colors duration-200">
                                            {prod.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-cbc-white font-mono font-bold text-base">{prod.price}</span>
                                            <span className="text-cbc-faint font-mono text-xs line-through">{prod.originalPrice}</span>
                                            <span className="text-[9px] font-mono font-bold uppercase text-pod-teal bg-pod-teal/10 px-1 py-0.5 rounded-sm flex items-center gap-0.5 border border-pod-teal/10">
                                                <Tag size={8} /> Sale
                                            </span>
                                        </div>
                                    </div>

                                    <a
                                        href={prod.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2.5 bg-cbc-surface hover:bg-cbc-gold hover:text-cbc-black border border-cbc-border hover:border-cbc-gold text-cbc-white text-xs font-label font-bold uppercase tracking-widest text-center rounded-cbc transition-all duration-300 flex items-center justify-center gap-1.5 focus-cbc"
                                    >
                                        Customize & Buy <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </SectionShell>
        </>
    );
}
