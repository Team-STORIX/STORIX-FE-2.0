// src/app/profile/components/userProfile.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function UserProfile() {
  // TODO: API 연동 후 실제 데이터로 대체
  const profileImage = '/profile/profile-default.svg'
  const level = 1
  const nickname = '닉네임'
  const bio = '무협이 최고야 짜릿해 언제나 즐거워'

  return (
    <div className="relative flex items-start px-5 py-7">
      {/* 왼쪽: 프로필 이미지 + 유저 정보 */}
      <div className="flex items-start gap-5">
        {/* 프로필 이미지 */}
        <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={profileImage}
            alt="프로필 이미지"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 유저 정보 */}
        <div className="flex flex-col items-start">
          {/* 레벨 */}
          <div
            className="px-2 py-1 rounded-[50px] text-[10px] font-extrabold leading-[140%] tracking-[0.2px]"
            style={{
              backgroundColor: '#FF80B3',
              color: 'var(--color-gray-900)',
            }}
          >
            Lv.{level}
          </div>

          {/* 닉네임 */}
          <p
            className="mt-[7px] text-[18px] font-semibold leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {nickname}
          </p>

          {/* 한줄소개 */}
          <p
            className="mt-[7px] text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-600)' }}
          >
            {bio}
          </p>
        </div>
      </div>

      {/* 오른쪽: 프로필 수정 화살표 - 닉네임 높이에 맞춤 */}
      <Link
        href="/profile/fix"
        className="absolute right-5 transition-opacity hover:opacity-70"
        style={{ top: 'calc(28px + 20px + 7px)' }}
      >
        <Image
          src="/icons/arrow-next.svg"
          alt="프로필 수정"
          width={16}
          height={16}
        />
      </Link>
    </div>
  )
}
