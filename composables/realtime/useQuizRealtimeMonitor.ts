import type { ApiResponse } from '~/types/api'
import type { AttemptEventPayload, WsEventType } from '~/composables/useWebSocket'
import type { AttemptUpdateFeedPayload, RealtimeParticipant } from '~/composables/realtime/types'

interface ParticipantsStatsResponse {
    current: number
    finished: number
    participants: RealtimeParticipant[]
    total: number
}

export interface QuizRealtimeMonitorState {
    participants: RealtimeParticipant[]
    feed: (AttemptUpdateFeedPayload & { _received_at: number })[]
}

export const useQuizRealtimeMonitor = (quizId: string) => {
    const config = useRuntimeConfig()
    const { authFetch } = useAuth()
    const { subscribe, unsubscribe, isConnected } = useWebSocket()

    const participants = shallowRef<RealtimeParticipant[]>([])
    const feed = shallowRef<(AttemptUpdateFeedPayload & { _received_at: number })[]>([])
    const finishedParticipants = shallowRef<Set<string>>(new Set())

    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const participantMap = new Map<string, RealtimeParticipant>()

    const maxFeedItems = 200
    const pendingFeed: (AttemptUpdateFeedPayload & { _received_at: number })[] = []

    const pendingAdd = new Map<string, RealtimeParticipant>()
    const pendingRemove = new Set<string>()

    let scheduled = false

    const flush = () => {
        scheduled = false

        if (pendingRemove.size > 0) {
            for (const id of pendingRemove) {
                participantMap.delete(id)
                pendingAdd.delete(id)
            }
            pendingRemove.clear()
        }

        if (pendingAdd.size > 0) {
            for (const [id, p] of pendingAdd) {
                participantMap.set(id, p)
            }
            pendingAdd.clear()
        }

        if (pendingFeed.length > 0) {
            const next = feed.value.slice()
            next.push(...pendingFeed.splice(0, pendingFeed.length))
            feed.value = next.length > maxFeedItems ? next.slice(next.length - maxFeedItems) : next
        }

        participants.value = Array.from(participantMap.values())
    }

    const scheduleFlush = () => {
        if (scheduled) return
        scheduled = true
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(flush)
        } else {
            setTimeout(flush, 16)
        }
    }

    const fetchInitialParticipants = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await authFetch<ApiResponse<ParticipantsStatsResponse>>(
                `${config.public.apiUrl}/api/v1/info/quizezz/participant/${quizId}`
            )

            if (response && response.code === 'QI-000' && response.data) {
                participantMap.clear()
                for (const p of response.data.participants || []) {
                    participantMap.set(String(p.id), p)
                }
                participants.value = Array.from(participantMap.values())
            }
        } catch (err: any) {
            console.error('Error fetching participants:', err)
            error.value = err?.data?.message || err?.message || 'Failed to fetch participants'
        } finally {
            isLoading.value = false
        }
    }

    const handle = (payload: any, eventType?: WsEventType) => {
        if (!payload) return

        if (eventType === 'attempt_quiz' || eventType === 'attempt_finished') {
            const events: AttemptEventPayload[] = Array.isArray(payload) ? payload : [payload]

            for (const ev of events) {
                if (!ev) continue
                if (String(ev.quiz_id) !== String(quizId)) continue

                if (eventType === 'attempt_quiz') {
                    const id = String(ev.participant_id)
                    if (!participantMap.has(id) && !pendingAdd.has(id)) {
                        pendingAdd.set(id, {
                            id,
                            alias: ev.alias,
                            attempt_id: ev.attempt_id
                        })
                    }

                    // Participant (re)joined; clear finished marker.
                    if (finishedParticipants.value.has(id)) {
                        const nextFinished = new Set(finishedParticipants.value)
                        nextFinished.delete(id)
                        finishedParticipants.value = nextFinished
                    }
                }

                if (eventType === 'attempt_finished') {
                    const id = String(ev.participant_id)
                    pendingRemove.add(id)

                    // Keep a persistent finished marker for the UI.
                    if (!finishedParticipants.value.has(id)) {
                        const nextFinished = new Set(finishedParticipants.value)
                        nextFinished.add(id)
                        finishedParticipants.value = nextFinished
                    }
                }
            }

            scheduleFlush()
            return
        }

        if (eventType === 'attempt_update') {
            const events: AttemptUpdateFeedPayload[] = Array.isArray(payload) ? payload : [payload]

            for (const ev of events) {
                if (!ev) continue
                if (String(ev.quiz_id) !== String(quizId)) continue

                pendingFeed.push({
                    ...ev,
                    _received_at: Date.now()
                })
            }

            scheduleFlush()
        }
    }

    onMounted(() => {
        fetchInitialParticipants()
        subscribe('quiz', quizId, handle)
    })

    onUnmounted(() => {
        unsubscribe('quiz', quizId, handle)
    })

    return {
        participants,
        feed,
        finishedParticipants,
        isConnected,
        isLoading,
        error,
        fetchInitialParticipants
    }
}
