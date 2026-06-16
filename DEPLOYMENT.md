# Deployment & Infrastructure Guide

This document outlines the deployment architecture for Comic Book Clique.

## Hosting Platform: Vercel
The application is deployed on Vercel, which provides native support for Next.js App Router, edge caching, and Incremental Static Regeneration (ISR).

### Continuous Integration / Continuous Deployment (CI/CD)
- **Trigger:** Any push to the `main` branch on GitHub automatically triggers a production build.
- **Build Command:** `next build` (configured automatically by Vercel).
- **Install Command:** Vercel automatically detects `pnpm` via the `pnpm-lock.yaml` file.

## Environment Variables
The following environment variables must be configured in the Vercel Project Settings under **Environment Variables**:

### Sanity CMS
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - The Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` - The dataset name (e.g., `production`).
- `SANITY_API_WRITE_TOKEN` - A Sanity token with editor/write privileges (used by the GitHub Action for the podcast sync).

### Cloudflare R2 (Image Uploads)
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`

### Podcast Sync Automation
- `PODBEAN_CLIENT_ID`
- `PODBEAN_CLIENT_SECRET`
- `SYNC_SECRET` - A secure random string used to protect the `/api/sync/podbean` route from unauthorized hits.

## Custom Domain & DNS
Currently, the site is deployed to a Vercel-generated domain (`comic-book-clique.vercel.app`).

### Domain Migration Steps (Squarespace to Vercel):
1. Log into the Vercel dashboard.
2. Navigate to **Settings > Domains**.
3. Add `comicbookclique.com` and `www.comicbookclique.com`.
4. Vercel will provide A Records and CNAME records.
5. Log into the domain registrar (Squarespace/Google Domains) and update the DNS records to match Vercel's provided values.
6. Once DNS propagation is complete, Vercel will automatically provision SSL certificates via Let's Encrypt.

## GitHub Actions
The repository contains one active GitHub Action workflow:
- `.github/workflows/podbean-sync.yml`

This workflow runs on a cron schedule (`30 * * * *` - every hour at the 30-minute mark).
It makes a secure `curl` request to the Vercel API endpoint (`/api/sync/podbean`), passing the `SYNC_SECRET` from the GitHub Repository Secrets to trigger the podbean-to-Sanity data pipeline.

**Note:** The GitHub repository requires the `SYNC_SECRET` variable to be added under **Settings > Secrets and variables > Actions**.
