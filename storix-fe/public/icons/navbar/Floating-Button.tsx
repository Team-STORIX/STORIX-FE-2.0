// public/icons/navbar/Floating-Button.tsx

import { useState } from 'react'
import Image from 'next/image'

export default function FloatingNav() {
  const [isPlusOpen, setIsPlusOpen] = useState(false)

  const handlePlusClick = () => {
    setIsPlusOpen((prev) => !prev)
  }
  return (
    <button
      type="button"
      onClick={handlePlusClick}
      className={[
        'absolute left-1/2 -translate-x-1/2 bottom-18',
        'w-14 h-14',
        'transition-transform duration-200 ease-in-out',
        'hover:opacity-70',
        isPlusOpen ? 'rotate-90' : 'rotate-0',
      ].join(' ')}
      aria-label="추가"
      aria-expanded={isPlusOpen}
    >
      <Image
        src="/common/icons/plus.svg"
        alt="플러스"
        width={56}
        height={56}
        className="w-[56px] h-[56px]"
        priority
      />
    </button>
  )
}
