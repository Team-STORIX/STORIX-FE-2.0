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

  // ✅ Gmail 앱 우선(모바일) → Gmail 웹 → mailto fallback
  const handleAuthorInquiry = () => {
    const toRaw = 'storixbiz@gmail.com'
    const subjectRaw = 'STORIX 작가 문의'
    const bodyRaw =
      '안녕하세요,\nSTORIX 서비스 이용을 위한 작가 인증 캡처본 보내드립니다.'

    const to = encodeURIComponent(toRaw)
    const subject = encodeURIComponent(subjectRaw)
    const body = encodeURIComponent(bodyRaw)

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
    const mailtoUrl = `mailto:${toRaw}?subject=${subject}&body=${body}`

    const ua = navigator.userAgent || ''
    const isIOS = /iPhone|iPad|iPod/i.test(ua)
    const isAndroid = /Android/i.test(ua)

    // iOS: Gmail 앱 딥링크 시도 → 실패 시 Gmail 웹
    if (isIOS) {
      const gmailAppUrl = `googlegmail:///co?to=${to}&subject=${subject}&body=${body}`
      window.location.href = gmailAppUrl

      setTimeout(() => {
        window.location.href = gmailWebUrl
      }, 700)

      return
    }

    // Android: intent로 Gmail 앱 시도 → 실패 시 Gmail 웹
    if (isAndroid) {
      const gmailIntentUrl = `intent://co?to=${to}&subject=${subject}&body=${body}#Intent;scheme=googlegmail;package=com.google.android.gm;end`
      window.location.href = gmailIntentUrl

      setTimeout(() => {
        window.location.href = gmailWebUrl
      }, 700)

      return
    }

    // Desktop: Gmail 웹 새 탭 시도 (팝업 차단이면 현재 탭으로 이동)
    const opened = window.open(gmailWebUrl, '_blank')
    if (!opened) {
      window.location.href = gmailWebUrl
    }

    // (선택) 그래도 안 되면 mailto를 쓰고 싶다면 아래를 켜도 됨
    // setTimeout(() => {
    //   window.location.href = mailtoUrl
    // }, 1200)
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

        {/* ✅ 작가 문의 */}
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
