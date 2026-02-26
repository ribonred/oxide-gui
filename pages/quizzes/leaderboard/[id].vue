<template>
    <div class="max-w-[1400px] mx-auto px-4 py-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="relative">
                <div class="animate-spin rounded-full h-16 w-16 border-4 border-gh-accent border-t-transparent"></div>
                <div class="absolute inset-0 rounded-full h-16 w-16 border-4 border-gh-accent/20"></div>
            </div>
            <p class="mt-4 text-gh-text-muted animate-pulse">Loading leaderboard...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="text-center py-20">
            <Alert variant="error" class="mb-4">{{ loadError }}</Alert>
            <Button @click="router.push('/quizzes')">
                Back to Quizzes
            </Button>
        </div>

        <!-- Main Content -->
        <div v-else-if="quiz">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div class="flex items-center gap-3">
                        <BackButton :to="`/quizzes/${quiz.id}`" title="Back to Quiz Details" />
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold text-gh-text">Leaderboard</h1>
                            <p class="text-gh-text-muted mt-1">{{ quiz.title }}</p>
                        </div>
                    </div>
                </div>

                <!-- Quiz Info Cards -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-gh-card border border-gh-border rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-gh-accent/10 rounded-lg">
                                <svg class="w-5 h-5 text-gh-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gh-text-muted uppercase tracking-wide">Questions</p>
                                <p class="text-xl font-bold text-gh-text">{{ quiz.question_count }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gh-card border border-gh-border rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-blue-500/10 rounded-lg">
                                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gh-text-muted uppercase tracking-wide">Time Limit</p>
                                <p class="text-xl font-bold text-gh-text">{{ formatTime(quiz.time_limit_seconds) }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gh-card border border-gh-border rounded-xl p-4">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-green-500/10 rounded-lg">
                                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-xs text-gh-text-muted uppercase tracking-wide">Status</p>
                                <p class="text-xl font-bold text-gh-text capitalize">{{ quiz.status }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Leaderboard Component -->
            <QuizLeaderboard :quiz-id="quiz.id" :max-score="maxScore" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Alert from '~/components/ui/Alert.vue'
import BackButton from '~/components/ui/BackButton.vue'
import QuizLeaderboard from '~/components/quiz/QuizLeaderboard.vue'

const router = useRouter()
const route = useRoute()
const { getQuizById } = useQuizzes()

const quiz = ref(null)
const loading = ref(true)
const loadError = ref(null)

const maxScore = computed(() => {
    if (!quiz.value) return 100
    return quiz.value.question_count * 10 // Assuming 10 points per question
})

const formatTime = (seconds) => {
    if (!seconds) return 'No limit'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`
    }
    return `${secs}s`
}

const loadQuiz = async () => {
    loading.value = true
    loadError.value = null
    
    try {
        const result = await getQuizById(route.params.id)
        if (result.success) {
            quiz.value = result.data.data
        } else {
            loadError.value = result.error || 'Failed to load quiz'
        }
    } catch (err) {
        loadError.value = err.message || 'An error occurred'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    loadQuiz()
})
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
