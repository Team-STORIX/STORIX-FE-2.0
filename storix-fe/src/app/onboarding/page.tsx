// src/app/onboarding/page.tsx
'use client'

import { useState } from 'react'
import Topbar from './components/topbar'
import Nickname from './components/nickname'
import Gender from './components/gender'
import Genre from './components/genre'
import Favorite from './components/favorite'
import Final from './components/final'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [nickname, setNickname] = useState('')
  const [gender, setGender] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white pt-[54px]">
      <Topbar onBack={handleBack} />

      {/* 컨텐츠 영역 */}
      <div className="p-4 pb-32">
        {step === 1 && <Nickname value={nickname} onChange={setNickname} />}
        {step === 2 && <Gender value={gender} onChange={setGender} />}
        {step === 3 && <Genre value={genres} onChange={setGenres} />}
        {step === 4 && <Favorite value={favorites} onChange={setFavorites} />}
        {step === 5 && <Final />}
      </div>

      {/* 하단 다음 버튼 - fixed로 변경 */}
      <div className="fixed bottom-[84px] left-1/2 -translate-x-1/2 z-50">
        <img
          src="/onboarding/next.svg"
          alt="다음"
          width={361}
          height={50}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleNext}
        />
      </div>
    </div>
  )
}
