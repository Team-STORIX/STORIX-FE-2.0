import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { useAuthStore } from '@/store/auth.store'

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 전송을 위해 필수!
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Access Token 자동 추가
// Request Interceptor: Access Token 자동 추가 (✅ 이미 Authorization 있으면 유지)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()

    if (!config.headers) return config

    // ✅ signup 등에서 Authorization을 직접 넣은 경우 -> 그대로 둔다
    const hasAuthHeader =
      typeof config.headers.Authorization === 'string' &&
      config.headers.Authorization.length > 0

    if (!hasAuthHeader && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// Response Interceptor: Token Refresh 자동 처리
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 401 에러 && 재시도 안 한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Refresh Token으로 새 Access Token 발급
        // (Refresh Token은 httpOnly cookie에 있으므로 자동 전송됨)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh_token`,
          {},
          { withCredentials: true },
        )

        const newAccessToken = response.data.result.accessToken

        // Zustand store에 새 토큰 저장
        useAuthStore.getState().setAccessToken(newAccessToken)

        // 원래 요청에 새 토큰 적용 후 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh 실패 시 로그아웃
        useAuthStore.getState().clearAuth()

        // 로그인 페이지로 리다이렉트
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
