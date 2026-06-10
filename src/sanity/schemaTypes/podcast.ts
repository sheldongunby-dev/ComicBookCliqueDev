import { defineField, defineType } from 'sanity'
import { richTextBody } from './article'

export const podcast = defineType({
  name: 'podcast',
  title: '🎙️ Podcast Episodes',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media & Links' },
    { name: 'meta', title: 'Publishing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Episode Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Episode Description',
      type: 'text',
      group: 'content',
      description: 'What this episode covers. Shown on cards and in podcast directories.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Thumbnail / Cover Art',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Show Notes / Episode Body',
      group: 'content',
      ...richTextBody,
    }),
    // ── Media Group ──
    defineField({
      name: 'spotifyUrl',
      title: 'Spotify URL',
      type: 'url',
      group: 'media',
      description: 'Direct link to this episode on Spotify',
    }),
    defineField({
      name: 'appleUrl',
      title: 'Apple Podcasts URL',
      type: 'url',
      group: 'media',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      group: 'media',
      description: 'If the episode has a video version on YouTube',
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'media',
      description: 'e.g. "1h 12m" or "45:30"',
    }),
    // ── Meta Group ──
    defineField({
      name: 'publishDate',
      title: 'Air Date',
      type: 'date',
      group: 'meta',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'episodeNumber',
      title: 'Episode Number',
      type: 'number',
      group: 'meta',
    }),
    defineField({
      name: 'category',
      title: 'Show / Series',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Major Issues Podcast', value: 'major-issues' },
          { title: 'Dirt Sheet Radio', value: 'dirt-sheet-radio' },
          { title: 'Gaming Podcast', value: 'gaming' },
          { title: 'Pop Culture Pod', value: 'pop-culture' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'major-issues',
    }),
    defineField({
      name: 'author',
      title: 'Host(s)',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'author_name',
      title: 'Host Name (fallback)',
      type: 'string',
      group: 'meta',
      initialValue: 'Major Issues Podcast',
    }),
    defineField({
      name: 'featured',
      title: 'Feature This Episode',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    // ── SEO Group ──
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      type: 'image',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      episodeNumber: 'episodeNumber',
      author: 'author.name',
      authorFallback: 'author_name',
      media: 'heroImage',
    },
    prepare({ title, episodeNumber, author, authorFallback, media }) {
      return {
        title: episodeNumber ? `Ep. ${episodeNumber} — ${title}` : title,
        subtitle: author || authorFallback || 'Unknown',
        media,
      }
    },
  },
})
