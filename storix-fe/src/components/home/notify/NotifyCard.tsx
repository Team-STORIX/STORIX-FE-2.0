// src/components/home/notify/NotifyCard.tsx
'use client'

import Image from 'next/image'

export interface NotifyCardProps {
  title: string // [이벤트] 당신의 최애캐를 소개하세요!(~3/10)
  description: string // 당신의 최애캐를 소개하는 웹소설 환상의 입덕쇼!
  date: string // 2025.11.09
  thumbnailSrc?: string // 왼쪽 동그란 썸네일 이미지 (옵션)
  className?: string // 바깥 여백 조정용
}

export default function NotifyCard({
  title,
  description,
  date,
  thumbnailSrc,
  className = '',
}: NotifyCardProps) {
  return (
    <div className={`w-full ${className}`}>
      <div
        className="
          flex items-start gap-4
          rounded-2xl bg-white
          px-4 py-4
        "
      >
        {/* 왼쪽 동그란 썸네일 */}
        <div className="mt-1 h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
          {thumbnailSrc && (
            <Image
              src={thumbnailSrc}
              alt={title}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* 오른쪽 텍스트 영역 */}
        <div className="flex-1">
          <p className="text-[15px] font-semibold leading-snug text-gray-900">
            {title}
          </p>

          <p className="mt-1 text-[13px] leading-snug text-gray-500">
            {description}
          </p>

          <p className="mt-3 text-[12px] text-gray-400">{date}</p>
        </div>
      </div>
    </div>
  )
}
