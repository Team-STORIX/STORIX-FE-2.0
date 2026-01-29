import NextButton from '@/components/preference/NextButton'

export default function PreferenceGuidePage() {
  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-black">
            작품 탐색을 시작해볼까요?
          </div>
          <div className="mt-3 text-sm text-black/60">
            마음에 들면 오른쪽으로 <br />
            아니면 왼쪽으로 스와이프하세요!
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <NextButton href="/home/preference/swipe" />
      </div>
    </main>
  )
}
