import type { ApiResponse, ApiResult, PaginatedData, PaginatedResponseData } from '~/types/api'
import type { EventListItem, SearchEventsRequest } from '~/types/event'

export interface MemberQuizSummary {
  id: number
  title: string
  description?: string
  status: string
  access_type: string
  availability: string
  created_at: string
  question_count: number
  time_limit_seconds: number
  tags?: string[]
}

interface MemberQueryFilters {
  categories?: string[]
  tags?: string[]
}

interface CreateMemberAttemptRequest {
  quiz_id: number
  participant_id: string
  event_id?: string | null
}

interface CreateMemberAttemptResponse {
  session_token: string
  participant_id: string
  alias?: string
  attempt_id: string
  quiz_id: number
  total_questions: number
  started_at: string
  effective_time_limit_seconds: number
}

const extractError = (error: any) => {
  const message = error.data?.message || error.data?.msg || error.message || 'Request failed'
  const code = error.data?.code
  const statusCode = error.statusCode || error.response?.status
  return { message, code, statusCode }
}

export const useMemberClient = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const getMemberQuizzes = async (
    apiKey: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResult<PaginatedData<MemberQuizSummary>> & { statusCode?: number }> => {
    try {
      const queryParams = new URLSearchParams()
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

      const url = `${apiUrl}/api/v1/members/quizzes${
        queryParams.toString() ? `?${queryParams}` : ''
      }`

      const response = await $fetch<PaginatedResponseData<MemberQuizSummary>>(url, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      })

      return { success: true, data: response.data, code: response.code, message: response.message }
    } catch (error: any) {
      const extracted = extractError(error)
      return {
        success: false,
        error: extracted.message,
        code: extracted.code,
        statusCode: extracted.statusCode,
      }
    }
  }

  const getMemberQuizById = async (
    apiKey: string,
    quizId: string
  ): Promise<ApiResult<any> & { statusCode?: number }> => {
    try {
      const response = await $fetch<ApiResponse<any>>(
        `${apiUrl}/api/v1/quizzes/${quizId}/client`,
        {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
          },
        }
      )

      return { success: true, data: response, code: response.code, message: response.message }
    } catch (error: any) {
      const extracted = extractError(error)
      return {
        success: false,
        error: extracted.message,
        code: extracted.code,
        statusCode: extracted.statusCode,
      }
    }
  }

  const createMemberAttempt = async (
    quizId: number,
    participantId: string,
    apiKey: string,
    eventId?: string | null
  ): Promise<ApiResult<CreateMemberAttemptResponse> & { statusCode?: number }> => {
    try {
      const body: CreateMemberAttemptRequest = {
        quiz_id: quizId,
        participant_id: participantId,
      }
      if (eventId) body.event_id = eventId

      const response = await $fetch<ApiResponse<CreateMemberAttemptResponse>>(
        `${apiUrl}/api/v1/members/attempts`,
        {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body,
        }
      )

      return { success: true, data: response.data, code: response.code, message: response.message }
    } catch (error: any) {
      const extracted = extractError(error)
      return {
        success: false,
        error: extracted.message,
        code: extracted.code,
        statusCode: extracted.statusCode,
      }
    }
  }

  const searchMemberEvents = async (
    apiKey: string,
    filters: SearchEventsRequest = {}
  ): Promise<ApiResult<PaginatedData<EventListItem>> & { statusCode?: number }> => {
    try {
      const response = await $fetch<PaginatedResponseData<EventListItem>>(
        `${apiUrl}/api/v1/events/search`,
        {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body: filters,
        }
      )

      return { success: true, data: response.data, code: response.code, message: response.message }
    } catch (error: any) {
      const extracted = extractError(error)
      return {
        success: false,
        error: extracted.message,
        code: extracted.code,
        statusCode: extracted.statusCode,
      }
    }
  }

  const queryMemberQuizzes = async (
    apiKey: string,
    params: {
      page?: number
      perPage?: number
      filters?: MemberQueryFilters
    }
  ): Promise<ApiResult<PaginatedData<MemberQuizSummary>> & { statusCode?: number }> => {
    try {
      const body: Record<string, any> = {}

      if (params.page) body.page = params.page
      if (params.perPage) body.perPage = params.perPage

      if (params.filters) {
        body.filters = {}
        if (params.filters.categories && params.filters.categories.length > 0) {
          body.filters.categories = params.filters.categories
        }
        if (params.filters.tags && params.filters.tags.length > 0) {
          body.filters.tags = params.filters.tags
        }
      }

      const response = await $fetch<PaginatedResponseData<MemberQuizSummary>>(
        `${apiUrl}/api/v1/quizzes/query?access_type=private&status=published`,
        {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
          },
          body,
        }
      )

      return { success: true, data: response.data, code: response.code, message: response.message }
    } catch (error: any) {
      const extracted = extractError(error)
      return {
        success: false,
        error: extracted.message,
        code: extracted.code,
        statusCode: extracted.statusCode,
      }
    }
  }

  return {
    getMemberQuizzes,
    getMemberQuizById,
    createMemberAttempt,
    queryMemberQuizzes,
    searchMemberEvents,
  }
}
