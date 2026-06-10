import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schema } from './src/sanity/schemaTypes'
import { dataset, projectId } from './src/sanity/env'
import { structure } from './src/sanity/structure'

export default defineConfig({
  title: 'Comic Book Clique Studio',
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2026-06-07' }),
  ],
})
