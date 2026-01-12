// src/app/feed/components/feedList.tsx

'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'

type Tab = 'works' | 'writers'

type Post = {
  id: number
  workId: string
  writerId: string
  isAuthorPost?: boolean // ✅ 작가가 쓴 글이면 true

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

  // ✅ 피드 이미지(최대 3개)
  images?: string[]
}

export default function FeedList({ tab, pick }: { tab: Tab; pick: string }) {
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) {
        setOpenMenuPostId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          '/works/default-cover.jpg',
          '/works/default-cover.jpg',
          '/works/default-cover.jpg',
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
        images: [], // 이미지 없는 케이스
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
        images: ['/works/default-cover.jpg'],
      },
    ],
    [],
  )

  const filtered = useMemo(() => {
    if (pick === 'all') return posts
    if (tab === 'works') return posts.filter((p) => p.workId === pick)
    return posts.filter((p) => p.writerId === pick)
  }, [posts, tab, pick])

  return (
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
                {/* ✅ 닉네임 + 작가마크(4px 간격) */}
                <div className="flex items-center">
                  <p
                    className="text-[16px] font-medium leading-[140%]"
                    style={{ color: 'var(--color-gray-900)' }}
                  >
                    {post.user.nickname}
                  </p>

                  {post.isAuthorPost && (
                    <span className="ml-1">
                      <Image
                        src="/icons/author-mark.svg"
                        alt="작가"
                        width={16}
                        height={16}
                        style={{ marginLeft: 4 }}
                      />
                    </span>
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

            {/* ✅ 점3개 버튼 + 드롭다운 */}
            <div className="relative" ref={menuRef}>
              <button
                className="w-6 h-6 cursor-pointer transition-opacity hover:opacity-70"
                onClick={() =>
                  setOpenMenuPostId((prev) =>
                    prev === post.id ? null : post.id,
                  )
                }
              >
                <Image
                  src="/icons/menu-3dots.svg"
                  alt="메뉴"
                  width={24}
                  height={24}
                />
              </button>

              {openMenuPostId === post.id && (
                <div
                  className="absolute right-0 top-[28px] z-20 overflow-hidden"
                  style={{
                    width: 96,
                    height: 68,
                    borderRadius: 4,
                    background: '#FFF',
                  }}
                >
                  {/* 배경 이미지 */}
                  <Image
                    src="/icons/comment-dropdown.svg"
                    alt="드롭다운"
                    width={96}
                    height={68}
                    className="absolute inset-0 w-full h-full"
                  />

                  {/* 위/아래 영역 hover */}
                  <div className="relative w-full h-full">
                    <button
                      type="button"
                      className="w-full h-[34px] cursor-pointer"
                      onClick={() => {
                        // TODO: 신고하기 클릭 동작 연결
                        setOpenMenuPostId(null)
                      }}
                      aria-label="신고하기"
                    />
                    <button
                      type="button"
                      className="w-full h-[34px] cursor-pointer"
                      onClick={() => {
                        // TODO: 차단하기 클릭 동작 연결
                        setOpenMenuPostId(null)
                      }}
                      aria-label="차단하기"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✅ (추가) 피드 이미지: 프로필과 본문 사이, 최대 3개, 좌우 스크롤 */}
          {post.images && post.images.length > 0 && (
            <div className="mt-4 px-4">
              <div className="overflow-x-auto">
                <div className="flex gap-3">
                  {post.images.slice(0, 3).map((src, idx) => (
                    <div
                      key={`${post.id}-img-${idx}`}
                      style={{
                        display: 'flex',
                        width: 236,
                        height: 236,
                        padding: 8,
                        justifyContent: 'flex-end',
                        alignItems: 'flex-start',
                        gap: 10,
                        flexShrink: 0,
                        aspectRatio: '1 / 1',
                        borderRadius: 12,
                        border: '1px solid var(--gray-100, #EEEDED)',
                        background: 'lightgray',
                        overflow: 'hidden',
                      }}
                    >
                      <Image
                        src={src}
                        alt={`피드 이미지 ${idx + 1}`}
                        width={220}
                        height={220}
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
              <div
                className="w-[62px] h-[83px] rounded bg-[var(--color-gray-200)] flex-shrink-0"
                style={{ aspectRatio: '62/83' }}
              />

              {/* 작품 정보 */}
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
            </div>
          </div>

          {/* 본문 */}
          <div className="mt-3 px-4">
            <p
              className="text-[14px] font-medium leading-[140%] line-clamp-3 pr-10"
              style={{ color: 'var(--color-gray-800)' }}
            >
              {post.content}
            </p>
          </div>

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
  )
}
