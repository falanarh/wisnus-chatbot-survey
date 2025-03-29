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
  info?: string; // Response type indicator
  next_question?: Question; // Next question to ask
  currentQuestion?: Question; // Current question being answered
  clarification_reason?: string; // Why a response was unexpected
  follow_up_question?: string; // Follow-up question for clarification
  answer?: string; // Answer to a user's question
  additional_info?: string; // Additional information to display
  session_id?: string; // Session ID for the survey
  system_message?: string; // System message (e.g., for not_ready_for_survey)
  intent_analysis?: IntentAnalysisResult; // Intent analysis results
}

// Interface for survey response result
export interface SurveyResponseResult extends SurveyResponseData {
  success: boolean;
  message?: string;
  error?: string;
}

// Add new message types to match API documentation
export enum SurveyResponseType {
  SURVEY_STARTED = "survey_started",
  NOT_READY_FOR_SURVEY = "not_ready_for_survey",
  EXPECTED_ANSWER = "expected_answer",
  UNEXPECTED_ANSWER = "unexpected_answer_or_other",
  QUESTION = "question",
  SURVEY_COMPLETED = "survey_completed",
  ERROR = "error",
  SWITCHED_TO_SURVEY = "switched_to_survey",
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

/**
 * Survey message interface
 */
export interface SurveyMessage {
  _id: string;
  session_id: string;
  user_message: string;
  system_response: SurveyResponseData;
  mode: "survey" | "qa";
  timestamp: string;
}

/**
 * Survey messages result
 */

export interface SurveyMessagesResult {
  success: boolean;
  data?: SurveyMessage[];
  message?: string;
}

export interface SurveyMessageRequest {
  session_id?: string;
  user_message: string | null;
  system_response: SurveyResponseData;
  mode: "survey" | "qa";
}

/**
 * Interface untuk respons pertanyaan saat ini
 */
export interface CurrentQuestionResponse {
  session_id: string;
  status: "IN_PROGRESS" | "COMPLETED";
  current_question_index?: number;
  current_question?: Question;
  progress?: {
    total_questions: number;
    answered_questions: number;
    progress_percentage: number;
  };
  message?: string;
}

/**
 * Interface untuk respons pertanyaan saat ini
 */
export interface CurrentQuestionResponseResult extends ApiResponse<CurrentQuestionResponse> {
  success: boolean;
  message?: string;
  error?: string;
  data?: CurrentQuestionResponse;
}