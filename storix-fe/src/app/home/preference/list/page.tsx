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
          ←
        </button>

        <div className="text-sm font-semibold text-black">
          취향 저격 작품 탐색
        </div>

        <button
          type="button"
          onClick={() => router.push('/home/preference/finish')}
          className="absolute right-4 text-sm font-semibold text-[var(--color-magenta-300)]"
        >
          완료
        </button>
      </div>

      {/* 탭 */}
      <div className="px-4">
        <div className="grid grid-cols-2 text-sm">
          <button
            type="button"
            onClick={() => setTab('like')}
            className={[
              'py-3 text-center',
              tab === 'like'
                ? 'text-black font-semibold border-b border-black'
                : 'text-black/40',
            ].join(' ')}
          >
            좋아요
          </button>
          <button
            type="button"
            onClick={() => setTab('dislike')}
            className={[
              'py-3 text-center',
              tab === 'dislike'
                ? 'text-black font-semibold border-b border-black'
                : 'text-black/40',
            ].join(' ')}
          >
            별로에요
          </button>
        </div>
      </div>

      {/* 리스트 */}
      <div className="px-4 pt-2">
        <PreferenceList items={items} />
      </div>
    </main>
  )
}
