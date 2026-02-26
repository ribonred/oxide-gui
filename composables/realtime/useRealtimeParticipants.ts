import type { ApiResponse } from '~/types/api'
import type { RealtimeParticipant } from '~/composables/realtime/types'
import type { AttemptEventPayload, WsEventType } from '~/composables/useWebSocket'

interface ParticipantsStatsResponse {
    current: number
    finished: number
    participants: RealtimeParticipant[]
    total: number
}

export const useRealtimeParticipants = (quizId: string) => {
    const config = useRuntimeConfig()
    const { authFetch } = useAuth()
    const { subscribe, unsubscribe, isConnected } = useWebSocket()

    const participants = shallowRef<RealtimeParticipant[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const participantMap = new Map<string, RealtimeParticipant>()
    let scheduled = false
    const pendingAdd = new Map<string, RealtimeParticipant>()
    const pendingRemove = new Set<string>()

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

    const fetchInitial = async () => {
        isLoading.value = true
        error.value = null

        try {
            const response = await authFetch<ApiResponse<ParticipantsStatsResponse>>(
                `${config.public.apiUrl}/api/v1/info/quizezz/participant/${quizId}`
            )

            if (response && response.code === 'QI-000' && response.data) {
                participantMap.clear()
                for (const p of response.data.participants || []) {
                    participantMap.set(p.id, p)
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

    const handleAttemptEvent = (data: AttemptEventPayload | AttemptEventPayload[], eventType?: WsEventType) => {
        if (!data) return

        const events = Array.isArray(data) ? data : [data]
        for (const ev of events) {
            if (!ev) continue
            if (String(ev.quiz_id) !== String(quizId)) continue

            if (eventType === 'attempt_quiz') {
                if (!participantMap.has(ev.participant_id) && !pendingAdd.has(ev.participant_id)) {
                    pendingAdd.set(ev.participant_id, {
                        id: ev.participant_id,
                        alias: ev.alias,
                        attempt_id: ev.attempt_id
                    })
                }
            }

            if (eventType === 'attempt_finished') {
                pendingRemove.add(ev.participant_id)
            }
        }

        scheduleFlush()
    }

    onMounted(() => {
        fetchInitial()
        subscribe('quiz', quizId, handleAttemptEvent)
    })

    onUnmounted(() => {
        unsubscribe('quiz', quizId, handleAttemptEvent)
    })

    return {
        participants,
        isConnected,
        isLoading,
        error,
        fetchInitial
    }
}
