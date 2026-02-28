// src/app/onboarding/components/nickname
'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
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

const MSG_LEN = '한글, 영문, 숫자, 밑줄(_) 2~10자까지 입력 가능해요'
const MSG_CHARS = '닉네임은 한글/영문/숫자/밑줄(_)만 가능해요!'
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

  // 페이지 진입 시 "기존 닉네임" 스냅샷
  const initialNicknameRef = useRef<string>('')

  // ✅ iOS IME 보호: composing 상태 ref
  const composingRef = useRef(false)

  // ✅ 외부 value를 그대로 쓰면 부모 렌더가 조합을 깨는 케이스가 있어 draft로 받음
  const [draft, setDraft] = useState(value)

  // NOTE: 요청하신 제한 범위(아래아 포함 X) 그대로 유지
  // ✅ 다만 "입력 중"에는 검사하지 않고, "중복확인" 시점에만 검사한다.
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

  // 기존 닉네임 스냅샷 고정 (currentNickname 우선, 없으면 value 최초값)
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

  // ✅ draft ↔ value 동기화 (단, 조합 중엔 동기화 금지)
  useEffect(() => {
    if (composingRef.current) return
    setDraft(value)
  }, [value])

  // "지금 입력값이 기존 닉네임과 동일한가?"
  const isSameNow = useMemo(() => {
    const initial = initialNicknameRef.current
    if (!initial) return false
    return normalize(draft) === initial
  }, [draft])

  // 동일하면: 중복확인 안 해도 바로 완료 가능 + 메시지 없음 + 밑줄 검정
  useEffect(() => {
    if (!initialNicknameRef.current) return

    if (isSameNow) {
      clearMaxToast()
      setStatus('same')
      setMsg('')
      setAvailable(true)
      lastChecked.current = draft
      return
    }

    // 동일이었다가 변경되면 완료 불가로 돌리기
    if (status === 'same') {
      setStatus(draft ? 'unchecked' : 'idle')
      setMsg('')
      setAvailable(false)
      lastChecked.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSameNow, draft])

  // ✅ 입력 중에는 "글자수(MAX)"만 처리
  // - composing 중: 절대 자르지 않음 (IME 보호)
  // - composing 아닐 때: MAX 초과하면 자르고 저장
  const applyLengthOnly = useCallback(
    (raw: string) => {
      const overMax = raw.length > MAX

      if (composingRef.current) {
        // 조합 중: raw 그대로
        setDraft(raw)
        onChange(raw)

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signup_nickname', raw)
        }

        // 입력 중엔 타입검사 안 함: 단, 변경되면 검증 해제는 해준다
        if (raw !== value) resetCheck()
        setStatus(raw ? 'unchecked' : 'idle')
        setMsg('')
        return
      }

      // 조합이 아니면: 길이만 자르기
      const next = overMax ? raw.slice(0, MAX) : raw

      setDraft(next)
      onChange(next)

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup_nickname', next)
      }

      if (next !== value) resetCheck()

      // 길이 초과 토스트는 입력 중에도 가능(조합 아닐 때만)
      if (overMax) showMaxToast()
      else clearMaxToast()

      // 입력 중에는 타입검사/메시지 띄우지 않음(단, empty 상태만 구분)
      setStatus(next ? 'unchecked' : 'idle')
      setMsg('')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  )

  // ✅ 중복확인 시점에만 검사
  const validateOnCheck = useCallback(
    (v: string): { st: Status; message: string } => {
      const nv = normalize(v)
      if (!nv) return { st: 'idle', message: '' }

      if (initialNicknameRef.current && nv === initialNicknameRef.current) {
        return { st: 'same', message: '' }
      }

      if (nv.length < MIN || nv.length > MAX)
        return { st: 'length', message: MSG_LEN }
      if (isAllSpaces(v)) return { st: 'spaces_only', message: MSG_SPACES }
      if (isJamoOnly(nv)) return { st: 'jamo_only', message: MSG_JAMO_ONLY }

      // ✅ 타입검사는 여기서만
      if (!allowedRegex.test(nv))
        return { st: 'invalid_chars', message: MSG_CHARS }

      return { st: 'unchecked', message: '' }
    },
    [],
  )

  // 동일(isSameNow)이면 무조건 중복확인 버튼 활성화
  // ✅ 입력 중엔 타입검사 안 하므로, 버튼 조건은 "값 존재"만으로 단순화
  const canCheck = useMemo(() => {
    if (status === 'checking') return false
    if (isSameNow) return true
    return normalize(draft).length > 0
  }, [draft, status, isSameNow])

  const checkDuplicate = async () => {
    if (!canCheck) return

    // ✅ 중복확인 시점에만 검사 실행
    clearMaxToast()
    const { st, message } = validateOnCheck(draft)

    // same이면 바로 완료
    if (st === 'same' || isSameNow) {
      setStatus('same')
      setMsg('')
      setAvailable(true)
      lastChecked.current = draft
      return
    }

    // invalid면 서버 호출 X
    if (st === 'idle') {
      setStatus('idle')
      setMsg('')
      setAvailable(false)
      return
    }

    if (
      st === 'length' ||
      st === 'spaces_only' ||
      st === 'jamo_only' ||
      st === 'invalid_chars'
    ) {
      setStatus(st)
      setMsg(message)
      setAvailable(false)
      return
    }

    // ✅ 이제 서버 중복확인
    setStatus('checking')
    setMsg('')

    try {
      const data = await checkNicknameValid(normalize(draft))
      const available = extractIsAvailableFromValidResponse(data)

      if (available) {
        lastChecked.current = draft
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
    focused || draft
      ? 'text-[var(--color-black)]'
      : 'text-[var(--color-gray-300)]'

  const iconSrc =
    normalize(draft) && !isWarning
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
          <h1 className="heading-1 text-black">닉네임을 입력해 주세요</h1>
          <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
            한글, 영문, 숫자, 밑줄(_) 2~10자까지 입력 가능해요
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
            value={draft}
            onChange={(e) => applyLengthOnly(e.target.value)}
            onCompositionStart={() => {
              composingRef.current = true
            }}
            onCompositionUpdate={() => {
              composingRef.current = true
            }}
            onCompositionEnd={(e) => {
              composingRef.current = false
              // ✅ 조합이 끝난 최종 문자열에만 "글자수 제한" 적용
              applyLengthOnly(e.currentTarget.value)
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if ((e.nativeEvent as any).isComposing) return
              if (e.key === 'Enter') {
                e.preventDefault()
                checkDuplicate()
              }
            }}
            placeholder="닉네임을 입력해 주세요"
            // ✅ iOS 자동 기능 완화
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            autoComplete="off"
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
