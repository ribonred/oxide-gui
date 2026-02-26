<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="text-center py-20">
            <Alert variant="error" class="mb-4">{{ loadError }}</Alert>
            <Button @click="router.push('/quizzes')">
                Back to Quizzes
            </Button>
        </div>

        <!-- Edit Form -->
        <div v-else-if="quiz">
            <div class="mb-6 flex items-center gap-2">
                <BackButton :to="`/quizzes/${quiz.id}`" title="Back to Quiz Details" />
                <h1 class="text-2xl font-semibold text-gh-text">Edit Quiz</h1>
            </div>

            <Alert v-if="error" variant="error" class="mb-6">
                {{ error }}
            </Alert>

            <Alert v-if="success" variant="success" class="mb-6">
                Quiz updated successfully!
            </Alert>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Quiz Settings -->
                <div class="lg:col-span-2">
                    <Card>
                        <h2 class="text-xl font-bold text-gh-text mb-6">Quiz Settings</h2>
                        <form @submit.prevent="handleSubmit" class="space-y-6">
                            <!-- Title -->
                            <Input v-model="form.title" label="Quiz Title" placeholder="Enter quiz title" required />

                            <!-- Description -->
                            <Textarea v-model="form.description" label="Description"
                                placeholder="Enter quiz description (optional)" optional />

                            <!-- Categories -->
                            <CategoryInput v-model="form.categories" placeholder="Enter categories (e.g. general)" />

                            <!-- Tags -->
                            <TagsInput v-model="form.tags" label="Tags" placeholder="Add tags..." />

                            <!-- Metadata -->
                            <KeyValueInput v-model="form.metadata" label="Metadata" />

                            <!-- Status -->
                            <Select v-model="form.status" label="Status" placeholder="Select status" required>
                                <option v-for="status in quizStatuses" :key="status.value" :value="status.value">
                                    {{ status.label }}
                                </option>
                            </Select>

                            <!-- Access Type -->
                            <Select v-model="form.access_type" label="Access Type" placeholder="Select access type"
                                required>
                                <option v-for="type in accessTypes" :key="type.value" :value="type.value">
                                    {{ type.label }}
                                </option>
                            </Select>

                            <!-- Availability -->
                            <Select v-model="form.availability" label="Availability" placeholder="Select availability"
                                required @update:model-value="handleAvailabilityChange">
                                <option v-for="avail in availabilities" :key="avail.value" :value="avail.value">
                                    {{ avail.label }}
                                </option>
                            </Select>

                            <!-- Submission Mode -->
                            <Select v-model="form.submission_mode" label="Submission Mode"
                                placeholder="Select submission mode" required
                                @update:model-value="handleSubmissionModeChange">
                                <option v-for="mode in submissionModes" :key="mode.value" :value="mode.value">
                                    {{ mode.label }}
                                </option>
                            </Select>

                            <Alert v-if="submissionModeError" variant="error">
                                {{ submissionModeError }}
                            </Alert>

                            <!-- Scheduled Dates -->
                            <ScheduledDates v-if="isScheduled" v-model:available-from="form.available_from"
                                v-model:available-until="form.available_until" :required="true" />

                            <!-- Time Limit -->
                            <div>
                                <label class="block text-gh-text text-sm font-medium mb-2">
                                    Time Limit <span class="text-red-400">*</span>
                                </label>
                                <p class="text-gh-text-muted text-xs mb-3">Minimum: 60 seconds</p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <select v-model="selectedTimeLimit"
                                            class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                            @change="handleTimeLimitChange">
                                            <option value="60">1 minute</option>
                                            <option value="300">5 minutes</option>
                                            <option value="900">15 minutes</option>
                                            <option value="1800">30 minutes</option>
                                            <option value="3600">1 hour</option>
                                            <option value="7200">2 hours</option>
                                            <option value="10800">3 hours</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                    <div v-if="selectedTimeLimit === 'custom'">
                                        <input v-model.number="form.time_limit_seconds" type="number" min="60" required
                                            class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
                                            placeholder="Enter time in seconds (minimum 60)" />
                                    </div>
                                </div>
                                <p class="text-gh-text-muted text-sm mt-1">
                                    {{ getTimeLimitDisplay() }}
                                </p>
                            </div>

                            <!-- Max Attempts -->
                            <Input v-model.number="form.max_attempts" type="number" label="Maximum Attempts"
                                placeholder="Enter maximum attempts" :min="1" required />

                            <!-- Shuffle Questions -->
                            <div class="flex items-center gap-3">
                                <input v-model="form.shuffle_questions" type="checkbox" id="shuffle"
                                    class="w-5 h-5 bg-gh-bg border border-gh-border rounded focus:ring-2 focus:ring-gh-accent" />
                                <label for="shuffle" class="text-gh-text text-sm font-medium cursor-pointer">
                                    Shuffle Questions
                                </label>
                            </div>

                            <!-- Client Only -->
                            <div class="flex items-center gap-3">
                                <input v-model="form.client_only" type="checkbox" id="client_only"
                                    class="w-5 h-5 bg-gh-bg border border-gh-border rounded focus:ring-2 focus:ring-gh-accent" />
                                <label for="client_only" class="text-gh-text text-sm font-medium cursor-pointer">
                                    Client Only
                                </label>
                                <span class="text-gh-text-muted text-xs">Quiz answers are evaluated on the client side
                                    only</span>
                            </div>

                            <!-- Submit Button -->
                            <div class="flex gap-4 pt-4">
                                <Button type="submit" :disabled="saving" full-width>
                                    {{ saving ? 'Saving...' : 'Save Changes' }}
                                </Button>
                                <Button variant="secondary" @click="router.push(`/quizzes/${quiz.id}`)">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>

                <!-- Question Management -->
                <div class="lg:col-span-1">
                    <Card>
                        <h2 class="text-lg font-bold text-gh-text mb-4">Manage Questions</h2>
                        <p class="text-gh-text-muted text-sm mb-4">
                            Add or remove questions from this quiz
                        </p>
                        <Button full-width @click="router.push(`/quizzes/manage/${quiz.id}`)">
                            Manage Questions
                        </Button>

                        <div v-if="quiz.questions && quiz.questions.length > 0" class="mt-6">
                            <h3 class="text-sm font-medium text-gh-text mb-3">
                                Current Questions ({{ quiz.questions.length }})
                            </h3>
                            <div class="space-y-2 max-h-96 overflow-y-auto">
                                <div v-for="(question, index) in quiz.questions" :key="question.id"
                                    class="flex items-center gap-2 p-2 bg-gh-bg border border-gh-border rounded text-sm">
                                    <span
                                        class="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-gh-accent text-white rounded text-xs font-semibold">
                                        {{ index + 1 }}
                                    </span>
                                    <span class="flex-1 text-gh-text truncate">{{ question.question_title }}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Textarea from '~/components/ui/Textarea.vue'
import Select from '~/components/ui/Select.vue'
import Card from '~/components/ui/Card.vue'
import Alert from '~/components/ui/Alert.vue'
import BackButton from '~/components/ui/BackButton.vue'
import ScheduledDates from '~/components/quiz/ScheduledDates.vue'
import CategoryInput from '~/components/ui/CategoryInput.vue'
import TagsInput from '~/components/ui/TagsInput.vue'
import KeyValueInput from '~/components/ui/KeyValueInput.vue'

definePageMeta({
    middleware: 'auth'
})

const router = useRouter()
const route = useRoute()
const { getQuizById, updateQuiz } = useQuizzes()
const { quizStatuses, accessTypes, availabilities, submissionModes } = useQuizEnums()

const quiz = ref(null)
const loading = ref(true)
const loadError = ref(null)
const saving = ref(false)
const error = ref(null)
const success = ref(false)
const submissionModeError = ref(null)

const form = ref({
    title: '',
    description: '',
    categories: '',
    tags: [],
    metadata: {},
    status: '',
    access_type: '',
    availability: '',
    available_from: '',
    available_until: '',
    time_limit_seconds: 60,
    submission_mode: 'soft_limit',
    max_attempts: 1,
    shuffle_questions: false,
    client_only: false
})

const selectedTimeLimit = ref('0')

const isScheduled = computed(() => form.value.availability === 'scheduled')

// Fetch quiz details
const fetchQuiz = async () => {
    loading.value = true
    loadError.value = null

    const result = await getQuizById(route.params.id)

    if (result.success) {
        quiz.value = result.data.data

        // Populate form
        form.value = {
            title: quiz.value.title,
            description: quiz.value.description || '',
            categories: quiz.value.categories || '',
            tags: quiz.value.tags || [],
            metadata: quiz.value.metadata || {},
            status: quiz.value.status,
            access_type: quiz.value.access_type,
            availability: quiz.value.availability,
            submission_mode: quiz.value.submission_mode,
            available_from: quiz.value.available_from ? formatDateTimeLocal(quiz.value.available_from) : '',
            available_until: quiz.value.available_until ? formatDateTimeLocal(quiz.value.available_until) : '',
            time_limit_seconds: quiz.value.time_limit_seconds,
            max_attempts: quiz.value.max_attempts,
            shuffle_questions: quiz.value.shuffle_questions,
            client_only: quiz.value.client_only || false
        }

        // Set time limit selector
        const presetValues = ['0', '300', '900', '1800', '3600', '7200', '10800']
        selectedTimeLimit.value = presetValues.includes(String(quiz.value.time_limit_seconds))
            ? String(quiz.value.time_limit_seconds)
            : 'custom'
    } else {
        loadError.value = result.error
    }

    loading.value = false
}

const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60 * 1000)
    return localDate.toISOString().slice(0, 16)
}

const handleAvailabilityChange = (value) => {
    if (value !== 'scheduled') {
        form.value.available_from = ''
        form.value.available_until = ''
    }
}

const handleSubmissionModeChange = (value) => {
    submissionModeError.value = null
    if (value === 'hard_limit' && form.value.availability === 'always') {
        submissionModeError.value = 'Hard Limit submission mode cannot be combined with Always availability. Please select Scheduled availability.'
    }
}

const handleTimeLimitChange = () => {
    if (selectedTimeLimit.value !== 'custom') {
        form.value.time_limit_seconds = parseInt(selectedTimeLimit.value)
    }
}

const getTimeLimitDisplay = () => {
    const seconds = form.value.time_limit_seconds
    if (seconds === 0) return 'No time limit'
    if (seconds < 60) return `⚠️ Minimum time limit is 60 seconds (${seconds}s)`

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const parts = []
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`)
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`)
    if (secs > 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`)

    return parts.length > 0 ? parts.join(', ') : 'No time limit'
}

const handleSubmit = async () => {
    saving.value = true
    error.value = null
    success.value = false

    // Validate submission mode and availability
    if (form.value.submission_mode === 'hard_limit' && form.value.availability === 'always') {
        error.value = 'Hard Limit submission mode cannot be combined with Always availability'
        saving.value = false
        return
    }

    // Validate time limit
    if (form.value.time_limit_seconds < 60) {
        error.value = 'Time limit must be at least 60 seconds'
        saving.value = false
        return
    }

    try {
        const payload = {
            title: form.value.title,
            description: form.value.description || null,
            categories: form.value.categories,
            tags: form.value.tags,
            metadata: form.value.metadata,
            status: form.value.status,
            access_type: form.value.access_type,
            availability: form.value.availability,
            submission_mode: form.value.submission_mode,
            time_limit_seconds: form.value.time_limit_seconds,
            max_attempts: form.value.max_attempts,
            shuffle_questions: form.value.shuffle_questions,
            client_only: form.value.client_only
        }

        if (form.value.availability === 'scheduled') {
            if (!form.value.available_from || !form.value.available_until) {
                error.value = 'Please provide both available from and until dates for scheduled availability'
                saving.value = false
                return
            }
            payload.available_from = new Date(form.value.available_from).toISOString()
            payload.available_until = new Date(form.value.available_until).toISOString()
        } else {
            payload.available_from = null
            payload.available_until = null
        }

        const result = await updateQuiz(route.params.id, payload)

        if (result.success) {
            success.value = true
            // Refresh quiz data
            await fetchQuiz()
            setTimeout(() => {
                success.value = false
            }, 3000)
        } else {
            error.value = result.error
        }
    } catch (e) {
        error.value = 'An unexpected error occurred'
        console.error(e)
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchQuiz()
})
</script>
