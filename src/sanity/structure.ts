import type { StructureResolver } from 'sanity/structure'
import { Settings } from 'lucide-react'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Comic Book Clique CMS')
    .items([
      // ── Singleton: Site Settings ──
      S.listItem()
        .title('Global Settings')
        .icon(Settings)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Global Settings')
        ),
      S.divider(),

      // ── Editorial Desks ──
      S.listItem()
        .title('🔴 Breaking News')
        .child(
          S.documentTypeList('news')
            .title('Breaking News')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('📰 Articles & Features')
        .child(
          S.documentTypeList('article')
            .title('Articles & Features')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('⭐ Reviews')
        .child(
          S.documentTypeList('review')
            .title('Reviews')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.listItem()
        .title('🎤 Interviews')
        .child(
          S.documentTypeList('interview')
            .title('Interviews')
            .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
        ),

      S.divider(),

      // ── Podcast Section ──
      S.listItem()
        .title('🎙️ Podcasts')
        .child(
          S.list()
            .title('Podcast Content')
            .items([
              S.listItem()
                .title('Episodes')
                .child(
                  S.documentTypeList('podcast')
                    .title('Podcast Episodes')
                    .defaultOrdering([{ field: 'episodeNumber', direction: 'desc' }])
                ),
              S.listItem()
                .title('Podcast Reviews')
                .child(
                  S.documentTypeList('podcastReview')
                    .title('Podcast Reviews')
                    .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ── Team Management ──
      S.listItem()
        .title('✍️ Authors & Contributors')
        .child(
          S.documentTypeList('author')
            .title('Authors & Contributors')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
    ])
