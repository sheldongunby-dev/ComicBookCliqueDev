import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { SectionShell } from "@/components/layout/SectionShell";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "About — Comic Book Clique",
    description: "Learn about Comic Book Clique — a fandom media network covering comic books, reviews, the Major Issues Podcast, wrestling, gaming, and collector culture.",
    path: "/about",
});

const TEAM = [
    { name: "George Serrano", role: "Co-Founder · Lead Writer", bio: "The voice of CBC. George covers everything DC Comics — and has a lot of opinions about the Absolute Universe.", twitter: "MajorIssuesCBC" },
    { name: "Frank Jarome", role: "Feature Writer", bio: "Frank brings the editorial muscle, digging deep on indie books, Kickstarters, and creator-owned gems.", twitter: undefined },
    { name: "Jonathan Escudero", role: "News Reporter", bio: "Jonathan is your NYCC correspondent and comic convention specialist. He makes sure CBC is always first with the news.", twitter: undefined },
];

export default function AboutPage() {
    return (
        <>
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-12">
                <div className="absolute inset-0 bg-cbc-gradient opacity-30" />
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-crimson" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-crimson">Comic Book Clique</span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase">About the Clique</h1>
                </div>
            </div>

            <SectionShell background="dark">
                <div className="max-w-4xl">
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-cbc-white mb-4">What is Comic Book Clique?</h2>
                            <div className="text-cbc-muted leading-relaxed space-y-4 text-base">
                                <p>
                                    Comic Book Clique is a <strong className="text-cbc-white">fandom media network</strong> built by passionate comic fans, for passionate comic fans. We cover comic book reviews, breaking news, deep feature writing, the Major Issues Podcast, wrestling (via Dirt Sheet Radio), gaming, and pop culture.
                                </p>
                                <p>
                                    We believe great comics deserve great coverage. We&apos;re not a corporate media outlet — we&apos;re fans who happen to be good at this.
                                </p>
                                <p>
                                    The <strong className="text-cbc-purple">Major Issues Podcast</strong> is the heart of CBC — over 418 episodes deep, covering every major comic book moment as it happens.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-cbc-surface border border-cbc-border rounded-card">
                                <h3 className="font-heading font-semibold text-cbc-crimson mb-1 text-sm uppercase tracking-wide">Our Mission</h3>
                                <p className="text-cbc-muted text-sm leading-relaxed">
                                    To be the most passionate, honest, and fun voice in comic book media. No corporate fluff. Just real opinions from real fans.
                                </p>
                            </div>
                            <div className="p-5 bg-cbc-surface border border-cbc-border rounded-card">
                                <h3 className="font-heading font-semibold text-cbc-gold mb-1 text-sm uppercase tracking-wide">Dirt Sheet Radio</h3>
                                <p className="text-cbc-muted text-sm leading-relaxed">
                                    Our sister brand covering professional wrestling. Same passion, same hustle, different ring.
                                    <a href="http://www.dirtsheetradio.libsyn.com" target="_blank" rel="noopener noreferrer" className="text-cbc-crimson ml-1 hover:underline">Listen here ↗</a>
                                </p>
                            </div>
                            <div className="p-5 bg-cbc-surface border border-cbc-border rounded-card">
                                <h3 className="font-heading font-semibold text-cbc-cyan mb-1 text-sm uppercase tracking-wide">Partner With Us</h3>
                                <p className="text-cbc-muted text-sm leading-relaxed">
                                    Reach thousands of engaged comic fans through sponsorships, features, and partnerships.
                                    <Link href="/contact" className="text-cbc-cyan ml-1 hover:underline">Get in touch →</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Team */}
                    <h2 className="font-heading text-2xl font-bold text-cbc-white mb-6">The Team</h2>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {TEAM.map((member) => (
                            <div key={member.name} className="card-editorial p-5">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cbc-crimson/20 to-cbc-purple/20 border border-cbc-border mb-3 flex items-center justify-center">
                                    <span className="font-display text-xl text-cbc-crimson">
                                        {member.name[0]}
                                    </span>
                                </div>
                                <h3 className="font-heading font-semibold text-cbc-white text-sm">{member.name}</h3>
                                <p className="text-xs text-cbc-gold font-label tracking-wide mb-2">{member.role}</p>
                                <p className="text-xs text-cbc-muted leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionShell>
        </>
    );
}
