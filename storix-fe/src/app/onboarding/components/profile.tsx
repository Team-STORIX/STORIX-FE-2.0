// src/app/onboarding/components/profile.tsx
'use client'

import Image from 'next/image'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import {
  checkNicknameValid,
  extractIsAvailableFromValidResponse,
} from '@/lib/api/auth/nickname.api'

interface ProfileProps {
  value: string
  onChange: (value: string) => void
  onAvailabilityChange?: (ok: boolean) => void
  profileImage?: string | null
  onProfileImageChange?: (dataUrl: string | null) => void
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

export default function Profile({
  value,
  onChange,
  onAvailabilityChange,
  profileImage,
  onProfileImageChange,
  currentNickname,
  variant = 'onboarding',
}: ProfileProps) {
  const [focused, setFocused] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')

  const lastChecked = useRef('')
  const maxToastTimer = useRef<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const initialNicknameRef = useRef<string>('')
  const composingRef = useRef(false)
  const [draft, setDraft] = useState(value)

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

  useEffect(() => {
    if (composingRef.current) return
    setDraft(value)
  }, [value])

  const isSameNow = useMemo(() => {
    const initial = initialNicknameRef.current
    if (!initial) return false
    return normalize(draft) === initial
  }, [draft])

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

    if (status === 'same') {
      setStatus(draft ? 'unchecked' : 'idle')
      setMsg('')
      setAvailable(false)
      lastChecked.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSameNow, draft])

  const applyLengthOnly = useCallback(
    (raw: string) => {
      const overMax = raw.length > MAX

      if (composingRef.current) {
        setDraft(raw)
        onChange(raw)

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('signup_nickname', raw)
        }

        if (raw !== value) resetCheck()
        setStatus(raw ? 'unchecked' : 'idle')
        setMsg('')
        return
      }

      const next = overMax ? raw.slice(0, MAX) : raw

      setDraft(next)
      onChange(next)

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('signup_nickname', next)
      }

      if (next !== value) resetCheck()

      if (overMax) showMaxToast()
      else clearMaxToast()

      setStatus(next ? 'unchecked' : 'idle')
      setMsg('')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  )

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

      if (!allowedRegex.test(nv))
        return { st: 'invalid_chars', message: MSG_CHARS }

      return { st: 'unchecked', message: '' }
    },
    [],
  )

  const canCheck = useMemo(() => {
    if (status === 'checking') return false
    if (isSameNow) return true
    return normalize(draft).length > 0
  }, [draft, status, isSameNow])

  const checkDuplicate = async () => {
    if (!canCheck) return

    clearMaxToast()
    const { st, message } = validateOnCheck(draft)

    if (st === 'same' || isSameNow) {
      setStatus('same')
      setMsg('')
      setAvailable(true)
      lastChecked.current = draft
      return
    }

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

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.currentTarget.value = ''
    if (!file) return

    if (profileImage?.startsWith('blob:')) URL.revokeObjectURL(profileImage)
    const blobUrl = URL.createObjectURL(file)
    onProfileImageChange?.(blobUrl)
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
      ? '/common/onboarding/id-check-pink.svg'
      : '/common/onboarding/id-check-gray.svg'

  const msgColorClass = isSuccess
    ? 'text-[var(--color-success)]'
    : msg
      ? 'text-[var(--color-warning)]'
      : ''

  return (
    <div>
      {variant === 'onboarding' && (
        <>
          <h1 className="heading-1 text-black">프로필을 설정해주세요</h1>
          <p className="body-1 text-[var(--color-gray-500)] mt-[5px]">
            닉네임과 프로필 사진을 정해주세요
          </p>

          {/* 프로필 사진: 텍스트 42px 아래, 좌우 중앙 */}
          <div className="mt-[42px] flex justify-center">
            <div className="relative h-[100px] w-[100px]">
              {/* 기본/선택된 프로필 사진 */}
              <div className="h-[100px] w-[100px] overflow-hidden rounded-full">
                <Image
                  src={profileImage || '/common/onboarding/user-photo.svg'}
                  alt="프로필 이미지"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 변경 버튼: 우측 하단 테두리 맞춤 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 z-10 h-[32px] w-[32px] cursor-pointer transition-opacity hover:opacity-80"
                aria-label="프로필 이미지 변경"
              >
                <Image
                  src="/profile/profile-change.svg"
                  alt="프로필 이미지 변경"
                  width={32}
                  height={32}
                  priority
                />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleSelectImage}
              />
            </div>
          </div>
        </>
      )}

      {/* 닉네임 입력: 이미지 영역 36px 아래 */}
      <div
        className={[
          variant === 'onboarding' ? 'mt-[36px]' : 'mt-0',
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
