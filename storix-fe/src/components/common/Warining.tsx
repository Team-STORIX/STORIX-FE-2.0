// src/components/common/Warining.tsx
'use client'

import Image from 'next/image'

type WarningProps = {
  title: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  className?: string
}

export default function Warning({
  title,
  description,
  buttonText,
  onButtonClick,
  className = '',
}: WarningProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 mt-37 px-4 py-10 ${className}`}
    >
      <Image
        src="/common/icons/warningLarge.svg"
        alt="경고"
        width={120}
        height={120}
        priority
      />

      <div className="flex flex-col items-center mt-2.5 gap-1">
        <p className="heading-2 text-black">{title}</p>
        {description ? (
          <p className="body-2 text-gray-500">{description}</p>
        ) : null}
      </div>
      {/* 버튼 (옵션) */}
      {buttonText ? (
        <button
          type="button"
          onClick={onButtonClick}
          className={[
            'inline-flex items-center justify-center',
            'rounded-sm',
            'border border-magenta-100 bg-[var(--color-magenta-20)]',
            'px-2 py-1.5',
            'body-2 text-[var(--color-magenta-300)]',
            'active:scale-[0.98] transition-transform cursor-pointer',
          ].join(' ')}
        >
          {buttonText}
        </button>
      ) : null}
    </div>
  )
}
