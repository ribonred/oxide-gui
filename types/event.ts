import type { QuizSubmissionMode, QuizStatus, QuizAccessType, QuizAvailability } from './api'

// Event types matching Rust backend

export interface QuizDetailInEvent {
  quiz_id: number
  quiz_title: string
  quiz_description?: string
  quiz_categories: string
  quiz_metadata: Record<string, any>
  quiz_tags: string[]
  quiz_status: QuizStatus
  quiz_access_type: QuizAccessType
  quiz_availability: QuizAvailability
}

export interface QuestionInEvent {
  id: string
  question_title: string
  question_type: string
  category: string
  difficulty_level: string
  points: number
}

export interface EventListItem {
  id: string
  quiz_id: number
  quiz_title: string
  name: string
  metadata: Record<string, any>
  starts_at: string
  ends_at: string
  max_attempts?: number
  client_only?: boolean
  is_active: boolean
  created_at: string
}

export interface EventDetail extends QuizDetailInEvent {
  id: string
  name: string
  description?: string
  metadata: Record<string, any>
  starts_at: string
  ends_at: string
  max_attempts?: number
  time_limit_seconds?: number
  submission_mode?: QuizSubmissionMode
  client_only?: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  questions: QuestionInEvent[]
  question_count: number
}

export interface CreateEventRequest {
  quiz_id: number
  name: string
  description?: string | null
  metadata?: Record<string, any>
  starts_at: string
  ends_at: string
  max_attempts?: number | null
  time_limit_seconds?: number | null
  submission_mode?: QuizSubmissionMode | null
  client_only?: boolean | null
}

export interface UpdateEventRequest {
  name?: string
  description?: string | null
  metadata?: Record<string, any>
  starts_at?: string
  ends_at?: string
  max_attempts?: number | null
  time_limit_seconds?: number | null
  submission_mode?: QuizSubmissionMode | null
  client_only?: boolean | null
}

export interface SearchEventsRequest {
  quizId?: number
  name?: string
  metadata?: Record<string, any>
  status?: 'all' | 'available'
  from?: string
  to?: string
  page?: number
  perPage?: number
}

// Ticket types

export type TicketType = 'quiz' | 'event'

export interface Ticket {
  id: string
  participant_id: string
  ticket_type: TicketType
  quiz_id?: number
  event_id?: string
  quantity: number
  used_count: number
  remaining: number
  bypass_client: boolean
  reason?: string
  issued_by: string
  revoked_at?: string
  expires_at: string
  created_at: string
}

export interface CreateTicketRequest {
  participant_id: string
  ticket_type: TicketType
  quiz_id?: number
  event_id?: string
  quantity: number
  bypass_client?: boolean
  reason?: string
}

export interface ListTicketsQuery {
  participant_id?: string
  ticket_type?: TicketType
}
