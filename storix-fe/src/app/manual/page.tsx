// src/app/manual/page.tsx
'use client'

import { useState } from 'react'
import Topbar from './components/topbar'
import Step1 from './components/step1'
import Step2 from './components/step2'
import Step3 from './components/step3'
import Step4 from './components/step4'

export default function ManualPage() {
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* Topbar - 상단에서 54px 아래 */}
      <div className="absolute top-[54px] left-0 right-0 z-50">
        <Topbar onBack={handleBack} />
      </div>

      {/* 헤더 영역 - Topbar 아래 40px부터 */}
      <div className="absolute top-[150px] left-0 right-0 px-4 z-40">
        {/* 제목 */}
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
          이렇게 이용해요!
        </h1>

        {/* 부제목 - 제목 5px 아래 */}
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
          이렇게 이용하면 좋아요
        </p>

        {/* Progress Indicator - 부제목 20px 아래 */}
        <div className="flex justify-center mt-[20px]">
          <img
            src={`/manual/progress-indicater-star-${step}.svg`}
            alt={`진행도 ${step}/4`}
            className="w-[108px] h-[24px]"
            style={{ display: 'block' }}
          />
        </div>
      </div>

      {/* 컨텐츠 영역 - indicator 160px 아래부터 */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: '415px', // 150 + 33.6 + 5 + 22.4 + 20 + 24 + 160
          bottom: '118px',
        }}
      >
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
      </div>

      {/* 하단 버튼 - 하단에서 34px 위 */}
      <div className="absolute bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-50">
        {step < 4 ? (
          <img
            src="/onboarding/next.svg"
            alt="다음"
            className="w-full h-[50px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNext}
          />
        ) : (
          <img
            src="/manual/explore.svg"
            alt="탐색하기"
            className="w-full h-[50px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              // 여기에 탐색하기 페이지로 이동하는 로직 추가
              console.log('탐색하기 클릭')
            }}
          />
        )}
      </div>
    </div>
  )
}
