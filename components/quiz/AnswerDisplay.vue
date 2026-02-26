<template>
    <div class="answer-display" :class="statusClass">
        <div class="answer-content">
            <!-- True/False -->
            <div v-if="questionType === 'true_false'" class="flex items-center gap-3">
                <svg v-if="userAnswer.toLowerCase() === 'true'" class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-6 h-6" :class="iconColor" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-lg font-semibold" :class="textColor">
                    {{ userAnswer.toLowerCase() === 'true' ? 'True' : 'False' }}
                </span>
            </div>

            <!-- Multiple Choice -->
            <div v-else-if="questionType === 'multiple_choice'" class="flex items-center gap-2">
                <span class="inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg" :class="badgeClass">
                    {{ userAnswer }}
                </span>
            </div>

            <!-- Multiple Select -->
            <div v-else-if="questionType === 'multiple_select'" class="flex flex-wrap gap-2">
                <span 
                    v-for="option in parseMultipleSelect(userAnswer)" 
                    :key="option"
                    class="inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold text-sm"
                    :class="badgeClass"
                >
                    {{ option }}
                </span>
            </div>

            <!-- Fill in the Blank -->
            <div v-else-if="questionType === 'fill_blank'" class="space-y-2">
                <div 
                    v-for="(blank, index) in parseFillBlank(userAnswer)" 
                    :key="index"
                    class="flex items-center gap-3"
                >
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold bg-gh-accent/10 text-gh-accent border border-gh-accent/20">
                        {{ index + 1 }}
                    </span>
                    <span class="px-4 py-2 rounded-md font-medium" :class="answerBoxClass">
                        {{ blank }}
                    </span>
                </div>
            </div>

            <!-- Ordering -->
            <div v-else-if="questionType === 'ordering'" class="space-y-2">
                <div 
                    v-for="(item, index) in parseOrdering(userAnswer)" 
                    :key="index"
                    class="flex items-center gap-3"
                >
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-gh-accent/10 text-gh-accent border border-gh-accent/20">
                        {{ index + 1 }}
                    </span>
                    <span class="px-4 py-2 rounded-md" :class="answerBoxClass">
                        {{ item }}
                    </span>
                </div>
            </div>

            <!-- Matching Pairs -->
            <div v-else-if="questionType === 'matching_pairs' || questionType === 'matching_matrix'" class="space-y-2">
                <div 
                    v-for="pair in parseMatchingPairs(userAnswer)" 
                    :key="pair.left"
                    class="flex items-center gap-3"
                >
                    <span class="px-3 py-2 rounded-md font-semibold bg-gh-accent/10 text-gh-accent border border-gh-accent/20">
                        {{ pair.left }}
                    </span>
                    <svg class="w-5 h-5 text-gh-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span class="px-3 py-2 rounded-md" :class="answerBoxClass">
                        {{ pair.right }}
                    </span>
                </div>
            </div>

            <!-- Short Answer / Essay -->
            <div v-else class="answer-text" :class="textColor">
                <p class="whitespace-pre-wrap">{{ userAnswer || 'No answer provided' }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    userAnswer: string
    questionType: string
    isCorrect?: boolean | null
    isEvaluated?: boolean
}>()

const statusClass = computed(() => {
    if (props.isEvaluated === false) {
        return 'unevaluated'
    }
    if (props.isCorrect === true) {
        return 'correct'
    }
    if (props.isCorrect === false) {
        return 'incorrect'
    }
    return 'neutral'
})

const iconColor = computed(() => {
    if (props.isCorrect === true) return 'text-green-400'
    if (props.isCorrect === false) return 'text-red-400'
    return 'text-gh-text-muted'
})

const textColor = computed(() => {
    if (props.isCorrect === true) return 'text-green-400'
    if (props.isCorrect === false) return 'text-red-400'
    return 'text-gh-text'
})

const badgeClass = computed(() => {
    if (props.isCorrect === true) {
        return 'bg-green-500/10 text-green-400 border-2 border-green-500/20'
    }
    if (props.isCorrect === false) {
        return 'bg-red-500/10 text-red-400 border-2 border-red-500/20'
    }
    return 'bg-gh-accent/10 text-gh-accent border-2 border-gh-accent/20'
})

const answerBoxClass = computed(() => {
    if (props.isCorrect === true) {
        return 'bg-green-500/10 text-green-400 border border-green-500/20'
    }
    if (props.isCorrect === false) {
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
    }
    return 'bg-gh-bg text-gh-text border border-gh-border'
})

const parseMultipleSelect = (answer: string): string[] => {
    if (!answer) return []
    return answer.split(',').map(s => s.trim()).filter(Boolean)
}

const parseFillBlank = (answer: string): string[] => {
    if (!answer) return []
    return answer.split('<>').map(s => s.trim()).filter(Boolean)
}

const parseOrdering = (answer: string): string[] => {
    if (!answer) return []
    return answer.split(',').map(s => s.trim()).filter(Boolean)
}

const parseMatchingPairs = (answer: string): Array<{ left: string; right: string }> => {
    if (!answer) return []
    return answer.split(',').map(pair => {
        const [left, right] = pair.split(':').map(s => s.trim())
        return { left: left || '', right: right || '' }
    }).filter(p => p.left && p.right)
}
</script>

<style scoped>
.answer-display {
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid var(--color-gh-border);
    background: var(--color-gh-bg);
    transition: all 0.3s ease;
}

.answer-display.correct {
    border-color: rgba(34, 197, 94, 0.3);
    background: rgba(34, 197, 94, 0.05);
}

.answer-display.incorrect {
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.05);
}

.answer-display.unevaluated {
    border-color: rgba(250, 204, 21, 0.3);
    background: rgba(250, 204, 21, 0.05);
}

.answer-display.neutral {
    border-color: var(--color-gh-border);
    background: var(--color-gh-bg);
}

.answer-content {
    min-height: 2.5rem;
    display: flex;
    align-items: center;
}

.answer-text {
    font-size: 0.9375rem;
    line-height: 1.6;
}
</style>
