/** @type {import('next').NextConfig} */
// GITHUB_PAGES=1 baut eine statische Version für https://pahlborn.github.io/huepfburg-verleih/
const isPages = process.env.GITHUB_PAGES === '1'
const basePath = isPages ? '/huepfburg-verleih' : ''

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_NOINDEX: isPages ? '1' : '',
  },
  ...(isPages ? { output: 'export', basePath, trailingSlash: true } : {}),
}

export default nextConfig
