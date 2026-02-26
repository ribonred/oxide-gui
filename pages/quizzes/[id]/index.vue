<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <Button @click="router.push('/quizzes')">
                Back to Quizzes
            </Button>
        </div>

        <!-- Quiz Detail -->
        <div v-else-if="quiz">
            <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                <BackButton to="/quizzes" title="Back to Quizzes" />
                <h1 class="text-xl md:text-2xl font-bold text-gh-text">Quiz Details</h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Quiz Info Card -->
                    <Card>
                        <div class="space-y-6">
                            <!-- Title -->
                            <div>
                                <h3 class="text-sm font-medium text-gh-muted mb-2">Title</h3>
                                <p class="text-2xl font-bold text-gh-text">{{ quiz.title }}</p>
                            </div>

                            <!-- Description -->
                            <div v-if="quiz.description">
                                <h3 class="text-sm font-medium text-gh-muted mb-2">Description</h3>
                                <p class="text-gh-text whitespace-pre-wrap">{{ quiz.description }}</p>
                            </div>

                            <!-- Categories & Tags -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Category</h3>
                                    <span
                                        class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gh-accent/10 text-gh-accent border border-gh-accent/20 uppercase tracking-wider">
                                        {{ quiz.categories }}
                                    </span>
                                </div>
                                <div v-if="quiz.tags && quiz.tags.length > 0">
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Tags</h3>
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="tag in quiz.tags" :key="tag"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gh-bg text-gh-text-muted border border-gh-border">
                                            {{ tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Metadata -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Status</h3>
                                    <span :class="getStatusClass(quiz.status)"
                                        class="inline-block px-3 py-1 rounded-full text-sm font-medium">
                                        {{ quiz.status }}
                                    </span>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Access Type</h3>
                                    <span :class="getAccessTypeClass(quiz.access_type)"
                                        class="inline-block px-3 py-1 rounded-full text-sm font-medium">
                                        {{ quiz.access_type }}
                                    </span>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Availability</h3>
                                    <p class="text-gh-text">{{ quiz.availability }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Questions</h3>
                                    <p class="text-gh-text font-semibold">{{ quiz.questions?.length || 0 }}</p>
                                </div>
                            </div>

                            <!-- Scheduled Dates -->
                            <div v-if="quiz.availability === 'Scheduled' && (quiz.available_from || quiz.available_until)"
                                class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-if="quiz.available_from">
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Available From</h3>
                                    <p class="text-gh-text">{{ formatDate(quiz.available_from) }}</p>
                                </div>
                                <div v-if="quiz.available_until">
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Available Until</h3>
                                    <p class="text-gh-text">{{ formatDate(quiz.available_until) }}</p>
                                </div>
                            </div>

                            <!-- Settings -->
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Time Limit</h3>
                                    <p class="text-gh-text">{{ formatTimeLimit(quiz.time_limit_seconds) }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Max Attempts</h3>
                                    <p class="text-gh-text">{{ quiz.max_attempts }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Shuffle Questions</h3>
                                    <p class="text-gh-text">{{ quiz.shuffle_questions ? 'Yes' : 'No' }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Submission Mode</h3>
                                    <span :class="getSubmissionModeClass(quiz.submission_mode)"
                                        class="inline-block px-3 py-1 rounded-full text-sm font-medium">
                                        {{ formatSubmissionMode(quiz.submission_mode) }}
                                    </span>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Client Only</h3>
                                    <p class="text-gh-text">{{ quiz.client_only ? 'Yes' : 'No' }}</p>
                                </div>
                            </div>

                            <!-- Access Code -->
                            <div v-if="quiz.access_code">
                                <h3 class="text-sm font-medium text-gh-muted mb-2">Access Code</h3>
                                <div class="flex items-center gap-2">
                                    <code
                                        class="px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text font-mono">
                                        {{ quiz.access_code }}
                                    </code>
                                </div>
                            </div>

                            <!-- Timestamps -->
                            <div class="pt-4 border-t border-gh-border">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-gh-muted">Created:</span>
                                        <span class="text-gh-text ml-2">{{ formatDate(quiz.created_at) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gh-muted">Updated:</span>
                                        <span class="text-gh-text ml-2">{{ formatDate(quiz.updated_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <!-- Questions List -->
                    <Card>
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-bold text-gh-text">Questions</h2>
                            <Button variant="secondary" :to="`/quizzes/manage/${quiz.id}`">
                                Manage Questions
                            </Button>
                        </div>

                        <div v-if="quiz.questions && quiz.questions.length > 0" class="space-y-3">
                            <div v-for="(question, index) in quiz.questions" :key="question.id"
                                class="p-3 md:p-4 bg-gh-bg border border-gh-border rounded-md hover:border-gh-accent transition-colors cursor-pointer"
                                @click="router.push(`/questions/${question.id}`)">
                                <div class="flex items-start gap-2 md:gap-3">
                                    <span
                                        class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gh-accent text-white rounded-full text-xs md:text-sm font-semibold">
                                        {{ index + 1 }}
                                    </span>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-sm md:text-base text-gh-text font-medium mb-1 line-clamp-2">{{
                                            question.question_title }}</h3>
                                        <div
                                            class="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-gh-text-muted">
                                            <span class="truncate max-w-[120px] md:max-w-none">{{
                                                getQuestionTypeLabel(question.question_type) }}</span>
                                            <span class="hidden md:inline">•</span>
                                            <span class="whitespace-nowrap">{{ question.points }} pts</span>
                                            <span class="hidden md:inline">•</span>
                                            <span :class="getDifficultyClass(question.difficulty_level)"
                                                class="px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                                {{ question.difficulty_level }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gh-text-muted">
                            <p>No questions added yet</p>
                        </div>
                    </Card>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1 space-y-6">
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Actions</h2>
                        <div class="space-y-3">
                            <Button full-width :to="`/quizzes/edit/${quiz.id}`">
                                Edit Quiz
                            </Button>
                            <Button variant="secondary" full-width :to="`/quizzes/manage/${quiz.id}`">
                                Manage Questions
                            </Button>
                            <Button variant="danger" full-width @click="showDeleteModal = true">
                                Delete Quiz
                            </Button>
                        </div>
                    </Card>

                    <!-- Analytics -->
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Analytics</h2>
                        <div class="space-y-3">
                            <Button variant="secondary" full-width :to="`/quizzes/leaderboard/${quiz.id}`">
                                <div class="flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Leaderboard</span>
                                </div>
                            </Button>
                            <Button variant="secondary" full-width :to="`/quizzes/${quiz.id}/attempts`">
                                <div class="flex items-center justify-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>View Attempts</span>
                                    <span v-if="pendingEvaluations > 0"
                                        class="ml-1 px-2 py-0.5 bg-gh-accent text-white text-xs font-semibold rounded-full">
                                        {{ pendingEvaluations }}
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </Card>
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Participants</h2>
                        <RealtimeParticipants :quiz-id="quiz.id" />
                    </Card>

                    <!-- Tickets -->
                    <Card>
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gh-text">Tickets</h2>
                            <Button size="sm" @click="showTicketModal = true">Issue</Button>
                        </div>
                        <TicketTable :tickets="tickets" :loading="ticketsLoading" @revoke="handleRevokeTicket" />
                    </Card>
                </div>
            </div>

        </div>

        <!-- Ticket Issue Modal -->
        <TicketIssueModal v-model="showTicketModal" ticket-type="quiz" :quiz-id="route.params.id"
            @created="onTicketCreated" />

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click.self="showDeleteModal = false">
            <Card class="max-w-md w-full mx-4">
                <h2 class="text-xl font-bold text-gh-text mb-4">Delete Quiz</h2>
                <p class="text-gh-text mb-6">
                    Are you sure you want to delete "{{ quiz?.title }}"? This action cannot be undone.
                </p>
                <div class="flex gap-4">
                    <Button variant="danger" full-width @click="handleDelete" :disabled="deleting">
                        {{ deleting ? 'Deleting...' : 'Delete' }}
                    </Button>
                    <Button variant="secondary" full-width @click="showDeleteModal = false" :disabled="deleting">
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import BackButton from '~/components/ui/BackButton.vue'
import RealtimeParticipants from '~/components/quiz/RealtimeParticipants.vue'
import TicketTable from '~/components/events/TicketTable.vue'
import TicketIssueModal from '~/components/events/TicketIssueModal.vue'

definePageMeta({
    middleware: 'auth'
})

const router = useRouter()
const route = useRoute()
const { getQuizById, deleteQuiz } = useQuizzes()
const { getStatusClass, getAccessTypeClass } = useQuizEnums()
const { getQuestionTypeLabel, getDifficultyClass } = useQuestionEnums()
const { getAttemptsInfo } = useAttempts()
const { listTickets, revokeTicket } = useTickets()

const quiz = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)
const pendingEvaluations = ref(0)
const showTicketModal = ref(false)
const tickets = ref([])
const ticketsLoading = ref(false)

// Fetch quiz details
const fetchQuiz = async () => {
    loading.value = true
    error.value = null

    const result = await getQuizById(route.params.id)

    if (result.success) {
        quiz.value = result.data.data
    } else {
        error.value = result.error
    }

    loading.value = false
}

// Format date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

// Format time limit
const formatTimeLimit = (seconds) => {
    if (seconds === 0) return 'No limit'

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0) parts.push(`${secs}s`)

    return parts.join(' ')
}

const formatSubmissionMode = (mode) => {
    if (!mode) return 'Soft Limit'
    const modes = {
        'soft_limit': 'Soft Limit',
        'hard_limit': 'Hard Limit'
    }
    return modes[mode] || mode
}

// Get submission mode styling
const getSubmissionModeClass = (mode) => {
    const modes = {
        'soft_limit': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        'hard_limit': 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
    }
    return modes[mode] || 'bg-gh-bg text-gh-text-muted border border-gh-border'
}

// Handle delete
const handleDelete = async () => {
    deleting.value = true

    const result = await deleteQuiz(route.params.id)

    if (result.success) {
        router.push('/quizzes')
    } else {
        error.value = result.error
        showDeleteModal.value = false
    }

    deleting.value = false
}

// Fetch pending evaluations count
const fetchPendingEvaluations = async () => {
    const result = await getAttemptsInfo({
        quizId: Number(route.params.id),
        is_fully_evaluated: false,
        per_page: 1
    })

    if (result.success && result.data) {
        pendingEvaluations.value = result.data.pagination?.totalItems || 0
    }
}

// Ticket management
const fetchTickets = async () => {
    ticketsLoading.value = true
    const result = await listTickets({ ticket_type: 'quiz' })
    if (result.success) {
        tickets.value = (result.data.data.results || []).filter(
            t => t.quiz_id === Number(route.params.id)
        )
    }
    ticketsLoading.value = false
}

const handleRevokeTicket = async (ticketId) => {
    const result = await revokeTicket(ticketId)
    if (result.success) {
        fetchTickets()
    }
}

const onTicketCreated = () => {
    showTicketModal.value = false
    fetchTickets()
}

// Fetch on mount
onMounted(() => {
    fetchQuiz()
    fetchPendingEvaluations()
    fetchTickets()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
