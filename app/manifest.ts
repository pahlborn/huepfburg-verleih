import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { withBasePath } from '@/lib/base-path'

export const dynamic = 'force-static'

/** Web-App-Manifest: Name und Icon, wenn die Seite auf den Home-Bildschirm gelegt wird (Android, Chrome). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.homeScreenName,
    description: siteConfig.description,
    start_url: withBasePath('/'),
    scope: withBasePath('/'),
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d5fc4',
    lang: 'de',
    icons: [
      { src: withBasePath('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: withBasePath('/icon-512.png'), sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: withBasePath('/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
