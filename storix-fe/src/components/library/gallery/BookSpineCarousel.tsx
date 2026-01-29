// src/components/library/gallery/BookSpineCarousel.tsx
'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type Work = {
  id: number
  title: string
  meta: string
  thumb: string
  rating?: number
}

type BookSpineCarouselProps = {
  works: Work[]
  /** 다음 페이지가 남아있는지 (UI 영향 없음) */
  hasMore?: boolean
  /** 다음 페이지를 불러오는 중인지 (UI 영향 없음) */
  isFetchingMore?: boolean
  /** 끝쪽에 도달했을 때 다음 페이지를 요청하는 콜백 (UI 영향 없음) */
  onNeedMore?: () => void
}

export default function BookSpineCarousel({
  works,
  hasMore,
  isFetchingMore,
  onNeedMore,
}: BookSpineCarouselProps) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const returnTo = encodeURIComponent(
    `${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`,
  )
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rafRef = useRef<number | null>(null)

  const [activeIdx, setActiveIdx] = useState(0)

  //   (API 연동) list처럼 페이지네이션으로 계속 불러올 수 있게
  // 캐러셀에서 활성 인덱스가 끝쪽에 가까워지면 다음 페이지를 요청 (UI는 그대로)
  useEffect(() => {
    if (!hasMore) return
    if (isFetchingMore) return
    if (!onNeedMore) return

    // 끝에서 3개 전부터 미리 요청
    if (activeIdx >= Math.max(0, works.length - 3)) {
      onNeedMore()
    }
  }, [activeIdx, works.length, hasMore, isFetchingMore, onNeedMore])

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

    const delta = eRect.left + eRect.width / 2 - (sRect.left + sRect.width / 2)

    scroller.scrollTo({
      left: scroller.scrollLeft + delta,
      behavior: 'smooth',
    })

    setActiveIdx(idx)
  }

  const handleBookClick = (idx: number) => {
    const work = works[idx]
    if (!work) return
    // 이미 활성인 책을 다시 누르면 상세로 이동
    if (idx === activeIdx) {
      router.push(`/library/works/${work.id}?returnTo=${returnTo}`) // 라우팅
      return
    }

    // 비활성 책은 기존대로 활성화만
    scrollToIndex(idx)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const handler = (e: WheelEvent) => {
      // 세로 스크롤을 가로 스크롤로 변환
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        el.scrollLeft += e.deltaY
        scheduleMeasure()
      }
    }

    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drag = useRef({ down: false, x: 0, left: 0 })

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return

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
      <div
        ref={scrollerRef}
        onScroll={scheduleMeasure}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        style={{ touchAction: 'pan-x' }}
      >
        <div className="flex items-center gap-5.5 pl-35 pr-155 py-7">
          {works.map((w, i) => {
            const isActive = i === activeIdx

            return (
              <button
                key={w.id}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleBookClick(i)}
                className={[
                  'relative shrink-0 snap-center rounded-r-sm bg-[var(--color-magenta-300)]',
                  'transition-all duration-250 ease-out',
                  'hover:opacity-90 cursor-pointer',
                  isActive ? 'rounded-sm' : '',
                ].join(' ')}
                style={{
                  width: isActive ? 150 : 30,
                  height: 200,
                }}
                aria-label={w.title}
              >
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

                {!isActive && (
                  <div className="absolute inset-0 flex items-center justify-center px-1">
                    <span
                      title={w.title}
                      className="caption-1 text-white overflow-hidden text-ellipsis whitespace-nowrap text-center "
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        maxHeight: 176,
                      }}
                    >
                      {w.title}
                    </span>
                  </div>
                )}

                {!isActive && i > activeIdx && (
                  <Image
                    src="/icons/library/rightGradient.svg"
                    alt=""
                    width={22}
                    height={200}
                    className="pointer-events-none absolute -left-5.5 top-0 h-full w-5.5 "
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

      {active && (
        <div className="flex flex-col items-center px-4">
          <p className="heading-3 text-black text-center mb-2">
            {active.title}
          </p>
          <p className="body-1 text-gray-400 text-center mb-3">{active.meta}</p>

          {typeof active.rating === 'number' && (
            <span
              className={`caption-1 w-14 h-6 inline-flex items-center gap-1 
            rounded-3xl border border-gray-200 
            px-2.5 py-1 text-[var(--color-magenta-300)] text-center`}
            >
              <Image
                src="/search/littleStar.svg"
                alt="star icon"
                width={14}
                height={14}
                className="inline-block mr-1"
                priority
              />
              {Number(active.rating ?? 0).toFixed(1)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
