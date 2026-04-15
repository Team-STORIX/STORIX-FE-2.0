// src/components/home/bottomsheet/WorksSortBottomSheet.tsx
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const DEFAULT_SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'NAME', label: '기본순' },
  { value: 'RATING', label: '별점순' },
  { value: 'REVIEW', label: '리뷰순' },
]

export default function WorksSortBottomSheet({
  currentSort,
  resetValue = 'NAME',
  options = DEFAULT_SORT_OPTIONS,
  onApply,
  onClose,
}: {
  currentSort: string
  resetValue?: string
  options?: Array<{ value: string; label: string }>
  onApply: (sort: string) => void
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftSort, setDraftSort] = useState<string>(currentSort)

  useEffect(() => {
    setDraftSort(currentSort)
  }, [currentSort])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    window.setTimeout(onClose, 250)
  }

  const handleApply = () => {
    onApply(draftSort)
    handleClose()
  }

  return (
    <div
      className={[
        'fixed inset-0 z-[100] flex items-end justify-center',
        'transition-opacity duration-300',
        isOpen ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0',
      ].join(' ')}
      onClick={handleClose}
    >
      <div
        className={[
          'flex w-full max-w-98.25 max-h-145 flex-col overflow-hidden rounded-t-[1.25rem] bg-white px-4 pt-7 pb-9',
          'transform transition-transform duration-200 ease-out will-change-transform',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="heading-2 text-black">정렬</h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer"
          >
            <Image
              src="/common/icons/cancel.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="-mx-4 mt-6 h-px bg-gray-100" />

        <div className="flex flex-col gap-5 py-7">
          {options.map((option) => {
            const checked = draftSort === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDraftSort(option.value)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="body-1 text-black">{option.label}</span>
                {checked ? (
                  <Image
                    src="/home/search/icon-check.svg"
                    alt="selected"
                    width={24}
                    height={24}
                  />
                ) : (
                  <span className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDraftSort(resetValue)}
            className="h-14 min-w-27.5 rounded-lg bg-[var(--color-gray-50)] px-6 body-1-bold text-black"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-14 flex-1 rounded-lg bg-black body-1-bold text-white"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  )
}
