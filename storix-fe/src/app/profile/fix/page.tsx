// src/app/profile/fix/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Nickname from '@/app/onboarding/components/nickname'
import Bio from './components/bio'
import {
  updateProfileNickname,
  updateProfileDescription,
  updateProfileImage,
} from '@/lib/api/profile/profile.api'
import { useProfileStore } from '@/store/profile.store'
import {
  createProfileImagePresignedPutUrl,
  type ImageContentType,
} from '@/lib/api/image/image.api'

export default function ProfileFixPage() {
  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [nicknameOk, setNicknameOk] = useState(false)
  const [initialNickname, setInitialNickname] = useState('')

  const [bioText, setBioText] = useState('')
  const [initialBioText, setInitialBioText] = useState('')

  const me = useProfileStore((s) => s.me)
  const patchMe = useProfileStore((s) => s.patchMe)

  // ✅ 프로필 이미지: "선택 시 미리보기만" 반영하고, 실제 저장은 완료 버튼에서
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [initialProfileImageUrl, setInitialProfileImageUrl] = useState<
    string | undefined
  >(undefined)

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!me) return

    // 1️⃣ 서버 기준 값
    const nextNickname = me.nickName ?? ''
    const nextBio = me.profileDescription ?? ''
    const nextProfileImageUrl = me.profileImageUrl ?? undefined

    setNickname(nextNickname)
    setInitialNickname(nextNickname)

    setBioText(nextBio)
    setInitialBioText(nextBio)

    setInitialProfileImageUrl(nextProfileImageUrl)

    // 프로필 수정 화면 진입 시에는 서버 값이 "현재 값"이므로
    // previewUrl은 비워두고, Image src는 me.profileImageUrl을 쓰게 둔다.
    setPreviewUrl(undefined)
    setSelectedImageFile(null)

    // 2️⃣ sessionStorage도 동기화 (기존 컴포넌트 호환용)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname', nextNickname)
      sessionStorage.setItem('profile_bio', nextBio)
    }
  }, [me])

  // 기존 Bio 컴포넌트가 sessionStorage를 읽는 구조라면 유지
  useEffect(() => {
    if (typeof window === 'undefined') return

    const id = window.setInterval(() => {
      const nextBio = sessionStorage.getItem('profile_bio') || ''
      setBioText(nextBio)
    }, 200)

    return () => window.clearInterval(id)
  }, [])

  // ✅ 언마운트 시 objectURL 정리
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const nicknameChanged = nickname !== initialNickname
  const bioChanged = bioText !== initialBioText
  const imageChanged = !!selectedImageFile // ✅ 파일을 선택하면 변경된 것으로 본다

  const isEnabled = useMemo(() => {
    // ✅ 이미지 변경도 완료 버튼 활성화 조건에 포함
    // 닉네임 변경이 있다면 nicknameOk를 만족해야 함
    if (nicknameChanged) return nicknameOk
    if (bioChanged) return true
    if (imageChanged) return true
    return false
  }, [nicknameChanged, nicknameOk, bioChanged, imageChanged])

  const [isPressed, setIsPressed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const openFilePicker = () => {
    if (isUploadingImage || isSaving) return
    fileInputRef.current?.click()
  }

  const toContentType = (file: File): ImageContentType | null => {
    if (file.type === 'image/jpeg') return 'image/jpeg'
    if (file.type === 'image/png') return 'image/png'
    if (file.type === 'image/webp') return 'image/webp'
    return null
  }

  // ✅ "선택하면 저장"이 아니라, 선택 시에는 미리보기+파일만 저장
  const handleSelectProfileImage = (file: File) => {
    const contentType = toContentType(file)
    if (!contentType) {
      window.alert('업로드 가능한 이미지 형식은 JPG/PNG/WEBP 입니다.')
      return
    }

    // 미리보기 갱신
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    const nextPreview = URL.createObjectURL(file)
    setPreviewUrl(nextPreview)

    // 완료 버튼 눌렀을 때 업로드할 파일로 보관
    setSelectedImageFile(file)
  }

  // ✅ 완료 버튼에서 실행될 실제 업로드 + 서버 반영
  const uploadAndApplyProfileImage = async (file: File) => {
    const contentType = toContentType(file)
    if (!contentType) {
      throw new Error('업로드 가능한 이미지 형식은 JPG/PNG/WEBP 입니다.')
    }

    setIsUploadingImage(true)
    try {
      // 1) presignedPutUrl 발급
      const presignRes = await createProfileImagePresignedPutUrl(contentType)
      if (!presignRes.isSuccess) {
        throw new Error(presignRes.message || 'Presigned URL 발급 실패')
      }

      const { url: presignedPutUrl, objectKey } = presignRes.result

      // 2) S3 PUT 업로드 (Authorization ❌)
      const putRes = await fetch(presignedPutUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType,
        },
        body: file,
      })

      if (!putRes.ok) {
        const t = await putRes.text().catch(() => '')
        throw new Error(`이미지 업로드 실패: ${putRes.status} ${t}`)
      }

      // 3) 프로필 이미지 변경 API로 objectKey 저장
      const applyRes = await updateProfileImage(objectKey)
      if (!applyRes.isSuccess) {
        throw new Error(applyRes.message || '프로필 이미지 변경 실패')
      }

      // ✅ 서버가 반환하는 "실제 조회용 URL"이 따로 없으면
      // store에는 기존 url을 유지하거나(다음 /me에서 갱신),
      // 혹은 previewUrl을 임시로 넣어 즉시 반영할 수도 있음.
      // 여기서는 "즉시 반영"을 원하면 아래처럼 previewUrl을 넣어도 돼.
      patchMe({ profileImageUrl: me?.profileImageUrl || undefined })
      return { objectKey }
    } finally {
      setIsUploadingImage(false)
    }
  }

  const onSubmit = async () => {
    if (!isEnabled || isSaving) return

    setIsPressed(true)
    setIsSaving(true)

    try {
      // 1) 닉네임 변경
      if (nicknameChanged) {
        const res = await updateProfileNickname(nickname)
        if (!res.isSuccess) throw new Error(res.message || '닉네임 변경 실패')
        patchMe({ nickName: nickname })
      }

      // 2) 한 줄 소개 변경
      if (bioChanged) {
        const res = await updateProfileDescription(bioText)
        if (!res.isSuccess)
          throw new Error(res.message || '한 줄 소개 변경 실패')
        patchMe({ profileDescription: bioText })
      }

      // 3) 프로필 이미지 변경 (✅ 완료 버튼에서만 저장)
      if (selectedImageFile) {
        await uploadAndApplyProfileImage(selectedImageFile)

        // 업로드 성공하면 "현재 상태"로 확정
        setSelectedImageFile(null)
        setInitialProfileImageUrl(me?.profileImageUrl ?? undefined)
        // previewUrl은 미리보기라 유지해도 되고, 비워도 됨.
        // 유지하면 즉시 화면에는 계속 새 이미지가 보임.
      }

      window.alert('프로필 수정 완료')
      router.replace('/profile')
    } catch (e: any) {
      console.error('[profile-fix] submit error:', e)
      window.alert(e?.message ?? '프로필 수정 중 오류가 발생했어요.')
      setIsPressed(false)

      // ✅ 이미지 업로드 실패 시: 미리보기/선택을 되돌리는 게 자연스러움
      // (원하면 주석 해제)
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(undefined)
      setSelectedImageFile(null)
      patchMe({ profileImageUrl: initialProfileImageUrl })
    } finally {
      setIsSaving(false)
    }
  }

  // ✅ 화면에 보여줄 이미지 src:
  // - 선택한 미리보기(blob)가 있으면 그걸 우선
  // - 없으면 서버에서 내려온 프로필 이미지
  const currentProfileImage =
    previewUrl || (me?.profileImageUrl ? me.profileImageUrl : undefined)

  return (
    <div>
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
          disabled={!isEnabled || isSaving}
          onClick={onSubmit}
          className={[
            'text-[16px] font-medium leading-[140%] transition-colors',
            isEnabled && !isSaving
              ? 'cursor-pointer hover:opacity-80'
              : 'cursor-default',
          ].join(' ')}
          style={{
            color:
              isEnabled && !isSaving
                ? 'var(--color-magenta-300)'
                : 'var(--color-gray-500)',
          }}
        >
          {isSaving ? '저장 중' : '완료'}
        </button>
      </div>

      {/* ✅ 프로필 이미지 영역 (100x100 + 테두리) */}
      <div className="mt-8 flex justify-center">
        <div className="relative h-[100px] w-[100px]">
          {/* 테두리 상자 */}
          <div className="h-[100px] w-[100px] overflow-hidden rounded-full border border-[var(--color-gray-200)] bg-white">
            <Image
              src={currentProfileImage || '/profile/profile-default.svg'}
              alt="프로필 이미지"
              width={100}
              height={100}
              className="h-full w-full object-cover"
            />
          </div>

          {/* ✅ 오른쪽/아래에 32x32 change 아이콘 겹치기 */}
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploadingImage || isSaving}
            className="absolute bottom-0 right-0 z-10 h-[32px] w-[32px] cursor-pointer transition-opacity hover:opacity-80 disabled:cursor-default disabled:opacity-60"
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

          {/* 숨겨진 file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              e.currentTarget.value = ''
              if (!file) return
              handleSelectProfileImage(file)
            }}
          />

          {/* 업로딩 표시 */}
          {isUploadingImage && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-full bg-black/30">
              <span className="text-[12px] font-medium text-white">
                업로드 중…
              </span>
            </div>
          )}
        </div>
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
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('signup_nickname', v)
            }
          }}
          onAvailabilityChange={setNicknameOk}
          variant="inline"
        />

        <div className="mt-10">
          <Bio />
        </div>
      </div>
    </div>
  )
}
