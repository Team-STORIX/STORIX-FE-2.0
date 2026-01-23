'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTopicRoomMembers } from '@/hooks/topicroom/useTopicRoomMembers'
import { useReportTopicRoomUser } from '@/hooks/topicroom/useReportTopicRoomUser'

type ReasonKey = 'ABUSE' | 'REDIRECT' | 'OTHER'

export default function TopicRoomReportPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const roomId = Number(params.id)

  const membersQuery = useTopicRoomMembers(roomId)
  const reportMut = useReportTopicRoomUser()

  const members = membersQuery.data ?? []

  const [dropdownOpen, setDropdownOpen] = useState(false) // ✅ UI 변경
  const [reportedUserId, setReportedUserId] = useState<number | null>(null)
  const [reason, setReason] = useState<ReasonKey>('ABUSE')
  const [otherReason, setOtherReason] = useState('')

  const selectedMember = useMemo(
    () => members.find((m) => m.userId === reportedUserId) ?? null,
    [members, reportedUserId],
  )

  const isOther = reason === 'OTHER'
  const otherLen = otherReason.length
  const otherValid = !isOther || otherLen > 0
  const hasTarget = reportedUserId !== null
  const canSubmit =
    Number.isFinite(roomId) &&
    roomId > 0 &&
    hasTarget &&
    otherValid &&
    !reportMut.isPending

  // ✅ onSuccess 금지 → useEffect로 처리
  useEffect(() => {
    if (!reportMut.isSuccess) return
    router.back()
  }, [reportMut.isSuccess, router])

  const onSubmit = () => {
    if (!canSubmit || reportedUserId === null) return
    reportMut.mutate({
      roomId,
      reportedUserId,
      reason,
      otherReason: isOther ? otherReason : null,
    })
  }

  return (
    <div className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-8 w-8 cursor-pointer"
        >
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>

        <p className="body-1 text-black">신고하기</p>

        <button
          type="button"
          onClick={onSubmit} // ✅
          disabled={!canSubmit} // ✅ UI 변경
          className={[
            'body-2 cursor-pointer',
            canSubmit ? 'text-[var(--color-magenta-300)]' : 'text-gray-300',
          ].join(' ')} // ✅ UI 변경
        >
          완료
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="caption-1 text-gray-500 list-disc pl-5 space-y-1">
          <li>
            대화 중 불쾌한 상황이 발생했다면, 다른 유저를 신고할 수 있어요
          </li>
          <li>
            신고 내용이 사실과 다를 경우 제재를 받을 수 있으니 주의해주세요
          </li>
          <li>신고 대상인 유저의 닉네임을 정확히 선택해주세요</li>
        </ul>

        {/* 신고 대상 */}
        <div className="mt-6">
          <p className="heading-2 text-black">신고 대상</p>
          <p className="caption-1 mt-2 text-gray-500">
            신고할 유저를 선택해주세요
          </p>

          <div className="relative mt-3">
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)} // ✅ UI 변경
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex-shrink-0" />
                <span className="body-2 text-gray-800 flex-1 min-w-0 truncate">
                  {selectedMember
                    ? selectedMember.nickName
                    : membersQuery.isLoading
                      ? '불러오는 중...'
                      : '유저 선택'}
                </span>
              </div>
              <span className="text-gray-400">⌄</span>
            </button>

            {/* ✅ UI 변경: 드롭다운 */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-[52px] z-20 max-h-[220px] overflow-auto rounded-xl border border-gray-100 bg-white shadow-md">
                {membersQuery.isLoading ? (
                  <div className="px-4 py-3 body-2 text-gray-500">
                    불러오는 중...
                  </div>
                ) : members.length === 0 ? (
                  <div className="px-4 py-3 body-2 text-gray-500">
                    참여자가 없어요
                  </div>
                ) : (
                  members.map((m) => (
                    <button
                      key={m.userId}
                      type="button"
                      onClick={() => {
                        setReportedUserId(m.userId) // ✅
                        setDropdownOpen(false) // ✅
                      }}
                      className="w-full px-4 py-3 text-left body-2 text-gray-800 hover:bg-gray-50 cursor-pointer"
                    >
                      {m.nickName}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 신고 사유 */}
        <div className="mt-8">
          <p className="heading-2 text-black">신고 사유</p>
          <p className="caption-1 mt-2 text-gray-500">
            구체적인 신고 사유를 선택해주세요
          </p>

          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={reason === 'ABUSE'}
                onChange={() => setReason('ABUSE')}
              />
              <span className="body-2 text-gray-800">
                욕설, 비방, 혐오 표현을 해요
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={reason === 'REDIRECT'}
                onChange={() => setReason('REDIRECT')}
              />
              <span className="body-2 text-gray-800">
                보이스 피싱과 같이 다른 채널로 유도해요
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={reason === 'OTHER'}
                onChange={() => setReason('OTHER')}
              />
              <span className="body-2 text-gray-800">기타</span>
            </label>
          </div>

          {/* 기타 사유 입력 */}
          <div className="mt-4 relative">
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value.slice(0, 100))} // ✅
              placeholder="신고 사유를 상세히 남겨 주세요"
              className="w-full h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3 body-2 outline-none resize-none"
              disabled={!isOther} // ✅ UI 변경
            />
            <span className="absolute bottom-3 right-4 caption-1 text-[var(--color-magenta-300)]">
              {otherLen}/100
            </span>
          </div>

          {/* 에러(간단) */}
          {reportMut.isError && (
            <p className="mt-3 caption-1 text-[var(--color-magenta-300)]">
              신고에 실패했어요. 다시 시도해주세요.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
