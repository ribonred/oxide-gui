<template>
    <QuizTaker :quiz="quiz" :loading="loading" :error="error" back-path="/public" back-title="Back to Public Quizzes"
        :leaderboard-path="leaderboardPath" :oxide-client="isOxideClient" :url-session-token="validatedSessionToken" />
</template>

<script setup>
import QuizTaker from '~/components/quiz/QuizTaker.vue'

definePageMeta({
    layout: 'quiz-taking'
})

const route = useRoute()
const config = useRuntimeConfig()
const { getPublicQuizById } = useQuizzes()
const { getAttempt } = useAttempts()

const isOxideClient = computed(() => route.query.oxideClient === 'true')

const quiz = ref(null)
const loading = ref(true)
const error = ref(null)

const validatedSessionToken = ref(null)

const leaderboardPath = computed(() => (isOxideClient.value ? null : `/public/leaderboard/${route.params.id}`))

// Fetch quiz data during SSR so og meta tags have real values
const { data: quizData } = await useAsyncData(
    `public-quiz-${route.params.id}`,
    () => getPublicQuizById(route.params.id)
)

useSeoMeta({
    title: () => quizData.value?.data?.data?.title || quiz.value?.title || 'Take Quiz',
    ogTitle: () => {
        const title = quizData.value?.data?.data?.title || quiz.value?.title
        return title ? `${title} - QuizOxide` : 'Take a Quiz on QuizOxide'
    },
    description: () => quizData.value?.data?.data?.description || quiz.value?.description || 'Take this quiz on QuizOxide - the reliable quiz platform built with Rust.',
    ogDescription: () => quizData.value?.data?.data?.description || quiz.value?.description || 'Take this quiz on QuizOxide.',
    ogUrl: `${config.public.siteUrl}/public/${route.params.id}`,
    ogImage: `${config.public.siteUrl}/api/og/quiz/${route.params.id}`,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/png',
    ogImageAlt: () => {
        const title = quizData.value?.data?.data?.title || quiz.value?.title
        return title ? `${title} - QuizOxide` : 'QuizOxide'
    },
    twitterCard: 'summary_large_image',
    twitterImage: `${config.public.siteUrl}/api/og/quiz/${route.params.id}`,
})

const normalizeQueryToken = (value) => {
    if (!value) return null
    if (Array.isArray(value)) return value[0] || null
    return String(value)
}

const validateSessionToken = async () => {
    const token = normalizeQueryToken(route.query.session_token)
    if (!token) return { ok: true, token: null }

    const quizId = Number(route.params.id)
    if (!Number.isFinite(quizId)) {
        return { ok: false, error: 'Invalid quiz id' }
    }

    const result = await getAttempt(token)
    if (!result.success) {
        return { ok: false, error: result.error || 'Invalid session token' }
    }

    // In-progress attempt is resumable (QuizTaker expects AT-003)
    if (result.code === 'AT-099') {
        return { ok: false, error: 'This session token was already submitted.' }
    }

    if (result.code && result.code !== 'AT-003') {
        return { ok: false, error: result.message || 'This session token is not resumable.' }
    }

    if (result.data.quiz_id !== quizId) {
        return { ok: false, error: 'This session token is for a different quiz.' }
    }

    return { ok: true, token }
}

// Fetch quiz details
const fetchQuiz = async () => {
    loading.value = true
    error.value = null

    const result = await getPublicQuizById(route.params.id)

    if (result.success) {
        const quizData = result.data.data

        // If a session token was validated from the URL, store it as the cookie
        // QuizTaker will auto-restore from this cookie when `quiz` prop is set.
        // Skip URL cleanup for oxideClient (mobile WebView) to avoid re-navigation issues
        const isOxideClient = route.query.oxideClient === 'true'
        if (validatedSessionToken.value && !isOxideClient) {
            const cookieName = `quiz_session_${route.params.id}`
            const expirationSeconds = (quizData.time_limit_seconds || 3600) + 5
            const cookie = useCookie(cookieName, {
                maxAge: expirationSeconds,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            })
            cookie.value = validatedSessionToken.value

            // Remove token from URL for privacy/cleanliness
            const nextQuery = { ...route.query }
            delete nextQuery.session_token
            await navigateTo({ query: nextQuery }, { replace: true })
        }

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
    loading.value = true
    error.value = null

    const validation = await validateSessionToken()
    if (!validation.ok) {
        error.value = validation.error
        loading.value = false
        return
    }

    validatedSessionToken.value = validation.token
    await fetchQuiz()
})
</script>
