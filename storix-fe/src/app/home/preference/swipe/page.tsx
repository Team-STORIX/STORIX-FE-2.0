'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PreferenceCard from '@/components/preference/PreferenceCard'
import { usePreference } from '@/components/preference/PreferenceProvider'

export default function PreferenceSwipePage() {
  const router = useRouter()
  const { currentWork, like, dislike, isDone } = usePreference()

  useEffect(() => {
    if (isDone) router.replace('/home/preference/complete')
  }, [isDone, router])

  if (!currentWork) return null

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      {/* 헤더 */}
      <div className="h-[52px] px-4 flex items-center justify-center relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 text-black/70"
          aria-label="back"
        >
          ←
        </button>
        <div className="text-sm font-semibold text-black">
          취향 저격 작품 탐색
        </div>
      </div>

      <div className="px-4 pt-3 flex-1 flex flex-col">
        <div className="flex-1">
          <PreferenceCard work={currentWork} />
        </div>

        {/* 버튼 */}
        <div className="mt-4 grid grid-cols-2 gap-3 pb-6">
          <button
            type="button"
            onClick={dislike}
            className="h-[52px] rounded-xl bg-black/5 text-[var(--color-magenta-300)] font-semibold"
          >
            별로에요
          </button>
          <button
            type="button"
            onClick={like}
            className="h-[52px] rounded-xl bg-[var(--color-magenta-300)] text-white font-semibold"
          >
            좋아요!
          </button>
        </div>
      </div>
    </main>
  )
}
