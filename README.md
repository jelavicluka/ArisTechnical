# Technical Content Platform

Migration foundation for the website's production content platform. It combines Next.js and Payload CMS with PostgreSQL, optional S3-compatible object storage, and a single-administrator editorial workflow.

The existing Vite implementation remains preserved in this migration branch while pages are moved incrementally.

## Included foundation

- Payload collections for articles, categories, images, and one administrator
- Drafts, autosave, article revisions, stable slugs, publication dates, and calculated reading time
- Rich-text, code, and article-image content blocks
- Per-article and site-wide SEO metadata fields
- Public access limited to published articles; all content changes require authentication
- Optional S3-compatible storage configuration for Cloudflare R2 or another provider
- Five agreed article categories as repeatable seed data
- Public indexing disabled on the temporary migration shell until the real pages and public identity are ready

## Local configuration

Copy `.env.example` to `.env.local` and provide at minimum:

```dotenv
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PAYLOAD_SECRET=use-a-long-random-secret
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

R2/S3 and Resend variables can remain empty until their milestones.

## Commands

```bash
npm install
npm run generate:types
npm run generate:importmap
npm run dev
```

Once PostgreSQL is connected, initialize the five article categories with:

```bash
npm run seed:categories
```

The first account created at `/admin` becomes the only administrator. Further administrator creation and administrator deletion are denied by the access rules.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Next milestone

Provision a managed PostgreSQL database, add its connection string locally, start the application, create the administrator account, and run the category seed. After that, migrate one article end-to-end and render its stable `/articles/article-slug/` page with canonical metadata and structured data.
