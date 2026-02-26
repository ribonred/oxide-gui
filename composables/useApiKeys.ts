import type { ApiResponse, ResponseListData } from '~/types/api'

export const useApiKeys = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const createApiKey = async (name: string, duration: string, role: string = 'user') => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/apikeys`, {
        method: 'POST',
        body: { name, expires_in: duration, role },
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to create API key',
        code: error.data?.code
      }
    }
  }

  const getApiKeys = async () => {
    try {
      const response = await authFetch<ResponseListData<any>>(`${apiUrl}/api/v1/apikeys`, {
        method: 'GET',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch API keys',
        code: error.data?.code
      }
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/apikeys/${keyId}/revoke`, {
        method: 'PUT',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to revoke API key',
        code: error.data?.code
      }
    }
  }



  return {
    createApiKey,
    getApiKeys,
    revokeApiKey,
  }
}
