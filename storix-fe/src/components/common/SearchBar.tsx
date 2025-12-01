// src/components/common/SearchBar.tsx
'use client'

type SearchBarProps = {
  placeholder?: string
  onBackClick?: () => void
  onSearchClick?: () => void
}

export default function SearchBar({
  placeholder = '좋아하는 작품/작가를 검색하세요',
  onBackClick,
  onSearchClick,
}: SearchBarProps) {
  return (
    <div
      className="
        flex h-[68px] w-full flex-col
        justify-center
        px-4 py-[10px]
        bg-white
      "
    >
      {/* 상단 행: 화살표 / 텍스트 / 돋보기 */}
      <div className="flex w-full items-center gap-[15px]">
        <button
          type="button"
          aria-label="뒤로 가기"
          onClick={onBackClick}
          className="flex h-6 w-6 items-center justify-center"
        >
          <BackIcon />
        </button>

        <p className="flex-1 text-center text-[16px] text-gray-400">
          {placeholder}
        </p>

        <button
          type="button"
          aria-label="검색"
          onClick={onSearchClick}
          className="flex h-6 w-6 items-center justify-center"
        >
          <SearchIcon />
        </button>
      </div>

      {/* 하단 언더라인 */}
      <div className="mt-[10px] h-[2px] w-full bg-black" />
    </div>
  )
}

/* ===== 아이콘들 ===== */

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 6L9 12L15 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <line
        x1="15"
        y1="15"
        x2="20"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
