// src/app/writers/login/components/final.tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Final() {
  const router = useRouter()

  return (
    <div className="w-full h-full flex flex-col">
      {/* ✅ 상단 뒤로가기 */}
      <div className="w-full h-14 p-4 flex items-center bg-white">
        <img
          src="/icons/back.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className="cursor-pointer brightness-0"
          onClick={() => router.back()}
        />
      </div>

      <div className="flex flex-col items-center">
        {/* 텍스트 영역 */}
        <div className="mt-10">
          <h1
            className="text-black text-center"
            style={{
              fontFamily: 'SUIT',
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: '140%',
            }}
          >
            로그인 완료!
          </h1>

          <p
            className="text-gray-500 text-center mt-[5px]"
            style={{
              fontFamily: 'SUIT',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '140%',
            }}
          >
            이제 탐험을 시작해볼까요?
          </p>
        </div>

        {/* 이미지 - 텍스트 125px 아래 */}
        <div className="mt-[125px]">
          <img
            src="/onboarding/star-pink.svg"
            alt="완료"
            width={150}
            height={150}
          />
        </div>

        {/* ✅ 시작하기 버튼 */}
        <button
          type="button"
          className="mt-[60px] w-[361px] h-[50px] px-[40px] py-[10px] rounded-[12px] bg-[var(--color-gray-900)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/writers/feed')}
        >
          <span
            className="text-white font-bold leading-[140%]"
            style={{ fontFamily: 'Pretendard', fontSize: 16 }}
          >
            시작하기
          </span>
        </button>
      </div>
    </div>
  )
}
