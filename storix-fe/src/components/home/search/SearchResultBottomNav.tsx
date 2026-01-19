'use client'

import { useRouter } from 'next/navigation'

type Props = {
  keyword: string
  active: 'works' | 'artists'
}

export default function SearchResultBottomNav({ keyword, active }: Props) {
  const router = useRouter()
  const k = keyword.trim()
  if (!k) return null

  const go = (to: 'works' | 'artists') => {
    router.push(`/home/search/result/${to}?keyword=${encodeURIComponent(k)}`)
  }

  return (
    <div className="pointer-events-none fixed bottom-[24px] left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2 px-4">
      <div className="pointer-events-auto mx-auto flex w-[200px] rounded-full bg-black p-1 shadow-lg">
        <button
          type="button"
          onClick={() => go('works')}
          className={`flex-1 rounded-full py-2 text-[14px] font-semibold cursor-pointer transition ${
            active === 'works'
              ? 'bg-white text-black'
              : 'bg-black text-white/70'
          }`}
        >
          작품
        </button>
        <button
          type="button"
          onClick={() => go('artists')}
          className={`flex-1 rounded-full py-2 text-[14px] font-semibold cursor-pointer transition ${
            active === 'artists'
              ? 'bg-white text-black'
              : 'bg-black text-white/70'
          }`}
        >
          작가
        </button>
      </div>
    </div>
  )
}
