<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header with Breadcrumb -->
    <div class="mb-8">
      <div class="flex items-center gap-2 text-sm text-gh-text-muted mb-4">
        <NuxtLink to="/questions" class="hover:text-gh-accent transition-colors">
          Question Bank
        </NuxtLink>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span class="text-gh-text font-medium">{{ categoryName }}</span>
      </div>

      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <div
            class="w-16 h-16 rounded-xl bg-gradient-to-br from-gh-accent/20 to-gh-accent/10 flex items-center justify-center">
            <svg class="w-8 h-8 text-gh-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-gh-text">{{ categoryName }}</h1>
            <p class="text-gh-text-muted mt-1">{{ totalItems > 0 ? totalItems : displayedQuestions.length }} {{ (totalItems > 0 ? totalItems : displayedQuestions.length) === 1 ?
              'question' : 'questions' }}</p>
          </div>
        </div>
        <NuxtLink to="/questions/create"
          class="flex items-center gap-2 bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Question
        </NuxtLink>
      </div>

      <div class="border-t border-gh-border pt-6 mb-6">
        <SearchInput v-model="searchQuery" placeholder="Search questions...." class="w-full">
          <template #suffix v-if="searchQuery">
            <button @click="clearSearch" class="text-gh-text-muted hover:text-gh-text transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </template>
        </SearchInput>
        <p v-if="searchQuery.length > 0 && searchQuery.length < 1" class="text-sm text-gh-text-muted mt-2">
          Search Question....
        </p>
        <p v-if="isSearching" class="text-sm text-gh-accent mt-2 flex items-center gap-2">
          <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Searching...
        </p>
      </div>

      <!-- Difficulty Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gh-card p-4 rounded-lg border border-gh-border hover:border-green-400 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gh-text-muted text-sm font-medium">Easy</p>
              <p class="text-2xl font-bold text-green-400 mt-1">{{ difficultyStats.easy }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-green-400 bg-opacity-20 flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gh-card p-4 rounded-lg border border-gh-border hover:border-yellow-400 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gh-text-muted text-sm font-medium">Medium</p>
              <p class="text-2xl font-bold text-yellow-400 mt-1">{{ difficultyStats.medium }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-yellow-400 bg-opacity-20 flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gh-card p-4 rounded-lg border border-gh-border hover:border-red-400 transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gh-text-muted text-sm font-medium">Hard</p>
              <p class="text-2xl font-bold text-red-400 mt-1">{{ difficultyStats.hard }}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-red-400 bg-opacity-20 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gh-card p-6 rounded-xl border border-gh-border mb-6 shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 class="text-lg font-semibold text-gh-text">Filters</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Difficulty Filter -->
        <div>
          <FilterSelect v-model="filters.difficulty" :options="difficultyLevels" placeholder="Difficulty Level"
            class="w-full" />
        </div>

        <!-- Type Filter -->
        <div>
          <FilterSelect v-model="filters.type" :options="questionTypes" placeholder="Question Type" class="w-full" />
        </div>

        <!-- Clear Button -->
        <div class="flex items-end">
          <button @click="clearFilters"
            class="w-full h-10 px-4 bg-gh-bg border border-gh-border rounded-lg text-gh-text hover:bg-gh-card hover:border-gh-accent/50 transition-all font-medium flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Tags Filter - New Row -->
      <div class="mt-4">
        <TagsInput v-model="filters.tags" placeholder="Filter by tags (press Enter to add)..." />
      </div>

      <!-- Active Filters Display -->
      <div v-if="activeFiltersCount > 0 || searchQuery" class="mt-4 pt-4 border-t border-gh-border">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm text-gh-text-muted">Active filters:</span>
          <span v-if="filters.difficulty"
            class="inline-flex items-center gap-1 px-3 py-1 bg-gh-accent/10 text-gh-accent rounded-full text-sm font-medium">
            {{ filters.difficulty }}
            <button @click="filters.difficulty = ''" class="hover:text-gh-accent-hover">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <span v-if="filters.type"
            class="inline-flex items-center gap-1 px-3 py-1 bg-gh-accent/10 text-gh-accent rounded-full text-sm font-medium">
            {{ getQuestionTypeLabel(filters.type) }}
            <button @click="filters.type = ''" class="hover:text-gh-accent-hover">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
          <!-- Tags filters -->
          <span v-for="tag in filters.tags" :key="tag"
            class="inline-flex items-center gap-1 px-3 py-1 bg-gh-accent/10 text-gh-accent rounded-full text-sm font-medium">
            {{ tag }}
            <button @click="filters.tags = filters.tags.filter(t => t !== tag)" class="hover:text-gh-accent-hover">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent mx-auto mb-4"></div>
        <p class="text-gh-text-muted">Loading questions...</p>
      </div>
    </div>

    <!-- Questions Grid - Horizontal Layout -->
    <div v-else-if="displayedQuestions.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="question in displayedQuestions" :key="question.id" class="question-card-horizontal group"
        @click="navigateTo(`/questions/${question.id}`)">
        <!-- Top Section: Title and Difficulty -->
        <div class="mb-3">
          <div class="flex justify-between items-start gap-2 mb-2">
            <h3
              class="text-base font-semibold text-gh-text group-hover:text-gh-accent transition-colors line-clamp-2 flex-1">
              {{ question.question_title }}
            </h3>
            <span :class="getDifficultyClass(question.difficulty_level)" class="difficulty-badge-small flex-shrink-0">
              {{ question.difficulty_level.charAt(0) }}
            </span>
          </div>
        </div>

        <!-- Bottom Section: Metadata -->
        <div class="flex items-center justify-between text-xs text-gh-text-muted">
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1" :title="getQuestionTypeLabel(question.question_type)">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span class="truncate max-w-[80px]">{{ getQuestionTypeLabel(question.question_type) }}</span>
            </span>

            <span class="flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {{ question.points }}
            </span>
          </div>

          <span v-if="question.is_public" class="flex items-center gap-1 text-green-400" title="Public">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>

        <!-- Hover Arrow Indicator -->
        <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all">
          <svg class="w-4 h-4 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-20">
      <svg class="w-20 h-20 text-gh-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="text-xl font-semibold text-gh-text mb-2">No questions found</h3>
      <p class="text-gh-text-muted mb-6">
        {{ searchQuery ? `No results for "${searchQuery}"` : activeFiltersCount > 0 ? 'Try adjusting your filters' : `No
        questions in the ${categoryName} category yet` }}
      </p>
      <div class="flex gap-4 justify-center">
        <button v-if="activeFiltersCount > 0 || searchQuery" @click="clearAll"
          class="px-6 py-2 bg-gh-card border border-gh-border rounded-lg text-gh-text hover:border-gh-accent transition-colors">
          Clear All
        </button>
        <NuxtLink to="/questions/create"
          class="px-6 py-2 bg-gh-accent hover:bg-gh-accent-hover text-white rounded-lg font-medium transition-colors">
          Create Question
        </NuxtLink>
      </div>
    </div>

    <!-- Pagination (independent of v-if/v-else chain above) -->
    <div
      v-if="!loading && displayedQuestions.length > 0 && totalPages > 1"
      class="mt-8 flex justify-between items-center"
    >
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gh-card border border-gh-border rounded-lg text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-gh-accent text-sm font-medium transition-all"
      >
        Previous
      </button>

      <span class="text-gh-text-muted text-sm font-mono">
        Page {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gh-card border border-gh-border rounded-lg text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-gh-accent text-sm font-medium transition-all"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import SearchInput from '~/components/ui/SearchInput.vue'
import FilterSelect from '~/components/ui/FilterSelect.vue'
import TagsInput from '~/components/ui/TagsInput.vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { searchQuestions, getQuestions } = useQuestions()
const { questionTypes, difficultyLevels, getQuestionTypeLabel, getDifficultyClass } = useQuestionEnums()

const categoryName = computed(() => route.params.category)
const loading = ref(true)
const isSearching = ref(false)
const questions = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const totalItems = ref(0)
const perPage = 20
const filters = ref({
  difficulty: '',
  type: '',
  tags: []
})

let searchTimeout = null

const displayedQuestions = computed(() => {
  // All filtering is done server-side, just return sorted results
  return [...questions.value].sort((a, b) => {
    const titleA = a.question_title || ''
    const titleB = b.question_title || ''
    return titleA.localeCompare(titleB, undefined, { sensitivity: 'base' })
  })
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.difficulty) count++
  if (filters.value.type) count++
  if (filters.value.tags.length > 0) count += filters.value.tags.length
  return count
})

const difficultyStats = computed(() => {
  const stats = { easy: 0, medium: 0, hard: 0 }

  questions.value.forEach(q => {
    const level = q.difficulty_level?.toLowerCase()
    if (level === 'easy') stats.easy++
    else if (level === 'medium') stats.medium++
    else if (level === 'hard') stats.hard++
  })
  return stats
})

// Debounced API search function
const performSearch = async () => {
  isSearching.value = true
  loading.value = true

  const hasQuery = searchQuery.value && searchQuery.value.trim().length > 0
  const hasFilters = filters.value.difficulty || filters.value.type || filters.value.tags.length > 0

  try {
    if (hasQuery || hasFilters) {
      // Use search API when there's a query or filters
      const result = await searchQuestions({
        q: searchQuery.value || undefined,
        category: categoryName.value,
        difficulty_level: filters.value.difficulty || undefined,
        question_type: filters.value.type || undefined,
        tags: filters.value.tags.length > 0 ? filters.value.tags : undefined,
        page: currentPage.value,
        per_page: perPage,
      })

      if (result.success && result.data) {
        const results = result.data.data?.results || []
        const pagination = result.data.data?.pagination
        if (pagination) {
          totalPages.value = pagination.totalPages
          totalItems.value = pagination.totalItems
        }

        questions.value = results.map(item => ({
          id: item.question_id || item.id,
          question_title: item.title || item.question_title,
          category: item.category,
          difficulty_level: item.difficulty_level,
          question_type: item.question_type,
          points: item.points || 0,
          is_public: item.is_public || false
        }))
      } else {
        questions.value = []
        totalPages.value = 1
        totalItems.value = 0
      }
    } else {
      // Use getQuestions API for initial load without query/filters
      const result = await getQuestions({
        page: currentPage.value,
        per_page: perPage,
        category: categoryName.value
      })

      if (result.success && result.data) {
        questions.value = result.data.data?.results || []
        const pagination = result.data.data?.pagination
        if (pagination) {
          totalPages.value = pagination.totalPages
          totalItems.value = pagination.totalItems
        }
      } else {
        questions.value = []
        totalPages.value = 1
        totalItems.value = 0
      }
    }
  } catch (error) {
    console.error('Search error:', error)
    questions.value = []
  } finally {
    isSearching.value = false
    loading.value = false
  }
}

// Watch for search query and filter changes
watch(
  [searchQuery, () => filters.value.difficulty, () => filters.value.type, () => filters.value.tags],
  () => {
    currentPage.value = 1 // Reset to first page on filter change
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
      performSearch()
    }, 300)
  },
  { deep: true }
)

// Watch page changes to re-fetch from server
watch(currentPage, () => {
  performSearch()
})

const clearSearch = () => {
  searchQuery.value = ''
}

const clearFilters = () => {
  filters.value.difficulty = ''
  filters.value.type = ''
  filters.value.tags = []
}

const clearAll = () => {
  clearSearch()
  clearFilters()
  // Trigger a fresh search with no filters
  performSearch()
}

// Initial fetch uses performSearch
const fetchQuestions = async () => {
  await performSearch()
}

onMounted(() => {
  fetchQuestions()
})

watch(() => route.params.category, () => {
  clearSearch()
  filters.value.difficulty = ''
  filters.value.type = ''
  performSearch()
})
</script>

<style scoped>
.question-card-horizontal {
  @apply relative p-4 bg-gh-card border-2 border-gh-border rounded-xl cursor-pointer transition-all duration-300 h-[140px] flex flex-col justify-between;
}

.question-card-horizontal:hover {
  @apply border-gh-accent transform -translate-y-1 shadow-xl;
  background: color-mix(in srgb, var(--color-gh-accent) 3%, var(--color-gh-card));
}

.difficulty-badge-small {
  @apply w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>