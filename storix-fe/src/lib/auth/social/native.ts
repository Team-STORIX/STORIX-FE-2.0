// src/lib/auth/social/native.ts
//
// 네이티브(Capacitor) 환경에서의 Kakao/Naver 소셜 로그인 구현.
// RN 전환 시 이 파일만 교체하면 되도록 외부에서는 `nativeSocialAuthProvider` 객체만 쓰인다.
//
// 플러그인:
// - Kakao: capacitor-kakao-login-plugin      (iOS AppDelegate 에서 KakaoSDK.initSDK 호출)
// - Naver: @team-lepisode/capacitor-naver-login  (capacitor.config.ts 에서 설정)

import { KakaoLoginPlugin } from 'capacitor-kakao-login-plugin'
import { CapacitorNaverLogin } from '@team-lepisode/capacitor-naver-login'
import type {
  KakaoNativeTokens,
  NativeSocialAuthProvider,
  NaverNativeTokens,
} from './types'

export const nativeSocialAuthProvider: NativeSocialAuthProvider = {
  loginWithKakao: async (): Promise<KakaoNativeTokens> => {
    const res = await KakaoLoginPlugin.goLogin()
    // idToken 은 카카오 개발자 콘솔의 "OpenID Connect 활성화" 가 켜져 있을 때만 내려온다.
    if (!res.accessToken || !res.idToken) {
      throw new Error(
        'Kakao SDK 응답에 accessToken 또는 idToken 이 없습니다. 카카오 콘솔의 "OpenID Connect 활성화" 를 켜주세요.',
      )
    }
    return { accessToken: res.accessToken, idToken: res.idToken }
  },

  loginWithNaver: async (): Promise<NaverNativeTokens> => {
    const res = await CapacitorNaverLogin.login()
    if (!res.accessToken) {
      throw new Error('Naver SDK 응답에 accessToken 이 없습니다.')
    }
    return { accessToken: res.accessToken }
  },

  logoutKakao: async () => {
    try {
      await KakaoLoginPlugin.goLogout()
    } catch {
      // 로그아웃 실패는 흡수 — 로컬 토큰은 별도 정리
    }
  },

  logoutNaver: async () => {
    try {
      await CapacitorNaverLogin.logout()
    } catch {
      // 동일
    }
  },
}
