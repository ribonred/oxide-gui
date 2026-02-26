<template>
  <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-400 mb-4">{{ error }}</p>
      <UiButton @click="router.push('/participants')">Back to Participants</UiButton>
    </div>

    <!-- Participant Detail -->
    <div v-else-if="participant">
      <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
        <UiBackButton to="/participants" title="Back to Participants" />
        <h1 class="text-xl md:text-2xl font-bold text-gh-text">Participant Details</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <UiCard>
            <div class="space-y-5">
              <!-- Alias & Avatar -->
              <div class="flex items-center gap-4">
                <div
                  class="w-14 h-14 rounded-full bg-gh-accent/10 border border-gh-accent/20 flex items-center justify-center text-gh-accent text-xl font-bold"
                >
                  {{ participant.alias?.charAt(0)?.toUpperCase() || '?' }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gh-text">{{ participant.alias }}</h2>
                  <p v-if="participant.email" class="text-sm text-gh-muted">{{ participant.email }}</p>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gh-muted mb-1">Participant ID</h3>
                  <p class="text-gh-text font-mono text-sm">{{ participant.id }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gh-muted mb-1">External ID</h3>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gh-bg-secondary text-gh-text border border-gh-border"
                  >
                    {{ participant.external_id || '—' }}
                  </span>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gh-muted mb-1">Created</h3>
                  <p class="text-gh-text text-sm">{{ formatDate(participant.created_at) }}</p>
                </div>
                <div v-if="participant.email">
                  <h3 class="text-sm font-medium text-gh-muted mb-1">Email</h3>
                  <p class="text-gh-text text-sm">{{ participant.email }}</p>
                </div>
              </div>

              <!-- Metadata -->
              <div v-if="participant.metadata && Object.keys(participant.metadata).length">
                <h3 class="text-sm font-medium text-gh-muted mb-2">Metadata</h3>
                <div class="bg-gh-bg rounded-md border border-gh-border p-3">
                  <div
                    v-for="(value, key) in participant.metadata"
                    :key="String(key)"
                    class="flex items-start gap-2 py-1 text-sm"
                  >
                    <span class="text-gh-muted font-mono shrink-0">{{ key }}:</span>
                    <span class="text-gh-text break-all">{{ value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </UiCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <UiCard>
            <h3 class="text-sm font-medium text-gh-muted mb-3 uppercase tracking-wider">Actions</h3>
            <div class="space-y-2">
              <NuxtLink
                :to="`/participants/${participant.id}/analytics`"
                class="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-gh-accent/10 text-gh-accent hover:bg-gh-accent/20 border border-gh-accent/20 transition-colors text-sm font-medium"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </NuxtLink>
            </div>
          </UiCard>

          <!-- Quick Stats -->
          <UiCard>
            <h3 class="text-sm font-medium text-gh-muted mb-3 uppercase tracking-wider">Summary</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gh-muted">ID</span>
                <span class="text-gh-text font-mono text-xs truncate max-w-[180px]">{{ participant.id }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gh-muted">External ID</span>
                <span class="text-gh-text">{{ participant.external_id || '—' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-gh-muted">Registered</span>
                <span class="text-gh-text">{{ formatRelativeDate(participant.created_at) }}</span>
              </div>
            </div>
          </UiCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Participant } from '~/types/participant'

const route = useRoute()
const router = useRouter()
const { getParticipantById } = useParticipants()

const participant = ref<Participant | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchParticipant = async () => {
  loading.value = true
  error.value = null
  const id = route.params.id as string
  const result = await getParticipantById(id)
  if (result.success && result.data) {
    participant.value = result.data.data
  } else {
    error.value = result.error || 'Participant not found'
  }
  loading.value = false
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatRelativeDate = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

onMounted(fetchParticipant)
</script>
