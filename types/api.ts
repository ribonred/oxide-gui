// API Response DTOs matching Rust backend structure

export interface ApiResponse<D, C = string> {
  code: C;
  message: string;
  data: D;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface ListData<T> {
  results: T[];
  [any: string]: any;
}

export interface PaginatedData<T> {
  results: T[];
  pagination: Pagination;
}

// Type aliases for common response patterns
export type ResponseData<T, C = string> = ApiResponse<T, C>;
export type ResponseListData<T, C = string> = ApiResponse<ListData<T>, C>;
export type PaginatedResponseData<T, C = string> = ApiResponse<
  PaginatedData<T>,
  C
>;

// Generic result wrapper for composables
export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
}

// Domain Types

export type QuizStatus = 'draft' | 'published' | 'archived';
export type QuizAccessType = 'public' | 'private' | 'shared';
export type QuizAvailability = 'always' | 'scheduled';
export type QuizSubmissionMode = 'soft_limit' | 'hard_limit';

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  categories: string;
  metadata: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
  available_from?: string;
  available_until?: string;
  time_limit_seconds: number;
  status: QuizStatus;
  access_type: QuizAccessType;
  availability: QuizAvailability;
  submission_mode: QuizSubmissionMode;
  shuffle_questions: boolean;
  max_attempts: number;
  access_code?: string;
  creator_id: string;
  question_count?: number;
}

export interface CreateQuizRequest {
  title: string;
  description?: string | null;
  categories: string;
  metadata?: Record<string, any>;
  tags?: string[];
  available_from?: string | null;
  available_until?: string | null;
  time_limit_seconds: number;
  status: QuizStatus;
  access_type: QuizAccessType;
  availability: QuizAvailability;
  submission_mode: QuizSubmissionMode;
  shuffle_questions: boolean;
  max_attempts: number;
}

export interface UpdateQuizRequest {
  title?: string;
  description?: string | null;
  categories?: string;
  metadata?: Record<string, any>;
  tags?: string[];
  available_from?: string | null;
  available_until?: string | null;
  time_limit_seconds?: number;
  status?: QuizStatus;
  access_type?: QuizAccessType;
  availability?: QuizAvailability;
  submission_mode?: QuizSubmissionMode;
  shuffle_questions?: boolean;
  max_attempts?: number;
}

export interface PatchQuizMetadataOpsRequest {
  set?: Record<string, any>;
  unset?: string[];
}

export interface PatchQuizTagsOpsRequest {
  push?: string[];
  pop?: string[];
}

export interface AttemptListItem {
  id: string;
  quiz_id: number;
  quiz_title: string;
  participant_id: string;
  alias: string;
  started_at: string;
  submitted_at: string | null;
  score: number;
  total_questions: number;
  answered_count: number;
  time_taken_ms: number | null;
  is_latest: boolean;
  is_fully_evaluated: boolean;
  created_at: string;
}

export interface AttemptAnswerItem {
  id: string;
  question_id: string;
  question_title: string;
  user_answer: string;
  is_correct: boolean;
  score: number;
  time_spent_ms: number | null;
  answered_at: string;
  is_latest: boolean;
  question_order: number;
  is_evaluated: boolean;
}

export interface AttemptAnswersResponse {
  id: string;
  quiz_id: number;
  participant_id: string;
  started_at: string;
  submitted_at: string | null;
  score: number;
  total_questions: number;
  answered_count: number;
  time_taken_ms: number | null;
  is_latest: boolean;
  is_fully_evaluated: boolean;
  created_at: string;
  answers: AttemptAnswerItem[];
}

export interface EvaluateAnswerRequest {
  answer_id: string;
  score_override?: number;
  is_correct: boolean;
}

export interface SyncQuizEvaluationRequest {
  reset_manual_grades?: boolean;
}

export interface SyncQuizEvaluationResponse {
  attempts_processed: number;
  answers_re_evaluated: number;
  manual_answers_reset: number;
}
