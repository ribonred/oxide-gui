<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-gh-bg-secondary p-8 rounded-lg border border-gh-border">
      <h2 class="text-3xl font-bold text-gh-text mb-6 text-center">Sign In</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gh-text mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
          />
        </div>
        
        <div>
          <label class="block text-gh-text mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent"
          />
        </div>
        
        <div v-if="error" class="text-gh-danger text-sm">{{ error }}</div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gh-accent hover:bg-gh-accent-hover text-white py-2 rounded-md font-medium disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <p class="mt-4 text-center text-gh-text-secondary">
        Don't have an account?
        <NuxtLink to="/register" class="text-gh-accent hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await login(email.value, password.value)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}
</script>
