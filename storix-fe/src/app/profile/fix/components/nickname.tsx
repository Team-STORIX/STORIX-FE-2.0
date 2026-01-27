// src/app/profile/fix/components/nickname.tsx
'use client'

// 1월27일 14:23 최신코드 냠냠 (iOS IME 안정화 패치)

import Image from 'next/image'
import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { checkProfileNicknameValid } from '@/api/profile/readerNickname.api'

interface NicknameProps {
  value: string
  onChange: (value: string) => void
  currentNickname?: string
  onVerifiedChange?: (ok: boolean) => void //   부모(완료버튼) 제어용
  variant?: 'onboarding' | 'inline'
}

type Status =
  | 'idle'
  | 'invalid_chars'
  | 'length'
  | 'spaces_only'
  | 'jamo_only'
  | 'ready'
  | 'same'
  | 'checking'
  | 'ok'
  | 'taken'
  | 'error'

const MIN = 2
const MAX = 10

const MSG_LEN = '한글,영문,숫자 2~10자까지 입력 가능해요'
const MSG_CHARS = '닉네임은 한글/영문/숫자만 가능해요!'
const MSG_SPACES = '공백만으론 닉네임을 설정할 수 없어요!'
const MSG_JAMO_ONLY = '자/모음 만으로는 닉네임을 설정할 수 없어요!'
const MSG_OK = '사용 가능한 닉네임이에요'
const MSG_SAME = '현재 닉네임이에요'
const MSG_TAKEN = '이미 사용 중인 닉네임이에요'

export default function Nickname({
  value,
  onChange,
  currentNickname,
  onVerifiedChange,
  variant = 'onboarding',
}: NicknameProps) {
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  // ✅ iOS IME 안정화: state 대신 ref 사용 (즉시 반영)
  const isComposingRef = useRef(false)

  // 초기 1회 + currentNickname 변경 시 동기화용
  const didInitRef = useRef(false)

  const normalize = (s?: string) => (s ?? '').trim()

  // NOTE: 기존 코드 유지 (허용문자에 공백 포함)
  const allowedRegex = /^[가-힣a-zA-Z0-9_ ]+$/

  const isAllSpaces = (v: string) => v.length > 0 && v.trim().length === 0
  const isJamoOnly = (v: string) => {
    const t = v.trim()
    if (!t) return false
    return /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(t)
  }

  const isSameNow = useMemo(() => {
    const cur = normalize(currentNickname)
    if (!cur) return false
    return normalize(value) === cur
  }, [value, currentNickname])

  const sanitize = (raw: string) => {
    let next = raw.slice(0, MAX)
    if (!allowedRegex.test(next)) {
      next = next.replace(/[^가-힣a-zA-Z0-9_ ]/g, '').slice(0, MAX)
    }
    return next
  }

  const validate = useCallback(
    (v: string): { st: Status; message: string } => {
      if (!v) return { st: 'idle', message: '' }

      //   현재 닉네임이면 “검증 완료” 상태로 취급
      if (
        normalize(currentNickname) &&
        normalize(v) === normalize(currentNickname)
      ) {
        return { st: 'same', message: MSG_SAME }
      }

      if (isAllSpaces(v)) return { st: 'spaces_only', message: MSG_SPACES }
      if (!allowedRegex.test(v))
        return { st: 'invalid_chars', message: MSG_CHARS }
      if (isJamoOnly(v)) return { st: 'jamo_only', message: MSG_JAMO_ONLY }
      if (v.length < MIN) return { st: 'length', message: MSG_LEN }

      return { st: 'ready', message: '' }
    },
    [currentNickname],
  )

  // ✅ 초기 1회 + currentNickname 들어오는 순간에만 동기화
  useEffect(() => {
    if (!didInitRef.current) {
      const { st, message } = validate(value)
      setStatus(st)
      setMsg(message)
      onVerifiedChange?.(st === 'ok' || st === 'same')
      didInitRef.current = true
      return
    }

    // currentNickname이 바뀌면 같은 닉네임 판단/메시지 갱신
    const { st, message } = validate(value)
    setStatus(st)
    setMsg(message)
    onVerifiedChange?.(st === 'ok' || st === 'same')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNickname, validate])

  const handleChange = (raw: string) => {
    // ✅ 조합 중: sanitize/validate/resetCheck/verified 업데이트 금지
    // iOS에서 여기서 건드리면 첫 한글이 씹히는 경우가 많음
    if (isComposingRef.current) {
      onChange(raw.slice(0, MAX)) // MAX만 방어
      return
    }

    const next = sanitize(raw)
    onChange(next)

    // 입력이 바뀌면 일단 검증 해제
    onVerifiedChange?.(false)

    const { st, message } = validate(next)
    setStatus(st)
    setMsg(message)

    if (st === 'same') onVerifiedChange?.(true)
  }

  const canCheck = useMemo(() => {
    if (status === 'checking') return false
    const { st } = validate(value)
    return st === 'ready' || st === 'same'
  }, [value, status, validate])

  const looksTaken = (message: string, code?: string) => {
    const c = (code ?? '').toLowerCase()
    return (
      /중복|이미|사용\s?중|사용중|존재/.test(message) ||
      /duplicate|exist|taken/.test(c)
    )
  }

  const checkDuplicate = async () => {
    if (!canCheck) return

    //   현재 닉네임이면 서버 호출 없이 “검증 완료”
    if (isSameNow) {
      setStatus('same')
      setMsg(MSG_SAME) // 메시지 싫으면 ''로 바꿔도 됨
      onVerifiedChange?.(true)
      return
    }

    setStatus('checking')
    setMsg('')

    try {
      const { httpStatus, raw, available } = await checkProfileNicknameValid(
        normalize(value),
      )

      const message = (raw?.message ?? '').toString()
      const code = (raw?.code ?? '').toString()

      if (httpStatus >= 400) {
        if (httpStatus === 409 || looksTaken(message, code)) {
          setStatus('taken')
          setMsg(MSG_TAKEN)
          onVerifiedChange?.(false)
          return
        }

        setStatus('error')
        setMsg('닉네임 확인 중 오류가 발생했어요. 다시 시도해주세요.')
        onVerifiedChange?.(false)
        return
      }

      if (raw?.isSuccess === false) {
        setStatus('taken')
        setMsg(MSG_TAKEN)
        onVerifiedChange?.(false)
        return
      }

      if (available === true) {
        setStatus('ok')
        setMsg(MSG_OK)
        onVerifiedChange?.(true)
        return
      }
      if (available === false) {
        setStatus('taken')
        setMsg(MSG_TAKEN)
        onVerifiedChange?.(false)
        return
      }

      if (looksTaken(message, code)) {
        setStatus('taken')
        setMsg(MSG_TAKEN)
        onVerifiedChange?.(false)
        return
      }

      setStatus('ok')
      setMsg(MSG_OK)
      onVerifiedChange?.(true)
    } catch {
      setStatus('error')
      setMsg('닉네임 확인 중 오류가 발생했어요. 다시 시도해주세요.')
      onVerifiedChange?.(false)
    }
  }

  const isWarning =
    status === 'length' ||
    status === 'invalid_chars' ||
    status === 'spaces_only' ||
    status === 'jamo_only' ||
    status === 'taken' ||
    status === 'error'

  const isSuccess = status === 'ok' || status === 'same'

  const underlineClass = isSuccess
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

  const iconSrc = canCheck
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
          // ✅ iPhone 375에서도 안전하게: 고정폭 제거
          'w-full max-w-[361px]',
        ].join(' ')}
      >
        <div className="h-[42px] flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true
            }}
            onCompositionEnd={(e) => {
              isComposingRef.current = false

              // ✅ 조합 종료 후 최종값 1회만 sanitize/validate
              const finalRaw = (e.currentTarget as HTMLInputElement).value
              const next = sanitize(finalRaw)

              onChange(next)
              onVerifiedChange?.(false)

              const { st, message } = validate(next)
              setStatus(st)
              setMsg(message)
              onVerifiedChange?.(st === 'ok' || st === 'same')
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
            maxLength={MAX}
            placeholder="닉네임을 입력하세요"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            className={[
              // ✅ 반응형 입력창
              'flex-1 min-w-0',
              'px-[8px] py-[10px]',
              'bg-transparent outline-none cursor-text',
              // iOS 확대/포커스 이슈 줄이려면 16px 권장(원하면 body-1 유지해도 됨)
              'text-[16px]',
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
              'shrink-0 w-[102px] h-[38px]',
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
