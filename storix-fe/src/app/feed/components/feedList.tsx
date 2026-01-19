// src/app/feed/components/feedList.tsx
'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Tab = 'works' | 'writers'

type Post = {
  id: number
  workId: string
  writerId: string
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

export default function FeedList({ tab, pick }: { tab: Tab; pick: string }) {
  const router = useRouter()

  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null)

  // ✅ 신고 모달
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportTarget, setReportTarget] = useState<{
    profileImage: string
    nickname: string
  } | null>(null)

  // ✅ post.id별 ref 관리 (outside click 정확히 처리용)
  const menuRefs = useRef<Record<number, HTMLDivElement | null>>({})

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openMenuPostId == null) return
      const current = menuRefs.current[openMenuPostId]
      if (!current) return
      if (!current.contains(e.target as Node)) setOpenMenuPostId(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuPostId])

  useEffect(() => {
    if (!isReportOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeReportModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReportOpen])

  const posts: Post[] = useMemo(
    () => [
      {
        id: 1,
        workId: 'w1',
        writerId: 'a1',
        isAuthorPost: true,
        user: {
          profileImage: '/profile/profile-default.svg',
          nickname: '서말',
        },
        createdAt: '1일 전',
        work: {
          coverImage: '',
          title: '상수리 나무 아래',
          author: '서말,나무',
          type: '웹툰',
          genre: '로판',
        },
        hashtags: ['#로판', '#첫사랑', '#성장물'],
        content:
          '정말 재미있는 작품이에요! 주인공의 성장 과정이 인상 깊었고 스토리 전개가 탄탄해서 몰입감이 대단했습니다.',
        isLiked: true,
        likeCount: 24,
        commentCount: 12,
        images: [
          '/image/sample/topicroom-6.webp',
          '/image/sample/topicroom-5.webp',
          '/image/sample/topicroom-4.webp',
        ],
      },
      {
        id: 2,
        workId: 'w2',
        writerId: 'a2',
        isAuthorPost: false,
        user: {
          profileImage: '/profile/profile-default.svg',
          nickname: '닉네임',
        },
        createdAt: '3일 전',
        work: {
          coverImage: '',
          title: '재혼황후',
          author: '나무',
          type: '웹툰',
          genre: '로판',
        },
        hashtags: ['#로판', '#궁중'],
        content: '이 작품은 전개가 빠르고 캐릭터가 진짜 매력적임.',
        isLiked: false,
        likeCount: 8,
        commentCount: 0,
        images: [],
      },
      {
        id: 3,
        workId: 'w3',
        writerId: 'a3',
        isAuthorPost: false,
        user: {
          profileImage: '/profile/profile-default.svg',
          nickname: '닉네임',
        },
        createdAt: '1주 전',
        work: {
          coverImage: '',
          title: '무림세가천대받는',
          author: '알파',
          type: '웹툰',
          genre: '무협',
        },
        hashtags: ['#무협', '#성장'],
        content: '짧은 댓글입니다.',
        isLiked: false,
        likeCount: 0,
        commentCount: 3,
      },
      {
        id: 4,
        workId: 'w1',
        writerId: 'a1',
        isAuthorPost: false,
        user: {
          profileImage: '/profile/profile-default.svg',
          nickname: '닉네임',
        },
        createdAt: '2주 전',
        work: {
          coverImage: '',
          title: '상수리 나무 아래',
          author: '서말,나무',
          type: '웹툰',
          genre: '로판',
        },
        hashtags: ['#로판'],
        content:
          '첫 리뷰입니다! 기대되는 작품이에요.10화는 그냥 둘 분위기 바뀌는 게 느껴져 ㄹㅈㄷ...엄청 큰 사건은 없는데도 묘하게 계속 보게 됨.',
        isLiked: true,
        likeCount: 1,
        commentCount: 0,
        images: ['/image/sample/topicroom-5.webp'],
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    if (pick === 'all') return posts
    if (tab === 'works') return posts.filter((p) => p.workId === pick)
    return posts.filter((p) => p.writerId === pick)
  }, [posts, tab, pick])

  const openReportModal = (post: Post) => {
    setReportTarget({
      profileImage: post.user.profileImage,
      nickname: post.user.nickname,
    })
    setIsReportOpen(true)
    setOpenMenuPostId(null)
  }

  const closeReportModal = () => {
    setIsReportOpen(false)
    setReportTarget(null)
  }

  const handleReportConfirm = () => {
    // TODO: 신고 API 연동
    closeReportModal()
  }

  return (
    <>
      <div>
        {filtered.map((post) => (
          <div
            key={post.id}
            className="py-5"
            style={{
              borderBottom: '1px solid var(--color-gray-100)',
              backgroundColor: 'var(--color-white)',
            }}
          >
            {/* 프로필 영역 */}
            <div className="px-4 flex items-center justify-between h-[41px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[var(--color-gray-200)]">
                  <Image
                    src={post.user.profileImage}
                    alt="프로필"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center">
                    <p
                      className="text-[16px] font-medium leading-[140%]"
                      style={{ color: 'var(--color-gray-900)' }}
                    >
                      {post.user.nickname}
                    </p>

                    {post.isAuthorPost && (
                      <Image
                        src="/icons/author-mark.svg"
                        alt="작가"
                        width={16}
                        height={16}
                        className="ml-1"
                      />
                    )}
                  </div>

                  <p
                    className="mt-[2px] text-[12px] font-medium leading-[140%]"
                    style={{ color: 'var(--color-gray-300)' }}
                  >
                    {post.createdAt}
                  </p>
                </div>
              </div>

              {/* 점3개 + dropdown */}
              <div
                className="relative"
                ref={(el) => {
                  menuRefs.current[post.id] = el
                }}
              >
                <button
                  type="button"
                  className="w-6 h-6 transition-opacity hover:opacity-70"
                  onClick={() =>
                    setOpenMenuPostId((prev) =>
                      prev === post.id ? null : post.id,
                    )
                  }
                  aria-label="메뉴"
                >
                  <Image
                    src="/icons/menu-3dots.svg"
                    alt="메뉴"
                    width={24}
                    height={24}
                  />
                </button>

                {openMenuPostId === post.id && (
                  <div className="absolute right-0 top-[30px] z-20">
                    {/* ✅ 96x36 박스를 먼저 고정 (렌더 박스 강제) */}
                    <button
                      type="button"
                      className="rounded-[4px] transition-opacity hover:opacity-90"
                      style={{ boxShadow: '0 0 8px rgba(0,0,0,0.25)' }}
                      onClick={() => openReportModal(post)}
                      aria-label="신고하기"
                    >
                      <div className="h-[36px] w-[96px]">
                        <img
                          src="/icons/comment-dropdown.svg"
                          alt="comment-dropdown"
                          className="block h-[36px] w-[96px] rounded-[4px] bg-white"
                          draggable={false}
                        />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 피드 이미지 */}
            {post.images && post.images.length > 0 && (
              <div className="mt-4 px-4">
                <div className="overflow-x-auto">
                  <div className="flex gap-3">
                    {post.images.slice(0, 3).map((src, idx) => (
                      <div
                        key={`${post.id}-img-${idx}`}
                        className="w-[236px] h-[236px] p-2 rounded-[12px] overflow-hidden flex-shrink-0"
                        style={{
                          border: '1px solid var(--color-gray-100)',
                          background: 'lightgray',
                        }}
                      >
                        <Image
                          src={src}
                          alt={`피드 이미지 ${idx + 1}`}
                          width={236}
                          height={236}
                          className="w-full h-full object-cover rounded-[8px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 작품 정보 영역 */}
            <div className="mt-5 px-4">
              <div
                className="p-3 rounded-xl flex gap-3"
                style={{
                  border: '1px solid var(--color-gray-100)',
                  backgroundColor: 'var(--color-white)',
                }}
              >
                {/* 표지 이미지 */}
                <div className="w-[62px] h-[83px] rounded bg-[var(--color-gray-200)] flex-shrink-0" />

                {/* ✅ 작품 정보 + 오른쪽 화살표(동일 구조) */}
                <div className="flex w-full items-stretch">
                  <div className="flex flex-col justify-between w-[210px]">
                    <p
                      className="text-[16px] font-medium leading-[140%] overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ color: 'var(--color-black)' }}
                    >
                      {post.work.title}
                    </p>

                    <p
                      className="text-[12px] font-medium leading-[140%]"
                      style={{ color: 'var(--color-gray-500)' }}
                    >
                      {post.work.author} · {post.work.type} · {post.work.genre}
                    </p>

                    <div className="flex gap-1 flex-wrap">
                      {post.hashtags.map((tag, index) => (
                        <div
                          key={index}
                          className="px-2 py-[6px] rounded text-[10px] font-medium leading-[140%] tracking-[0.2px]"
                          style={{
                            border: '1px solid var(--color-gray-100)',
                            backgroundColor: 'var(--color-gray-50)',
                            color: 'var(--color-gray-800)',
                          }}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push('/feed')}
                    className="ml-auto pl-3 flex items-center justify-center transition-opacity hover:opacity-70"
                    aria-label="작품 상세 보기"
                  >
                    <Image
                      src="/icons/icon-arrow-forward-small.svg"
                      alt="작품 상세"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 본문: 클릭하면 상세로 */}
            <button
              type="button"
              onClick={() => router.push(`/feed/article/${post.id}`)}
              className="mt-3 px-4 text-left w-full transition-opacity hover:opacity-80"
              aria-label="게시글 본문 보기"
            >
              <p
                className="text-[14px] font-medium leading-[140%] line-clamp-3 pr-10"
                style={{ color: 'var(--color-gray-800)' }}
              >
                {post.content}
              </p>
            </button>

            {/* 반응 영역 */}
            <div className="mt-5 px-4 flex items-center">
              <div className="flex items-center">
                <Image
                  src={
                    post.isLiked
                      ? '/icons/icon-like-pink.svg'
                      : '/icons/icon-like.svg'
                  }
                  alt="좋아요"
                  width={24}
                  height={24}
                />
                {post.likeCount > 0 && (
                  <span
                    className="ml-1 text-[14px] font-bold leading-[140%]"
                    style={{ color: 'var(--color-gray-500)' }}
                  >
                    {post.likeCount}
                  </span>
                )}
              </div>

              <div className="flex items-center ml-4">
                <Image
                  src="/icons/icon-comment.svg"
                  alt="댓글"
                  width={24}
                  height={24}
                />
                {post.commentCount > 0 && (
                  <span
                    className="ml-1 text-[14px] font-bold leading-[140%]"
                    style={{ color: 'var(--color-gray-500)' }}
                  >
                    {post.commentCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 신고 모달 */}
      {isReportOpen && reportTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* ✅ 배경 50% */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={closeReportModal}
            aria-label="모달 닫기"
          />

          {/* ✅ 306x209 모달 */}
          <div
            className="relative flex flex-col w-[306px] h-[209px] pt-7 pb-4 rounded-[12px] bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 타이틀 + 설명 (최대한 짧게: globals 유사 값 사용) */}
            <div className="w-full px-6 text-center">
              <h2
                className="heading-2"
                style={{ color: 'var(--color-gray-900)' }}
              >
                신고하기
              </h2>
              <p
                className="body-2 mt-1"
                style={{ color: 'var(--color-gray-500)' }}
              >
                정말로 아래 유저를 신고하시겠습니까?
              </p>
            </div>

            {/* ✅ 프로필+닉네임 그룹: 모달 중앙 정렬 */}
            <div className="mt-4 w-full flex justify-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-gray-200)]">
                  <Image
                    src={reportTarget.profileImage}
                    alt="신고 대상 프로필"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="body-2 ml-2"
                  style={{ color: 'var(--color-gray-600)' }}
                >
                  {reportTarget.nickname}
                </p>
              </div>
            </div>

            {/* ✅ 버튼 2개: gap 8px */}
            <div className="mt-auto w-full px-6 flex gap-2">
              <button
                type="button"
                onClick={closeReportModal}
                className="flex-1 h-[49px] rounded-[8px] transition-opacity hover:opacity-80"
                style={{
                  border: '1px solid var(--color-gray-200)',
                  background: 'var(--color-gray-50)',
                  color: 'var(--color-gray-700)',
                }}
              >
                <span className="body-1">취소</span>
              </button>

              <button
                type="button"
                onClick={handleReportConfirm}
                className="flex-1 h-[49px] rounded-[8px] transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--color-warning)',
                  color: 'var(--color-white)',
                }}
              >
                <span className="body-1">신고하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
