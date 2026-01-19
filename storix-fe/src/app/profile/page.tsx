// src/app/profile/page.tsx
'use client'

import { useEffect } from 'react'
import TopBar from './components/topbar'
import UserProfile from './components/userProfile'
import PreferenceTab from './components/preferenceTab'
import Preference from './components/preference'
import Rating from './components/rating'
import Hashtag from './components/hashtag'
import NavBar from '@/components/common/NavBar'

import { useProfileStore } from '@/store/profile.store'
import { getMyProfile } from '@/api/profile/profile.api'

export default function ProfilePage() {
  const me = useProfileStore((s) => s.me)
  const setMe = useProfileStore((s) => s.setMe)

  // ✅ store가 비어있을 때만 1회 보충 fetch
  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      if (me) return
      try {
        const res = await getMyProfile()
        if (!res.isSuccess) throw new Error(res.message || 'Failed to load me')
        if (!mounted) return
        setMe(res.result)
      } catch (e) {
        console.error('[profile] failed to hydrate me', e)
      }
    }

    hydrate()
    return () => {
      mounted = false
    }
  }, [me, setMe])

  // ✅ 렌더링용 값 (store 기반)
  const nickname = me?.nickName ?? ''
  const level = typeof me?.level === 'number' ? me.level : 1
  const profileImageUrl = me?.profileImageUrl || undefined
  const bio = me?.profileDescription ?? ''

  return (
    <div className="relative w-full min-h-full pb-[169px]">
      <TopBar />

      <UserProfile
        profileImage={profileImageUrl}
        level={level}
        nickname={nickname || '닉네임'}
        bio={bio}
      />

      <PreferenceTab />
      <Preference />
      <Rating />

      <Hashtag />
      <NavBar active="profile" />
    </div>
  )
}
