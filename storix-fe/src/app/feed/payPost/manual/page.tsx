// src/app/feed/payPost/manual/page.tsx
'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PayPostManualPage() {
  const router = useRouter()

  const images = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/feed/pay-guide-${i + 1}.png`),
    [],
  )

  const [index, setIndex] = useState(0)
  const isLast = index === images.length - 1

  const NOTION_URL = 'https://www.notion.so/2d4e81f709488013bca4fbc13e4a30c5'
  const OPENCHAT_URL = 'https://open.kakao.com/o/sH5I7d8h'

  const handleNext = () => {
    setIndex((prev) => Math.min(prev + 1, images.length - 1))
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
          onClick={() => router.back()}
        />
      </div>

      {/* ✅ 가이드 이미지 */}
      <div className="mx-auto w-[393px]">
        <div className="relative h-[606px] w-[393px] overflow-hidden">
          {images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={`pay-guide-${i + 1}`}
              fill
              priority={i === 0}
              className={`absolute inset-0 object-contain transition-opacity duration-[130ms] ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ✅ 인디케이터 */}
      <p className="mt-2 body-2 text-center text-[var(--color-gray-400)]">
        {index + 1} / {images.length}
      </p>

      {/* ✅ 링크 + 버튼 */}
      <div className="mt-4 flex flex-col items-center px-4 pb-8">
        {/* 노션 링크 */}
        <a
          href={NOTION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="body-2 cursor-pointer text-center text-[var(--color-gray-500)] underline hover:opacity-70 transition-opacity"
        >
          더 자세한 설명 보러가기
        </a>

        {/* Next or OpenChat */}
        {!isLast ? (
          <button
            type="button"
            onClick={handleNext}
            className="
    mt-[32px] h-[50px] w-[361px]
    cursor-pointer
    transition-all
    hover:opacity-80 hover:translate-y-[-1px]
    active:translate-y-[0px]
  "
            aria-label="다음으로"
          >
            <img
              src="/onboarding/next.svg"
              alt="다음으로"
              width={361}
              height={50}
              className="h-[50px] w-[361px]"
            />
          </button>
        ) : (
          <a
            href={OPENCHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              mt-[32px] flex h-[50px] w-[361px]
              items-center justify-center gap-[10px]
              rounded-[12px] px-[40px] py-[10px]
              bg-[var(--color-magenta-300)]
              transition-all hover:opacity-80 hover:translate-y-[-1px]
            "
          >
            <span
              className="text-white leading-[140%]"
              style={{ fontFamily: 'SUIT', fontSize: 16, fontWeight: 600 }}
            >
              오픈 채팅방으로 이동
            </span>
          </a>
        )}
      </div>
    </div>
  )
}
