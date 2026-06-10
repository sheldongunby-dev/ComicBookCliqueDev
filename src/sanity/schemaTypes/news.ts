import { defineField, defineType } from 'sanity'
import { richTextBody } from './article'

export const news = defineType({
  name: 'news',
  title: '🔴 Breaking News',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing & Author' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
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
      title: 'Summary / Lede',
      type: 'text',
      group: 'content',
      description: 'The opening hook. Shown on news cards and used as meta description.',
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
      title: 'Story Body',
      group: 'content',
      ...richTextBody,
    }),
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
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
    }),
    defineField({
      name: 'author_name',
      title: 'Author Name (fallback)',
      type: 'string',
      group: 'meta',
      initialValue: 'ComicBook Clique',
    }),
    defineField({
      name: 'featured',
      title: 'Breaking / Featured',
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
      author: 'author.name',
      authorFallback: 'author_name',
      media: 'heroImage',
      featured: 'featured',
    },
    prepare({ title, author, authorFallback, media, featured }) {
      return {
        title: `${featured ? '🔴 ' : ''}${title}`,
        subtitle: `by ${author || authorFallback || 'Unknown'}`,
        media,
      }
    },
  },
})
