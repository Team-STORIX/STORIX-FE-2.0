// src/components/topicroom/ParticipationChat.tsx
'use client'

import { useState, useMemo, UIEvent } from 'react'
import Image from 'next/image'

const ITEMS_PER_PAGE = 3

export interface ParticipationChatItem {
  id: number | string // 고유 id
  thumbnail: string // 왼쪽 원형 이미지
  title: string // 이착헌이 누구야?
  subtitle: string // 웹소설 <이세계 착한 헌터>
  memberCount: number // 13
  timeAgo: string // '1분 전' 같은 텍스트
}

interface ParticipationChatProps {
  list: ParticipationChatItem[]
}

export default function ParticipationChat({ list }: ParticipationChatProps) {
  const [currentPage, setCurrentPage] = useState(0)

  // 3개씩 끊어서 페이지 배열로 만들기
  const pages = useMemo(
    () =>
      Array.from(
        { length: Math.ceil(list.length / ITEMS_PER_PAGE) },
        (_, pageIndex) =>
          list.slice(
            pageIndex * ITEMS_PER_PAGE,
            (pageIndex + 1) * ITEMS_PER_PAGE,
          ),
      ),
    [list],
  )

  const totalPages = pages.length

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = e.currentTarget
    const page = Math.round(scrollLeft / clientWidth)
    if (page !== currentPage) {
      setCurrentPage(page)
    }
  }

  if (!list.length) return null

  return (
    <section className="border-bottom">
      {/* 가로로 페이지 슬라이드 영역 */}
      <div
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory"
        onScroll={handleScroll}
      >
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            className="w-full flex-shrink-0 snap-start space-y-4"
          >
            {pageItems.map(
              ({ id, thumbnail, title, subtitle, memberCount, timeAgo }) => (
                <div key={id} className="flex w-full items-center px-4 gap-3">
                  {/* 왼쪽 원형 썸네일 */}
                  <div className="flex-none h-[60px] w-[60px] overflow-hidden rounded-full">
                    <Image
                      src={thumbnail}
                      alt={title}
                      width={60}
                      height={60}
                      className="h-full w-full rounded-full object-cover object-top"
                    />
                  </div>

                  {/* 가운데 텍스트들 */}
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between">
                      <p className="flex body-1 leading-tight text-gray-900">
                        {title}
                      </p>
                      <div className="flex ml-2 whitespace-nowrap caption-1 text-gray-500">
                        {memberCount}명 · {timeAgo}
                      </div>
                    </div>
                    <p className="mt-1 caption-1 text-gray-500">{subtitle}</p>
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>

      {/* 페이지 인디케이터 점 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4 mb-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <span
              key={index}
              className={`h-1.5 w-1.5 rounded-full ${
                index === currentPage ? 'bg-gray-400' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
