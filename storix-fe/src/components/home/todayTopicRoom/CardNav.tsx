// src/components/home/todayTopicRoom/CardNav.tsx
'use client'

import Link from 'next/link'
import ForwardArrowIcon from '@/public/icons/layout/FowardArrowIcon'

interface CardNavProps {
  header?: string
  roomName?: string
}

export const CardNav = ({ header, roomName }: CardNavProps) => {
  return (
    <div className="flex w-full items-center justify-between py-4 px-1">
      <div className="flex items-center justify-center">
        <p className="heading-1">{header}</p>
      </div>

      {/* 오른쪽 아이콘 그룹 */}
      <div className="flex items-center gap-4">
        <Link
          href={`/home/${roomName}`}
          aria-label="이동"
          className="flex h-6 w-6 items-center justify-center"
        >
          <ForwardArrowIcon />
        </Link>
      </div>
    </div>
  )
}
