// src/app/profile/fix/components/nickname.tsx
'use client'
// 1월 30일 19시

// ✅ 입력 중에는 "글자수(MAX)"만 처리하고, 타입(정규식) 검사는 "중복확인 버튼"을 눌렀을 때만 수행
// ✅ iOS/천지인 IME 깨짐 방지: composing 중에는 절대 trim/slice/validate/sanitize 하지 않음

import Image from 'next/image'
import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { checkProfileNicknameValid } from '@/api/profile/readerNickname.api'

interface NicknameProps {
  value: string
  onChange: (value: string) => void
  currentNickname?: string
  onVerifiedChange?: (ok: boolean) => void // 부모(완료버튼) 제어용
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

  // ✅ iOS(사파리/웹뷰) IME 이슈 방지: 조합 상태는 ref로
  const composingRef = useRef(false)

  // ✅ 외부 value 변화(초기 로드/부모 동기화) 반영용 local draft
  //    (조합 중일 때 부모 value가 바뀌면 IME 깨질 수 있어 local draft가 안전)
  const [draft, setDraft] = useState(value)

  // 초기 1회 + currentNickname 변경 시 동기화용
  const didInitRef = useRef(false)

  // NOTE: 요청하신 새 제한 범위(아래아 포함 X) 그대로 둠
  // ✅ 하지만 "입력 중"에는 이 regex로 검사/필터링하지 않음. (중복확인 시점에만 검사)
  const allowedRegex = /^[가-힣a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ ]+$/

  const normalize = (s?: string) => (s ?? '').trim()

  const isAllSpaces = (v: string) => v.length > 0 && v.trim().length === 0
  const isJamoOnly = (v: string) => {
    const t = v.trim()
    if (!t) return false
    return /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(t)
  }

  // ✅ 외부 value가 바뀌면 draft를 동기화
  // (다만 조합 중엔 동기화하면 IME가 깨질 수 있어 composing 중에는 건드리지 않음)
  useEffect(() => {
    if (composingRef.current) return
    setDraft(value)
  }, [value])

  const isSameNow = useMemo(() => {
    const cur = normalize(currentNickname)
    if (!cur) return false
    return normalize(draft) === cur
  }, [draft, currentNickname])

  // ✅ "중복확인 버튼" 눌렀을 때만 검사하는 validate
  const validateOnCheck = useCallback(
    (v: string): { st: Status; message: string } => {
      const nv = normalize(v)
      if (!nv) return { st: 'idle', message: '' }

      if (normalize(currentNickname) && nv === normalize(currentNickname)) {
        return { st: 'same', message: MSG_SAME }
      }

      // 길이 검사 (확인 시점)
      if (nv.length < MIN || nv.length > MAX) {
        return { st: 'length', message: MSG_LEN }
      }

      if (isAllSpaces(v)) return { st: 'spaces_only', message: MSG_SPACES }

      // ✅ 타입 검사도 확인 시점에만
      if (!allowedRegex.test(nv))
        return { st: 'invalid_chars', message: MSG_CHARS }

      if (isJamoOnly(nv)) return { st: 'jamo_only', message: MSG_JAMO_ONLY }

      return { st: 'ready', message: '' }
    },
    [currentNickname],
  )

  // ✅ 초기 1회 + currentNickname 변경 시: "same" 여부만 자연스럽게 반영
  useEffect(() => {
    if (!didInitRef.current) {
      const { st, message } = validateOnCheck(draft)
      setStatus(st)
      setMsg(message)
      onVerifiedChange?.(st === 'ok' || st === 'same')
      didInitRef.current = true
      return
    }

    const { st, message } = validateOnCheck(draft)
    setStatus(st)
    setMsg(message)
    onVerifiedChange?.(st === 'ok' || st === 'same')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNickname, validateOnCheck])

  // ✅ 입력 중에는 "글자수만" 처리
  // - composing 중: 절대 자르지 않음 (IME 보호)
  // - composing 아닐 때: MAX 초과하면 잘라서 적용
  const applyLengthOnly = (raw: string) => {
    if (composingRef.current) {
      setDraft(raw)
      onChange(raw) // 부모도 raw 그대로(타입검사 없음). iOS에서 부모가 가공하지 않는다는 전제
      return
    }

    const next = raw.length > MAX ? raw.slice(0, MAX) : raw
    setDraft(next)
    onChange(next)

    // 입력이 바뀌면 검증 해제
    setStatus('idle')
    setMsg('')
    onVerifiedChange?.(false)
  }

  const canCheck = useMemo(() => {
    if (status === 'checking') return false
    return normalize(draft).length > 0
  }, [draft, status])

  const looksTaken = (message: string, code?: string) => {
    const c = (code ?? '').toLowerCase()
    return (
      /중복|이미|사용\s?중|사용중|존재/.test(message) ||
      /duplicate|exist|taken/.test(c)
    )
  }

  const checkDuplicate = async () => {
    if (!canCheck) return

    // ✅ 여기서만 타입/길이/자모 검사
    const { st, message } = validateOnCheck(draft)
    setStatus(st)
    setMsg(message)

    if (st !== 'ready' && st !== 'same') {
      onVerifiedChange?.(false)
      return
    }

    // 현재 닉네임이면 서버 호출 없이 통과
    if (st === 'same' || isSameNow) {
      setStatus('same')
      setMsg(MSG_SAME)
      onVerifiedChange?.(true)
      return
    }

    setStatus('checking')
    setMsg('')

    try {
      const { httpStatus, raw, available } = await checkProfileNicknameValid(
        normalize(draft),
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
    focused || draft
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
          <h1 className="heading-1 text-black">닉네임을 입력해 주세요</h1>
          <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
            한글, 영문, 숫자 2~10자까지 입력 가능해요
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
              // ✅ 조합이 끝난 최종 문자열에만 "글자수 MAX" 적용
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
            placeholder="닉네임을 입력하세요"
            // ✅ iOS 자동 기능이 조합을 건드리는 경우 완화
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
