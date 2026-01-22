// src/components/common/Warining.tsx
'use client'

import Image from 'next/image'

type WarningProps = {
  title: string
  description?: string
  className?: string
}

export default function Warning({
  title,
  description,
  className = '',
}: WarningProps) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 px-4 py-10 ${className}`}
    >
      <Image
        src="/common/icons/warningLarge.svg"
        alt="경고"
        width={120}
        height={120}
        priority
      />

      <div className="flex flex-col items-center gap-[10px]">
        <p className="heading-2 text-black">{title}</p>
        {description ? (
          <p className="body-2 text-gray-500">{description}</p>
        ) : null}
      </div>
    </div>
  )
}
