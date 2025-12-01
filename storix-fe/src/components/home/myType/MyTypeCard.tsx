// src/components/home/myType/MyTypeCard.tsx
'use client'

// 카드 데이터 타입 이후에 반영될 예정
export interface HotFeedData {
  id: string
  author: string
  title: string
  content: string
  likeCount: number
  commentCount: number
}

type MyTypeCardProps = {
  className?: string
}

/* 지금 뜨는 글 카드 - 내용은 비워두고 레이아웃/사이즈만 잡은 버전 */
export const MyTypeCard = ({ className }: MyTypeCardProps) => {
  return (
    <div
      className={`flex w-[112px] h-[208px] rounded-2xl shadow-sm flex-shrink-0 ${
        className ?? 'bg-white'
      }`}
    ></div>
  )
}
