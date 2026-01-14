// src/app/feed/payPost/manual/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type ViewMode = 'info' | 'manual'

export default function PayPostManualPage() {
  const router = useRouter()
  const [mode, setMode] = useState<ViewMode>('info')

  // ✅ 가이드 이미지 1~7
  const images = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/feed/pay-guide-${i + 1}.png`),
    [],
  )
  const [index, setIndex] = useState(0)

  // ✅ manual 모드에서만 애니메이션 실행
  useEffect(() => {
    if (mode !== 'manual') return

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [mode, images.length])

  const handleBack = () => {
    if (mode === 'manual') {
      setMode('info')
      return
    }
    router.back()
  }

  return (
    <div className="w-full bg-white">
      {/* ✅ 상단 여백 54px + safe-area */}
      <div style={{ height: 'calc(54px + env(safe-area-inset-top))' }} />

      {/* ✅ Topbar */}
      <div className="w-full h-14 p-4 flex justify-between items-center bg-white">
        <img
          src="/icons/back.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className="cursor-pointer brightness-0"
          onClick={handleBack}
        />
      </div>

      {/* =========================
          INFO 화면 (기존 payPost/page.tsx)
         ========================= */}
      {mode === 'info' && (
        <div className="mt-[40px] flex flex-col items-center px-4">
          <h1 className="heading-1 text-center text-black whitespace-pre-line">
            {'스토릭스는 이런 결제방식을\n이용하고 있어요'}
          </h1>

          <p className="body-1 text-center mt-[5px] text-[var(--color-gray-500)]">
            서비스 내 결제 기능 대신, 카카오톡 오픈채팅을 통한 안전한 충전 안내
            방식으로 포인트 충전을 도와드리고 있어요!
          </p>

          <div className="mt-[96px]">
            <Image
              src="/icons/pay.svg"
              alt="결제 안내"
              width={180}
              height={180}
            />
          </div>

          {/* ✅ 같은 페이지 내에서 manual로 전환 */}
          <button
            type="button"
            className="mt-[151px] body-2 text-center text-[var(--color-gray-500)] underline cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setMode('manual')}
          >
            더 자세한 설명 보러가기
          </button>

          <a
            href="https://open.kakao.com/o/sH5I7d8h"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[32px] cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="카카오톡 오픈채팅 이동"
          >
            <Image
              src="/feed/payPost-openchat.svg"
              alt="오픈채팅 바로가기"
              width={361}
              height={50}
            />
          </a>
        </div>
      )}

      {/* =========================
          MANUAL 화면 (기존 manual/page.tsx)
         ========================= */}
      {mode === 'manual' && (
        <div className="mx-auto w-[393px]">
          <div className="relative w-[393px] h-[606px] overflow-hidden">
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
          {/* 아래 여백은 그대로 */}
        </div>
      )}
    </div>
  )
}
