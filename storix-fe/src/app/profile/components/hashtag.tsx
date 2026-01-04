// src/app/profile/components/hashtag.tsx
export default function Hashtag() {
  return (
    <div className="px-4 py-8">
      {/* 제목 */}
      <h2
        className="text-[18px] font-semibold leading-[140%]"
        style={{ color: 'var(--color-gray-900)' }}
      >
        선호 해시태그
      </h2>

      {/* 해시태그 영역 - 361x178 */}
      <div className="mt-6 w-full h-[178px] bg-[#F8F7F7] rounded" />
    </div>
  )
}
