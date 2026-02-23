// src/components/home/todayTopicRoom/CardNav.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'

interface CardNavProps {
  header?: string
  roomName?: string
  onNavigate?: () => void | Promise<void>
}

export const CardNav = ({ header, roomName, onNavigate }: CardNavProps) => {
  const href = roomName ?? '#'

  return (
    <div className="flex w-full items-center justify-between py-4 px-1">
      <div className="flex items-center justify-center">
        <p className="heading-1">{header}</p>
      </div>

      {/* 오른쪽 아이콘 그룹 */}
      <div className="flex items-center gap-4">
        <Link
          href={href}
          aria-label="이동"
          className="flex h-6 w-6 items-center justify-center"
          onClick={(e) => {
            if (!onNavigate) return
            e.preventDefault()
            onNavigate()
          }}
        >
          <Image
            src="/icons/icon-arrow-forward.svg"
            alt="forward arrow"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  )
}
