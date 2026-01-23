'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTopicRoomMembers } from '@/hooks/topicroom/useTopicRoomMembers'
import { useReportTopicRoomUser } from '@/hooks/topicroom/useReportTopicRoomUser'
import ReportTargetSelect from '@/components/topicroom/report/ReportTargetSelect'
import ReportReasonSelect from '@/components/topicroom/report/ReportReasonSelect'

type ReasonKey = 'ABUSE' | 'REDIRECT' | 'OTHER'

export default function TopicRoomReportPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const roomId = Number(params.id)

  const membersQuery = useTopicRoomMembers(roomId)
  const reportMut = useReportTopicRoomUser()

  const members = membersQuery.data

  const [dropdownOpen, setDropdownOpen] = useState(false) // ✅ UI 변경
  const [reportedUserId, setReportedUserId] = useState<number | null>(null)
  const [reason, setReason] = useState<ReasonKey>('ABUSE')
  const [otherReason, setOtherReason] = useState('')

  const selectedMember = useMemo(
    () => members?.find((m) => m.userId === reportedUserId) ?? null,
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
        <ReportTargetSelect
          members={membersQuery.data} // ✅
          isLoading={membersQuery.isLoading} // ✅
          isError={membersQuery.isError} // ✅
          dropdownOpen={dropdownOpen} // ✅
          setDropdownOpen={setDropdownOpen} // ✅
          reportedUserId={reportedUserId} // ✅
          setReportedUserId={setReportedUserId} // ✅
        />

        {/* 신고 사유 */}
        <ReportReasonSelect
          reason={reason} // ✅
          setReason={setReason} // ✅
          otherReason={otherReason} // ✅
          setOtherReason={setOtherReason} // ✅
          showError={reportMut.isError} // ✅
        />
      </div>
    </div>
  )
}
