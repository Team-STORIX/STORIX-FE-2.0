// src/hooks/topicroom/useMyTopicRoomsAll.ts
import { useQuery } from '@tanstack/react-query'
import { getMyTopicRooms } from '@/lib/api/topicroom'

type Params = {
  size?: number
  sort?: string[]
  enabled?: boolean
  maxPages?: number
}

export const useMyTopicRoomsAll = ({
  size = 3,
  sort = ['topicRoom.lastChatTime,DESC'],
  enabled = true,
  maxPages = 30, // ✅ 안전장치(무한 루프 방지)
}: Params = {}) => {
  return useQuery({
    queryKey: ['topicroom', 'me', 'list', 'all', size, sort.join('|')], // ✅
    enabled: !!enabled, // ✅
    queryFn: async () => {
      const all = []
      let page = 0

      for (let i = 0; i < maxPages; i += 1) {
        const res = await getMyTopicRooms({ page, size, sort }) // ✅
        all.push(...(res.content ?? []))

        // ✅ last=true 또는 empty=true면 종료
        if (res.last || res.empty) break

        const current = res.number ?? page
        page = current + 1 // ✅
      }

      return all
    },
  })
}
