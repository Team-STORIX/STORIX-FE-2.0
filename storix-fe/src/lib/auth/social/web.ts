// src/lib/auth/social/web.ts
//
// 웹(브라우저) 환경에서의 Kakao/Naver 소셜 로그인 구현.
// SDK를 쓰지 않고, 카카오/네이버 인가 URL을 조립해서 리다이렉트시키는 방식을 유지한다.
// 이후 /pending 페이지에서 code(+state)를 받아 기존 웹 엔드포인트로 교환한다.

import type { WebSocialAuthProvider } from './types'

const generateNaverState = (): string => {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const webSocialAuthProvider: WebSocialAuthProvider = {
  getKakaoAuthUrl: (): string => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI
    if (!clientId || !redirectUri) {
      throw new Error(
        'Kakao OAuth env (NEXT_PUBLIC_KAKAO_CLIENT_ID/REDIRECT_URI) is missing',
      )
    }
    return (
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&prompt=select_account`
    )
  },

  getNaverAuthUrl: (): string => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI
    if (!clientId || !redirectUri) {
      throw new Error(
        'Naver OAuth env (NEXT_PUBLIC_NAVER_CLIENT_ID/REDIRECT_URI) is missing',
      )
    }
    const state = generateNaverState()
    return (
      `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code` +
      `&client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}`
    )
  },
}
