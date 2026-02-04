'use client'

import { useRouter } from 'next/navigation'
import { usePreference } from '@/components/preference/PreferenceProvider'

export default function PreferenceFinishPage() {
  const router = useRouter()
  const { likedWorks } = usePreference()

  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex justify-center px-6">
        <div className="text-center mt-24">
          <div className="heading-1 text-black">축하해요!</div>
          <div className="mt-1 body-1 text-gray-500">
            {likedWorks.length}개의 새로운 관심 작품이 등록됐어요! <br />
            피드에서 작품의 소식을 확인해봐요!
          </div>
        </div>
      </div>

      <img
        src="/image/finishStar.webp"
        alt="finish star illustration"
        className="flex mt-18 mb-46 mx-auto w-45 h-45"
      />

      <div className="px-4 pb-6 shrink-0">
        <button
          type="button"
          onClick={() => router.push('/home')}
          className={[
            'w-full h-[56px] rounded-full bg-black text-white',
            'flex items-center justify-center gap-2 cursor-pointer',
          ].join(' ')}
        >
          <span className="body-3 font-semibold">홈으로 돌아가기</span>
          <img src="/onboarding/next.svg" alt="next" width={20} height={20} />
        </button>
      </div>
    </main>
  )
}
