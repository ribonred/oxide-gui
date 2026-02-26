<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <div class="mb-6 flex items-center gap-2">
            <BackButton to="/quizzes" title="Back to Quizzes" />
            <h1 class="text-2xl font-semibold text-gh-text">Create Quiz</h1>
        </div>

        <Alert v-if="error" variant="error" class="mb-6">
            {{ error }}
        </Alert>

        <Card>
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Title -->
                <Input v-model="form.title" label="Quiz Title" placeholder="Enter quiz title" required />

                <!-- Description -->
                <Textarea v-model="form.description" label="Description" placeholder="Enter quiz description (optional)"
                    optional />

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
                <Select v-model="form.access_type" label="Access Type" placeholder="Select access type" required>
                    <option v-for="type in accessTypes" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </Select>

                <!-- Availability -->
                <Select v-model="form.availability" label="Availability" placeholder="Select availability" required
                    @update:model-value="handleAvailabilityChange">
                    <option v-for="avail in availabilities" :key="avail.value" :value="avail.value">
                        {{ avail.label }}
                    </option>
                </Select>

                <!-- Submission Mode -->
                <Select v-model="form.submission_mode" label="Submission Mode" placeholder="Select submission mode"
                    required @update:model-value="handleSubmissionModeChange">
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
                    <span class="text-gh-text-muted text-xs">Quiz answers are evaluated on the client side only</span>
                </div>

                <!-- Submit Button -->
                <div class="flex gap-4 pt-4">
                    <Button type="submit" :disabled="loading" full-width>
                        {{ loading ? 'Creating...' : 'Create Quiz' }}
                    </Button>
                    <Button variant="secondary" @click="router.push('/quizzes')">
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
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
const { createQuiz } = useQuizzes()
const { quizStatuses, accessTypes, availabilities, submissionModes } = useQuizEnums()

const loading = ref(false)
const error = ref(null)
const submissionModeError = ref(null)

const form = ref({
    title: '',
    description: '',
    categories: 'general',
    tags: [],
    metadata: {},
    status: 'draft',
    access_type: 'private',
    availability: 'always',
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
    loading.value = true
    error.value = null

    // Validate submission mode and availability
    if (form.value.submission_mode === 'hard_limit' && form.value.availability === 'always') {
        error.value = 'Hard Limit submission mode cannot be combined with Always availability'
        loading.value = false
        return
    }

    // Validate time limit
    if (form.value.time_limit_seconds < 60) {
        error.value = 'Time limit must be at least 60 seconds'
        loading.value = false
        return
    }

    try {
        // Prepare the payload
        const payload = {
            title: form.value.title,
            description: form.value.description || null,
            status: form.value.status,
            access_type: form.value.access_type,
            availability: form.value.availability,
            submission_mode: form.value.submission_mode,
            time_limit_seconds: form.value.time_limit_seconds,
            max_attempts: form.value.max_attempts,
            shuffle_questions: form.value.shuffle_questions,
            client_only: form.value.client_only
        }

        // Add dates only if scheduled
        if (form.value.availability === 'scheduled') {
            if (!form.value.available_from || !form.value.available_until) {
                error.value = 'Please provide both available from and until dates for scheduled availability'
                loading.value = false
                return
            }
            payload.available_from = new Date(form.value.available_from).toISOString()
            payload.available_until = new Date(form.value.available_until).toISOString()
        } else {
            payload.available_from = null
            payload.available_until = null
        }

        const result = await createQuiz(payload)

        if (result.success) {
            router.push('/quizzes')
        } else {
            error.value = result.error
        }
    } catch (e) {
        error.value = 'An unexpected error occurred'
        console.error(e)
    } finally {
        loading.value = false
    }
}
</script>
