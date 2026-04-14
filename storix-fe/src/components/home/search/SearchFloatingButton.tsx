// src/components/home/search/SearchFloatingButton.tsx
'use client'

import Image from 'next/image'
import ForwardArrowIcon from '@/public/common/icons/FowardArrowIcon'

type Props = {
  onClick: () => void
}

export default function SearchFloatingButton({ onClick }: Props) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto flex h-10 items-center justify-between rounded-full bg-[var(--color-magenta-300)] px-5 text-white shadow-[0_12px_32px_rgba(255,64,147,0.32)]"
      >
        <span className="flex items-center gap-2">
          <Image
            src="/common/icons/fire.svg"
            alt="fire"
            width={20}
            height={20}
          />
          <span className="body-2-medium flex-shrink-0">
            찾는 작품이 없다면?
          </span>
        </span>

        <ForwardArrowIcon />
      </button>
    </div>
  )
}
