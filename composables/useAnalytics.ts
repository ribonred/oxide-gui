import type { ApiResponse, PaginatedData } from '~/types/api'
import type {
  QuizSummaryResponse,
  QuizPerformanceResponse,
  QuestionStatsResponse,
  QuizQuestionStatsResponse,
  ParticipantReportResponse,
  QuizParticipantRow,
  ParticipantQuizDetailResponse,
  EventStatsResponse,
  EventCompareResponse,
  EventTimelineResponse,
  TrendsOverviewResponse,
  ActivityResponse,
  TopQuizzesResponse,
  TimeGranularity,
  QuestionStatsSortBy,
  ParticipantSortBy,
  TopQuizSortBy,
  SortOrder,
} from '~/types/analytics'

function buildQuery(params: Record<string, string | number | boolean | undefined | null>): string {
  const qs = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      qs.append(key, String(val))
    }
  }
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export const useAnalytics = () => {
  const config = useRuntimeConfig()
  const { authFetch } = useAuth()
  const apiUrl = config.public.apiUrl || 'http://localhost:8080'
  const base = `${apiUrl}/api/v1/analytics`

  // ---------------------------------------------------------------------------
  // Phase 2 — Quiz Performance
  // ---------------------------------------------------------------------------

  const getQuizSummary = async (quizId: number) => {
    try {
      const res = await authFetch<ApiResponse<QuizSummaryResponse>>(
        `${base}/quizzes/${quizId}/summary`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch quiz summary', code: error.data?.code }
    }
  }

  const getQuizPerformance = async (
    quizId: number,
    params?: {
      granularity?: TimeGranularity
      from?: string
      to?: string
      pass_threshold?: number
      bucket_count?: number
    },
  ) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<QuizPerformanceResponse>>(
        `${base}/quizzes/${quizId}/performance${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch quiz performance', code: error.data?.code }
    }
  }

  // ---------------------------------------------------------------------------
  // Phase 3 — Question Analysis
  // ---------------------------------------------------------------------------

  const getQuestionStats = async (questionId: string) => {
    try {
      const res = await authFetch<ApiResponse<QuestionStatsResponse>>(
        `${base}/questions/${questionId}/stats`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch question stats', code: error.data?.code }
    }
  }

  const getQuizQuestionStats = async (
    quizId: number,
    params?: { sort_by?: QuestionStatsSortBy; sort_order?: SortOrder },
  ) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<QuizQuestionStatsResponse>>(
        `${base}/quizzes/${quizId}/questions${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch quiz question stats', code: error.data?.code }
    }
  }

  // ---------------------------------------------------------------------------
  // Phase 4 — Participant Reports
  // ---------------------------------------------------------------------------

  const getParticipantReport = async (
    participantId: string,
    params?: { quiz_ids?: string; from?: string; to?: string },
  ) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<ParticipantReportResponse>>(
        `${base}/participants/${participantId}/report${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch participant report', code: error.data?.code }
    }
  }

  const getQuizParticipants = async (
    quizId: number,
    params?: {
      sort_by?: ParticipantSortBy
      sort_order?: SortOrder
      page?: number
      per_page?: number
    },
  ) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<PaginatedData<QuizParticipantRow>>>(
        `${base}/quizzes/${quizId}/participants${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch quiz participants', code: error.data?.code }
    }
  }

  const getParticipantQuizDetail = async (participantId: string, quizId: number) => {
    try {
      const res = await authFetch<ApiResponse<ParticipantQuizDetailResponse>>(
        `${base}/participants/${participantId}/quizzes/${quizId}/report`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch participant quiz detail', code: error.data?.code }
    }
  }

  // ---------------------------------------------------------------------------
  // Phase 5 — Event Analytics
  // ---------------------------------------------------------------------------

  const getEventStats = async (eventId: string) => {
    try {
      const res = await authFetch<ApiResponse<EventStatsResponse>>(
        `${base}/events/${eventId}/stats`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch event stats', code: error.data?.code }
    }
  }

  const getEventCompare = async (eventIds: string[]) => {
    try {
      const qs = buildQuery({ event_ids: eventIds.join(',') })
      const res = await authFetch<ApiResponse<EventCompareResponse>>(
        `${base}/events/compare${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to compare events', code: error.data?.code }
    }
  }

  const getEventTimeline = async (eventId: string, bucketMinutes?: number) => {
    try {
      const qs = buildQuery({ bucket_minutes: bucketMinutes })
      const res = await authFetch<ApiResponse<EventTimelineResponse>>(
        `${base}/events/${eventId}/timeline${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch event timeline', code: error.data?.code }
    }
  }

  // ---------------------------------------------------------------------------
  // Phase 6 — Time-Series Trends (Platform Dashboard)
  // ---------------------------------------------------------------------------

  const getTrendsOverview = async (params?: {
    granularity?: TimeGranularity
    from?: string
    to?: string
  }) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<TrendsOverviewResponse>>(
        `${base}/trends/overview${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch trends overview', code: error.data?.code }
    }
  }

  const getTrendsActivity = async (params?: { from?: string; to?: string }) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<ActivityResponse>>(
        `${base}/trends/activity${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch activity data', code: error.data?.code }
    }
  }

  const getTrendsTopQuizzes = async (params?: {
    sort_by?: TopQuizSortBy
    sort_order?: SortOrder
    limit?: number
  }) => {
    try {
      const qs = buildQuery(params ?? {})
      const res = await authFetch<ApiResponse<TopQuizzesResponse>>(
        `${base}/trends/top-quizzes${qs}`,
      )
      return { success: true as const, data: res }
    } catch (error: any) {
      return { success: false as const, error: error.data?.message || 'Failed to fetch top quizzes', code: error.data?.code }
    }
  }

  return {
    // Phase 2
    getQuizSummary,
    getQuizPerformance,
    // Phase 3
    getQuestionStats,
    getQuizQuestionStats,
    // Phase 4
    getParticipantReport,
    getQuizParticipants,
    getParticipantQuizDetail,
    // Phase 5
    getEventStats,
    getEventCompare,
    getEventTimeline,
    // Phase 6
    getTrendsOverview,
    getTrendsActivity,
    getTrendsTopQuizzes,
  }
}
