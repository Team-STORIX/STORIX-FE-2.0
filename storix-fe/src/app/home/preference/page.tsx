import NextButton from '@/components/preference/NextButton'

export default function PreferenceGuidePage() {
  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex-col justify-center px-6">
        <div className="text-center mt-24">
          <div className="heading-1 text-black">작품 탐색을 시작해볼까요?</div>
          <div className="mt-1 body-1 text-gray-500">
            마음에 들면 오른쪽으로 <br />
            아니면 왼쪽으로 스와이프하세요!
          </div>
        </div>
        <img
          src="/image/preferenceGuide.webp"
          alt=" guide illustration"
          className="flex mt-24 mx-auto w-70 h-70 -translate-y-6"
        />
      </div>

      <div className="px-4 pb-6">
        <NextButton href="/home/preference/swipe" />
      </div>
    </main>
  )
}
