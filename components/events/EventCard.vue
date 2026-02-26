<template>
    <div class="event-card" @click="emit('click')">
        <div class="card-header">
            <div class="quiz-label">{{ quizTitle }}</div>
            <span :class="statusClass" class="status-pill">{{ statusLabel }}</span>
        </div>

        <h3 class="card-title">{{ name }}</h3>

        <div class="card-meta" v-if="Object.keys(metadata).length > 0">
            <span
                v-for="(value, key) in displayMetadata"
                :key="key"
                class="meta-tag"
            >
                {{ key }}: {{ value }}
            </span>
            <span v-if="metadataOverflow > 0" class="meta-tag meta-overflow">
                +{{ metadataOverflow }}
            </span>
        </div>

        <div class="card-dates">
            <div class="date-row">
                <svg class="date-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(startsAt) }} — {{ formatDate(endsAt) }}</span>
            </div>
        </div>

        <div class="card-stats">
            <div class="stat" v-if="maxAttempts">
                <span class="stat-value">{{ maxAttempts }}</span>
                <span class="stat-label">Max Attempts</span>
            </div>
            <div class="stat" v-if="clientOnly">
                <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span class="stat-label">Client Only</span>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    name: { type: String, required: true },
    quizTitle: { type: String, default: '' },
    startsAt: { type: String, required: true },
    endsAt: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: null },
    clientOnly: { type: Boolean, default: false },
    metadata: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['click'])

const { getEventStatusLabel, getEventStatusClass } = useEventEnums()

const statusLabel = computed(() => getEventStatusLabel(props.isActive, props.startsAt, props.endsAt))
const statusClass = computed(() => getEventStatusClass(props.isActive, props.startsAt, props.endsAt))

const displayMetadata = computed(() => {
    const entries = Object.entries(props.metadata)
    return Object.fromEntries(entries.slice(0, 3))
})

const metadataOverflow = computed(() => {
    return Math.max(0, Object.keys(props.metadata).length - 3)
})

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

<style scoped>
.event-card {
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.75rem;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.event-card:hover {
    border-color: var(--color-gh-accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.quiz-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-gh-accent);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status-pill {
    flex-shrink: 0;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1.5px solid;
}

.card-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-gh-text);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
}

.meta-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 500;
    background: var(--color-gh-bg);
    color: var(--color-gh-text-muted);
    border: 1px solid var(--color-gh-border);
}

.meta-overflow {
    color: var(--color-gh-accent);
    border-color: var(--color-gh-accent);
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
}

.card-dates {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.date-row {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--color-gh-text-muted);
}

.date-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
}

.card-stats {
    display: flex;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-gh-border);
}

.stat {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: var(--color-gh-text-muted);
}

.stat-value {
    font-weight: 700;
    color: var(--color-gh-text);
}

.stat-label {
    font-weight: 500;
}
</style>
