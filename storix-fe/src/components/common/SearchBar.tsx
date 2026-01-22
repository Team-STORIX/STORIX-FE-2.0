// src/components/common/SearchBar.tsx
'use client'

import Image from 'next/image'
import { useEffect, useState, KeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

type SearchBarProps = {
  placeholder?: string
  onBackClick?: () => void
  onSearchClick?: (keyword: string) => void
  backHref?: string

  // ✅ 추가
  defaultKeyword?: string
}

export default function SearchBar({
  placeholder = '좋아하는 작품/작가를 검색하세요',
  onSearchClick,
  backHref,
  defaultKeyword = '',
}: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultKeyword)
  const router = useRouter()
  const pathname = usePathname()

  // defaultKeyword 변경 시 input도 갱신
  useEffect(() => {
    setKeyword(defaultKeyword)
  }, [defaultKeyword])

  const href =
    backHref ??
    (pathname.startsWith('/home')
      ? '/home'
      : pathname.startsWith('/library/search')
        ? '/library/list'
        : '/')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchClick) {
      onSearchClick(keyword.trim())
    }
  }

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick(keyword.trim())
    }
  }

  return (
    <div className="flex h-17 w-full justify-between px-4 py-2.5 bg-white">
      <div className="flex w-full items-center gap-[15px]">
        <Link
          href={href}
          aria-label="뒤로 이동"
          className="flex h-6 w-6 items-center justify-center"
        >
          <BackIcon />
        </Link>

        <div className="flex flex-col w-full">
          <div>
            <div className="flex px-2 justify-between">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="flex-1 bg-transparent body-1 placeholder:text-gray-400 outline-none"
              />
              <button
                type="button"
                aria-label="검색"
                onClick={handleSearchClick}
                className="flex h-6 w-6 items-center justify-center cursor-pointer"
              >
                <Image
                  src={'/common/icons/search.svg'}
                  alt={'검색'}
                  width={24}
                  height={24}
                  className="inline-block"
                />
              </button>
            </div>
          </div>
          <div>
            <div className="mt-[10px] h-[2px] w-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== 아이콘들 ===== */

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3.54922 11.9996L10.8992 19.3496C11.1492 19.5996 11.2701 19.8913 11.2617 20.2246C11.2534 20.558 11.1242 20.8496 10.8742 21.0996C10.6242 21.3496 10.3326 21.4746 9.99922 21.4746C9.66589 21.4746 9.37422 21.3496 9.12422 21.0996L1.42422 13.4246C1.22422 13.2246 1.07422 12.9996 0.974219 12.7496C0.874219 12.4996 0.824219 12.2496 0.824219 11.9996C0.824219 11.7496 0.874219 11.4996 0.974219 11.2496C1.07422 10.9996 1.22422 10.7746 1.42422 10.5746L9.12422 2.87462C9.37422 2.62462 9.67005 2.50379 10.0117 2.51212C10.3534 2.52046 10.6492 2.64962 10.8992 2.89962C11.1492 3.14962 11.2742 3.44129 11.2742 3.77462C11.2742 4.10796 11.1492 4.39962 10.8992 4.64962L3.54922 11.9996Z"
        fill="#100F0F"
      />
    </svg>
  )
}
