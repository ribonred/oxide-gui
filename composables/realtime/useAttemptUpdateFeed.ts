import type { AttemptUpdateFeedPayload } from '~/composables/realtime/types'
import type { WsEventType } from '~/composables/useWebSocket'

export interface AttemptUpdateFeedItem extends AttemptUpdateFeedPayload {
    _received_at: number
}

export const useAttemptUpdateFeed = (quizId: string) => {
    const { subscribe, unsubscribe, isConnected } = useWebSocket()

    const items = shallowRef<AttemptUpdateFeedItem[]>([])

    const maxItems = 200
    const pending: AttemptUpdateFeedItem[] = []
    let scheduled = false

    const flush = () => {
        scheduled = false
        if (pending.length === 0) return

        const next = items.value.slice()
        // append oldest -> newest; render can show reversed if desired
        next.push(...pending.splice(0, pending.length))

        if (next.length > maxItems) {
            items.value = next.slice(next.length - maxItems)
        } else {
            items.value = next
        }
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

    const handle = (data: AttemptUpdateFeedPayload | AttemptUpdateFeedPayload[], eventType?: WsEventType) => {
        if (eventType !== 'attempt_update') return
        if (!data) return

        const events = Array.isArray(data) ? data : [data]
        for (const ev of events) {
            if (!ev) continue
            if (String(ev.quiz_id) !== String(quizId)) continue

            pending.push({
                ...ev,
                _received_at: Date.now()
            })
        }

        scheduleFlush()
    }

    onMounted(() => {
        subscribe('quiz', quizId, handle)
    })

    onUnmounted(() => {
        unsubscribe('quiz', quizId, handle)
    })

    return {
        items,
        isConnected,
    }
}
