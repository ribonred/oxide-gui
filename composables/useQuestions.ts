import type { ApiResponse, PaginatedResponseData, ApiResult } from '~/types/api'

export const useQuestions = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()

  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const getQuestions = async (params?: {
    page?: number
    per_page?: number
    category?: string
    difficulty_level?: string
    question_type?: string
  }) => {
    try {
      const queryParams = new URLSearchParams()

      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.per_page) queryParams.append('perPage', params.per_page.toString())
      if (params?.category) queryParams.append('category', params.category)
      if (params?.difficulty_level) queryParams.append('difficulty_level', params.difficulty_level)
      if (params?.question_type) queryParams.append('question_type', params.question_type)

      const url = `${apiUrl}/api/v1/questions${queryParams.toString() ? `?${queryParams}` : ''}`

      const response = await authFetch<PaginatedResponseData<any>>(url, {
        method: 'GET',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch questions',
        code: error.data?.code
      }
    }
  }

  const getQuestionById = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/questions/${id}`, {
        method: 'GET',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch question',
        code: error.data?.code
      }
    }
  }

  const createQuestion = async (questionData: any) => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/questions`, {
        method: 'POST',
        body: questionData,
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to create question',
        code: error.data?.code
      }
    }
  }

  const updateQuestion = async (id: string, questionData: any) => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/questions/${id}`, {
        method: 'PUT',
        body: questionData,
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to update question',
        code: error.data?.code
      }
    }
  }

  const deleteQuestion = async (id: string) => {
    try {
      const response = await authFetch<ApiResponse<any>>(`${apiUrl}/api/v1/questions/${id}`, {
        method: 'DELETE',
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to delete question',
        code: error.data?.code
      }
    }
  }

  const searchQuestions = async (options: {
    q?: string
    category?: string
    difficulty_level?: string
    question_type?: string
    tags?: string[]
    page?: number
    per_page?: number
  } = {}) => {
    try {
      const body: any = {}

      body.q = options.q || ""

      // Build filters object
      const filters: any = {}
      if (options.category) filters.category = options.category
      if (options.difficulty_level) filters.difficulty_level = options.difficulty_level
      if (options.question_type) filters.question_type = options.question_type
      if (options.tags && options.tags.length > 0) filters.tags = options.tags

      if (Object.keys(filters).length > 0) {
        body.filters = filters
      }

      if (options.page) body.page = options.page
      if (options.per_page) body.per_page = options.per_page

      const response = await authFetch<PaginatedResponseData<any>>(`${apiUrl}/api/v1/questions/search`, {
        method: 'POST',
        body: body
      })
      return { success: true, data: response }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to search questions',
        code: error.data?.code
      }
    }
  }

  const getPublicQuestionById = async (id: string, sessionToken: string) => {
    try {
      const response = await $fetch<ApiResponse<any>>(`${apiUrl}/api/v1/questions/${id}/public`, {
        method: 'GET',
        headers: {
          'x-session-attempt': sessionToken
        }
      })
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Failed to fetch question:', id, '-', error.data?.message || error.message)
      return {
        success: false,
        error: error.data?.message || error.message || 'Failed to fetch public question',
        code: error.data?.code
      }
    }
  }

  return {
    getQuestions,
    searchQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getPublicQuestionById,
  }
}
