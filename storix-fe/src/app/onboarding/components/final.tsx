// src/app/onboarding/components/final.tsx
export default function Final() {
  return (
    <div className="w-full h-full flex flex-col items-center">
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
          준비완료!
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
    </div>
  )
}
