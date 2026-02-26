<template>
    <QuizTaker :quiz="quiz" :loading="loading" :error="errorMessage" :back-path="backPath"
        :back-title="backTitle" :member-mode="isMemberMode" :member-api-key="apiKey" :member-participant-id="participantId"
    :oxide-client="isOxideClient" :url-session-token="validatedSessionToken ?? undefined" />
</template>

<script setup lang="ts">
import QuizTaker from '~/components/quiz/QuizTaker.vue'
import { useMemberAccess } from '~/composables/useMemberAccess'
import { useMemberClient } from '~/composables/useMemberClient'

definePageMeta({
    layout: 'quiz-taking'
})

const route = useRoute()
const router = useRouter()

const { apiKey, participantId, loadFromSession, applyQueryParams, storeToSession, clearSession } = useMemberAccess()
const { getMemberQuizzes, getMemberQuizById } = useMemberClient()
const { getAttempt } = useAttempts()

const quiz = ref<any | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const errorMessage = computed(() => error.value || '')

const isOxideClient = computed(() => route.query.oxideClient === 'true')
const isMemberMode = computed(() => !!apiKey.value && !!participantId.value)
const validatedSessionToken = ref<string | null>(null)

type SessionTokenValidation =
    | { ok: true; token: string | null }
    | { ok: false; error: string }

const backPath = computed(() => '/member')
const backTitle = computed(() => 'Back to Member Quizzes')

const normalizeQueryToken = (value: unknown): string | null => {
    if (!value) return null
    if (Array.isArray(value)) return value[0] ? String(value[0]) : null
    return String(value)
}

const validateSessionToken = async (): Promise<SessionTokenValidation> => {
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

    if ((result.data as any).quiz_id !== quizId) {
        return { ok: false, error: 'This session token is for a different quiz.' }
    }

    return { ok: true, token }
}

const buildCleanQuery = (options?: { removeSessionToken?: boolean }) => {
    const nextQuery: Record<string, any> = { ...route.query }

    delete nextQuery.api_key
    delete nextQuery.apiKey
    delete nextQuery.participant_id
    delete nextQuery.participantId

    if (options?.removeSessionToken) {
        delete nextQuery.session_token
    }

    return nextQuery
}

const isUnauthorized = (result: { statusCode?: number; code?: string }) => {
    return result.statusCode === 401 || result.code?.startsWith('AUTH')
}

const goToError = (message: string, code?: string) => {
    router.push({
        path: '/member/error',
        query: {
            message,
            code: code || undefined
        }
    })
}

const ensureAccess = async () => {
    loadFromSession()
    const applied = applyQueryParams(route.query)

    // Member quiz details are fetched via member endpoint which requires apiKey.
    // For resume flow (session_token), participantId is optional.
    if (!apiKey.value) {
        goToError('Member API key is missing.')
        return false
    }

    if (!participantId.value && !validatedSessionToken.value) {
        goToError('Member participant id is missing.')
        return false
    }

    const validation = await getMemberQuizzes(apiKey.value, { page: 1, per_page: 1 })

    if (!validation.success) {
        if (isUnauthorized(validation)) {
            clearSession()
            goToError(validation.error || 'Unauthorized access', validation.code)
        } else {
            goToError(validation.error || 'Unable to validate member access')
        }
        return false
    }

    if (apiKey.value && participantId.value) {
        storeToSession(apiKey.value, participantId.value)
    }

    if (applied && !isOxideClient.value) {
        router.replace({ path: `/member/${route.params.id}`, query: buildCleanQuery({ removeSessionToken: false }) })
    }

    return true
}

const fetchQuiz = async () => {
    loading.value = true
    error.value = null

    const tokenValidation = await validateSessionToken()
    if (!tokenValidation.ok) {
        error.value = tokenValidation.error
        loading.value = false
        return
    }
    validatedSessionToken.value = tokenValidation.token

    const hasAccess = await ensureAccess()
    if (!hasAccess) {
        loading.value = false
        return
    }

    const result = await getMemberQuizById(apiKey.value, route.params.id as string)

    if (result.success) {
        const quizData = (result as any).data.data

        // If a session token was validated from the URL, store it as the cookie.
        // Skip URL cleanup for oxideClient (mobile WebView) to avoid re-navigation issues.
        if (validatedSessionToken.value && !isOxideClient.value) {
            const cookieName = `quiz_session_${route.params.id}`
            const expirationSeconds = (quizData.time_limit_seconds || 3600) + 5
            const cookie = useCookie(cookieName, {
                maxAge: expirationSeconds,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            })
            cookie.value = validatedSessionToken.value

            await navigateTo({ path: route.path, query: buildCleanQuery({ removeSessionToken: true }) }, { replace: true })
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
    } else if (isUnauthorized(result)) {
        clearSession()
        goToError((result as any).error || 'Unauthorized access', (result as any).code)
    } else {
        error.value = (result as any).error || 'Failed to fetch quiz'
    }

    loading.value = false
}

onMounted(async () => {
    await fetchQuiz()
})
</script>
