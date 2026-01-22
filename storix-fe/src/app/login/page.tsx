// src/app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Splash } from '@/app/splash'
import { getKakaoAuthUrl } from '@/lib/api/auth/kakao.api'
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

  useEffect(() => {
    let mounted = true

    // ✅ (추가) /login 진입 시에도 refresh 1회 시도 → 자동로그인
    const tryRefresh = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL
        if (!baseURL) return

        const res = await axios.post(
          `${baseURL}/api/v1/auth/tokens/refresh`,
          {},
          {
            withCredentials: true,
            validateStatus: (status) => status >= 200 && status < 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )

        const newAccessToken = (res.data as any)?.result?.accessToken
        if (!mounted) return

        if (res.status >= 200 && res.status < 300 && newAccessToken) {
          setAccessToken(String(newAccessToken))
          router.replace('/home')
          return
        }
      } catch {
        // 실패하면 그냥 로그인 화면 유지
      }
    }

    tryRefresh()

    const timer = setTimeout(() => setShowSplash(false), 1500)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [router, setAccessToken])

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
      console.error('NEXT_PUBLIC_NAVER_CLIENT_ID is not set')
      alert('네이버 로그인 설정이 누락되었습니다. (CLIENT_ID)')
      return
    }
    if (!redirectUri) {
      console.error('NEXT_PUBLIC_NAVER_REDIRECT_URI is not set')
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
      <div className="absolute top-4 right-4">
        <button
          className="text-[16px] font-medium leading-[140%] transition-opacity hover:opacity-70 cursor-pointer"
          style={{ color: 'var(--color-gray-500)' }}
          onClick={() => router.push('/home/demo')}
        >
          둘러보기
        </button>
      </div>
      <div className="flex flex-col items-center mt-[326px]">
        <div className="mt-1">
          <Image
            src="/icons/logo-word.svg"
            alt="STORIX"
            width={120}
            height={40}
          />
        </div>

        {/* 독자 소셜 로그인 */}
        <div className="mt-16">
          <Image
            src="/login/login-kakao.svg"
            alt="카카오 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleKakaoLogin}
          />
        </div>

        <div className="mt-2">
          <Image
            src="/login/login-naver.svg"
            alt="네이버 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNaverLogin}
          />
        </div>

        {/* ✅ 작가 로그인 아이콘을 여기에 통합 */}
        <div className="mt-2">
          <Link href="/writers/signup">
            <Image
              src="/login/writer-login.svg"
              alt="작가 로그인"
              width={360}
              height={48}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
