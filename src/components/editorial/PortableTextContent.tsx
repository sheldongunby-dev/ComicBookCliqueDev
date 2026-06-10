'use client'

import { PortableText } from '@portabletext/react'
import { PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { cn } from '@/lib/utils/helpers'

interface PortableTextContentProps {
  value: any[] | null | undefined
  className?: string
}

/**
 * Renders Sanity Portable Text with the site's editorial styling.
 * Supports: headings, bold, italic, code, links, images, blockquotes,
 * video embeds, and pull quotes.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-cbc-white/80 leading-[1.8] mb-8 text-lg">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="text-4xl mt-16 mb-8 font-heading font-bold text-cbc-white tracking-tight border-l-4 border-cbc-crimson pl-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl mt-10 mb-6 font-heading font-bold text-cbc-gold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl mt-8 mb-4 font-heading text-cbc-white/90">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-cbc-crimson pl-8 py-4 bg-cbc-crimson/5 backdrop-blur-sm rounded-r-xl italic text-cbc-white font-heading text-2xl my-12 shadow-cbc">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-8 text-cbc-white/70 font-body space-y-3">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-8 text-cbc-white/70 font-body space-y-3">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="mb-3">{children}</li>,
    number: ({ children }) => <li className="mb-3">{children}</li>,
  },

  marks: {
    strong: ({ children }) => (
      <strong className="text-cbc-white font-extrabold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-cbc-darker text-cbc-cyan px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    ),
    'strike-through': ({ children }) => <s className="opacity-60">{children}</s>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ value, children }) => {
      const href = value?.href ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          target={value?.blank || isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-cbc-crimson font-semibold no-underline hover:underline hover:text-cbc-crimson/80 transition-all"
        >
          {children}
        </a>
      )
    },
  },

  types: {
    // Inline image with caption
    image: ({ value }) => {
      if (!value?.asset?.url && !value?.asset?._ref) return null
      // Build URL from reference if needed
      const url = value.asset?.url ?? `/api/sanity-image?ref=${value.asset._ref}`
      return (
        <figure className="my-12">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <Image
              src={url}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-cbc-muted mt-3 font-body italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // YouTube / Vimeo embed
    videoEmbed: ({ value }) => {
      if (!value?.url) return null
      // Convert watch URL to embed URL
      let embedUrl = value.url
      if (embedUrl.includes('youtube.com/watch?v=')) {
        const id = new URL(embedUrl).searchParams.get('v')
        embedUrl = `https://www.youtube.com/embed/${id}`
      } else if (embedUrl.includes('youtu.be/')) {
        const id = embedUrl.split('youtu.be/')[1]?.split('?')[0]
        embedUrl = `https://www.youtube.com/embed/${id}`
      } else if (embedUrl.includes('vimeo.com/')) {
        const id = embedUrl.split('vimeo.com/')[1]?.split('?')[0]
        embedUrl = `https://player.vimeo.com/video/${id}`
      }
      return (
        <figure className="my-12">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <iframe
              src={embedUrl}
              title={value.caption ?? 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-cbc-muted mt-3 font-body italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // Pull quote highlight block
    pullQuote: ({ value }) => {
      if (!value?.quote) return null
      return (
        <aside className="my-16 px-8 py-10 bg-gradient-to-br from-cbc-crimson/10 to-transparent border border-cbc-crimson/20 rounded-2xl">
          <blockquote className="text-3xl font-heading font-bold text-cbc-white italic leading-tight">
            &ldquo;{value.quote}&rdquo;
          </blockquote>
          {value.attribution && (
            <p className="mt-4 text-cbc-muted font-label tracking-widest uppercase text-sm">
              — {value.attribution}
            </p>
          )}
        </aside>
      )
    },
  },
}

export function PortableTextContent({ value, className }: PortableTextContentProps) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return (
      <p className="text-cbc-muted italic font-body">
        Content coming soon.
      </p>
    )
  }

  // Apply drop-cap to the first block visually via CSS — handled by container class
  return (
    <div className={cn('portable-text-body first-paragraph-dropcap', className)}>
      <PortableText value={value} components={components} />
    </div>
  )
}
