// src/app/profile/settings/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { withdrawUser } from '@/api/auth/withdraw.api'
import { useAuthStore } from '@/store/auth.store'

export default function SettingsPage() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  const handleWithdraw = async () => {
    if (isWithdrawing) return

    const ok = window.confirm(
      '회원 탈퇴 시 계정 정보는 복구할 수 없어요.\n정말 탈퇴하시겠어요?',
    )
    if (!ok) return

    try {
      setIsWithdrawing(true)

      await withdrawUser()

      // ✅ 인증 정보 정리
      clearAuth()

      // ✅ 로그인 페이지로 이동
      router.replace('/login')
    } catch (error) {
      alert('회원 탈퇴 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div>
      <div className="h-[54px]" />

      <div className="px-4 py-2">
        <div className="relative flex items-center justify-center h-10">
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

          <h1
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            설정
          </h1>
        </div>
      </div>

      <div className="px-4 py-8">
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="w-full h-[50px] border rounded-md
                     border-[var(--color-warning)]
                     text-[14px] font-medium
                     transition-opacity hover:opacity-80
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: 'var(--color-warning)' }}
        >
          {isWithdrawing ? '탈퇴 처리 중...' : '회원탈퇴'}
        </button>
      </div>
    </div>
  )
}
