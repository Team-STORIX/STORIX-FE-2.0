// src/app/feed/FeedPageClient.tsx
'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Topbar from './components/topbar'
import HorizontalPicker, { PickerItem } from './components/horizontalPicker'
import FeedList from './components/feedList'
import NavBar from '@/components/common/NavBar'

type Tab = 'works' | 'writers'

export default function FeedPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tab: Tab = searchParams.get('tab') === 'writers' ? 'writers' : 'works'
  const pick = searchParams.get('pick') ?? 'all'

  const replaceQuery = (next: { tab?: Tab; pick?: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next.tab) params.set('tab', next.tab)
    if (typeof next.pick === 'string') params.set('pick', next.pick)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const onChangeTab = (nextTab: Tab) => {
    replaceQuery({ tab: nextTab, pick: 'all' })
  }

  const onPick = (id: string) => {
    replaceQuery({ pick: id })
  }

  //  ✅ 스크롤 확인용으로 아이템 많이
  const worksItems: PickerItem[] = useMemo(
    () => [
      { id: 'all', name: '전체' },
      { id: 'w1', name: '상수리 나무 아래' },
      { id: 'w2', name: '재혼황후' },
      { id: 'w3', name: '무림세가천대받는' },
      { id: 'w4', name: '전지적독자지시점' },
      { id: 'w5', name: '나 혼자만 레벨업' },
      { id: 'w6', name: '화산귀환' },
      { id: 'w7', name: '전독시 외전급으로 긴제목테스트' },
      { id: 'w8', name: '유미의 세포들' },
      { id: 'w9', name: '신의 탑' },
      { id: 'w10', name: '연애혁명' },
      { id: 'w11', name: '외모지상주의' },
    ],
    [],
  )

  const writersItems: PickerItem[] = useMemo(
    () => [
      { id: 'all', name: '전체' },
      { id: 'a1', name: '서말' },
      { id: 'a2', name: '나무' },
      { id: 'a3', name: '알파' },
      { id: 'a4', name: '베타' },
      { id: 'a5', name: '감자' },
      { id: 'a6', name: '호박' },
      { id: 'a7', name: '테스트작가이름길게길게길게' },
      { id: 'a8', name: '작가8' },
      { id: 'a9', name: '작가9' },
      { id: 'a10', name: '작가10' },
    ],
    [],
  )

  const items = tab === 'works' ? worksItems : writersItems

  return (
    // ✅ myActivity/page.tsx처럼 하단 네비 여백 확보
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Topbar activeTab={tab} onChange={onChangeTab} />
      </div>

      <HorizontalPicker items={items} selectedId={pick} onSelect={onPick} />

      <FeedList tab={tab} pick={pick} />

      <NavBar active="feed" />
    </div>
  )
}
