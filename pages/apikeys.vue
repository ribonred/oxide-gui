<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gh-text">API Keys</h1>
      <button
        @click="showCreateModal = true"
        class="bg-gh-accent hover:bg-gh-accent-hover text-white px-4 py-2 rounded-md font-medium"
      >
        Create New Key
      </button>
    </div>
    
    <!-- Create API Key Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-gh-bg-secondary p-8 rounded-lg border border-gh-border max-w-md w-full">
        <h2 class="text-2xl font-bold text-gh-text mb-4">Create API Key</h2>
        
        <form @submit.prevent="handleCreateKey" class="space-y-4">
          <div>
            <label class="block text-gh-text mb-2">Name</label>
            <input
              v-model="keyName"
              type="text"
              required
              placeholder="My API Key"
              class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
            />
          </div>
          
          <div>
            <label class="block text-gh-text mb-2">Duration</label>
            <select
              v-model="duration"
              class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
            >
              <option value="1hour">1 Hour</option>
              <option value="1day">1 Day</option>
              <option value="1month">1 Month</option>
              <option value="3month">3 Months</option>
            </select>
          </div>

          <div>
            <label class="block text-gh-text mb-2">Role</label>
            <select
              v-model="role"
              class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
            <p class="text-gh-text-secondary text-xs mt-1">Owner role grants full access, User role has limited permissions.</p>
          </div>
          
          <div v-if="createError" class="text-gh-danger text-sm">{{ createError }}</div>
          
          <div v-if="createdKey" class="bg-gh-bg p-4 rounded-md border border-gh-success">
            <p class="text-gh-text text-sm mb-2">Your API Key (save it now):</p>
            <div class="flex items-center gap-2">
              <code class="flex-1 text-gh-success text-sm break-all bg-gh-bg-secondary p-2 rounded">{{ createdKey }}</code>
              <button
                type="button"
                @click="copyToClipboard"
                class="px-3 py-2 bg-gh-bg-secondary hover:bg-gh-border border border-gh-border rounded text-gh-text text-sm transition-colors"
                :class="copied ? 'text-gh-success' : ''"
              >
                {{ copied ? '✓ Copied' : 'Copy' }}
              </button>
            </div>
          </div>
          
          <div class="flex space-x-3">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-gh-accent hover:bg-gh-accent-hover text-white py-2 rounded-md font-medium disabled:opacity-50"
            >
              {{ loading ? 'Creating...' : 'Create' }}
            </button>
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 bg-gh-bg hover:bg-gh-border text-gh-text py-2 rounded-md font-medium border border-gh-border"
            >
              {{ createdKey ? 'Close' : 'Cancel' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- API Keys List -->
    <div class="bg-gh-bg-secondary rounded-lg border border-gh-border overflow-hidden">
      <table class="w-full">
        <thead class="bg-gh-bg border-b border-gh-border">
          <tr>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Name</th>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Prefix</th>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Role</th>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Created</th>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Expires</th>
            <th class="text-left px-6 py-3 text-gh-text font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingKeys" class="border-b border-gh-border">
            <td colspan="6" class="px-6 py-8 text-center text-gh-text-secondary">
              Loading...
            </td>
          </tr>
          <tr v-else-if="apiKeys.length === 0" class="border-b border-gh-border">
            <td colspan="6" class="px-6 py-8 text-center text-gh-text-secondary">
              No API keys yet. Create one to get started.
            </td>
          </tr>
          <tr v-else v-for="key in apiKeys" :key="key.id" class="border-b border-gh-border hover:bg-gh-bg">
            <td class="px-6 py-4 text-gh-text">{{ key.name || 'Unnamed' }}</td>
            <td class="px-6 py-4">
              <code class="text-gh-text-secondary text-sm">{{ key.prefix }}</code>
            </td>
            <td class="px-6 py-4">
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="key.role === 'owner' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'"
              >
                {{ key.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-gh-text-secondary text-sm">
              {{ new Date(key.created_at).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-gh-text-secondary text-sm">
              {{ key.expires_at ? new Date(key.expires_at).toLocaleDateString() : 'Never' }}
            </td>
            <td class="px-6 py-4">
              <button
                @click="handleRevokeKey(key.id)"
                :disabled="revokingKeyId === key.id"
                class="text-gh-danger hover:text-red-400 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ revokingKeyId === key.id ? 'Revoking...' : 'Revoke' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Revoke Confirmation Dialog -->
    <ConfirmDialog
      v-model:isOpen="showRevokeConfirm"
      title="Revoke API Key"
      message="Are you sure you want to revoke this API key? This action cannot be undone."
      confirmText="Revoke"
      confirmLoadingText="Revoking..."
      cancelText="Cancel"
      :loading="revokingKeyId !== null"
      @confirm="confirmRevoke"
      @cancel="keyToRevoke = null"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createApiKey, getApiKeys, revokeApiKey } = useApiKeys()

const showCreateModal = ref(false)
const keyName = ref('')
const duration = ref('1month')
const role = ref('user')
const loading = ref(false)
const createError = ref('')
const createdKey = ref('')
const copied = ref(false)
const apiKeys = ref([])
const loadingKeys = ref(false)
const revokingKeyId = ref(null)
const showRevokeConfirm = ref(false)
const keyToRevoke = ref(null)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(createdKey.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const fetchApiKeys = async () => {
  loadingKeys.value = true
  const result = await getApiKeys()
  if (result.success) {
    // Backend returns { code, msg, data: { results: [...] } }
    apiKeys.value = result.data.data?.results || []
  }
  loadingKeys.value = false
}

const handleCreateKey = async () => {
  loading.value = true
  createError.value = ''
  createdKey.value = ''
  
  const result = await createApiKey(keyName.value, duration.value, role.value)
  
  if (result.success) {
    createdKey.value = result.data.data.key
    await fetchApiKeys() // Refresh the list
  } else {
    createError.value = result.error
  }
  
  loading.value = false
}

const handleRevokeKey = (keyId) => {
  keyToRevoke.value = keyId
  showRevokeConfirm.value = true
}

const confirmRevoke = async () => {
  if (!keyToRevoke.value) return
  
  revokingKeyId.value = keyToRevoke.value
  const result = await revokeApiKey(keyToRevoke.value)
  
  if (result.success) {
    await fetchApiKeys() // Refresh the list
    showRevokeConfirm.value = false
  } else {
    alert(result.error || 'Failed to revoke API key')
  }
  
  revokingKeyId.value = null
  keyToRevoke.value = null
}

const closeCreateModal = () => {
  showCreateModal.value = false
  keyName.value = ''
  duration.value = '1month'
  role.value = 'user'
  createError.value = ''
  createdKey.value = ''
  loading.value = false
  copied.value = false
}

// Fetch API keys on mount
onMounted(() => {
  fetchApiKeys()
})
</script>
