// src/app/onboarding/components/nickname.tsx
interface NicknameProps {
  value: string
  onChange: (value: string) => void
}

export default function Nickname({ value, onChange }: NicknameProps) {
  return (
    <div>
      <h1
        className="text-black text-2xl font-bold"
        style={{
          fontFamily: 'SUIT',
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '140%',
        }}
      >
        닉네임을 입력하세요
      </h1>

      <p
        className="text-gray-500 mt-[5px]"
        style={{
          fontFamily: 'SUIT',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '140%',
        }}
      >
        10자 이내
      </p>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={10}
        className="mt-20 w-[361px] h-[65px] border border-black px-4"
        placeholder="닉네임 입력"
      />
    </div>
  )
}
