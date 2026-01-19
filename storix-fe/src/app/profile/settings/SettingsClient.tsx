// src/app/profile/settings/SettingsClient.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { withdrawUser } from '@/lib/api/auth/withdraw.api'
import { useAuthStore } from '@/store/auth.store'

export default function SettingsClient() {
  const router = useRouter()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  // ✅ 기존에 쓰던 useState들 있으면 그대로 유지
  // const [open, setOpen] = useState(false)

  const handleWithdraw = async () => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(
        '회원 탈퇴 시 계정 정보는 복구할 수 없어요.\n정말 탈퇴하시겠어요?',
      )
    if (!ok) return

    try {
      await withdrawUser()
      clearAuth()
      router.replace('/login')
    } catch {
      alert('회원 탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  return (
    // ✅ 배포 모바일에서 회색 비침 방지 + ✅ NavBar 가림 방지
    <div className="min-h-full w-full bg-white pb-32">
      {/* StatusBar 높이만큼 */}
      <div className="h-[54px]" />

      {/* ===== 여기부터는 너 기존 settings/page.tsx 내용 그대로 옮기기 ===== */}
      {/* 예: 헤더 */}
      <div className="px-4 py-2">
        <div className="relative flex h-10 items-center justify-center">
          <Link
            href="/profile"
            className="absolute left-0 flex h-10 w-10 items-center justify-center"
          >
            <Image
              src="/icons/back.svg"
              alt="뒤로가기"
              width={24}
              height={24}
            />
          </Link>

          <h1 className="text-[16px] font-medium leading-[140%] text-[var(--color-gray-900)]">
            설정
          </h1>
        </div>
      </div>

      {/* 설정 컨텐츠 */}
      <div className="px-4 py-8">
        <button
          type="button"
          onClick={handleWithdraw}
          className="h-[50px] w-full rounded-md border border-[var(--color-warning)] text-[14px] font-medium transition-opacity hover:opacity-80 cursor-pointer"
          style={{ color: 'var(--color-warning)' }}
        >
          회원탈퇴
        </button>
      </div>

      {/* ===== 기존 코드 끝 ===== */}
    </div>
  )
}
