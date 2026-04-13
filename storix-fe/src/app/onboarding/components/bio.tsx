// src/app/onboarding/components/bio.tsx
'use client'

import { useMemo, useRef, useState, useEffect } from 'react'

const STORAGE_KEY = 'signup_bio'
const MAX = 30

interface BioProps {
  onChange: (value: string) => void
}

export default function Bio({ onChange }: BioProps) {
  const placeholder = '한줄소개를 입력해보세요 !'

  // null = placeholder 모드, string = 입력 모드
  const [inner, setInner] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // 초기 로드: sessionStorage에 저장된 값 복원
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved && saved.length > 0) {
      setInner(saved)
      onChange(saved)
    } else {
      setInner(null)
    }
  }, [])

  const displayedText = inner === null ? placeholder : inner
  const count = useMemo(() => (inner ?? '').length, [inner])

  const focusInput = () => inputRef.current?.focus()

  const handleFocus = () => {
    setIsFocused(true)
    if (inner === null) {
      setInner('')
      if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, '')
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (inner !== null && inner.trim().length === 0) {
      setInner(null)
      if (typeof window !== 'undefined') sessionStorage.removeItem(STORAGE_KEY)
      onChange('')
    }
  }

  const handleChange = (next: string) => {
    if (next.length > MAX) next = next.slice(0, MAX)
    setInner(next)
    if (typeof window !== 'undefined') sessionStorage.setItem(STORAGE_KEY, next)
    onChange(next)
  }

  const borderColor = isFocused
    ? 'var(--color-gray-900)'
    : 'var(--color-gray-300)'

  const textColor =
    inner === null ? 'var(--color-gray-300)' : 'var(--color-gray-900)'

  return (
    <div>
      <h1 className="heading-1 text-black">한 줄 소개를 작성해주세요</h1>
      <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
        내 취향을 마음껏 표현해보세요
      </p>

      {/* 입력 영역: 부제목 84px 아래 */}
      <div className="mt-[84px] cursor-text" onClick={focusInput}>
        <div
          className="flex items-center gap-[10px] w-[360px] pt-3 pb-3 pr-[10px] pl-2"
          style={{ borderBottom: `2px solid ${borderColor}` }}
        >
          <input
            ref={inputRef}
            value={displayedText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 bg-transparent outline-none body-1 cursor-text"
            style={{ fontFamily: 'SUIT', color: textColor }}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <div className="mt-2 flex justify-end w-[360px] pr-2">
          <div
            className="caption-1"
            style={{ color: 'var(--color-magenta-300)', fontFamily: 'SUIT' }}
          >
            {count}/{MAX}자
          </div>
        </div>
      </div>
    </div>
  )
}
