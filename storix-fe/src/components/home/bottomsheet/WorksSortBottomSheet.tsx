'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { WorksSort } from '@/lib/api/search/search.schema'

const SORT_OPTIONS: Array<{ value: WorksSort; label: string }> = [
  { value: 'NAME', label: '기본순' },
  { value: 'RATING', label: '별점순' },
  { value: 'REVIEW', label: '리뷰순' },
]

export default function WorksSortBottomSheet({
  currentSort,
  onApply,
  onClose,
}: {
  currentSort: WorksSort
  onApply: (sort: WorksSort) => void
  onClose: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftSort, setDraftSort] = useState<WorksSort>(currentSort)

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
          'w-full max-w-[393px] rounded-t-[24px] bg-white px-6 pt-10 pb-6',
          'transform transition-transform duration-200 ease-out will-change-transform',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="heading-2 text-black">정렬</h2>
          <button type="button" onClick={handleClose} className="cursor-pointer">
            <Image
              src="/common/icons/cancel.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="-mx-6 mt-8 h-px bg-gray-100" />

        <div className="py-6">
          {SORT_OPTIONS.map((option) => {
            const checked = draftSort === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setDraftSort(option.value)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="body-1 text-black">{option.label}</span>
                {checked ? (
                  <Image
                    src="/common/icons/check-pink.svg"
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
            onClick={() => setDraftSort('NAME')}
            className="h-14 min-w-[110px] rounded-2xl bg-[var(--color-gray-50)] px-6 body-1 text-black"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-14 flex-1 rounded-2xl bg-black body-1 text-white"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  )
}
