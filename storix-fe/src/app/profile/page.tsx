// src/app/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import TopBar from './components/topbar'
import UserProfile from './components/userProfile'
import PreferenceTab from './components/preferenceTab'
import Preference from './components/preference'
import Rating from './components/rating'
import Genre from './components/genre'
import Hashtag from './components/hashtag'
import NavBar from '@/components/common/NavBar'

export default function ProfilePage() {
  const [nickname, setNickname] = useState<string>('')

  useEffect(() => {
    const saved = sessionStorage.getItem('signup_nickname') ?? ''
    setNickname(saved)
    console.log('[profile] local nickname:', saved)
  }, [])

  return (
    <div className="relative w-full min-h-full pb-[169px]">
      <div className="h-[54px]" />
      <TopBar />

      <UserProfile
        profileImage={undefined}
        level={1}
        nickname={nickname || '(닉네임 없음)'}
        bio={''}
      />

      <PreferenceTab />
      <Preference />
      <Rating />

      {/* ✅ 장르는 기본값 */}
      <Genre />

      <Hashtag />
      <NavBar active="profile" />
    </div>
  )
}
