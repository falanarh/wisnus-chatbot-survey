// src/services/survey/types.ts

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Survey question interface
 */
export interface Question {
  code: string;
  text: string;
  type: "text" | "select" | "date";
  unit?: string;
  multiple?: boolean;
  options?: string[];
  system_guidelines?: string[];
  allow_other?: boolean;
  additional_info?: string;
  instruction?: string;
  validation: {
    required?: boolean;
    input_type?: "text" | "number" | "date";
    min?: number;
    max?: number;
    pattern?: string;
  };
}

/**
 * Intent analysis result
 */
export interface IntentAnalysisResult {
  wants_to_start: boolean;
  confidence: number;
  explanation: string;
}

/**
 * Intent analysis response
 */
export interface IntentAnalysisResponse
  extends ApiResponse<IntentAnalysisResult> {
  metadata?: {
    processing_time: number;
    api_key_used: number;
    timestamp: string;
  };
}

/**
 * Survey session data
 */
export interface SurveySessionData {
  next_question?: Question;
  current_question_index?: number;
}

/**
 * Survey session start response
 */
export interface SurveyStartResponse {
  success: boolean;
  message?: string;
  additional_info: string;
  next_question?: Question;
  session_id: string;
  current_question_index?: number;
}

/**
 * Survey response data
 */
export interface SurveyResponseData {
  next_question?: Question;
  currentQuestion?: Question;
  clarification_reason?: string;
  follow_up_question?: string;
  answer?: string;
  additional_info?: string;
}

/**
 * Interface for survey response result
 */
export interface SurveyResponseResult {
  success: boolean;
  info: string;
  next_question?: Question;
  currentQuestion?: Question;
  clarification_reason?: string;
  follow_up_question?: string;
  answer?: string;
  additional_info?: string;
  message?: string;
  error?: string;
}

/**
 * Retrieved document from RAG system
 */
export interface RetrievedDocument {
  document: {
    page_content: string;
    metadata: Record<string, unknown>;
  };
  similarity_score: number;
}

/**
 * RAG response
 */
export interface RAGResponse {
  question: string;
  context: RetrievedDocument[];
  answer: string;
}

/**
 * Survey progress information
 */
export interface SurveyProgress {
  total_questions: number;
  answered_questions: number;
  current_question_index: number;
  current_question_code: string | null;
  progress_percentage: number;
  answered_question_codes: string[];
}

/**
 * Survey session status
 */
export interface SurveySessionStatus {
  session_id: string;
  user_id: string;
  status: "IN_PROGRESS" | "COMPLETED";
  started_at: string;
  updated_at: string;
  progress: SurveyProgress;
  message_count: number;
  responses: Array<{
    question_code: string;
    valid_response: string | number | string[];
  }>;
}

/**
 * Survey status response
 */
export type SurveyStatusResponse = ApiResponse<SurveySessionStatus>;
