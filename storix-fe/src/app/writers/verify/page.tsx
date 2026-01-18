// src/app/writers/verify/page.tsx
'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WritersVerifyPage() {
  const router = useRouter()

  const images = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => `/manual/verify-guide-${i + 1}.png`),
    [],
  )

  const [index, setIndex] = useState(0)
  const isLast = index === images.length - 1

  const goNext = () => setIndex((prev) => Math.min(prev + 1, images.length - 1))

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

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ✅ Topbar */}
      <div className="relative flex h-14 w-full items-center bg-white px-4">
        <img
          src="/icons/back.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className="cursor-pointer brightness-0 hover:opacity-70 transition-opacity"
          onClick={() => router.push('/writers/signup')}
        />

        <p className="body-1 absolute left-1/2 -translate-x-1/2 text-[var(--color-gray-900)]">
          작가 인증 가이드
        </p>
      </div>

      {/* ✅ 가이드 이미지 (393*606) */}
      <div className="mx-auto w-[393px]">
        <div className="relative h-[606px] w-[393px] overflow-hidden">
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
          className="body-2 cursor-pointer text-center text-[var(--color-gray-500)] underline hover:opacity-70 transition-opacity"
          style={{
            fontFamily: 'Pretendard',
            textDecorationLine: 'underline',
            textUnderlinePosition: 'from-font',
          }}
        >
          더 자세한 설명 보러가기
        </a>

        {/* ✅ 32px 아래: Next 버튼 or 인증 버튼 */}
        {!isLast ? (
          <button
            type="button"
            onClick={goNext}
            className="mt-[32px] w-[361px] h-[50px] hover:opacity-80 transition-opacity"
            aria-label="다음"
          >
            <img
              src="/onboarding/next.svg"
              alt="다음"
              width={361}
              height={50}
              className="h-[50px] w-[361px]"
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAuthorInquiry}
            className="mt-[32px] flex w-[361px] h-[50px] items-center justify-center gap-[10px] rounded-[12px] px-[40px] py-[10px] bg-[var(--color-magenta-300)] hover:opacity-80 transition-opacity"
          >
            <span
              className="text-white leading-[140%]"
              style={{
                fontFamily: 'SUIT',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              인증하러 가기
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
