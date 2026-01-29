// next.config.ts
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout?.trim() ?? crypto.randomUUID()

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
  additionalPrecacheEntries: [{ url: '/offline', revision }],
})

const nextConfig: NextConfig = {
  images: {
    // dev에서는 S3 upstream timeout 때문에 next/image 최적화 끄기
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'page-images.kakaoentcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shared-comic.pstatic.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'comicthumb-phinf.pstatic.net',
        pathname: '/**',
      },

      { protocol: 'https', hostname: 'img.ridicdn.net', pathname: '/**' },

      {
        protocol: 'https',
        hostname: 'image-comic.pstatic.net',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname:
          'storix-ceos22-begsfeyc07-ds74eslk.s3.ap-southeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
}

export default withSerwist(nextConfig)
