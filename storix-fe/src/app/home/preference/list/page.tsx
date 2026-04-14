'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import PreferenceList from '@/components/preference/PreferenceList'
import { usePreference } from '@/components/preference/PreferenceProvider'

type Tab = 'like' | 'dislike'

export default function PreferenceListPage() {
  const router = useRouter()
  const { likedWorks, dislikedWorks } = usePreference()
  const [tab, setTab] = useState<Tab>('like')

  const items = useMemo(
    () => (tab === 'like' ? likedWorks : dislikedWorks),
    [tab, likedWorks, dislikedWorks],
  )

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      {/* 헤더 */}
      <div className="h-[52px] px-4 flex items-center justify-center relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 text-black/70"
          aria-label="back"
        >
          <img src="/common/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>

        <div className="body-1 text-black">취향 저격 작품 탐색</div>

        <button
          type="button"
          onClick={() => router.push('/home/preference/finish')}
          className="absolute right-4 body-1 text-[var(--color-magenta-300)] cursor-pointer"
        >
          완료
        </button>
      </div>

      {/* 탭 */}
      <div className="relative">
        <div className="grid grid-cols-2 body-1 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab('like')}
            className={[
              'py-3 text-center cursor-pointer',
              tab === 'like' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            좋아요
          </button>
          <button
            type="button"
            onClick={() => setTab('dislike')}
            className={[
              'py-3 text-center cursor-pointer',
              tab === 'dislike' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            별로에요
          </button>
        </div>
        <div
          className={[
            'absolute bottom-0 h-[2px] w-1/2 bg-black transition-transform duration-200',
            tab === 'like' ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        />
      </div>

      {/* 리스트 */}
      <div className="px-4 pt-1">
        <PreferenceList items={items} />
      </div>
    </main>
  )
}
