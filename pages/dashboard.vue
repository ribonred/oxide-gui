<template>
  <div class="dashboard">
    <div class="dashboard__header">
      <h1 class="dashboard__title">Dashboard</h1>
      <div class="dashboard__actions">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.to"
          :to="action.to"
          class="dashboard__action-pill"
        >
          <span class="dashboard__action-icon" v-html="action.icon"></span>
          <span>{{ action.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Stat Cards -->
    <div class="dashboard__stats">
      <AnalyticsStatCard
        label="Total Quizzes"
        :value="totals.total_quizzes"
        :loading="loading"
      />
      <AnalyticsStatCard
        label="Total Participants"
        :value="totals.total_participants"
        :loading="loading"
      />
      <AnalyticsStatCard
        label="Total Attempts"
        :value="totals.total_attempts"
        :loading="loading"
      />
      <AnalyticsStatCard
        label="Avg Score"
        :value="totals.avg_score_pct"
        format="percent"
        :loading="loading"
      />
    </div>

    <!-- Trend Chart -->
    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Attempt Trends</h2>
        <div class="dashboard__metric-toggle">
          <button
            v-for="m in metrics"
            :key="m.key"
            class="dashboard__metric-btn"
            :class="{ 'dashboard__metric-btn--active': selectedMetric === m.key }"
            @click="selectedMetric = m.key"
          >
            {{ m.label }}
          </button>
        </div>
      </div>
      <div class="dashboard__chart-box">
        <div v-if="loading" class="dashboard__chart-loading animate-pulse">Loading chart...</div>
        <AnalyticsTrendLineChart
          v-else
          :data="trendSeries"
          :metric="selectedMetric"
          :height="320"
        />
      </div>
    </div>

    <!-- Activity Heatmap -->
    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Activity Heatmap</h2>
        <span class="dashboard__section-subtitle">Hour of day × Day of week</span>
      </div>
      <div class="dashboard__chart-box">
        <div v-if="activityLoading" class="dashboard__chart-loading animate-pulse">Loading heatmap...</div>
        <AnalyticsHeatmapChart v-else :data="heatmapData" />
      </div>
    </div>

    <!-- Top Quizzes -->
    <div class="dashboard__section">
      <div class="dashboard__section-header">
        <h2 class="dashboard__section-title">Top Quizzes</h2>
      </div>
      <div v-if="topLoading" class="dashboard__chart-loading animate-pulse">Loading...</div>
      <div v-else-if="topQuizzes.length" class="dashboard__grid-wrap">
        <ClientOnly>
          <AgGridVue
            class="ag-theme-alpine dashboard__grid"
            :style="{ width: '100%', height: `${topGridHeight}px` }"
            :gridOptions="topGridOptions"
            :rowData="topQuizzes"
            :columnDefs="topColumnDefs"
            :defaultColDef="topDefaultColDef"
            :rowHeight="36"
            :headerHeight="36"
            :domLayout="'normal'"
            :suppressCellFocus="true"
            :animateRows="false"
          />
        </ClientOnly>
      </div>
      <p v-else class="dashboard__empty">No quiz data yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import type { ColDef, ValueFormatterParams } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import type {
  TrendDataPoint,
  TrendsOverviewTotals,
  HeatmapCell,
  TopQuizRow,
} from '~/types/analytics'

declare global {
  // eslint-disable-next-line no-var
  var __quizServiceAgGridRegistered: boolean | undefined
}

if (!globalThis.__quizServiceAgGridRegistered) {
  ModuleRegistry.registerModules([AllCommunityModule])
  globalThis.__quizServiceAgGridRegistered = true
}

definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { getTrendsOverview, getTrendsActivity, getTrendsTopQuizzes } = useAnalytics()

type MetricKey = 'attempt_count' | 'unique_participants' | 'avg_score' | 'completion_rate'

const metrics: { key: MetricKey; label: string }[] = [
  { key: 'attempt_count', label: 'Attempts' },
  { key: 'unique_participants', label: 'Participants' },
  { key: 'avg_score', label: 'Avg Score' },
  { key: 'completion_rate', label: 'Completion' },
]

const selectedMetric = ref<MetricKey>('attempt_count')

const loading = ref(true)
const activityLoading = ref(true)
const topLoading = ref(true)

const totals = ref<TrendsOverviewTotals>({
  total_quizzes: 0,
  total_participants: 0,
  total_attempts: 0,
  avg_score: 0,
  avg_score_pct: 0,
  avg_completion_rate: 0,
})
const trendSeries = ref<TrendDataPoint[]>([])
const heatmapData = ref<HeatmapCell[]>([])
const topQuizzes = ref<TopQuizRow[]>([])

const topGridOptions = { theme: 'legacy' as const }

const topDefaultColDef: ColDef = {
  sortable: true,
  resizable: false,
}

const topColumnDefs = computed<ColDef<TopQuizRow>[]>(() => [
  {
    headerName: 'Quiz',
    field: 'quiz_title',
    flex: 2,
    minWidth: 180,
  },
  {
    headerName: 'Attempts',
    field: 'total_attempts',
    flex: 1,
    minWidth: 100,
  },
  {
    headerName: 'Participants',
    field: 'unique_participants',
    flex: 1,
    minWidth: 110,
  },
  {
    headerName: 'Avg Score',
    field: 'avg_score_pct',
    flex: 1,
    minWidth: 100,
    valueFormatter: (p: ValueFormatterParams<TopQuizRow>) =>
      p.value != null ? `${Number(p.value).toFixed(1)}%` : '',
  },
  {
    headerName: 'Completion',
    field: 'completion_rate',
    flex: 1,
    minWidth: 100,
    valueFormatter: (p: ValueFormatterParams<TopQuizRow>) =>
      p.value != null ? `${(Number(p.value) * 100).toFixed(1)}%` : '',
  },
])

const topGridHeight = computed(() => 36 + topQuizzes.value.length * 36 + 2)

const quickActions = [
  {
    label: 'New Question',
    to: '/questions/create',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>`,
  },
  {
    label: 'Quizzes',
    to: '/quizzes',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
  },
  {
    label: 'Events',
    to: '/events',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  },
  {
    label: 'API Keys',
    to: '/apikeys',
    icon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>`,
  },
]

async function fetchOverview() {
  loading.value = true
  const result = await getTrendsOverview({ granularity: 'daily' })
  if (result.success && result.data) {
    totals.value = result.data.data.totals
    trendSeries.value = result.data.data.series
  }
  loading.value = false
}

async function fetchActivity() {
  activityLoading.value = true
  const result = await getTrendsActivity()
  if (result.success && result.data) {
    heatmapData.value = result.data.data.heatmap
  }
  activityLoading.value = false
}

async function fetchTopQuizzes() {
  topLoading.value = true
  const result = await getTrendsTopQuizzes({ sort_by: 'attempts', sort_order: 'desc', limit: 10 })
  if (result.success && result.data) {
    topQuizzes.value = result.data.data.quizzes
  }
  topLoading.value = false
}

onMounted(() => {
  fetchOverview()
  fetchActivity()
  fetchTopQuizzes()
})
</script>

<style scoped>
.dashboard {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.dashboard__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-gh-text);
}

.dashboard__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dashboard__action-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: 9999px;
  border: 1px solid var(--color-gh-border);
  color: var(--color-gh-text);
  background: var(--color-gh-card);
  transition: background 0.15s, border-color 0.15s;
  text-decoration: none;
}

.dashboard__action-pill:hover {
  background: var(--color-gh-card-hover);
  border-color: var(--color-gh-accent);
}

.dashboard__action-icon {
  display: inline-flex;
  align-items: center;
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 0.75rem;
}

.dashboard__section {
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.dashboard__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.dashboard__section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gh-text);
}

.dashboard__section-subtitle {
  font-size: 0.75rem;
  color: var(--color-gh-muted);
}

.dashboard__metric-toggle {
  display: flex;
  gap: 0.25rem;
  background: var(--color-gh-bg);
  padding: 0.125rem;
  border-radius: 0.375rem;
}

.dashboard__metric-btn {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  border: none;
  background: transparent;
  color: var(--color-gh-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dashboard__metric-btn--active {
  background: var(--color-gh-card);
  color: var(--color-gh-text);
}

.dashboard__chart-box {
  min-height: 200px;
}

.dashboard__chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-gh-muted);
  font-size: 0.875rem;
}

.dashboard__grid-wrap {
  overflow: hidden;
  border-radius: 0.375rem;
}

/* AG Grid theme overrides */
:deep(.dashboard__grid.ag-theme-alpine) {
  --ag-background-color: var(--color-gh-card);
  --ag-foreground-color: var(--color-gh-text);
  --ag-header-background-color: var(--color-gh-bg);
  --ag-header-foreground-color: var(--color-gh-muted);
  --ag-border-color: var(--color-gh-border);
  --ag-row-border-color: color-mix(in srgb, var(--color-gh-border) 40%, transparent);
  --ag-odd-row-background-color: var(--color-gh-card);
  --ag-row-hover-color: var(--color-gh-card-hover);
  --ag-font-family: inherit;
  --ag-font-size: 0.8125rem;
}

:deep(.dashboard__grid .ag-root-wrapper) {
  border: none;
  background: transparent;
}

:deep(.dashboard__grid .ag-header) {
  border-bottom: 1px solid var(--color-gh-border);
}

:deep(.dashboard__grid .ag-header-cell-label) {
  font-weight: 500;
  font-size: 0.8125rem;
}

:deep(.dashboard__grid .ag-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

:deep(.dashboard__grid .ag-header-cell-label) {
  justify-content: center;
  font-weight: 500;
  font-size: 0.8125rem;
}

:deep(.dashboard__grid .ag-cell:first-child) {
  justify-content: flex-start;
}

:deep(.dashboard__grid .ag-header-cell:first-child .ag-header-cell-label) {
  justify-content: flex-start;
}

.dashboard__empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-gh-muted);
  font-size: 0.875rem;
}


</style>
