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
} from '@/api/profile/profile.api'
import { useProfileStore } from '@/store/profile.store'
import {
  createProfileImagePresignedPutUrl,
  type ImageContentType,
} from '@/api/image/image.api'

export default function ProfileFixPage() {
  const router = useRouter()

  const [nickname, setNickname] = useState('')
  const [nicknameOk, setNicknameOk] = useState(false)
  const [initialNickname, setInitialNickname] = useState('')

  const [bioText, setBioText] = useState('')
  const [initialBioText, setInitialBioText] = useState('')

  const me = useProfileStore((s) => s.me)
  const patchMe = useProfileStore((s) => s.patchMe)

  // ✅ 프로필 이미지 미리보기 URL (선택 즉시 반영)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!me) return

    // 1️⃣ 서버 기준 값
    const nextNickname = me.nickName ?? ''
    const nextBio = me.profileDescription ?? ''

    setNickname(nextNickname)
    setInitialNickname(nextNickname)

    setBioText(nextBio)
    setInitialBioText(nextBio)

    // 2️⃣ sessionStorage도 동기화 (기존 컴포넌트 호환용)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('signup_nickname', nextNickname)
      sessionStorage.setItem('profile_bio', nextBio)
    }
  }, [me])

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

  const isEnabled = useMemo(() => {
    // 이미지 저장은 "선택 즉시 업로드/반영"이라 완료 버튼 조건에 포함 안 함
    if (nicknameChanged) return nicknameOk
    if (bioChanged) return true
    return false
  }, [nicknameChanged, nicknameOk, bioChanged])

  const [isPressed, setIsPressed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const onSubmit = async () => {
    if (!isEnabled || isSaving) return

    setIsPressed(true)
    setIsSaving(true)

    try {
      if (nicknameChanged) {
        const res = await updateProfileNickname(nickname)
        if (!res.isSuccess) throw new Error(res.message || '닉네임 변경 실패')
        patchMe({ nickName: nickname })
      }

      if (bioChanged) {
        const res = await updateProfileDescription(bioText)
        if (!res.isSuccess)
          throw new Error(res.message || '한 줄 소개 변경 실패')
        patchMe({ profileDescription: bioText })
      }

      window.alert('프로필 수정 완료')
      router.replace('/profile')
    } catch (e: any) {
      console.error('[profile-fix] submit error:', e)
      window.alert(e?.message ?? '프로필 수정 중 오류가 발생했어요.')
      setIsPressed(false)
    } finally {
      setIsSaving(false)
    }
  }

  const currentProfileImage =
    previewUrl || (me?.profileImageUrl ? me.profileImageUrl : undefined)

  const openFilePicker = () => {
    if (isUploadingImage) return
    fileInputRef.current?.click()
  }

  const toContentType = (file: File): ImageContentType | null => {
    if (file.type === 'image/jpeg') return 'image/jpeg'
    if (file.type === 'image/png') return 'image/png'
    if (file.type === 'image/webp') return 'image/webp'
    return null
  }

  const uploadAndApplyProfileImage = async (file: File) => {
    const contentType = toContentType(file)
    if (!contentType) {
      window.alert('업로드 가능한 이미지 형식은 JPG/PNG/WEBP 입니다.')
      return
    }

    // 1) 프론트 즉시 렌더링(미리보기)
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    const nextPreview = URL.createObjectURL(file)
    setPreviewUrl(nextPreview)
    patchMe({ profileImageUrl: nextPreview }) // ✅ 즉시 반영용(스토어)

    setIsUploadingImage(true)

    try {
      // 2) presignedPutUrl 발급
      const presignRes = await createProfileImagePresignedPutUrl(contentType)
      if (!presignRes.isSuccess) {
        throw new Error(presignRes.message || 'Presigned URL 발급 실패')
      }

      const { url: presignedPutUrl, objectKey } = presignRes.result

      // 3) S3 PUT 업로드 (Authorization ❌)
      const putRes = await fetch(presignedPutUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': contentType, // ✅ presign 요청 contentType과 동일
        },
        body: file,
      })

      if (!putRes.ok) {
        const t = await putRes.text().catch(() => '')
        throw new Error(`이미지 업로드 실패: ${putRes.status} ${t}`)
      }

      // 4) 프로필 이미지 변경 API로 objectKey 저장
      const applyRes = await updateProfileImage(objectKey)
      if (!applyRes.isSuccess) {
        throw new Error(applyRes.message || '프로필 이미지 변경 실패')
      }

      // ✅ 여기서 서버가 반환하는 "실제 조회용 URL"이 따로 없으므로
      //    화면 즉시 반영은 blob preview로 유지하고,
      //    필요하면 다음 진입/새로고침 시 /profile/me로 실제 URL이 들어올 거야.
      window.alert('프로필 이미지가 변경됐어요.')
    } catch (e: any) {
      console.error('[profile-fix] image upload error:', e)
      window.alert(e?.message ?? '프로필 이미지 변경 중 오류가 발생했어요.')

      // 실패 시: 미리보기 유지 여부는 선택인데,
      // 보통 실패면 원래 이미지로 되돌리는 게 자연스러움.
      setPreviewUrl(undefined)
      patchMe({ profileImageUrl: me?.profileImageUrl || undefined })
    } finally {
      setIsUploadingImage(false)
    }
  }

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

          {/* ✅ 오른쪽/아래에 32x32 change 아이콘 겹치기 (위로 올라오게) */}
          <button
            type="button"
            onClick={openFilePicker}
            disabled={isUploadingImage}
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
              // 같은 파일 다시 선택 가능하도록 초기화
              e.currentTarget.value = ''
              if (!file) return
              uploadAndApplyProfileImage(file)
            }}
          />

          {/* (선택) 업로딩 표시가 필요하면 간단히 */}
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
