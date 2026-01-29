// src/app/manual/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from './components/topbar'

export default function ManualPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const manualImages = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `/manual/manual-${i + 1}.png`),
    [],
  )

  // ✅ step별 문구
  const copy = useMemo(() => {
    const map: Record<number, { title: string; desc: string }> = {
      1: {
        title: '실시간 토픽룸',
        desc: '실시간으로 작품에 대해 이야기해보세요!',
      },
      2: {
        title: '취향 작품 탐색',
        desc: '내 취향에 맞는 작품을 빠르게 모아보세요!',
      },
      3: { title: '관심 피드', desc: '작품에 대한 이야기를 올릴 수 있는 피드' },
      4: {
        title: '나만의 서재',
        desc: '서재에서 내 관심 작품에 대한 리뷰를 모아보세요!',
      },
    }
    return map[step]
  }, [step])

  const isLast = step === 4

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 4))
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Topbar */}
      <div className="absolute top-[54px] left-0 right-0 z-50">
        <Topbar onBack={handleBack} />
      </div>

      {/* 헤더 영역 */}
      <div className="absolute top-[150px] left-0 right-0 px-4 z-40">
        <h1
          className="text-center"
          style={{
            color: 'var(--color-gray-900)',
            fontFamily: 'SUIT',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: '140%',
          }}
        >
          {copy.title}
        </h1>

        <p
          className="text-center mt-[5px]"
          style={{
            color: 'var(--color-gray-500)',
            fontFamily: 'SUIT',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '140%',
          }}
        >
          {copy.desc}
        </p>

        {/* Progress indicator */}
        <div className="flex justify-center mt-[20px]">
          <img
            src={`/manual/progress-indicater-star-${step}.svg`}
            alt={`진행도 ${step}/4`}
            className="w-[108px] h-[24px]"
            style={{ display: 'block' }}
          />
        </div>

        {/*   이미지: progress indicator 바로 아래 / 가로 393 */}
        <div className="relative mt-[16px] left-1/2 -translate-x-1/2 w-[393px]">
          <img
            src={manualImages[step - 1]}
            alt={`manual-${step}`}
            className="w-[393px] h-auto block"
          />
        </div>
      </div>

      {/* ✅ 하단 버튼 */}
      <div className="absolute bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-[60]">
        {!isLast ? (
          <img
            src="/onboarding/next.svg"
            alt="다음"
            className="w-full h-[50px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNext}
          />
        ) : (
          <img
            src="/manual/explore.svg"
            alt="탐험 시작하기"
            className="w-full h-[50px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/home')}
          />
        )}
      </div>
    </div>
  )
}
