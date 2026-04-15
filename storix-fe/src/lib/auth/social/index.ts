// src/lib/auth/social/index.ts
//
// 플랫폼 감지 후 적절한 Provider 를 노출한다.
// - 네이티브(iOS/Android, Capacitor): nativeSocialAuthProvider 로 SDK 호출 → BE native 엔드포인트
// - 웹: webSocialAuthProvider 로 인가 URL 리다이렉트 → BE web 엔드포인트

export { isNativePlatform, getPlatform } from './platform'
export { webSocialAuthProvider } from './web'
export { nativeSocialAuthProvider } from './native'
export type {
  SocialProviderId,
  KakaoNativeTokens,
  NaverNativeTokens,
  NativeSocialAuthProvider,
  WebSocialAuthProvider,
} from './types'
