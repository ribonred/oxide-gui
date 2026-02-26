<template>
  <div class="trend-chart">
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="trend-chart__empty">No data available</div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import type { TrendDataPoint } from '~/types/analytics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  data: TrendDataPoint[]
  metric?: 'attempt_count' | 'unique_participants' | 'avg_score' | 'completion_rate'
  title?: string
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  metric: 'attempt_count',
  title: '',
  height: 300,
})

type MetricConfig = { label: string; color: string; format: (v: number) => string }

const metricConfigs: Record<NonNullable<Props['metric']>, MetricConfig> = {
  attempt_count: {
    label: 'Attempts',
    color: 'var(--color-gh-accent)',
    format: (v: number) => v.toLocaleString(),
  },
  unique_participants: {
    label: 'Participants',
    color: 'var(--color-gh-success)',
    format: (v: number) => v.toLocaleString(),
  },
  avg_score: {
    label: 'Avg Score',
    color: 'var(--color-gh-warning)',
    format: (v: number) => `${v.toFixed(1)}%`,
  },
  completion_rate: {
    label: 'Completion Rate',
    color: 'var(--color-gh-info)',
    format: (v: number) => `${v.toFixed(1)}%`,
  },
}

const metricConfig = computed((): MetricConfig => metricConfigs[props.metric])

function resolveColor(cssVar: string): string {
  if (typeof window === 'undefined') return '#2f81f7'
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#2f81f7'
}

const chartData = computed(() => {
  if (!props.data.length) return null
  const cfg = metricConfig.value
  const rawColor = resolveColor(cfg.color.replace('var(', '').replace(')', ''))
  return {
    labels: props.data.map(d => {
      const date = new Date(d.bucket)
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: cfg.label,
        data: props.data.map(d => {
          if (props.metric === 'avg_score') return d.avg_score_pct
          if (props.metric === 'completion_rate') return d.completion_rate * 100
          return d[props.metric]
        }),
        borderColor: rawColor,
        backgroundColor: `${rawColor}1a`,
        fill: true,
        tension: 0.3,
        pointRadius: props.data.length > 30 ? 0 : 3,
        pointHoverRadius: 5,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const textColor = resolveColor('--color-gh-text')
  const mutedColor = resolveColor('--color-gh-muted')
  const gridColor = resolveColor('--color-gh-border') + '26'

  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: { display: false },
      title: {
        display: !!props.title,
        text: props.title,
        color: textColor,
        font: { size: 14, weight: 'bold' as const },
      },
      tooltip: {
        callbacks: {
          label(ctx: any) {
            return `${metricConfig.value.label}: ${metricConfig.value.format(ctx.parsed.y)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: mutedColor, maxRotation: 45 },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: mutedColor,
          callback: (props.metric === 'completion_rate' || props.metric === 'avg_score')
            ? (v: number | string) => `${v}%`
            : undefined,
        },
      },
    },
  }
})
</script>

<style scoped>
.trend-chart {
  position: relative;
  width: 100%;
  height: v-bind("`${height}px`");
}

.trend-chart__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gh-muted);
  font-size: 0.875rem;
}
</style>
