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

  // 각 단계별 유효성 검사
  const isStepValid = () => {
    switch (step) {
      case 1:
        return nickname.trim().length > 0 // 나중에 수정 예정
      case 2:
        return gender !== '' // 성별 1개 선택
      case 3:
        return genres.length >= 1 // 장르 1개 이상 선택
      case 4:
        return favorites.length >= 1 // 작품 1개 이상 선택
      case 5:
        return true // final 단계는 항상 활성화
      default:
        return false
    }
  }

  const canProceed = isStepValid()

  const handleNext = () => {
    if (!canProceed) return // 조건 미충족 시 클릭 무시

    if (step < 5) {
      setStep(step + 1)
    } else {
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
      {/* Topbar */}
      <div className="absolute top-[54px] left-0 right-0 z-50">
        <Topbar onBack={handleBack} />
      </div>

      {/* Progress Indicator */}
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

      {/* 컨텐츠 영역 */}
      <div
        className="px-4 h-full overflow-y-auto"
        style={{
          paddingTop: step <= 4 ? '150px' : '110px',
          paddingBottom: '134px',
        }}
      >
        {step === 1 && <Nickname value={nickname} onChange={setNickname} />}
        {step === 2 && <Gender value={gender} onChange={setGender} />}
        {step === 3 && <Genre value={genres} onChange={setGenres} />}
        {step === 4 && <Favorite value={favorites} onChange={setFavorites} />}
        {step === 5 && <Final />}
      </div>

      {/* 하단 다음 버튼 */}
      <div className="absolute bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-50">
        <img
          src={
            canProceed ? '/onboarding/next.svg' : '/onboarding/next-gray.svg'
          }
          alt="다음"
          className={`w-full h-[50px] ${
            canProceed
              ? 'cursor-pointer hover:opacity-80 transition-opacity'
              : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleNext}
        />
      </div>
    </div>
  )
}
