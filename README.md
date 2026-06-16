# Comic Book Clique

An elite digital publication platform built for editorial deep-dives, breaking news, podcast hosting, and premium comic/media reviews.

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **CMS:** Sanity (Headless CMS)
- **Styling:** Tailwind CSS + custom mobile-first overrides
- **Motion & Interactions:** GSAP + Lenis Smooth Scroll
- **Media Storage:** Cloudflare R2
- **Deployment:** Vercel

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sheldongunby-dev/ComicBookCliqueDev.git
   cd ComicBookCliqueDev
   ```

2. **Install dependencies**
   This project uses `pnpm` for strict dependency management.
   ```bash
   pnpm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory. You will need:
   - Sanity Project ID and Dataset
   - Sanity API Write Token
   - Cloudflare R2 credentials (for image uploads)
   - Podbean API credentials (for the GitHub Action sync)
   
   *(See your team lead or Vercel dashboard for exact values).*

4. **Run the Development Server**
   ```bash
   pnpm run dev
   ```
   - The main site will be available at `http://localhost:3000`
   - The Sanity Studio CMS will be available at `http://localhost:3000/studio`

## File Architecture
- `/src/app` - Next.js App Router (pages and API routes)
- `/src/components` - Reusable UI elements, editorial blocks, and layout wrappers
- `/src/lib` - Content fetching (`content.ts`), schema definitions, and utilities
- `/src/sanity` - Sanity Studio configurations, schemas (`/schemaTypes`), and client setup
- `/.github/workflows` - Automated actions (e.g., Podbean podcast sync)

## Deployment
This project is configured for seamless deployment on Vercel. Pushing to the `main` branch automatically triggers a production build. Next.js ISR (Incremental Static Regeneration) ensures content updates from Sanity reflect on the live site automatically.
