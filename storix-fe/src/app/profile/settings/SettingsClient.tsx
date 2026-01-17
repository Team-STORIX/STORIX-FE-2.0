// src/app/profile/settings/SettingsClient.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { withdrawUser } from '@/api/auth/withdraw.api'
import { logoutUser } from '@/api/auth/logout.api'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'

export default function SettingsClient() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const clearMe = useProfileStore((s) => s.clearMe)

  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    const ok = window.confirm('로그아웃 하시겠어요?')
    if (!ok) return

    try {
      setIsLoggingOut(true)

      // ✅ 서버 로그아웃 호출 (accessToken은 interceptor가 자동 첨부)
      const res = await logoutUser()
      if (!res.isSuccess) {
        // 서버가 실패를 내려줘도, 클라에서는 로그아웃 처리하는 게 UX상 안전
        console.warn('[logout] failed:', res.code, res.message)
      }

      // ✅ 인증/프로필 전역 상태 정리
      clearAuth()
      clearMe()

      // ✅ 로그인 페이지로 이동
      router.replace('/login')
    } catch (error) {
      // 네트워크 에러여도 로컬 상태는 지워서 “확실히 로그아웃” 처리
      console.error('[logout] error:', error)
      clearAuth()
      clearMe()
      router.replace('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleWithdraw = async () => {
    if (isWithdrawing) return

    const ok = window.confirm(
      '회원 탈퇴 시 계정 정보는 복구할 수 없어요.\n정말 탈퇴하시겠어요?',
    )
    if (!ok) return

    try {
      setIsWithdrawing(true)

      await withdrawUser()

      // ✅ 인증/프로필 전역 상태 정리
      clearAuth()
      clearMe()

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
        <div className="relative flex h-10 items-center justify-center">
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

      <div className="space-y-3 px-4 py-8">
        {/* ✅ 로그아웃 (탈퇴 위) */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut || isWithdrawing}
          className="h-[50px] w-full rounded-md border
                     border-[var(--color-gray-200)]
                     text-[14px] font-medium
                     transition-opacity hover:opacity-80
                     disabled:cursor-not-allowed disabled:opacity-50"
          style={{ color: 'var(--color-gray-900)' }}
        >
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </button>

        {/* ✅ 회원탈퇴 */}
        <button
          type="button"
          onClick={handleWithdraw}
          disabled={isWithdrawing || isLoggingOut}
          className="h-[50px] w-full rounded-md border
                     border-[var(--color-warning)]
                     text-[14px] font-medium
                     transition-opacity hover:opacity-80
                     disabled:cursor-not-allowed disabled:opacity-50"
          style={{ color: 'var(--color-warning)' }}
        >
          {isWithdrawing ? '탈퇴 처리 중...' : '회원탈퇴'}
        </button>
      </div>
    </div>
  )
}
