import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: Settings,
  groups: [
    { name: 'homepage', title: 'Homepage' },
    { name: 'merch', title: 'Merchandise' },
    { name: 'sponsors', title: 'Sponsors' },
  ],
  fields: [
    // ── Homepage Settings ──
    defineField({
      name: 'showHero',
      title: 'Show Hero Carousel',
      description: 'Toggle the massive hero carousel at the top of the homepage on or off.',
      type: 'boolean',
      initialValue: true,
      group: 'homepage',
    }),
    defineField({
      name: 'manualHeroArticles',
      title: 'Manual Hero Selection',
      description: 'Select exactly which 3 articles to show in the Hero Carousel. If left empty, the site will automatically use the 3 most recently "Featured" articles.',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'article' }, { type: 'news' }, { type: 'review' }, { type: 'podcast' }] }
      ],
      validation: (Rule) => Rule.max(5),
      group: 'homepage',
    }),

    // ── Merchandise Settings ──
    defineField({
      name: 'merchMainLink',
      title: 'Main Store Link',
      description: 'The URL for the "Shop TeePublic" button.',
      type: 'url',
      group: 'merch',
    }),
    defineField({
      name: 'merchItems',
      title: 'Featured Merch Items',
      description: 'The specific t-shirts/items shown in the merch spotlight block.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Item Title', type: 'string' }),
            defineField({ name: 'url', title: 'Store URL', type: 'url' }),
            defineField({ name: 'image', title: 'Item Image', type: 'r2-image', options: { hotspot: true } }),
            defineField({ name: 'hoverColor', title: 'Hover Color Class', type: 'string', description: 'e.g., text-cbc-gold or text-cbc-crimson', initialValue: 'text-cbc-gold' }),
          ],
        }
      ],
      validation: (Rule) => Rule.max(2),
      group: 'merch',
    }),

    // ── Sponsor Settings ──
    defineField({
      name: 'sponsorText',
      title: 'Sponsorship Pitch',
      type: 'text',
      group: 'sponsors',
      initialValue: 'Comic Book Clique reaches thousands of passionate comic readers and pop culture fans weekly.',
    }),
    defineField({
      name: 'sponsorEmail',
      title: 'Sponsorship Contact Link',
      description: 'URL or mailto link for the "Sponsorship Inquiries" button.',
      type: 'string',
      group: 'sponsors',
      initialValue: '/contact',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
      }
    },
  },
})
