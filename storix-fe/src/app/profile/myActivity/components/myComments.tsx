// src/app/profile/myActivity/components/myComments.tsx
'use client'

import Image from 'next/image'

export default function MyComments() {
  // TODO: API 연동 후 실제 데이터로 대체
  const comments = [
    {
      id: 1,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      content: '정말 재미있는 작품이에요! 다음화가 너무 기대됩니다.',
      isLiked: true,
      likeCount: 12,
      createdAt: '1일 전',
    },
    {
      id: 2,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      content: '주인공의 성장 과정이 인상 깊었어요. 작가님 최고!',
      isLiked: false,
      likeCount: 5,
      createdAt: '3일 전',
    },
    {
      id: 3,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      content:
        '이 작품을 보면서 정말 많은 감동을 받았습니다. 특히 주인공이 역경을 헤쳐나가는 모습이 너무 인상 깊었고, 주변 인물들과의 관계 형성 과정도 자연스러워서 몰입감이 대단했어요. 작가님의 섬세한 묘사 덕분에 캐릭터들이 살아 숨쉬는 것 같았고, 스토리 전개도 탄탄해서 다음 화가 너무 기대됩니다. 앞으로도 좋은 작품 부탁드려요! 항상 응원하고 있습니다. 정말 최고의 작품이에요.',
      isLiked: false,
      likeCount: 0,
      createdAt: '1주 전',
    },
    {
      id: 4,
      user: {
        profileImage: '/profile/profile-default.svg',
        nickname: '닉네임',
      },
      content: '짧은 댓글',
      isLiked: true,
      likeCount: 1,
      createdAt: '2주 전',
    },
  ]

  return (
    <div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="px-4 py-3 flex flex-col gap-3"
          style={{
            borderBottom: '1px solid var(--color-gray-100)',
            backgroundColor: 'var(--color-white)',
          }}
        >
          {/* 프로필 영역 */}
          <div className="flex items-center h-8">
            {/* 프로필 이미지 */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--color-gray-200)] flex-shrink-0">
              <Image
                src={comment.user.profileImage}
                alt="프로필"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 닉네임 */}
            <p
              className="ml-2 text-[14px] font-medium leading-[140%]"
              style={{ color: 'var(--color-gray-900)' }}
            >
              {comment.user.nickname}
            </p>
          </div>

          {/* 댓글 내용 */}
          <p
            className="text-[14px] font-medium leading-[140%] break-words"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {comment.content}
          </p>

          {/* 좋아요 */}
          <div className="flex items-center">
            <Image
              src={
                comment.isLiked
                  ? '/icons/icon-like-pink.svg'
                  : '/icons/icon-like.svg'
              }
              alt="좋아요"
              width={24}
              height={24}
            />
            {comment.likeCount > 0 && (
              <span
                className="ml-1 text-[14px] font-bold leading-[140%]"
                style={{ color: 'var(--color-gray-500)' }}
              >
                {comment.likeCount}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
