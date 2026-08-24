import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Admins } from '@/collections/Admins'
import { Articles } from '@/collections/Articles'
import { Categories } from '@/collections/Categories'
import { Media } from '@/collections/Media'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Content Admin',
    },
    user: Admins.slug,
  },
  collections: [Admins, Categories, Media, Articles],
  cors: [serverURL],
  csrf: [serverURL],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor(),
  globals: [SiteSettings],
  plugins: [
    s3Storage({
      bucket: process.env.S3_BUCKET || '',
      collections: {
        media: true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
      },
      enabled: Boolean(process.env.S3_BUCKET),
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
