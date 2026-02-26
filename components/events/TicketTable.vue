<template>
    <div>
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-6">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gh-accent"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="!tickets || tickets.length === 0" class="text-center py-6 text-gh-text-muted text-sm">
            <p>No tickets issued yet</p>
        </div>

        <!-- Table -->
        <div v-else class="space-y-2">
            <div
                v-for="ticket in tickets"
                :key="ticket.id"
                class="p-3 bg-gh-bg border border-gh-border rounded-md"
            >
                <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0 flex-1">
                        <p class="text-sm text-gh-text font-medium truncate" :title="ticket.participant_id">
                            {{ truncateId(ticket.participant_id) }}
                        </p>
                        <div class="flex items-center gap-2 mt-1 text-xs text-gh-text-muted">
                            <span>{{ ticket.used_count }}/{{ ticket.quantity }} used</span>
                            <span>&bull;</span>
                            <span>{{ formatDate(ticket.created_at) }}</span>
                        </div>
                        <p v-if="ticket.reason" class="text-xs text-gh-text-muted mt-1 line-clamp-1">
                            {{ ticket.reason }}
                        </p>
                    </div>
                    <div class="flex items-center gap-2 flex-shrink-0">
                        <span :class="statusClass(ticket)" class="inline-block px-2 py-0.5 rounded-full text-xs font-medium">
                            {{ statusLabel(ticket) }}
                        </span>
                        <button
                            v-if="!ticket.revoked_at"
                            @click="$emit('revoke', ticket.id)"
                            class="p-1 rounded text-gh-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Revoke ticket"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </button>
                    </div>
                </div>
                <!-- Extra info row -->
                <div class="flex flex-wrap gap-2 mt-2">
                    <span v-if="ticket.bypass_client" class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                        Bypass Client
                    </span>
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gh-bg text-gh-text-muted border border-gh-border">
                        Expires: {{ formatDate(ticket.expires_at) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { getTicketStatusLabel, getTicketStatusClass } = useEventEnums()

defineProps({
    tickets: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['revoke'])

const statusLabel = (ticket) => getTicketStatusLabel(ticket)
const statusClass = (ticket) => getTicketStatusClass(ticket)

const truncateId = (id) => {
    if (!id) return ''
    if (id.length <= 12) return id
    return id.slice(0, 6) + '...' + id.slice(-4)
}

const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
