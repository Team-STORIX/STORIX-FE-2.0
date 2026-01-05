// src/app/onboarding/components/nickname.tsx
'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface NicknameProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange?: (ok: boolean) => void
}

type Status =
  | 'idle'
  | 'typing'
  | 'invalid'
  | 'spaces_only'
  | 'forbidden'
  | 'unchecked'
  | 'checking'
  | 'ok'
  | 'taken'

const MIN = 2
const MAX = 10

export default function Nickname({
  value,
  onChange,
  onAvailabilityChange,
}: NicknameProps) {
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  const lastChecked = useRef('')

  // ✅ 허용: 한글/영문/숫자/_ + 공백(허용)
  const allowedRegex = /^[ㄱ-ㅎ가-힣a-zA-Z0-9_ ]+$/

  const isAllSpaces = (v: string) => v.length > 0 && v.trim().length === 0

  const isBasicValid = (v: string) =>
    v.length >= MIN &&
    v.length <= MAX &&
    !isAllSpaces(v) &&
    allowedRegex.test(v)

  const resetCheck = () => {
    lastChecked.current = ''
    onAvailabilityChange?.(false)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname_available', 'false')
    }
  }

  const handleChange = (raw: string) => {
    const next = raw.slice(0, MAX)
    resetCheck()

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname', next)
    }

    if (!next) {
      setStatus('idle')
      setMsg('')
      onChange(next)
      return
    }

    // 공백만은 입력은 허용하되, debounce에서 멈췄을 때 경고 처리
    if (isAllSpaces(next)) {
      setStatus('typing')
      setMsg('')
      onChange(next)
      return
    }

    // 허용 문자 외 입력 시 제거 + 안내 문구
    if (!allowedRegex.test(next)) {
      const filtered = next
        .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9_ ]/g, '')
        .slice(0, MAX)
      onChange(filtered)

      if (!filtered) {
        setStatus('idle')
        setMsg('')
        return
      }

      setStatus('invalid')
      setMsg('닉네임은 한글/영문/숫자/_ 만 가능해요!')
      return
    }

    if (next.length < MIN) {
      onChange(next)
      setStatus('invalid')
      setMsg('한글,영문,숫자 2~10자까지 입력 가능해요')
      return
    }

    // ✅ 기본 정합성 OK (중복체크 전)
    setStatus('unchecked')
    setMsg('')
    onChange(next)
  }

  /** ✅ debounce(400ms): 공백만 / 금칙어 체크 */
  useEffect(() => {
    if (!value) return

    const t = window.setTimeout(async () => {
      // 공백만 닉네임 금지
      if (isAllSpaces(value)) {
        setStatus('spaces_only')
        setMsg('공백만으론 닉네임을 설정할 수 없어요!')
        return
      }

      // 기본 정합성 통과 못하면 금칙어 체크 안 함
      if (!isBasicValid(value)) return

      // ✅ 금칙어 체크 API (백엔드 실제 엔드포인트로 교체)
      try {
        const res = await fetch(
          `/api/v1/auth/nickname/forbidden?nickName=${encodeURIComponent(value)}`,
          { method: 'GET', credentials: 'include' },
        )
        if (!res.ok) return
        const data = await res.json()

        // 다양한 응답 형태 대응
        const r = data?.result
        const isForbidden =
          r === true ||
          r?.isForbidden === true ||
          r?.forbidden === true ||
          r?.blocked === true

        if (isForbidden) {
          setStatus('forbidden')
          setMsg(r?.message || data?.message || '사용할 수 없는 닉네임이에요!')
          return
        }

        // 금칙어 OK인데 이전에 forbidden이었다면 정상 상태로 복구
        if (status === 'forbidden') {
          setStatus('unchecked')
          setMsg('')
        }
      } catch {
        // 네트워크 오류는 UX 깨지지 않게 무시
      }
    }, 400)

    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const canCheck = status === 'unchecked' && isBasicValid(value)

  const checkDuplicate = async () => {
    if (!canCheck) return

    setStatus('checking')
    setMsg('')

    try {
      const res = await fetch(
        `/api/v1/auth/nickname/valid?nickName=${encodeURIComponent(value)}`,
        { method: 'GET', credentials: 'include' },
      )
      const data = await res.json().catch(() => null)

      if (!res.ok || !data) {
        setStatus('taken')
        setMsg('닉네임 확인 중 오류가 발생했어요. 다시 시도해주세요.')
        return
      }

      // ✅ 백엔드 result 형태에 맞게 조정 가능
      const available =
        data?.result?.isAvailable ??
        data?.result?.available ??
        data?.result?.canUse ??
        false

      if (available) {
        lastChecked.current = value
        setStatus('ok')
        setMsg('사용 가능한 닉네임이에요')
        onAvailabilityChange?.(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signup_nickname_available', 'true')
        }
      } else {
        setStatus('taken')
        setMsg('이미 사용 중인 닉네임이에요')
        onAvailabilityChange?.(false)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signup_nickname_available', 'false')
        }
      }
    } catch {
      setStatus('taken')
      setMsg('닉네임 확인 중 오류가 발생했어요. 다시 시도해주세요.')
      onAvailabilityChange?.(false)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup_nickname_available', 'false')
      }
    }
  }

  const isWarning =
    status === 'invalid' ||
    status === 'spaces_only' ||
    status === 'forbidden' ||
    status === 'taken'

  const isSuccess = status === 'ok'

  // ✅ 밑줄(underline)만 상태 따라 변경
  const underlineClass = isSuccess
    ? 'border-b-2 border-[var(--color-success)]'
    : isWarning
      ? 'border-b-2 border-[var(--color-warning)]'
      : focused
        ? 'border-b border-[var(--color-black)]'
        : 'border-b border-[var(--color-gray-300)]'

  // ✅ 입력 글자는 항상 검은색(placeholder는 회색)
  const inputTextColor =
    focused || value
      ? 'text-[var(--color-black)]'
      : 'text-[var(--color-gray-300)]'

  // ✅ 아이콘: 경고 상태면 gray, 입력 있고 경고 없으면 pink
  const iconSrc =
    value && !isWarning
      ? '/onboarding/id-check-pink.svg'
      : '/onboarding/id-check-gray.svg'

  return (
    <div>
      <h1 className="heading-1 text-black">닉네임을 입력하세요</h1>

      <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
        10자 이내의 닉네임을 입력해주세요
      </p>

      <div className="mt-[80px] w-[361px]">
        <div className="h-[42px] flex items-center justify-between">
          <input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={MAX}
            placeholder="닉네임을 입력하세요"
            className={[
              'w-[254px]',
              'px-[8px] py-[10px]',
              'bg-transparent outline-none cursor-text',
              'body-1',
              'placeholder:text-[var(--color-gray-300)]',
              underlineClass,
              inputTextColor,
            ].join(' ')}
          />

          <button
            type="button"
            onClick={checkDuplicate}
            disabled={!canCheck}
            className={[
              'w-[102px] h-[38px]',
              canCheck ? 'cursor-pointer hover:opacity-80' : 'cursor-default',
            ].join(' ')}
            aria-label="닉네임 중복 확인"
          >
            <Image
              src={iconSrc}
              alt=""
              width={102}
              height={38}
              draggable={false}
            />
          </button>
        </div>

        {msg && (
          <p
            className={[
              'caption-1',
              'mt-[6px] ml-[8px]',
              isSuccess
                ? 'text-[var(--color-success)]'
                : 'text-[var(--color-warning)]',
            ].join(' ')}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  )
}
