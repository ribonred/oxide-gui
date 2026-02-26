<template>
    <Modal v-model="isOpen" title="Issue Ticket" size="lg">
        <div class="space-y-4">
            <!-- Participant Search -->
            <div>
                <label class="block text-sm font-medium text-gh-text mb-2">Participant <span class="text-red-400">*</span></label>
                <div class="relative">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by alias, email, or external ID..."
                        class="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder-gh-text-muted focus:outline-none focus:ring-1 focus:ring-gh-accent focus:border-gh-accent text-sm"
                        @input="debouncedSearch"
                        @focus="showDropdown = true"
                    />
                    <div v-if="searching" class="absolute right-3 top-1/2 -translate-y-1/2">
                        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gh-accent"></div>
                    </div>
                </div>

                <!-- Selected Participant -->
                <div v-if="selectedParticipant" class="mt-2 flex items-center gap-2 p-2 bg-gh-accent/10 border border-gh-accent/20 rounded-md">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-gh-text font-medium truncate">{{ selectedParticipant.alias || selectedParticipant.external_id }}</p>
                        <p v-if="selectedParticipant.email" class="text-xs text-gh-text-muted truncate">{{ selectedParticipant.email }}</p>
                    </div>
                    <button @click="clearSelection" class="p-1 text-gh-text-muted hover:text-gh-text">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Search Results Dropdown -->
                <div
                    v-if="showDropdown && searchResults.length > 0 && !selectedParticipant"
                    class="mt-1 bg-gh-card border border-gh-border rounded-md shadow-lg max-h-40 overflow-y-auto z-10 relative"
                >
                    <button
                        v-for="participant in searchResults"
                        :key="participant.id"
                        type="button"
                        @click="selectParticipant(participant)"
                        class="w-full text-left px-3 py-2 hover:bg-gh-bg transition-colors border-b border-gh-border last:border-0"
                    >
                        <p class="text-sm text-gh-text font-medium">{{ participant.alias || participant.external_id }}</p>
                        <p v-if="participant.email" class="text-xs text-gh-text-muted">{{ participant.email }}</p>
                    </button>
                </div>

                <p v-if="showDropdown && searchQuery && !searching && searchResults.length === 0 && !selectedParticipant" class="mt-1 text-xs text-gh-text-muted">
                    No participants found
                </p>
            </div>

            <!-- Quantity -->
            <div>
                <label class="block text-sm font-medium text-gh-text mb-2">Quantity <span class="text-red-400">*</span></label>
                <input
                    v-model.number="form.quantity"
                    type="number"
                    min="1"
                    placeholder="Number of uses"
                    class="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder-gh-text-muted focus:outline-none focus:ring-1 focus:ring-gh-accent focus:border-gh-accent text-sm"
                />
            </div>

            <!-- Bypass Client -->
            <div class="flex items-center gap-3">
                <input
                    v-model="form.bypass_client"
                    type="checkbox"
                    id="bypass-client"
                    class="h-4 w-4 rounded border-gh-border text-gh-accent focus:ring-gh-accent bg-gh-bg"
                />
                <label for="bypass-client" class="text-sm text-gh-text">Bypass client enforcement</label>
            </div>

            <!-- Reason -->
            <div>
                <label class="block text-sm font-medium text-gh-text mb-2">Reason</label>
                <textarea
                    v-model="form.reason"
                    rows="2"
                    placeholder="Optional reason for issuing this ticket"
                    class="w-full px-3 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder-gh-text-muted focus:outline-none focus:ring-1 focus:ring-gh-accent focus:border-gh-accent text-sm resize-none"
                ></textarea>
            </div>

            <!-- Error -->
            <p v-if="submitError" class="text-sm text-red-400">{{ submitError }}</p>
        </div>

        <template #footer="{ close }">
            <Button full-width @click="handleSubmit" :disabled="!canSubmit || submitting">
                {{ submitting ? 'Issuing...' : 'Issue Ticket' }}
            </Button>
            <Button variant="secondary" full-width @click="close" :disabled="submitting">
                Cancel
            </Button>
        </template>
    </Modal>
</template>

<script setup>
import Modal from '~/components/ui/Modal.vue'
import Button from '~/components/ui/Button.vue'

const props = defineProps({
    modelValue: Boolean,
    ticketType: {
        type: String,
        required: true,
        validator: (v) => ['quiz', 'event'].includes(v),
    },
    quizId: {
        type: [Number, String],
        default: null,
    },
    eventId: {
        type: String,
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'created'])

const { createTicket } = useTickets()
const { searchParticipants } = useParticipants()

const isOpen = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const searchQuery = ref('')
const searchResults = ref([])
const searching = ref(false)
const showDropdown = ref(false)
const selectedParticipant = ref(null)
const submitting = ref(false)
const submitError = ref(null)

const form = reactive({
    quantity: 1,
    bypass_client: false,
    reason: '',
})

let searchTimeout = null
const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    if (!searchQuery.value || searchQuery.value.length < 2) {
        searchResults.value = []
        return
    }
    searchTimeout = setTimeout(async () => {
        searching.value = true
        const result = await searchParticipants({
            query: searchQuery.value,
            perPage: 10,
        })
        if (result.success) {
            searchResults.value = result.data.data?.results || []
        }
        searching.value = false
    }, 300)
}

const selectParticipant = (participant) => {
    selectedParticipant.value = participant
    showDropdown.value = false
    searchQuery.value = participant.alias || participant.external_id || ''
}

const clearSelection = () => {
    selectedParticipant.value = null
    searchQuery.value = ''
    searchResults.value = []
}

const canSubmit = computed(() => {
    return selectedParticipant.value && form.quantity > 0
})

const handleSubmit = async () => {
    if (!canSubmit.value) return

    submitting.value = true
    submitError.value = null

    const payload = {
        participant_id: selectedParticipant.value.id,
        ticket_type: props.ticketType,
        quantity: form.quantity,
        bypass_client: form.bypass_client,
        reason: form.reason || undefined,
    }

    if (props.ticketType === 'quiz' && props.quizId) {
        payload.quiz_id = Number(props.quizId)
    }
    if (props.ticketType === 'event' && props.eventId) {
        payload.event_id = props.eventId
    }

    const result = await createTicket(payload)
    if (result.success) {
        resetForm()
        emit('created')
    } else {
        submitError.value = result.error
    }

    submitting.value = false
}

const resetForm = () => {
    selectedParticipant.value = null
    searchQuery.value = ''
    searchResults.value = []
    form.quantity = 1
    form.bypass_client = false
    form.reason = ''
    submitError.value = null
}

watch(isOpen, (val) => {
    if (!val) resetForm()
})
</script>
