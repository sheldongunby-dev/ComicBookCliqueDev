import { defineField, defineType } from 'sanity'
import { richTextBody } from './article'

export const review = defineType({
  name: 'review',
  title: '⭐ Reviews',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'verdict', title: 'Verdict & Scoring' },
    { name: 'meta', title: 'Publishing & Author' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      title: 'Quick Take',
      type: 'text',
      group: 'content',
      description: 'One-line verdict shown on review cards.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Cover / Poster Image',
      type: 'r2-image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'caption', type: 'string', title: 'Caption (optional)' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Full Review',
      group: 'content',
      ...richTextBody,
    }),
    // ── Verdict Group ──
    defineField({
      name: 'rating',
      title: 'Rating (0–10)',
      type: 'number',
      group: 'verdict',
      description: 'Decimal ratings allowed (e.g. 8.5)',
      validation: (Rule) => Rule.min(0).max(10),
    }),
    defineField({
      name: 'verdict',
      title: 'Verdict Label',
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
      name: 'pros',
      title: 'Pros',
      type: 'array',
      group: 'verdict',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Bullet points shown in the score card',
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      group: 'verdict',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    // ── Meta Group ──
    defineField({
      name: 'publishDate',
      title: 'Publish Date',
      type: 'date',
      group: 'meta',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'category',
      title: 'Review Type',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Comic Book', value: 'comics' },
          { title: 'Movie', value: 'movies' },
          { title: 'TV Show', value: 'tv' },
          { title: 'Video Game', value: 'gaming' },
          { title: 'Wrestling Event', value: 'wrestling' },
          { title: 'Graphic Novel', value: 'graphic-novel' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'comics',
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
      type: 'r2-image',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      authorFallback: 'author_name',
      media: 'heroImage',
      rating: 'rating',
    },
    prepare({ title, author, authorFallback, media, rating }) {
      return {
        title: `${rating ? `${rating}/10 — ` : ''}${title}`,
        subtitle: `by ${author || authorFallback || 'Unknown'}`,
        media,
      }
    },
  },
})
