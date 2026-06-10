import { type SchemaTypeDefinition } from 'sanity'
import { article } from './article'
import { news } from './news'
import { review } from './review'
import { podcast } from './podcast'
import { podcastReview } from './podcastReview'
import { interview } from './interview'
import { author } from './author'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, article, news, review, podcast, podcastReview, interview, siteSettings],
}
