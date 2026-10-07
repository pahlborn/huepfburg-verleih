import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import { siteConfig } from '@/lib/site-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/buchung/'] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
