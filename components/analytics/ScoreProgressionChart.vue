<template>
  <div class="score-progression-chart">
    <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="score-progression-chart__empty">No score data available</div>
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
import type { ScoreProgressionPoint } from '~/types/analytics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  data: ScoreProgressionPoint[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

function resolveColor(cssVar: string): string {
  if (typeof window === 'undefined') return '#2f81f7'
  return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim() || '#2f81f7'
}

const chartData = computed(() => {
  if (!props.data.length) return null

  const accentColor = resolveColor('--color-gh-accent')

  return {
    labels: props.data.map((_d, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Score %',
        data: props.data.map(d => d.score_pct),
        borderColor: accentColor,
        backgroundColor: `${accentColor}1a`,
        fill: true,
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: accentColor,
        pointBorderColor: accentColor,
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
      tooltip: {
        callbacks: {
          title(items: any[]) {
            const idx = items[0]?.dataIndex
            if (idx === undefined) return ''
            const point = props.data[idx]
            return point ? point.quiz_title : ''
          },
          label(ctx: any) {
            const idx = ctx.dataIndex
            const point = props.data[idx]
            if (!point) return `${ctx.parsed.y.toFixed(1)}%`
            return [
              `Score: ${point.score}/${point.total_points} (${point.score_pct.toFixed(1)}%)`,
              `Date: ${new Date(point.submitted_at).toLocaleDateString()}`,
            ]
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: mutedColor },
        title: {
          display: true,
          text: 'Attempt',
          color: mutedColor,
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: gridColor },
        ticks: {
          color: mutedColor,
          callback: (v: number | string) => `${v}%`,
        },
        title: {
          display: true,
          text: 'Score %',
          color: mutedColor,
        },
      },
    },
  }
})
</script>

<style scoped>
.score-progression-chart {
  position: relative;
  width: 100%;
  height: v-bind("`${height}px`");
}

.score-progression-chart__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gh-muted);
  font-size: 0.875rem;
}
</style>
