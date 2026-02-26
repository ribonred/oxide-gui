<template>
    <div class="max-w-3xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div class="mb-6 flex items-center gap-3">
            <BackButton to="/events" title="Back to Events" />
            <h1 class="text-xl md:text-2xl font-bold text-gh-text">Create Event</h1>
        </div>

        <form @submit.prevent="handleSubmit">
            <!-- Quiz Selection -->
            <Card class="mb-6">
                <h2 class="text-lg font-bold text-gh-text mb-4">Quiz</h2>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gh-text mb-2">Select Quiz <span
                                class="text-red-400">*</span></label>
                        <div class="relative">
                            <input v-model="quizSearch" type="text" placeholder="Search quizzes by title..."
                                class="w-full px-3 py-2 bg-gh-bg border rounded-md text-gh-text placeholder-gh-text-muted focus:outline-none focus:ring-1 focus:ring-gh-accent focus:border-gh-accent text-sm"
                                :class="errors.quiz_id ? 'border-red-500' : 'border-gh-border'"
                                @focus="showQuizDropdown = true" @input="onQuizSearch" />
                            <div v-if="quizSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
                                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gh-accent"></div>
                            </div>
                        </div>
                        <p v-if="errors.quiz_id" class="text-xs text-red-400 mt-1">{{ errors.quiz_id }}</p>

                        <!-- Selected Quiz Chip -->
                        <div v-if="selectedQuiz && !showQuizDropdown"
                            class="mt-2 flex items-center gap-2 p-2 bg-gh-accent/10 border border-gh-accent/20 rounded-md">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm text-gh-text font-medium truncate">{{ selectedQuiz.title }}</p>
                                <p class="text-xs text-gh-text-muted">{{ selectedQuiz.question_count }} questions &bull;
                                    {{ selectedQuiz.categories }}</p>
                            </div>
                            <button type="button" @click="clearQuizSelection"
                                class="p-1 text-gh-text-muted hover:text-gh-text">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <!-- Quiz Dropdown -->
                        <div v-if="showQuizDropdown && filteredQuizzes.length > 0 && !selectedQuiz"
                            class="mt-1 bg-gh-card border border-gh-border rounded-md shadow-lg max-h-52 overflow-y-auto z-10 relative">
                            <button v-for="quiz in filteredQuizzes" :key="quiz.id" type="button"
                                @click="selectQuiz(quiz)"
                                class="w-full text-left px-3 py-2.5 hover:bg-gh-bg transition-colors border-b border-gh-border last:border-0">
                                <p class="text-sm text-gh-text font-medium">{{ quiz.title }}</p>
                                <p class="text-xs text-gh-text-muted">{{ quiz.question_count }} questions &bull; {{
                                    quiz.categories }} &bull; {{ quiz.status }}</p>
                            </button>
                        </div>
                        <p v-if="showQuizDropdown && quizSearch && !quizSearching && filteredQuizzes.length === 0 && !selectedQuiz"
                            class="mt-1 text-xs text-gh-text-muted">
                            No quizzes found
                        </p>
                    </div>

                    <div v-if="selectedQuiz && quizDetail" class="p-3 bg-gh-bg border border-gh-border rounded-md">
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                                <span class="text-gh-muted">Questions:</span>
                                <span class="text-gh-text ml-1 font-medium">{{ quizDetail.question_count }}</span>
                            </div>
                            <div>
                                <span class="text-gh-muted">Max Attempts:</span>
                                <span class="text-gh-text ml-1 font-medium">{{ quizDetail.max_attempts || 'Unlimited'
                                    }}</span>
                            </div>
                            <div>
                                <span class="text-gh-muted">Time Limit:</span>
                                <span class="text-gh-text ml-1 font-medium">{{
                                    formatTimeLimit(quizDetail.time_limit_seconds) }}</span>
                            </div>
                            <div>
                                <span class="text-gh-muted">Submission Mode:</span>
                                <span class="text-gh-text ml-1 font-medium">{{
                                    formatSubmissionMode(quizDetail.submission_mode) }}</span>
                            </div>
                            <div>
                                <span class="text-gh-muted">Client Only:</span>
                                <span class="text-gh-text ml-1 font-medium">{{ quizDetail.client_only ? 'Yes' : 'No'
                                    }}</span>
                            </div>
                            <div>
                                <span class="text-gh-muted">Shuffle:</span>
                                <span class="text-gh-text ml-1 font-medium">{{ quizDetail.shuffle_questions ? 'Yes' :
                                    'No' }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="selectedQuiz && quizDetailLoading"
                        class="p-3 bg-gh-bg border border-gh-border rounded-md">
                        <div class="flex items-center gap-2 text-sm text-gh-text-muted">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gh-accent"></div>
                            Loading quiz details...
                        </div>
                    </div>
                </div>
            </Card>

            <!-- Event Details -->
            <Card class="mb-6">
                <h2 class="text-lg font-bold text-gh-text mb-4">Event Details</h2>
                <div class="space-y-4">
                    <Input v-model="form.name" label="Name" placeholder="e.g. Midterm Exam - Class A" required
                        :error="errors.name" />

                    <Textarea v-model="form.description" label="Description" placeholder="Optional description..."
                        optional />

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateTimePicker v-model="form.starts_at" label="Starts At" required :error="errors.starts_at" />
                        <DateTimePicker v-model="form.ends_at" label="Ends At" required :error="errors.ends_at" />
                    </div>

                    <KeyValueInput v-model="form.metadata" label="Metadata" />
                </div>
            </Card>

            <!-- Overrides -->
            <Card class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gh-text">Event Overrides</h2>
                    <span class="text-xs text-gh-muted">Leave blank to inherit from quiz</span>
                </div>
                <div v-if="quizDetail && hasOverrides"
                    class="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                    <p class="text-xs font-medium text-yellow-400 mb-1">The following quiz defaults will be overridden:
                    </p>
                    <ul class="text-xs text-gh-text-muted space-y-0.5">
                        <li v-if="form.max_attempts">
                            <span class="text-gh-muted">Max Attempts:</span>
                            <span class="line-through text-red-400 mx-1">{{ quizDetail.quiz.max_attempts || 'Unlimited'
                                }}</span>
                            <span class="text-green-400">&rarr; {{ form.max_attempts }}</span>
                        </li>
                        <li v-if="form.time_limit_seconds">
                            <span class="text-gh-muted">Time Limit:</span>
                            <span class="line-through text-red-400 mx-1">{{
                                formatTimeLimit(quizDetail.quiz.time_limit_seconds) }}</span>
                            <span class="text-green-400">&rarr; {{ formatTimeLimit(Number(form.time_limit_seconds))
                                }}</span>
                        </li>
                        <li v-if="form.submission_mode">
                            <span class="text-gh-muted">Submission Mode:</span>
                            <span class="line-through text-red-400 mx-1">{{
                                formatSubmissionMode(quizDetail.quiz.submission_mode) }}</span>
                            <span class="text-green-400">&rarr; {{ formatSubmissionMode(form.submission_mode) }}</span>
                        </li>
                        <li v-if="form.client_only !== ''">
                            <span class="text-gh-muted">Client Only:</span>
                            <span class="line-through text-red-400 mx-1">{{ quizDetail.quiz.client_only ? 'Yes' : 'No'
                                }}</span>
                            <span class="text-green-400">&rarr; {{ form.client_only === 'true' ? 'Yes' : 'No' }}</span>
                        </li>
                    </ul>
                </div>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input v-model="form.max_attempts" label="Max Attempts" type="number" :min="1" optional
                            placeholder="Inherit from quiz" />
                        <Input v-model="form.time_limit_seconds" label="Time Limit (seconds)" type="number" :min="0"
                            optional placeholder="Inherit from quiz" />
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select v-model="form.submission_mode" label="Submission Mode" placeholder="Inherit from quiz"
                            optional>
                            <option value="soft_limit">Soft Limit (Flexible)</option>
                            <option value="hard_limit">Hard Limit (Strict)</option>
                        </Select>
                        <Select v-model="form.client_only" label="Client Only" placeholder="Inherit from quiz" optional>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </Select>
                    </div>
                </div>
            </Card>

            <!-- Actions -->
            <div class="flex gap-4">
                <Button type="submit" :disabled="submitting">
                    {{ submitting ? 'Creating...' : 'Create Event' }}
                </Button>
                <Button variant="secondary" to="/events">
                    Cancel
                </Button>
            </div>

            <p v-if="submitError" class="mt-4 text-sm text-red-400">{{ submitError }}</p>
        </form>
    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import BackButton from '~/components/ui/BackButton.vue'
import Input from '~/components/ui/Input.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'
import DateTimePicker from '~/components/ui/DateTimePicker.vue'
import KeyValueInput from '~/components/ui/KeyValueInput.vue'

definePageMeta({
    middleware: 'auth',
})

const router = useRouter()
const { createEvent } = useEvents()
const { queryQuizzes, getQuizById } = useQuizzes()

const quizzes = ref([])
const quizSearch = ref('')
const quizSearching = ref(false)
const showQuizDropdown = ref(false)
const submitting = ref(false)
const submitError = ref(null)
const errors = reactive({})

const form = reactive({
    quiz_id: '',
    name: '',
    description: '',
    starts_at: '',
    ends_at: '',
    metadata: {},
    max_attempts: null,
    time_limit_seconds: null,
    submission_mode: '',
    client_only: '',
})

const selectedQuiz = ref(null)
const quizDetail = ref(null)
const quizDetailLoading = ref(false)

const hasOverrides = computed(() => {
    return form.max_attempts || form.time_limit_seconds || form.submission_mode || form.client_only !== ''
})

const filteredQuizzes = computed(() => quizzes.value)

let quizSearchTimeout = null
const onQuizSearch = () => {
    clearTimeout(quizSearchTimeout)
    showQuizDropdown.value = true
    selectedQuiz.value = null
    form.quiz_id = ''
    quizSearchTimeout = setTimeout(() => fetchQuizzes(), 300)
}

const fetchQuizzes = async () => {
    quizSearching.value = true
    const result = await queryQuizzes({
        per_page: 20,
        status: 'published',
        query: quizSearch.value || undefined,
    })
    if (result.success) {
        quizzes.value = result.data.data.results
    }
    quizSearching.value = false
}

const selectQuiz = async (quiz) => {
    selectedQuiz.value = quiz
    form.quiz_id = quiz.id
    quizSearch.value = quiz.title
    showQuizDropdown.value = false
    await fetchQuizDetail(quiz.id)
}

const fetchQuizDetail = async (id) => {
    quizDetailLoading.value = true
    quizDetail.value = null
    const result = await getQuizById(String(id))
    if (result.success) {
        quizDetail.value = result.data.data
    }
    quizDetailLoading.value = false
}

const clearQuizSelection = () => {
    selectedQuiz.value = null
    quizDetail.value = null
    form.quiz_id = ''
    quizSearch.value = ''
    showQuizDropdown.value = false
}

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])
    if (!form.quiz_id) errors.quiz_id = 'Please select a quiz'
    if (!form.name?.trim()) errors.name = 'Name is required'
    if (!form.starts_at) errors.starts_at = 'Start time is required'
    if (!form.ends_at) errors.ends_at = 'End time is required'
    if (form.starts_at && form.ends_at && new Date(form.starts_at) >= new Date(form.ends_at)) {
        errors.ends_at = 'End time must be after start time'
    }
    return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
    if (!validate()) return

    submitting.value = true
    submitError.value = null

    const payload = {
        quiz_id: form.quiz_id,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        metadata: Object.keys(form.metadata).length > 0 ? form.metadata : undefined,
        max_attempts: form.max_attempts ? Number(form.max_attempts) : undefined,
        time_limit_seconds: form.time_limit_seconds ? Number(form.time_limit_seconds) : undefined,
        submission_mode: form.submission_mode || undefined,
        client_only: form.client_only === 'true' ? true : form.client_only === 'false' ? false : undefined,
    }

    const result = await createEvent(payload)

    if (result.success) {
        router.push(`/events/${result.data.data.id}`)
    } else {
        submitError.value = result.error
    }

    submitting.value = false
}

const formatTimeLimit = (seconds) => {
    if (!seconds || seconds === 0) return 'No limit'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s > 0 ? `${m}m ${s}s` : `${m}m`
}

const formatSubmissionMode = (mode) => {
    const modes = { soft_limit: 'Soft Limit', hard_limit: 'Hard Limit' }
    return modes[mode] || mode || 'N/A'
}

onMounted(() => {
    fetchQuizzes()
})
</script>
