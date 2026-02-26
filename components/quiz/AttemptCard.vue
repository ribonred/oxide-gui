<template>
    <div class="attempt-card" @click="$emit('click')">
        <!-- Header with Participant -->
        <div class="attempt-card__header">
            <div class="attempt-card__participant">
                <div class="participant-avatar">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div class="participant-info">
                    <span class="participant-name">{{ attempt.alias }}</span>
                    <span v-if="!attempt.is_latest" class="participant-badge">Previous Attempt</span>
                </div>
            </div>
            <StatusBadge :status="getAttemptStatus()" :label="getAttemptStatusLabel()" :show-dot="true" />
        </div>

        <!-- Answered Display -->
        <div class="attempt-card__score">
            <div class="score-primary">
                <span class="score-value">{{ attempt.answered_count }}</span>
                <span class="score-divider">/</span>
                <span class="score-total">{{ attempt.total_questions }}</span>
                <span class="score-label">answered</span>
            </div>
            <div class="score-progress">
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: scorePercentage + '%' }"></div>
                </div>
                <span class="progress-text">{{ scorePercentage }}%</span>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="attempt-card__stats">
            <div class="stat-item">
                <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div class="stat-content">
                    <span class="stat-label">Score</span>
                    <span class="stat-value">{{ formatScore(attempt.score) }} points</span>
                </div>
            </div>

            <div class="stat-item">
                <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="stat-content">
                    <span class="stat-label">Time Taken</span>
                    <span class="stat-value">{{ formatTime(attempt.time_taken_ms) }}</span>
                </div>
            </div>

            <div class="stat-item">
                <svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div class="stat-content">
                    <span class="stat-label">Submitted</span>
                    <span class="stat-value">{{ formatDate(attempt.submitted_at) }}</span>
                </div>
            </div>
        </div>

        <!-- Action Button -->
        <div class="attempt-card__footer">
            <Button variant="secondary" full-width @click.stop="$emit('view-answers')">
                <div class="flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Answers</span>
                </div>
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AttemptListItem } from '~/types/api'
import Button from '~/components/ui/Button.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'

const props = defineProps<{
    attempt: AttemptListItem
}>()

defineEmits<{
    (e: 'click'): void
    (e: 'view-answers'): void
}>()

const scorePercentage = computed(() => {
    const total = props.attempt.total_questions || 0
    const answered = props.attempt.answered_count || 0
    if (total === 0) return 0
    return Math.round((answered / total) * 100)
})

const getAttemptStatus = () => {
    if (!props.attempt.submitted_at) return 'in_progress'
    if (props.attempt.is_fully_evaluated) return 'completed'
    return 'pending'
}

const getAttemptStatusLabel = () => {
    if (!props.attempt.submitted_at) return 'In Progress'
    if (props.attempt.is_fully_evaluated) return 'Evaluated'
    return 'Needs Evaluation'
}

const formatTime = (milliseconds: number | null): string => {
    if (!milliseconds) return 'N/A'

    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

    return parts.join(' ')
}

const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not submitted'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return '0.00'
    const n = Number(score)
    if (!Number.isFinite(n)) return '0.00'
    return n.toFixed(2)
}
</script>

<style scoped>
.attempt-card {
    position: relative;
    padding: 1.5rem;
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    overflow: hidden;
}

.attempt-card:hover {
    border-color: var(--color-gh-accent);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(47, 129, 247, 0.1);
}

.attempt-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-gh-border);
}

.attempt-card__participant {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
}

.participant-avatar {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    border-radius: 50%;
    color: var(--color-gh-accent);
}

.participant-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
}

.participant-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-gh-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.participant-badge {
    font-size: 0.75rem;
    color: var(--color-gh-text-muted);
    padding: 0.125rem 0.5rem;
    background: var(--color-gh-bg);
    border-radius: 0.375rem;
    width: fit-content;
}

.attempt-card__score {
    margin-bottom: 1.25rem;
}

.score-primary {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.score-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-gh-accent);
    line-height: 1;
}

.score-divider {
    font-size: 1.5rem;
    color: var(--color-gh-muted);
}

.score-total {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-gh-text-muted);
}

.score-label {
    font-size: 0.875rem;
    color: var(--color-gh-muted);
    margin-left: 0.25rem;
}

.score-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.progress-bar {
    flex: 1;
    height: 0.5rem;
    background: var(--color-gh-bg);
    border-radius: 9999px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-gh-accent), #60a5fa);
    border-radius: 9999px;
    transition: width 0.3s ease;
}

.progress-text {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-gh-text-muted);
    min-width: 3rem;
    text-align: right;
}

.attempt-card__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding: 1rem;
    background: var(--color-gh-bg);
    border-radius: 0.75rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.stat-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-gh-accent);
    flex-shrink: 0;
}

.stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    min-width: 0;
}

.stat-label {
    font-size: 0.75rem;
    color: var(--color-gh-muted);
}

.stat-value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-gh-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.attempt-card__footer {
    padding-top: 1rem;
    border-top: 1px solid var(--color-gh-border);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .attempt-card {
        padding: 1rem;
    }

    .attempt-card__stats {
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding: 0.75rem;
    }

    .score-value {
        font-size: 1.75rem;
    }

    .score-total {
        font-size: 1.25rem;
    }
}
</style>
