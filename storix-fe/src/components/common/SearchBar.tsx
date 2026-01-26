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

  //   추가
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
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
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
