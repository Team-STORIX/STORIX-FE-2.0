// src/app/home/search/result/SearchResultClient.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import Tabs from '@/components/common/Tabs'
import WorksSortBottomSheet from '@/components/home/bottomsheet/WorksSortBottomSheet'
import WorksFilterBottomSheet from '@/components/home/bottomsheet/WorksFilterBottomSheet'
import SearchResultWorksTab from '@/components/home/search/SearchResultWorksTab'
import SearchResultTopicRoomTab from '@/components/home/search/SearchResultTopicRoomTab'
import {
  SEARCH_GENRE_VALUES,
  WORKS_TYPE_VALUES,
  TOPIC_ROOM_SORT_VALUES,
  type SearchGenre,
  type SearchWorksType,
  type WorksSort,
  type TopicRoomSort,
} from '@/lib/api/search/search.schema'
import ArrowDownIcon from '@/public/common/icons/ArrowDownIcon'

type SearchTab = 'works' | 'topicroom'
type FilterSheet = 'sort' | 'type' | 'genre' | null

const TAB_LABELS: [string, string] = ['작품', '토픽룸']

const WORKS_SORT_LABELS: Record<WorksSort, string> = {
  NAME: '기본순',
  RATING: '별점순',
  REVIEW: '리뷰순',
}
const TR_SORT_LABELS: Record<TopicRoomSort, string> = {
  DEFAULT: '기본순',
  LATEST: '최신순',
  ACTIVE: '참여자순',
}
const WORKS_TYPE_LABELS: Record<SearchWorksType, string> = {
  WEBTOON: '웹툰',
  WEBNOVEL: '웹소설',
  COMIC: '만화',
}
const GENRE_LABELS: Record<SearchGenre, string> = {
  ROMANCE: '로맨스',
  FANTASY: '판타지',
  DAILY: '일상',
  ROFAN: '로판',
  HISTORICAL: '역사',
  DRAMA: '드라마',
  GAG: '개그',
  THRILLER: '스릴러',
  ACTION: '액션',
  SPORTS: '스포츠',
  SENTIMENTAL: '감성',
  BL: 'BL',
  MODERN_FANTASY: '현판',
}

const TR_SORT_OPTIONS = TOPIC_ROOM_SORT_VALUES.map((value) => ({
  value,
  label: TR_SORT_LABELS[value],
}))
const WORKS_TYPE_OPTIONS = WORKS_TYPE_VALUES.map((value) => ({
  value,
  label: WORKS_TYPE_LABELS[value],
}))
const GENRE_OPTIONS = SEARCH_GENRE_VALUES.map((value) => ({
  value,
  label: GENRE_LABELS[value],
}))

const TYPE_LABEL = '작품유형'
const GENRE_LABEL = '장르'

const summarizeSelected = (
  values: string[],
  fallback: string,
  labels: Record<string, string>,
) => {
  if (values.length === 0) return fallback
  const firstLabel = labels[values[0]] ?? values[0]
  if (values.length === 1) return firstLabel
  return `${firstLabel} +${values.length - 1}`
}

export default function SearchResultClient() {
  const router = useRouter()
  const sp = useSearchParams()
  const keyword = (sp.get('keyword') ?? '').trim()

  useEffect(() => {
    if (!keyword) router.replace('/home/search')
  }, [keyword, router])

  const [tab, setTab] = useState<SearchTab>('works')
  const [worksSort, setWorksSort] = useState<WorksSort>('NAME')
  const [topicRoomSort, setTopicRoomSort] = useState<TopicRoomSort>('DEFAULT')
  const [selectedTypes, setSelectedTypes] = useState<SearchWorksType[]>([])
  const [selectedGenres, setSelectedGenres] = useState<SearchGenre[]>([])
  const [activeSheet, setActiveSheet] = useState<FilterSheet>(null)

  useEffect(() => {
    setSelectedTypes([])
    setSelectedGenres([])
  }, [keyword])

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result?keyword=${encodeURIComponent(k)}`)
  }

  const sortLabel =
    tab === 'works'
      ? WORKS_SORT_LABELS[worksSort]
      : TR_SORT_LABELS[topicRoomSort]
  const typeLabel = summarizeSelected(
    selectedTypes,
    TYPE_LABEL,
    WORKS_TYPE_LABELS,
  )
  const genreLabel = summarizeSelected(
    selectedGenres,
    GENRE_LABEL,
    GENRE_LABELS,
  )

  return (
    <div className="flex w-full flex-col">
      <SearchBar onSearchClick={goSearch} />
      <Tabs
        tabs={['works', 'topicroom'] as [SearchTab, SearchTab]}
        labels={TAB_LABELS}
        active={tab}
        onChange={setTab}
      />

      {/* 필터 칩 */}
      <div className="pt-4">
        <div className="flex items-center justify-start gap-2 px-4">
          <button
            type="button"
            onClick={() => setActiveSheet('sort')}
            className="flex cursor-pointer items-center rounded-full border border-gray-300 p-1 caption-1-medium text-gray-800"
          >
            <p className="ml-1.5">{sortLabel}</p>
            <ArrowDownIcon />
          </button>

          <button
            type="button"
            onClick={() => setActiveSheet('type')}
            className="flex cursor-pointer items-center rounded-full border border-gray-300 p-1 caption-1-medium text-gray-800"
          >
            <p className="ml-1.5">{typeLabel}</p>
            <ArrowDownIcon />
          </button>

          <button
            type="button"
            onClick={() => setActiveSheet('genre')}
            className="flex cursor-pointer items-center rounded-full border border-gray-300 p-1 caption-1-medium text-gray-800"
          >
            <p className="ml-1.5">{genreLabel}</p>
            <ArrowDownIcon />
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="pb-28">
        {tab === 'works' ? (
          <SearchResultWorksTab
            keyword={keyword}
            sort={worksSort}
            worksTypes={selectedTypes}
            genres={selectedGenres}
          />
        ) : (
          <SearchResultTopicRoomTab
            keyword={keyword}
            sort={topicRoomSort}
            worksTypes={selectedTypes}
            genres={selectedGenres}
          />
        )}
      </div>

      {/* 정렬 바텀시트 — 탭에 따라 다른 옵션 */}
      {activeSheet === 'sort' && tab === 'works' && (
        <WorksSortBottomSheet
          currentSort={worksSort}
          onApply={setWorksSort}
          onClose={() => setActiveSheet(null)}
        />
      )}
      {activeSheet === 'sort' && tab === 'topicroom' && (
        <WorksFilterBottomSheet
          title="정렬"
          currentValue={topicRoomSort}
          resetValue="DEFAULT"
          options={TR_SORT_OPTIONS}
          onApply={(v) => setTopicRoomSort(v as TopicRoomSort)}
          onClose={() => setActiveSheet(null)}
        />
      )}

      {/* 작품유형 / 장르 바텀시트 — 탭 공통 */}
      {activeSheet === 'type' && (
        <WorksFilterBottomSheet
          title={TYPE_LABEL}
          currentValue={selectedTypes}
          resetValue={[]}
          options={WORKS_TYPE_OPTIONS}
          onApply={(v) => setSelectedTypes(v as SearchWorksType[])}
          onClose={() => setActiveSheet(null)}
          multiple
        />
      )}
      {activeSheet === 'genre' && (
        <WorksFilterBottomSheet
          title={GENRE_LABEL}
          currentValue={selectedGenres}
          resetValue={[]}
          options={GENRE_OPTIONS}
          onApply={(v) => setSelectedGenres(v as SearchGenre[])}
          onClose={() => setActiveSheet(null)}
          multiple
        />
      )}
    </div>
  )
}
