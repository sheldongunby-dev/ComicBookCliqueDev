import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { SectionShell } from "@/components/layout/SectionShell";
import { FadeIn } from "@/components/motion/FadeIn";
import { Facebook, Instagram, Youtube, Twitter, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
    title: "Contact — Comic Book Clique",
    description: "Get in touch with the Comic Book Clique team. Partner with us, send fan mail, or inquire about sponsorships.",
    path: "/contact",
});

const SOCIAL = [
    { icon: Facebook, label: "Facebook", href: "http://www.facebook.com/comicbookclique", handle: "@comicbookclique", color: "text-blue-400" },
    { icon: Instagram, label: "Instagram", href: "http://www.instagram.com/comicbookclique", handle: "@comicbookclique", color: "text-pink-400" },
    { icon: Youtube, label: "YouTube", href: "http://www.youtube.com/comicbookclique", handle: "comicbookclique", color: "text-red-400" },
    { icon: Twitter, label: "X / Twitter", href: "http://www.x.com/MajorIssuesCBC", handle: "@MajorIssuesCBC", color: "text-cbc-white" },
];

export default function ContactPage() {
    return (
        <>
            <div className="relative bg-cbc-darker border-b border-cbc-border pt-32 pb-12">
                <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-px bg-cbc-cyan" />
                        <span className="font-label text-xs font-semibold tracking-[0.25em] uppercase text-cbc-cyan">Get in Touch</span>
                    </div>
                    <h1 className="font-display text-display-xl text-cbc-white leading-none uppercase">Contact</h1>
                    <p className="text-cbc-muted mt-3 max-w-lg leading-relaxed">
                        Fan mail, partnership inquiries, sponsorship info, or just want to say hi? We&apos;re here.
                    </p>
                </div>
            </div>

            <SectionShell background="dark">
                <FadeIn>
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact form */}
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-cbc-white mb-6">Send a Message</h2>
                            <form className="flex flex-col gap-4" action="/contact">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="name" className="text-xs font-label font-semibold tracking-widest uppercase text-cbc-muted">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            className="px-4 py-3 bg-cbc-surface border border-cbc-border rounded-cbc text-cbc-white placeholder:text-cbc-faint focus:outline-none focus:border-cbc-cyan/50 transition-colors font-body text-sm"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="email" className="text-xs font-label font-semibold tracking-widest uppercase text-cbc-muted">Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            className="px-4 py-3 bg-cbc-surface border border-cbc-border rounded-cbc text-cbc-white placeholder:text-cbc-faint focus:outline-none focus:border-cbc-cyan/50 transition-colors font-body text-sm"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="subject" className="text-xs font-label font-semibold tracking-widest uppercase text-cbc-muted">Subject</label>
                                    <select
                                        id="subject"
                                        className="px-4 py-3 bg-cbc-surface border border-cbc-border rounded-cbc text-cbc-white focus:outline-none focus:border-cbc-cyan/50 transition-colors font-body text-sm"
                                    >
                                        <option value="">Select a topic</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="sponsorship">Sponsorship / Partnership</option>
                                        <option value="press">Press</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="correction">Content Correction</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="message" className="text-xs font-label font-semibold tracking-widest uppercase text-cbc-muted">Message</label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        required
                                        className="px-4 py-3 bg-cbc-surface border border-cbc-border rounded-cbc text-cbc-white placeholder:text-cbc-faint focus:outline-none focus:border-cbc-cyan/50 transition-colors font-body text-sm resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="self-start flex items-center gap-2 px-6 py-3 bg-cbc-crimson hover:bg-cbc-crimson-dim text-white font-heading font-semibold rounded-cbc transition-all duration-300 tracking-wide shadow-cbc text-sm"
                                >
                                    <Mail size={15} /> Send Message
                                </button>
                            </form>
                        </div>

                        {/* Social links */}
                        <div>
                            <h2 className="font-heading text-xl font-semibold text-cbc-white mb-6">Find Us Online</h2>
                            <div className="flex flex-col gap-4">
                                {SOCIAL.map(({ icon: Icon, label, href, handle, color }) => (
                                    <a
                                        key={href}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 p-4 rounded-card bg-cbc-surface border border-cbc-border hover:border-cbc-border/80 transition-all duration-200"
                                    >
                                        <Icon size={20} className={`${color} shrink-0`} />
                                        <div>
                                            <div className="text-sm font-heading font-semibold text-cbc-white group-hover:text-cbc-gold transition-colors duration-200">{label}</div>
                                            <div className="text-xs text-cbc-faint">{handle}</div>
                                        </div>
                                        <span className="ml-auto text-xs text-cbc-faint opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 p-5 bg-cbc-surface border border-cbc-border rounded-card">
                                <h3 className="font-heading text-sm font-semibold text-cbc-white mb-2">Sponsorship Inquiries</h3>
                                <p className="text-xs text-cbc-muted leading-relaxed">
                                    Interested in reaching a passionate fandom audience? Comic Book Clique offers sponsorship opportunities across our site, podcast, and social channels.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </SectionShell>
        </>
    );
}
