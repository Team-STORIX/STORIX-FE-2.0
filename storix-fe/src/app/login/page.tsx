// src/app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // 추가
import { Splash } from '@/app/splash'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter() // 추가

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <Splash />
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
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

        <div className="mt-16">
          <Image
            src="/login/login-kakao.svg"
            alt="카카오 로그인"
            width={220}
            height={60}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="mt-2">
          <Image
            src="/login/login-naver.svg"
            alt="네이버 로그인"
            width={220}
            height={60}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        <p className="caption-1 text-gray-500 text-center underline cursor-pointer mt-4">
          로그인없이 둘러보기
        </p>
        <p className="caption-1 text-gray-500 text-center underline cursor-pointer mt-2">
          작가님이신가요?
        </p>
        <p
          className="caption-1 text-gray-700 text-center underline cursor-pointer mt-2"
          onClick={() => router.push('/onboarding')}
        >
          온보딩 보러가기 (ㅠㅠ이거는 API 연결하고나면 없앨버튼 ㅠㅠ)
        </p>
      </div>
    </div>
  )
}
