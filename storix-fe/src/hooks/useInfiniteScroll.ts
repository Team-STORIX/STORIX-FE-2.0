'use client'

import { useEffect, useRef } from 'react'

type Params = {
  /** 스크롤 컨테이너. 없으면 viewport(window) 기준 */
  root?: React.RefObject<Element | null>
  /** 관측할 sentinel */
  target: React.RefObject<Element | null>

  /** 다음 페이지가 있냐 (ex. !last) */
  hasNextPage: boolean
  /** 지금 로딩 중이냐 */
  isLoading: boolean

  /** 더 불러오기 액션 */
  onLoadMore: () => void | Promise<void>

  /** 미리 당겨서 로드 */
  rootMargin?: string
  /** 한번 intersect 후 다음 intersect 허용까지의 최소 간격(ms) */
  throttleMs?: number
}

export function useInfiniteScroll({
  root,
  target,
  hasNextPage,
  isLoading,
  onLoadMore,
  rootMargin = '200px',
  throttleMs = 400,
}: Params) {
  const lockRef = useRef(false)
  const lastFireAtRef = useRef(0)

  useEffect(() => {
    const targetEl = target.current
    if (!targetEl) return
    if (!hasNextPage) return

    const rootEl = root?.current ?? null

    const obs = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        if (!hasNextPage) return
        if (isLoading) return

        // ✅ 바닥에 계속 붙어있을 때 요청 폭주 방지
        const now = Date.now()
        if (lockRef.current) return
        if (now - lastFireAtRef.current < throttleMs) return

        lockRef.current = true
        lastFireAtRef.current = now

        try {
          await onLoadMore()
        } finally {
          // 다음 tick에서 락 해제 (연속 intersect 대비)
          setTimeout(() => {
            lockRef.current = false
          }, throttleMs)
        }
      },
      {
        root: rootEl,
        rootMargin,
        threshold: 0,
      },
    )

    obs.observe(targetEl)
    return () => obs.disconnect()
  }, [root, target, hasNextPage, isLoading, onLoadMore, rootMargin, throttleMs])
}
