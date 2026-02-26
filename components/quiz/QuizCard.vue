<template>
    <div 
        class="quiz-card group"
        @click="$emit('click')"
    >
        <!-- Decorative corner accent -->
        <div class="quiz-card__accent"></div>

        <div class="quiz-card__content">
            <!-- Icon & Title -->
            <div class="quiz-card__header">
                <div class="quiz-card__icon">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <div class="flex-1 min-w-0 overflow-hidden">
                    <div v-if="categories" class="quiz-card__category">{{ categories }}</div>
                    <h3 class="quiz-card__title">{{ title }}</h3>
                </div>
            </div>

            <!-- Description -->
            <p v-if="description" class="quiz-card__description">
                {{ description }}
            </p>

            <!-- Tags -->
            <div v-if="tags && tags.length > 0" class="quiz-card__tags">
                <span v-for="tag in visibleTags" :key="tag" class="tag-pill">{{ tag }}</span>
                <span v-if="remainingTagsCount > 0" class="tag-pill tag-pill--more">+{{ remainingTagsCount }}</span>
            </div>

            <!-- Stats Grid -->
            <div class="quiz-card__stats">
                <div class="stat-item">
                    <svg class="stat-item__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="stat-item__content">
                        <span class="stat-item__label">Questions</span>
                        <span class="stat-item__value">{{ questionCount }}</span>
                    </div>
                </div>

                <div class="stat-item">
                    <svg class="stat-item__icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div class="stat-item__content">
                        <span class="stat-item__label">Time</span>
                        <span class="stat-item__value">{{ formatTime(timeLimit) }}</span>
                    </div>
                </div>
            </div>

            <!-- Status Badge -->
            <div class="quiz-card__footer">
                <span :class="['status-badge', `status-badge--${status.toLowerCase()}`]">
                    {{ status }}
                </span>
                <div class="quiz-card__arrow">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    questionCount: {
        type: Number,
        default: 0
    },
    timeLimit: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        default: 'active'
    },
    tags: {
        type: Array,
        default: () => []
    },
    categories: {
        type: String,
        default: ''
    }
})

defineEmits(['click'])

const visibleTags = computed(() => {
    return props.tags ? props.tags.slice(0, 3) : []
})

const remainingTagsCount = computed(() => {
    return props.tags ? Math.max(0, props.tags.length - 3) : 0
})

const formatTime = (seconds) => {
    if (!seconds) return 'No limit'
    const minutes = Math.floor(seconds / 60)
    return minutes > 0 ? `${minutes}m` : '∞'
}
</script>

<style scoped>
.quiz-card {
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom right, var(--color-gh-card), var(--color-gh-bg));
    border: 2px solid rgba(139, 148, 158, 0.6);
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 1px rgba(47, 129, 247, 0.2),
                0 0 15px rgba(47, 129, 247, 0.1),
                0 4px 12px rgba(0, 0, 0, 0.5);
}

.quiz-card:hover {
    border-color: var(--color-gh-accent);
    transform: translateY(-4px);
    box-shadow: 0 0 0 2px var(--color-gh-accent),
                0 0 30px rgba(47, 129, 247, 0.5),
                0 0 60px rgba(47, 129, 247, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.6);
}

.quiz-card__accent {
    position: absolute;
    top: 0;
    right: 0;
    width: 10rem;
    height: 10rem;
    background: linear-gradient(to bottom right, color-mix(in srgb, var(--color-gh-accent) 15%, transparent), transparent);
    border-bottom-left-radius: 9999px;
    opacity: 0.3;
    transition: opacity 0.3s ease;
}

.quiz-card:hover .quiz-card__accent {
    opacity: 1;
}

.quiz-card__content {
    position: relative;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 280px;
}

/* Add inner glow effect */
.quiz-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    padding: 2px;
    background: linear-gradient(135deg, 
        color-mix(in srgb, var(--color-gh-accent) 20%, transparent),
        transparent 50%,
        color-mix(in srgb, var(--color-gh-accent) 10%, transparent));
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    transition: opacity 0.3s ease;
}

.quiz-card:hover::before {
    opacity: 1;
}

.quiz-card__header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.quiz-card__icon {
    flex-shrink: 0;
    padding: 0.625rem;
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    border-radius: 0.75rem;
    border: 1px solid color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(47, 129, 247, 0.2);
}

.quiz-card:hover .quiz-card__icon {
    transform: scale(1.1) rotate(3deg);
    background: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
    box-shadow: 0 0 20px rgba(47, 129, 247, 0.4),
                0 0 40px rgba(47, 129, 247, 0.2);
}

.quiz-card__title {
    font-size: 1.25rem;
    font-weight: bold;
    color: var(--color-gh-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
}

.quiz-card__description {
    color: var(--color-gh-text-muted);
    font-size: 0.875rem;
    line-height: 1.625;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.quiz-card__stats {
    display: flex;
    gap: 0.75rem;
    margin-top: auto;
    flex-wrap: wrap;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    padding: 0.75rem;
    background: color-mix(in srgb, var(--color-gh-bg) 50%, transparent);
    border-radius: 0.75rem;
    border: 1px solid var(--color-gh-border);
    transition: all 0.3s ease;
}

.quiz-card:hover .stat-item {
    border-color: color-mix(in srgb, var(--color-gh-accent) 30%, var(--color-gh-border));
    box-shadow: 0 0 10px rgba(47, 129, 247, 0.1);
}

.stat-item__icon {
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-gh-accent);
    flex-shrink: 0;
}

.stat-item__content {
    display: flex;
    flex-direction: column;
}

.stat-item__label {
    font-size: 0.75rem;
    color: var(--color-gh-muted);
}

.stat-item__value {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-gh-text);
}

.quiz-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 1rem;
    border-top: 1px solid color-mix(in srgb, var(--color-gh-border) 50%, transparent);
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

.status-badge--active {
    background: color-mix(in srgb, var(--color-gh-success) 10%, transparent);
    color: var(--color-gh-success);
    border: 1px solid color-mix(in srgb, var(--color-gh-success) 20%, transparent);
}

.status-badge--draft {
    background: color-mix(in srgb, rgb(234 179 8) 10%, transparent);
    color: rgb(250 204 21);
    border: 1px solid color-mix(in srgb, rgb(234 179 8) 20%, transparent);
}

.status-badge--archived {
    background: color-mix(in srgb, rgb(107 114 128) 10%, transparent);
    color: rgb(156 163 175);
    border: 1px solid color-mix(in srgb, rgb(107 114 128) 20%, transparent);
}

.quiz-card__arrow {
    color: var(--color-gh-accent);
    opacity: 0;
    transition: all 0.3s ease;
    transform: translateX(0);
}

.quiz-card:hover .quiz-card__arrow {
    opacity: 1;
    transform: translateX(0.25rem);
}

.quiz-card__category {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-gh-accent);
    font-weight: 600;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.quiz-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
}

.tag-pill {
    font-size: 0.7rem;
    padding: 0.125rem 0.5rem;
    background: color-mix(in srgb, var(--color-gh-muted) 10%, transparent);
    color: var(--color-gh-text-muted);
    border-radius: 9999px;
    white-space: nowrap;
    border: 1px solid color-mix(in srgb, var(--color-gh-muted) 20%, transparent);
}

.tag-pill--more {
    background: color-mix(in srgb, var(--color-gh-accent) 10%, transparent);
    color: var(--color-gh-accent);
    border-color: color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
}
</style>
