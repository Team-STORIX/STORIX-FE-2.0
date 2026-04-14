// src/components/home/bottomsheet/WorksFilterBottomSheet.tsx
'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Option = {
  value: string
  label: string
}

type Props = {
  title: string
  currentValue: string | string[]
  resetValue: string | string[]
  options: Option[]
  onApply: (value: string | string[]) => void
  onClose: () => void
  multiple?: boolean
}

const CLOSE_TEXT = '닫기'
const RESET_TEXT = '초기화'
const APPLY_TEXT = '적용하기'

const toArray = (value: string | string[]) =>
  Array.isArray(value) ? value : [value]

export default function WorksFilterBottomSheet({
  title,
  currentValue,
  resetValue,
  options,
  onApply,
  onClose,
  multiple = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftValues, setDraftValues] = useState<string[]>(
    toArray(currentValue),
  )

  useEffect(() => {
    setDraftValues(toArray(currentValue))
  }, [currentValue])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    window.setTimeout(onClose, 250)
  }

  const toggleValue = (value: string) => {
    if (!multiple) {
      setDraftValues([value])
      return
    }

    setDraftValues((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    )
  }

  const handleReset = () => {
    setDraftValues(toArray(resetValue))
  }

  const handleApply = () => {
    onApply(multiple ? draftValues : (draftValues[0] ?? resetValue))
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
          <h2 className="heading-2 text-black">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="cursor-pointer"
          >
            <Image
              src="/common/icons/cancel.svg"
              alt={CLOSE_TEXT}
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="-mx-4 mt-6 h-px shrink-0 bg-gray-100" />

        <div className="min-h-0 flex-1 overflow-y-auto py-7 flex flex-col gap-5">
          {options.map((option) => {
            const checked = draftValues.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleValue(option.value)}
                className="flex w-full items-center text-left"
              >
                <span className="pl-1 pr-3">
                  {checked ? (
                    <Image
                      src="/common/icons/check-pink.svg"
                      alt="selected"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <Image
                      src="/common/icons/check-gray.svg"
                      alt="selected"
                      width={24}
                      height={24}
                    />
                  )}
                </span>
                <span className="body-1-medium text-black">{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="h-14 min-w-27.5 rounded-lg bg-[var(--color-gray-100)] px-6 body-1-bold text-black"
          >
            {RESET_TEXT}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-14 flex-1 rounded-lg bg-black body-1-bold text-white"
          >
            {APPLY_TEXT}
          </button>
        </div>
      </div>
    </div>
  )
}
