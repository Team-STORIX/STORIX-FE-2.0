// ✅ src/app/feed/write/WriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateReaderBoard } from '@/hooks/plus/useCreateReaderBoard'
import ImagePicker from '@/components/feed/ImagePicker'
import WriteBottomSheet from '@/components/home/bottomsheet/WriteBottomSheet'

type SelectedWork = {
  id: number
  title: string
  meta: string
  thumb: string
}

const STORAGE_KEY_FEED = 'storix:selectedWork:feed'

export default function WriteClient() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [selectedWork, setSelectedWork] = useState<SelectedWork | null>(null)
  const [isWorksNotNeeded, setIsWorksNotNeeded] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [images, setImages] = useState<File[]>([])

  const createBoard = useCreateReaderBoard()

  // ✅ 새로고침/재진입 시 작품 선택 복구
  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY_FEED)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as SelectedWork
      if (parsed?.id) setSelectedWork(parsed)
    } catch {
      // ignore
    }
  }, [])

  const content = text.trim()

  const canSubmit = useMemo(() => {
    if (content.length === 0) return false
    if (content.length > 500) return false

    // 작품 선택이 필요 없는 경우엔 작품 없이도 OK
    if (isWorksNotNeeded) return true

    // 작품 선택이 필요한 경우엔 선택된 작품이 있어야 함
    if (!selectedWork?.id) return false
    return true
  }, [content.length, isWorksNotNeeded, selectedWork?.id])

  const handleToggleWorksNotNeeded = () => {
    setIsWorksNotNeeded((prev) => {
      const next = !prev

      if (next) {
        // ✅ 토글 ON: 작품 정보/검색바 숨김 + 선택값 제거
        setSelectedWork(null)
        sessionStorage.removeItem(STORAGE_KEY_FEED)
      }

      return next
    })
  }

  const onSubmit = async () => {
    if (!canSubmit || createBoard.isPending) return

    const isWorksSelected = !isWorksNotNeeded && !!selectedWork?.id
    const worksId = selectedWork?.id ?? 0

    try {
      await createBoard.mutateAsync({
        isWorksSelected,
        worksId,
        isSpoiler: spoiler,
        content,
        images,
      })

      // ✅ 성공하면 저장값 제거(다음 글쓰기 때 헷갈림 방지)
      sessionStorage.removeItem(STORAGE_KEY_FEED)

      // ✅ 목록 최신화
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      queryClient.invalidateQueries({ queryKey: ['plus', 'board'] })

      router.replace('/feed')
    } catch (e) {
      alert(e instanceof Error ? e.message : '피드 등록 실패')
    }
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <span className="text-body-1 font-medium">피드</span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || createBoard.isPending}
          className={
            canSubmit
              ? 'text-[var(--color-magenta-500)] cursor-pointer'
              : 'text-gray-500'
          }
        >
          완료
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        {/* 작품 선택 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="heading-2 mt-6">작품선택</span>
          <div className="mt-6 flex items-center gap-1">
            <span className="caption-1 text-gray-500">
              작품선택이 필요없어요
            </span>
            <button
              type="button"
              onClick={handleToggleWorksNotNeeded}
              aria-pressed={isWorksNotNeeded}
              aria-label="작품선택 필요없음 토글"
              className="ml-auto cursor-pointer hover:opacity-80"
            >
              <img
                src={
                  isWorksNotNeeded
                    ? '/common/icons/active.svg'
                    : '/common/icons/deactive.svg'
                }
                alt={isWorksNotNeeded ? '활성' : '비활성'}
                className="h-4.5 w-8"
              />
            </button>
          </div>
        </div>

        {!isWorksNotNeeded && (
          <>
            {/* SearchBar 영역: 클릭하면 바텀시트 오픈 */}
            <button
              type="button"
              onClick={() => setIsSheetOpen(true)}
              className="relative mb-6 w-full rounded-lg bg-gray-50 border border-gray-50 px-2 py-3 body-1 cursor-text text-left"
            >
              <span className=" text-gray-400">
                함께 이야기하고 싶은 작품을 검색하세요
              </span>
              <Image
                src="/common/icons/search.svg"
                alt="검색"
                width={20}
                height={20}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              />
            </button>

            {/* 선택 작품 표시 (바텀시트 결과 UI와 동일한 레이아웃) */}
            {selectedWork && (
              <div className="mb-6 flex flex-1 min-w-0 items-center gap-3 rounded-sm">
                <div className="relative h-[116px] w-[87px] shrink-0 overflow-hidden rounded-md bg-gray-100">
                  {selectedWork.thumb ? (
                    <Image
                      src={selectedWork.thumb}
                      alt={selectedWork.title}
                      className="object-cover"
                      width={87}
                      height={116}
                    />
                  ) : null}
                </div>
                <div className="flex-1 flex flex-col min-w-0 items-start pr-2">
                  <span className="heading-4 w-full truncate text-left">
                    {selectedWork.title}
                  </span>
                  <span className="caption-1 w-full truncate text-left text-gray-500">
                    {selectedWork.meta}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* 게시글 작성 */}
        <div className="flex items-center justify-between -mx-4 px-4 border-t border-gray-100">
          <span className="heading-2 mt-6">게시글 작성</span>
          <div className="mt-6 flex items-center gap-1">
            <span className="caption-1 text-gray-500">스포일러 방지</span>
            <button
              type="button"
              onClick={() => setSpoiler((prev) => !prev)}
              aria-pressed={spoiler}
              aria-label="스포일러 방지 토글"
              className="ml-auto cursor-pointer hover:opacity-80"
            >
              <img
                src={
                  spoiler
                    ? '/common/icons/active.svg'
                    : '/common/icons/deactive.svg'
                }
                alt={spoiler ? '활성' : '비활성'}
                className="h-4.5 w-8"
              />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="좋아하는 작품에 대해 적어보세요!"
          className="mt-4 h-60 w-full resize-none body-1 text-gray-700 outline-none"
        />

        <div className="flex justify-between items-center py-3 -mx-4 px-4 border-t border-gray-300 caption-1 text-gray-400">
          <ImagePicker files={images} onChange={setImages} max={3} />
          {content.length}/300
        </div>
      </div>

      {isSheetOpen && (
        <WriteBottomSheet
          onClose={() => setIsSheetOpen(false)}
          onPick={(work) => {
            setSelectedWork(work)
            setIsWorksNotNeeded(false)
          }}
        />
      )}
    </main>
  )
}
