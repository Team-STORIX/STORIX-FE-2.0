import NextButton from '@/components/preference/NextButton'

export default function PreferenceCompletePage() {
  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-2xl font-semibold text-black">탐색 완료!</div>
          <div className="mt-3 text-sm text-black/60">
            탐색결과를 확인하고, <br />
            마음에 드는 작품을 관심작품으로 등록해봐요
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <NextButton href="/home/preference/list" />
      </div>
    </main>
  )
}
