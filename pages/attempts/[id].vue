<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="relative">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-gh-accent border-t-transparent"></div>
                <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-gh-accent/20"></div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <Button @click="router.push('/quizzes')">
                Back to Quizzes
            </Button>
        </div>

        <!-- Attempt Details -->
        <div v-else-if="attempt">
            <!-- Header -->
            <div class="mb-6">
                <div class="flex items-center gap-3 mb-4">
                    <BackButton :to="`/quizzes/${attempt.quiz_id}/attempts`" title="Back to Attempts" />
                    <h1 class="text-2xl md:text-3xl font-bold text-gh-text">Attempt Details</h1>
                </div>

                <!-- Attempt Info Card -->
                <Card class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Participant</p>
                            <p class="text-lg font-semibold text-gh-text">{{ participantDisplay }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Score</p>
                            <p class="text-lg font-semibold text-gh-accent">{{ formatScore(attempt.score) }} points</p>
                        </div>
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Progress</p>
                            <p class="text-lg font-semibold text-gh-text">{{ attempt.answered_count }}/{{ attempt.total_questions }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Status</p>
                            <StatusBadge 
                                :status="getAttemptStatus()" 
                                :label="getAttemptStatusLabel()"
                                :show-dot="true"
                            />
                        </div>
                    </div>

                    <div class="mt-6 pt-6 border-t border-gh-border grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Submitted</p>
                            <p class="text-sm text-gh-text">{{ formatDate(attempt.submitted_at) }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gh-muted mb-1">Time Taken</p>
                            <p class="text-sm text-gh-text">{{ formatTime(attempt.time_taken_ms) }}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <!-- Answers Section -->
            <div class="mb-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <h2 class="text-xl font-bold text-gh-text">Answers ({{ sortedAnswers.length }})</h2>
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-2">
                            <input 
                                type="checkbox"
                                v-model="showUnevaluatedOnly"
                                class="w-4 h-4 text-gh-accent bg-gh-bg border-gh-border rounded focus:ring-gh-accent"
                            />
                            <label class="text-sm text-gh-text whitespace-nowrap">Unevaluated only</label>
                        </div>
                        <Button variant="secondary" @click="refetchAnswers" :disabled="refreshing">
                            <div class="flex items-center gap-2">
                                <svg class="w-4 h-4" :class="{ 'animate-spin': refreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Refresh</span>
                            </div>
                        </Button>
                    </div>
                </div>

                <!-- Answer Cards -->
                <div class="space-y-4">
                    <Card 
                        v-for="answer in sortedAnswers" 
                        :key="answer.id"
                        class="p-6"
                    >
                        <div class="space-y-4">
                            <!-- Question Header -->
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gh-accent text-white text-sm font-bold">
                                            {{ answer.question_order }}
                                        </span>
                                        <h3 class="text-lg font-semibold text-gh-text">{{ answer.question_title }}</h3>
                                    </div>
                                </div>
                                <StatusBadge 
                                    :status="answer.is_evaluated ? 'completed' : 'pending'" 
                                    :label="answer.is_evaluated ? 'Evaluated' : 'Needs Evaluation'"
                                />
                            </div>

                            <!-- User Answer -->
                            <div>
                                <p class="text-sm font-medium text-gh-muted mb-2">User Answer:</p>
                                <AnswerDisplay 
                                    :user-answer="answer.user_answer"
                                    :question-type="getQuestionType(answer.question_id)"
                                    :is-correct="answer.is_correct"
                                    :is-evaluated="answer.is_evaluated"
                                />
                            </div>

                            <!-- Score Display -->
                            <div class="flex items-center gap-4 p-3 bg-gh-bg rounded-lg border border-gh-border">
                                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span class="text-sm font-medium text-gh-text">
                                    Score: <span class="text-gh-accent font-bold">{{ formatScore(answer.score) }}</span> points
                                </span>
                            </div>

                            <!-- Evaluation Controls -->
                            <div v-if="editingAnswerId === answer.id" class="mt-4 p-4 bg-gh-bg rounded-lg border-2 border-gh-accent/30">
                                <p class="text-sm font-medium text-gh-text mb-3">Manual Evaluation</p>
                                <div class="space-y-3">
                                    <div class="flex items-center gap-3">
                                        <input 
                                            type="checkbox"
                                            v-model="evaluationForm.isCorrect"
                                            class="w-5 h-5 text-gh-accent bg-gh-bg border-gh-border rounded focus:ring-gh-accent"
                                        />
                                        <label class="text-sm text-gh-text">Mark as Correct</label>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gh-text mb-2">
                                            Score Override (optional)
                                        </label>
                                        <Input 
                                            v-model="evaluationForm.scoreOverride"
                                            type="number"
                                            placeholder="Leave empty for auto-calculation"
                                            :min="0"
                                        />
                                        <p class="text-xs text-gh-muted mt-1">
                                            If checked as correct and no override: max points. If unchecked: 0 points.
                                        </p>
                                    </div>
                                    <div class="flex gap-2">
                                        <Button @click="submitEvaluation(answer.id)" :disabled="evaluating">
                                            {{ evaluating ? 'Saving...' : 'Save Evaluation' }}
                                        </Button>
                                        <Button variant="secondary" @click="cancelEdit">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="mt-4">
                                <Button variant="secondary" size="sm" @click="startEdit(answer)">
                                    {{ answer.is_evaluated ? 'Re-evaluate' : 'Evaluate Answer' }}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                <!-- Empty State -->
                <div v-if="sortedAnswers.length === 0" class="text-center py-12">
                    <p class="text-gh-text-muted">No answers submitted yet</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AttemptAnswersResponse, AttemptAnswerItem } from '~/types/api'
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'
import BackButton from '~/components/ui/BackButton.vue'
import StatusBadge from '~/components/ui/StatusBadge.vue'
import Input from '~/components/ui/Input.vue'
import AnswerDisplay from '~/components/quiz/AnswerDisplay.vue'

definePageMeta({
    middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getAttemptAnswers, evaluateAnswer } = useAttempts()

const attempt = ref<AttemptAnswersResponse | null>(null)
const loading = ref(true)
const refreshing = ref(false)
const error = ref<string | null>(null)
const editingAnswerId = ref<string | null>(null)
const evaluating = ref(false)
const showUnevaluatedOnly = ref(false)

const evaluationForm = ref({
    isCorrect: false,
    scoreOverride: undefined as number | undefined
})

const participantDisplay = computed(() => {
    const alias = route.query.alias as string
    return alias || attempt.value?.participant_id || 'Anonymous'
})

const fetchAttempt = async (skipFilterUpdate = false) => {
    const isRefresh = !loading.value
    if (isRefresh) {
        refreshing.value = true
    } else {
        loading.value = true
    }
    error.value = null

    const params = showUnevaluatedOnly.value ? { is_evaluated: false } : undefined
    const result = await getAttemptAnswers(route.params.id as string, params)

    if (result.success && result.data) {
        attempt.value = result.data
        // Auto-set filter on initial load based on evaluation status
        if (!skipFilterUpdate && !isRefresh) {
            const shouldFilterUnevaluated = !result.data.is_fully_evaluated
            if (showUnevaluatedOnly.value !== shouldFilterUnevaluated) {
                showUnevaluatedOnly.value = shouldFilterUnevaluated
                // Refetch with the new filter
                loading.value = false
                refreshing.value = false
                await fetchAttempt(true)
                return
            }
        }
    } else {
        error.value = result.error || 'Failed to fetch attempt details'
    }

    loading.value = false
    refreshing.value = false
}

const refetchAnswers = () => {
    fetchAttempt()
}

const sortedAnswers = computed(() => {
    if (!attempt.value?.answers) return []
    return [...attempt.value.answers].sort((a, b) => a.question_order - b.question_order)
})

const getAttemptStatus = () => {
    if (!attempt.value?.submitted_at) return 'in_progress'
    if (attempt.value.is_fully_evaluated) return 'completed'
    return 'pending'
}

const getAttemptStatusLabel = () => {
    if (!attempt.value?.submitted_at) return 'In Progress'
    if (attempt.value.is_fully_evaluated) return 'Fully Evaluated'
    return 'Needs Evaluation'
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

const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return '0.00'
    const n = Number(score)
    if (!Number.isFinite(n)) return '0.00'
    return n.toFixed(2)
}

const getQuestionType = (questionId: string): string => {
    // TODO: We might need to fetch question details to get the type
    // For now, we'll return a default type
    // This can be enhanced later if needed
    return 'short_answer'
}

const startEdit = (answer: AttemptAnswerItem) => {
    editingAnswerId.value = answer.id
    evaluationForm.value = {
        isCorrect: answer.is_correct,
        scoreOverride: undefined
    }
}

const cancelEdit = () => {
    editingAnswerId.value = null
    evaluationForm.value = {
        isCorrect: false,
        scoreOverride: undefined
    }
}

const submitEvaluation = async (answerId: string) => {
    evaluating.value = true

    const request = {
        answer_id: answerId,
        is_correct: evaluationForm.value.isCorrect,
        score_override: evaluationForm.value.scoreOverride || undefined
    }

    const result = await evaluateAnswer(request)

    if (result.success) {
        // Optimistically update the UI
        const answerIndex = attempt.value?.answers.findIndex(a => a.id === answerId)
        if (answerIndex !== undefined && answerIndex >= 0 && attempt.value?.answers[answerIndex]) {
            const answer = attempt.value.answers[answerIndex]
            answer.is_correct = evaluationForm.value.isCorrect
            answer.is_evaluated = true
            if (evaluationForm.value.scoreOverride !== undefined) {
                answer.score = evaluationForm.value.scoreOverride
            }
        }

        // Show success message
        console.log('Evaluation saved successfully')
        
        // Reset form
        cancelEdit()

        // Refetch to get accurate data
        await fetchAttempt()
    } else {
        error.value = result.error || 'Failed to evaluate answer'
        // Refetch on error to restore accurate state
        await fetchAttempt()
    }

    evaluating.value = false
}

watch(showUnevaluatedOnly, () => {
    fetchAttempt()
})

onMounted(() => {
    fetchAttempt()
})
</script>
