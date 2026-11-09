# Technical Content Platform

Production content platform built with Next.js and Payload CMS, PostgreSQL, optional S3-compatible object storage, Resend contact delivery, and a single-administrator editorial workflow.

## Included foundation

- Payload collections for articles, categories, images, and one administrator
- Drafts, autosave, article revisions, stable slugs, publication dates, and calculated reading time
- Rich-text, code, and article-image content blocks
- Per-article and site-wide SEO metadata fields, canonical URLs, social previews, and structured data
- Dynamic `sitemap.xml` and environment-safe `robots.txt` generated from published content
- Public access limited to published articles; all content changes require authentication
- Optional S3-compatible storage configuration for Cloudflare R2 or another provider
- Six article categories as repeatable seed data, including ARIS Connect Customization
- Public indexing disabled until the production domain and public identity are ready

## Local configuration

Copy `.env.example` to `.env.local` and provide at minimum:

```dotenv
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYLOAD_SECRET=use-a-long-random-secret
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

R2/S3 variables can remain empty during local development. Contact delivery uses Resend and requires `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`, and `CONTACT_FROM_EMAIL`. The sender must belong to a verified Resend domain; multiple recipients can be comma-separated. Without complete configuration, the form returns a clear unavailable response without attempting delivery.

For production, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Search indexing is enabled only when the Site Settings toggle is on, the app is running in production, and this value uses a non-local hostname. Configure the site title, default description, publisher, author, and social image under **Site Settings** in Payload.

## Commands

```bash
npm install
npm run generate:types
npm run generate:importmap
npm run dev
```

Once PostgreSQL is connected, import the six articles from `main` and any missing categories:

```bash
npm run seed:articles
```

This converts the source HTML into editable Payload Lexical content, imports code blocks (including CSS), and uploads a PNG version of the report diagram into the media library. Existing articles, drafts and categories are preserved by slug, so repeating the import does not overwrite editorial changes. The original sources remain in `src/data/articles.json` and `src/data/knowledgeBaseArticles.json`.

The external report article also includes an editable **API walkthrough** block with three illustrative request/response steps. Fresh imports include it automatically. To add it to an already imported article while preserving its text and publication status, run `npm run content:report-walkthrough`. This command is safe to repeat and replaces endpoint values with private placeholders in existing walkthroughs. The sample contract is defined in `src/data/reportApiFlow.ts`; endpoint paths are omitted from the UI, copied examples, public CMS responses, client props and search results.

To initialize or refresh just the category definitions:

```bash
npm run seed:categories
```

The first account created at `/admin` becomes the only administrator. Further administrator creation and administrator deletion are denied by the access rules.

## Verification

```bash
npm run typecheck
npm run lint
npm run test:search
npm run build
```

Homepage search matches words across titles, summaries, categories, article text and code. It supports reordered terms, conservative spelling corrections, singular/plural forms, and a curated English/Croatian ARIS topic vocabulary. Exact title matches are boosted; incomplete and related matches are labelled. Unsupported queries can still return no results. Endpoint fields and unpublished articles are excluded. Extend the topic vocabulary in `src/utilities/articleSearch.ts` as the library grows; no external search service is required.

## Current migration status

- Content is stored in PostgreSQL. Each environment has its own database and administrator; create the first account at `/admin` when setting up a fresh local database.
- Repeatable imports are available for all six categories and the six new articles from `main`.
- Payload-backed article pages render rich text, images, syntax-highlighted code, canonical metadata, Open Graph and Twitter metadata, and `TechArticle` structured data.
- The native Next.js article library lists and filters published Payload content by category and search term.
- The native Next.js homepage renders Payload-backed featured and recent articles, live article search, and the public site design.
- Shared responsive navigation and footer components are used across the homepage, article library, and article detail pages.
- Services and contact pages are native Next.js routes, with validated server-side Resend delivery for contact inquiries.
- The former Vite application and browser-local article administration have been removed.
- The external report integration guide is featured on the homepage and in the library. Legacy `/articles/category/slug/` links redirect to the canonical Payload article URLs.

## Netlify deployment

This application uses server-rendered Next.js routes and Payload; publishing the raw `.next` directory as static files is insufficient. The tracked `netlify.toml` selects `npm run build`, the `.next` publish directory, Node.js 24, and the Next.js runtime adapter that generates the server function and routing.

Connect the GitHub repository in Netlify and select `next-payload-migration` as the branch to deploy. Use the repository root as the base directory. If importing an archive, import the full source project and run the Netlify build pipeline, including the configured plugin; a static drag-and-drop upload cannot build the required server runtime. Remove any old SPA catch-all redirect to `/index.html` and ensure `NETLIFY_NEXT_PLUGIN_SKIP` is not enabled.

Set these environment variables in Netlify for both builds and functions before redeploying:

- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SERVER_URL`: the public HTTPS site origin
- `PAYLOAD_SECRET`: a stable secret for this environment
- `DATABASE_URL`: a PostgreSQL database reachable from Netlify, with the Payload schema initialized

The local `.env.local`, local PostgreSQL data and uploaded `media/` directory are not included in a GitHub ZIP. Use S3-compatible storage for persistent hosted uploads; configure the variables listed in `.env.example`. Apply Payload schema migrations and import the articles into the chosen hosted database separately; the build does not transfer local content.

A successful deploy log should include `@netlify/plugin-nextjs` and function packaging, not only `next build`. Verify `/`, `/articles`, and `/api/article-search?q=excel` after deploying. A green build with a generic Netlify 404 indicates that the expected files or runtime routing are not being served. A runtime/database error after routing works requires checking function logs and the hosted environment settings.

## Next milestone

Configure Resend and S3-compatible media storage, set the final production URL and Site Settings values, and run the deployment readiness review.
