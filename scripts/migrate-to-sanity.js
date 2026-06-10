/**
 * migrate-to-sanity.js
 *
 * Reads all Keystatic .mdoc files from src/content/ and bulk-imports them
 * into Sanity via the Mutations API.
 *
 * Usage:
 *   SANITY_API_TOKEN=<write-token> node scripts/migrate-to-sanity.js
 *   node scripts/migrate-to-sanity.js --dry-run      (preview without writing)
 *   node scripts/migrate-to-sanity.js --type articles (single collection)
 *   node scripts/migrate-to-sanity.js --limit 100    (first N items for testing)
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// ── Config ──────────────────────────────────────────────
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'huoyli9r'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const API_TOKEN = process.env.SANITY_API_TOKEN

const ARGS = process.argv.slice(2)
const DRY_RUN = ARGS.includes('--dry-run')
const TYPE_FILTER = ARGS.find(a => a.startsWith('--type='))?.split('=')[1]
const LIMIT = parseInt(ARGS.find(a => a.startsWith('--limit='))?.split('=')[1] ?? '0', 10)
const BATCH_SIZE = 50

const COLLECTIONS = {
  articles:      { dir: 'articles',  sanityType: 'article' },
  news:          { dir: 'news',      sanityType: 'news' },
  reviews:       { dir: 'reviews',   sanityType: 'review' },
  podcasts:      { dir: 'podcasts',  sanityType: 'podcast' },
}

// ── Helpers ──────────────────────────────────────────────

function parseFrontmatter(raw) {
  const parts = raw.split(/^---\s*$/m)
  if (parts.length < 3) return { frontmatter: {}, body: raw }

  const yamlBlock = parts[1]
  const body = parts.slice(2).join('---').trim()

  const frontmatter = {}
  for (const line of yamlBlock.split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (!m) continue
    const [, key, rawVal] = m
    // Parse value types
    const val = rawVal.trim().replace(/^['"]|['"]$/g, '')
    if (val === 'true') frontmatter[key] = true
    else if (val === 'false') frontmatter[key] = false
    else if (!isNaN(val) && val !== '') frontmatter[key] = Number(val)
    else frontmatter[key] = val
  }
  return { frontmatter, body }
}

function slugify(str) {
  return (str ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

/**
 * Convert markdown body text into a minimal Sanity Portable Text array.
 * This is a simplified converter — headings, paragraphs, bold, italic.
 * The full content is also stored as plain text for search.
 */
function markdownToPortableText(markdown) {
  if (!markdown || !markdown.trim()) return []

  const lines = markdown.split('\n')
  const blocks = []
  let currentParagraph = []

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(' ').trim()
      if (text) {
        blocks.push({
          _type: 'block',
          _key: randomKey(),
          style: 'normal',
          children: parseInlineMarks(text),
          markDefs: [],
        })
      }
      currentParagraph = []
    }
  }

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/)
    const h3 = line.match(/^###\s+(.+)/)
    const h4 = line.match(/^####\s+(.+)/)
    const h1 = line.match(/^#\s+(.+)/)

    if (h4) {
      flushParagraph()
      blocks.push(headingBlock('h4', h4[1]))
    } else if (h3) {
      flushParagraph()
      blocks.push(headingBlock('h3', h3[1]))
    } else if (h2) {
      flushParagraph()
      blocks.push(headingBlock('h2', h2[1]))
    } else if (h1) {
      flushParagraph()
      blocks.push(headingBlock('h2', h1[1])) // promote h1 → h2
    } else if (line.trim() === '') {
      flushParagraph()
    } else {
      currentParagraph.push(line)
    }
  }
  flushParagraph()

  return blocks
}

function headingBlock(style, text) {
  return {
    _type: 'block',
    _key: randomKey(),
    style,
    children: [{ _type: 'span', _key: randomKey(), text: text.trim(), marks: [] }],
    markDefs: [],
  }
}

function parseInlineMarks(text) {
  // Split on **bold** and *italic* patterns
  const spans = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      spans.push({ _type: 'span', _key: randomKey(), text: text.slice(last, match.index), marks: [] })
    }
    if (match[2]) spans.push({ _type: 'span', _key: randomKey(), text: match[2], marks: ['strong'] })
    else if (match[3]) spans.push({ _type: 'span', _key: randomKey(), text: match[3], marks: ['em'] })
    else if (match[4]) spans.push({ _type: 'span', _key: randomKey(), text: match[4], marks: ['code'] })
    last = match.index + match[0].length
  }

  if (last < text.length) {
    spans.push({ _type: 'span', _key: randomKey(), text: text.slice(last), marks: [] })
  }

  return spans.length > 0 ? spans : [{ _type: 'span', _key: randomKey(), text, marks: [] }]
}

function randomKey() {
  return Math.random().toString(36).slice(2, 12)
}

/** Build a Sanity mutation document from frontmatter + markdown body */
function buildSanityDoc(slug, frontmatter, body, sanityType) {
  const id = `migrated-${sanityType}-${slugify(slug)}`
  const cleanSlug = slugify(slug)
  const content = markdownToPortableText(body)

  const base = {
    _id: id,
    _type: sanityType,
    slug: { _type: 'slug', current: cleanSlug },
    title: frontmatter.title ?? slug,
    publishDate: frontmatter.publishDate ?? new Date().toISOString().split('T')[0],
    category: frontmatter.category ?? null,
    excerpt: frontmatter.excerpt ?? null,
    featured: frontmatter.featured ?? false,
    author_name: frontmatter.author_name ?? 'ComicBook Clique',
    content,
  }

  // Hero image URL stored as a text field for reference — actual images stay on Squarespace CDN
  // Editors can replace them with proper Sanity assets via Studio later
  if (frontmatter.heroImage_url) {
    base._heroImageUrl = frontmatter.heroImage_url
    base._heroImageAlt = frontmatter.heroImage_alt ?? frontmatter.title ?? ''
  }

  if (sanityType === 'review') {
    base.rating = frontmatter.rating ?? null
    base.verdict = frontmatter.verdict ?? null
  }

  if (sanityType === 'podcast') {
    base.episodeNumber = frontmatter.episodeNumber ?? null
    base.spotifyUrl = frontmatter.spotifyUrl ?? null
    base.duration = frontmatter.duration ?? null
  }

  if (sanityType === 'podcastReview') {
    base.showName = frontmatter.showName ?? frontmatter.title ?? slug
    base.episodeTitle = frontmatter.episodeTitle ?? null
    base.rating = frontmatter.rating ?? null
    base.verdict = frontmatter.verdict ?? 'Recommended'
    base.badge = frontmatter.badge ?? null
    // Override title for podcastReview (uses showName field)
    base.title = base.showName
  }

  return base
}

// ── Sanity API ──────────────────────────────────────────

async function sanityMutate(mutations) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ mutations })
    const options = {
      hostname: `${PROJECT_ID}.api.sanity.io`,
      path: `/v2021-06-07/data/mutate/${DATASET}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data))
        } else {
          reject(new Error(`Sanity API ${res.statusCode}: ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ── Main ────────────────────────────────────────────────

async function migrateCollection(collectionKey, { dir, sanityType }) {
  const contentDir = path.join(ROOT, 'src', 'content', dir)
  if (!fs.existsSync(contentDir)) {
    console.log(`  ⚠ Directory not found: ${contentDir} — skipping`)
    return { total: 0, imported: 0, failed: 0 }
  }

  const files = fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.mdoc'))

  let subset = files
  if (LIMIT > 0) subset = files.slice(0, LIMIT)

  const total = subset.length
  let imported = 0
  let failed = 0

  console.log(`\n📁 ${collectionKey} (${sanityType}): ${total} files`)

  for (let i = 0; i < subset.length; i += BATCH_SIZE) {
    const batch = subset.slice(i, i + BATCH_SIZE)
    const mutations = []

    for (const file of batch) {
      const slug = path.basename(file, '.mdoc')
      try {
        const raw = fs.readFileSync(path.join(contentDir, file), 'utf-8')
        const { frontmatter, body } = parseFrontmatter(raw)
        const doc = buildSanityDoc(slug, frontmatter, body, sanityType)
        mutations.push({ createOrReplace: doc })
      } catch (err) {
        console.error(`  ✗ Failed to parse ${file}:`, err.message)
        failed++
      }
    }

    if (mutations.length === 0) continue

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would import batch ${Math.floor(i / BATCH_SIZE) + 1}: ${mutations.length} docs`)
      imported += mutations.length
    } else {
      try {
        await sanityMutate(mutations)
        imported += mutations.length
        process.stdout.write(`  ✓ ${imported}/${total}\r`)
      } catch (err) {
        console.error(`\n  ✗ Batch failed:`, err.message)
        failed += mutations.length
      }
    }
  }

  console.log(`  ✅ Done: ${imported} imported, ${failed} failed`)
  return { total, imported, failed }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log(' Comic Book Clique → Sanity Migration')
  console.log(`   Project: ${PROJECT_ID}`)
  console.log(`   Dataset: ${DATASET}`)
  console.log(`   Mode:    ${DRY_RUN ? '🔍 DRY RUN (no writes)' : '🚀 LIVE'}`)
  if (LIMIT) console.log(`   Limit:   ${LIMIT} items per collection`)
  console.log('═══════════════════════════════════════════')

  if (!API_TOKEN && !DRY_RUN) {
    console.error('\n❌ Missing SANITY_API_TOKEN environment variable.')
    console.error('   Get a write token at: https://sanity.io/manage → API → Tokens')
    console.error('   Run with: SANITY_API_TOKEN=your-token node scripts/migrate-to-sanity.js')
    process.exit(1)
  }

  const totals = { total: 0, imported: 0, failed: 0 }

  const entries = Object.entries(COLLECTIONS)
  for (const [key, config] of entries) {
    if (TYPE_FILTER && key !== TYPE_FILTER) continue
    const result = await migrateCollection(key, config)
    totals.total += result.total
    totals.imported += result.imported
    totals.failed += result.failed
  }

  console.log('\n═══════════════════════════════════════════')
  console.log(` MIGRATION COMPLETE`)
  console.log(`   Total files: ${totals.total}`)
  console.log(`   Imported:    ${totals.imported}`)
  console.log(`   Failed:      ${totals.failed}`)
  console.log('═══════════════════════════════════════════')

  if (totals.failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
