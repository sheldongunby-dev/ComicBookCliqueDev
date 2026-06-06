import { config, fields, collection } from '@keystatic/core';
import React from 'react';

export default config({
  ui: {
    brand: {
      name: 'Comic Book Clique CMS',
      mark: () => {
        return React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"Oswald", "Bebas Neue", sans-serif',
              fontSize: '18px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }
          },
          React.createElement(
            'span',
            {
              style: {
                backgroundColor: '#E5193A',
                color: '#FFFFFF',
                padding: '1px 6px',
                borderRadius: '3px',
                transform: 'skewX(-10deg)',
                display: 'inline-block',
                boxShadow: '1px 1px 0px #000000',
              }
            },
            'Comic'
          ),
          React.createElement(
            'span',
            {
              style: {
                color: '#F5A623',
                transform: 'skewX(-10deg)',
                display: 'inline-block',
              }
            },
            'Book'
          ),
          React.createElement(
            'span',
            {
              style: {
                color: '#FFFFFF',
                transform: 'skewX(-10deg)',
                display: 'inline-block',
              }
            },
            'Clique'
          )
        );
      }
    },
  },
  storage: {
    kind: 'local',
  },
  collections: {
    articles: collection({
      label: '📰 Articles & Features',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['publishDate', 'category', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishDate: fields.date({ label: 'Publish Date', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: 'Category', defaultValue: 'comics' }),
        excerpt: fields.text({ label: 'Excerpt / Summary', multiline: true, description: 'Shown on cards and in SEO meta descriptions. Keep under 160 characters.' }),
        author_name: fields.text({ label: 'Author Name', defaultValue: 'ComicBook Clique' }),
        featured: fields.checkbox({ label: 'Feature on Homepage', description: 'Pin this article to the featured section' }),
        heroImage_url: fields.url({ label: 'Hero Image URL', description: 'Full URL to the article cover image' }),
        heroImage_alt: fields.text({ label: 'Hero Image Alt Text' }),
        content: fields.markdoc({
          label: 'Article Body',
          description: 'Full article content. Supports headings, bold, images, links, and more.',
        }),
      },
    }),

    news: collection({
      label: '🔴 Breaking News',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['publishDate', 'category', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Headline' } }),
        publishDate: fields.date({ label: 'Publish Date', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: 'Category', defaultValue: 'comics' }),
        excerpt: fields.text({ label: 'Summary', multiline: true }),
        author_name: fields.text({ label: 'Author', defaultValue: 'ComicBook Clique' }),
        featured: fields.checkbox({ label: 'Breaking / Featured' }),
        heroImage_url: fields.url({ label: 'Image URL' }),
        heroImage_alt: fields.text({ label: 'Image Alt Text' }),
        content: fields.markdoc({ label: 'Story Body' }),
      },
    }),

    reviews: collection({
      label: '⭐ Reviews',
      slugField: 'title',
      path: 'src/content/reviews/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['publishDate', 'category', 'rating', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishDate: fields.date({ label: 'Publish Date', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: 'Review Type', defaultValue: 'comics' }),
        excerpt: fields.text({ label: 'Quick Take', multiline: true, description: 'One-line verdict shown on review cards' }),
        author_name: fields.text({ label: 'Reviewer', defaultValue: 'ComicBook Clique' }),
        featured: fields.checkbox({ label: 'Feature This Review' }),
        heroImage_url: fields.url({ label: 'Cover / Poster Image URL' }),
        heroImage_alt: fields.text({ label: 'Image Alt Text' }),
        rating: fields.number({
          label: 'Rating (0–10)',
          description: 'Decimal ratings allowed (e.g. 8.5)',
          validation: { min: 0, max: 10 },
        }),
        content: fields.markdoc({ label: 'Full Review' }),
      },
    }),

    podcasts: collection({
      label: '🎙️ Podcast Episodes',
      slugField: 'title',
      path: 'src/content/podcasts/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['episodeNumber', 'publishDate', 'category', 'featured'],
      schema: {
        title: fields.slug({ name: { label: 'Episode Title' } }),
        publishDate: fields.date({ label: 'Air Date', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: 'Show', defaultValue: 'podcast' }),
        episodeNumber: fields.number({ label: 'Episode Number' }),
        excerpt: fields.text({ label: 'Episode Description', multiline: true }),
        author_name: fields.text({ label: 'Host(s)', defaultValue: 'Major Issues Podcast' }),
        featured: fields.checkbox({ label: 'Feature This Episode' }),
        heroImage_url: fields.url({ label: 'Thumbnail / Screenshot URL' }),
        heroImage_alt: fields.text({ label: 'Image Alt Text' }),
        spotifyUrl: fields.url({ label: 'Spotify URL', description: 'Link to this episode on Spotify' }),
        duration: fields.text({ label: 'Duration (e.g. 1h 12m)', description: 'Optional runtime display' }),
        content: fields.markdoc({ label: 'Show Notes / Episode Body' }),
      },
    }),

    podcastReviews: collection({
      label: '🟢 Podcast Reviews',
      slugField: 'showName',
      path: 'src/content/podcastreviews/*',
      format: { contentField: 'notes' },
      columns: ['episodeTitle', 'publishDate', 'verdict', 'featured'],
      schema: {
        showName: fields.slug({ name: { label: 'Podcast Show Name' } }),
        episodeTitle: fields.text({ label: 'Episode Reviewed' }),
        publishDate: fields.date({ label: 'Review Date', defaultValue: { kind: 'today' } }),
        rating: fields.number({
          label: 'Rating (0–10)',
          validation: { min: 0, max: 10 },
        }),
        verdict: fields.select({
          label: 'Verdict',
          options: [
            { label: '🔥 Essential', value: 'Essential' },
            { label: '✅ Recommended', value: 'Recommended' },
            { label: '⭐ Masterful', value: 'Masterful' },
            { label: '🎯 Divisive', value: 'Divisive' },
            { label: '⚠️ Skip It', value: 'Skip It' },
          ],
          defaultValue: 'Recommended',
        }),
        category: fields.text({ label: 'Category', defaultValue: 'wrestling' }),
        excerpt: fields.text({ label: 'One-Line Take', multiline: false }),
        badge: fields.text({ label: 'Badge (e.g. "Must Listen")', description: 'Optional badge shown on the card' }),
        featured: fields.checkbox({ label: 'Feature This Review' }),
        notes: fields.markdoc({ label: 'Full Review Notes' }),
      },
    }),
  },
});
