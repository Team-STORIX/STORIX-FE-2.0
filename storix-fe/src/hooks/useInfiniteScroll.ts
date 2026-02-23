// src/hooks/useInfiniteScroll.ts
'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

type Params = {
  root?: RefObject<Element | null>
  target: RefObject<Element | null>

  hasNextPage: boolean
  isFetchingNextPage: boolean

  onLoadMore: () => void | Promise<void>

  rootMargin?: string
  throttleMs?: number
  enabled?: boolean
}

export function useInfiniteScroll({
  root,
  target,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  rootMargin = '200px',
  throttleMs = 400,
  enabled = true,
}: Params) {
  const lockRef = useRef(false)
  const lastFireAtRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  // ✅ 최신 콜백만 유지 (observer 재생성 방지)
  const onLoadMoreRef = useRef(onLoadMore)
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore
  }, [onLoadMore])

  useEffect(() => {
    if (!enabled) return

    const targetEl = target.current
    if (!targetEl) return

    const rootEl = root?.current ?? null

    const obs = new IntersectionObserver(
      async (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (!hit) return
        if (!hasNextPage) return
        if (isFetchingNextPage) return

        const now = Date.now()
        if (lockRef.current) return
        if (now - lastFireAtRef.current < throttleMs) return

        lockRef.current = true
        lastFireAtRef.current = now

        try {
          await onLoadMoreRef.current()
        } finally {
          if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
          timeoutRef.current = window.setTimeout(() => {
            lockRef.current = false
            timeoutRef.current = null
          }, throttleMs)
        }
      },
      { root: rootEl, rootMargin, threshold: 0 },
    )

    obs.observe(targetEl)

    return () => {
      obs.disconnect()
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      lockRef.current = false
    }
  }, [
    enabled,
    hasNextPage,
    isFetchingNextPage,
    rootMargin,
    throttleMs,
    root,
    target,
  ])
}
