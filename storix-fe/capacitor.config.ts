import type { CapacitorConfig } from '@capacitor/cli'

// CAPACITOR_BUILD=true → 정적 번들(out/)을 앱에 포함 (TestFlight/프로덕션 빌드).
// 아니면 dev 서버를 바라봄 (LAN IP + HMR).
const isCapacitorBuild = process.env.CAPACITOR_BUILD === 'true'

const devServer: CapacitorConfig['server'] = {
  url: process.env.CAPACITOR_DEV_URL ?? 'http://localhost:3000',
  cleartext: true,
  allowNavigation: [
    'kauth.kakao.com',
    'accounts.kakao.com',
    'nid.naver.com',
    'appleid.apple.com',
    'api.storix.kr',
  ],
}

const config: CapacitorConfig = {
  appId: 'kr.storix.app',
  appName: 'Storix',
  webDir: isCapacitorBuild ? 'out' : '.next',
  ...(isCapacitorBuild ? {} : { server: devServer }),
  ios: {
    contentInset: 'always',
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
