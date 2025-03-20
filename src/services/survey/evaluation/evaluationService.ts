// src/services/evaluation/evaluationService.ts

import {
  Evaluation,
  InitializeEvaluationRequest,
  SubmitAnswerRequest,
  CompleteEvaluationRequest,
  ApiResponse,
} from "./types";
import { evaluationApiRequest } from "./evaluationApiClient";

/**
 * Initialize a new evaluation for the current user
 */
export async function initializeEvaluation(
  data: InitializeEvaluationRequest
): Promise<ApiResponse<Evaluation>> {
  return evaluationApiRequest<Evaluation>("/api/evaluation/initialize", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Submit an answer to a specific evaluation question
 */
export async function submitAnswer(
  data: SubmitAnswerRequest
): Promise<ApiResponse<Evaluation>> {
  return evaluationApiRequest<Evaluation>("/api/evaluation/submit-answer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Complete an evaluation
 */
export async function completeEvaluation(
  data: CompleteEvaluationRequest
): Promise<ApiResponse<Evaluation>> {
  return evaluationApiRequest<Evaluation>("/api/evaluation/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Get evaluation by ID
 */
export async function getEvaluationById(
  id: string
): Promise<ApiResponse<Evaluation>> {
  return evaluationApiRequest<Evaluation>(`/api/evaluation/${id}`, {
    method: "GET",
  });
}

/**
 * Get user's latest evaluation
 */
export async function getUserLatestEvaluation(): Promise<
  ApiResponse<Evaluation>
> {
  return evaluationApiRequest<Evaluation>("/api/evaluation/user/latest", {
    method: "GET",
  });
}
