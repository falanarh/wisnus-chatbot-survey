import { ReactNode } from "react";

export interface Evaluation {
  _id: string;
  user_id: string;
  session_id?: string;
  answers: {
    ease_of_use?: number;
    participation_ease?: number;
    enjoyment?: number;
    data_security?: number;
    privacy_safety?: number;
    mental_effort?: number;
    overall_experience?: string;
  };
  completed: boolean;
  created_at: string;
}

export interface EvaluationQuestion {
  id: string;
  text: string;
  scaleType: "agreement" | "effort" | "text";
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  icon: ReactNode;
  description: string;
}

export interface EvaluationQuestionItem extends EvaluationQuestion {
  value?: number | string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface InitializeEvaluationRequest {
  session_id?: string;
}

export interface SubmitAnswerRequest {
  evaluation_id: string;
  question_id: string;
  value: number | string; // Mendukung numerik dan string
}

export interface CompleteEvaluationRequest {
  evaluation_id: string;
}