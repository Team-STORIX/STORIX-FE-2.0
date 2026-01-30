import NextButton from '@/components/preference/NextButton'

export default function PreferenceCompletePage() {
  return (
    <main className="min-h-dvh bg-white flex flex-col">
      <div className="flex-1 flex-col justify-center px-6">
        <div className="text-center mt-24">
          <div className="heading-1 text-black">탐색 완료!</div>
          <div className="mt-1 body-1 text-gray-500">
            탐색결과를 확인하고, <br />
            마음에 드는 작품을 관심작품으로 등록해봐요
          </div>
        </div>
        <img
          src="/image/preferenceGuide-2.webp"
          alt="guide illustration"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="px-4 pb-6">
        <NextButton href="/home/preference/list" />
      </div>
    </main>
  )
}
