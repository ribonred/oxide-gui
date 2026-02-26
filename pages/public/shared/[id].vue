<template>
    <QuizTaker :quiz="quiz" :loading="loading" :error="error" :access-code="route.params.id" back-path="/public/join"
        back-title="Back to Join Quiz" />
</template>

<script setup>
import QuizTaker from '~/components/quiz/QuizTaker.vue'

definePageMeta({
    layout: 'quiz-taking'
})

const route = useRoute()
const config = useRuntimeConfig()
const { getSharedQuizDetail } = useQuizzes()

const quiz = ref(null)
const loading = ref(true)
const error = ref(null)

// Fetch quiz data during SSR so og meta tags have real values
const { data: quizData } = await useAsyncData(
    `shared-quiz-${route.params.id}`,
    () => getSharedQuizDetail(route.params.id)
)

useSeoMeta({
    title: () => quizData.value?.data?.data?.title || quiz.value?.title || 'Shared Quiz',
    ogTitle: () => {
        const title = quizData.value?.data?.data?.title || quiz.value?.title
        return title ? `${title} - QuizOxide` : 'Shared Quiz on QuizOxide'
    },
    description: () => quizData.value?.data?.data?.description || quiz.value?.description || 'Take this shared quiz on QuizOxide.',
    ogDescription: () => quizData.value?.data?.data?.description || quiz.value?.description || 'Take this shared quiz on QuizOxide.',
    ogUrl: `${config.public.siteUrl}/public/shared/${route.params.id}`,
    ogImage: `${config.public.siteUrl}/api/og/shared/${route.params.id}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogImageAlt: () => {
        const title = quizData.value?.data?.data?.title || quiz.value?.title
        return title ? `${title} - QuizOxide` : 'QuizOxide'
    },
    twitterCard: 'summary_large_image',
    twitterImage: `${config.public.siteUrl}/api/og/shared/${route.params.id}`,
})

// Fetch quiz details
const fetchQuiz = async () => {
    loading.value = true
    error.value = null

    const result = await getSharedQuizDetail(route.params.id)

    if (result.success) {
        const quizData = result.data.data
        quiz.value = {
            id: quizData.id,
            title: quizData.title,
            description: quizData.description,
            question_count: quizData.question_count,
            time_limit_seconds: quizData.time_limit_seconds,
            max_attempts: quizData.max_attempts,
            shuffle_questions: quizData.shuffle_questions,
            access_code: quizData.access_code,
            questions: quizData.questions || []
        }
    } else {
        error.value = result.error
    }

    loading.value = false
}

// Fetch quiz on mount
onMounted(async () => {
    await fetchQuiz()
})
</script>
