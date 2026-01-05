// src/app/home/search/page.tsx

import SearchBar from '@/components/common/SearchBar'
import RecentSearchList from '@/components/common/RecentSearchList'
import HashtagList from '@/components/common/HashtagList'

export default function Search() {
  return (
    <div>
      <SearchBar />
      <div className="flex flex-col px-4 py-9 gap-9">
        <div className="flex flex-col w-full gap-3 -mt-3">
          <p className="body-1">최근 검색어</p>
          <RecentSearchList />
        </div>
        <div className="flex flex-col w-full gap-3">
          <p className="body-1">키워드 추천</p>
          <HashtagList />
        </div>
        <div className="flex flex-col w-full gap-3">
          <p className="body-1">인기 검색어</p>
          <HashtagList />
        </div>
      </div>
    </div>
  )
}
