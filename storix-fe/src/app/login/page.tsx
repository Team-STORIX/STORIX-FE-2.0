// src/app/common/login/page.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Splash } from '@/app/splash'
import { developerLogin } from '@/lib/api/auth/developer-login.api'
import { useAuthStore } from '@/store/auth.store'
import {
  isNativePlatform,
  webSocialAuthProvider,
} from '@/lib/auth/social'
import { useNativeSocialLogin } from '@/hooks/auth/useNativeSocialLogin'

export default function LoginPage() {
  const [showSplash] = useState(false)
  const router = useRouter()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const nativeSocialLogin = useNativeSocialLogin()

  const handleDeveloperLogin = async () => {
    const pendingId = window.prompt('pendingId를 입력하세요')
    if (!pendingId) return
    try {
      const data = await developerLogin(pendingId)
      setAccessToken(data.result.accessToken)
      router.push('/home')
    } catch {
      alert('개발자 로그인에 실패했습니다.')
    }
  }

  // iOS/Android 네이티브 → SDK + BE native 엔드포인트
  // 그 외(웹)            → 기존 리다이렉트 플로우 → /pending 에서 code 교환
  const handleKakaoLogin = async () => {
    if (isNativePlatform()) {
      nativeSocialLogin.mutate('kakao')
      return
    }
    try {
      const authUrl = webSocialAuthProvider.getKakaoAuthUrl()
      window.location.href = authUrl
    } catch {
      alert('로그인 준비에 실패했습니다.')
    }
  }

  const handleNaverLogin = () => {
    if (isNativePlatform()) {
      nativeSocialLogin.mutate('naver')
      return
    }
    try {
      const authUrl = webSocialAuthProvider.getNaverAuthUrl()
      window.location.href = authUrl
    } catch {
      alert('네이버 로그인 설정이 누락되었습니다.')
    }
  }

  const handleAppleLogin = async () => {
    try {
      const { SignInWithApple } =
        await import('@capacitor-community/apple-sign-in')
      const result = await SignInWithApple.authorize({
        clientId: 'kr.storix.app',
        redirectURI: 'https://api.storix.kr',
        scopes: 'email name',
        state: '',
        nonce: '',
      })
      const code =
        result?.response?.authorizationCode || result?.response?.identityToken
      if (!code) throw new Error('Apple code가 없습니다.')

      router.replace(`/pending?provider=apple&code=${encodeURIComponent(code)}`)
    } catch {
      alert('Apple 로그인에 실패했습니다.')
    }
  }

  if (showSplash) return <Splash />

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* 둘러보기 버튼 */}
      <div className="absolute top-20 right-4">
        <button
          className="text-[16px] font-medium leading-[140%] transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-gray-500)' }}
          onClick={() => router.push('/home/demo')}
        >
          둘러보기
        </button>
      </div>

      {/* 온보딩 바로가기 (임시) */}
      <div className="absolute top-20 left-4">
        <button
          className="text-[12px] font-medium leading-[140%] transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-gray-400)' }}
          onClick={() => router.push('/agreement')}
        >
          온보딩
        </button>
      </div>
      <div className="flex flex-col items-center mt-65.5">
        <div className="mt-1">
          <Image
            src="/common/icons/logo-word.svg"
            alt="STORIX"
            width={120}
            height={40}
          />
        </div>

        {/* 독자 소셜 로그인 */}
        <div className="mt-16">
          <button
            type="button"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleKakaoLogin}
          >
            <Image
              src="/common/login/login-kakao.svg"
              alt="카카오 로그인"
              width={360}
              height={48}
            />
          </button>
        </div>

        <div className="mt-2">
          <button
            type="button"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNaverLogin}
          >
            <Image
              src="/common/login/login-naver.svg"
              alt="네이버 로그인"
              width={360}
              height={48}
            />
          </button>
        </div>

        {/*   작가 로그인 아이콘을 여기에 통합 */}
        <div className="mt-2">
          <Image
            src="/common/login/login-twitter.svg"
            alt="트위터 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            // onClick={handletwitterLogin}
          />
        </div>

        <div className="mt-2">
          <button
            type="button"
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleAppleLogin}
          >
            <Image
              src="/common/login/login-apple.svg"
              alt="Apple 로그인"
              width={360}
              height={48}
            />
          </button>
        </div>
        {/* 개발자 로그인 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2">
            <button
              onClick={handleDeveloperLogin}
              className="w-[360px] h-[48px] text-sm text-white border border-gray-300 bg-[var(--color-magenta-300)] rounded"
            >
              개발자 로그인
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
