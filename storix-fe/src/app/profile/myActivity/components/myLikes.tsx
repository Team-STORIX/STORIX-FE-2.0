// src/app/profile/myActivity/components/myLikes.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function MyLikes() {
  const router = useRouter()
  // TODO: API 연동 후 실제 데이터로 대체
  const posts = [
    {
      id: 1,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      createdAt: '1일 전',
      work: {
        coverImage: '/works/default-cover.jpg',
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
    },
    {
      id: 2,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      createdAt: '3일 전',
      work: {
        coverImage: '/works/default-cover.jpg',
        title: '상수리 나무 아래',
        author: '서말,나무',
        type: '웹툰',
        genre: '로판',
      },
      hashtags: ['#로판', '#첫사랑'],
      content:
        '이 장면에서 정말 울었어요 ㅠㅠ 감동적이었습니다. 작가님 앞으로도 좋은 작품 부탁드려요! 매화 기다리면서 보고 있습니다.',
      isLiked: true,
      likeCount: 5,
      commentCount: 0,
    },
    {
      id: 3,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      createdAt: '1주 전',
      work: {
        coverImage: '/works/default-cover.jpg',
        title: '상수리 나무 아래',
        author: '서말,나무',
        type: '웹툰',
        genre: '로판',
      },
      hashtags: ['#로판', '#첫사랑', '#성장물'],
      content: '짧은 댓글입니다.',
      isLiked: true,
      likeCount: 1, // 내가 좋아요 누름 -> 최소 1
      commentCount: 3,
    },
  ]

  return (
    <div>
      {posts.map((post) => (
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
                <p
                  className="text-[16px] font-medium leading-[140%]"
                  style={{ color: 'var(--color-gray-900)' }}
                >
                  {post.user.nickname}
                </p>
                <p
                  className="mt-[2px] text-[12px] font-medium leading-[140%]"
                  style={{ color: 'var(--color-gray-300)' }}
                >
                  {post.createdAt}
                </p>
              </div>
            </div>
            <button className="w-6 h-6 transition-opacity hover:opacity-70 cursor-pointer">
              <Image
                src="/icons/menu-3dots.svg"
                alt="메뉴"
                width={24}
                height={24}
              />
            </button>
          </div>

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

          {/* 본문 */}
          <div className="mt-3 px-4">
            <p
              className="text-[14px] font-medium leading-[140%] line-clamp-3"
              style={{ color: 'var(--color-gray-800)' }}
            >
              {post.content}
            </p>
          </div>

          {/* 반응 영역 */}
          <div className="mt-5 px-4 flex items-center">
            {/* 좋아요 */}
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

            {/* 댓글 */}
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
