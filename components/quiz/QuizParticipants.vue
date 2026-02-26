<template>
    <div class="participants-container">
        <!-- Header with Stats -->
        <div class="header-section">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="icon-wrapper">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-bold text-gh-text">Participants</h2>
                </div>
                
                <div class="flex items-center gap-3">
                    <Button variant="secondary" size="sm" @click="fetchParticipants" :disabled="loading">
                        <svg class="w-4 h-4 mr-1" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </Button>
                    
                    <label class="flex items-center gap-2 text-sm text-gh-text-muted">
                        <input 
                            type="checkbox" 
                            v-model="autoRefresh" 
                            class="custom-checkbox"
                        />
                        <span>Auto-refresh ({{ refreshInterval / 1000 }}s)</span>
                    </label>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon total">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Total Participants</div>
                        <div class="stat-value">{{ totalParticipants }}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon active">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Currently Active</div>
                        <div class="stat-value">{{ activeParticipants.length }}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon completed">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Completed</div>
                        <div class="stat-value">{{ completedParticipants.length }}</div>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-icon idle">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div class="stat-content">
                        <div class="stat-label">Idle / Waiting</div>
                        <div class="stat-value">{{ idleParticipants.length }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading && !participants.length" class="loading-state">
            <div class="spinner-wrapper">
                <div class="spinner"></div>
                <div class="spinner-glow"></div>
            </div>
            <p class="loading-text">Loading participants...</p>
        </div>

        <!-- Error State -->
        <Alert v-else-if="error" variant="error" class="mb-6">
            {{ error }}
        </Alert>

        <!-- Empty State -->
        <div v-else-if="!participants.length" class="empty-state">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="empty-text">No participants yet.</p>
            <p class="empty-subtext">Share the quiz link to get participants!</p>
        </div>

        <!-- Participants List -->
        <div v-else class="participants-sections">
            <!-- Active Participants -->
            <div v-if="activeParticipants.length" class="section">
                <div class="section-header active">
                    <div class="flex items-center gap-2">
                        <div class="pulse-dot"></div>
                        <h3 class="section-title">Currently Taking Quiz</h3>
                        <span class="section-count">{{ activeParticipants.length }}</span>
                    </div>
                </div>
                
                <div class="participants-grid">
                    <ParticipantCard 
                        v-for="participant in activeParticipants" 
                        :key="participant.participant_id"
                        :participant="participant"
                        status="active"
                    />
                </div>
            </div>

            <!-- Completed Participants -->
            <div v-if="completedParticipants.length" class="section">
                <div class="section-header completed">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="section-title">Completed</h3>
                        <span class="section-count">{{ completedParticipants.length }}</span>
                    </div>
                </div>
                
                <div class="participants-grid">
                    <ParticipantCard 
                        v-for="participant in completedParticipants" 
                        :key="participant.participant_id"
                        :participant="participant"
                        status="completed"
                    />
                </div>
            </div>

            <!-- Idle Participants -->
            <div v-if="idleParticipants.length" class="section">
                <div class="section-header idle">
                    <div class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="section-title">Idle / Waiting</h3>
                        <span class="section-count">{{ idleParticipants.length }}</span>
                    </div>
                </div>
                
                <div class="participants-grid">
                    <ParticipantCard 
                        v-for="participant in idleParticipants" 
                        :key="participant.participant_id"
                        :participant="participant"
                        status="idle"
                    />
                </div>
            </div>
        </div>

        <!-- Last Updated Timestamp -->
        <div v-if="lastUpdated" class="last-updated">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Last updated: {{ formatTimestamp(lastUpdated) }}</span>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Alert from '~/components/ui/Alert.vue'
import ParticipantCard from '~/components/quiz/ParticipantCard.vue'

const props = defineProps({
    quizId: {
        type: [String, Number],
        required: true
    }
})

const { getQuizParticipants } = useQuizzes()

const loading = ref(false)
const error = ref(null)
const participants = ref([])
const lastUpdated = ref(null)
const autoRefresh = ref(true)
const refreshInterval = ref(5000) // 5 seconds

let refreshTimer = null

// Computed properties
const totalParticipants = computed(() => participants.value.length)

const activeParticipants = computed(() => 
    participants.value.filter(p => p.status === 'in_progress' || p.status === 'active')
)

const completedParticipants = computed(() => 
    participants.value.filter(p => p.status === 'completed' || p.status === 'finished')
)

const idleParticipants = computed(() => 
    participants.value.filter(p => 
        p.status !== 'in_progress' && 
        p.status !== 'active' && 
        p.status !== 'completed' && 
        p.status !== 'finished'
    )
)

const fetchParticipants = async () => {
    loading.value = true
    error.value = null
    
    const result = await getQuizParticipants(props.quizId)

    if (result.success) {
        // Process the data from API
        const data = result.data?.data?.results || []
        participants.value = data.map(item => ({
            participant_id: item.participant_id || item.PARTICIPANT_ID,
            participant_alias: item.participant_alias || item.PARTICIPANT_ALIAS || 'Anonymous',
            status: item.status || item.STATUS || 'idle',
            current_question: item.current_question || item.CURRENT_QUESTION || 0,
            total_questions: item.total_questions || item.TOTAL_QUESTIONS || 0,
            score: parseFloat(item.score || item.SCORE || 0),
            time_elapsed: parseInt(item.time_elapsed || item.TIME_ELAPSED || 0),
            started_at: item.started_at || item.STARTED_AT,
            completed_at: item.completed_at || item.COMPLETED_AT,
            last_activity: item.last_activity || item.LAST_ACTIVITY
        }))
        lastUpdated.value = new Date()
    } else {
        error.value = result.error
    }

    loading.value = false
}

const formatTimestamp = (date) => {
    if (!date) return ''
    const now = new Date()
    const diff = Math.floor((now - date) / 1000) // seconds
    
    if (diff < 60) return `${diff} seconds ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return date.toLocaleString()
}

const startAutoRefresh = () => {
    if (refreshTimer) clearInterval(refreshTimer)
    
    if (autoRefresh.value) {
        refreshTimer = setInterval(() => {
            fetchParticipants()
        }, refreshInterval.value)
    }
}

// Watch for auto-refresh toggle
watch(autoRefresh, (newValue) => {
    if (newValue) {
        startAutoRefresh()
    } else {
        if (refreshTimer) {
            clearInterval(refreshTimer)
            refreshTimer = null
        }
    }
})

// Watch for quizId changes
watch(() => props.quizId, () => {
    participants.value = []
    fetchParticipants()
})

// Initial fetch
onMounted(() => {
    fetchParticipants()
    startAutoRefresh()
})

// Cleanup
onBeforeUnmount(() => {
    if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
    }
})
</script>

<style scoped>
.participants-container {
    padding: 1.5rem;
}

.header-section {
    margin-bottom: 2rem;
}

.icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--color-gh-card);
    border: 2px solid var(--color-gh-border);
    border-radius: 0.75rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.75rem;
    flex-shrink: 0;
}

.stat-icon.total {
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
}

.stat-icon.active {
    background: color-mix(in srgb, #22c55e 15%, transparent);
    color: #22c55e;
}

.stat-icon.completed {
    background: color-mix(in srgb, #3b82f6 15%, transparent);
    color: #3b82f6;
}

.stat-icon.idle {
    background: color-mix(in srgb, #f59e0b 15%, transparent);
    color: #f59e0b;
}

.stat-content {
    flex: 1;
}

.stat-label {
    font-size: 0.875rem;
    color: var(--color-gh-text-muted);
    margin-bottom: 0.25rem;
}

.stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-gh-text);
    line-height: 1;
}

.custom-checkbox {
    width: 1rem;
    height: 1rem;
    border-radius: 0.25rem;
    border: 2px solid var(--color-gh-border);
    background: var(--color-gh-bg);
    cursor: pointer;
    accent-color: var(--color-gh-accent);
}

.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 0;
}

.spinner-wrapper {
    position: relative;
    margin-bottom: 1rem;
}

.spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid var(--color-gh-border);
    border-top-color: var(--color-gh-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.spinner-glow {
    position: absolute;
    inset: 0;
    width: 4rem;
    height: 4rem;
    border: 4px solid transparent;
    border-top-color: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    border-radius: 50%;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-text {
    color: var(--color-gh-text-muted);
    font-size: 1rem;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 5rem 2rem;
    background: var(--color-gh-bg);
    border: 2px dashed var(--color-gh-border);
    border-radius: 1rem;
    text-align: center;
}

.empty-icon {
    width: 5rem;
    height: 5rem;
    color: var(--color-gh-text-muted);
    margin-bottom: 1.5rem;
}

.empty-text {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gh-text);
    margin-bottom: 0.5rem;
}

.empty-subtext {
    color: var(--color-gh-text-muted);
}

.participants-sections {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    border: 2px solid var(--color-gh-border);
}

.section-header.active {
    background: color-mix(in srgb, #22c55e 8%, transparent);
    border-color: color-mix(in srgb, #22c55e 30%, transparent);
}

.section-header.completed {
    background: color-mix(in srgb, #3b82f6 8%, transparent);
    border-color: color-mix(in srgb, #3b82f6 30%, transparent);
}

.section-header.idle {
    background: color-mix(in srgb, #f59e0b 8%, transparent);
    border-color: color-mix(in srgb, #f59e0b 30%, transparent);
}

.pulse-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

.section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gh-text);
}

.section-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 1.75rem;
    padding: 0 0.75rem;
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-gh-text);
}

.participants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1rem;
}

.last-updated {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 2rem;
    padding: 0.75rem;
    font-size: 0.875rem;
    color: var(--color-gh-text-muted);
    background: var(--color-gh-bg);
    border-radius: 0.5rem;
    border: 1px solid var(--color-gh-border);
}

@media (max-width: 768px) {
    .participants-container {
        padding: 1rem;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .participants-grid {
        grid-template-columns: 1fr;
    }

    .header-section .flex {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
    }

    .stat-value {
        font-size: 1.5rem;
    }
}
</style>
