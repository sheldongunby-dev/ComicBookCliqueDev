import { defineField, defineType } from 'sanity'
import { richTextBody } from './article'

export const interview = defineType({
  name: 'interview',
  title: '🎤 Interviews',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing & Author' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Interview Title',
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
      name: 'interviewee',
      title: 'Interviewee Name',
      type: 'string',
      group: 'content',
      description: 'The person being interviewed',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intervieweeRole',
      title: 'Interviewee Role / Title',
      type: 'string',
      group: 'content',
      description: 'e.g. "Writer, X-Men #1" or "Director, The Batman"',
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary / Teaser',
      type: 'text',
      group: 'content',
      description: 'Short preview shown on interview cards.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'caption', type: 'string', title: 'Caption (optional)' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Interview Body',
      group: 'content',
      ...richTextBody,
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
      title: 'Category',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Comics', value: 'comics' },
          { title: 'Movies', value: 'movies' },
          { title: 'TV', value: 'tv' },
          { title: 'Gaming', value: 'gaming' },
          { title: 'Wrestling', value: 'wrestling' },
          { title: 'Pop Culture', value: 'pop-culture' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'comics',
    }),
    defineField({
      name: 'author',
      title: 'Interviewer',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'author_name',
      title: 'Interviewer Name (fallback)',
      type: 'string',
      group: 'meta',
      initialValue: 'ComicBook Clique',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
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
      subtitle: 'interviewee',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `With: ${subtitle}` : '',
        media,
      }
    },
  },
})
