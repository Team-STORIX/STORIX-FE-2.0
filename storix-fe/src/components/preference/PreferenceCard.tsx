// src/components/preference/PreferenceCard.tsx
'use client'

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { PreferenceWork } from './PreferenceProvider'

export type PreferenceSwipeDir = 'like' | 'dislike'

export type PreferenceCardHandle = {
  swipe: (dir: PreferenceSwipeDir) => void
}

type Props = {
  work: PreferenceWork
  onSwiped?: (dir: PreferenceSwipeDir) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const PreferenceCard = forwardRef<PreferenceCardHandle, Props>(
  function PreferenceCard({ work, onSwiped }, ref) {
    const rootRef = useRef<HTMLDivElement | null>(null)

    const onSwipedRef = useRef(onSwiped) // ✅ UI 변경
    useEffect(() => {
      onSwipedRef.current = onSwiped // ✅ UI 변경
    }, [onSwiped])

    const startXRef = useRef(0)
    const startTimeRef = useRef(0)
    const draggingRef = useRef(false)
    const animatingRef = useRef(false)

    const [x, setX] = useState(0)
    const [withTransition, setWithTransition] = useState(false)

    // ✅ UI 변경: 타입이 프로젝트에서 확장되어도 안전하게 접근
    const genre = (work as any)?.genre as string | undefined
    const description = (work as any)?.description as string | undefined
    const hashtags = useMemo(() => {
      const raw = (work as any)?.hashtags
      return Array.isArray(raw) ? raw.filter(Boolean).map(String) : []
    }, [work])

    const OUT_MS = 360 // ✅ UI 변경: 날아가는 속도 조금 느리게
    const RESET_MS = 260 // ✅ UI 변경: 복귀도 살짝 여유

    const resetPosition = () => {
      setWithTransition(true)
      setX(0)
      window.setTimeout(() => {
        setWithTransition(false)
      }, RESET_MS) // ✅ UI 변경
    }

    const animateOut = (dir: PreferenceSwipeDir) => {
      if (animatingRef.current) return
      animatingRef.current = true

      const distance =
        (typeof window !== 'undefined' ? window.innerWidth : 360) + 160 // ✅ UI 변경: 더 확실히 화면 밖으로

      setWithTransition(true)
      setX(dir === 'like' ? distance : -distance)

      window.setTimeout(() => {
        onSwipedRef.current?.(dir) // ✅ UI 변경: 버튼 swipe에서도 최신 콜백 실행
        setWithTransition(false)
        setX(0)
        animatingRef.current = false
      }, OUT_MS) // ✅ UI 변경
    }

    const onPointerDown = (e: React.PointerEvent) => {
      if (animatingRef.current) return

      draggingRef.current = true
      startXRef.current = e.clientX
      startTimeRef.current = Date.now()

      setWithTransition(false)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      if (animatingRef.current) return

      const dx = e.clientX - startXRef.current
      setX(dx)
    }

    const onPointerUp = (e: React.PointerEvent) => {
      if (!draggingRef.current) return
      draggingRef.current = false

      const dx = e.clientX - startXRef.current
      const dt = Math.max(1, Date.now() - startTimeRef.current)
      const velocity = (dx / dt) * 1000 // px/s

      const threshold = 120
      const velocityThreshold = 800

      if (dx > threshold || velocity > velocityThreshold) {
        animateOut('like')
        return
      }
      if (dx < -threshold || velocity < -velocityThreshold) {
        animateOut('dislike')
        return
      }

      resetPosition()
    }

    const onPointerCancel = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      resetPosition()
    }

    // ✅ UI 변경: work가 바뀌면 위치 초기화 (버튼/스와이프 공통)
    useEffect(() => {
      draggingRef.current = false
      animatingRef.current = false
      setWithTransition(false)
      setX(0)
    }, [work])

    useImperativeHandle(
      ref,
      () => ({
        swipe: (dir: PreferenceSwipeDir) => {
          animateOut(dir)
        },
      }),
      [],
    )

    // ✅ UI 변경: 틴더 느낌 회전(좌우로 이동할수록 회전)
    const rotate = clamp(x / 18, -12, 12)

    return (
      <div
        ref={rootRef}
        className="w-full"
        style={{
          touchAction: 'none',
          transform: `translateX(${x}px) rotate(${rotate}deg)`,
          transition: withTransition
            ? `transform ${OUT_MS}ms ease-out`
            : 'none', // ✅ UI 변경
        }}
        onPointerDown={onPointerDown} // ✅ UI 변경
        onPointerMove={onPointerMove} // ✅ UI 변경
        onPointerUp={onPointerUp} // ✅ UI 변경
        onPointerCancel={onPointerCancel} // ✅ UI 변경
      >
        {/* 아래는 기존 UI 유지 */}
        <div className="w-full rounded-xl overflow-hidden">
          <div
            className="relative w-full h-[60dvh] min-h-[500px]"
            style={{
              background:
                `linear-gradient(180deg, rgba(255, 64, 147, 0.00) 0%, rgba(255, 64, 147, 0.60) 100%), ` +
                `linear-gradient(0deg, var(--bottomsheet_background, rgba(0, 0, 0, 0.50)) 0%, var(--bottomsheet_background, rgba(0, 0, 0, 0.50)) 100%), ` +
                `url(${(work as any).imageSrc ?? (work as any).thumbnailUrl}) lightgray 50% / cover no-repeat`,
            }}
          >
            <div className="absolute left-4 right-4 bottom-4 text-white">
              {!!genre && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-[var(--color-magenta-300)] text-white body-4">
                    {genre}
                  </span>
                </div>
              )}

              <div className="text-[28px] leading-[34px] font-semibold tracking-[-0.02em]">
                {(work as any).worksName ?? (work as any).title}
              </div>

              {!!description && (
                <div className="mt-2 body-2 text-white/90 line-clamp-3">
                  {description}
                </div>
              )}

              {hashtags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {hashtags.map((t, i) => (
                    <span
                      key={`${(work as any).worksId ?? (work as any).id}-tag-${i}`}
                      className="inline-flex items-center h-8 px-4 rounded-full bg-white/20 text-white/95 body-2"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  },
)

export default PreferenceCard
