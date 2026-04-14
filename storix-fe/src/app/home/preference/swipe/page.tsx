// src/app/home/preference/swipe/page.tsx
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import PreferenceCard, {
  type PreferenceCardHandle,
  type PreferenceSwipeDir,
} from '@/components/preference/PreferenceCard'
import { usePreference } from '@/components/preference/PreferenceProvider'
import type { PreferenceWork } from '@/components/preference/PreferenceProvider'

/* ── 퇴장 애니메이션 전용 카드 ── */

type ExitingCardInfo = {
  id: number
  work: PreferenceWork
  dir: PreferenceSwipeDir
  startX: number
}

const EXIT_MS = 360

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function ExitingCard({
  info,
  onDone,
}: {
  info: ExitingCardInfo
  onDone: () => void
}) {
  const elRef = useRef<HTMLDivElement>(null)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    // 시작 위치가 paint 된 후 transition 시작하기 위해 reflow 강제
    el.getBoundingClientRect()

    const distance = (window.innerWidth || 360) + 160
    const targetX = info.dir === 'like' ? distance : -distance
    const targetRotate = clamp(targetX / 18, -12, 12)

    el.style.transition = `transform ${EXIT_MS}ms ease-out`
    el.style.transform = `translateX(${targetX}px) rotate(${targetRotate}deg)`

    const timer = setTimeout(() => onDoneRef.current(), EXIT_MS + 20)
    return () => clearTimeout(timer)
  }, [info.dir])

  const startRotate = clamp(info.startX / 18, -12, 12)

  return (
    <div className="absolute inset-0 translate-y-[6px] pointer-events-none">
      <div
        ref={elRef}
        className="w-full h-full"
        style={{
          transform: `translateX(${info.startX}px) rotate(${startRotate}deg)`,
        }}
      >
        <PreferenceCard work={info.work} />
      </div>
    </div>
  )
}

/* ── 메인 페이지 ── */

export default function PreferenceSwipePage() {
  const router = useRouter()
  const { works, currentIndex, currentWork, like, dislike, isDone } =
    usePreference()

  const cardRef = useRef<PreferenceCardHandle | null>(null)
  const [exitingCards, setExitingCards] = useState<ExitingCardInfo[]>([])

  const nextWork = useMemo(() => {
    if (currentIndex < 0) return null
    return works[currentIndex + 1] ?? null
  }, [works, currentIndex])

  // 다음 카드 이미지 프리로드
  useEffect(() => {
    if (!nextWork?.imageSrc) return
    const img = new window.Image()
    img.src = nextWork.imageSrc
  }, [nextWork?.imageSrc])

  // 마지막 퇴장 애니메이션까지 끝나면 이동
  useEffect(() => {
    if (isDone && exitingCards.length === 0)
      router.replace('/home/preference/complete')
  }, [isDone, exitingCards.length, router])

  const handleSwiped = (dir: PreferenceSwipeDir, startX: number) => {
    if (!currentWork) return
    // 퇴장 레이어에 추가 → 날아가는 애니메이션은 여기서 처리
    setExitingCards((prev) => [
      ...prev,
      { id: currentWork.id, work: currentWork, dir, startX },
    ])
    // state 즉시 업데이트 → 새 카드 바로 인터랙션 가능
    if (dir === 'like') like()
    else dislike()
  }

  const removeExiting = useCallback((id: number) => {
    setExitingCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // progressBar: isDone이면 전부 채움
  const progressFilled = isDone
    ? 10
    : Math.round(((currentIndex + 1) / works.length) * 10)

  if (!currentWork && exitingCards.length === 0) return null

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
          <img
            src="/common/icons/back.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <div className="text-sm font-semibold text-black">
          취향 저격 작품 탐색
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="px-4 pb-3">
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={[
                'flex-1 h-1 transition-colors duration-300',
                i < progressFilled
                  ? 'bg-[var(--color-magenta-300)]'
                  : 'bg-[var(--color-magenta-50)]',
              ].join(' ')}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex-1 min-h-0 flex flex-col">
        {/* 카드 스택 영역 */}
        <div className="relative h-147">
          {/* next card (behind) */}
          {nextWork && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ transform: 'scale(0.98) translateY(6px)' }}
            >
              <PreferenceCard key={`next-${nextWork.id}`} work={nextWork} />
            </div>
          )}

          {/* current card (top) — 즉시 인터랙션 가능 */}
          {currentWork && (
            <div className="absolute inset-0 translate-y-[6px]">
              <PreferenceCard
                key={`cur-${currentWork.id}`}
                ref={cardRef}
                work={currentWork}
                onSwiped={handleSwiped}
              />
            </div>
          )}

          {/* exiting cards (퇴장 애니메이션) */}
          {exitingCards.map((info) => (
            <ExitingCard
              key={`exit-${info.id}`}
              info={info}
              onDone={() => removeExiting(info.id)}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="mt-4 grid grid-cols-2 gap-3 pb-6">
          <button
            type="button"
            onClick={() => cardRef.current?.swipe('dislike')}
            className="py-2.5 px-10 body-1-semibold rounded-xl bg-[var(--color-magenta-50)] text-[var(--color-magenta-300)]"
            onPointerDown={(e) => e.stopPropagation()}
          >
            별로에요
          </button>
          <button
            type="button"
            onClick={() => cardRef.current?.swipe('like')}
            className="py-3.5 px-15 body-1-semibold rounded-xl bg-[var(--color-magenta-300)] text-white"
            onPointerDown={(e) => e.stopPropagation()}
          >
            좋아요!
          </button>
        </div>
      </div>
    </main>
  )
}
