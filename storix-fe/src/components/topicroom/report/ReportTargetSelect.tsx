// src/components/topicroom/report/ReportTargetSelect.tsx
'use client'

import Image from 'next/image'
import { useMemo } from 'react'

type Member = {
  userId: number
  nickName: string
  profileImageUrl?: string | null
}

type Props = {
  members: Member[] | undefined
  isLoading: boolean
  isError: boolean
  dropdownOpen: boolean
  setDropdownOpen: (v: boolean) => void
  reportedUserId: number | null
  setReportedUserId: (id: number) => void
}

export default function ReportTargetSelect({
  members,
  isLoading,
  isError,
  dropdownOpen,
  setDropdownOpen,
  reportedUserId,
  setReportedUserId,
}: Props) {
  const hasTarget = reportedUserId !== null

  const selectedMember = useMemo(
    () => members?.find((m) => m.userId === reportedUserId) ?? null,
    [members, reportedUserId],
  )

  const labelText = selectedMember
    ? selectedMember.nickName
    : isLoading
      ? '불러오는 중...'
      : '유저 선택'

  const getProfileImgSrc = (raw?: string | null) => {
    if (!raw) return null
    if (raw.startsWith('http')) return encodeURI(raw)
    return encodeURI(
      `https://api.storix.kr/${raw.replace(/^\/+/, '').replace(/^public\//, '')}`,
    )
  }

  return (
    <div className="mt-6">
      <p className="heading-2 text-black">신고 대상</p>
      <p className="caption-1 mt-2 text-gray-500">신고할 유저를 선택해주세요</p>

      <div className="relative mt-3">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)} //
          className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0" />
            <span className="body-2 text-gray-800 flex-1 min-w-0 truncate">
              {labelText}
            </span>
          </div>
          <Image
            src="/icons/arrow-down.svg"
            alt="드롭다운 열기"
            width={24}
            height={24}
          />
        </button>
        {!hasTarget && (
          <p className="mt-2 caption-1 text-[var(--color-magenta-300)]">
            신고 대상을 선택해주세요
          </p>
        )}{' '}
        {/*   UI 변경 */}
        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-[52px] z-20 max-h-[220px] overflow-auto rounded-xl border border-gray-100 bg-white shadow-md">
            {isLoading ? (
              <div className="px-4 py-3 body-2 text-gray-500">
                불러오는 중...
              </div>
            ) : isError ? (
              <div className="px-4 py-3 body-2 text-[var(--color-magenta-300)]">
                참여자 불러오기에 실패했어요
              </div>
            ) : (members?.length ?? 0) === 0 ? (
              <div className="px-4 py-3 body-2 text-gray-500">
                참여자가 없어요
              </div>
            ) : (
              members!.map((m) => {
                const imgSrc = getProfileImgSrc(m.profileImageUrl)
                return (
                  <button
                    key={m.userId}
                    type="button"
                    onClick={() => {
                      setReportedUserId(m.userId) //
                      setDropdownOpen(false) //
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none' //   (401/403/404 등 fallback)
                          }}
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0" />
                      )}
                      <span className="body-2 text-gray-800 flex-1 min-w-0 truncate">
                        {m.nickName}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
