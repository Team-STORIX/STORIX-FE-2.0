// src/app/writers/login/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
import { Splash } from '@/app/splash'
import { getKakaoAuthUrl } from '@/api/auth/kakao.api'
import { artistLoginUser } from '@/api/auth/artist-login.api'
import { useAuthStore } from '@/store/auth.store'
import Final from './components/final'

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

type Step = 'login' | 'final'

export default function LoginPage() {
  const router = useRouter()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  const [showSplash, setShowSplash] = useState(true)
  const [step, setStep] = useState<Step>('login')

  // ✅ 작가 일반 로그인 폼
  const [showArtistForm, setShowArtistForm] = useState(false)
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return loginId.trim().length > 0 && password.trim().length > 0
  }, [loginId, password])

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  // ✅ 카카오 로그인(독자 소셜 로그인 그대로)
  const handleKakaoLogin = async () => {
    try {
      const authUrl = await getKakaoAuthUrl()
      window.location.href = authUrl
    } catch {
      alert('로그인 준비에 실패했습니다.')
    }
  }

  // ✅ 네이버 로그인(독자 소셜 로그인 그대로)
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

  // ✅ 작가 일반 로그인: POST /api/v1/auth/users/artist/login
  const handleArtistLogin = async () => {
    if (isSubmitting) return
    if (!canSubmit) return

    try {
      setIsSubmitting(true)

      const res = await artistLoginUser({
        loginId: loginId.trim(),
        password: password.trim(),
      })

      const token = res?.result?.accessToken
      if (!res?.isSuccess || !token) {
        alert(res?.message || '로그인에 실패했습니다.')
        return
      }

      // ✅ accessToken 저장
      setAccessToken(token)

      // ✅ Final 화면으로 전환 (Final 내부에서 /writers/feed로 이동 처리)
      setStep('final')
    } catch (e) {
      console.error('[artist-login] error:', e)
      alert('로그인 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSplash) return <Splash />

  // ✅ 작가 일반 로그인 성공 이후 Final 컴포넌트
  if (step === 'final') {
    return <Final />
  }

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
        <Image src="/icons/logo.svg" alt="Logo" width={79} height={79} />

        <div className="mt-1">
          <Image
            src="/icons/logo-word.svg"
            alt="STORIX"
            width={120}
            height={40}
          />
        </div>

        {/* ✅ 독자 소셜 로그인(동일 동작) */}
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
