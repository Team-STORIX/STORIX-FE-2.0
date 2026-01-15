// src/components/home/bottomsheet/WriteBottomSheet.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CheckBox from '@/public/common/icons/CheckBox'

type Work = {
  id: number
  title: string
  meta: string
  thumb: string
}

export default function WriteBottomSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)

  // 바텀시트 열기/닫기 상태
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    // 첫 렌더 후 프레임에 열기 → 아래에서 올라오는 모션
    requestAnimationFrame(() => setIsOpen(true))
  }, [])

  const handleClose = () => {
    // 닫기 모션 먼저
    setIsOpen(false)
    // 모션 끝나면 실제 unmount
    setTimeout(onClose, 250)
  }

  const works: Work[] = [
    {
      id: 1,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-1.webp',
    },
    {
      id: 6056,
      title: '연의 편지',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-2.webp',
    },
    {
      id: 3,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-3.webp',
    },
    {
      id: 4,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-4.webp',
    },
  ]

  const goWritePage = () => {
    if (!selected) return
    handleClose()
    router.push(`/feed/write/${selected}`) // ✅ id만 넘김 (쿼리 없음)
  }

  return (
    <div
      className={[
        'fixed inset-0 z-[100] flex items-end justify-center',
        'transition-opacity duration-300',
        isOpen ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0',
      ].join(' ')}
      onClick={handleClose} // 바깥(오버레이) 클릭 시 닫기
    >
      <div
        className={[
          'w-full max-w-[393px] rounded-t-2xl bg-white px-4',
          'h-[80%]',
          'flex flex-col',
          'transform transition-transform duration-200 ease-out will-change-transform',
          isOpen ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()} // 시트 클릭은 닫기 방지
      >
        <div className="flex items-center justify-between py-7">
          <span className="heading-2">작품선택</span>
          <button onClick={onClose} className="cursor-pointer">
            <Image
              src="/common/icons/cancel.svg"
              alt="닫기"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="함께 이야기하고 싶은 작품을 검색하세요"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-body-2"
          />
          <Image
            src="/common/icons/search.svg"
            alt="검색"
            width={20}
            height={20}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          />
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto flex-1">
          {works.map((w) => {
            const isSelected = selected === w.id
            return (
              <button
                key={w.id}
                onClick={() =>
                  setSelected((prev) => (prev === w.id ? null : w.id))
                }
                className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={w.thumb}
                    alt={w.title}
                    width={87}
                    height={116}
                    className="rounded-md object-cover"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-body-1">{w.title}</span>
                    <span className="text-caption text-gray-500">{w.meta}</span>
                  </div>
                </div>

                <span
                  className={
                    isSelected
                      ? 'text-[var(--color-magenta-300)]'
                      : 'text-gray-300'
                  }
                >
                  <CheckBox />
                </span>
              </button>
            )
          })}
        </div>

        {/* ✅ 선택됐을 때만 + 하단 고정 */}
        {selected && (
          <div className="pt-4">
            <button
              onClick={goWritePage}
              className="h-12 w-full mb-4 rounded-xl bg-black text-body-1 text-white transition-opacity hover:opacity-90"
            >
              선택 작품 리뷰 쓰기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
