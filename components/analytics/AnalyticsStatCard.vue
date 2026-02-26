<template>
  <div class="stat-card" :class="{ 'stat-card--loading': loading }">
    <div class="stat-card__label">{{ label }}</div>
    <div class="stat-card__value">
      <span v-if="loading" class="animate-pulse">...</span>
      <span v-else>{{ formattedValue }}</span>
    </div>
    <div v-if="trend !== undefined && !loading" class="stat-card__trend" :class="trendClass">
      <span class="stat-card__trend-icon">{{ trendIcon }}</span>
      <span>{{ trendLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: number | string | null
  format?: 'number' | 'percent' | 'score' | 'time' | 'raw'
  trend?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  format: 'number',
  loading: false,
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return '--'
  const v = typeof props.value === 'string' ? parseFloat(props.value) : props.value

  if (typeof props.value === 'string' && props.format === 'raw') return props.value

  if (isNaN(v)) return '--'

  switch (props.format) {
    case 'percent':
      return `${v.toFixed(1)}%`
    case 'score':
      return v.toFixed(2)
    case 'time': {
      if (v < 1000) return `${Math.round(v)}ms`
      const secs = v / 1000
      if (secs < 60) return `${secs.toFixed(1)}s`
      return `${Math.floor(secs / 60)}m ${Math.round(secs % 60)}s`
    }
    case 'raw':
      return String(v)
    default:
      return v.toLocaleString()
  }
})

const trendClass = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend > 0) return 'stat-card__trend--up'
  if (props.trend < 0) return 'stat-card__trend--down'
  return 'stat-card__trend--neutral'
})

const trendIcon = computed(() => {
  if (props.trend === undefined) return ''
  if (props.trend > 0) return '↑'
  if (props.trend < 0) return '↓'
  return '→'
})

const trendLabel = computed(() => {
  if (props.trend === undefined) return ''
  return `${Math.abs(props.trend).toFixed(1)}%`
})
</script>

<style scoped>
.stat-card {
  background: var(--color-gh-card);
  border: 1px solid var(--color-gh-border);
  border-radius: 0.5rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-card__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-gh-muted);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-card__value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-gh-text);
  line-height: 1.2;
}

.stat-card__trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-card__trend--up {
  color: var(--color-gh-success);
}

.stat-card__trend--down {
  color: var(--color-gh-danger);
}

.stat-card__trend--neutral {
  color: var(--color-gh-muted);
}

.stat-card__trend-icon {
  font-size: 0.875rem;
}
</style>
