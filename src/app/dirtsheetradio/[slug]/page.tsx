import { getEpisodeBySlug, getPodcastSlugsByCategory } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { PortableTextContent } from "@/components/editorial/PortableTextContent";
import { formatDateShort } from "@/lib/utils/helpers";
import { ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";
import { SectionShell } from "@/components/layout/SectionShell";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getPodcastSlugsByCategory('dirt-sheet-radio');
    return slugs.slice(0, 50).map((slug) => ({
        slug,
    }));
}

export const revalidate = 60;

export default async function DsrEpisodePage({ params }: Props) {
    const { slug } = await params;
    const episode = await getEpisodeBySlug(slug);

    if (!episode) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-cbc-surface pb-24">
            {/* Hero Section — DSR Orange Branding */}
            <div className="relative w-full h-[50vh] min-h-[400px] bg-cbc-darker">
                {episode.heroImage ? (
                    <Image
                        src={episode.heroImage.url}
                        alt={episode.heroImage.alt || episode.title}
                        fill
                        className="object-cover opacity-60 mix-blend-overlay"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-dsr-orange/10 to-transparent flex items-center justify-center">
                        <Radio size={120} className="text-dsr-orange/20" />
                    </div>
                )}
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_-100px_100px_rgba(10,12,16,1)] pointer-events-none" />
                
                {/* Back Button */}
                <div className="absolute top-24 left-4 sm:left-8 z-20">
                    <Link 
                        href="/dirtsheetradio" 
                        className="inline-flex items-center gap-2 text-sm font-label uppercase tracking-widest text-cbc-muted hover:text-cbc-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Dirt Sheet Radio
                    </Link>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-20 z-10 flex flex-col justify-end">
                    <div className="max-w-4xl mx-auto w-full">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-dsr-orange/20 border border-dsr-orange/30 text-dsr-orange text-xs font-label font-bold tracking-widest uppercase rounded-sm backdrop-blur-sm">
                                <Radio size={12} className="fill-current" />
                                {episode.episodeNumber ? `Episode ${episode.episodeNumber}` : 'DSR'}
                            </span>
                            {episode.publishDate && (
                                <time className="text-cbc-faint text-sm font-mono tracking-wider">
                                    {formatDateShort(episode.publishDate)}
                                </time>
                            )}
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-white leading-[1.05] tracking-tight mb-4 drop-shadow-2xl">
                            {episode.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="relative z-10 -mt-12 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Background Glows — DSR Orange */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-dsr-orange/5 blur-[120px] rounded-full pointer-events-none -z-10" />
                    
                    <div className="card-cinematic bg-cbc-darker/60 backdrop-blur-2xl border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                        <SectionShell background="transparent" noPadding={false} className="py-12 sm:py-20 border-none">
                            {/* Embed player if available */}
                            {episode.embedCode && (
                                <div className="mb-16 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                                    <div dangerouslySetInnerHTML={{ __html: episode.embedCode }} />
                                </div>
                            )}
                            
                            {episode.description && (
                                <div className="max-w-3xl mx-auto mb-16 text-2xl text-cbc-white/90 font-heading leading-tight border-l-4 border-dsr-orange pl-8 italic">
                                    <p>{episode.description}</p>
                                </div>
                            )}

                            <PortableTextContent value={(episode as any).content} />
                            
                            {/* External Links */}
                            {(episode.spotifyUrl || episode.appleUrl) && (
                                <div className="max-w-3xl mx-auto mt-16 flex flex-wrap gap-4">
                                    {episode.spotifyUrl && (
                                        <a href={episode.spotifyUrl} target="_blank" className="px-8 py-4 bg-[#1DB954] text-white rounded-full font-heading font-bold tracking-wide hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                                            Listen on Spotify
                                        </a>
                                    )}
                                    {episode.appleUrl && (
                                        <a href={episode.appleUrl} target="_blank" className="px-8 py-4 bg-[#FA243C] text-white rounded-full font-heading font-bold tracking-wide hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                                            Listen on Apple
                                        </a>
                                    )}
                                </div>
                            )}
                        </SectionShell>
                    </div>

                    {/* Recirculation */}
                    <div className="mt-16 text-center">
                        <Link 
                            href="/dirtsheetradio"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-cbc-surface border border-cbc-border text-cbc-muted hover:text-cbc-white hover:border-dsr-orange/50 rounded-cbc transition-all duration-300 font-label tracking-widest uppercase text-sm"
                        >
                            Back to Dirt Sheet Radio <ArrowLeft size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
