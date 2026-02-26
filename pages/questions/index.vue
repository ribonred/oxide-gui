<template>
  <div class="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8 py-8 md:py-12">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gh-text">Questions</h1>
      <NuxtLink
        to="/questions/create"
        class="w-full sm:w-auto flex items-center justify-center gap-2 bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2.5 rounded-md font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Question</span>
      </NuxtLink>
    </div>
    
    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
      <div class="bg-gh-bg-secondary p-4 rounded-lg border border-gh-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gh-text-muted text-xs md:text-sm">Total Questions</p>
            <p class="text-xl md:text-2xl font-bold text-gh-text mt-1">{{ questionInfo.total }}</p>
          </div>
          <svg class="w-8 h-8 md:w-10 md:h-10 text-gh-accent opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <div class="bg-gh-bg-secondary p-4 rounded-lg border border-gh-border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gh-text-muted text-xs md:text-sm">Total Categories</p>
            <p class="text-xl md:text-2xl font-bold text-gh-text mt-1">{{ Object.keys(questionsByCategory).length }}</p>
          </div>
          <svg class="w-8 h-8 md:w-10 md:h-10 text-gh-accent opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
      <p class="text-gh-text-muted mt-4">Loading questions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="badge-danger rounded-lg p-4">
      {{ error }}
    </div>

    <!-- Folder View - Categories Grid (Windows Explorer Style) -->
    <div v-else-if="Object.keys(questionsByCategory).length > 0">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        <NuxtLink
          v-for="(questions, category) in questionsByCategory"
          :key="category"
          :to="`/questions/category/${category}`"
          class="category-folder group"
        >
          <div class="folder-icon-container">
            <!-- Folder Icon -->
            <svg class="folder-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            </svg>
          </div>
          <div class="folder-label">
            {{ category }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-16 w-16 md:h-24 md:w-24 text-gh-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-base md:text-lg font-medium text-gh-text">No questions found</h3>
      <p class="mt-2 text-sm md:text-base text-gh-text-muted">Get started by creating your first question.</p>
      <NuxtLink
        to="/questions/create"
        class="mt-4 inline-flex items-center gap-2 bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Create Question</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const { getQuestions } = useQuestions()
const { questionTypes, difficultyLevels, getQuestionTypeLabel, getDifficultyClass } = useQuestionEnums()
const { questionInfo, getQuestionInfo } = useQuestionInfo()

const allQuestions = ref([])
const loading = ref(true)
const error = ref(null)
const expandedCategories = ref({})

const filters = ref({
  difficulty_level: '',
  question_type: ''
})

// Group questions by category
const questionsByCategory = computed(() => {
  const grouped = {}
  
  allQuestions.value.forEach(question => {
    const category = question.category || 'Uncategorized'
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(question)
  })

  // Sort categories alphabetically
  const sorted = {}
  Object.keys(grouped).sort().forEach(key => {
    sorted[key] = grouped[key]
  })

  return sorted
})

// Fetch all questions by paginating through all pages
const fetchAllQuestions = async () => {
  loading.value = true
  error.value = null

  const perPage = 100 // Max allowed by backend
  let currentPage = 1
  let allFetchedQuestions = []
  let hasMorePages = true

  try {
    // Fetch all pages
    while (hasMorePages) {
      const result = await getQuestions({
        page: currentPage,
        per_page: perPage,
        difficulty_level: filters.value.difficulty_level || undefined,
        question_type: filters.value.question_type || undefined,
      })

      if (result.success) {
        const questions = result.data.data?.results || []
        const pagination = result.data.data?.pagination || null

        allFetchedQuestions = [...allFetchedQuestions, ...questions]

        // Check if there are more pages
        if (pagination && currentPage < pagination.totalPages) {
          currentPage++
        } else {
          hasMorePages = false
        }
      } else {
        error.value = result.error
        hasMorePages = false
      }
    }

    allQuestions.value = allFetchedQuestions

    // Auto-expand first category if there are questions
    if (allQuestions.value.length > 0) {
      nextTick(() => {
        const firstCategory = Object.keys(questionsByCategory.value)[0]
        if (firstCategory && !expandedCategories.value[firstCategory]) {
          expandedCategories.value[firstCategory] = true
        }
      })
    }
  } catch (err) {
    error.value = err.message || 'Failed to fetch questions'
  }

  loading.value = false
}

const clearFilters = () => {
  filters.value.difficulty_level = ''
  filters.value.question_type = ''
  fetchAllQuestions()
}

const toggleCategory = (category) => {
  expandedCategories.value[category] = !expandedCategories.value[category]
}

// Animation methods for smooth expand/collapse
const onEnter = (el) => {
  el.style.height = '0'
}

const onAfterEnter = (el) => {
  el.style.height = 'auto'
}

const onLeave = (el) => {
  el.style.height = el.scrollHeight + 'px'
  // Force reflow
  el.offsetHeight
  el.style.height = '0'
}

// Fetch questions on mount
onMounted(async () => {
  // Fetch question info first to populate categories
  if (questionInfo.value.categories.length === 0) {
    await getQuestionInfo()
  }
  fetchAllQuestions()
})
</script>

<style scoped>
.category-folder {
  @apply flex flex-col items-center p-4 md:p-6 bg-gh-card border-2 border-gh-border rounded-xl cursor-pointer transition-all duration-300;
}

.category-folder:hover {
  @apply border-gh-accent transform -translate-y-1 shadow-xl;
  background: color-mix(in srgb, var(--color-gh-accent) 5%, var(--color-gh-card));
}

.folder-icon-container {
  @apply relative mb-2 md:mb-3;
}

.folder-icon {
  @apply w-16 h-16 md:w-20 md:h-20 text-gh-accent transition-transform duration-300;
}

.category-folder:hover .folder-icon {
  @apply transform scale-110;
}

.count-badge {
  @apply absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white;
  background: linear-gradient(135deg, var(--color-gh-accent) 0%, color-mix(in srgb, var(--color-gh-accent) 70%, #000) 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.folder-label {
  @apply text-center text-gh-text font-semibold text-xs md:text-sm group-hover:text-gh-accent transition-colors truncate w-full px-1 md:px-2;
}
</style>
