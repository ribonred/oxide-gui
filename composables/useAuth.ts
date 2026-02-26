import type { ApiResponse, ApiResult } from '~/types/api'

interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
}

interface UserData {
  id: string
  email: string
  is_active: boolean
  last_login: string | null
  created_at: string
}

// Module-level singletons — shared across ALL useAuth() callers so that
// deduplication and the cookie watcher are never duplicated.
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null
let watcherRegistered = false

export const useAuth = () => {
  const config = useRuntimeConfig()
  const router = useRouter()
  const authToken = useCookie('auth_token', {
    maxAge: 60 * 15, // 15 minutes (matches access token duration)
  })
  const refreshToken = useCookie('refresh_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 days (matches refresh token duration)
  })

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  // isRefreshing / refreshPromise live at module scope (see above)

  const register = async (email: string, password: string): Promise<ApiResult<UserData>> => {
    try {
      const response = await $fetch<ApiResponse<UserData>>(`${apiUrl}/api/v1/auth/user`, {
        method: 'POST',
        body: { email, password },
      })
      return { success: true, data: response.data, code: response.code }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Registration failed',
        code: error.data?.code
      }
    }
  }

  const login = async (email: string, password: string): Promise<ApiResult<TokenPair>> => {
    try {
      const response = await $fetch<ApiResponse<TokenPair>>(`${apiUrl}/api/v1/auth/login`, {
        method: 'POST',
        body: { email, password },
      })

      if (response.data?.access_token && response.data?.refresh_token) {
        authToken.value = response.data.access_token
        refreshToken.value = response.data.refresh_token
        
        // Connect WebSocket on login
        const { connect } = useWebSocket()
        connect()
        
        return { success: true, data: response.data, code: response.code }
      }
      return { success: false, error: 'No token received' }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Login failed',
        code: error.data?.code
      }
    }
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise
    }

    isRefreshing = true
    refreshPromise = (async () => {
      try {
        if (!refreshToken.value) {
          return false
        }

        const response = await $fetch<ApiResponse<TokenPair>>(`${apiUrl}/api/v1/auth/refresh`, {
          method: 'POST',
          body: { refresh_token: refreshToken.value },
        })

        if (response.data?.access_token && response.data?.refresh_token) {
          authToken.value = response.data.access_token
          refreshToken.value = response.data.refresh_token
          return true
        }
        return false
      } catch (error: any) {
        console.error('Token refresh failed:', error)
        // Clear tokens and redirect to login
        authToken.value = null
        refreshToken.value = null
        router.push('/login')
        return false
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  const logout = () => {
    // Disconnect WebSocket on logout
    const { disconnect } = useWebSocket()
    disconnect()
    
    refreshToken.value = null
    authToken.value = null
    router.push('/login')
  }

  const isAuthenticated = computed(() => {
    // Cookie-backed auth state is available in SSR and client.
    // Keep this consistent to avoid hydration mismatches.
    return !!authToken.value
  })

  // Register the watcher only once, regardless of how many components call useAuth()
  if (!watcherRegistered) {
    watcherRegistered = true
    watch(authToken, async (newVal) => {
      if (!newVal && refreshToken.value) {
        await refreshAccessToken()
      }
    })
  }

  // Custom fetch wrapper that handles token refresh on AUTH-403
  const authFetch = async <T = any>(url: string, options: any = {}): Promise<T> => {
    const makeRequest = async (token: string): Promise<T> => {
      return await $fetch<T>(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      })
    }

    try {
      if (!authToken.value) {
        throw new Error('No auth token available')
      }
      return await makeRequest(authToken.value)
    } catch (error: any) {
      // Check if error is AUTH-403 (expired token) from the API response
      const errorCode = error.data?.code
      if (errorCode === 'AUTH-403' || error.statusCode === 401) {
        // Try to refresh the token
        const refreshed = await refreshAccessToken()
        if (refreshed && authToken.value) {
          // Retry the request with the new token
          try {
            return await makeRequest(authToken.value)
          } catch (retryError: any) {
            throw retryError
          }
        }
      }
      throw error
    }
  }

  return {
    register,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated,
    authToken,
    refreshToken,
    authFetch,
  }
}
