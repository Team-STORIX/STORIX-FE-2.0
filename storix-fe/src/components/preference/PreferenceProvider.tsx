// src/components/preference/PreferenceProvider.tsx
'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type PreferenceWork = {
  id: number
  title: string
  meta: string // 작가/장르/플랫폼 등 한 줄
  ratingText?: string // "평점 +4.5" 같은 텍스트
  imageSrc: string
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

const STORAGE_KEY = 'storix_preference_state_v1'

const PreferenceContext = createContext<PreferenceContextValue | null>(null)

const DUMMY_WORKS: PreferenceWork[] = [
  {
    id: 1,
    title: '상수리나무 아래',
    meta: 'P.서말 · 나무김수지 · 웹툰',
    ratingText: '평점 +4.5',
    imageSrc: '/image/sample/topicroom-1.webp',
  },
  {
    id: 2,
    title: '재혼황후',
    meta: '히어리 · 숨풀 · 웹툰',
    ratingText: '평점 +4.5',
    imageSrc: '/image/sample/topicroom-2.webp',
  },
  {
    id: 3,
    title: '전지적 독자 시점',
    meta: 'UMI · 슬리피-C · 웹툰',
    ratingText: '평점 +4.5',
    imageSrc: '/image/sample/topicroom-3.webp',
  },
  {
    id: 4,
    title: '연의 편지',
    meta: '조현아 · 웹툰',
    ratingText: '평점 +4.5',
    imageSrc: '/image/sample/topicroom-4.webp',
  },
  {
    id: 5,
    title: '친애하는 X',
    meta: '반지은 · 웹툰',
    ratingText: '평점 +4.5',
    imageSrc: '/image/sample/topicroom-5.webp',
  },
]

function buildInitialState(works: PreferenceWork[]): PreferenceState {
  const s: PreferenceState = {}
  for (const w of works) s[w.id] = null
  return s
}

export default function PreferenceProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const works = DUMMY_WORKS

  const [state, setState] = useState<PreferenceState>(() =>
    buildInitialState(works),
  )

  // localStorage hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as PreferenceState

      // id 정합성/누락 보정
      const next = buildInitialState(works)
      for (const w of works) {
        const v = parsed[w.id]
        next[w.id] = v === 'like' || v === 'dislike' ? v : null
      }
      setState(next)
    } catch {
      // ignore
    }
  }, [works])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore
    }
  }, [state])

  const currentIndex = useMemo(() => {
    return works.findIndex((w) => state[w.id] == null)
  }, [state, works])

  const currentWork = currentIndex >= 0 ? works[currentIndex] : null

  const isDone = currentWork == null

  const likedWorks = useMemo(
    () => works.filter((w) => state[w.id] === 'like'),
    [works, state],
  )
  const dislikedWorks = useMemo(
    () => works.filter((w) => state[w.id] === 'dislike'),
    [works, state],
  )

  const like = () => {
    if (!currentWork) return
    setState((prev) => ({ ...prev, [currentWork.id]: 'like' }))
  }

  const dislike = () => {
    if (!currentWork) return
    setState((prev) => ({ ...prev, [currentWork.id]: 'dislike' }))
  }

  const reset = () => {
    setState(buildInitialState(works))
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
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
    </PreferenceContext.Provider>
  )
}

export function usePreference() {
  const ctx = useContext(PreferenceContext)
  if (!ctx)
    throw new Error('usePreference must be used within PreferenceProvider')
  return ctx
}
