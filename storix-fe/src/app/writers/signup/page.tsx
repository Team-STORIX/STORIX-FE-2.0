// src/app/writers/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function WriterSignupPage() {
  const router = useRouter()

  const [writerId, setWriterId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const onLogin = () => {
    // TODO: API 연동 전 임시 - "틀리면" 경고 모달 띄우기
    setShowWarning(true)
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* ✅ 상단 54px */}
      <div className="h-[54px]" />

      {/* ✅ Topbar */}
      <div className="w-full h-14 px-4 flex items-center bg-white">
        <img
          src="/icons/back.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          className="cursor-pointer brightness-0"
          onClick={() => router.push('/writers/login')}
        />
      </div>

      {/* ✅ 제목/설명 (Topbar 아래 44px, 좌우 16px) */}
      <div className="mt-[44px] px-4">
        <h1 className="heading-1 text-black">안녕하세요 작가님 반가워요!</h1>
        <p className="body-1 mt-[5px] text-[var(--color-gray-500)]">
          인증 시 부여받은 고유 ID로 로그인해주세요
        </p>
      </div>

      {/* ✅ 아이디 입력 (80px 아래, 좌우 16px) */}
      <div className="mt-[80px] px-4">
        <p className="body-1 text-black">아이디</p>

        <div className="mt-2 flex items-center gap-[10px] rounded-[8px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-3 py-3 hover:opacity-90 transition-opacity">
          <input
            value={writerId}
            onChange={(e) => setWriterId(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full bg-transparent outline-none body-1 placeholder:text-[var(--color-gray-300)] text-[var(--color-gray-600)]"
          />
        </div>
      </div>

      {/* ✅ 비밀번호 입력 (32px 아래) */}
      <div className="mt-[32px] px-4">
        <p className="body-1 text-black">비밀번호</p>

        <div className="mt-2 flex items-center gap-[10px] rounded-[8px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-3 py-3 hover:opacity-90 transition-opacity">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPw ? 'text' : 'password'}
            placeholder="비밀번호를 입력하세요"
            className="w-full bg-transparent outline-none body-1 placeholder:text-[var(--color-gray-300)] text-[var(--color-gray-600)]"
          />

          <button
            type="button"
            className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={() => setShowPw((prev) => !prev)}
            aria-label="비밀번호 보기 토글"
          >
            <Image
              src={
                showPw ? '/login/saw-password.svg' : '/login/see-password.svg'
              }
              alt="비밀번호 보기"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
      <div className="h-[239px]" />

      {/* ✅ 작가 인증 링크 (비밀번호 박스 아래 239px) */}
      <div className="mt-[239px] flex flex-col items-center px-4">
        <Link
          href="/writers/verify"
          className="body-2 text-center text-[var(--color-gray-500)] underline cursor-pointer hover:opacity-70 transition-opacity"
          style={{
            fontFamily: 'Pretendard',
            textDecorationLine: 'underline',
            textUnderlinePosition: 'from-font',
          }}
        >
          작가 인증하고 회원가입하기
        </Link>

        {/* ✅ 로그인 버튼 (32px 아래) */}
        <button
          type="button"
          className="mt-[32px] w-[361px] h-[50px] px-[40px] py-[10px] rounded-[12px] bg-[var(--color-gray-900)] flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onLogin}
        >
          <span
            className="text-white font-bold leading-[140%]"
            style={{ fontFamily: 'Pretendard', fontSize: 16 }}
          >
            로그인 하기
          </span>
        </button>
      </div>

      {/* ✅ 로그인 실패 경고 모달 */}
      {showWarning && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(16, 15, 15, 0.70)' }}
          role="dialog"
          aria-modal="true"
        >
          {/* 배경 클릭 닫기 */}
          <button
            type="button"
            className="absolute inset-0 cursor-pointer"
            aria-label="모달 닫기"
            onClick={() => setShowWarning(false)}
          />

          {/* 팝업 */}
          <div className="relative w-[306px] h-[240px]">
            <Image
              src="/login/login-warning.svg"
              alt="로그인 경고"
              fill
              className="object-contain"
              priority
            />

            {/* 우측 상단 X 버튼 (16px, 16px) */}
            <button
              type="button"
              className="absolute top-[16px] right-[16px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
              aria-label="닫기"
              onClick={() => setShowWarning(false)}
            >
              {/* X 아이콘은 login-warning.svg 내부에 있다고 했으니 버튼은 투명 영역만 */}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
