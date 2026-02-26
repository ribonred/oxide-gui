export interface RealtimeParticipant {
    id: string
    alias?: string
    attempt_id?: string
}

// Based on backend AttemptUpdateFeed (fields may expand over time)
export interface AttemptUpdateFeedPayload {
    attempt_id: string
    participant_id: string
    alias?: string
    quiz_id: number
    question_id: string
    question_order?: number
    user_answer?: string
    is_correct?: boolean
    score?: number
    answered_at?: string
    answered_count?: number
    total_questions?: number
}
