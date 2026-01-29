// src/app/writers/feed/components/feedList.tsx
'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import Image from 'next/image'

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

type Props = {
  pick: string
  posts: Post[] // ✅ API 연결된 데이터는 부모에서 내려주기
  onReport?: (post: Post) => void // ✅ 신고 클릭 시 액션(필요하면 부모에서 연결)
}

export default function FeedList({ pick, posts, onReport }: Props) {
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setOpenMenuPostId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = useMemo(() => {
    if (pick === 'all') return posts
    return posts.filter((p) => p.workId === pick)
  }, [posts, pick])

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

            {/* ✅ 점3개 + 드롭다운 (차단 제거 / 신고만) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                className="w-6 h-6 cursor-pointer transition-opacity hover:opacity-70"
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
                <div
                  className="absolute right-0 top-[30px] z-20"
                  onClick={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="block w-[96px] h-[36px] rounded-[4px] overflow-hidden"
                    style={{ boxShadow: '0 0 8px rgba(0,0,0,0.25)' }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setOpenMenuPostId(null)
                      onReport?.(post)
                    }}
                    aria-label="신고하기"
                  >
                    <img
                      src="/icons/comment-dropdown.svg"
                      alt="신고하기"
                      width={96}
                      height={36}
                      className="block w-[96px] h-[36px] object-contain bg-white"
                      draggable={false}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 피드 이미지(최대 3개) */}
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
              <div
                className="w-[62px] h-[83px] rounded bg-[var(--color-gray-200)] flex-shrink-0"
                style={{ aspectRatio: '62/83' }}
              />

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
