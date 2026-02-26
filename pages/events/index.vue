<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl md:text-2xl font-bold text-gh-text">Events</h1>
            <Button to="/events/create">Create Event</Button>
        </div>

        <!-- Filters -->
        <div class="mb-6">
            <EventFilters
                :name="filters.name"
                @update:name="onNameChange"
                :status="filters.status"
                @update:status="val => { filters.status = val; fetchEvents() }"
            />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <Button @click="fetchEvents()">Retry</Button>
        </div>

        <!-- Empty -->
        <div v-else-if="events.length === 0" class="text-center py-20">
            <svg class="w-16 h-16 mx-auto text-gh-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-gh-text-muted mb-4">No events found</p>
            <Button to="/events/create">Create your first event</Button>
        </div>

        <!-- Event Grid -->
        <div v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <EventCard
                    v-for="event in events"
                    :key="event.id"
                    :name="event.name"
                    :quiz-title="event.quiz_title"
                    :starts-at="event.starts_at"
                    :ends-at="event.ends_at"
                    :is-active="event.is_active"
                    :max-attempts="event.max_attempts"
                    :client-only="event.client_only"
                    :metadata="event.metadata || {}"
                    @click="router.push(`/events/${event.id}`)"
                />
            </div>

            <!-- Pagination -->
            <div v-if="pagination && pagination.totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    :disabled="pagination.currentPage <= 1"
                    @click="changePage(pagination.currentPage - 1)"
                >
                    Previous
                </Button>
                <span class="text-sm text-gh-text-muted px-4">
                    Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    :disabled="pagination.currentPage >= pagination.totalPages"
                    @click="changePage(pagination.currentPage + 1)"
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import EventCard from '~/components/events/EventCard.vue'
import EventFilters from '~/components/events/EventFilters.vue'

definePageMeta({
    middleware: 'auth',
})

const router = useRouter()
const { searchEvents } = useEvents()

const events = ref([])
const loading = ref(true)
const error = ref(null)
const pagination = ref(null)

const filters = reactive({
    name: '',
    status: 'all',
    page: 1,
})

let nameDebounce = null
const onNameChange = (val) => {
    filters.name = val
    clearTimeout(nameDebounce)
    nameDebounce = setTimeout(() => fetchEvents(), 300)
}

const fetchEvents = async () => {
    loading.value = true
    error.value = null

    const params = {
        status: filters.status,
        page: filters.page,
        perPage: 12,
    }
    if (filters.name) params.name = filters.name

    const result = await searchEvents(params)

    if (result.success) {
        events.value = result.data.data.results
        pagination.value = result.data.data.pagination
    } else {
        error.value = result.error
    }

    loading.value = false
}

const changePage = (page) => {
    filters.page = page
    fetchEvents()
}

onMounted(() => {
    fetchEvents()
})
</script>
