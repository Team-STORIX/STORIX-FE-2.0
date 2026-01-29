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
    <main className="h-dvh bg-white flex flex-col overflow-hidden overscroll-none">
      {/* 헤더 */}
      <div className="h-14 py-2 px-4 flex items-center justify-center relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 text-black/70"
          aria-label="back"
        >
          <img src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <div className="text-sm font-semibold text-black">
          취향 저격 작품 탐색
        </div>
      </div>

      <div className="px-4 pt-3 flex-1 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0">
          <PreferenceCard work={currentWork} />
        </div>

        {/* 버튼 */}
        <div className="left-0 right-0 bottom-0 z-50">
          <div className="pb-[calc(env(safe-area-inset-bottom)+16px)] pt-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={dislike}
                className="w-full px-10 py-2.5 rounded-xl bg-[var(--color-magenta-50)] text-[var(--color-magenta-300)] cursor-pointer"
              >
                별로에요
              </button>
              <button
                type="button"
                onClick={like}
                className="w-full px-10 py-2.5 rounded-xl bg-[var(--color-magenta-300)] text-white cursor-pointer"
              >
                좋아요!
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
