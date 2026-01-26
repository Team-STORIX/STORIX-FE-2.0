// src/api/plus/plus.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import {
  BoardImagePresignRequest,
  BoardImagePresignResponseSchema,
  PlusReviewDuplicateResponseSchema,
  PlusWorksSearchResponseSchema,
  ReaderBoardCreateRequest,
  ReaderBoardCreateResponseSchema,
  ReaderReviewCreateRequest,
  ReaderReviewCreateResponseSchema,
} from './plus.schema'

/**   독자 리뷰 등록 */
export async function postReaderReview(payload: ReaderReviewCreateRequest) {
  const { data } = await apiClient.post('/api/v1/plus/reader/review', payload)
  return ReaderReviewCreateResponseSchema.parse(data)
}

/**   독자 게시글 등록 */
export async function postReaderBoard(payload: ReaderBoardCreateRequest) {
  const { data } = await apiClient.post('/api/v1/plus/reader/board', payload)
  return ReaderBoardCreateResponseSchema.parse(data)
}

/**   게시글 이미지 presigned url 발급 */
export async function postBoardImagePresignedUrls(
  payload: BoardImagePresignRequest,
) {
  const { data } = await apiClient.post('/api/v1/image/board', payload)
  return BoardImagePresignResponseSchema.parse(data)
}

/**   [+] 작품 검색 (리뷰/게시글 작성에서 작품 선택) */
export async function getPlusWorksSearch(params: {
  keyword: string
  page?: number
  size?: number
}) {
  const { keyword, page = 0, size = 20 } = params

  const { data } = await apiClient.get('/api/v1/plus/reader/works', {
    params: {
      keyword: keyword.trim(),
      page,
      size,
    },
  })

  return PlusWorksSearchResponseSchema.parse(data)
}

/**   [+] 리뷰 중복 여부 조회 */
export async function getPlusReviewDuplicate(worksId: number) {
  const res = await apiClient.get(`/api/v1/plus/reader/review/${worksId}`, {
    validateStatus: (status) => status === 200 || status === 400,
  })

  return PlusReviewDuplicateResponseSchema.parse(res.data)
}

/**   presigned url로 S3에 PUT 업로드 */
export async function uploadToPresignedUrl(url: string, file: File) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  })
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`)
}
