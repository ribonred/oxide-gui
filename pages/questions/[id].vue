<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <button @click="router.push('/questions')"
                class="px-6 py-2 bg-gh-accent text-white rounded-md hover:bg-opacity-90 transition-colors">
                Back to Questions
            </button>
        </div>

        <!-- Question Detail -->
        <div v-else-if="question">
            <div class="mb-6 flex items-center gap-4">
                <BackButton to="/questions" title="Back to Questions" />
                <h1 class="text-2xl font-bold text-gh-text">Question Details</h1>
            </div>

            <div class="bg-gh-card border border-gh-border rounded-lg p-6 space-y-6">
                <!-- Question Title -->
                <div>
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Question Title</h3>
                    <p class="text-lg text-gh-text">{{ question.question_title }}</p>
                </div>

                <!-- Question Text -->
                <div>
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Question Text</h3>
                    <TiptapRenderer :content="question.question_text" />
                </div>

                <!-- Metadata -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <h3 class="text-sm font-medium text-gh-muted mb-2">Type</h3>
                        <p class="text-gh-text">{{ getQuestionTypeLabel(question.question_type) }}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gh-muted mb-2">Category</h3>
                        <p class="text-gh-text">{{ question.category }}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gh-muted mb-2">Difficulty</h3>
                        <span :class="getDifficultyClass(question.difficulty_level)"
                            class="inline-block px-3 py-1 rounded-full text-sm font-medium">
                            {{ getDifficultyLabel(question.difficulty_level) }}
                        </span>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gh-muted mb-2">Points</h3>
                        <p class="text-gh-text">{{ question.points }}</p>
                    </div>
                </div>

                <!-- Tags -->
                <div v-if="question.tags && question.tags.length > 0">
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Tags</h3>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="tag in question.tags" :key="tag"
                            class="px-3 py-1 bg-gh-accent/10 text-gh-accent border border-gh-accent/30 rounded-full text-sm">
                            {{ tag }}
                        </span>
                    </div>
                </div>

                <!-- Metadata -->
                <div v-if="question.metadata && Object.keys(question.metadata).length > 0">
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Metadata</h3>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="(value, key) in question.metadata" :key="key"
                            class="px-3 py-1.5 bg-gh-bg border border-gh-border rounded-md text-sm">
                            <span class="text-gh-muted">{{ key }}:</span>
                            <span class="text-gh-text ml-1">{{ Array.isArray(value) ? value.join(', ') : value }}</span>
                        </div>
                    </div>
                </div>

                <!-- Options (if applicable) -->
                <OptionsDisplay v-if="question.options && question.options.length > 0" :options="question.options"
                    :title="[QuestionType.MATCHING_PAIRS, QuestionType.MATCHING_MATRIX].includes(question.question_type) ? 'Match Items' : question.question_type === QuestionType.FILL_BLANK ? 'Word Choices' : 'Options'" />

                <!-- Correct Answer -->
                <div>
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Correct Answer</h3>
                    <div class="px-4 py-3 bg-green-500 bg-opacity-10 border border-green-500 rounded-md text-green-400">
                        {{ formatCorrectAnswer(question) }}
                    </div>
                </div>

                <!-- Explanation -->
                <div v-if="question.explanation">
                    <h3 class="text-sm font-medium text-gh-muted mb-2">Explanation</h3>
                    <p class="text-gh-text whitespace-pre-wrap">{{ question.explanation }}</p>
                </div>

                <!-- Timestamps -->
                <div class="pt-4 border-t border-gh-border">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gh-muted">Created:</span>
                            <span class="text-gh-text ml-2">{{ formatDate(question.created_at) }}</span>
                        </div>
                        <div>
                            <span class="text-gh-muted">Updated:</span>
                            <span class="text-gh-text ml-2">{{ formatDate(question.updated_at) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 mt-6">
                <button @click="handleEdit"
                    class="px-4 py-2 bg-gh-accent text-white rounded-md hover:bg-opacity-90 transition-colors">
                    Edit
                </button>
                <button @click="showDeleteModal = true"
                    class="px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-400 hover:bg-opacity-30 transition-colors">
                    Delete
                </button>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click.self="showDeleteModal = false">
            <div class="bg-gh-card border border-gh-border rounded-lg p-6 max-w-md w-full mx-4">
                <h2 class="text-xl font-bold text-gh-text mb-4">Delete Question</h2>
                <p class="text-gh-text mb-6">
                    Are you sure you want to delete this question? This action cannot be undone.
                </p>
                <div class="flex gap-4">
                    <button @click="handleDelete" :disabled="deleting"
                        class="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ deleting ? 'Deleting...' : 'Delete' }}
                    </button>
                    <button @click="showDeleteModal = false" :disabled="deleting"
                        class="flex-1 px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text hover:bg-gh-hover transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import OptionsDisplay from '~/components/questions/OptionsDisplay.vue'
import BackButton from '~/components/ui/BackButton.vue'
import TiptapRenderer from '~/components/editor/TiptapRenderer.vue'

definePageMeta({
    middleware: 'auth'
})

const router = useRouter()
const route = useRoute()
const { getQuestionById, deleteQuestion } = useQuestions()
const { QuestionType, getQuestionTypeLabel, getDifficultyLabel, getDifficultyClass } = useQuestionEnums()

const question = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)

// Fetch question details
const fetchQuestion = async () => {
    loading.value = true
    error.value = null

    const result = await getQuestionById(route.params.id)

    if (result.success) {
        question.value = result.data.data
    } else {
        error.value = result.error
    }

    loading.value = false
}

// Format pair for matching pairs type
const formatPair = (option) => {
    const [key, value] = option.split(':')
    return `${key} → ${value}`
}

// Format correct answer based on question type
const formatCorrectAnswer = (q) => {
    if (q.question_type === QuestionType.TRUE_FALSE) {
        return q.correct_answer === 'true' ? 'True' : 'False'
    } else if (q.question_type === QuestionType.MULTIPLE_SELECT) {
        return q.correct_answer.split(',').join(', ')
    } else if (q.question_type === QuestionType.ORDERING) {
        // Just show labels in order
        return q.correct_answer.split(',').join(' → ')
    } else if (q.question_type === QuestionType.MATCHING_PAIRS || q.question_type === QuestionType.MATCHING_MATRIX) {
        const pairs = q.correct_answer.split(',')
        return pairs.map(pair => formatPair(pair)).join('\n')
    }
    return q.correct_answer
}

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Handle edit
const handleEdit = () => {
    router.push(`/questions/edit/${route.params.id}`)
}

// Handle delete
const handleDelete = async () => {
    deleting.value = true

    const result = await deleteQuestion(route.params.id)

    if (result.success) {
        // Success - redirect to questions list
        router.push('/questions')
    } else {
        error.value = result.error
        showDeleteModal.value = false
    }

    deleting.value = false
}

// Fetch on mount
onMounted(() => {
    fetchQuestion()
})
</script>
