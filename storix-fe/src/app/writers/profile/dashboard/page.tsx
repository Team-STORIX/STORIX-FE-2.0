// src/app/writers/profile/dashboard/page.tsx
'use client'

import { useState } from 'react'
import TopBar from '@/app/profile/components/topbar'
import WriterProfile from '@/app/writers/profile/components/writerProfile'
import PreferenceTab from '@/app/writers/profile/components/preferenceTab'
import NavBar from '@/app/writers/feed/components/NavigaitionBar'

import MyBooks from '@/app/writers/profile/components/myBooks'
import Articles from '@/app/writers/profile/components/articles'
import Profit from '@/app/writers/profile/components/profit'

export default function ProfilePage() {
  // ✅ 임시 기본값 (로그인 없이 접근 가능)
  const [nickname] = useState('작가님')
  const [level] = useState<number>(1)
  const [profileImageUrl] = useState<string | undefined>(undefined)
  const [bio] = useState('작가 소개 문구가 여기에 들어갑니다.')

  return (
    <div className="relative w-full min-h-full pb-[169px]">
      <div className="h-[54px]" />
      <TopBar />

      <WriterProfile
        profileImage={profileImageUrl}
        nickname={nickname}
        bio={bio}
      />

      <PreferenceTab />

      {/* ✅ dashboard 컨텐츠 */}
      <MyBooks />
      <Articles />
      <Profit />

      <NavBar active="profile" />
    </div>
  )
}
