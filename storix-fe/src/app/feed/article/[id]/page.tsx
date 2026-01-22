// src/app/feed/article/[id]/page.tsx

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

type Comment = {
  id: number
  user: {
    profileImage: string
    nickname: string
  }
  createdAt: string
  content: string
  isLiked: boolean
  likeCount: number
}

type Post = {
  id: number
  workId?: string
  writerId?: string
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
  comments?: Comment[]
}

export default function FeedArticlePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const postId = Number(params?.id)

  const handleBack = () => router.back()

  // ✅ 임시 내 프로필 (API 붙이면 교체)
  const myProfileImage = '/profile/profile-default.svg'

  // ✅ 더미 데이터 (API 붙이면 교체)
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
          '정말 재미있는 작품이에요!\n주인공의 성장 과정이 인상 깊었고 스토리 전개가 탄탄해서 몰입감이 대단했습니다.\n\n(상세에서는 3줄 제한 없이 전문이 그대로 보여요.)',
        isLiked: true,
        likeCount: 24,
        commentCount: 2,
        images: [
          '/image/sample/topicroom-6.webp',
          '/image/sample/topicroom-5.webp',
          '/image/sample/topicroom-4.webp',
        ],
        comments: [
          {
            id: 101,
            user: {
              profileImage: '/profile/profile-default.svg',
              nickname: '닉네임',
            },
            createdAt: '2분 전',
            content: '진짜 공감해요… 이 작품은 계속 보게 됨 ㅠㅠ',
            isLiked: false,
            likeCount: 0,
          },
          {
            id: 102,
            user: {
              profileImage: '/profile/profile-default.svg',
              nickname: '작가8',
            },
            createdAt: '1시간 전',
            content: '댓글 보고 다시 정주행하러 갑니다 🏃‍♀️',
            isLiked: true,
            likeCount: 3,
          },
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
        content:
          '이 작품은 전개가 빠르고 캐릭터가 진짜 매력적임.\n\n(상세에서는 전문이 그대로 보여요.)',
        isLiked: false,
        likeCount: 8,
        commentCount: 0,
        images: [],
        comments: [],
      },
    ],
    [],
  )

  const post = useMemo(
    () => posts.find((p) => p.id === postId),
    [posts, postId],
  )

  // ----------------------------
  // 글 점3개 메뉴 (동작은 나중에)
  // ----------------------------
  const [openPostMenu, setOpenPostMenu] = useState(false)
  const postMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!postMenuRef.current) return
      if (!postMenuRef.current.contains(e.target as Node))
        setOpenPostMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  // ----------------------------
  // 댓글 상태 (임시)
  // ----------------------------
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(0)
  const [commentLike, setCommentLike] = useState<
    Record<number, { isLiked: boolean; likeCount: number }>
  >({})

  useEffect(() => {
    if (!post) return
    const initial = post.comments ?? []
    setComments(initial)
    setCommentCount(post.commentCount ?? initial.length)

    const initLike: Record<number, { isLiked: boolean; likeCount: number }> = {}
    initial.forEach(
      (c) => (initLike[c.id] = { isLiked: c.isLiked, likeCount: c.likeCount }),
    )
    setCommentLike(initLike)
  }, [post])

  const toggleCommentLike = (commentId: number) => {
    setCommentLike((prev) => {
      const curr = prev[commentId]
      if (!curr) return prev
      const nextLiked = !curr.isLiked
      return {
        ...prev,
        [commentId]: {
          isLiked: nextLiked,
          likeCount: Math.max(0, curr.likeCount + (nextLiked ? 1 : -1)),
        },
      }
    })
  }

  // ----------------------------
  // 댓글 입력창 (2줄 자동 확장)
  // ----------------------------
  const [commentText, setCommentText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustTextarea = () => {
    const el = textareaRef.current
    if (!el) return
    const lineHeight = 19.6
    const maxHeight = lineHeight * 2
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  useEffect(() => {
    adjustTextarea()
  }, [commentText])

  const canSubmit = commentText.trim().length > 0

  const submitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return

    const newId = Date.now()
    const newComment: Comment = {
      id: newId,
      user: { profileImage: myProfileImage, nickname: '나' },
      createdAt: '방금 전',
      content: commentText,
      isLiked: false,
      likeCount: 0,
    }

    setComments((prev) => [newComment, ...prev])
    setCommentCount((prev) => prev + 1)
    setCommentLike((prev) => ({
      ...prev,
      [newId]: { isLiked: false, likeCount: 0 },
    }))
    setCommentText('')
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  // ----------------------------
  // 공용 Topbar (짧게)
  // ----------------------------
  const Topbar = () => (
    <div className="w-full h-14 p-4 flex justify-between items-center bg-white border-bottom">
      <img
        src="/icons/back.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        className="cursor-pointer brightness-0"
        onClick={handleBack}
      />
      <div className="flex-1 text-center">
        <span className="body-1" style={{ color: 'var(--color-gray-900)' }}>
          피드
        </span>
      </div>
      <div className="w-6" />
    </div>
  )

  if (!post || Number.isNaN(postId)) {
    return (
      <div className="relative w-full min-h-full bg-white">
        <Topbar />
        <div
          className="px-4 py-10 body-2"
          style={{ color: 'var(--color-gray-500)' }}
        >
          존재하지 않는 글이에요.
        </div>
      </div>
    )
  }

  const showCommentHeader = commentCount > 0
  const showCommentList = commentCount > 0 && comments.length > 0

  return (
    <div
      className="relative w-full min-h-full bg-white"
      style={{ paddingBottom: 68 + 20 + 16 }}
    >
      <Topbar />

      {/* =========================
          ✅ 본문(글 1개)
          ✅ 순서: 작품정보 → 이미지 → 본문 → 댓글
         ========================= */}
      <section className="py-5 bg-white">
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

          {/* 점3개 버튼 + 드롭다운(모양만) */}
          <div className="relative" ref={postMenuRef}>
            <button
              className="w-6 h-6 cursor-pointer transition-opacity hover:opacity-70"
              onClick={() => setOpenPostMenu((v) => !v)}
              aria-label="글 메뉴"
            >
              <Image
                src="/icons/menu-3dots.svg"
                alt="메뉴"
                width={24}
                height={24}
              />
            </button>

            {openPostMenu && (
              <div
                className="absolute right-0 top-[28px] z-50 rounded"
                style={{ width: 96, height: 68 }}
              >
                <Image
                  src="/icons/comment-dropdown.svg"
                  alt="드롭다운"
                  width={96}
                  height={68}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />
                <div className="relative w-full h-full">
                  <button
                    type="button"
                    className="w-full h-[34px] cursor-pointer bg-transparent"
                    onClick={() => setOpenPostMenu(false)}
                    aria-label="신고하기"
                  />
                  <button
                    type="button"
                    className="w-full h-[34px] cursor-pointer bg-transparent"
                    onClick={() => setOpenPostMenu(false)}
                    aria-label="차단하기"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅✅ 작품 정보 영역 (요청 코드 그대로) */}
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

            {/* ✅ 작품 정보 + (오른쪽 화살표) 를 같은 라인에 배치 */}
            <div className="flex w-full items-stretch">
              <div className="flex flex-col justify-between w-[210px]">
                {/* 제목 */}
                <p
                  className="text-[16px] font-medium leading-[140%] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: 'var(--color-black)' }}
                >
                  {post.work.title}
                </p>

                {/* 작가 정보 */}
                <p
                  className="text-[12px] font-medium leading-[140%]"
                  style={{ color: 'var(--color-gray-500)' }}
                >
                  {post.work.author} · {post.work.type} · {post.work.genre}
                </p>

                {/* 해시태그 */}
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

              {/* ✅ 오른쪽 12px 패딩 + 상하 중앙 화살표 */}
              <button
                type="button"
                onClick={() => router.push('/feed')}
                className="ml-auto pl-3 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-70"
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

        {/* ✅✅ 피드 이미지: 작품정보 다음 */}
        {post.images && post.images.length > 0 && (
          <div className="mt-4 px-4">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-3">
                {post.images.slice(0, 3).map((src, idx) => (
                  <div
                    key={`${post.id}-img-${idx}`}
                    className="w-[236px] h-[236px] p-2 rounded-xl flex-shrink-0 overflow-hidden"
                    style={{
                      border: '1px solid var(--color-gray-100)',
                      background: 'lightgray',
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

        {/* ✅✅ 본문(전문): 이미지 다음 */}
        <div className="mt-3 px-4">
          <p
            className="whitespace-pre-wrap body-2 pr-10"
            style={{ color: 'var(--color-gray-800)' }}
          >
            {post.content}
          </p>
        </div>

        {/* 반응 영역(글) */}
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
            {commentCount > 0 && (
              <span
                className="ml-1 text-[14px] font-bold leading-[140%]"
                style={{ color: 'var(--color-gray-500)' }}
              >
                {commentCount}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 댓글 헤더: 댓글 n (n=0이면 없음) */}
      {showCommentHeader && (
        <div className="px-4 py-3">
          <p style={{ color: 'var(--color-gray-900)' }} className="body-2">
            댓글 {commentCount}
          </p>
        </div>
      )}

      {/* 댓글 리스트 */}
      {showCommentList &&
        comments.map((c) => (
          <CommentCard
            key={c.id}
            comment={c}
            like={
              commentLike[c.id] ?? {
                isLiked: c.isLiked,
                likeCount: c.likeCount,
              }
            }
            onToggleLike={toggleCommentLike}
          />
        ))}

      {/* 댓글 입력창 (하단 고정) */}
      <div
        className="fixed left-1/2 -translate-x-1/2 bg-white z-50"
        style={{ bottom: 20, width: 393, height: 68 }}
      >
        <div className="w-full h-full p-4 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0">
            <Image
              src={myProfileImage}
              alt="내 프로필"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="flex w-[274px] px-4 py-2 gap-2.5 rounded-[30px] border bg-[var(--color-gray-50)] cursor-text"
            style={{ borderColor: 'var(--color-gray-200)' }}
            onClick={() => textareaRef.current?.focus()}
          >
            <textarea
              ref={textareaRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={1}
              placeholder="댓글을 입력하세요"
              className="w-full bg-transparent outline-none resize-none body-2"
              style={{
                color:
                  commentText.length > 0
                    ? 'var(--color-gray-800)'
                    : 'var(--color-gray-300)',
                caretColor: 'var(--color-gray-800)',
                height: 'auto',
                overflowY: 'hidden',
              }}
            />
            <style jsx>{`
              textarea::placeholder {
                color: var(--color-gray-300);
                opacity: 1;
              }
            `}</style>
          </div>

          <button
            type="button"
            onClick={submitComment}
            className="transition-opacity hover:opacity-70 cursor-pointer"
            aria-label="댓글 등록"
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.4, flexShrink: 0 }}
          >
            <Image
              src="/feed/upload-comment.svg"
              alt="댓글 등록"
              width={36}
              height={36}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function CommentCard({
  comment,
  like,
  onToggleLike,
}: {
  comment: Comment
  like: { isLiked: boolean; likeCount: number }
  onToggleLike: (commentId: number) => void
}) {
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(e.target as Node)) setOpenMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <article
      className="px-4 py-3 flex flex-col gap-3 bg-white border-bottom"
      style={{ borderBottomColor: 'var(--color-gray-100)' }}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0">
            <Image
              src={comment.user.profileImage}
              alt="댓글 프로필"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="ml-2 flex items-center body-2">
            <p style={{ color: 'var(--color-gray-900)' }}>
              {comment.user.nickname}
            </p>
            <span className="mx-1" style={{ color: 'var(--color-gray-300)' }}>
              ·
            </span>
            <p style={{ color: 'var(--color-gray-300)' }}>
              {comment.createdAt}
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            className="w-6 h-6 transition-opacity hover:opacity-70 cursor-pointer"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label="댓글 메뉴"
          >
            <Image
              src="/icons/menu-3dots.svg"
              alt="메뉴"
              width={24}
              height={24}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 top-[28px] z-50 w-[96px] h-[68px] rounded">
              <Image
                src="/icons/comment-dropdown.svg"
                alt="드롭다운"
                width={96}
                height={68}
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
              />
              <div className="relative w-full h-full">
                <button
                  type="button"
                  className="w-full h-[34px] cursor-pointer bg-transparent"
                  onClick={() => setOpenMenu(false)}
                  aria-label="첫번째 메뉴"
                />
                <button
                  type="button"
                  className="w-full h-[34px] cursor-pointer bg-transparent"
                  onClick={() => setOpenMenu(false)}
                  aria-label="두번째 메뉴"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="body-2" style={{ color: 'var(--color-gray-900)' }}>
        {comment.content}
      </p>

      <div className="flex items-center">
        <button
          type="button"
          className="transition-opacity hover:opacity-70 cursor-pointer"
          onClick={() => onToggleLike(comment.id)}
          aria-label="댓글 좋아요"
        >
          <Image
            src={
              like.isLiked
                ? '/icons/icon-like-pink.svg'
                : '/icons/icon-like.svg'
            }
            alt="좋아요"
            width={24}
            height={24}
          />
        </button>

        {like.likeCount > 0 && (
          <span
            className="ml-1 text-[14px] font-bold leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            {like.likeCount}
          </span>
        )}
      </div>
    </article>
  )
}
