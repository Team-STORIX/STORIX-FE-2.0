'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect } from 'react'
import {
  checkNicknameValid,
  extractIsAvailableFromValidResponse,
} from '@/api/auth/nickname.api'

interface NicknameProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange?: (ok: boolean) => void
  currentNickname?: string
  variant?: 'onboarding' | 'inline'
}

type Status =
  | 'idle'
  | 'invalid_chars'
  | 'length'
  | 'spaces_only'
  | 'unchecked'
  | 'checking'
  | 'ok'
  | 'taken'
  | 'same'
  | 'jamo_only'
  | 'max_toast'

const MIN = 2
const MAX = 10

const MSG_LEN = '한글,영문,숫자 2~10자까지 입력 가능해요'
const MSG_CHARS = '닉네임은 한글/영문/숫자만 가능해요!'
const MSG_SPACES = '공백만으론 닉네임을 설정할 수 없어요!'
const MSG_JAMO_ONLY = '자/모음 만으로는 닉네임을 설정할 수 없어요!'
const MSG_OK = '사용 가능한 닉네임이에요'
const MSG_TAKEN = '이미 사용 중인 닉네임이에요'

export default function Nickname({
  value,
  onChange,
  onAvailabilityChange,
  currentNickname,
  variant = 'onboarding',
}: NicknameProps) {
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  const lastChecked = useRef('')
  const maxToastTimer = useRef<number | null>(null)

  //   페이지 진입 시 "기존 닉네임" 스냅샷
  const initialNicknameRef = useRef<string>('')

  const allowedRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9_ ]+$/

  const normalize = (s?: string) => (s ?? '').trim()
  const isAllSpaces = (v: string) => v.length > 0 && v.trim().length === 0

  const isJamoOnly = (v: string) => {
    const t = v.trim()
    if (!t) return false
    return /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(t)
  }

  const setAvailable = (ok: boolean) => {
    onAvailabilityChange?.(ok)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname_available', ok ? 'true' : 'false')
    }
  }

  const resetCheck = () => {
    lastChecked.current = ''
    setAvailable(false)
  }

  const clearMaxToast = () => {
    if (maxToastTimer.current) {
      window.clearTimeout(maxToastTimer.current)
      maxToastTimer.current = null
    }
  }

  const showMaxToast = () => {
    setStatus('max_toast')
    setMsg(MSG_LEN)

    clearMaxToast()
    maxToastTimer.current = window.setTimeout(() => {
      setStatus((prev) => (prev === 'max_toast' ? 'unchecked' : prev))
      setMsg((prev) => (prev === MSG_LEN ? '' : prev))
      maxToastTimer.current = null
    }, 2000)
  }

  useEffect(() => () => clearMaxToast(), [])

  //   기존 닉네임 스냅샷 고정 (currentNickname 우선, 없으면 value 최초값)
  useEffect(() => {
    if (initialNicknameRef.current) return

    const cur = normalize(currentNickname)
    if (cur) {
      initialNicknameRef.current = cur
      return
    }

    const v = normalize(value)
    if (v) initialNicknameRef.current = v
  }, [currentNickname, value])

  const sanitize = (raw: string) => {
    let next = raw.slice(0, MAX)
    if (!allowedRegex.test(next)) {
      next = next.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9_ ]/g, '').slice(0, MAX)
    }
    return next
  }

  //   "지금 입력값이 기존 닉네임과 동일한가?"
  const isSameNow = useMemo(() => {
    const initial = initialNicknameRef.current
    if (!initial) return false
    return normalize(value) === initial
  }, [value])

  //   동일하면: 중복확인 안 해도 바로 완료 가능 + 메시지 없음 + 밑줄 검정
  useEffect(() => {
    if (!initialNicknameRef.current) return

    if (isSameNow) {
      setStatus('same')
      setMsg('')
      setAvailable(true)
      lastChecked.current = value
      return
    }

    // 동일이었다가 변경되면 완료 불가로 돌리기(단, 사용자가 직접 입력 중일 때 자연스럽게)
    if (status === 'same') {
      setStatus(value ? 'unchecked' : 'idle')
      setMsg('')
      setAvailable(false)
      lastChecked.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSameNow, value])

  const handleChange = (raw: string) => {
    const overMax = raw.length > MAX
    const next = sanitize(raw)

    if (next !== value) resetCheck()

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname', next)
    }

    onChange(next)

    if (overMax) {
      showMaxToast()
      return
    }

    // 동일이면 effect가 처리하므로 여기서는 종료해도 됨
    if (
      initialNicknameRef.current &&
      normalize(next) === initialNicknameRef.current
    ) {
      return
    }

    if (!next) {
      setStatus('idle')
      setMsg('')
      setAvailable(false)
      return
    }

    if (isAllSpaces(next)) {
      setStatus('spaces_only')
      setMsg(MSG_SPACES)
      setAvailable(false)
      return
    }

    if (!allowedRegex.test(next)) {
      setStatus('invalid_chars')
      setMsg(MSG_CHARS)
      setAvailable(false)
      return
    }

    if (next.length < MIN) {
      setStatus('length')
      setMsg(MSG_LEN)
      setAvailable(false)
      return
    }

    setStatus('unchecked')
    setMsg('')
    setAvailable(false)
  }

  //   동일(isSameNow)이면 무조건 중복확인 버튼 활성화
  const canCheck = useMemo(() => {
    if (status === 'checking') return false
    if (isSameNow) return true //   동일이면 중복확인도 누를 수 있게

    if (!value) return false
    if (value.length < MIN || value.length > MAX) return false
    if (isAllSpaces(value)) return false
    if (!allowedRegex.test(value)) return false

    return true
  }, [value, status, isSameNow])

  const checkDuplicate = async () => {
    if (!canCheck) return

    //   동일: API 호출해도 되고 안 해도 되는데, 요청사항상 "눌릴 수만 있으면" 되니까
    // API 호출 X로 처리 (빠르고 안정적)
    if (isSameNow) {
      clearMaxToast()
      setStatus('same')
      setMsg('')
      setAvailable(true)
      lastChecked.current = value
      return
    }

    if (isJamoOnly(value)) {
      clearMaxToast()
      setStatus('jamo_only')
      setMsg(MSG_JAMO_ONLY)
      setAvailable(false)
      return
    }

    clearMaxToast()
    setStatus('checking')
    setMsg('')

    try {
      const data = await checkNicknameValid(value)
      const available = extractIsAvailableFromValidResponse(data)

      if (available) {
        lastChecked.current = value
        setStatus('ok')
        setMsg(MSG_OK)
        setAvailable(true)
      } else {
        setStatus('taken')
        setMsg(MSG_TAKEN)
        setAvailable(false)
      }
    } catch {
      setStatus('taken')
      setMsg('닉네임 확인 중 오류가 발생했어요. 다시 시도해주세요.')
      setAvailable(false)
    }
  }

  const isWarning =
    status === 'length' ||
    status === 'invalid_chars' ||
    status === 'spaces_only' ||
    status === 'taken' ||
    status === 'jamo_only'

  const isSuccess = status === 'ok'
  const isSame = status === 'same'

  const underlineClass = isSame
    ? 'border-b-2 border-[var(--color-black)]'
    : isSuccess
      ? 'border-b-2 border-[var(--color-success)]'
      : isWarning
        ? 'border-b-2 border-[var(--color-warning)]'
        : focused
          ? 'border-b-2 border-[var(--color-black)]'
          : 'border-b-2 border-[var(--color-gray-300)]'

  const inputTextColor =
    focused || value
      ? 'text-[var(--color-black)]'
      : 'text-[var(--color-gray-300)]'

  const iconSrc =
    value && !isWarning
      ? '/onboarding/id-check-pink.svg'
      : '/onboarding/id-check-gray.svg'

  const msgColorClass = isSuccess
    ? 'text-[var(--color-success)]'
    : msg
      ? 'text-[var(--color-warning)]'
      : ''

  return (
    <div>
      {variant === 'onboarding' && (
        <>
          <h1 className="heading-1 text-black">닉네임을 입력하세요</h1>
          <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
            10자 이내의 닉네임을 입력해주세요
          </p>
        </>
      )}

      <div
        className={[
          variant === 'onboarding' ? 'mt-[80px]' : 'mt-0',
          'w-[361px]',
        ].join(' ')}
      >
        <div className="h-[42px] flex items-center justify-between">
          <input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if ((e.nativeEvent as any).isComposing) return
              if (e.key === 'Enter') {
                e.preventDefault()
                checkDuplicate()
              }
            }}
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
            className={['caption-1', 'mt-[6px] ml-[8px]', msgColorClass].join(
              ' ',
            )}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  )
}
