// src/app/common/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Splash } from '@/app/splash'
import { getKakaoAuthUrl } from '@/lib/api/auth/kakao.api'
import { developerLogin } from '@/lib/api/auth/developer-login.api'
import { useAuthStore } from '@/store/auth.store'

function generateNaverState() {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16)
    window.crypto.getRandomValues(bytes)
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

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

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleKakaoLogin = async () => {
    try {
      const authUrl = await getKakaoAuthUrl()
      window.location.href = authUrl
    } catch {
      alert('로그인 준비에 실패했습니다.')
    }
  }

  const handleNaverLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI

    if (!clientId) {
      //console.error('NEXT_PUBLIC_NAVER_CLIENT_ID is not set')
      alert('네이버 로그인 설정이 누락되었습니다. (CLIENT_ID)')
      return
    }
    if (!redirectUri) {
      //console.error('NEXT_PUBLIC_NAVER_REDIRECT_URI is not set')
      alert('네이버 로그인 설정이 누락되었습니다. (REDIRECT_URI)')
      return
    }

    const state = generateNaverState()

    const authUrl =
      `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code` +
      `&client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&state=${encodeURIComponent(state)}`

    window.location.href = authUrl
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
      <div className="flex flex-col items-center mt-[326px]">
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
          <Image
            src="/common/login/login-kakao.svg"
            alt="카카오 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleKakaoLogin}
          />
        </div>

        <div className="mt-2">
          <Image
            src="/common/login/login-naver.svg"
            alt="네이버 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNaverLogin}
          />
        </div>

        <div className="mt-2">
          <Image
            src="/common/login/login-apple.svg"
            alt="Apple로 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            // onClick={handleAppleLogin}
          />
        </div>

        {/* 개발자 로그인 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2">
            <button
              onClick={handleDeveloperLogin}
              className="w-[360px] h-[48px] text-sm text-gray-400 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              개발자 로그인
            </button>
          </div>
        )}

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
      </div>
    </div>
  )
}
