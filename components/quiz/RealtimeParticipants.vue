<template>
  <Button variant="secondary" size="sm" fullWidth @click="goToParticipants">
    <div class="participants-row">
      <div class="participants-header__left">
        <div
          class="status-indicator"
          :class="{ 'is-disconnected': !isConnected }"
        ></div>
        <span class="text-sm font-semibold text-gh-text"
          >Live Participants</span
        >
      </div>
      <div class="participants-header__right">
        <span class="participant-count">
          {{ participants.length }}
        </span>
      </div>
    </div>
  </Button>
</template>

<script setup lang="ts">
import Button from "~/components/ui/Button.vue";
import type {
  WsEventType,
  AttemptEventPayload,
} from "~/composables/useWebSocket";

const props = defineProps({
  quizId: {
    type: [String, Number],
    required: true,
  },
});

const { subscribe, unsubscribe, isConnected } = useWebSocket();
const expandedParticipants = ref(new Set());

const { getQuizParticipants } = useQuizzes();
const error = ref(null);
const participants = ref<Participant[]>([]);

const toggleParticipant = (id: string) => {
  const newSet = new Set(expandedParticipants.value);
  if (newSet.has(id)) {
    newSet.delete(id);
  } else {
    newSet.add(id);
  }
  expandedParticipants.value = newSet;
};
const router = useRouter();

const goToParticipants = () => {
  router.push(`/quizzes/live/${props.quizId}`);
};

// Handle WebSocket attempt events
const handleAttemptEvent = (
  data: AttemptEventPayload | AttemptEventPayload[],
  eventType?: WsEventType
) => {
  // console.log('[RealtimeParticipants] Event:', eventType, '\nData:', JSON.stringify(data, null, 2))

  if (!data) return;

  const events = Array.isArray(data) ? data : [data];
  for (const ev of events) {
    if (!ev) continue;

    // Compare as strings (quiz_id from WS is number, props.quizId is string)
    if (String(ev.quiz_id) !== String(props.quizId)) continue;

    if (eventType === "attempt_quiz") {
      const exists = participants.value.some((p) => p.id === ev.participant_id);
      if (!exists) {
        participants.value.push({
          id: ev.participant_id,
          alias: ev.alias,
          attempt_id: ev.attempt_id,
        });
      }
    } else if (eventType === "attempt_finished") {
      participants.value = participants.value.filter(
        (p) => p.id !== ev.participant_id
      );
    }
  }
};

onMounted(async () => {
  // Fetch initial participants via REST API (fallback)
  const result = await getQuizParticipants(props.quizId.toString());

  console.log(
    "[RealtimeParticipants] fetchParticipants:",
    result.data?.data?.participants
  );

  if (result.success) {
    // Process the data from API
    participants.value = result.data?.data?.participants || [];
  } else {
    error.value = result.error;
  }

  // Subscribe to real-time updates
  subscribe("quiz", props.quizId.toString(), handleAttemptEvent);
});

onUnmounted(() => {
  unsubscribe("quiz", props.quizId.toString(), handleAttemptEvent);
});
</script>

<style scoped>
.participants-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0;
}

.participants-header__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.participants-header__right {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-indicator.is-disconnected {
  background: #6b7280;
  animation: none;
}

@keyframes pulse-green {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.participant-count {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.5rem;
  background: color-mix(in srgb, var(--color-gh-accent) 15%, transparent);
  color: var(--color-gh-accent);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
}

.participants-list {
  flex: 1;
  min-height: 0;
  background: var(--color-gh-bg);
  border: 1px solid var(--color-gh-border);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.participants-list.scrollable {
  overflow-y: auto;
  max-height: 280px;
  /* ~5 items */
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
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-gh-accent) 20%, transparent),
    color-mix(in srgb, var(--color-gh-accent) 5%, transparent)
  );
  color: var(--color-gh-accent);
  border-radius: 50%;
  flex-shrink: 0;
}

.participant-info {
  flex: 1;
  min-width: 0;
}

.participant-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gh-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.participant-ids-wrapper {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.participant-ids-wrapper.is-expanded {
  max-height: 100px;
}

.participant-ids {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--color-gh-border);
}

.id-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
}

.id-label {
  color: var(--color-gh-muted);
  font-weight: 600;
  font-size: 0.65rem;
  width: 24px;
}

.id-value {
  color: var(--color-gh-text-muted);
  font-family: "Monaco", "Menlo", monospace;
}

.participant-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.125rem;
}

.participant-id {
  font-size: 0.75rem;
  color: var(--color-gh-text-muted);
  font-family: "Monaco", "Menlo", monospace;
}

.participant-status {
  flex-shrink: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

/* Chat-like transitions */
.participant-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.participant-leave-active {
  animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 1, 1);
  position: absolute;
  width: calc(100% - 1rem);
}

.participant-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }

  to {
    opacity: 0;
    transform: translateX(-30px) scale(0.95);
  }
}
</style>
