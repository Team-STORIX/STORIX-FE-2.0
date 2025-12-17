// src/app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Topbar from './components/topbar'
import Nickname from './components/nickname'
import Gender from './components/gender'
import Genre from './components/genre'
import Favorite from './components/favorite'
import Final from './components/final'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      // step 5에서 다음 버튼 클릭 시 manual 페이지로 이동
      router.push('/manual')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="relative w-full h-full bg-white">
      {/* Topbar - 상단에서 54px 아래 */}
      <div className="absolute top-[54px] left-0 right-0 z-50">
        <Topbar onBack={handleBack} />
      </div>

      {/* Progress Indicator - Topbar 바로 아래 (54 + 56 = 110px), step 1~4만 표시 */}
      {step <= 4 && (
        <div className="absolute top-[110px] left-4 z-40">
          <img
            src={`/onboarding/progress-indicater-${step}.svg`}
            alt={`진행도 ${step}/4`}
            className="h-[8px]"
            style={{ display: 'block' }}
          />
        </div>
      )}

      {/* 컨텐츠 영역 - indicator 아래 32px부터 (110 + 8 + 32 = 150px) */}
      <div
        className="px-4 h-full overflow-y-auto"
        style={{
          paddingTop: step <= 4 ? '150px' : '110px',
          paddingBottom: '134px',
        }}
      >
        {/* 실제 컨텐츠 */}
        {step === 1 && <Nickname value={nickname} onChange={setNickname} />}
        {step === 2 && <Gender value={gender} onChange={setGender} />}
        {step === 3 && <Genre value={genres} onChange={setGenres} />}
        {step === 4 && <Favorite value={favorites} onChange={setFavorites} />}
        {step === 5 && <Final />}
      </div>

      {/* 하단 다음 버튼 - 하단에서 34px 위 */}
      <div className="absolute bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-50">
        <img
          src="/onboarding/next.svg"
          alt="다음"
          className="w-full h-[50px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleNext}
        />
      </div>
    </div>
  )
}
