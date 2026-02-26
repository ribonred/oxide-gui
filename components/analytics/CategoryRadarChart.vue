<template>
  <div class="category-radar-chart">
    <Radar v-if="chartData" :data="chartData" :options="chartOptions" />
    <div v-else class="category-radar-chart__empty">No category data available</div>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import type { CategoryPerformance } from '~/types/analytics'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface Props {
  data: CategoryPerformance[]
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
    labels: props.data.map(d => d.category),
    datasets: [
      {
        label: 'Correct Rate',
        data: props.data.map(d => d.correct_rate * 100),
        backgroundColor: `${accentColor}33`,
        borderColor: accentColor,
        borderWidth: 2,
        pointBackgroundColor: accentColor,
        pointBorderColor: accentColor,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }
})

const chartOptions = computed(() => {
  const textColor = resolveColor('--color-gh-text')
  const mutedColor = resolveColor('--color-gh-muted')
  const gridColor = resolveColor('--color-gh-border') + '40'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title(items: any[]) {
            return items[0]?.label || ''
          },
          label(ctx: any) {
            const idx = ctx.dataIndex
            const cat = props.data[idx]
            if (!cat) return `${ctx.parsed.r.toFixed(1)}%`
            return [
              `Correct Rate: ${(cat.correct_rate * 100).toFixed(1)}%`,
              `${cat.correct_count}/${cat.total_questions} correct`,
            ]
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: mutedColor,
          backdropColor: 'transparent',
          callback: (v: number | string) => `${v}%`,
        },
        grid: {
          color: gridColor,
        },
        angleLines: {
          color: gridColor,
        },
        pointLabels: {
          color: textColor,
          font: { size: 12 },
        },
      },
    },
  }
})
</script>

<style scoped>
.category-radar-chart {
  position: relative;
  width: 100%;
  height: v-bind("`${height}px`");
}

.category-radar-chart__empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gh-muted);
  font-size: 0.875rem;
}
</style>
