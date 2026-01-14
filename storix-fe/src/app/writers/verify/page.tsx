// src/app/writers/verify/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WritersVerifyPage() {
  const router = useRouter()

  // ✅ guide 이미지 1~3
  const images = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => `/manual/verify-guide-${i + 1}.png`),
    [],
  )

  const [index, setIndex] = useState(0)

  // ✅ 작가 문의: Gmail 앱 우선(모바일) → Gmail 웹
  const handleAuthorInquiry = () => {
    const toRaw = 'storixbiz@gmail.com'
    const subjectRaw = 'STORIX 작가 문의'
    const bodyRaw =
      '안녕하세요,\nSTORIX 서비스 이용을 위한 작가 인증 캡처본 보내드립니다.'

    const to = encodeURIComponent(toRaw)
    const subject = encodeURIComponent(subjectRaw)
    const body = encodeURIComponent(bodyRaw)

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
    const ua = navigator.userAgent || ''
    const isIOS = /iPhone|iPad|iPod/i.test(ua)
    const isAndroid = /Android/i.test(ua)

    if (isIOS) {
      const gmailAppUrl = `googlegmail:///co?to=${to}&subject=${subject}&body=${body}`
      window.location.href = gmailAppUrl
      setTimeout(() => {
        window.location.href = gmailWebUrl
      }, 700)
      return
    }

    if (isAndroid) {
      const gmailIntentUrl = `intent://co?to=${to}&subject=${subject}&body=${body}#Intent;scheme=googlegmail;package=com.google.android.gm;end`
      window.location.href = gmailIntentUrl
      setTimeout(() => {
        window.location.href = gmailWebUrl
      }, 700)
      return
    }

    const opened = window.open(gmailWebUrl, '_blank')
    if (!opened) window.location.href = gmailWebUrl
  }

  // ✅ 2초마다 교체 / 트랜지션 0.13초
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="w-full bg-white min-h-screen">
      {/* ✅ 상단 54px */}
      <div className="h-[54px]" />

      {/* ✅ Topbar: 뒤로가기 + 가운데 타이틀 */}
      <div className="relative w-full h-14 px-4 flex items-center bg-white">
        <img
          src="/icons/back.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className="cursor-pointer brightness-0"
          onClick={() => router.push('/writers/signup')}
        />

        <p className="body-1 text-[var(--color-gray-900)] absolute left-1/2 -translate-x-1/2">
          작가 인증 가이드
        </p>
      </div>

      {/* ✅ 가이드 이미지 (393*606) */}
      <div className="mx-auto w-[393px]">
        <div className="relative w-[393px] h-[606px] overflow-hidden">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`verify-guide-${i + 1}`}
              fill
              priority={i === 0}
              className={`absolute inset-0 object-contain transition-opacity duration-[130ms] ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ 더 자세한 설명 */}
      <div className="mt-6 flex flex-col items-center px-4">
        <a
          href="https://www.notion.so/2d4e81f70948807f821dddb4827d63c4?source=copy_link"
          target="_blank"
          rel="noopener noreferrer"
          className="body-2 text-center text-[var(--color-gray-500)] underline cursor-pointer hover:opacity-70 transition-opacity"
          style={{
            fontFamily: 'Pretendard',
            textDecorationLine: 'underline',
            textUnderlinePosition: 'from-font',
          }}
        >
          더 자세한 설명 보러가기
        </a>

        {/* ✅ 인증하러 가기 버튼 (32px 아래) */}
        <button
          type="button"
          className="mt-[32px] w-[361px] h-[50px] px-[40px] py-[10px] rounded-[12px] bg-[var(--color-gray-900)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleAuthorInquiry}
        >
          <span
            className="text-white font-bold leading-[140%]"
            style={{ fontFamily: 'Pretendard', fontSize: 16 }}
          >
            인증하러 가기
          </span>
        </button>
      </div>
    </div>
  )
}
