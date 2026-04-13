// src/app/onboarding/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useSignup } from '@/hooks/auth/useSignup'
import Topbar from './components/topbar'
import Profile from './components/profile'
import Bio from './components/bio'
import Genre from './components/genre'
import type { GenreKey } from './components/genre'
import Favorite from './components/favorite'
import Final from './components/final'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { marketingAgree } = useAuthStore()
  const { mutate: signupMutate, isPending } = useSignup()

  const devStep =
    process.env.NODE_ENV === 'development'
      ? Number(searchParams.get('devStep') ?? 1)
      : 1

  const [step, setStep] = useState(devStep)
  const [nickname, setNickname] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [bio, setBio] = useState('')
  const [genres, setGenres] = useState<GenreKey[]>([])
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])

  const [canGoNextNickname, setCanGoNextNickname] = useState(false)

  const isStepValid = () => {
    switch (step) {
      case 1:
        return process.env.NODE_ENV === 'development' || canGoNextNickname
      case 2:
        // 한줄소개는 선택 항목
        return true
      case 3:
        return genres.length >= 1
      case 4:
        return favoriteIds.length >= 2 && favoriteIds.length <= 18
      case 5:
        return true
      default:
        return false
    }
  }

  const canProceed = isStepValid()

  const handleNext = () => {
    if (!canProceed) return
    if (step < 5) setStep((s) => s + 1)
    else handleSignup()
  }

  const handleSignup = () => {
    const savedProfileImage = profileImage ?? '/profile/profile-default.svg'

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname', nickname)
      sessionStorage.setItem('signup_genres', JSON.stringify(genres))
      sessionStorage.setItem('signup_favoriteIds', JSON.stringify(favoriteIds))
      sessionStorage.setItem('signup_bio', bio)
      sessionStorage.setItem('signup_profile_image', savedProfileImage)
    }

    signupMutate({
      marketingAgree,
      nickName: nickname,
      gender: 'NONE',
      favoriteGenreList: genres,
      favoriteWorksIdList: favoriteIds,
    })
  }

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1)
    else router.push('/agreement')
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[16px] font-medium text-[var(--color-gray-700)]">
          회원가입 중...
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Topbar
          onBack={handleBack}
          showSkip={step === 2 || step === 4}
          onSkip={() => setStep((s) => s + 1)}
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
          <Profile
            value={nickname}
            onChange={setNickname}
            onAvailabilityChange={setCanGoNextNickname}
            profileImage={profileImage}
            onProfileImageChange={setProfileImage}
          />
        )}
        {step === 2 && <Bio onChange={setBio} />}
        {step === 3 && <Genre value={genres} onChange={setGenres} />}
        {step === 4 && (
          <Favorite value={favoriteIds} onChange={setFavoriteIds} />
        )}
        {step === 5 && <Final />}
      </div>

      <div className="fixed bottom-[34px] left-1/2 -translate-x-1/2 w-[361px] z-50">
        <img
          src={
            canProceed ? '/common/onboarding/next.svg' : '/common/onboarding/next-gray.svg'
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
