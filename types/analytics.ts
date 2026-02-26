// Analytics response types matching Rust backend structures

// ---------------------------------------------------------------------------
// Phase 2 — Quiz Performance
// ---------------------------------------------------------------------------

export interface QuizSummaryResponse {
  quiz_id: number
  quiz_title: string
  total_points: number
  total_attempts: number
  unique_participants: number
  completion_rate: number
  avg_score: number
  avg_score_pct: number
  best_score: number
  worst_score: number
  avg_time_taken_ms: number | null
}

export interface ScoreDistributionBucket {
  range_start: number
  range_end: number
  count: number
}

export interface TrendDataPoint {
  bucket: string
  attempt_count: number
  unique_participants: number
  avg_score: number
  avg_score_pct: number
  completion_rate: number
}

export interface QuizPerformanceResponse {
  distribution: ScoreDistributionBucket[]
  mean: number
  median: number
  std_deviation: number
  pass_rate: number
  pass_threshold: number
  avg_time_taken_ms: number | null
  trends: TrendDataPoint[]
}

// ---------------------------------------------------------------------------
// Phase 3 — Question Analysis
// ---------------------------------------------------------------------------

export interface DistractorOption {
  label: string
  value: string
  selection_count: number
  selection_rate: number
}

export interface QuestionStatsResponse {
  question_id: string
  question_title: string
  question_type: string
  difficulty_index: number
  discrimination_index: number
  avg_time_ms: number
  median_time_ms: number
  attempt_count: number
  distractors: DistractorOption[]
  most_common_wrong: string[]
}

export interface QuizQuestionStatsResponse {
  quiz_id: number
  quiz_title: string
  questions: QuestionStatsResponse[]
}

// ---------------------------------------------------------------------------
// Phase 4 — Participant Reports
// ---------------------------------------------------------------------------

export interface ScoreProgressionPoint {
  attempt_number: number
  quiz_id: number
  quiz_title: string
  score: number
  total_points: number
  score_pct: number
  submitted_at: string
}

export interface CategoryPerformance {
  category: string
  total_questions: number
  correct_count: number
  correct_rate: number
}

export interface ParticipantReportResponse {
  participant_id: string
  alias: string
  total_quizzes_attempted: number
  total_attempts: number
  avg_score: number
  avg_score_pct: number
  best_score: number
  percentile_rank: number
  score_progression: ScoreProgressionPoint[]
  category_performance: CategoryPerformance[]
}

export interface QuizParticipantRow {
  participant_id: string
  alias: string
  score: number
  total_points: number
  score_pct: number
  rank: number
  attempts_count: number
  time_taken_ms: number | null
  submitted_at: string | null
}

export interface AnswerDetail {
  question_id: string
  question_title: string
  question_type: string
  user_answer: string
  is_correct: boolean | null
  score: number
  time_spent_ms: number | null
  quiz_avg_score: number
}

export interface ParticipantQuizDetailResponse {
  participant_id: string
  quiz_id: number
  quiz_title: string
  score: number
  total_points: number
  score_pct: number
  rank: number
  percentile: number
  time_taken_ms: number | null
  answers: AnswerDetail[]
}

// ---------------------------------------------------------------------------
// Phase 5 — Event Analytics
// ---------------------------------------------------------------------------

export interface EventStatsResponse {
  event_id: string
  event_name: string
  quiz_id: number
  quiz_title: string
  starts_at: string
  ends_at: string
  total_registered: number
  total_attempted: number
  participation_rate: number
  total_submitted: number
  completion_rate: number
  avg_score: number
  avg_score_pct: number
  total_points: number
  score_distribution: ScoreDistributionBucket[]
  peak_participation_time: string | null
}

export interface EventCompareRow {
  event_id: string
  event_name: string
  quiz_title: string
  avg_score: number
  avg_score_pct: number
  completion_rate: number
  participation_rate: number
  total_attempted: number
  total_submitted: number
}

export interface EventCompareResponse {
  events: EventCompareRow[]
}

export interface EventTimelineBucket {
  bucket: string
  new_attempts: number
  submissions: number
}

export interface EventTimelineResponse {
  event_id: string
  event_name: string
  buckets: EventTimelineBucket[]
}

// ---------------------------------------------------------------------------
// Phase 6 — Time-Series Trends (Platform Dashboard)
// ---------------------------------------------------------------------------

export interface TrendsOverviewTotals {
  total_quizzes: number
  total_participants: number
  total_attempts: number
  avg_score: number
  avg_score_pct: number
  avg_completion_rate: number
}

export interface TrendsOverviewResponse {
  totals: TrendsOverviewTotals
  series: TrendDataPoint[]
}

export interface HeatmapCell {
  day_of_week: number
  hour: number
  count: number
}

export interface CalendarDay {
  date: string
  count: number
}

export interface ActivityResponse {
  heatmap: HeatmapCell[]
  calendar: CalendarDay[]
}

export interface TopQuizRow {
  quiz_id: number
  quiz_title: string
  total_attempts: number
  unique_participants: number
  avg_score: number
  avg_score_pct: number
  completion_rate: number
  avg_time_taken_ms: number | null
}

export interface TopQuizzesResponse {
  quizzes: TopQuizRow[]
}

// ---------------------------------------------------------------------------
// Query parameter types
// ---------------------------------------------------------------------------

export type TimeGranularity = 'hourly' | 'daily' | 'weekly' | 'monthly'

export type QuestionStatsSortBy = 'difficulty' | 'discrimination' | 'avg_time'

export type ParticipantSortBy = 'score' | 'rank' | 'attempts' | 'time'

export type TopQuizSortBy = 'attempts' | 'participants' | 'avg_score' | 'completion_rate'

export type SortOrder = 'asc' | 'desc'
