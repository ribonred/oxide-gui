<template>
    <div class="min-h-screen flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-gh-bg-secondary p-8 rounded-lg border border-gh-border">
            <h2 class="text-3xl font-bold text-gh-text mb-6 text-center">Create Account</h2>
    
            <form @submit.prevent="handleRegister" class="space-y-4">
    
                <div>
                    <label class="block text-gh-text mb-2">Email</label>
                    <input v-model="email" type="email" required class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" />
                </div>
    
                <div>
                    <label class="block text-gh-text mb-2">Password</label>
                    <input v-model="password" type="password" required class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" />
    
                    <!-- Password strength indicator -->
                    <div v-if="password" class="mt-2 space-y-1">
                        <div class="flex items-center gap-2">
                            <div class="flex-1 h-1 bg-gh-border rounded-full overflow-hidden">
                                <div class="h-full transition-all duration-300" :class="passwordStrengthColor" :style="{ width: passwordStrengthWidth }"></div>
                            </div>
                            <span class="text-xs" :class="passwordStrengthTextColor">
                        {{ passwordStrengthText }}
                      </span>
                        </div>
    
                        <!-- Password requirements -->
                        <div class="text-xs space-y-1 mt-2">
                            <div class="flex items-center gap-2" :class="hasMinLength ? 'text-gh-success' : 'text-gh-text-secondary'">
                                <span>{{ hasMinLength ? '✓' : '○' }}</span>
                                <span>At least 8 characters</span>
                            </div>
                            <div class="flex items-center gap-2" :class="hasUpperCase ? 'text-gh-success' : 'text-gh-text-secondary'">
                                <span>{{ hasUpperCase ? '✓' : '○' }}</span>
                                <span>One uppercase letter</span>
                            </div>
                            <div class="flex items-center gap-2" :class="hasLowerCase ? 'text-gh-success' : 'text-gh-text-secondary'">
                                <span>{{ hasLowerCase ? '✓' : '○' }}</span>
                                <span>One lowercase letter</span>
                            </div>
                            <div class="flex items-center gap-2" :class="hasNumber ? 'text-gh-success' : 'text-gh-text-secondary'">
                                <span>{{ hasNumber ? '✓' : '○' }}</span>
                                <span>One number</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-gh-text mb-2">Confirm Password</label>
                    <input v-model="confirmPassword" type="password" required class="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-accent" :class="confirmPassword && !passwordsMatch ? 'ring-2 ring-gh-danger' : ''" />
                    
                    <!-- Password match indicator -->
                    <div v-if="confirmPassword" class="mt-2">
                        <div class="flex items-center gap-2 text-xs" :class="passwordsMatch ? 'text-gh-success' : 'text-gh-danger'">
                            <span>{{ passwordsMatch ? '✓' : '✗' }}</span>
                            <span>{{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}</span>
                        </div>
                    </div>
                </div>
    
                <div v-if="error" class="text-gh-danger text-sm">{{ error }}</div>
    
                <button type="submit" :disabled="loading" class="w-full bg-gh-accent hover:bg-gh-accent-hover text-white py-2 rounded-md font-medium disabled:opacity-50">
                  {{ loading ? 'Creating account...' : 'Sign Up' }}
                </button>
            </form>
    
            <p class="mt-4 text-center text-gh-text-secondary">
                Already have an account?
                <NuxtLink to="/login" class="text-gh-accent hover:underline">Sign in</NuxtLink>
            </p>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default'
})

const { register } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

// Password validation computed properties
const hasMinLength = computed(() => password.value.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(password.value))
const hasLowerCase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))

const passwordStrength = computed(() => {
    let strength = 0
    if (hasMinLength.value) strength++
        if (hasUpperCase.value) strength++
            if (hasLowerCase.value) strength++
                if (hasNumber.value) strength++
                    return strength
})

const passwordStrengthWidth = computed(() => {
    return `${(passwordStrength.value / 4) * 100}%`
})

const passwordStrengthColor = computed(() => {
    if (passwordStrength.value <= 1) return 'bg-gh-danger'
    if (passwordStrength.value === 2) return 'bg-yellow-500'
    if (passwordStrength.value === 3) return 'bg-blue-500'
    return 'bg-gh-success'
})

const passwordStrengthTextColor = computed(() => {
    if (passwordStrength.value <= 1) return 'text-gh-danger'
    if (passwordStrength.value === 2) return 'text-yellow-500'
    if (passwordStrength.value === 3) return 'text-blue-500'
    return 'text-gh-success'
})

const passwordStrengthText = computed(() => {
    if (passwordStrength.value <= 1) return 'Weak'
    if (passwordStrength.value === 2) return 'Fair'
    if (passwordStrength.value === 3) return 'Good'
    return 'Strong'
})

const isPasswordValid = computed(() => {
    return hasMinLength.value && hasUpperCase.value && hasLowerCase.value && hasNumber.value
})

const passwordsMatch = computed(() => {
    return password.value === confirmPassword.value
})

const handleRegister = async () => {
    if (!isPasswordValid.value) {
        error.value = 'Please meet all password requirements'
        return
    }

    if (!passwordsMatch.value) {
        error.value = 'Passwords do not match'
        return
    }

    loading.value = true
    error.value = ''

    const result = await register(email.value, password.value)

    if (result.success) {
        router.push('/login')
    } else {
        error.value = result.error
    }

    loading.value = false
}
</script>
