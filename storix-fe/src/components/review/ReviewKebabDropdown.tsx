// src/app/components/review/ReviewKebabDropdown.tsx
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

type Props = {
  onEdit: () => void
  onDelete: () => void
}

export default function ReviewKebabDropdown({ onEdit, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current) return
      if (!menuRef.current.contains(target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isOpen])

  const handleEdit = () => {
    setIsOpen(false)
    onEdit()
  }

  const handleDelete = () => {
    setIsOpen(false)
    onDelete()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="cursor-pointer p-1"
        aria-label="메뉴"
      >
        <Image src="/icons/menu-3dots.svg" alt="메뉴" width={24} height={24} />
      </button>

      {/* 상단 케밥 드롭다운 */}
      {isOpen && (
        <div className="absolute right-0 top-10 z-20 w-[120px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
          <button
            type="button"
            className="w-full px-4 py-3 text-left body-2 hover:bg-gray-50 cursor-pointer"
            onClick={handleEdit}
          >
            리뷰 수정
          </button>
          <button
            type="button"
            className="w-full px-4 py-3 text-left body-2 hover:bg-gray-50 cursor-pointer"
            onClick={handleDelete}
          >
            리뷰 삭제
          </button>
        </div>
      )}
    </div>
  )
}
