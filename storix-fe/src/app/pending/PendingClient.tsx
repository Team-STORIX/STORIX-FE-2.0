// src/app/pending/PendingClient.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import { getMyProfile } from '@/lib/api/profile/profile.api'

type Provider = 'kakao' | 'naver'

export default function PendingClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setAccessToken = useAuthStore((s) => s.setAccessToken)
  const setOnboardingToken = useAuthStore((s) => s.setOnboardingToken)

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      if (error) {
        setErrorMsg(
          `OAuth 에러: ${error}${
            errorDescription ? `\n${errorDescription}` : ''
          }`,
        )
        return
      }

      if (!code) {
        setErrorMsg('code가 없습니다. redirect_uri 설정/라우팅을 확인하세요.')
        return
      }

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL
        if (!apiBase) throw new Error('NEXT_PUBLIC_API_URL is not set')

        const provider: Provider = state ? 'naver' : 'kakao'

        let url = ''
        if (provider === 'naver') {
          if (!state) throw new Error('Naver login but state is missing')

          url =
            `${apiBase}/api/v1/auth/oauth/naver/login` +
            `?code=${encodeURIComponent(code)}` +
            `&state=${encodeURIComponent(state)}`
        } else {
          const redirectUri =
            process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
            'http://localhost:3000/pending'

          url =
            `${apiBase}/api/v1/auth/oauth/kakao/login` +
            `?code=${encodeURIComponent(code)}` +
            `&redirectUri=${encodeURIComponent(redirectUri)}`
        }

        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })

        const text = await res.text()
        if (!res.ok) throw new Error(`Login API failed: ${res.status} ${text}`)

        const data = JSON.parse(text)
        const result = data?.result
        if (!result || typeof result.isRegistered !== 'boolean') {
          throw new Error('Unexpected response: missing result.isRegistered')
        }

        if (result.isRegistered) {
          const accessToken = result.readerLoginResponse?.accessToken
          if (!accessToken)
            throw new Error('Registered user but no accessToken')

          // 1) 토큰 저장
          setAccessToken(accessToken)

          // 2) 프로필 조회 후 전역 저장
          const meRes = await getMyProfile()
          if (!meRes?.isSuccess) {
            throw new Error(meRes?.message || 'Failed to load profile')
          }
          useProfileStore.getState().setMe(meRes.result)

          // 3) 홈 이동
          router.replace('/home')
          return
        }

        const onboardingToken = result.readerPreLoginResponse?.onboardingToken
        if (!onboardingToken) {
          throw new Error('Not registered but no onboardingToken')
        }

        setOnboardingToken(onboardingToken)
        router.replace('/agreement')
      } catch (e: any) {
        console.error('[pending] flow error:', e)
        setErrorMsg(e?.message ?? String(e))
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (errorMsg) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-[16px] font-semibold text-gray-800">
          로그인 실패
        </p>
        <pre className="whitespace-pre-wrap break-words text-[12px] text-gray-600">
          {errorMsg}
        </pre>

        <button
          className="mt-6 text-gray-700 underline hover:opacity-70"
          onClick={() => router.replace('/login')}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Image
        src="/icons/logo.svg"
        alt="STORIX"
        width={64}
        height={64}
        className="mb-6"
        priority
      />

      <p className="text-[16px] font-medium text-gray-700">로그인 중입니다</p>

      <div className="mt-4 flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
      </div>
    </div>
  )
}
