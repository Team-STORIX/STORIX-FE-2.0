// src/app/profile/settings/page.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function SettingsPage() {
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

      {/* TODO: 설정 컨텐츠 추가 */}
      <div className="px-4 py-8">
        <p style={{ color: 'var(--color-gray-500)' }}>설정 페이지</p>
      </div>
    </div>
  )
}
