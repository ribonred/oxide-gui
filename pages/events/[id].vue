<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <Button @click="router.push('/events')">Back to Events</Button>
        </div>

        <!-- Event Detail -->
        <div v-else-if="event">
            <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                <BackButton to="/events" title="Back to Events" />
                <h1 class="text-xl md:text-2xl font-bold text-gh-text">Event Details</h1>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Content -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Event Info -->
                    <Card>
                        <div class="space-y-6">
                            <!-- Header -->
                            <div class="flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Event Name</h3>
                                    <p class="text-2xl font-bold text-gh-text">{{ event.name }}</p>
                                </div>
                                <span :class="statusClass" class="inline-block px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                                    {{ statusLabel }}
                                </span>
                            </div>

                            <!-- Description -->
                            <div v-if="event.description">
                                <h3 class="text-sm font-medium text-gh-muted mb-2">Description</h3>
                                <p class="text-gh-text whitespace-pre-wrap">{{ event.description }}</p>
                            </div>

                            <!-- Time Window -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Starts At</h3>
                                    <p class="text-gh-text">{{ formatDate(event.starts_at) }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Ends At</h3>
                                    <p class="text-gh-text">{{ formatDate(event.ends_at) }}</p>
                                </div>
                            </div>

                            <!-- Metadata -->
                            <div v-if="Object.keys(event.metadata || {}).length > 0">
                                <h3 class="text-sm font-medium text-gh-muted mb-2">Metadata</h3>
                                <div class="flex flex-wrap gap-2">
                                    <span
                                        v-for="(value, key) in event.metadata"
                                        :key="key"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gh-bg text-gh-text-muted border border-gh-border"
                                    >
                                        {{ key }}: {{ value }}
                                    </span>
                                </div>
                            </div>

                            <!-- Event Overrides -->
                            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Max Attempts</h3>
                                    <p class="text-gh-text">{{ event.max_attempts ?? 'Inherited' }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Time Limit</h3>
                                    <p class="text-gh-text">{{ event.time_limit_seconds ? formatTimeLimit(event.time_limit_seconds) : 'Inherited' }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Submission Mode</h3>
                                    <p class="text-gh-text">{{ event.submission_mode ? formatSubmissionMode(event.submission_mode) : 'Inherited' }}</p>
                                </div>
                                <div>
                                    <h3 class="text-sm font-medium text-gh-muted mb-2">Client Only</h3>
                                    <p class="text-gh-text">{{ event.client_only != null ? (event.client_only ? 'Yes' : 'No') : 'Inherited' }}</p>
                                </div>
                            </div>

                            <!-- Timestamps -->
                            <div class="pt-4 border-t border-gh-border">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span class="text-gh-muted">Created:</span>
                                        <span class="text-gh-text ml-2">{{ formatDate(event.created_at) }}</span>
                                    </div>
                                    <div>
                                        <span class="text-gh-muted">Updated:</span>
                                        <span class="text-gh-text ml-2">{{ formatDate(event.updated_at) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <!-- Questions List -->
                    <Card>
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-xl font-bold text-gh-text">
                                Questions
                                <span class="text-sm font-normal text-gh-muted ml-2">({{ event.question_count }})</span>
                            </h2>
                        </div>

                        <div v-if="event.questions && event.questions.length > 0" class="space-y-3">
                            <div
                                v-for="(question, index) in event.questions"
                                :key="question.id"
                                class="p-3 md:p-4 bg-gh-bg border border-gh-border rounded-md"
                            >
                                <div class="flex items-start gap-2 md:gap-3">
                                    <span class="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-gh-accent text-white rounded-full text-xs md:text-sm font-semibold">
                                        {{ index + 1 }}
                                    </span>
                                    <div class="flex-1 min-w-0">
                                        <h3 class="text-sm md:text-base text-gh-text font-medium mb-1 line-clamp-2">{{ question.question_title }}</h3>
                                        <div class="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-gh-text-muted">
                                            <span class="truncate max-w-[120px] md:max-w-none">{{ getQuestionTypeLabel(question.question_type) }}</span>
                                            <span class="hidden md:inline">&bull;</span>
                                            <span class="whitespace-nowrap">{{ question.points }} pts</span>
                                            <span class="hidden md:inline">&bull;</span>
                                            <span :class="getDifficultyClass(question.difficulty_level)" class="px-2 py-0.5 rounded text-xs whitespace-nowrap">
                                                {{ question.difficulty_level }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-8 text-gh-text-muted">
                            <p>No questions in this quiz</p>
                        </div>
                    </Card>
                </div>

                <!-- Sidebar -->
                <div class="lg:col-span-1 space-y-6">
                    <!-- Actions -->
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Actions</h2>
                        <div class="space-y-3">
                            <Button full-width :to="`/events/edit/${event.id}`">
                                Edit Event
                            </Button>
                            <Button variant="danger" full-width @click="showDeleteModal = true">
                                Delete Event
                            </Button>
                        </div>
                    </Card>

                    <!-- Quiz Info -->
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Quiz</h2>
                        <div class="space-y-3">
                            <NuxtLink :to="`/quizzes/${event.quiz_id}`" class="block p-3 bg-gh-bg border border-gh-border rounded-md hover:border-gh-accent transition-colors">
                                <p class="text-gh-text font-medium">{{ event.quiz_title }}</p>
                                <p v-if="event.quiz_description" class="text-sm text-gh-text-muted mt-1 line-clamp-2">{{ event.quiz_description }}</p>
                                <div class="flex flex-wrap gap-2 mt-2">
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gh-accent/10 text-gh-accent border border-gh-accent/20 uppercase">
                                        {{ event.quiz_categories }}
                                    </span>
                                    <span :class="getAccessTypeClass(event.quiz_access_type)" class="inline-block px-2 py-0.5 rounded-full text-xs font-medium">
                                        {{ event.quiz_access_type }}
                                    </span>
                                </div>
                            </NuxtLink>
                        </div>
                    </Card>

                    <!-- Tickets -->
                    <Card>
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-lg font-bold text-gh-text">Tickets</h2>
                            <Button size="sm" @click="showTicketModal = true">Issue</Button>
                        </div>
                        <TicketTable
                            :tickets="tickets"
                            :loading="ticketsLoading"
                            @revoke="handleRevokeTicket"
                        />
                    </Card>
                </div>
            </div>
        </div>

        <!-- Delete Modal -->
        <Modal v-model="showDeleteModal" title="Delete Event" size="md">
            <p class="text-gh-text">
                Are you sure you want to delete "<strong>{{ event?.name }}</strong>"? This action cannot be undone.
            </p>
            <template #footer="{ close }">
                <Button variant="danger" full-width @click="handleDelete" :disabled="deleting">
                    {{ deleting ? 'Deleting...' : 'Delete' }}
                </Button>
                <Button variant="secondary" full-width @click="close" :disabled="deleting">
                    Cancel
                </Button>
            </template>
        </Modal>

        <!-- Ticket Issue Modal -->
        <TicketIssueModal
            v-model="showTicketModal"
            ticket-type="event"
            :event-id="route.params.id"
            @created="onTicketCreated"
        />
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import BackButton from '~/components/ui/BackButton.vue'
import Modal from '~/components/ui/Modal.vue'
import TicketTable from '~/components/events/TicketTable.vue'
import TicketIssueModal from '~/components/events/TicketIssueModal.vue'

definePageMeta({
    middleware: 'auth',
})

const router = useRouter()
const route = useRoute()
const { getEventById, deleteEvent } = useEvents()
const { listTickets, revokeTicket } = useTickets()
const { getEventStatusLabel, getEventStatusClass } = useEventEnums()
const { getAccessTypeClass } = useQuizEnums()
const { getQuestionTypeLabel, getDifficultyClass } = useQuestionEnums()

const event = ref(null)
const loading = ref(true)
const error = ref(null)
const showDeleteModal = ref(false)
const deleting = ref(false)
const showTicketModal = ref(false)
const tickets = ref([])
const ticketsLoading = ref(false)

const statusLabel = computed(() => {
    if (!event.value) return ''
    return getEventStatusLabel(event.value.is_active, event.value.starts_at, event.value.ends_at)
})

const statusClass = computed(() => {
    if (!event.value) return ''
    return getEventStatusClass(event.value.is_active, event.value.starts_at, event.value.ends_at)
})

const fetchEvent = async () => {
    loading.value = true
    error.value = null

    const result = await getEventById(route.params.id)
    if (result.success) {
        event.value = result.data.data
    } else {
        error.value = result.error
    }

    loading.value = false
}

const fetchTickets = async () => {
    ticketsLoading.value = true
    const result = await listTickets({ ticket_type: 'event' })
    if (result.success) {
        tickets.value = (result.data.data.results || []).filter(
            t => t.event_id === route.params.id
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

const handleDelete = async () => {
    deleting.value = true
    const result = await deleteEvent(route.params.id)
    if (result.success) {
        router.push('/events')
    } else {
        error.value = result.error
        showDeleteModal.value = false
    }
    deleting.value = false
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatTimeLimit = (seconds) => {
    if (!seconds || seconds === 0) return 'No limit'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    const parts = []
    if (h > 0) parts.push(`${h}h`)
    if (m > 0) parts.push(`${m}m`)
    if (s > 0) parts.push(`${s}s`)
    return parts.join(' ')
}

const formatSubmissionMode = (mode) => {
    const modes = { soft_limit: 'Soft Limit', hard_limit: 'Hard Limit' }
    return modes[mode] || mode
}

onMounted(() => {
    fetchEvent()
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
