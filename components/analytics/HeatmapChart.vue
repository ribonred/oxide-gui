<template>
  <div class="heatmap">
    <div class="heatmap__header">
      <div class="heatmap__corner"></div>
      <div v-for="h in hours" :key="h" class="heatmap__hour-label">{{ formatHour(h) }}</div>
    </div>
    <div v-for="day in days" :key="day.idx" class="heatmap__row">
      <div class="heatmap__day-label">{{ day.label }}</div>
      <div
        v-for="h in 24"
        :key="h - 1"
        class="heatmap__cell"
        :style="{ backgroundColor: cellColor(day.idx, h - 1) }"
        :title="`${day.label} ${formatHour(h - 1)} — ${getCount(day.idx, h - 1)} attempts`"
      ></div>
    </div>
    <div class="heatmap__legend">
      <span class="heatmap__legend-label">Less</span>
      <div
        v-for="(level, i) in legendLevels"
        :key="i"
        class="heatmap__legend-cell"
        :style="{ backgroundColor: level }"
      ></div>
      <span class="heatmap__legend-label">More</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeatmapCell } from '~/types/analytics'

interface Props {
  data: HeatmapCell[]
}

const props = defineProps<Props>()

const days = [
  { idx: 0, label: 'Sun' },
  { idx: 1, label: 'Mon' },
  { idx: 2, label: 'Tue' },
  { idx: 3, label: 'Wed' },
  { idx: 4, label: 'Thu' },
  { idx: 5, label: 'Fri' },
  { idx: 6, label: 'Sat' },
]

const hours = Array.from({ length: 24 }, (_, i) => i)

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`
}

const cellMap = computed(() => {
  const map = new Map<string, number>()
  for (const cell of props.data) {
    map.set(`${cell.day_of_week}-${cell.hour}`, cell.count)
  }
  return map
})

const maxCount = computed(() => {
  if (!props.data.length) return 1
  return Math.max(...props.data.map(c => c.count), 1)
})

function getCount(day: number, hour: number): number {
  return cellMap.value.get(`${day}-${hour}`) || 0
}

function resolveAccent(): string {
  if (typeof window === 'undefined') return '#2f81f7'
  return getComputedStyle(document.documentElement).getPropertyValue('--color-gh-accent').trim() || '#2f81f7'
}

function cellColor(day: number, hour: number): string {
  const count = getCount(day, hour)
  if (count === 0) return 'var(--color-gh-card)'
  const intensity = Math.min(count / maxCount.value, 1)
  const alpha = 0.15 + intensity * 0.85
  const accent = resolveAccent()
  return `color-mix(in srgb, ${accent} ${Math.round(alpha * 100)}%, transparent)`
}

const legendLevels = computed(() => {
  const accent = resolveAccent()
  return [0.15, 0.35, 0.55, 0.75, 1.0].map(
    a => `color-mix(in srgb, ${accent} ${Math.round(a * 100)}%, transparent)`,
  )
})
</script>

<style scoped>
.heatmap {
  overflow-x: auto;
}

.heatmap__header {
  display: grid;
  grid-template-columns: 3rem repeat(24, 1fr);
  gap: 2px;
  margin-bottom: 2px;
}

.heatmap__corner {
  width: 3rem;
}

.heatmap__hour-label {
  font-size: 0.625rem;
  color: var(--color-gh-muted);
  text-align: center;
}

.heatmap__row {
  display: grid;
  grid-template-columns: 3rem repeat(24, 1fr);
  gap: 2px;
  margin-bottom: 2px;
}

.heatmap__day-label {
  font-size: 0.6875rem;
  color: var(--color-gh-muted);
  display: flex;
  align-items: center;
  padding-right: 0.5rem;
  justify-content: flex-end;
}

.heatmap__cell {
  aspect-ratio: 1;
  border-radius: 2px;
  min-width: 1rem;
  min-height: 1rem;
  cursor: default;
  transition: opacity 0.15s;
}

.heatmap__cell:hover {
  opacity: 0.8;
  outline: 1px solid var(--color-gh-border);
}

.heatmap__legend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
  justify-content: flex-end;
}

.heatmap__legend-label {
  font-size: 0.6875rem;
  color: var(--color-gh-muted);
}

.heatmap__legend-cell {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 2px;
}
</style>
