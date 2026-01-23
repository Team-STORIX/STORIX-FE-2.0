'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onReport: () => void
  onLeave: () => void
}

export default function TopicRoomMenu({ onReport, onLeave }: Props) {
  const [open, setOpen] = useState(false) // ✅
  const ref = useRef<HTMLDivElement | null>(null) // ✅

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const handleReport = () => {
    setOpen(false) // ✅
    onReport()
  }

  const handleLeave = () => {
    setOpen(false) // ✅
    onLeave()
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 cursor-pointer flex items-center justify-center"
        aria-label="메뉴"
      >
        <Image src="/icons/menu-3dots.svg" alt="메뉴" width={20} height={20} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-9 w-[96px] rounded-xl border border-gray-100 bg-white shadow-md overflow-hidden"
          role="menu"
        >
          <button
            type="button"
            onClick={handleReport}
            className="w-full px-3 py-2 text-left body-2 text-gray-800 hover:bg-gray-50 cursor-pointer"
          >
            신고하기
          </button>
          <button
            type="button"
            onClick={handleLeave}
            className="w-full px-3 py-2 text-left body-2 text-[var(--color-magenta-300)] hover:bg-gray-50 cursor-pointer"
          >
            나가기
          </button>
        </div>
      )}
    </div>
  )
}
