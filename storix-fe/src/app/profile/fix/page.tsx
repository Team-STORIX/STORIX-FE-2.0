// src/app/profile/fix/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nickname from '@/app/onboarding/components/nickname'
import Bio from './components/bio'

export default function ProfileFixPage() {
  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [nicknameOk, setNicknameOk] = useState(false)
  const [initialNickname, setInitialNickname] = useState('')

  // ✅ Bio는 sessionStorage(profile_bio) 기준으로 변경 감지
  const [bioText, setBioText] = useState('')
  const [initialBioText, setInitialBioText] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedNickname = sessionStorage.getItem('signup_nickname') || ''
    setNickname(savedNickname)
    setInitialNickname(savedNickname)

    const savedBio = sessionStorage.getItem('profile_bio') || ''
    setBioText(savedBio)
    setInitialBioText(savedBio)
  }, [])

  // ✅ Bio 컴포넌트가 sessionStorage를 바꾸면 여기서도 따라가게(가벼운 폴링)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const id = window.setInterval(() => {
      const nextBio = sessionStorage.getItem('profile_bio') || ''
      setBioText(nextBio)
    }, 200)

    return () => window.clearInterval(id)
  }, [])

  const nicknameChanged = nickname !== initialNickname
  const bioChanged = bioText !== initialBioText

  // ✅ 활성 조건: 닉네임 변경이면 nicknameOk 필요 / bio만 변경이면 ok 없이 가능
  const isEnabled = useMemo(() => {
    if (nicknameChanged) return nicknameOk
    if (bioChanged) return true
    return false
  }, [nicknameChanged, nicknameOk, bioChanged])

  const [isPressed, setIsPressed] = useState(false)

  return (
    <div>
      <div className="h-[54px]" />

      <div className="flex items-center justify-between p-4">
        <Link href="/profile" className="transition-opacity hover:opacity-70">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>

        <h1
          className="absolute left-1/2 -translate-x-1/2 text-[16px] font-medium leading-[140%]"
          style={{ color: 'var(--color-gray-900)' }}
        >
          프로필 수정
        </h1>

        <button
          type="button"
          disabled={!isEnabled}
          onClick={() => {
            if (!isEnabled) return
            setIsPressed(true)

            // ✅ 팝업 안내
            window.alert('프로필 수정 완료')

            // ✅ 프로필 화면으로 이동 (userProfile이 sessionStorage 값 읽어서 반영)
            router.replace('/profile')
          }}
          className={[
            'text-[16px] font-medium leading-[140%] transition-colors',
            isEnabled ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
          ].join(' ')}
          style={{
            color: isEnabled
              ? 'var(--color-magenta-300)' // hover 가능한 상태
              : 'var(--color-gray-500)', // 비활성(회색)
          }}
        >
          완료
        </button>
      </div>

      <div className="mt-8 flex justify-center">
        <div
          className="w-[100px] h-[100px] rounded-full"
          style={{ backgroundColor: 'var(--color-gray-200)' }}
        />
      </div>

      <div className="mt-12 px-4">
        <div
          className="body-2"
          style={{
            color: 'var(--color-gray-500)',
            fontFamily: 'Pretendard',
          }}
        >
          닉네임
        </div>

        <div className="h-3" />

        <Nickname
          value={nickname}
          onChange={(v) => {
            if (isPressed) setIsPressed(false)
            setNickname(v)
            // ✅ Nickname 컴포넌트가 signup_nickname 저장하지만, 안전하게 여기서도 보장
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('signup_nickname', v)
            }
          }}
          onAvailabilityChange={setNicknameOk}
          variant="inline"
        />

        {/* 닉네임칸 40px 아래에 bio */}
        <div className="mt-10">
          <Bio />
        </div>
      </div>
    </div>
  )
}
