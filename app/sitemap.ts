import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'
import { castles } from '@/lib/castles'
import { siteConfig } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    { path: '', priority: 1 },
    { path: '/huepfburgen', priority: 0.9 },
    { path: '/preise-und-liefergebiet', priority: 0.8 },
    { path: '/faq', priority: 0.6 },
    { path: '/mietbedingungen', priority: 0.5 },
    { path: '/kontakt', priority: 0.5 },
    { path: '/impressum', priority: 0.2 },
    { path: '/datenschutz', priority: 0.2 },
  ]

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...castles.map((castle) => ({
      url: `${siteConfig.url}/huepfburgen/${castle.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
