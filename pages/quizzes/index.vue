<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gh-text">Quizzes</h1>
      <NuxtLink to="/quizzes/create"
        class="bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md font-medium">
        Create Quiz
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-gh-bg-secondary/30 p-4 rounded-xl border border-gh-border mb-6 backdrop-blur-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
           <FilterSelect
              v-model="filters.status"
              :options="quizStatuses"
              placeholder="Status"
              class="w-full"
              @update:modelValue="fetchQuizzes"
            />
        </div>

        <div>
           <FilterSelect
              v-model="filters.access_type"
              :options="accessTypes"
              placeholder="Access Type"
              class="w-full"
              @update:modelValue="fetchQuizzes"
            />
        </div>

        <div>
           <FilterSelect
              v-model="filters.availability"
              :options="availabilities"
              placeholder="Availability"
              class="w-full"
              @update:modelValue="fetchQuizzes"
            />
        </div>

        <div class="flex items-end">
          <button @click="clearFilters"
            class="w-full h-10 px-4 bg-gh-bg border border-gh-border rounded-lg text-gh-text hover:bg-gh-card hover:border-gh-accent/50 transition-colors text-sm font-medium">
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
      <p class="text-gh-text-muted mt-4">Loading quizzes...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="badge-danger rounded-lg p-4">
      {{ error }}
    </div>

    <!-- Quizzes List -->
    <div v-else-if="quizzes.length > 0" class="space-y-4">
      <div v-for="quiz in quizzes" :key="quiz.id"
        class="bg-gh-bg-secondary p-6 rounded-lg border border-gh-border hover:border-gh-accent transition-colors cursor-pointer"
        @click="navigateTo(`/quizzes/${quiz.id}`)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-xl font-semibold text-gh-text flex-1">{{ quiz.title }}</h3>
          <div class="flex gap-2">
            <span :class="getStatusClass(quiz.status)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ quiz.status }}
            </span>
            <span :class="getAccessTypeClass(quiz.access_type)" class="px-3 py-1 rounded-full text-sm font-medium">
              {{ quiz.access_type }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-gh-text-muted">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {{ quiz.question_count }} {{ quiz.question_count === 1 ? 'Question' : 'Questions' }}
          </span>

          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ quiz.availability }}
          </span>

          <span v-if="quiz.access_code" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Code: {{ quiz.access_code }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg class="mx-auto h-24 w-24 text-gh-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gh-text">No quizzes found</h3>
      <p class="mt-2 text-gh-text-muted">Get started by creating your first quiz.</p>
      <NuxtLink to="/quizzes/create"
        class="mt-4 inline-block bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md font-medium">
        Create Quiz
      </NuxtLink>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.total_pages > 1" class="mt-8 flex justify-center items-center gap-2">
      <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-md text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gh-bg">
        Previous
      </button>

      <span class="text-gh-text">
        Page {{ pagination.current_page }} of {{ pagination.total_pages }}
      </span>

      <button @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.total_pages"
        class="px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-md text-gh-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gh-bg">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

import FilterSelect from '~/components/ui/FilterSelect.vue'

const router = useRouter()
const { getQuizzes } = useQuizzes()
const { quizStatuses, accessTypes, availabilities, getStatusClass, getAccessTypeClass } = useQuizEnums()

const quizzes = ref([])
const loading = ref(true)
const error = ref(null)
const pagination = ref(null)

const filters = ref({
  page: 1,
  per_page: 10,
  status: '',
  access_type: '',
  availability: ''
})

const fetchQuizzes = async () => {
  loading.value = true
  error.value = null

  const result = await getQuizzes({
    page: filters.value.page,
    per_page: filters.value.per_page,
    status: filters.value.status || undefined,
    access_type: filters.value.access_type || undefined,
    availability: filters.value.availability || undefined,
  })

  if (result.success) {
    // Sort by title alphabetically
    const sortedQuizzes = (result.data.data?.results || []).sort((a, b) => {
      return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    })
    quizzes.value = sortedQuizzes
    pagination.value = result.data.data?.pagination || null
  } else {
    error.value = result.error
  }

  loading.value = false
}

const clearFilters = () => {
  filters.value.status = ''
  filters.value.access_type = ''
  filters.value.availability = ''
  filters.value.page = 1
  fetchQuizzes()
}

const changePage = (page) => {
  filters.value.page = page
  fetchQuizzes()
}

// Fetch quizzes on mount
onMounted(() => {
  fetchQuizzes()
})
</script>
