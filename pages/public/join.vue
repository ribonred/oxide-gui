<template>
    <div class="max-w-md mx-auto px-4 py-12">
        <div class="text-center mb-8">
            <div class="inline-block p-4 bg-gh-accent/10 rounded-2xl mb-4">
                <svg class="w-12 h-12 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
            <h1 class="text-3xl font-bold text-gh-text mb-2">Join Quiz</h1>
            <p class="text-gh-text-muted">Enter an access code to join a private quiz</p>
        </div>

        <Card class="p-6 md:p-8 border-2 border-gh-border/50 shadow-xl">
            <form @submit.prevent="handleJoin" class="space-y-6">
                <Input v-model="accessCode" label="Access Code" placeholder="Enter code (e.g. QZ-1234)"
                    :error="error" required class="text-lg" />

                <Button type="submit" :disabled="loading || !accessCode"
                    class="w-full !py-3 text-lg font-semibold bg-gradient-to-r from-gh-accent to-blue-500 hover:from-gh-accent/90 hover:to-blue-600 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                    <span v-if="!loading" class="flex items-center justify-center gap-2">
                        Join Quiz
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </span>
                    <span v-else class="flex items-center justify-center gap-2">
                        <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent">
                        </div>
                        Checking...
                    </span>
                </Button>
            </form>
        </Card>

        <div class="mt-8 text-center">
            <NuxtLink to="/public" class="text-gh-accent hover:text-gh-accent/80 font-medium flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Browse Public Quizzes
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
import Card from '~/components/ui/Card.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'

useSeoMeta({
  title: 'Join Quiz',
  ogTitle: 'Join a Private Quiz on QuizOxide',
  description: 'Enter an access code to join a private quiz on QuizOxide. Challenge yourself with exclusive quizzes shared by quiz creators.',
  ogDescription: 'Enter an access code to join a private quiz on QuizOxide.',
})

const router = useRouter()
const { getSharedQuizDetail } = useQuizzes()

const accessCode = ref('')
const loading = ref(false)
const error = ref('')

const handleJoin = async () => {
    if (!accessCode.value.trim()) return

    loading.value = true
    error.value = ''

    // Check if quiz exists
    const result = await getSharedQuizDetail(accessCode.value.trim())

    if (result.success) {
        // Navigate to shared quiz page
        router.push(`/public/shared/${accessCode.value.trim()}`)
    } else {
        error.value = result.error || 'Invalid access code or quiz not found'
    }

    loading.value = false
}
</script>
