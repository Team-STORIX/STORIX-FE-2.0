// src/lib/api/imageUpload.ts
import { apiClient } from '@/api/axios-instance'

type PresignReq = { files: { contentType: string }[] }
type PresignItem = { url: string; objectKey: string; expiresInSeconds: number }
type PresignRes = { isSuccess: boolean; result: PresignItem[] | PresignItem }

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateImages(files: File[], max = 3) {
  if (files.length > max)
    throw new Error(`이미지는 최대 ${max}장까지 가능해요.`)
  for (const f of files) {
    if (!ALLOWED.has(f.type)) {
      throw new Error('이미지는 jpg/png/webp만 업로드 가능해요.')
    }
  }
}

// ✅ 게시물 이미지 업로드 presigned 발급: POST /api/v1/image/board (최대 3장):contentReference[oaicite:3]{index=3}:contentReference[oaicite:4]{index=4}
export async function getBoardPresignedUrls(files: File[]) {
  const body: PresignReq = {
    files: files.map((f) => ({ contentType: f.type })),
  }

  const { data } = await apiClient.post<PresignRes>(
    '/api/v1/image/board',
    body,
    {
      headers: { accept: '*/*' },
    },
  )

  const result = Array.isArray(data.result) ? data.result : [data.result]
  return result
}

// ✅ presigned url에 PUT 업로드 (Authorization ❌):contentReference[oaicite:5]{index=5}
export async function putToPresignedUrl(url: string, file: File) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) throw new Error(`S3 업로드 실패 (HTTP ${res.status})`)
}
