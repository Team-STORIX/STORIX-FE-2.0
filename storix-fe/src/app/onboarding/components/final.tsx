'use client'

import { useRouter } from 'next/navigation'

export default function Final() {
  const router = useRouter()

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* 텍스트 영역 */}
      <div className="mt-10">
        <h1 className="heading-1 text-black text-center">준비완료!</h1>

        <p className="body-1-medium text-[var(--color-gray-500)] text-center mt-[5px]">
          이제 탐험을 시작해볼까요?
        </p>
      </div>

      {/* 이미지 */}
      <div className="mt-[125px]">
        <img
          src="/common/icons/big-star-pink.png"
          alt="완료"
          width={180}
          height={180}
        />
      </div>

      {/* 버튼 */}
      <button
        onClick={() => router.push('/home')}
        className="mt-10 w-[200px] h-[44px] rounded-[8px] bg-[var(--color-magenta-300)] text-white body-1-bold flex items-center justify-center"
      >
        홈으로 가기
      </button>
    </div>
  )
}
