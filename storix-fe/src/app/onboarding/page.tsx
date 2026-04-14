// src/app/common/onboarding/page.tsx
'use client'

import { useEffect, useRef, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// import { useAuthStore } from '@/store/auth.store'   // 디자인 확인용: 주석처리
// import { useSignup } from '@/hooks/auth/useSignup'  // 디자인 확인용: 주석처리
import Topbar from './components/topbar'
import Nickname from './components/nickname'
import Gender from './components/bio'
import Genre from './components/genre'
import type { GenreKey } from './components/genre'
import Favorite from './components/favorite'
import Final from './components/final'

function OnboardingInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stepParam = Number(searchParams.get('step') ?? '1')
  const step = isNaN(stepParam) || stepParam < 1 || stepParam > 5 ? 1 : stepParam

  // const { marketingAgree } = useAuthStore()          // 디자인 확인용: 주석처리
  // const { mutate: signupMutate, isPending } = useSignup()  // 디자인 확인용: 주석처리

  const [nickname, setNickname] = useState('')
  const [bio, setBio] = useState('')
  const [genres, setGenres] = useState<GenreKey[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [canGoNextNickname, setCanGoNextNickname] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | undefined>(undefined)
  const profileImageFileRef = useRef<File | null>(null)

  useEffect(() => {
    return () => {
      if (profileImagePreview?.startsWith('blob:')) URL.revokeObjectURL(profileImagePreview)
    }
  }, [profileImagePreview])

  const setStep = (s: number) => {
    router.push(`/onboarding?step=${s}`)
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return canGoNextNickname
      case 2: return true
      case 3: return genres.length >= 1
      case 4: return favoriteIds.length <= 18
      case 5: return true
      default: return false
    }
  }

  const canProceed = isStepValid()

  const handleNext = () => {
    if (!canProceed) return
    if (step < 5) setStep(step + 1)
    // else handleSignup()  // 디자인 확인용: 주석처리
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else router.push('/agreement')
  }

  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Topbar
          onBack={handleBack}
          onSkip={step < 5 ? () => setStep(step + 1) : undefined}
        />
      </div>

      {step <= 4 && (
        <div className="px-4 pt-4">
          <img
            src={`/common/onboarding/progress-indicater-${step}.svg`}
            alt={`진행도 ${step}/4`}
            className="h-[8px]"
            style={{ display: 'block' }}
          />
        </div>
      )}

      <div className="px-4" style={{ paddingTop: 24, paddingBottom: 134 }}>
        {step === 1 && (
          <Nickname
            value={nickname}
            onChange={setNickname}
            onAvailabilityChange={setCanGoNextNickname}
            profileImagePreview={profileImagePreview}
            onImageChange={(file) => {
              profileImageFileRef.current = file
              if (profileImagePreview?.startsWith('blob:')) URL.revokeObjectURL(profileImagePreview)
              setProfileImagePreview(URL.createObjectURL(file))
            }}
          />
        )}
        {step === 2 && <Gender value={bio} onChange={setBio} />}
        {step === 3 && <Genre value={genres} onChange={setGenres} />}
        {step === 4 && <Favorite value={favoriteIds} onChange={setFavoriteIds} />}
        {step === 5 && <Final />}
      </div>

      <div className="fixed bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-50">
        <img
          src={canProceed ? '/common/onboarding/next.svg' : '/common/onboarding/next-gray.svg'}
          alt="다음"
          className={`w-full h-[50px] ${
            canProceed ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={handleNext}
        />
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingInner />
    </Suspense>
  )
}
