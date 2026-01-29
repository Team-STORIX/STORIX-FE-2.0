// src/lib/api/preference/preference.api.ts
import { apiClient } from '@/lib/api/axios-instance'
import {
  PreferenceAnalyzeRequest,
  PreferenceAnalyzeResponseSchema,
  PreferenceExplorationResponseSchema,
  PreferenceResultsResponseSchema,
  PreferenceStatsResponseSchema,
} from './preference.schema'

/** 취향탐색 작품 목록 */
export async function getPreferenceExploration() {
  const { data } = await apiClient.get('/api/v1/preference/exploration')
  return PreferenceExplorationResponseSchema.parse(data)
}

/** 취향 분석(작품 1개에 대한 like/dislike) */
export async function postPreferenceAnalyze(payload: PreferenceAnalyzeRequest) {
  const { data } = await apiClient.post(
    '/api/v1/preference/exploration',
    payload,
  )
  return PreferenceAnalyzeResponseSchema.parse(data)
}

/** 마이페이지 선호 장르 통계 */
export async function getPreferenceStats() {
  const { data } = await apiClient.get('/api/v1/preference/stats')
  return PreferenceStatsResponseSchema.parse(data)
}

/** 취향 분석 결과 */
export async function getPreferenceResults() {
  const { data } = await apiClient.get('/api/v1/preference/results')
  return PreferenceResultsResponseSchema.parse(data)
}
