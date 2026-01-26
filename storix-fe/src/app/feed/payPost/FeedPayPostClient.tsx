// src/app/feed/payPost/FeedPayPostClient.tsx
'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Topbar from '@/app/feed/components/topbar'
import HorizontalPicker, {
  type PickerItem,
} from '@/app/feed/components/horizontalPicker'
import FeedList from '@/app/feed/components/feedList'
import NavBar from '@/components/common/NavBar'

import { useOpenMenu } from '@/hooks/useOpenMenu'
import { useReportFlow } from '@/hooks/useReportFlow'
import { useDeleteFlow } from '@/hooks/useDeleteFlow'
import ReportFlow from '@/components/common/report/ReportFlow'
import DeleteFlow from '@/components/common/delete/DeleteFlow'

type Tab = 'works' | 'writers'

//   FeedList가 기대하는 게시글 데이터(프로젝트 실제 타입이 있으면 그걸로 교체해도 됨)
type Post = {
  boardId: number
  profile: { userId: number; nickName: string; profileImageUrl: string | null }
  board: {
    userId: number
    lastCreatedTime: string
    content: string
    likeCount: number
    replyCount: number
    isLiked: boolean
  }
  images?: { imageUrl: string; sortOrder: number }[]
  works?: null | {
    thumbnailUrl: string
    worksName: string
    artistName: string
    worksType: string
    genre: string
    hashtags: string[]
  }
}

export default function FeedPayPostClient() {
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

  //   (1) menu 훅
  const menu = useOpenMenu()

  //   (2) report/delete 훅은 opts 1개 필수
  //     여기 opts는 "최소로" 넣어둔거라, 너희 훅 정의가 조금 다르면 아래만 이름 맞추면 끝.
  const report = useReportFlow({
    // 보통: onDone, onSuccess, onError 같은 콜백이 있음. 없으면 지워도 됨.
    // @ts-expect-error - 프로젝트 훅 opts에 맞춰 조정 가능
    onDone: () => {},
  })

  const del = useDeleteFlow({
    // @ts-expect-error - 프로젝트 훅 opts에 맞춰 조정 가능
    onDone: () => {},
  })

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

  //   (임시) posts mock
  const posts: Post[] = useMemo(() => {
    const base: Post[] = Array.from({ length: 12 }).map((_, i) => ({
      boardId: i + 1,
      profile: {
        userId: 1000 + i,
        nickName: tab === 'writers' ? `작가 ${i + 1}` : `독자 ${i + 1}`,
        profileImageUrl: null,
      },
      board: {
        userId: 1000 + i,
        lastCreatedTime: new Date(Date.now() - i * 3600_000).toISOString(),
        content:
          tab === 'works'
            ? `[유료글] 작품 ${pick} 관련 글 내용 예시 ${i + 1}`
            : `[유료글] 작가 ${pick} 관련 글 내용 예시 ${i + 1}`,
        likeCount: 10 + i,
        replyCount: 2 + (i % 3),
        isLiked: i % 2 === 0,
      },
      images: [],
      works:
        tab === 'works'
          ? {
              thumbnailUrl: '/sample/sample-thumbnail.jpg',
              worksName: pick === 'all' ? `작품 ${i + 1}` : `선택작품(${pick})`,
              artistName: `작가 ${i + 1}`,
              worksType: '웹툰',
              genre: '판타지',
              hashtags: ['#유료', '#테스트', '#스토릭스'],
            }
          : null,
    }))

    if (pick === 'all') return base
    if (tab === 'works')
      return base.filter((p) => p.works?.worksName.includes(pick))
    return base.filter((p) => p.profile.nickName.includes(pick))
  }, [pick, tab])

  //   신고/삭제 열기: openXModal로 호출 (너희 에러 메시지에 있는 정확한 함수명)
  const onOpenReport = (post: Post) => {
    // BaseReportTarget 구조는 프로젝트에 정의되어 있을 텐데,
    // 최소로 boardId만 넣어도 되는 구조면 이대로 OK.
    report.openReportModal({ boardId: post.boardId } as any)
  }

  const onOpenDelete = (post: Post) => {
    del.openDeleteModal({ boardId: post.boardId } as any)
  }

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
      <div className="sticky top-0 z-10 bg-white">
        <Topbar activeTab={tab} onChange={onChangeTab} />
      </div>

      <HorizontalPicker items={items} selectedId={pick} onSelect={onPick} />

      {/*   FeedList가 요구하던 props들 전부 전달 */}
      <FeedList
        tab={tab}
        pick={pick}
        posts={posts as any}
        menu={menu as any}
        onOpenReport={onOpenReport as any}
        onOpenDelete={onOpenDelete as any}
      />

      {/*   플로우 렌더 */}
      <ReportFlow {...(report as any)} />
      <DeleteFlow {...(del as any)} />

      <NavBar active="feed" />
    </div>
  )
}
