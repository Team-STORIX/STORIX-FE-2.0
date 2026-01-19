// src/components/library/gallery/BookSpineCarousel.tsx
'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type Work = {
  id: number
  title: string
  meta: string
  thumb: string
  rating: number
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

export default function BookSpineCarousel({ works }: { works: Work[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const [activeIdx, setActiveIdx] = useState(0)

  const measureActive = () => {
    const scroller = scrollerRef.current
    if (!scroller || works.length === 0) return

    const sRect = scroller.getBoundingClientRect()
    const centerX = sRect.left + sRect.width / 2

    let nearest = 0
    let nearestDist = Infinity

    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = r.left + r.width / 2
      const d = Math.abs(x - centerX)
      if (d < nearestDist) {
        nearestDist = d
        nearest = i
      }
    })

    setActiveIdx(nearest)
  }

  const scheduleMeasure = () => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      measureActive()
    })
  }

  useLayoutEffect(() => {
    measureActive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works.length])

  useEffect(() => {
    const onResize = () => measureActive()
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

    //  (1) 현재 위치 기준으로 “엘리먼트 중심 → 스크롤러 중심” 차이만큼 이동
    const delta = eRect.left + eRect.width / 2 - (sRect.left + sRect.width / 2)

    //  (2) 스크롤러의 scrollLeft에 delta를 더해서 중앙 정렬
    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: 'smooth',
    })

    //  (3) 클릭하면 active도 즉시 바뀌게(선택 반응 빨리)
    setActiveIdx(idx)
  }
  // 마우스 휠로도 가로 이동
  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      scroller.scrollLeft += e.deltaY
      scheduleMeasure()
    }
  }

  // 드래그
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
    scheduleMeasure()
  }
  const onPointerUp = () => {
    drag.current.down = false
  }

  const active = works[activeIdx]

  return (
    <div className="w-full">
      {/*  책등 캐러셀 */}
      <div
        ref={scrollerRef}
        onScroll={scheduleMeasure}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ touchAction: 'pan-x' }}
      >
        {/* 중앙 정렬용 패딩 */}
        <div className="flex items-center gap-5.5 pl-35 pr-155 py-6">
          {works.map((w, i) => {
            const isActive = i === activeIdx

            return (
              <button
                key={w.id}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={[
                  'relative shrink-0 snap-center rounded-r-xs bg-[var(--color-magenta-300)]',
                  'transition-all duration-250 ease-out',
                  'hover:opacity-90 cursor-pointer',
                  isActive ? 'bg-white' : '',
                ].join(' ')}
                style={{
                  width: isActive ? 150 : 30, // 가운데만 “표지로 확장”
                  height: 200,
                }}
                aria-label={w.title}
              >
                {/*  표지(활성일 때만 보임) */}
                {isActive && (
                  <div className="absolute inset-0 w-37.5 h-50 overflow-hidden rounded-sm">
                    <Image
                      src={w.thumb}
                      alt={w.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/*  책등 텍스트(비활성은 세로, 활성은 숨김) */}
                {!isActive && (
                  <div className="absolute inset-0 flex flex-col justify-start items-center gap-[10px] w-[30px] p-[10px] shrink-0 overflow-hidden">
                    <div className="flex w-[180px] h-[17px] max-w-[180px] flex-col justify-end pt-12">
                      <span className="body-2 text-white whitespace-nowrap rotate-90">
                        {w.title}
                      </span>
                    </div>
                  </div>
                )}

                {!isActive && i > activeIdx && (
                  <Image
                    src="/icons/library/rightGradient.svg"
                    alt=""
                    width={22}
                    height={200}
                    className="pointer-events-none absolute -left-5.5 top-0 h-full w-5.5"
                  />
                )}
                {!isActive && i < activeIdx && (
                  <div className="pointer-events-none absolute -right-5.5 top-0 h-full w-5.5">
                    <Image
                      src="/icons/library/leftGradient.svg"
                      alt=""
                      width={22}
                      height={200}
                      className=" "
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 활성 작품 정보(표지 밑) */}
      {active && (
        <div className="mt-1 flex flex-col items-center px-2">
          <p className="heading-3 text-black text-center">{active.title}</p>
          <p className="body-1 mt-2 text-gray-400 text-center">{active.meta}</p>
          <p className="caption-1 mt-3 w-14 h-6 inline-flex items-center gap-1 rounded-3xl border border-gray-200 px-2.5 py-1 text-[var(--color-magenta-300)] text-center">
            <Image
              src="/search/littleStar.svg"
              alt="star icon"
              width={14}
              height={14}
              className="inline-block mr-1"
              priority
            />
            {Number(active.rating).toFixed(1)}
          </p>
        </div>
      )}
    </div>
  )
}
