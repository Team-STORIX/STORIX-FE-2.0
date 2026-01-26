'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  title: string
  subtitle?: string
  count?: number
  onBack: () => void
  onReport: () => void
  onLeave: () => void
}

export default function TopicRoomTopBar({
  title,
  subtitle,
  count = 0,
  onBack,
  onReport,
  onLeave,
}: Props) {
  const [open, setOpen] = useState(false) //
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const el = wrapRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const handleReport = () => {
    setOpen(false) //
    onReport()
  }

  const handleLeave = () => {
    setOpen(false) //
    onLeave()
  }

  return (
    <div
      className="relative flex items-center justify-between px-4 py-3"
      ref={wrapRef}
    >
      <button type="button" onClick={onBack} className="h-6 w-6 cursor-pointer">
        <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
      </button>

      {/*   가운데: title / subtitle / 참여인원 */}
      <div className="flex flex-col items-start flex-1 min-w-0 px-3">
        <div className="flex items-center gap-1.5 pb-1 max-w-full">
          <span className="heading-2 max-w-[200px] truncate">{title}</span>{' '}
          <span className="body-2 text-gray-400">{count}</span>
        </div>
        {!!subtitle && (
          <span className="body-2 text-gray-400 max-w-full truncate">
            {subtitle}
          </span>
        )}{' '}
      </div>

      {/*   케밥 + 드롭다운(TopicRoomMenu 흡수) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-6 w-6 cursor-pointer flex items-center justify-center"
          onPointerDown={(e) => e.stopPropagation()} //   (드래그 캡처 클릭 씹힘 방지)
        >
          <Image
            src="/icons/menu-3dots.svg"
            alt="메뉴"
            width={24}
            height={24}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-10 z-50 w-[120px] rounded-xl border border-gray-100 bg-white shadow-md">
            <button
              type="button"
              className="w-full px-4 py-3 text-left body-2 text-gray-900 rounded-t-xl cursor-pointer transition-bg hover:bg-gray-50"
              onClick={handleReport}
              onPointerDown={(e) => e.stopPropagation()} //
            >
              신고하기
            </button>
            <div className="h-[1px] w-full bg-gray-100" />
            <button
              type="button"
              className="w-full px-4 py-3 text-left body-2 text-[var(--color-magenta-300)] rounded-b-xl cursor-pointer transition-bg hover:bg-gray-50"
              onClick={handleLeave}
              onPointerDown={(e) => e.stopPropagation()} //
            >
              나가기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
