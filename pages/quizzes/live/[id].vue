<template>
    <div class="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-accent"></div>
        </div>

        <div v-else-if="error" class="text-center py-20">
            <p class="text-red-400 mb-4">{{ error }}</p>
            <Button @click="router.push(`/quizzes/${route.params.id}`)">Back to Quiz</Button>
        </div>

        <div v-else-if="quiz">
            <div class="mb-4 md:mb-6 flex items-center gap-3 md:gap-4">
                <BackButton :to="`/quizzes/${route.params.id}`" title="Back to Quiz" />
                <h1 class="text-xl md:text-2xl font-bold text-gh-text">Realtime Participants</h1>
            </div>

            <RealtimeParticipantsPage :quiz="quiz" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import BackButton from '~/components/ui/BackButton.vue'
import RealtimeParticipantsPage from '~/components/quiz/realtime/RealtimeParticipantsPage.vue'

definePageMeta({
    middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const { getQuizById } = useQuizzes()

const quiz = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchQuiz = async () => {
    loading.value = true
    error.value = null

    const result = await getQuizById(route.params.id as string)

    if (result.success) {
        quiz.value = result.data?.data
    } else {
        error.value = result.error
    }

    loading.value = false
}

onMounted(() => {
    fetchQuiz()
})
</script>
