// src/app/writers/feed/WritersFeedClient.tsx
'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import HorizontalPicker, {
  type PickerItem,
} from '@/app/writers/feed/components/horizontalPicker'
import FeedList from '@/app/writers/feed/components/feedList'
import NavBar from '@/app/writers/feed/components/navigationBar'

// ✅ writers/feedList.tsx에서 기대하는 Post 타입이 정확히 뭔지 모르니,
//    "최소 필드"로 맞춘 mock 타입(필드가 더 필요하면 추가하면 됨)
type Post = {
  id: number
  workId: string
  isAuthorPost?: boolean

  user: {
    profileImage: string
    nickname: string
  }
  createdAt: string

  work: {
    coverImage: string
    title: string
    author: string
    type: string
    genre: string
  }

  hashtags: string[]
  content: string
  isLiked: boolean
  likeCount: number
  commentCount: number
  images?: string[]
}

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

  // ✅ (임시) FeedList에 넘길 posts
  //    나중에 API 연결하면 이 부분만 교체하면 됨.
  const posts: Post[] = useMemo(() => {
    const base: Post[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      workId: i % 2 === 0 ? 'w1' : 'w2',
      isAuthorPost: true,

      user: {
        profileImage: '/profile/profile-default.svg', // 프로젝트에 존재하는 기본 이미지로
        nickname: `작가닉네임 ${i + 1}`,
      },
      createdAt: new Date(Date.now() - i * 3600_000).toISOString(),

      work: {
        coverImage: '/sample/sample-thumbnail.jpg', // 없으면 실제 존재 경로로 변경
        title: `작품 타이틀 ${i + 1}`,
        author: `작가 ${i + 1}`,
        type: '웹툰',
        genre: '판타지',
      },

      hashtags: ['#연재', '#테스트', '#스토릭스'],
      content: `작가 피드 글 내용 예시 ${i + 1}`,
      isLiked: i % 2 === 0,
      likeCount: 10 + i,
      commentCount: 3 + (i % 4),
      images: i % 3 === 0 ? ['/sample/sample-image.jpg'] : [],
    }))

    if (pick === 'all') return base
    return base.filter((p) => p.workId === pick)
  }, [pick])

  return (
    <div className="relative w-full min-h-full pb-[169px] bg-white">
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

      {/* ✅ posts 필수 props 충족 */}
      <FeedList pick={pick} posts={posts as any} />

      <NavBar active="feed" />
    </div>
  )
}
