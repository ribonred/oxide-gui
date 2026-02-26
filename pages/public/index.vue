<template>
    <div class="max-w-7xl mx-auto px-4 py-8 relative overflow-hidden">
        <!-- Decorative background -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-gh-accent opacity-5 rounded-full blur-3xl -z-10"></div>
        <div class="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10"></div>

        <!-- Hero Header -->
        <div class="mb-8 text-center">
            <div class="inline-block p-4 bg-gh-accent/10 rounded-2xl mb-4">
                <svg class="w-12 h-12 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>
            <h1
                class="text-3xl md:text-5xl font-bold text-gh-text mb-3 bg-gradient-to-r from-gh-text to-gh-accent bg-clip-text">
                Public Quizzes
            </h1>
            <p class="text-xl text-gh-text-muted">Discover and challenge yourself with engaging quizzes</p>
        </div>

        <QuizFilters :available-categories="availableCategories" :available-tags="availableTags"
            @apply="handleApplyFilters" @clear="handleClearFilters" />

        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            <div v-for="n in 6" :key="n"
                class="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 animate-pulse">
                <div class="h-4 bg-gh-border rounded w-3/4 mb-4"></div>
                <div class="h-3 bg-gh-border rounded w-full mb-2"></div>
                <div class="h-3 bg-gh-border rounded w-2/3 mb-6"></div>
                <div class="flex gap-3">
                    <div class="h-6 bg-gh-border rounded-full w-16"></div>
                    <div class="h-6 bg-gh-border rounded-full w-20"></div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
            <Alert type="error" :message="error" />
        </div>

        <!-- Quizzes Grid -->
        <div v-else>
            <div v-if="quizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <QuizCard v-for="quiz in quizzes" :key="quiz.id" :title="quiz.title" :description="quiz.description"
                    :question-count="quiz.question_count || 0" :time-limit="quiz.time_limit_seconds || 0"
                    :status="quiz.status" :categories="quiz.categories" :tags="quiz.tags" @click="goToQuiz(quiz.id)" />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-20">
                <div class="inline-block p-6 bg-gh-bg rounded-2xl mb-4 border-2 border-dashed border-gh-border">
                    <svg class="w-16 h-16 text-gh-muted mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <p class="text-gh-text-muted text-lg">
                    {{ filtersApplied ? 'No quizzes match your filters' : 'No public quizzes available at the moment' }}
                </p>
                <p class="text-gh-muted text-sm mt-2">
                    {{ filtersApplied ? 'Try adjusting your filters' : 'Check back later for new quizzes!' }}
                </p>
                <Button v-if="filtersApplied" variant="secondary" @click="handleClearFilters" class="mt-4">
                    Clear Filters
                </Button>
            </div>

            <!-- Pagination -->
            <div v-if="pagination && pagination.totalPages > 1"
                class="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button variant="secondary" :disabled="pagination.currentPage === 1"
                    @click="changePage(pagination.currentPage - 1)"
                    class="w-full sm:w-auto !px-6 hover:scale-105 transition-transform">
                    <span class="flex items-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
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
                    @click="changePage(pagination.currentPage + 1)"
                    class="w-full sm:w-auto !px-6 hover:scale-105 transition-transform">
                    <span class="flex items-center gap-2">
                        Next
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Alert from '~/components/ui/Alert.vue'
import QuizCard from '~/components/quiz/QuizCard.vue'
import QuizFilters from '~/components/quiz/QuizFilters.vue'
import type { Quiz, Pagination } from '~/types/api'

const config = useRuntimeConfig()

useSeoMeta({
    title: 'Public Quizzes',
    ogTitle: 'QuizOxide - API-First Quiz Platform Built with Rust',
    description: 'Discover and challenge yourself with engaging public quizzes. Browse topics, filter by category, and test your knowledge on QuizOxide.',
    ogDescription: 'Discover and challenge yourself with engaging public quizzes on QuizOxide. Built with Rust.',
    ogImage: `${config.public.siteUrl}/api/og/home`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    twitterCard: 'summary_large_image',
    twitterImage: `${config.public.siteUrl}/api/og/home`,
})

const router = useRouter()
const { getPublicQuizzes, queryPublicQuizzes } = useQuizzes()

// Quiz data state
const quizzes = ref<Quiz[]>([])
const pagination = ref<Pagination | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)

const activeFilters = ref<{ category: string; tags: string[] } | null>(null)
const filtersApplied = computed(() => {
    if (!activeFilters.value) return false
    return !!activeFilters.value.category || (activeFilters.value.tags?.length || 0) > 0
})

// Available options (extracted from first page load - fallback for recommendations)
const availableCategories = ref<string[]>([])
const availableTags = ref<string[]>([])

const handleApplyFilters = async (filters: { category: string; tags: string[] }) => {
    activeFilters.value = filters
    currentPage.value = 1
    await fetchQuizzes(1, filters)
}

const handleClearFilters = async () => {
    activeFilters.value = null
    currentPage.value = 1
    await fetchQuizzes(1, null)
}

// Extract unique categories and tags from quiz results
const extractSuggestionsFromQuizzes = (quizList: Quiz[]) => {
    const categoryCount: Record<string, number> = {}
    const tagCount: Record<string, number> = {}

    quizList.forEach(quiz => {
        // Count categories
        if (quiz.categories) {
            categoryCount[quiz.categories] = (categoryCount[quiz.categories] || 0) + 1
        }
        // Count tags
        if (quiz.tags && Array.isArray(quiz.tags)) {
            quiz.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1
            })
        }
    })

    // Sort by frequency (most common first)
    availableCategories.value = Object.keys(categoryCount)
        .sort((a, b) => (categoryCount[b] || 0) - (categoryCount[a] || 0))

    availableTags.value = Object.keys(tagCount)
        .sort((a, b) => (tagCount[b] || 0) - (tagCount[a] || 0))
}

// Fetch quizzes (with or without filters)
const fetchQuizzes = async (page = 1, filters: { category: string; tags: string[] } | null = null) => {
    loading.value = true
    error.value = null

    let result

    const appliedFilters = filters || activeFilters.value
    const hasFilters = !!appliedFilters && (!!appliedFilters.category || (appliedFilters.tags?.length || 0) > 0)

    if (hasFilters) {
        // Use POST query endpoint with filters
        const filters: { categories?: string[]; tags?: string[] } = {}
        if (appliedFilters?.category) {
            filters.categories = [appliedFilters.category]
        }
        if (appliedFilters?.tags && appliedFilters.tags.length > 0) {
            filters.tags = appliedFilters.tags
        }

        result = await queryPublicQuizzes({
            page,
            perPage: 12,
            filters,
        })
    } else {
        // Use GET endpoint for unfiltered results
        result = await getPublicQuizzes({
            page,
            per_page: 12,
        })
    }

    if (result.success && result.data) {
        quizzes.value = result.data.data.results
        pagination.value = result.data.data.pagination

        // On first load (page 1, no filters), extract suggestions
        if (page === 1 && !hasFilters && availableCategories.value.length === 0) {
            extractSuggestionsFromQuizzes(quizzes.value)
        }
    } else {
        error.value = result.error || 'Unknown error'
    }

    loading.value = false
}

// Navigate to quiz
const goToQuiz = (quizId: number) => {
    router.push(`/public/${quizId}`)
}

// Change page
const changePage = (page: number) => {
    currentPage.value = page
    fetchQuizzes(page)
}

// SSR-compatible initial fetch
const { data: initialData, error: initialError } = await useAsyncData('public-quizzes', async () => {
    const result = await getPublicQuizzes({ page: 1, per_page: 12 })
    if (result.success && result.data) {
        return result.data.data
    }
    throw new Error(result.error || 'Failed to fetch public quizzes')
})

if (initialData.value) {
    quizzes.value = initialData.value.results
    pagination.value = initialData.value.pagination
    extractSuggestionsFromQuizzes(quizzes.value)
} else if (initialError.value) {
    error.value = initialError.value.message
}
</script>
