'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Splash } from '@/app/splash'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // ✅ Gmail 웹 메일 작성 화면 열기
  const handleAuthorInquiry = () => {
    const to = encodeURIComponent('storixbiz@gmail.com')
    const subject = encodeURIComponent('STORIX 작가 문의')
    const body = encodeURIComponent(
      '안녕하세요,\nSTORIX 서비스 이용을 위한 작가 인증 캡처본 보내드립니다.',
    )

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`

    window.open(gmailUrl, '_blank')
  }

  if (showSplash) {
    return <Splash />
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* 둘러보기 버튼 */}
      <div className="absolute top-20 right-4">
        <button
          className="text-[16px] font-medium leading-[140%] transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-gray-500)' }}
          onClick={() => {
            // TODO: 추후 경로 설정
          }}
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

        <div className="mt-16">
          <Image
            src="/login/login-kakao.svg"
            alt="카카오 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        <div className="mt-2">
          <Image
            src="/login/login-naver.svg"
            alt="네이버 로그인"
            width={360}
            height={48}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          />
        </div>

        {/* ✅ 작가 문의 → Gmail 웹 메일 작성 */}
        <p
          className="caption-1 text-gray-500 text-center underline cursor-pointer mt-4 hover:opacity-70"
          onClick={handleAuthorInquiry}
        >
          작가님이신가요?
        </p>

        <p
          className="caption-1 text-gray-700 text-center underline cursor-pointer mt-2"
          onClick={() => router.push('/agreement')}
        >
          이용약관 보러가기 (ㅠㅠ이거는 API 연결하고나면 없앨버튼 ㅠㅠ)
        </p>
      </div>
    </div>
  )
}
