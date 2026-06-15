import { defineField, defineType } from 'sanity'

// Shared rich text body definition — reused across content types
export const richTextBody = {
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) =>
                  Rule.uri({ allowRelative: true, scheme: ['https', 'http', 'mailto'] }),
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
        ],
      },
    },
    // Inline images with caption + alt text
    {
      type: 'r2-image',
      options: { hotspot: true },
    },
    // YouTube / video embed block
    {
      type: 'object',
      name: 'videoEmbed',
      title: 'Video Embed',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'YouTube or Vimeo URL',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption (optional)',
        },
      ],
      preview: {
        select: { title: 'url' },
        prepare: (val: any) => ({ title: `🎥 ${val.title}` }),
      },
    },
    // Pull quote highlight block
    {
      type: 'object',
      name: 'pullQuote',
      title: 'Pull Quote',
      fields: [
        { name: 'quote', type: 'text', title: 'Quote text' },
        { name: 'attribution', type: 'string', title: 'Attribution (optional)' },
      ],
      preview: {
        select: { title: 'quote' },
        prepare: (val: any) => ({ title: `💬 ${val.title}` }),
      },
    },
  ],
}

export const article = defineType({
  name: 'article',
  title: '📰 Articles & Features',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'meta', title: 'Publishing & Author' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Content Group ──
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
      title: 'Excerpt / Summary',
      type: 'text',
      group: 'content',
      description: 'Shown on article cards and used as the default SEO meta description. Keep under 160 characters.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'r2-image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Article Body',
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
          { title: 'Interviews', value: 'interviews' },
          { title: 'Features', value: 'features' },
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
      description: 'Used if no Author profile is linked above.',
      initialValue: 'ComicBook Clique',
    }),
    defineField({
      name: 'featured',
      title: 'Feature on Homepage',
      type: 'boolean',
      group: 'meta',
      description: 'Pin this article to the featured section',
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
      description: 'Overrides the article title in search engine results. Keep under 60 characters.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Meta Description',
      type: 'text',
      group: 'seo',
      description: 'Overrides the excerpt for search engines. Keep under 160 characters.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OG Image)',
      type: 'r2-image',
      group: 'seo',
      description: 'Image shown when this article is shared on social media. Recommended: 1200×630px.',
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
    prepare(selection) {
      const { title, author, authorFallback, media, featured } = selection
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `by ${author || authorFallback || 'Unknown'}`,
        media,
      }
    },
  },
})
