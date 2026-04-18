import path from 'node:path'
import type { NextConfig } from 'next'

// CAPACITOR_BUILD=true 일 때만 static export (iOS/Android 번들용).
// 일반 웹 배포/dev에서는 기존 동작 그대로.
const isCapacitor = process.env.CAPACITOR_BUILD === 'true'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  allowedDevOrigins: ['*'],
  ...(isCapacitor
    ? {
        output: 'export' as const,
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            {
              source: '/common/icons/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/profile/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/common/navbar/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/common/platform/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/common/pwa/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
          ]
        },
      }),

  images: {
    unoptimized: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3rtpnzvkc675z.cloudfront.net',
        pathname: '/**',
      },
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

export default nextConfig
