import { defineField, defineType } from 'sanity'
import { richTextBody } from './article'

export const podcastReview = defineType({
  name: 'podcastReview',
  title: '🟢 Podcast Reviews',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'verdict', title: 'Verdict & Scoring' },
    { name: 'meta', title: 'Publishing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'showName',
      title: 'Podcast Show Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'showName', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'episodeTitle',
      title: 'Episode Reviewed',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'One-Line Take',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'heroImage',
      title: 'Show Art / Episode Image',
      type: 'r2-image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'notes',
      title: 'Full Review Notes',
      group: 'content',
      ...richTextBody,
    }),
    // ── Verdict Group ──
    defineField({
      name: 'rating',
      title: 'Rating (0–10)',
      type: 'number',
      group: 'verdict',
      validation: (Rule) => Rule.min(0).max(10),
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict',
      type: 'string',
      group: 'verdict',
      options: {
        list: [
          { title: '🔥 Essential', value: 'Essential' },
          { title: '✅ Recommended', value: 'Recommended' },
          { title: '⭐ Masterful', value: 'Masterful' },
          { title: '🎯 Divisive', value: 'Divisive' },
          { title: '⚠️ Skip It', value: 'Skip It' },
        ],
        layout: 'radio',
      },
      initialValue: 'Recommended',
    }),
    defineField({
      name: 'badge',
      title: 'Badge Label',
      type: 'string',
      group: 'verdict',
      description: 'Optional badge shown on the card (e.g. "Must Listen", "Instant Classic")',
    }),
    // ── Meta Group ──
    defineField({
      name: 'publishDate',
      title: 'Review Date',
      type: 'date',
      group: 'meta',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Wrestling', value: 'wrestling' },
          { title: 'Comics', value: 'comics' },
          { title: 'Pop Culture', value: 'pop-culture' },
          { title: 'True Crime', value: 'true-crime' },
          { title: 'Tech', value: 'tech' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'wrestling',
    }),
    defineField({
      name: 'author',
      title: 'Reviewer',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'author_name',
      title: 'Reviewer Name (fallback)',
      type: 'string',
      group: 'meta',
      initialValue: 'ComicBook Clique',
    }),
    defineField({
      name: 'featured',
      title: 'Feature This Review',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
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
      type: 'r2-image',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'showName',
      subtitle: 'episodeTitle',
      media: 'heroImage',
      rating: 'rating',
    },
    prepare({ title, subtitle, media, rating }) {
      return {
        title: `${rating ? `${rating}/10 — ` : ''}${title}`,
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
