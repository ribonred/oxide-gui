<template>
  <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <UiButton @click="router.push(`/participants/${participantId}`)">Back to Participant</UiButton>
    </div>

    <!-- No Submissions State -->
    <div v-else-if="noData">
      <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
        <UiBackButton :to="`/participants/${participantId}`" title="Back to Participant" />
        <h1 class="text-xl md:text-2xl font-bold text-gh-text">Analytics</h1>
      </div>
      <UiCard>
        <div class="flex flex-col items-center justify-center py-12">
          <svg class="w-16 h-16 text-gh-muted mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gh-text mb-2">No Analytics Available</h3>
          <p class="text-sm text-gh-muted text-center max-w-md">
            This participant has not submitted any quiz attempts yet. Analytics will appear here once they complete a quiz.
          </p>
        </div>
      </UiCard>
    </div>

    <!-- Analytics Content -->
    <div v-else-if="report">
      <!-- Header -->
      <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
        <UiBackButton :to="`/participants/${participantId}`" title="Back to Participant" />
        <div>
          <h1 class="text-xl md:text-2xl font-bold text-gh-text">Analytics</h1>
          <p class="text-sm text-gh-muted">{{ report.alias }}</p>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AnalyticsStatCard label="Quizzes Attempted" :value="report.total_quizzes_attempted" format="number" />
        <AnalyticsStatCard label="Total Attempts" :value="report.total_attempts" format="number" />
        <AnalyticsStatCard label="Avg Score" :value="report.avg_score_pct" format="percent" />
        <AnalyticsStatCard label="Percentile Rank" :value="report.percentile_rank" format="percent" />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Score Progression -->
        <UiCard>
          <h3 class="text-sm font-medium text-gh-muted mb-3 uppercase tracking-wider">Score Progression</h3>
          <ClientOnly>
            <AnalyticsScoreProgressionChart :data="report.score_progression" :height="280" />
          </ClientOnly>
        </UiCard>

        <!-- Category Performance -->
        <UiCard>
          <h3 class="text-sm font-medium text-gh-muted mb-3 uppercase tracking-wider">Category Performance</h3>
          <ClientOnly>
            <AnalyticsCategoryRadarChart :data="report.category_performance" :height="280" />
          </ClientOnly>
        </UiCard>
      </div>

      <!-- Quiz Attempts Table -->
      <UiCard padding="none">
        <div class="p-4 md:p-6 border-b border-gh-border">
          <h3 class="text-sm font-medium text-gh-muted uppercase tracking-wider">Quiz Attempts</h3>
        </div>

        <div v-if="quizAttempts.length === 0" class="p-8 text-center text-gh-muted text-sm">
          No quiz attempts found
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gh-border">
                <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gh-muted uppercase tracking-wider w-8"></th>
                <th class="px-4 md:px-6 py-3 text-left text-xs font-medium text-gh-muted uppercase tracking-wider">Quiz</th>
                <th class="px-4 md:px-6 py-3 text-center text-xs font-medium text-gh-muted uppercase tracking-wider hidden sm:table-cell">Score</th>
                <th class="px-4 md:px-6 py-3 text-center text-xs font-medium text-gh-muted uppercase tracking-wider">Score %</th>
                <th class="px-4 md:px-6 py-3 text-center text-xs font-medium text-gh-muted uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(attempt, idx) in quizAttempts" :key="idx">
                <!-- Attempt Row -->
                <tr
                  class="border-b border-gh-border hover:bg-gh-bg-secondary/50 cursor-pointer transition-colors"
                  @click="toggleExpand(attempt)"
                >
                  <td class="px-4 md:px-6 py-3">
                    <svg
                      class="w-4 h-4 text-gh-muted transition-transform duration-200"
                      :class="{ 'rotate-90': expandedQuizzes.has(expandKey(attempt)) }"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </td>
                  <td class="px-4 md:px-6 py-3 text-sm text-gh-text font-medium">
                    {{ attempt.quiz_title }}
                  </td>
                  <td class="px-4 md:px-6 py-3 text-center text-sm text-gh-text hidden sm:table-cell">
                    {{ attempt.score }}/{{ attempt.total_points }}
                  </td>
                  <td class="px-4 md:px-6 py-3 text-center">
                    <span
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      :class="scoreClass(attempt.score_pct)"
                    >
                      {{ attempt.score_pct.toFixed(1) }}%
                    </span>
                  </td>
                  <td class="px-4 md:px-6 py-3 text-center text-sm text-gh-muted hidden md:table-cell">
                    {{ formatDate(attempt.submitted_at) }}
                  </td>
                </tr>

                <!-- Expanded Detail -->
                <tr v-if="expandedQuizzes.has(expandKey(attempt))">
                  <td colspan="5" class="bg-gh-bg/50 px-4 md:px-6 py-4">
                    <!-- Loading answers -->
                    <div v-if="loadingDetail.has(expandKey(attempt))" class="flex items-center justify-center py-6">
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gh-accent"></div>
                    </div>

                    <!-- Error loading answers -->
                    <div v-else-if="detailErrors.get(expandKey(attempt))" class="text-center py-4">
                      <p class="text-red-400 text-sm">{{ detailErrors.get(expandKey(attempt)) }}</p>
                    </div>

                    <!-- Answer Detail -->
                    <div v-else-if="quizDetails.get(expandKey(attempt))" class="space-y-3">
                      <!-- Quiz Summary Bar -->
                      <div class="flex flex-wrap items-center gap-4 text-sm mb-3">
                        <span class="text-gh-muted">
                          Rank: <strong class="text-gh-text">{{ quizDetails.get(expandKey(attempt))!.rank }}</strong>
                        </span>
                        <span class="text-gh-muted">
                          Percentile: <strong class="text-gh-text">{{ quizDetails.get(expandKey(attempt))!.percentile.toFixed(1) }}%</strong>
                        </span>
                        <span v-if="quizDetails.get(expandKey(attempt))!.time_taken_ms" class="text-gh-muted">
                          Time: <strong class="text-gh-text">{{ formatTime(quizDetails.get(expandKey(attempt))!.time_taken_ms!) }}</strong>
                        </span>
                      </div>

                      <!-- Answers Table -->
                      <div class="overflow-x-auto rounded-md border border-gh-border">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="border-b border-gh-border bg-gh-bg-secondary/30">
                              <th class="px-3 py-2 text-left text-xs font-medium text-gh-muted uppercase">Question</th>
                              <th class="px-3 py-2 text-center text-xs font-medium text-gh-muted uppercase hidden sm:table-cell">Type</th>
                              <th class="px-3 py-2 text-left text-xs font-medium text-gh-muted uppercase">Answer</th>
                              <th class="px-3 py-2 text-center text-xs font-medium text-gh-muted uppercase">Correct</th>
                              <th class="px-3 py-2 text-center text-xs font-medium text-gh-muted uppercase hidden md:table-cell">Score</th>
                              <th class="px-3 py-2 text-center text-xs font-medium text-gh-muted uppercase hidden lg:table-cell">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="answer in quizDetails.get(expandKey(attempt))!.answers"
                              :key="answer.question_id"
                              class="border-b border-gh-border/50 last:border-0"
                            >
                              <td class="px-3 py-2 text-gh-text max-w-[200px] truncate" :title="answer.question_title">
                                {{ answer.question_title }}
                              </td>
                              <td class="px-3 py-2 text-center hidden sm:table-cell">
                                <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gh-bg-secondary text-gh-muted border border-gh-border">
                                  {{ answer.question_type }}
                                </span>
                              </td>
                              <td class="px-3 py-2 text-gh-text max-w-[180px] truncate" :title="answer.user_answer">
                                {{ answer.user_answer || '—' }}
                              </td>
                              <td class="px-3 py-2 text-center">
                                <span v-if="answer.is_correct === true" class="text-green-400">
                                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <span v-else-if="answer.is_correct === false" class="text-red-400">
                                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                                <span v-else class="text-gh-muted">—</span>
                              </td>
                              <td class="px-3 py-2 text-center text-gh-text hidden md:table-cell">
                                {{ answer.score.toFixed(1) }}
                              </td>
                              <td class="px-3 py-2 text-center text-gh-muted hidden lg:table-cell">
                                {{ answer.time_spent_ms ? formatTime(answer.time_spent_ms) : '—' }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  ParticipantReportResponse,
  ParticipantQuizDetailResponse,
  ScoreProgressionPoint,
} from '~/types/analytics'

const route = useRoute()
const router = useRouter()
const { getParticipantReport, getParticipantQuizDetail } = useAnalytics()

const participantId = computed(() => route.params.id as string)

const report = ref<ParticipantReportResponse | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const noData = ref(false)

const expandedQuizzes = ref(new Set<string>())
const quizDetails = ref(new Map<string, ParticipantQuizDetailResponse>())
const loadingDetail = ref(new Set<string>())
const detailErrors = ref(new Map<string, string>())

const quizAttempts = computed((): ScoreProgressionPoint[] => {
  if (!report.value) return []
  return [...report.value.score_progression].sort(
    (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
  )
})

const expandKey = (attempt: ScoreProgressionPoint) =>
  `${attempt.quiz_id}_${attempt.attempt_number}`

const toggleExpand = async (attempt: ScoreProgressionPoint) => {
  const key = expandKey(attempt)

  if (expandedQuizzes.value.has(key)) {
    expandedQuizzes.value.delete(key)
    return
  }

  expandedQuizzes.value.add(key)

  if (quizDetails.value.has(key) || loadingDetail.value.has(key)) return

  loadingDetail.value.add(key)
  detailErrors.value.delete(key)

  const result = await getParticipantQuizDetail(participantId.value, attempt.quiz_id)
  if (result.success) {
    quizDetails.value.set(key, result.data.data)
  } else {
    detailErrors.value.set(key, result.error || 'Failed to load details')
  }
  loadingDetail.value.delete(key)
}

const scoreClass = (pct: number) => {
  if (pct >= 80) return 'bg-green-500/10 text-green-400 border border-green-500/20'
  if (pct >= 60) return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
  return 'bg-red-500/10 text-red-400 border border-red-500/20'
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTime = (ms: number) => {
  if (ms < 1000) return `${Math.round(ms)}ms`
  const secs = ms / 1000
  if (secs < 60) return `${secs.toFixed(1)}s`
  return `${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s`
}

const fetchReport = async () => {
  loading.value = true
  error.value = null
  noData.value = false
  const result = await getParticipantReport(participantId.value)
  if (result.success) {
    report.value = result.data.data
  } else if (result.code === 'AN-404') {
    noData.value = true
  } else {
    error.value = result.error || 'Failed to load analytics'
  }
  loading.value = false
}

onMounted(fetchReport)
</script>
