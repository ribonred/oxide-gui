import type { ApiResponse, ApiResult, PaginatedData, PaginatedResponseData, AttemptListItem, AttemptAnswersResponse, EvaluateAnswerRequest, SyncQuizEvaluationRequest, SyncQuizEvaluationResponse } from '~/types/api'

interface CreateAttemptRequest {
  quiz_id?: number
  access_code?: string
  alias?: string
  participant_id?: string
}

interface SubmitAnswerRequest {
  question_id: string
  user_answer: string
  time_spent_ms?: number
}

interface SubmitAttemptRequest {
  metadata?: any
}

interface CreateAttemptResponse {
  session_token: string
  participant_id: string
  attempt_id: string
  quiz_id: number
  total_questions: number
  started_at: string
  effective_time_limit_seconds: number
}

interface ParticipantInfo {
  id: string
  alias: string
  created_at: string
}
interface userAnswerLite {
  user_answer: string
  question_id: string
}

interface AttemptStatusResponse {
  attempt_id: string
  quiz_id: number
  session_token: string
  participant: ParticipantInfo
  total_questions: number
  answered_count: number
  started_at: string
  submitted_at?: string
  score?: number
  time_taken_ms?: number
  answers: userAnswerLite[]
  effective_time_limit_seconds?: number
}

interface SubmitAnswerResponse {
  answer_id: string
  question_id: string
  is_correct?: boolean
  score?: number
  answered_at: string
  answered_count: number
}

interface SubmitAttemptResponse {
  attempt_id: string
  score: number
  total_questions: number
  answered_count: number
  time_taken_ms: number
  submitted_at: string
  rank?: number
}

export const useAttempts = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || 'http://localhost:8080'

  const createAttempt = async (quizId: number | null, alias?: string, accessCode?: string, participantId?: string): Promise<ApiResult<CreateAttemptResponse>> => {
    try {
      const body: CreateAttemptRequest = {}
      if (alias) body.alias = alias
      if (participantId) body.participant_id = participantId
      if (quizId) body.quiz_id = quizId
      if (accessCode) body.access_code = accessCode

      const response = await $fetch<ApiResponse<CreateAttemptResponse>>(`${apiUrl}/api/v1/attempts`, {
        method: 'POST',
        body,
      })
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to create attempt',
        code: error.data?.code
      }
    }
  }

  const getAttempt = async (sessionToken: string): Promise<ApiResult<AttemptStatusResponse>> => {
    try {
      const response = await $fetch<ApiResponse<AttemptStatusResponse>>(`${apiUrl}/api/v1/attempts/${sessionToken}`, {
        method: 'GET',
      })
      return {
        success: true,
        data: response.data,
        code: response.code,
        message: response.message
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch attempt',
        code: error.data?.code
      }
    }
  }

  const submitAnswer = async (
    sessionToken: string,
    questionId: string,
    userAnswer: string,
    timeSpentMs?: number
  ): Promise<ApiResult<SubmitAnswerResponse>> => {
    try {
      const response = await $fetch<ApiResponse<SubmitAnswerResponse>>(
        `${apiUrl}/api/v1/attempts/${sessionToken}/answers`,
        {
          method: 'POST',
          body: {
            question_id: questionId,
            user_answer: userAnswer,
            time_spent_ms: timeSpentMs,
          } as SubmitAnswerRequest,
        }
      )
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to submit answer',
        code: error.data?.code
      }
    }
  }

  const submitAttempt = async (
    sessionToken: string,
    metadata?: any
  ): Promise<ApiResult<SubmitAttemptResponse>> => {
    try {
      const response = await $fetch<ApiResponse<SubmitAttemptResponse>>(
        `${apiUrl}/api/v1/attempts/${sessionToken}/submit`,
        {
          method: 'POST',
          body: {
            metadata,
          } as SubmitAttemptRequest,
        }
      )
      return { success: true, data: response.data }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to submit attempt',
        code: error.data?.code
      }
    }
  }

  const getAttemptsInfo = async (params?: {
    page?: number
    per_page?: number
    quizId?: number
    participantAlias?: string
    history?: boolean
    is_fully_evaluated?: boolean
  }): Promise<ApiResult<PaginatedData<AttemptListItem>>> => {
    try {
      const { authFetch } = useAuth()
      const queryParams = new URLSearchParams()
      
      if (params?.page) queryParams.append('page', params.page.toString())
      if (params?.per_page) queryParams.append('perPage', params.per_page.toString())
      if (params?.quizId) queryParams.append('quizId', params.quizId.toString())
      if (params?.participantAlias) queryParams.append('participantAlias', params.participantAlias)
      if (params?.history !== undefined) queryParams.append('history', params.history.toString())
      if (params?.is_fully_evaluated !== undefined) queryParams.append('isFullyEvaluated', params.is_fully_evaluated.toString())

      const response = await authFetch<PaginatedResponseData<AttemptListItem>>(
        `${apiUrl}/api/v1/info/attempts?${queryParams}`,
        { method: 'GET' }
      )

      return { 
        success: true, 
        data: response.data,
        code: response.code,
        message: response.message
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch attempts',
        code: error.data?.code
      }
    }
  }

  const getAttemptAnswers = async (
    attemptId: string,
    params?: {
      history?: boolean
      is_evaluated?: boolean
    }
  ): Promise<ApiResult<AttemptAnswersResponse>> => {
    try {
      const { authFetch } = useAuth()
      const queryParams = new URLSearchParams()
      
      if (params?.history !== undefined) queryParams.append('history', params.history.toString())
      if (params?.is_evaluated !== undefined) queryParams.append('isEvaluated', params.is_evaluated.toString())

      const queryString = queryParams.toString()
      const url = queryString 
        ? `${apiUrl}/api/v1/info/attempts/${attemptId}/answers?${queryString}`
        : `${apiUrl}/api/v1/info/attempts/${attemptId}/answers`

      const response = await authFetch<ApiResponse<AttemptAnswersResponse>>(url, {
        method: 'GET'
      })

      return {
        success: true,
        data: response.data,
        code: response.code,
        message: response.message
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to fetch attempt answers',
        code: error.data?.code
      }
    }
  }

  const evaluateAnswer = async (
    request: EvaluateAnswerRequest
  ): Promise<ApiResult<void>> => {
    try {
      const { authFetch } = useAuth()
      const response = await authFetch<ApiResponse<void>>(
        `${apiUrl}/api/v1/quizzes/evaluate-answer`,
        {
          method: 'POST',
          body: request
        }
      )

      return {
        success: true,
        code: response.code,
        message: response.message
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to evaluate answer',
        code: error.data?.code
      }
    }
  }

  const syncQuizEvaluation = async (
    quizId: number,
    request?: SyncQuizEvaluationRequest
  ): Promise<ApiResult<SyncQuizEvaluationResponse>> => {
    try {
      const { authFetch } = useAuth()
      const response = await authFetch<ApiResponse<SyncQuizEvaluationResponse>>(
        `${apiUrl}/api/v1/quizzes/${quizId}/sync-evaluation`,
        {
          method: 'POST',
          body: request || {}
        }
      )

      return {
        success: true,
        data: response.data,
        code: response.code,
        message: response.message
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.data?.message || 'Failed to sync evaluation',
        code: error.data?.code
      }
    }
  }

  return {
    createAttempt,
    getAttempt,
    submitAnswer,
    submitAttempt,
    getAttemptsInfo,
    getAttemptAnswers,
    evaluateAnswer,
    syncQuizEvaluation,
  }
}
