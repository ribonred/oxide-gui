interface StoredMemberAccess {
  apiKey: string
  participantId: string
}

const storageKey = 'member_access'

const normalizeQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0]
  return value
}

const readSession = (): StoredMemberAccess | null => {
  if (!import.meta.client) return null
  const raw = sessionStorage.getItem(storageKey)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.apiKey && parsed?.participantId) {
      return {
        apiKey: parsed.apiKey,
        participantId: parsed.participantId,
      }
    }
  } catch {
    return null
  }
  return null
}

const writeSession = (value: StoredMemberAccess) => {
  if (!import.meta.client) return
  sessionStorage.setItem(storageKey, JSON.stringify(value))
}

const clearSessionStorage = () => {
  if (!import.meta.client) return
  sessionStorage.removeItem(storageKey)
}

export const useMemberAccess = () => {
  const apiKey = useState<string>('member_api_key', () => '')
  const participantId = useState<string>('member_participant_id', () => '')

  const hasCredentials = computed(() => !!apiKey.value && !!participantId.value)

  const loadFromSession = () => {
    const stored = readSession()
    if (stored) {
      apiKey.value = stored.apiKey
      participantId.value = stored.participantId
    }
    return stored
  }

  const storeToSession = (newApiKey: string, newParticipantId: string) => {
    apiKey.value = newApiKey
    participantId.value = newParticipantId
    writeSession({ apiKey: newApiKey, participantId: newParticipantId })
  }

  const clearSession = () => {
    apiKey.value = ''
    participantId.value = ''
    clearSessionStorage()
  }

  const applyQueryParams = (query: Record<string, any>) => {
    const apiKeyParam = normalizeQueryValue(query.apiKey ?? query.api_key)
    const participantIdParam = normalizeQueryValue(
      query.participantId ?? query.participant_id
    )

    if (apiKeyParam && participantIdParam) {
      apiKey.value = apiKeyParam
      participantId.value = participantIdParam
      return true
    }

    return false
  }

  return {
    apiKey,
    participantId,
    hasCredentials,
    loadFromSession,
    storeToSession,
    clearSession,
    applyQueryParams,
  }
}
