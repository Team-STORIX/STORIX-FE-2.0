// src/components/topicroom/TopicRoomCreateModal.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { createTopicRoom } from '@/lib/api/topicroom/topicroom.api'

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

type Step = 1 | 2 | 3 | 4

const isValidTopicTitle = (v: string) => /^[0-9A-Za-z가-힣]{2,10}$/.test(v)

export default function TopicRoomCreateModal({ open, onClose, work }: Props) {
  const router = useRouter()

  const [step, setStep] = useState<Step>(1)
  const [topicRoomName, setTopicRoomName] = useState('')
  const [createdRoomId, setCreatedRoomId] = useState<number | null>(null)

  const [isOpenAnim, setIsOpenAnim] = useState(false)

  // 모달 열릴 때 초기화 + 애니메이션
  useEffect(() => {
    if (!open) return
    setStep(1)
    setTopicRoomName('')
    setCreatedRoomId(null)
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
    return '한글,영문,숫자만 / 2~10자만 가능해요'
  }, [topicRoomName, canCreate])

  const createMut = useMutation({
    mutationFn: () => createTopicRoom({ worksId: work.id, topicRoomName }),
    onSuccess: (roomId) => {
      setCreatedRoomId(roomId)
      setStep(4)
    },
  })

  const onCreate = () => {
    if (!canCreate || createMut.isPending) return
    createMut.mutate()
  }

  const onGoRoom = () => {
    if (!createdRoomId) return
    closeWithAnim()
    router.push(
      `/home/topicroom/${createdRoomId}?worksName=${encodeURIComponent(work.title)}`,
    )
  }

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
          <button type="button" onClick={closeWithAnim} aria-label="닫기">
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
                className="mt-6 h-12 w-full rounded-xl bg-black text-body-1 text-white"
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
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-magenta-100)]">
                  <span className="text-[var(--color-magenta-300)]">!</span>
                </div>

                <p className="caption-1 whitespace-pre-line text-center text-[var(--color-magenta-300)]">
                  특정 이용이나 집단을 비방하는 내용{'\n'}
                  비속어, 혐오 표현이 포함된 내용
                </p>

                <p className="caption-1 whitespace-pre-line text-center text-gray-400">
                  모두가 함께 사용하는 커뮤니티예요.{'\n'}
                  아래와 같은 제목은 삼가해주세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="mt-6 h-12 w-full rounded-xl bg-black text-body-1 text-white"
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
                      ? 'text-gray-400'
                      : canCreate
                        ? 'text-green-600'
                        : 'text-[var(--color-magenta-300)]',
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
                  'mt-6 h-12 w-full rounded-xl text-body-1',
                  canCreate && !createMut.isPending
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-400',
                ].join(' ')}
              >
                {createMut.isPending ? '생성 중...' : '토픽룸 생성하기'}
              </button>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <p className="heading-2 text-center text-black">
                첫 토픽룸이 만들어졌어요!
              </p>
              <p className="caption-1 mt-2 text-center text-gray-500">
                이제 토픽룸에서 자유롭게 이야기해 보아요!
              </p>

              <div className="mt-5 flex justify-center">
                <div className="relative w-[210px] overflow-hidden rounded-2xl bg-gray-100">
                  <div className="relative h-[280px] w-full">
                    <Image
                      src={work.thumb}
                      alt={work.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-black/0 p-3">
                    <div className="flex items-center gap-2">
                      <span className="caption-1 rounded-md bg-white/90 px-2 py-1 text-black">
                        🔥 HOT
                      </span>
                      <span className="caption-1 rounded-md bg-[var(--color-magenta-300)] px-2 py-1 text-white">
                        1층
                      </span>
                    </div>

                    <p className="body-2 mt-2 text-white">{work.title}</p>
                    <p className="caption-1 mt-1 text-white/80">
                      {topicRoomName}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onGoRoom}
                className="mt-6 h-12 w-full rounded-xl bg-black text-body-1 text-white"
              >
                토픽룸으로 이동
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
