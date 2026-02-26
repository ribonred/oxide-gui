<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <!-- Header -->
        <div class="mb-4 md:mb-6">
            <div class="flex items-center gap-3 md:gap-4 mb-4">
                <BackButton :to="`/quizzes/${route.params.id}`" title="Back to Quiz" />
                <h1 class="text-xl md:text-2xl font-bold text-gh-text">Quiz Attempts</h1>
            </div>
            <div class="flex justify-end">
                <Button variant="secondary" @click="showSyncModal = true" :disabled="syncing || totalAttempts === 0">
                    <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" :class="{ 'animate-spin': syncing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>{{ syncing ? 'Syncing...' : 'Sync All Evaluations' }}</span>
                    </div>
                </Button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card class="p-4 md:p-6">
                <div class="flex items-center gap-4">
                    <div
                        class="w-12 h-12 rounded-full bg-gh-accent/10 border border-gh-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg class="w-6 h-6 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gh-muted mb-1">Total Attempts</p>
                        <p class="text-2xl md:text-3xl font-bold text-gh-text">{{ totalAttempts }}</p>
                    </div>
                </div>
            </Card>

            <Card class="p-4 md:p-6" :class="needsEvaluationCount > 0 ? 'border-2 border-gh-accent/50' : ''">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        :class="needsEvaluationCount > 0 ? 'bg-yellow-500/10 border border-yellow-500/20 animate-pulse' : 'bg-green-500/10 border border-green-500/20'">
                        <svg class="w-6 h-6" :class="needsEvaluationCount > 0 ? 'text-yellow-400' : 'text-green-400'"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm text-gh-muted mb-1">Needs Evaluation</p>
                        <p class="text-2xl md:text-3xl font-bold"
                            :class="needsEvaluationCount > 0 ? 'text-yellow-400' : 'text-green-400'">
                            {{ needsEvaluationCount }}
                        </p>
                    </div>
                </div>
            </Card>
        </div>

        <!-- Filters -->
        <Card class="mb-6 p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <FilterSelect v-model="filters.evaluationStatus" :options="evaluationStatusOptions"
                        placeholder="Evaluation Status" @update:modelValue="applyFilters" />
                </div>

                <div>
                    <Input v-model="filters.participantAlias" placeholder="Search participant..."
                        @input="debouncedSearch" />
                </div>

                <div>
                    <button @click="clearFilters"
                        class="w-full h-10 px-4 bg-gh-bg border border-gh-border rounded-md text-gh-text hover:bg-gh-card hover:border-gh-accent/50 transition-colors text-sm font-medium">
                        Clear Filters
                    </button>
                </div>
            </div>
            <p class="text-xs text-gh-muted mt-2">Search by participant name prefix (case-insensitive)</p>
        </Card>

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
            <Button @click="fetchAttempts">
                Try Again
            </Button>
        </div>

        <!-- Attempts Grid -->
        <div v-else-if="attempts.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <AttemptCard v-for="attempt in attempts" :key="attempt.id" :attempt="attempt"
                @click="handleAttemptClick(attempt)" @view-answers="handleViewAnswers(attempt)" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
            <div class="inline-block p-4 bg-gh-accent/10 rounded-2xl mb-4">
                <svg class="w-16 h-16 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 class="text-xl font-semibold text-gh-text mb-2">No attempts found</h3>
            <p class="text-gh-text-muted">
                {{ filters.evaluationStatus || filters.participantAlias ? 'Try adjusting your filters' : 'No one has taken this quiz yet' }}
            </p>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
            <Button variant="secondary" @click="changePage(pagination.currentPage - 1)"
                :disabled="pagination.currentPage === 1">
                Previous
            </Button>

            <span class="text-gh-text px-4">
                Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
            </span>

            <Button variant="secondary" @click="changePage(pagination.currentPage + 1)"
                :disabled="pagination.currentPage === pagination.totalPages">
                Next
            </Button>
        </div>

        <!-- Sync Evaluation Modal -->
        <div v-if="showSyncModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            @click.self="closeSyncModal">
            <Card class="max-w-md w-full">
                <h2 class="text-xl font-bold text-gh-text mb-4">Sync All Evaluations</h2>
                <p class="text-gh-text mb-4">
                    This will re-evaluate all auto-gradable questions across all attempts for this quiz.
                </p>

                <div class="mb-6">
                    <div class="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <input type="checkbox" v-model="resetManualGrades"
                            class="mt-1 w-5 h-5 text-gh-accent bg-gh-bg border-gh-border rounded focus:ring-gh-accent" />
                        <div class="flex-1">
                            <label class="text-sm font-medium text-yellow-400 cursor-pointer">
                                Reset manual grades
                            </label>
                            <p class="text-xs text-gh-text-muted mt-1">
                                ⚠️ Warning: This will reset all manually-graded answers (essay/short answer) to
                                "Needs Evaluation" state with score 0. Use only if you want to re-grade everything.
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="syncResult" class="mb-4 p-4 bg-gh-bg border border-gh-border rounded-lg">
                    <p class="text-sm font-medium text-gh-text mb-2">Sync Results:</p>
                    <ul class="text-sm text-gh-text-muted space-y-1">
                        <li>✓ Attempts processed: <span class="font-semibold text-gh-accent">{{ syncResult.attempts_processed }}</span></li>
                        <li>✓ Answers re-evaluated: <span class="font-semibold text-gh-accent">{{ syncResult.answers_re_evaluated }}</span></li>
                        <li v-if="syncResult.manual_answers_reset > 0">
                            ⚠️ Manual answers reset: <span class="font-semibold text-yellow-400">{{ syncResult.manual_answers_reset }}</span>
                        </li>
                    </ul>
                </div>

                <div class="flex gap-4">
                    <Button @click="executeSyncEvaluation" :disabled="syncing" full-width>
                        {{ syncing ? 'Syncing...' : 'Start Sync' }}
                    </Button>
                    <Button variant="secondary" @click="closeSyncModal" :disabled="syncing" full-width>
                        {{ syncResult ? 'Close' : 'Cancel' }}
                    </Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AttemptListItem, Pagination, SyncQuizEvaluationResponse } from '~/types/api'
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'
import BackButton from '~/components/ui/BackButton.vue'
import FilterSelect from '~/components/ui/FilterSelect.vue'
import Input from '~/components/ui/Input.vue'
import AttemptCard from '~/components/quiz/AttemptCard.vue'

definePageMeta({
    middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getAttemptsInfo, syncQuizEvaluation } = useAttempts()

const attempts = ref<AttemptListItem[]>([])
const pagination = ref<Pagination | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const totalAttempts = ref(0)
const needsEvaluationCount = ref(0)
const showSyncModal = ref(false)
const syncing = ref(false)
const resetManualGrades = ref(false)
const syncResult = ref<SyncQuizEvaluationResponse | null>(null)

const filters = ref({
    page: 1,
    per_page: 10,
    evaluationStatus: '',
    participantAlias: ''
})

const evaluationStatusOptions = [
    { value: '', label: 'All' },
    { value: 'needs_evaluation', label: 'Needs Evaluation' },
    { value: 'evaluated', label: 'Evaluated' }
]

// Fetch attempts
const fetchAttempts = async () => {
    loading.value = true
    error.value = null

    const params: any = {
        page: filters.value.page,
        per_page: filters.value.per_page,
        quizId: Number(route.params.id)
    }

    if (filters.value.participantAlias) {
        params.participantAlias = filters.value.participantAlias
    }

    if (filters.value.evaluationStatus === 'needs_evaluation') {
        params.is_fully_evaluated = false
    } else if (filters.value.evaluationStatus === 'evaluated') {
        params.is_fully_evaluated = true
    }

    const result = await getAttemptsInfo(params)

    if (result.success && result.data) {
        attempts.value = result.data.results || []
        pagination.value = result.data.pagination
        totalAttempts.value = result.data.pagination?.totalItems || 0
    } else {
        error.value = result.error || 'Failed to fetch attempts'
    }

    loading.value = false
}

// Fetch needs evaluation count
const fetchNeedsEvaluationCount = async () => {
    const result = await getAttemptsInfo({
        quizId: Number(route.params.id),
        is_fully_evaluated: false,
        per_page: 1
    })

    if (result.success && result.data) {
        needsEvaluationCount.value = result.data.pagination?.totalItems || 0
    }
}

// Debounced search
let searchTimeout: NodeJS.Timeout | null = null
const debouncedSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        filters.value.page = 1
        fetchAttempts()
    }, 500)
}

const applyFilters = () => {
    filters.value.page = 1
    fetchAttempts()
}

const clearFilters = () => {
    filters.value.evaluationStatus = ''
    filters.value.participantAlias = ''
    filters.value.page = 1
    fetchAttempts()
}

const changePage = (page: number) => {
    filters.value.page = page
    fetchAttempts()
}

const handleAttemptClick = (attempt: AttemptListItem) => {
    router.push({
        path: `/attempts/${attempt.id}`,
        query: { alias: attempt.alias }
    })
}

const handleViewAnswers = (attempt: AttemptListItem) => {
    router.push({
        path: `/attempts/${attempt.id}`,
        query: { alias: attempt.alias }
    })
}

const executeSyncEvaluation = async () => {
    syncing.value = true
    syncResult.value = null

    const result = await syncQuizEvaluation(Number(route.params.id), {
        reset_manual_grades: resetManualGrades.value
    })

    if (result.success && result.data) {
        syncResult.value = result.data
        // Refresh the attempts list after sync
        await fetchAttempts()
        await fetchNeedsEvaluationCount()
    } else {
        error.value = result.error || 'Failed to sync evaluations'
    }

    syncing.value = false
}

const closeSyncModal = () => {
    if (!syncing.value) {
        showSyncModal.value = false
        syncResult.value = null
        resetManualGrades.value = false
    }
}

// Fetch on mount
onMounted(() => {
    fetchAttempts()
    fetchNeedsEvaluationCount()
})
</script>
