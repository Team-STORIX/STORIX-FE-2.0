//src/components/library/works/WorkTopBar.tsx
'use client'

import Image from 'next/image'

type Props = {
  onBack: () => void
  isLiked: boolean
  onToggleLike: () => void
}

export default function WorkTopBar({ onBack, isLiked, onToggleLike }: Props) {
  return (
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white px-4">
      <button
        type="button"
        onClick={onBack}
        className="flex h-8 w-8 items-center justify-center cursor-pointer"
        aria-label="뒤로가기"
      >
        <Image src="/icons/back.svg" alt="back" width={24} height={24} />
      </button>

      <button
        type="button"
        onClick={onToggleLike}
        className="flex items-center gap-1 cursor-pointer"
        aria-label="관심"
      >
        <Image
          src={
            isLiked
              ? '/icons/icon-add-active.svg'
              : '/icons/icon-add-deactive.svg'
          }
          alt="like"
          width={20}
          height={20}
        />
        <span className="caption-1 text-gray-500">관심</span>
      </button>
    </div>
  )
}
