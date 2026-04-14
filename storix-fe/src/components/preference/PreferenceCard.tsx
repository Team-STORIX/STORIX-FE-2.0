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
  /** 스와이프 확정 시 즉시 호출. startX = 릴리즈 시점의 드래그 오프셋 */
  onSwiped?: (dir: PreferenceSwipeDir, startX: number) => void
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

const PreferenceCard = forwardRef<PreferenceCardHandle, Props>(
  function PreferenceCard({ work, onSwiped }, ref) {
    const rootRef = useRef<HTMLDivElement | null>(null)

    const onSwipedRef = useRef(onSwiped)
    useEffect(() => {
      onSwipedRef.current = onSwiped
    }, [onSwiped])

    const startXRef = useRef(0)
    const startTimeRef = useRef(0)
    const draggingRef = useRef(false)
    const resetTimerRef = useRef<number | null>(null)

    const [x, setX] = useState(0)
    const [withTransition, setWithTransition] = useState(false)

    const { genre, worksType, description } = work
    const hashtags = useMemo(() => {
      return work.hashtags.filter(Boolean)
    }, [work])

    const RESET_MS = 260

    const resetPosition = () => {
      setWithTransition(true)
      setX(0)
      resetTimerRef.current = window.setTimeout(() => {
        setWithTransition(false)
        resetTimerRef.current = null
      }, RESET_MS)
    }

    useEffect(() => {
      return () => {
        if (resetTimerRef.current) window.clearTimeout(resetTimerRef.current)
      }
    }, [])

    const onPointerDown = (e: React.PointerEvent) => {
      draggingRef.current = true
      startXRef.current = e.clientX
      startTimeRef.current = Date.now()
      setWithTransition(false)
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    }

    const onPointerMove = (e: React.PointerEvent) => {
      if (!draggingRef.current) return
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
        onSwipedRef.current?.('like', dx)
        return
      }
      if (dx < -threshold || velocity < -velocityThreshold) {
        onSwipedRef.current?.('dislike', dx)
        return
      }

      resetPosition()
    }

    const onPointerCancel = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      resetPosition()
    }

    useEffect(() => {
      draggingRef.current = false
      setWithTransition(false)
      setX(0)
    }, [work])

    useImperativeHandle(
      ref,
      () => ({
        swipe: (dir: PreferenceSwipeDir) => {
          onSwipedRef.current?.(dir, 0)
        },
      }),
      [],
    )

    const rotate = clamp(x / 18, -12, 12)

    return (
      <div
        ref={rootRef}
        className="w-full h-full"
        style={{
          touchAction: onSwiped ? 'none' : undefined,
          transform: `translateX(${x}px) rotate(${rotate}deg)`,
          transition: withTransition
            ? `transform ${RESET_MS}ms ease-out`
            : 'none',
        }}
        onPointerDown={onSwiped ? onPointerDown : undefined}
        onPointerMove={onSwiped ? onPointerMove : undefined}
        onPointerUp={onSwiped ? onPointerUp : undefined}
        onPointerCancel={onSwiped ? onPointerCancel : undefined}
      >
        <div className="w-full h-full rounded-xl overflow-hidden">
          <div
            className="relative flex pt-8 w-full h-full"
            style={{
              background:
                `linear-gradient(0deg, rgba(19, 17, 18, 0.20) 0%, rgba(19, 17, 18, 0.20) 100%), ` +
                `linear-gradient(180deg, rgba(19, 17, 18, 0.00) 0%, rgba(19, 17, 18, 0.60) 100%), ` +
                `url(${work.imageSrc}) lightgray -77.006px 0px / 141.788% 117.778% no-repeat`,
            }}
          >
            <div className="absolute left-4 right-4 bottom-4 text-white">
              {!!(genre || worksType) && (
                <div className="mb-2 flex items-center gap-2">
                  {!!worksType && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-magenta-300)] text-white body-2-bold">
                      {worksType}
                    </span>
                  )}
                  {!!genre && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-[var(--color-magenta-300)] body-2-bold">
                      {genre}
                    </span>
                  )}
                </div>
              )}

              <div className="heading-1 tracking-[-0.02em]">{work.title}</div>

              {!!description && (
                <div className="mt-2 body-1-medium text-white line-clamp-3">
                  {description}
                </div>
              )}

              {hashtags.length > 0 && (
                <div className="mt-3 flex max-h-8 flex-wrap gap-2 overflow-hidden">
                  {hashtags.map((t, i) => (
                    <span
                      key={`${work.id}-tag-${i}`}
                      className="inline-flex items-center px-2 py-1 rounded-full bg-white/20 text-white/95 body-2-bold"
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
