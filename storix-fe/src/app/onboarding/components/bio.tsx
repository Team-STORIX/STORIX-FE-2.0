'use client'

import { useMemo, useRef, useState } from 'react'

interface BioProps {
  value: string
  onChange: (value: string) => void
}

const MAX = 30

export default function Bio({ value, onChange }: BioProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (next: string) => {
    if (next.length > MAX) next = next.slice(0, MAX)
    onChange(next)
  }

  const borderColor = isFocused ? 'var(--color-gray-900)' : 'var(--color-gray-300)'
  const textColor = value ? 'var(--color-gray-900)' : 'var(--color-gray-300)'

  return (
    <div>
      <h1 className="text-black text-2xl font-bold leading-[140%]">
        한 줄 소개를 작성해주세요
      </h1>
      <p className="text-gray-500 mt-[5px] text-[16px] font-medium leading-[140%]">
        내 취향을 마음껏 표현해보세요
      </p>

      {/* 텍스트 84px 아래 입력칸 */}
      <div className="mt-[84px] cursor-text" onClick={() => inputRef.current?.focus()}>
        <div
          className="flex items-center gap-[10px] w-[361px] pt-3 pb-3 pr-[10px] pl-2"
          style={{ borderBottom: `2px solid ${borderColor}` }}
        >
          <input
            ref={inputRef}
            value={value}
            placeholder="한줄소개를 입력해보세요 !"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1 bg-transparent outline-none body-1 cursor-text placeholder:text-[var(--color-gray-300)]"
            style={{ fontFamily: 'SUIT', color: textColor }}
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>

        <div className="mt-2 flex justify-end w-[361px] pr-2">
          <span
            className="caption-1"
            style={{ color: 'var(--color-magenta-300)', fontFamily: 'SUIT' }}
          >
            {value.length}/{MAX}자
          </span>
        </div>
      </div>
    </div>
  )
}
