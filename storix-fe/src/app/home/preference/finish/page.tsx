'use client'

import { useRouter } from 'next/navigation'
import { usePreference } from '@/components/preference/PreferenceProvider'

export default function PreferenceFinishPage() {
  const router = useRouter()
  const { likedWorks } = usePreference()

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-black">축하해요!</div>
          <div className="mt-3 text-sm text-black/60">
            {likedWorks.length}개의 새로운 관심 작품이 등록됐어요! <br />
            피드에서 작품의 소식을 확인해봐요!
          </div>

          <div className="mt-10 flex items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full bg-[var(--color-magenta-300)]/20 flex items-center justify-center">
              <div className="text-4xl text-[var(--color-magenta-300)]">✦</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <button
          type="button"
          onClick={() => router.push('/home')}
          className="w-full h-[56px] rounded-full bg-black text-white body-2 font-semibold"
        >
          홈으로 돌아가기
        </button>
      </div>
    </main>
  )
}
