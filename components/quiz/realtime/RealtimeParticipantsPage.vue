<template>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Participants -->
        <Card class="lg:col-span-3 pane-card">
            <div class="pane-card__inner">
                <div class="pane-header">
                    <div class="flex items-center gap-2">
                        <div class="status-indicator" :class="{ 'is-disconnected': !isConnected }"></div>
                        <div class="min-w-0">
                            <div class="text-sm font-semibold text-gh-text">Participants</div>
                            <div class="text-xs text-gh-text-muted truncate">Live updates</div>
                        </div>
                    </div>

                    <div class="participant-count" title="Active participants">
                        {{ participants.length }}
                    </div>
                </div>

                <div class="pane-card__content">
                    <div v-if="participantsError" class="text-sm text-red-400 mb-3">
                        {{ participantsError }}
                    </div>

                    <div class="participants-list">
                        <TransitionGroup name="participant" tag="div" class="participants-inner">
                            <div v-for="p in participants" :key="p.id" class="participant-item cursor-pointer"
                                @click="toggleExpanded(p.id)">
                                <div class="participant-avatar">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>

                                <div class="participant-info">
                                    <div class="flex items-center justify-between gap-2">
                                        <div class="participant-name">{{ p.alias || 'Anonymous' }}</div>
                                        <div class="flex items-center gap-2">
                                            <div class="status-dot"></div>
                                            <svg class="w-3 h-3 text-gh-text-muted transition-transform duration-200"
                                                :class="{ 'rotate-180': expanded.has(p.id) }" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div class="participant-ids-wrapper" :class="{ 'is-expanded': expanded.has(p.id) }">
                                        <div class="participant-ids">
                                            <div class="id-row">
                                                <span class="id-label">ID</span>
                                                <span class="id-value">{{ p.id }}</span>
                                            </div>
                                            <div class="id-row" v-if="p.attempt_id">
                                                <span class="id-label">ATT</span>
                                                <span class="id-value">{{ p.attempt_id }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>

                        <div v-if="participants.length === 0" class="empty-state">
                            <p class="text-sm text-gh-text-muted">No active participants</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>

        <!-- Right: Live Progress -->
        <Card class="lg:col-span-9 pane-card">
            <div class="pane-card__inner">
                <div class="pane-header">
                    <div class="min-w-0">
                        <div class="text-sm font-semibold text-gh-text">Live Progress</div>
                        <div class="text-xs text-gh-text-muted truncate">Per-participant answers</div>
                    </div>

                    <div class="text-xs text-gh-text-muted">
                        {{ participantCards.length }}
                    </div>
                </div>

                <div class="pane-card__content">
                    <div class="progress-list">
                        <div v-for="p in participantCards" :key="p.id" class="progress-card">
                            <div class="progress-top">
                                <div class="min-w-0">
                                    <div class="progress-alias">{{ p.alias || 'Anonymous' }}</div>
                                    <div class="progress-sub text-xs text-gh-text-muted">
                                        Updated: {{ formatTime(p.last_answered_at) }}
                                    </div>
                                </div>

                                <div class="progress-right">
                                    <div v-if="p.isFinished" class="finished-pill" title="Attempt finished">
                                        Finished
                                    </div>
                                    <div class="progress-metric" :title="`${p.answeredCount}/${totalQuestions} answered`">
                                        {{ p.answeredCount }}/{{ totalQuestions }}
                                    </div>
                                </div>
                            </div>

                            <div class="progress-bar" aria-hidden="true">
                                <div class="progress-bar__fill" :style="{ width: p.progressPercent + '%' }"></div>
                            </div>

                            <div class="q-grid">
                                <div v-for="n in totalQuestions" :key="p.id + ':q:' + n" class="q-chip" :class="{
                                    'is-correct': p.answers[n] === true,
                                    'is-wrong': p.answers[n] === false,
                                    'is-unanswered': p.answers[n] === undefined
                                }" :title="`Q${n}`">
                                    Q{{ n }}
                                </div>
                            </div>
                        </div>

                        <div v-if="participantCards.length === 0" class="empty-state">
                            <p class="text-sm text-gh-text-muted">No updates yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import { useQuizRealtimeMonitor } from '~/composables/realtime/useQuizRealtimeMonitor'
import type { AttemptUpdateFeedPayload } from '~/composables/realtime/types'

const props = defineProps<{ quiz: any }>()

const quizId = computed(() => String(props.quiz?.id ?? ''))

// Single subscription receives attempt_quiz, attempt_update, attempt_finished
const { participants, feed: feedItems, finishedParticipants, isConnected, error: participantsError } = useQuizRealtimeMonitor(quizId.value)

const totalQuestions = computed(() => {
    const questions = props.quiz?.questions || []
    return Array.isArray(questions) ? questions.length : 0
})

type ParticipantProgress = {
    id: string
    alias?: string
    answeredCount: number
    last_answered_at?: string
    last_updated_at: number
    answers: Record<number, boolean | undefined>
}

type SeenParticipant = {
    id: string
    alias?: string
    attempt_id?: string
}

const seenParticipantsMap = shallowRef<Map<string, SeenParticipant>>(new Map())

const progressMap = shallowRef<Map<string, ParticipantProgress>>(new Map())
let lastProcessedFeedLen = 0

const upsertProgressFromUpdate = (ev: AttemptUpdateFeedPayload & { _received_at?: number }) => {
    const participantId = String(ev.participant_id)
    const now = Date.now()

    const nextMap = new Map(progressMap.value)
    const existing = nextMap.get(participantId)

    const answers = existing?.answers ? { ...existing.answers } : {}

    // Resolve question number via quiz array order; fallback to question_order
    const mapped = questionIndex.value.get(String(ev.question_id))
    const questionNumber = mapped?.number ?? (typeof ev.question_order === 'number' ? ev.question_order : null)

    if (questionNumber && questionNumber > 0) {
        // Backend provides is_correct on attempt_update; use it directly for green/red.
        if (typeof ev.is_correct === 'boolean') {
            answers[questionNumber] = ev.is_correct
        }
    }

    const next: ParticipantProgress = {
        id: participantId,
        alias: ev.alias || existing?.alias,
        answeredCount: typeof ev.answered_count === 'number' ? ev.answered_count : (existing?.answeredCount ?? 0),
        last_answered_at: ev.answered_at || existing?.last_answered_at,
        last_updated_at: now,
        answers
    }

    nextMap.set(participantId, next)
    progressMap.value = nextMap
}

watch(
    () => feedItems.value.length,
    (len) => {
        if (len <= 0) {
            lastProcessedFeedLen = 0
            return
        }

        const start = Math.max(0, Math.min(lastProcessedFeedLen, len))
        for (let i = start; i < len; i++) {
            const ev = feedItems.value[i]
            if (!ev) continue
            upsertProgressFromUpdate(ev)
        }

        lastProcessedFeedLen = len
    }
)

watch(
    () => participants.value.map(p => ({
        id: String(p.id),
        alias: p.alias as string | undefined,
        attempt_id: p.attempt_id ? String(p.attempt_id) : undefined
    })),
    (rows) => {
        const now = Date.now()
        if (!rows || rows.length === 0) {
            // When attempts finish, the backend/monitor may clear participants.
            // Keep showing last-known participants and progress.
            return
        }

        const nextSeen = new Map(seenParticipantsMap.value)
        let seenChanged = false

        for (const r of rows) {
            const existing = nextSeen.get(r.id)
            if (!existing) {
                nextSeen.set(r.id, { id: r.id, alias: r.alias, attempt_id: r.attempt_id })
                seenChanged = true
            } else {
                const nextRow: SeenParticipant = {
                    id: r.id,
                    alias: r.alias ?? existing.alias,
                    attempt_id: r.attempt_id ?? existing.attempt_id
                }
                if (nextRow.alias !== existing.alias || nextRow.attempt_id !== existing.attempt_id) {
                    nextSeen.set(r.id, nextRow)
                    seenChanged = true
                }
            }
        }

        if (seenChanged) seenParticipantsMap.value = nextSeen

        // Ensure right-pane progress cards exist for all seen participants.
        const nextMap = new Map(progressMap.value)
        let changed = false

        for (const p of nextSeen.values()) {
            const id = p.id
            const alias = p.alias

            if (!nextMap.has(id)) {
                nextMap.set(id, {
                    id,
                    alias,
                    answeredCount: 0,
                    last_updated_at: now,
                    answers: {}
                })
                changed = true
            } else {
                const existing = nextMap.get(id)!
                if (alias && alias !== existing.alias) {
                    nextMap.set(id, { ...existing, alias })
                    changed = true
                }
            }
        }

        if (changed) progressMap.value = nextMap
    },
    { immediate: true }
)

const participantCards = computed(() => {
    const cards = Array.from(progressMap.value.values())
    cards.sort((a, b) => {
        const aName = (a.alias || 'Anonymous').toLocaleLowerCase()
        const bName = (b.alias || 'Anonymous').toLocaleLowerCase()
        const byAlias = aName.localeCompare(bName)
        if (byAlias !== 0) return byAlias
        return a.id.localeCompare(b.id)
    })

    return cards.map(p => ({
        ...p,
        isFinished: finishedParticipants.value.has(p.id),
        progressPercent: totalQuestions.value > 0
            ? Math.max(0, Math.min(100, (p.answeredCount / totalQuestions.value) * 100))
            : 0
    })) as Array<ParticipantProgress & { progressPercent: number; isFinished: boolean }>
})

// Question index map (id -> { number, title }) based on array order
const questionIndex = computed(() => {
    const map = new Map<string, { number: number; title: string }>()
    const questions = props.quiz?.questions || []
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (!q?.id) continue
        map.set(String(q.id), { number: i + 1, title: q.question_title || 'Untitled' })
    }
    return map
})



const formatTime = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const expanded = ref<Set<string>>(new Set())
const toggleExpanded = (id: string) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
}
</script>

<style scoped>
.pane-card {
    min-height: 300px;
}

@media (min-width: 1024px) {
    .pane-card {
        height: min(1800px, calc(100vh - 220px));
    }
}

.pane-card__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.pane-card__content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.pane-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.status-indicator {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
}

.status-indicator.is-disconnected {
    background: var(--color-gh-muted);
}

.participant-count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.75rem;
    background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
    color: var(--color-gh-accent);
    font-size: 0.75rem;
    font-weight: 700;
    border-radius: 9999px;
}

.participants-list {
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 0.5rem;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.participants-list::-webkit-scrollbar {
    width: 6px;
}

.participants-list::-webkit-scrollbar-track {
    background: transparent;
}

.participants-list::-webkit-scrollbar-thumb {
    background: var(--color-gh-border);
    border-radius: 3px;
}

.participants-list::-webkit-scrollbar-thumb:hover {
    background: var(--color-gh-muted);
}

.participants-inner {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.participant-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.participant-item:hover {
    border-color: color-mix(in srgb, var(--color-gh-accent) 30%, transparent);
    transform: translateX(2px);
}

.participant-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: linear-gradient(135deg,
            color-mix(in srgb, var(--color-gh-accent) 20%, transparent),
            color-mix(in srgb, var(--color-gh-accent) 5%, transparent));
    color: var(--color-gh-accent);
    border-radius: 50%;
    flex-shrink: 0;
}

.participant-info {
    flex: 1;
    min-width: 0;
}

.participant-name {
    font-weight: 600;
    color: var(--color-gh-text);
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.status-dot {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
}

.participant-ids-wrapper {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: all 0.2s ease;
}

.participant-ids-wrapper.is-expanded {
    max-height: 60px;
    opacity: 1;
    margin-top: 0.5rem;
}

.participant-ids {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.5rem;
    background: color-mix(in srgb, var(--color-gh-bg) 80%, transparent);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.375rem;
}

.id-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
}

.id-label {
    font-size: 0.65rem;
    font-weight: 700;
    color: var(--color-gh-muted);
}

.id-value {
    font-size: 0.7rem;
    color: var(--color-gh-text-muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.progress-list {
    background: var(--color-gh-bg);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.5rem;
    padding: 0.75rem;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.progress-list::-webkit-scrollbar {
    width: 6px;
}

.progress-list::-webkit-scrollbar-track {
    background: transparent;
}

.progress-list::-webkit-scrollbar-thumb {
    background: var(--color-gh-border);
    border-radius: 3px;
}

.progress-list::-webkit-scrollbar-thumb:hover {
    background: var(--color-gh-muted);
}


.progress-card {
    background: var(--color-gh-card);
    border: 1px solid var(--color-gh-border);
    border-radius: 0.75rem;
    padding: 0.75rem;
}

.progress-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}

.progress-right {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

.finished-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 1.75rem;
    padding: 0 0.6rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 800;
    background: color-mix(in srgb, var(--color-gh-muted) 15%, transparent);
    color: var(--color-gh-muted);
    border: 1px solid var(--color-gh-border);
}

.progress-alias {
    font-weight: 800;
    color: var(--color-gh-text);
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.progress-metric {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3.25rem;
    height: 1.75rem;
    padding: 0 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 800;
    background: color-mix(in srgb, var(--color-gh-accent) 12%, transparent);
    color: var(--color-gh-accent);
    border: 1px solid color-mix(in srgb, var(--color-gh-accent) 20%, transparent);
}

.progress-bar {
    height: 0.5rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--color-gh-bg) 85%, transparent);
    border: 1px solid var(--color-gh-border);
    overflow: hidden;
    margin-bottom: 0.75rem;
}

.progress-bar__fill {
    height: 100%;
    background: color-mix(in srgb, var(--color-gh-accent) 45%, transparent);
    border-right: 1px solid color-mix(in srgb, var(--color-gh-accent) 55%, transparent);
}

.q-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.q-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.75rem;
    min-width: 3rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    font-weight: 800;
    border: 1px solid var(--color-gh-border);
    background: var(--color-gh-bg);
    color: var(--color-gh-text-muted);
    user-select: none;
}

.q-chip.is-correct {
    background: color-mix(in srgb, #22c55e 18%, transparent);
    border-color: color-mix(in srgb, #22c55e 45%, transparent);
    color: #22c55e;
}

.q-chip.is-wrong {
    background: color-mix(in srgb, #ef4444 16%, transparent);
    border-color: color-mix(in srgb, #ef4444 45%, transparent);
    color: #ef4444;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 0;
}
</style>
