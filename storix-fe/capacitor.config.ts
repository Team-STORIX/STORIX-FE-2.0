import type { CapacitorConfig } from '@capacitor/cli'
import { config as loadEnv } from 'dotenv'
import path from 'path'

// .env.local → .env 순서로 로드 (Next.js 와 동일한 우선순위).
// cap sync 는 Next.js 프로세스가 아니라서 자동 로드되지 않음 → 여기서 명시적으로 로드.
loadEnv({ path: path.resolve(__dirname, '.env.local') })
loadEnv({ path: path.resolve(__dirname, '.env') })

// CAPACITOR_BUILD=true → 정적 번들(out/)을 앱에 포함 (TestFlight/프로덕션 빌드).
// 아니면 dev 서버를 바라봄 (LAN IP + HMR).
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true'

const sharedServer: NonNullable<CapacitorConfig['server']> = {
  hostname: 'localhost',
  iosScheme: 'https',
  androidScheme: 'https',
  allowNavigation: [
    'kauth.kakao.com',
    'accounts.kakao.com',
    'nid.naver.com',
    'appleid.apple.com',
    'api.storix.kr',
  ],
}

const devServer: NonNullable<CapacitorConfig['server']> = {
  ...sharedServer,
  url: process.env.CAPACITOR_DEV_URL ?? 'http://localhost:3000',
  cleartext: true,
}

const config: CapacitorConfig = {
  appId: 'kr.storix.app',
  appName: 'Storix',
  webDir: isCapacitorBuild ? 'out' : '.next',
  server: isCapacitorBuild ? sharedServer : devServer,
  ios: {
    contentInset: 'always',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    // 네이버 네이티브 로그인 SDK 설정 — 값이 비어 있으면 .env.local 을 먼저 채우세요.
    // NEXT_PUBLIC_NAVER_CLIENT_ID / NEXT_PUBLIC_NAVER_CLIENT_SECRET /
    // NEXT_PUBLIC_NAVER_APP_NAME / NEXT_PUBLIC_NAVER_URL_SCHEME
    CapacitorNaverLogin: {
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET ?? '',
      clientName: process.env.NEXT_PUBLIC_NAVER_APP_NAME ?? 'Storix',
      urlScheme:
        process.env.NEXT_PUBLIC_NAVER_URL_SCHEME ?? 'storixnaverlogin',
    },
  },
}

export default config
