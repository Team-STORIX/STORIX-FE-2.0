// src/app/onboarding/components/topbar.tsx
interface TopbarProps {
  onBack: () => void
}

export default function Topbar({ onBack }: TopbarProps) {
  return (
    <div className="w-full h-14 p-4 bg-white">
      <img
        src="/icons/back.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        className="cursor-pointer brightness-0"
        onClick={onBack}
      />
    </div>
  )
}
