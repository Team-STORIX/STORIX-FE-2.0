// src/hooks/works/useWorksDetail.ts
import { useQuery } from '@tanstack/react-query'
import { getWorksDetail } from '@/lib/api/works'

export const useWorksDetail = (worksId: number) => {
  return useQuery({
    queryKey: ['works', 'detail', worksId],
    enabled: Number.isFinite(worksId) && worksId > 0,
    queryFn: () => getWorksDetail(worksId),
  })
}
