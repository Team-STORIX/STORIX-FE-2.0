'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import SpineButton from './SpineButton'
import RatingPill from './RatingPill'

export type LibraryWork = {
  id: number
  title: string
  meta: string
  thumb: string
  rating: number
  reviewCount: number
}

type BlendState = { leftIdx: number; rightIdx: number; t: number }

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

export default function BookCarousel({ works }: { works: LibraryWork[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const [blend, setBlend] = useState<BlendState>({
    leftIdx: 0,
    rightIdx: 0,
    t: 0,
  })

  const measureAndUpdate = () => {
    const scroller = scrollerRef.current
    if (!scroller || works.length === 0) return

    const sRect = scroller.getBoundingClientRect()
    const centerX = sRect.left + sRect.width / 2

    const centers = itemRefs.current.map((el) => {
      if (!el) return 0
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2
    })

    // center에 가장 가까운 인덱스
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < centers.length; i++) {
      const d = Math.abs(centers[i] - centerX)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    }

    // left/right + t (부드러운 전환용)
    let leftIdx = nearest
    let rightIdx = nearest
    let t = 0

    const dx = centers[nearest] - centerX

    if (dx < 0 && nearest < centers.length - 1) {
      leftIdx = nearest
      rightIdx = nearest + 1
      const denom = centers[rightIdx] - centers[leftIdx] || 1
      t = clamp((centerX - centers[leftIdx]) / denom, 0, 1)
    } else if (dx > 0 && nearest > 0) {
      leftIdx = nearest - 1
      rightIdx = nearest
      const denom = centers[rightIdx] - centers[leftIdx] || 1
      t = clamp((centerX - centers[leftIdx]) / denom, 0, 1)
    }

    setBlend({ leftIdx, rightIdx, t })
  }

  const scheduleUpdate = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      measureAndUpdate()
    })
  }

  useLayoutEffect(() => {
    measureAndUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works.length])

  useEffect(() => {
    const onResize = () => measureAndUpdate()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToIndex = (idx: number) => {
    const scroller = scrollerRef.current
    const el = itemRefs.current[idx]
    if (!scroller || !el) return

    const sRect = scroller.getBoundingClientRect()
    const eRect = el.getBoundingClientRect()

    const targetLeft =
      scroller.scrollLeft +
      (eRect.left + eRect.width / 2) -
      (sRect.left + sRect.width / 2)

    scroller.scrollTo({ left: targetLeft, behavior: 'smooth' })
  }

  // wheel → 가로 이동
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      scroller.scrollLeft += e.deltaY
      scheduleUpdate()
    }
  }

  // drag
  const drag = useRef({ down: false, x: 0, left: 0 })
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    drag.current = { down: true, x: e.clientX, left: scroller.scrollLeft }
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller || !drag.current.down) return
    const dx = e.clientX - drag.current.x
    scroller.scrollLeft = drag.current.left - dx
    scheduleUpdate()
  }
  const onPointerUp = () => {
    drag.current.down = false
  }

  const a = works[blend.leftIdx]
  const b = works[blend.rightIdx]

  // 표지/텍스트 crossfade (자연스럽게 바뀌는 느낌)
  const heroA = {
    opacity: 1 - blend.t,
    transform: `translateX(${blend.t * -14}px) scale(${1 - blend.t * 0.03})`,
  }
  const heroB = {
    opacity: blend.t,
    transform: `translateX(${(1 - blend.t) * 14}px) scale(${0.97 + blend.t * 0.03})`,
  }

  return (
    <div className="mt-6">
      {/* ✅ 1번째 이미지처럼: “표지 + 책등들”을 같은 영역에 배치 */}
      <div className="relative mx-auto w-full max-w-[393px]">
        {/* 책등 줄(좌우로 길게) */}
        <div
          ref={scrollerRef}
          onScroll={scheduleUpdate}
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="absolute left-0 right-0 top-4 z-10 overflow-x-auto no-scrollbar"
          style={{ touchAction: 'pan-x' }}
        >
          {/* 가운데 정렬을 위해 충분한 좌우 패딩 */}
          <div className="flex items-center gap-[114px] px-[220px] py-4">
            {works.map((w, i) => {
              // ✅ 중앙에 가까울수록 “책등이 사라지고 표지로 바뀌는” 느낌: opacity/scale
              let emphasis = 0
              if (blend.leftIdx === i) emphasis = 1 - blend.t
              if (blend.rightIdx === i) emphasis = Math.max(emphasis, blend.t)

              const scale = 1 + emphasis * 0.06
              const opacity = 0.85 - emphasis * 0.85 // 중앙 가까우면 거의 사라짐(표지로 전환)

              // 표지 기준 왼쪽/오른쪽에 따라 그라디언트 방향 바꾸기
              const centerIdx = blend.t > 0.5 ? blend.rightIdx : blend.leftIdx
              const edge = i < centerIdx ? 'right' : 'left'

              return (
                <SpineButton
                  key={w.id}
                  ref={(el) => {
                    itemRefs.current[i] = el
                  }}
                  title={w.title}
                  onClick={() => scrollToIndex(i)}
                  edge={edge}
                  height={260}
                  className="shrink-0"
                  // 강조/전환
                  style={
                    {
                      transform: `scale(${scale})`,
                      opacity,
                      transition: 'transform 180ms ease, opacity 180ms ease',
                    } as any
                  }
                />
              )
            })}
          </div>
        </div>

        {/* 표지/제목 영역 (책등 위로 올라오게) */}
        <div className="relative z-20 flex h-[560px] flex-col items-center justify-start pt-[80px]">
          {/* A */}
          <div
            className="absolute left-1/2 top-[80px] w-full -translate-x-1/2 transition-[opacity,transform] duration-150 ease-out"
            style={heroA}
          >
            {a && (
              <div className="flex flex-col items-center">
                <div className="relative h-[260px] w-[260px] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={a.thumb}
                    alt={a.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <p className="heading-2 mt-10 text-center text-black">
                  {a.title}
                </p>
                <p className="body-2 mt-3 text-center text-gray-400">
                  {a.meta}
                </p>

                <div className="mt-6">
                  <RatingPill value={a.rating} />
                </div>
              </div>
            )}
          </div>

          {/* B */}
          <div
            className="absolute left-1/2 top-[80px] w-full -translate-x-1/2 transition-[opacity,transform] duration-150 ease-out"
            style={heroB}
          >
            {b && (
              <div className="flex flex-col items-center">
                <div className="relative h-[260px] w-[260px] overflow-hidden rounded-2xl bg-gray-100">
                  <Image
                    src={b.thumb}
                    alt={b.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <p className="heading-2 mt-10 text-center text-black">
                  {b.title}
                </p>
                <p className="body-2 mt-3 text-center text-gray-400">
                  {b.meta}
                </p>

                <div className="mt-6">
                  <RatingPill value={b.rating} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
