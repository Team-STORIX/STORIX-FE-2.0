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

const TERMS_URL =
  'https://truth-gopher-09e.notion.site/STORIX-2cae81f7094880c889bfd8300787572a'

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

      const res = await logoutUser()
      if (!res.isSuccess) {
        console.warn('[logout] failed:', res.code, res.message)
      }

      clearAuth()

      clearMe()
      router.replace('/login')
    } catch (error) {
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

      clearAuth()
      clearMe()
      router.replace('/login')
    } catch (error) {
      alert('회원 탈퇴 중 오류가 발생했어요. 다시 시도해주세요.')
    } finally {
      setIsWithdrawing(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* TopBar */}
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

      {/*   내용 영역 */}
      <div className="flex flex-1 flex-col px-4 py-8">
        {/*   상단: 이용약관 */}
        <a
          href={TERMS_URL}
          target="_blank"
          rel="noreferrer"
          className="h-[50px] w-full rounded-md border
                     border-[var(--color-gray-200)]
                     text-[14px] font-medium
                     transition-opacity hover:opacity-80"
          style={{ color: 'var(--color-gray-900)' }}
        >
          <span className="flex h-full w-full items-center justify-center">
            이용약관 보러가기
          </span>
        </a>

        {/*   하단으로 밀기 */}
        <div className="mt-auto space-y-3 pt-10">
          {/* 로그아웃 */}
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

          {/* 회원탈퇴 */}
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
    </div>
  )
}
