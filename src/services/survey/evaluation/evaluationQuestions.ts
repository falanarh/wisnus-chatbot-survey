// src/services/evaluation/evaluationQuestions.ts

import { evaluationQuestions } from "@/components/survey/evaluation/constants";
import { EvaluationQuestion } from "./types";

/**
 * Validates if a value is within the acceptable range for a question
 */
export function validateQuestionValue(
  questionId: string,
  value: number
): boolean {
  const question = evaluationQuestions.find((q) => q.id === questionId);
  if (!question) return false;

  const { min, max } = question;
  return value >= min && value <= max;
}

/**
 * Get question by ID
 */
export function getQuestionById(
  questionId: string
): EvaluationQuestion | undefined {
  return evaluationQuestions.find((q) => q.id === questionId);
}
