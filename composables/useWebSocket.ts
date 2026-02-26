// WebSocket Event Types (matches backend WsEventType)
export type WsEventType = 'attempt_quiz' | 'attempt_update' | 'attempt_finished'

// WebSocket message from server
export interface WsMessage<T = any> {
    event: 'update' | 'subscribed' | 'unsubscribed' | 'snapshot' | 'error'
    t?: WsEventType
    channel?: string
    subscriptions?: string[]
    data?: T
    snapshot?: T[]
    error?: string
}

// Attempt event payload
export interface AttemptEventPayload {
    quiz_id: number
    attempt_id: string
    participant_id: string
    alias: string
}

// Global singleton state (shared across all useWebSocket() calls in same tab)
let socket: WebSocket | null = null
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_BASE_DELAY = 1000

// Reactive state
const isConnected = ref(false)
const isConnecting = ref(false)

// Listeners: Map<"channel:id", Set<callback>>
const listeners = new Map<string, Set<(data: any, eventType?: WsEventType) => void>>()

// Track active subscriptions for reconnect
const activeSubscriptions = new Set<string>()

type QueuedDispatch = {
    channel: string
    payload: any
    t?: WsEventType
}

const dispatchQueue: QueuedDispatch[] = []
let dispatchScheduled = false
const MAX_DISPATCH_PER_FRAME = 250

const scheduleDispatchFlush = () => {
    if (dispatchScheduled) return
    dispatchScheduled = true

    const schedule = typeof requestAnimationFrame !== 'undefined'
        ? requestAnimationFrame
        : (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now() as any), 16) as any

    schedule(() => {
        dispatchScheduled = false

        let processed = 0
        while (dispatchQueue.length > 0 && processed < MAX_DISPATCH_PER_FRAME) {
            const next = dispatchQueue.shift()!
            processed++

            listeners.forEach((callbacks, key) => {
                if (key.startsWith(`${next.channel}:`)) {
                    callbacks.forEach(cb => cb(next.payload, next.t))
                }
            })
        }

        if (dispatchQueue.length > 0) {
            scheduleDispatchFlush()
        }
    })
}

export const useWebSocket = () => {
    const config = useRuntimeConfig()

    const getWsUrl = () => {
        const apiUrl = config.public.apiUrl as string
        // Convert http(s) to ws(s)
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws'
        const host = apiUrl.replace(/^https?:\/\//, '')
        return `${wsProtocol}://${host}/ws`
    }

    const connect = () => {
        // Idempotent: skip if already connected or connecting
        if (socket?.readyState === WebSocket.OPEN ||
            socket?.readyState === WebSocket.CONNECTING) {
            console.log('[WS] Already connected or connecting, skipping')
            return
        }

        // Clear any pending reconnect
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout)
            reconnectTimeout = null
        }

        isConnecting.value = true
        const url = getWsUrl()
        console.log('[WS] Connecting to:', url)

        try {
            socket = new WebSocket(url)

            socket.onopen = () => {
                console.log('[WS] Connected')
                isConnected.value = true
                isConnecting.value = false
                reconnectAttempts = 0

                // Resubscribe to existing subscriptions on reconnect
                if (activeSubscriptions.size > 0) {
                    const subscriptions = Array.from(activeSubscriptions)
                    console.log('[WS] Resubscribing to:', subscriptions)
                    send({ action: 'subscribe', subscriptions })
                }
            }

            socket.onmessage = (event) => {
                try {
                    const msg: WsMessage = JSON.parse(event.data)
                    handleMessage(msg)
                } catch (err) {
                    console.error('[WS] Failed to parse message:', err)
                }
            }

            socket.onclose = (event) => {
                console.log('[WS] Disconnected:', event.code, event.reason)
                isConnected.value = false
                isConnecting.value = false
                socket = null

                // Attempt reconnect if not a clean close and we have subscriptions
                if (event.code !== 1000 && activeSubscriptions.size > 0) {
                    scheduleReconnect()
                }
            }

            socket.onerror = (error) => {
                console.error('[WS] Error:', error)
                isConnecting.value = false
            }
        } catch (err) {
            console.error('[WS] Connection failed:', err)
            isConnecting.value = false
            scheduleReconnect()
        }
    }

    const disconnect = () => {
        // Idempotent: skip if already closed
        if (!socket && !reconnectTimeout) {
            console.log('[WS] Already disconnected, skipping')
            return
        }

        // Clear any pending reconnect
        if (reconnectTimeout) {
            clearTimeout(reconnectTimeout)
            reconnectTimeout = null
        }
        reconnectAttempts = 0

        if (socket) {
            console.log('[WS] Disconnecting')
            socket.close(1000, 'Client disconnect')
            socket = null
        }

        isConnected.value = false
        isConnecting.value = false

        // Clear subscriptions on explicit disconnect
        activeSubscriptions.clear()
        listeners.clear()
    }

    const scheduleReconnect = () => {
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.error('[WS] Max reconnect attempts reached')
            return
        }

        const delay = RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttempts)
        console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`)

        reconnectTimeout = setTimeout(() => {
            reconnectAttempts++
            connect()
        }, delay)
    }

    const send = (msg: any) => {
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(msg))
        } else {
            console.warn('[WS] Cannot send, socket not open')
        }
    }

    const handleMessage = (msg: WsMessage) => {
        // Handle subscription confirmations
        if (msg.event === 'subscribed') {
            console.log('[WS] Subscribed:', msg.subscriptions)
            return
        }

        if (msg.event === 'unsubscribed') {
            console.log('[WS] Unsubscribed:', msg.subscriptions)
            return
        }

        // Handle errors
        if (msg.event === 'error') {
            console.error('[WS] Server error:', msg.error)
            return
        }

        // Handle data updates - dispatch to listeners
        // Backend sends: { event: "update", channel: "attempts", t: "attempt_quiz", data: {...} }
        if (msg.event === 'update' || msg.event === 'snapshot') {
            const payload = msg.data || msg.snapshot

            // If we have channel info, try to match listeners
            if (msg.channel) {
                dispatchQueue.push({
                    channel: msg.channel,
                    payload,
                    t: msg.t
                })
                scheduleDispatchFlush()
            }
        }
    }

    const subscribe = (channel: string, id: string, callback: (data: any, eventType?: WsEventType) => void) => {
        const key = `${channel}:${id}`

        // Add to listeners
        if (!listeners.has(key)) {
            listeners.set(key, new Set())
        }
        listeners.get(key)!.add(callback)

        // Track active subscription
        if (!activeSubscriptions.has(key)) {
            activeSubscriptions.add(key)

            // Send subscribe message if connected
            if (socket?.readyState === WebSocket.OPEN) {
                send({ action: 'subscribe', subscriptions: [key] })
            }
        }

        // Ensure connection exists
        if (!socket || socket.readyState === WebSocket.CLOSED) {
            connect()
        }
    }

    const unsubscribe = (channel: string, id: string, callback: (data: any, eventType?: WsEventType) => void) => {
        const key = `${channel}:${id}`
        const callbacks = listeners.get(key)

        if (callbacks) {
            callbacks.delete(callback)

            // If no more listeners for this key, unsubscribe from server
            if (callbacks.size === 0) {
                listeners.delete(key)
                activeSubscriptions.delete(key)

                if (socket?.readyState === WebSocket.OPEN) {
                    send({ action: 'unsubscribe', subscriptions: [key] })
                }
            }
        }
    }

    return {
        isConnected: readonly(isConnected),
        isConnecting: readonly(isConnecting),
        connect,
        disconnect,
        subscribe,
        unsubscribe
    }
}
