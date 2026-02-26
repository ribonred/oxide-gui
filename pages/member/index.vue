<template>
    <div class="max-w-6xl mx-auto px-4 py-10 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-80 h-80 bg-gh-accent opacity-5 rounded-full blur-3xl -z-10"></div>
        <div class="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10"></div>

        <div class="mb-8 text-center">
            <div class="inline-block p-4 bg-gh-accent/10 rounded-2xl mb-4">
                <svg class="w-12 h-12 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-6 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm6 6c-2.33 0-4.31-.97-5.5-2.5a6.97 6.97 0 01-1.5-4.5c0-3.866 3.134-7 7-7s7 3.134 7 7a6.97 6.97 0 01-1.5 4.5C16.31 16.03 14.33 17 12 17z" />
                </svg>
            </div>
            <h1
                class="text-3xl md:text-5xl font-bold text-gh-text mb-3 bg-gradient-to-r from-gh-text to-gh-accent bg-clip-text">
                Member Quizzes
            </h1>
            <p class="text-lg text-gh-text-muted">Access private quizzes with your member credentials</p>
        </div>

        <div v-if="error" class="mb-6">
            <Alert variant="error">{{ error }}</Alert>
        </div>

        <Card v-if="!validated" class="p-6 md:p-8 border-2 border-gh-border/50 shadow-xl">
            <form @submit.prevent="handleValidate" class="space-y-6">
                <Input v-model="participantIdInput" label="Participant ID" placeholder="participant:xxxx"
                    :error="inputErrors.participantId" />
                <Input v-model="apiKeyInput" label="API Key" placeholder="Enter API key"
                    :error="inputErrors.apiKey" />

                <Button type="submit" :disabled="loading || !canValidate"
                    class="w-full !py-3 text-lg font-semibold bg-gradient-to-r from-gh-accent to-blue-500 hover:from-gh-accent/90 hover:to-blue-600 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <span v-if="!loading" class="flex items-center justify-center gap-2">
                        Validate Access
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <span v-else class="flex items-center justify-center gap-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Validating...
                    </span>
                </Button>
            </form>
        </Card>

        <div v-else>
            <QuizFilters :available-categories="availableCategories" :available-tags="availableTags"
                @apply="handleApplyFilters" @clear="handleClearFilters" />
            <div v-if="loading" class="flex flex-col items-center justify-center py-16">
                <div class="relative">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-gh-accent border-t-transparent"></div>
                    <div class="absolute inset-0 rounded-full h-12 w-12 border-4 border-gh-accent/20"></div>
                </div>
                <p class="mt-4 text-gh-text-muted animate-pulse">Loading quizzes...</p>
            </div>

            <div v-else>
                <div v-if="quizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuizCard v-for="quiz in quizzes" :key="quiz.id" :title="quiz.title"
                        :description="quiz.description" :question-count="quiz.question_count || 0"
                        :time-limit="quiz.time_limit_seconds || 0" :status="normalizeStatus(quiz.status)"
                        :tags="quiz.tags"
                        @click="goToQuiz(quiz.id)" />
                </div>

                <div v-else class="text-center py-20">
                    <div class="inline-block p-6 bg-gh-bg rounded-2xl mb-4 border-2 border-dashed border-gh-border">
                        <svg class="w-16 h-16 text-gh-muted mx-auto" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p class="text-gh-text-muted text-lg">
                        {{ filtersApplied ? 'No quizzes match your filters' : 'No member quizzes available' }}
                    </p>
                    <Button v-if="filtersApplied" variant="secondary" class="mt-4" @click="handleClearFilters">
                        Clear Filters
                    </Button>
                </div>

                <div v-if="pagination && pagination.totalPages > 1"
                    class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button variant="secondary" :disabled="pagination.currentPage === 1"
                        @click="changePage(pagination.currentPage - 1)" class="w-full sm:w-auto !px-6">
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </span>
                    </Button>

                    <div class="px-6 py-3 bg-gh-card border-2 border-gh-border/50 rounded-xl">
                        <span class="text-gh-text font-semibold">
                            Page <span class="text-gh-accent">{{ pagination.currentPage }}</span> of {{
                                pagination.totalPages }}
                        </span>
                    </div>

                    <Button variant="secondary" :disabled="pagination.currentPage === pagination.totalPages"
                        @click="changePage(pagination.currentPage + 1)" class="w-full sm:w-auto !px-6">
                        <span class="flex items-center gap-2">
                            Next
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'
import Alert from '~/components/ui/Alert.vue'
import QuizCard from '~/components/quiz/QuizCard.vue'
import QuizFilters from '~/components/quiz/QuizFilters.vue'
import type { Pagination } from '~/types/api'
import type { MemberQuizSummary } from '~/composables/useMemberClient'
import { useMemberAccess } from '~/composables/useMemberAccess'
import { useMemberClient } from '~/composables/useMemberClient'

useSeoMeta({
  title: 'Member Quizzes',
  ogTitle: 'Member Quizzes - QuizOxide',
  description: 'Access private quizzes assigned to you with your member credentials. Browse and take member-exclusive quizzes on QuizOxide.',
  ogDescription: 'Access private quizzes with your member credentials on QuizOxide.',
})

const router = useRouter()
const route = useRoute()

const { apiKey, participantId, loadFromSession, storeToSession, clearSession, applyQueryParams } = useMemberAccess()
const { getMemberQuizzes, queryMemberQuizzes } = useMemberClient()

const quizzes = ref<MemberQuizSummary[]>([])
const pagination = ref<Pagination | null>(null)
const loading = ref(false)
const error = ref('')
const validated = ref(false)

const activeFilters = ref<{ category: string; tags: string[] } | null>(null)
const filtersApplied = computed(() => {
    if (!activeFilters.value) return false
    return !!activeFilters.value.category || (activeFilters.value.tags?.length || 0) > 0
})

const availableCategories = ref<string[]>([])
const availableTags = ref<string[]>([])

const apiKeyInput = ref('')
const participantIdInput = ref('')

const inputErrors = ref({
    apiKey: '',
    participantId: ''
})

const canValidate = computed(() => !!apiKeyInput.value.trim() && !!participantIdInput.value.trim())

const normalizeStatus = (status: string) => status?.toLowerCase?.() || status

const isUnauthorized = (result: { statusCode?: number; code?: string }) => {
    return result.statusCode === 401 || result.code?.startsWith('AUTH')
}

const goToError = (message: string, code?: string) => {
    router.push({
        path: '/member/error',
        query: {
            message,
            code: code || undefined
        }
    })
}

const validateInputs = () => {
    inputErrors.value.apiKey = ''
    inputErrors.value.participantId = ''

    if (!participantIdInput.value.trim()) {
        inputErrors.value.participantId = 'Participant ID is required'
    }

    if (!apiKeyInput.value.trim()) {
        inputErrors.value.apiKey = 'API key is required'
    }

    return !inputErrors.value.apiKey && !inputErrors.value.participantId
}

const extractSuggestionsFromQuizzes = (quizList: MemberQuizSummary[]) => {
    const categoryCount: Record<string, number> = {}
    const tagCount: Record<string, number> = {}

    quizList.forEach(quiz => {
        if ((quiz as any).categories) {
            const category = (quiz as any).categories
            categoryCount[category] = (categoryCount[category] || 0) + 1
        }

        if (quiz.tags && Array.isArray(quiz.tags)) {
            quiz.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1
            })
        }
    })

    availableCategories.value = Object.keys(categoryCount)
        .sort((a, b) => (categoryCount[b] || 0) - (categoryCount[a] || 0))

    availableTags.value = Object.keys(tagCount)
        .sort((a, b) => (tagCount[b] || 0) - (tagCount[a] || 0))
}

const fetchQuizzes = async (
    page = 1,
    cleanupQuery = false,
    filters: { category: string; tags: string[] } | null = null
) => {
    if (!validateInputs()) {
        return
    }

    loading.value = true
    error.value = ''

    const apiKeyValue = apiKeyInput.value.trim()
    const participantIdValue = participantIdInput.value.trim()

    const appliedFilters = filters || activeFilters.value
    const hasFilters = !!appliedFilters && (!!appliedFilters.category || (appliedFilters.tags?.length || 0) > 0)

    const result = hasFilters
        ? await queryMemberQuizzes(apiKeyValue, {
            page,
            perPage: 12,
            filters: {
                categories: appliedFilters?.category ? [appliedFilters.category] : undefined,
                tags: appliedFilters?.tags?.length ? appliedFilters.tags : undefined
            }
        })
        : await getMemberQuizzes(apiKeyValue, { page, per_page: 12 })

    if (result.success) {
        storeToSession(apiKeyValue, participantIdValue)
        validated.value = true
        quizzes.value = result.data?.results || []
        pagination.value = result.data?.pagination || null

        if (cleanupQuery) {
            const nextQuery: Record<string, any> = {}
            if (route.query.oxideClient) {
                nextQuery.oxideClient = route.query.oxideClient
            }
            router.replace({ path: '/member', query: nextQuery })
        }

        if (!hasFilters && availableCategories.value.length === 0) {
            extractSuggestionsFromQuizzes(quizzes.value)
        }
    } else if (isUnauthorized(result)) {
        clearSession()
        goToError(result.error || 'Unauthorized access', result.code)
    } else {
        error.value = result.error || 'Failed to validate access'
    }

    loading.value = false
}

const handleValidate = async () => {
    await fetchQuizzes(1)
}

const handleApplyFilters = async (filters: { category: string; tags: string[] }) => {
    activeFilters.value = filters
    await fetchQuizzes(1, false, filters)
}

const handleClearFilters = async () => {
    activeFilters.value = null
    await fetchQuizzes(1, false, null)
}

const changePage = async (page: number) => {
    await fetchQuizzes(page)
}

const goToQuiz = (id: number) => {
    router.push(`/member/${id}`)
}

onMounted(async () => {
    loadFromSession()

    apiKeyInput.value = apiKey.value
    participantIdInput.value = participantId.value

    const applied = applyQueryParams(route.query)
    if (applied) {
        apiKeyInput.value = apiKey.value
        participantIdInput.value = participantId.value
    }

    if (apiKeyInput.value && participantIdInput.value) {
        await fetchQuizzes(1, applied)
    }
})
</script>
