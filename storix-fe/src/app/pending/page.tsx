// src/app/pending/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

type Provider = 'kakao' | 'naver'

export default function PendingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ 프로젝트 store에 맞게 쓰는 형태 (이름 다르면 여기만 수정)
  const { setAccessToken, setOnboardingToken } = useAuthStore() as any

  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state') // ✅ 네이버에서 옴
      const error = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')

      // 1) OAuth 에러 처리
      if (error) {
        setErrorMsg(
          `OAuth 에러: ${error}${errorDescription ? `\n${errorDescription}` : ''}`,
        )
        return
      }

      // 2) code 체크
      if (!code) {
        setErrorMsg('code가 없습니다. redirect_uri 설정/라우팅을 확인하세요.')
        return
      }

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL
        if (!apiBase) throw new Error('NEXT_PUBLIC_API_URL is not set')

        // 3) provider 판단: state 있으면 네이버로 간주
        const provider: Provider = state ? 'naver' : 'kakao'

        let url = ''
        if (provider === 'naver') {
          if (!state) throw new Error('Naver login but state is missing')

          url =
            `${apiBase}/api/v1/auth/oauth/naver/login` +
            `?code=${encodeURIComponent(code)}` +
            `&state=${encodeURIComponent(state)}`
        } else {
          // ✅ 카카오: code + redirectUri (백엔드가 redirectUri를 요구하는 스펙이었음)
          const redirectUri =
            process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
            'http://localhost:3000/pending'

          url =
            `${apiBase}/api/v1/auth/oauth/kakao/login` +
            `?code=${encodeURIComponent(code)}` +
            `&redirectUri=${encodeURIComponent(redirectUri)}`
        }

        console.log('[pending] provider:', provider)
        console.log('[pending] request:', url)

        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include', // refreshToken 쿠키 세팅 가능성 대비
          headers: { Accept: 'application/json' },
        })

        const text = await res.text()
        if (!res.ok) {
          throw new Error(`Login API failed: ${res.status} ${text}`)
        }

        const data = JSON.parse(text)
        console.log('[pending] response:', data)

        const result = data?.result
        if (!result || typeof result.isRegistered !== 'boolean') {
          throw new Error('Unexpected response: missing result.isRegistered')
        }

        // ✅ 가입된 유저 → accessToken 저장 후 profile로
        if (result.isRegistered) {
          const accessToken = result.readerLoginResponse?.accessToken
          if (!accessToken)
            throw new Error('Registered user but no accessToken')

          setAccessToken?.(accessToken)
          router.replace('/profile')
          return
        }

        // ✅ 미가입 유저 → onboardingToken 저장 후 agreement로
        const onboardingToken = result.readerPreLoginResponse?.onboardingToken
        if (!onboardingToken)
          throw new Error('Not registered but no onboardingToken')

        setOnboardingToken?.(onboardingToken)
        router.replace('/agreement')
        console.log('[pending] onboardingToken:', onboardingToken)
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
      <div className="w-full h-full flex flex-col items-center justify-center px-6 text-center">
        <p className="text-[16px] font-semibold text-gray-800 mb-3">
          로그인 실패
        </p>
        <pre className="text-[12px] text-gray-600 whitespace-pre-wrap break-words">
          {errorMsg}
        </pre>

        <button
          className="mt-6 underline text-gray-700 hover:opacity-70"
          onClick={() => router.replace('/login')}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Image
        src="/icons/logo.svg"
        alt="STORIX"
        width={64}
        height={64}
        className="mb-6"
        priority
      />

      <p className="text-[16px] font-medium text-gray-700">로그인 중입니다</p>

      <div className="flex gap-1 mt-4">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
      </div>
    </div>
  )
}
