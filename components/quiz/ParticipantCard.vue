<template>
    <div class="participant-card" :class="statusClass">
        <!-- Header -->
        <div class="card-header">
            <div class="participant-info">
                <div class="avatar">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div class="participant-details">
                    <h4 class="participant-name">{{ participant.participant_alias }}</h4>
                    <p class="participant-id">{{ truncatedId }}</p>
                </div>
            </div>
            
            <StatusBadge :status="status" />
        </div>

        <!-- Progress (for active participants) -->
        <div v-if="status === 'active'" class="progress-section">
            <div class="progress-header">
                <span class="progress-label">Progress</span>
                <span class="progress-value">{{ participant.current_question }} / {{ participant.total_questions }}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <div class="progress-percentage">{{ progressPercentage }}%</div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-section">
            <div class="stat-item">
                <div class="stat-icon score">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Score</div>
                    <div class="stat-value">{{ participant.score.toFixed(1) }}</div>
                </div>
            </div>

            <div class="stat-item">
                <div class="stat-icon time">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="stat-content">
                    <div class="stat-label">Time</div>
                    <div class="stat-value">{{ formattedTime }}</div>
                </div>
            </div>
        </div>

        <!-- Timestamps -->
        <div class="timestamps">
            <div v-if="participant.started_at" class="timestamp-item">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="timestamp-label">Started:</span>
                <span class="timestamp-value">{{ formatDate(participant.started_at) }}</span>
            </div>
            
            <div v-if="participant.completed_at" class="timestamp-item">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="timestamp-label">Completed:</span>
                <span class="timestamp-value">{{ formatDate(participant.completed_at) }}</span>
            </div>
            
            <div v-if="participant.last_activity && status === 'active'" class="timestamp-item">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="timestamp-label">Last activity:</span>
                <span class="timestamp-value">{{ formatRelativeTime(participant.last_activity) }}</span>
            </div>
        </div>

        <!-- Active indicator pulse -->
        <div v-if="status === 'active'" class="active-indicator"></div>
    </div>
</template>

<script setup>
import StatusBadge from '~/components/ui/StatusBadge.vue'

const props = defineProps({
    participant: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true,
        validator: (value) => ['active', 'completed', 'idle'].includes(value)
    }
})

const statusClass = computed(() => `status-${props.status}`)

const truncatedId = computed(() => {
    const id = props.participant.participant_id
    if (!id) return 'N/A'
    return id.length > 24 ? id.substring(0, 24) + '...' : id
})

const progressPercentage = computed(() => {
    if (!props.participant.total_questions) return 0
    return Math.round((props.participant.current_question / props.participant.total_questions) * 100)
})

const formattedTime = computed(() => {
    const ms = props.participant.time_elapsed || 0
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
    } else {
        return `${seconds}s`
    }
})

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds
    
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
}
</script>

<style scoped>
.participant-card {
    position: relative;
    padding: 1.25rem;
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    overflow: hidden;
}

.participant-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.participant-card.status-active {
    border-color: color-mix(in srgb, #22c55e 40%, transparent);
    box-shadow: 0 0 20px color-mix(in srgb, #22c55e 15%, transparent);
}

.participant-card.status-completed {
    border-color: color-mix(in srgb, #3b82f6 40%, transparent);
}

.participant-card.status-idle {
    border-color: color-mix(in srgb, #f59e0b 40%, transparent);
    opacity: 0.85;
}

.card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-gh-border);
}

.participant-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
}

.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
    flex-shrink: 0;
}

.participant-details {
    flex: 1;
    min-width: 0;
}

.participant-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-gh-text);
    margin-bottom: 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.participant-id {
    font-size: 0.75rem;
    font-family: 'Monaco', 'Menlo', monospace;
    color: var(--color-gh-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.progress-section {
    margin-bottom: 1rem;
    padding: 0.875rem;
    background: color-mix(in srgb, var(--color-gh-accent) 5%, transparent);
    border-radius: 0.5rem;
    border: 1px solid color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
}

.progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}

.progress-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-gh-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.progress-value {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-gh-text);
}

.progress-bar {
    height: 0.5rem;
    background: var(--color-gh-bg);
    border-radius: 9999px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
    border-radius: 9999px;
    transition: width 0.5s ease;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.progress-percentage {
    text-align: right;
    font-size: 0.75rem;
    font-weight: 700;
    color: #22c55e;
}

.stats-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-gh-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--color-gh-border);
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
}

.stat-icon.score {
    background: color-mix(in srgb, #3b82f6 15%, transparent);
    color: #3b82f6;
}

.stat-icon.time {
    background: color-mix(in srgb, #f59e0b 15%, transparent);
    color: #f59e0b;
}

.stat-content {
    flex: 1;
    min-width: 0;
}

.stat-label {
    font-size: 0.6875rem;
    color: var(--color-gh-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 0.125rem;
}

.stat-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gh-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.timestamps {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.timestamp-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-gh-text-muted);
}

.timestamp-item svg {
    flex-shrink: 0;
}

.timestamp-label {
    font-weight: 600;
}

.timestamp-value {
    font-weight: 500;
}

.active-indicator {
    position: absolute;
    top: 0;
    right: 0;
    width: 0.75rem;
    height: 0.75rem;
    margin: 0.75rem;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 12px rgba(34, 197, 94, 0.8);
    animation: pulse-indicator 2s ease-in-out infinite;
}

@keyframes pulse-indicator {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(1.3);
    }
}

@media (max-width: 640px) {
    .participant-card {
        padding: 1rem;
    }

    .stats-section {
        grid-template-columns: 1fr;
    }

    .participant-name {
        font-size: 0.9375rem;
    }
}
</style>
