// src/components/preference/PreferenceProvider.tsx
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  usePreferenceAnalyze,
  usePreferenceExploration,
  usePreferenceResults,
} from '@/hooks/preference/usePreference'
import type {
  PreferenceExplorationWorkSchema,
  PreferenceResultWork,
} from '@/lib/api/preference'
import { z } from 'zod'
import axios from 'axios'

export type PreferenceWork = {
  id: number
  title: string
  imageSrc: string
  genre: string
  description: string
  hashtags: string[]
  meta?: string
  ratingText?: string
}

type Choice = 'like' | 'dislike'
type PreferenceState = Record<number, Choice | null>

type PreferenceContextValue = {
  works: PreferenceWork[]
  state: PreferenceState
  currentIndex: number
  currentWork: PreferenceWork | null
  like: () => void
  dislike: () => void
  reset: () => void
  likedWorks: PreferenceWork[]
  dislikedWorks: PreferenceWork[]
  isDone: boolean
}

const PreferenceContext = createContext<PreferenceContextValue | null>(null)
const STORAGE_KEY = 'storix.preference.progress.v1'

function buildInitialState(works: PreferenceWork[]): PreferenceState {
  const s: PreferenceState = {}
  for (const w of works) s[w.id] = null
  return s
}

// 썸네일 없을 때 샘플 이미지 fallback
const fallbackImage = (worksId: number) => {
  const idx = ((worksId % 5) + 5) % 5
  return `/image/sample/topicroom-${idx + 1}.webp`
}

const mapExplorationToWork = (
  w: z.infer<typeof PreferenceExplorationWorkSchema>,
): PreferenceWork => ({
  id: w.worksId,
  title: w.worksName ?? '',
  imageSrc: w.thumbnailUrl ?? fallbackImage(w.worksId),
  genre: w.genre ?? '',
  description: w.description ?? '',
  hashtags: Array.isArray(w.hashtags) ? w.hashtags : [],
  meta: `${w.artistName} · ${w.platform} · ${w.genre}`,
})

const mapResultToWork = (w: PreferenceResultWork): PreferenceWork => {
  const authorLine = [w.author, w.illustrator, w.worksType].filter(Boolean)
  return {
    id: w.worksId,
    title: w.worksName,
    imageSrc: w.thumbnailUrl ?? fallbackImage(w.worksId),
    genre: w.genre ?? '',
    description: '',
    hashtags: [],
    meta: `${authorLine.join(' · ')} · ${w.genre}`,
  }
}

export default function PreferenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const explorationQuery = usePreferenceExploration()
  const resultsQuery = usePreferenceResults(true)
  const analyzeMutation = usePreferenceAnalyze()

  // 토스트(하루 1회 제한 안내)
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef<number | null>(null)
  const limitedToastShownRef = useRef(false)

  const showToast = (msg: string) => {
    const cleaned = msg.replace(/정상적인 요청입니다.\.?\s*/g, '').trim()

    if (!cleaned) return
    setToastMessage(cleaned || msg.trim())
    setToastOpen(true)
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => {
      setToastOpen(false)
      toastTimerRef.current = null
    }, 2000)
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
  }, [])

  const works = useMemo<PreferenceWork[]>(() => {
    const raw = explorationQuery.data?.result ?? []
    return raw.map(mapExplorationToWork)
  }, [explorationQuery.data])

  // "하루 1번 제한" = 탐색 목록이 빈 배열로 내려오는 케이스 → 토스트 1회
  useEffect(() => {
    if (!explorationQuery.isSuccess) return
    if (limitedToastShownRef.current) return
    const list = explorationQuery.data?.result ?? []
    if (Array.isArray(list) && list.length === 0) {
      limitedToastShownRef.current = true
      showToast(
        explorationQuery.data?.message?.trim() ||
          '오늘은 이미 취향 탐색을 완료했어요. 내일 다시 시도해 주세요.',
      )
    }
  }, [explorationQuery.isSuccess, explorationQuery.data])

  const savedStateRef = useRef<PreferenceState | null>(null)

  const [state, setState] = useState<PreferenceState>(() =>
    buildInitialState([]),
  )

  const didInitRef = useRef(false)

  useEffect(() => {
    // 최초 1회 저장값 읽기(리마운트/리로드 대비)
    if (savedStateRef.current) return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      savedStateRef.current = JSON.parse(raw) as PreferenceState
    } catch {
      savedStateRef.current = null
    }
  }, [])

  useEffect(() => {
    // works가 처음 채워질 때만 초기화 + 저장된 진행상태 merge
    if (didInitRef.current) return
    if (!works || works.length === 0) return

    const saved = savedStateRef.current
    const next = buildInitialState(works)

    if (saved) {
      for (const w of works) {
        const v = saved[w.id]
        next[w.id] = v === 'like' || v === 'dislike' ? v : null
      }
    }

    setState(next)
    didInitRef.current = true
  }, [works])

  useEffect(() => {
    //: 진행상태 persist (리마운트돼도 복구 가능)
    if (!didInitRef.current) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const currentIndex = useMemo(() => {
    return works.findIndex((w) => state[w.id] == null)
  }, [state, works])

  const currentWork = currentIndex >= 0 ? works[currentIndex] : null
  const isDone = currentWork == null

  // 결과 API 있으면 결과 기준으로 리스트 구성(제한 걸린 날에도 리스트 보여줄 수 있음)
  const likedWorksFromResult = useMemo(() => {
    const r = resultsQuery.data?.result
    if (!r) return null
    return r.likedWorks.map(mapResultToWork)
  }, [resultsQuery.data])

  const dislikedWorksFromResult = useMemo(() => {
    const r = resultsQuery.data?.result
    if (!r) return null
    return r.dislikedWorks.map(mapResultToWork)
  }, [resultsQuery.data])

  const likedWorksLocal = useMemo(
    () => works.filter((w) => state[w.id] === 'like'),
    [works, state],
  )
  const dislikedWorksLocal = useMemo(
    () => works.filter((w) => state[w.id] === 'dislike'),
    [works, state],
  )

  const likedWorks = likedWorksFromResult ?? likedWorksLocal
  const dislikedWorks = dislikedWorksFromResult ?? dislikedWorksLocal

  const submitChoice = async (choice: Choice) => {
    if (!currentWork) return
    if (analyzeMutation.isPending) return

    const worksId = currentWork.id

    // 진행은 로컬 state 기준으로 즉시 확정 (서버 실패해도 첫 작품으로 되돌리지 않음)
    setState((prev) => ({ ...prev, [worksId]: choice }))

    try {
      await analyzeMutation.mutateAsync({
        worksId,
        isLiked: choice === 'like',
      })
    } catch (e) {
      // 서버 동기화 실패 시에도 진행은 유지하고 토스트만 표시
      const serverMsg =
        (e as any)?.response?.data?.message ??
        (e as any)?.message ??
        '요청 처리 중 오류가 발생했어요.'
    }
  }

  const like = () => submitChoice('like')
  const dislike = () => submitChoice('dislike')

  const reset = () => {
    setState(buildInitialState(works))
  }

  const value: PreferenceContextValue = {
    works,
    state,
    currentIndex,
    currentWork,
    like,
    dislike,
    reset,
    likedWorks,
    dislikedWorks,
    isDone,
  }

  return (
    <PreferenceContext.Provider value={value}>
      {children}

      {toastOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center px-4"
          role="status"
          aria-live="polite"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="relative flex items-center gap-2 px-4 h-[56px] rounded-[12px] shadow-md"
            style={{
              width: 333,
              backgroundColor: 'var(--color-gray-900)',
              color: 'var(--color-white)',
            }}
          >
            <span className="body-2">{toastMessage}</span>
          </div>
        </div>
      )}
    </PreferenceContext.Provider>
  )
}

export function usePreference() {
  const ctx = useContext(PreferenceContext)
  if (!ctx)
    throw new Error('usePreference must be used within PreferenceProvider')
  return ctx
}
