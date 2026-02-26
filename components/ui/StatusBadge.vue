<template>
    <span class="status-badge" :class="badgeClass">
        <span class="badge-dot" v-if="showDot"></span>
        <span class="badge-text">{{ displayText }}</span>
    </span>
</template>

<script setup>
const props = defineProps({
    status: {
        type: String,
        required: true
    },
    showDot: {
        type: Boolean,
        default: true
    }
})

const statusConfig = {
    active: { text: 'Active', class: 'badge-active' },
    in_progress: { text: 'In Progress', class: 'badge-active' },
    completed: { text: 'Completed', class: 'badge-completed' },
    finished: { text: 'Finished', class: 'badge-completed' },
    idle: { text: 'Idle', class: 'badge-idle' },
    waiting: { text: 'Waiting', class: 'badge-idle' },
    draft: { text: 'Draft', class: 'badge-draft' },
    archived: { text: 'Archived', class: 'badge-archived' },
    scheduled: { text: 'Scheduled', class: 'badge-scheduled' },
}

const badgeClass = computed(() => {
    const config = statusConfig[props.status.toLowerCase()] || statusConfig.idle
    return config.class
})

const displayText = computed(() => {
    const config = statusConfig[props.status.toLowerCase()] || { text: props.status }
    return config.text
})
</script>

<style scoped>
.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-radius: 9999px;
    border: 1.5px solid;
    white-space: nowrap;
    transition: all 0.2s ease;
}

.badge-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.badge-text {
    line-height: 1;
}

/* Active status */
.badge-active {
    background: color-mix(in srgb, #22c55e 15%, transparent);
    border-color: #22c55e;
    color: #22c55e;
}

.badge-active .badge-dot {
    background: #22c55e;
    animation: pulse-dot 2s ease-in-out infinite;
}

/* Completed status */
.badge-completed {
    background: color-mix(in srgb, #3b82f6 15%, transparent);
    border-color: #3b82f6;
    color: #3b82f6;
}

.badge-completed .badge-dot {
    background: #3b82f6;
}

/* Idle/Waiting status */
.badge-idle {
    background: color-mix(in srgb, #f59e0b 15%, transparent);
    border-color: #f59e0b;
    color: #f59e0b;
}

.badge-idle .badge-dot {
    background: #f59e0b;
}

/* Draft status */
.badge-draft {
    background: color-mix(in srgb, #6b7280 15%, transparent);
    border-color: #6b7280;
    color: #9ca3af;
}

.badge-draft .badge-dot {
    background: #6b7280;
}

/* Archived status */
.badge-archived {
    background: color-mix(in srgb, #ef4444 15%, transparent);
    border-color: #ef4444;
    color: #ef4444;
}

.badge-archived .badge-dot {
    background: #ef4444;
}

/* Scheduled status */
.badge-scheduled {
    background: color-mix(in srgb, #8b5cf6 15%, transparent);
    border-color: #8b5cf6;
    color: #8b5cf6;
}

.badge-scheduled .badge-dot {
    background: #8b5cf6;
}

@keyframes pulse-dot {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.6;
        transform: scale(1.2);
    }
}

.status-badge:hover {
    transform: scale(1.05);
}
</style>
