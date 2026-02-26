<template>
    <div class="max-w-3xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Error -->
        <div v-else-if="loadError" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ loadError }}</p>
            <Button to="/events">Back to Events</Button>
        </div>

        <template v-else>
            <div class="mb-6 flex items-center gap-3">
                <BackButton :to="`/events/${route.params.id}`" title="Back to Event" />
                <h1 class="text-xl md:text-2xl font-bold text-gh-text">Edit Event</h1>
            </div>

            <form @submit.prevent="handleSubmit">
                <!-- Event Details -->
                <Card class="mb-6">
                    <h2 class="text-lg font-bold text-gh-text mb-4">Event Details</h2>
                    <div class="space-y-4">
                        <Input
                            v-model="form.name"
                            label="Name"
                            placeholder="e.g. Midterm Exam - Class A"
                            required
                            :error="errors.name"
                        />

                        <Textarea
                            v-model="form.description"
                            label="Description"
                            placeholder="Optional description..."
                            optional
                        />

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DateTimePicker
                                v-model="form.starts_at"
                                label="Starts At"
                                required
                                :error="errors.starts_at"
                            />
                            <DateTimePicker
                                v-model="form.ends_at"
                                label="Ends At"
                                required
                                :error="errors.ends_at"
                            />
                        </div>

                        <KeyValueInput
                            v-model="form.metadata"
                            label="Metadata"
                        />
                    </div>
                </Card>

                <!-- Overrides -->
                <Card class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-bold text-gh-text">Event Overrides</h2>
                        <span class="text-xs text-gh-muted">Leave blank to inherit from quiz</span>
                    </div>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                v-model="form.max_attempts"
                                label="Max Attempts"
                                type="number"
                                :min="1"
                                optional
                                placeholder="Inherit from quiz"
                            />
                            <Input
                                v-model="form.time_limit_seconds"
                                label="Time Limit (seconds)"
                                type="number"
                                :min="0"
                                optional
                                placeholder="Inherit from quiz"
                            />
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                v-model="form.submission_mode"
                                label="Submission Mode"
                                placeholder="Inherit from quiz"
                                optional
                            >
                                <option value="soft_limit">Soft Limit (Flexible)</option>
                                <option value="hard_limit">Hard Limit (Strict)</option>
                            </Select>
                            <Select
                                v-model="form.client_only"
                                label="Client Only"
                                placeholder="Inherit from quiz"
                                optional
                            >
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Select>
                        </div>
                    </div>
                </Card>

                <!-- Actions -->
                <div class="flex gap-4">
                    <Button type="submit" :disabled="submitting">
                        {{ submitting ? 'Saving...' : 'Save Changes' }}
                    </Button>
                    <Button variant="secondary" :to="`/events/${route.params.id}`">
                        Cancel
                    </Button>
                </div>

                <p v-if="submitError" class="mt-4 text-sm text-red-400">{{ submitError }}</p>
            </form>
        </template>
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
const route = useRoute()
const { getEventById, updateEvent } = useEvents()

const loading = ref(true)
const loadError = ref(null)
const submitting = ref(false)
const submitError = ref(null)
const errors = reactive({})

const form = reactive({
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

const formatDateForPicker = (isoString) => {
    if (!isoString) return ''
    const d = new Date(isoString)
    const pad = (n) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const fetchEvent = async () => {
    loading.value = true
    const result = await getEventById(route.params.id)

    if (result.success) {
        const event = result.data.data
        form.name = event.name
        form.description = event.description || ''
        form.starts_at = formatDateForPicker(event.starts_at)
        form.ends_at = formatDateForPicker(event.ends_at)
        form.metadata = event.metadata || {}
        form.max_attempts = event.max_attempts
        form.time_limit_seconds = event.time_limit_seconds
        form.submission_mode = event.submission_mode || ''
        form.client_only = event.client_only === true ? 'true' : event.client_only === false ? 'false' : ''
    } else {
        loadError.value = result.error
    }

    loading.value = false
}

const validate = () => {
    Object.keys(errors).forEach(k => delete errors[k])
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
        name: form.name.trim(),
        description: form.description?.trim() || null,
        starts_at: new Date(form.starts_at).toISOString(),
        ends_at: new Date(form.ends_at).toISOString(),
        metadata: form.metadata,
        max_attempts: form.max_attempts ? Number(form.max_attempts) : null,
        time_limit_seconds: form.time_limit_seconds ? Number(form.time_limit_seconds) : null,
        submission_mode: form.submission_mode || null,
        client_only: form.client_only === 'true' ? true : form.client_only === 'false' ? false : null,
    }

    const result = await updateEvent(route.params.id, payload)

    if (result.success) {
        router.push(`/events/${route.params.id}`)
    } else {
        submitError.value = result.error
    }

    submitting.value = false
}

onMounted(fetchEvent)
</script>
