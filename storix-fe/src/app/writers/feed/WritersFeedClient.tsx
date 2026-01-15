// src/app/writers/feed/WritersFeedClient.tsx
'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import HorizontalPicker, {
  PickerItem,
} from '@/app/writers/feed/components/horizontalPicker'
import FeedList from '@/app/writers/feed/components/feedList'
import NavBar from '@/app/writers/feed/components/NavigaitionBar'

export default function WritersFeedClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pick = searchParams.get('pick') ?? 'all'

  const replaceQuery = (nextPick: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pick', nextPick)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const myWorksItems: PickerItem[] = useMemo(
    () => [
      { id: 'all', name: '전체' },
      { id: 'w1', name: '상수리 나무 아래' },
      { id: 'w2', name: '재혼황후' },
      { id: 'w3', name: '무림세가천대받는' },
      { id: 'w4', name: '전지적독자지시점' },
    ],
    [],
  )

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      {/* ✅ 상단 safe 영역 */}
      <div className="h-[54px]" />

      {/* ✅ 타이틀 영역 */}
      <div className="w-[393px] px-5 py-4 flex items-start gap-5">
        <h1 className="text-[24px] font-bold leading-[140%] text-[var(--gray-900)]">
          내 작품
        </h1>
      </div>

      {/* ✅ 작품 선택 Picker */}
      <HorizontalPicker
        items={myWorksItems}
        selectedId={pick}
        onSelect={replaceQuery}
      />

      {/* ✅ 기존 피드와 동일한 포맷 */}
      <FeedList pick={pick} />

      <NavBar active="feed" />
    </div>
  )
}
