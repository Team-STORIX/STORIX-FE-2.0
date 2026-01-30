// src/app/home/preference/swipe/page.tsx
'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import PreferenceCard, {
  type PreferenceCardHandle,
  type PreferenceSwipeDir,
} from '@/components/preference/PreferenceCard'
import { usePreference } from '@/components/preference/PreferenceProvider'

export default function PreferenceSwipePage() {
  const router = useRouter()
  const { works, currentIndex, currentWork, like, dislike, isDone } =
    usePreference()

  const cardRef = useRef<PreferenceCardHandle | null>(null) // ✅

  // ✅ UI 변경: 다음 작품을 미리 계산해서 뒤에 렌더
  const nextWork = useMemo(() => {
    if (currentIndex < 0) return null
    return works[currentIndex + 1] ?? null
  }, [works, currentIndex])

  useEffect(() => {
    if (isDone) router.replace('/home/preference/complete')
  }, [isDone, router])

  if (!currentWork) return null

  const handleSwiped = (dir: PreferenceSwipeDir) => {
    if (dir === 'like') like()
    else dislike()
  }

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

      <div className="px-4 pt-10 flex-1 min-h-0 flex flex-col">
        {/* ✅ UI 변경: 카드 스택 영역(다음 카드가 뒤에 깔림) */}
        <div className="relative h-[524px] mb-4">
          {/* next card (behind) */}
          {nextWork && (
            <div
              className="absolute inset-0 pointer-events-none" // ✅ UI 변경: 뒤 카드는 터치/클릭 안 먹게
              style={{
                transform: 'scale(0.98) translateY(6px)', // ✅ UI 변경: 살짝 뒤에 깔린 느낌
              }}
            >
              <PreferenceCard
                key={`next-${nextWork.id}`} // ✅ 키 충돌 방지
                work={nextWork}
              />
            </div>
          )}

          {/* current card (top) */}
          <div className="absolute inset-0 translate-y-[6px]">
            <PreferenceCard
              key={`cur-${currentWork.id}`} // ✅ 키 충돌 방지
              ref={cardRef}
              work={currentWork}
              onSwiped={handleSwiped}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-4 grid grid-cols-2 gap-3 pb-6">
          <button
            type="button"
            onClick={() => cardRef.current?.swipe('dislike')} // ✅ UI 변경
            className="h-[52px] body-3 rounded-xl bg-[var(--color-magenta-50)] text-[var(--color-magenta-300)]"
            onPointerDown={(e) => e.stopPropagation()} // ✅ (클릭 씹힘 방지)
          >
            별로에요
          </button>
          <button
            type="button"
            onClick={() => cardRef.current?.swipe('like')} // ✅ UI 변경
            className="h-[52px] body-3 rounded-xl bg-[var(--color-magenta-300)] text-white"
            onPointerDown={(e) => e.stopPropagation()} // ✅ (클릭 씹힘 방지)
          >
            좋아요!
          </button>
        </div>
      </div>
    </main>
  )
}
