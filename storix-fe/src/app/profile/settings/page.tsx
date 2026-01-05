// src/app/profile/settings/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function SettingsPage() {
  const handleWithdraw = () => {
    // TODO: 회원탈퇴 확인 모달 → 탈퇴 API 연동
    console.log('회원탈퇴 클릭')
  }

  return (
    <div>
      {/* 상단 54px 공백 */}
      <div className="h-[54px]" />

      {/* 헤더 */}
      <div className="px-4 py-2">
        <div className="relative flex items-center justify-center h-10">
          {/* 왼쪽: 뒤로가기 */}
          <Link
            href="/profile"
            className="absolute left-0 transition-opacity hover:opacity-70"
          >
            <Image
              src="/icons/back.svg"
              alt="뒤로가기"
              width={24}
              height={24}
            />
          </Link>

          {/* 가운데: 설정 */}
          <h1
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            설정
          </h1>
        </div>
      </div>

      {/* 설정 컨텐츠 */}
      <div className="px-4 py-8 space-y-6">
        <p style={{ color: 'var(--color-gray-500)' }}>설정 페이지</p>

        {/* 회원탈퇴 */}
        <button
          type="button"
          onClick={handleWithdraw}
          className="
            w-full h-[48px]
            flex items-center justify-center
            border border-[var(--color-warning)]
            rounded-md
            text-[14px] font-medium
            transition-opacity
            hover:opacity-80
          "
          style={{ color: 'var(--color-warning)' }}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  )
}
