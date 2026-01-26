// src/app/profile/fix/components/bio.tsx
'use client'

import { useMemo, useRef, useState, useEffect } from 'react'

export default function Bio() {
  const placeholder = '한줄소개를 입력해보세요 !'
  const STORAGE_KEY = 'profile_bio'

  const [value, setValue] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  //   초기 로드: 저장된 값 있으면 로드, 없으면 placeholder 모드(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved && saved.length > 0) setValue(saved)
    else setValue(null)
  }, [])

  const displayedText = value === null ? placeholder : value

  const count = useMemo(() => displayedText.length, [displayedText])

  const focusInput = () => inputRef.current?.focus()

  const handleFocus = () => {
    setIsFocused(true)
    if (value === null) {
      setValue('')
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(STORAGE_KEY, '')
      }
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (value !== null && value.trim().length === 0) {
      setValue(null)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  const handleChange = (next: string) => {
    if (next.length > 30) next = next.slice(0, 30)
    setValue(next)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, next)
    }
  }

  const borderColor = isFocused
    ? 'var(--color-gray-900)'
    : 'var(--color-gray-300)'

  const textColor =
    value === null ? 'var(--color-gray-300)' : 'var(--color-gray-900)'

  return (
    <div className="flex flex-col">
      <div
        className="body-2"
        style={{
          color: 'var(--color-gray-500)',
          fontFamily: 'Pretendard',
        }}
      >
        한 줄 소개
      </div>

      <div className="h-3" />

      <div className="cursor-text" onClick={focusInput}>
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
            style={{
              fontFamily: 'SUIT',
              color: textColor,
            }}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <div className="mt-2 flex justify-end w-[360px] pr-2">
          <div
            className="caption-1"
            style={{
              color: 'var(--color-magenta-300)',
              fontFamily: 'SUIT',
            }}
          >
            {count}/30자
          </div>
        </div>
      </div>
    </div>
  )
}
