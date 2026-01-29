// src/components/topicroom/TopicRoomCreateModal.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateTopicRoom } from '@/hooks/topicroom/useCreateTopicRoom'

type WorkMini = {
  id: number
  title: string
  meta: string
  thumb: string
}

type Props = {
  open: boolean
  onClose: () => void
  work: WorkMini
}

type Step = 1 | 2 | 3

const isValidTopicTitle = (v: string) => /^[0-9A-Za-z가-힣]{2,10}$/.test(v)

export default function TopicRoomCreateModal({ open, onClose, work }: Props) {
  const router = useRouter()

  const [step, setStep] = useState<Step>(1)
  const [topicRoomName, setTopicRoomName] = useState('')
  const didNavigateRef = useRef(false) // ✅ 성공 후 페이지 이동 중복 방지

  const [isOpenAnim, setIsOpenAnim] = useState(false)

  // 모달 열릴 때 초기화 + 애니메이션
  useEffect(() => {
    if (!open) return
    setStep(1)
    setTopicRoomName('')
    didNavigateRef.current = false // ✅ 모달 재오픈 시 리셋
    requestAnimationFrame(() => setIsOpenAnim(true))
  }, [open])

  const closeWithAnim = () => {
    setIsOpenAnim(false)
    setTimeout(onClose, 180)
  }

  const canCreate = useMemo(
    () => isValidTopicTitle(topicRoomName),
    [topicRoomName],
  )

  const helperText = useMemo(() => {
    if (topicRoomName.length === 0)
      return '한글,영문,숫자 2~10자까지 입력 가능해요'
    if (canCreate) return '사용 가능한 제목이에요'
    return '한글,영문,숫자 2~10자까지 입력 가능해요'
  }, [topicRoomName, canCreate])

  // ✅ API 직접 호출 금지 -> React Query 훅으로 통일
  const createMut = useCreateTopicRoom()

  const onCreate = () => {
    if (!canCreate || createMut.isPending) return
    createMut.mutate({ worksId: work.id, topicRoomName })
  }

  // ✅ 3단계에서 생성 성공 -> 4단계는 모달이 아닌 페이지로 라우팅
  useEffect(() => {
    if (!open) return
    if (step !== 3) return
    if (!createMut.data) return
    if (didNavigateRef.current) return

    didNavigateRef.current = true
    closeWithAnim()
    router.push(
      `/library/works/${work.id}/topicroom?topicRoomId=${createMut.data}&topicRoomName=${encodeURIComponent(
        topicRoomName,
      )}`,
    )
  }, [open, step, createMut.data, router, work.id, topicRoomName])

  if (!open) return null

  return (
    <div
      className={[
        'fixed inset-0 z-[200] flex items-center justify-center px-4',
        'transition-opacity duration-200',
        isOpenAnim ? 'bg-black/40 opacity-100' : 'bg-black/0 opacity-0',
      ].join(' ')}
      onClick={closeWithAnim}
    >
      <div
        className={[
          'w-full max-w-[353px] rounded-2xl bg-white shadow-lg',
          'transition-transform duration-200',
          isOpenAnim ? 'scale-100' : 'scale-95',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            type="button"
            onClick={closeWithAnim}
            aria-label="닫기"
            className="cursor-pointer"
          >
            <Image
              src="/common/icons/cancel.svg"
              alt="닫기"
              width={18}
              height={18}
            />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <p className="heading-2 text-center text-black">축하합니다!</p>
              <p className="body-2 mt-2 whitespace-pre-line text-center text-gray-500">
                작품의 첫 입장자예요 🎉{'\n'}
                함께 이야기할 수 있는 토픽룸을 만들어주세요!
              </p>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-7 h-12 w-full rounded-xl bg-black text-body-1 text-white cursor-pointer"
              >
                다음으로
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <p className="heading-2 text-center text-black">
                토픽룸 생성 주의사항
              </p>

              <div className="mt-3 flex flex-col items-center gap-2">
                <p className="body-2 whitespace-pre-line text-center text-gray-400">
                  모두가 함께 사용하는 커뮤니티예요.{'\n'}
                  아래와 같은 제목은 삼가해주세요.
                </p>
                <div className="flex pt-4 items-center justify-center">
                  <Image
                    src="/common/icons/warningSmall.svg"
                    alt="경고"
                    width={40}
                    height={40}
                    priority
                  />
                </div>

                <p className="caption-1 whitespace-pre-line text-center text-[var(--color-magenta-300)]">
                  특정 이용이나 집단을 비방하는 내용{'\n'}
                  비속어, 혐오 표현이 포함된 내용
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="mt-6 h-12 w-full rounded-xl bg-black text-body-1 text-white cursor-pointer"
              >
                네, 확인했어요.
              </button>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <p className="heading-2 text-center text-black">
                토픽룸 생성하기
              </p>
              <p className="caption-1 mt-2 text-center text-gray-500">
                토픽룸의 제목을 지정해주세요
              </p>

              <div className="mt-5">
                <input
                  value={topicRoomName}
                  onChange={(e) => setTopicRoomName(e.target.value)}
                  placeholder="토픽룸의 제목을 입력해주세요"
                  className="w-full rounded-xl bg-gray-50 px-4 py-3 text-body-2 outline-none"
                />

                <p
                  className={[
                    'caption-1 mt-2',
                    topicRoomName.length === 0
                      ? 'text-[var(--color-warning)]'
                      : canCreate
                        ? 'text-[var(--color-success)]'
                        : 'text-[var(--color-warning)]',
                  ].join(' ')}
                >
                  {helperText}
                </p>
              </div>

              <button
                type="button"
                disabled={!canCreate || createMut.isPending}
                onClick={onCreate}
                className={[
                  'mt-6 h-12 w-full rounded-xl text-body-1 cursor-pointer',
                  canCreate && !createMut.isPending
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-400',
                ].join(' ')}
              >
                {createMut.isPending ? '생성 중...' : '토픽룸 생성하기'}
              </button>
            </>
          )}

          {/* ✅ Step 4는 페이지로 이동하므로 모달에서 제거 */}
        </div>
      </div>
    </div>
  )
}
