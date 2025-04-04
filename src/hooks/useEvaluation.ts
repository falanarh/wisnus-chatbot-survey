import { useState, useEffect, useCallback } from "react";
import {
  Evaluation,
  initializeEvaluation,
  submitAnswer,
  completeEvaluation,
  getUserLatestEvaluation,
  EvaluationQuestionItem,
} from "@/services/survey/evaluation";
import { evaluationQuestions } from "@/components/survey/evaluation/constants";

interface UseEvaluationProps {
  sessionId?: string;
}

export function useEvaluation({ sessionId }: UseEvaluationProps = {}) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<EvaluationQuestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Load evaluation questions once on mount
  useEffect(() => {
    setQuestions(evaluationQuestions);
  }, []);

  // Initialize or load existing evaluation
  useEffect(() => {
    let isMounted = true;

    async function loadOrInitializeEvaluation() {
      if (!isMounted) return;

      setIsLoading(true);
      setError(null);

      try {
        // First check if user has an active evaluation
        const latestResponse = await getUserLatestEvaluation();

        if (!isMounted) return;

        if (
          latestResponse.success &&
          latestResponse.data &&
          !latestResponse.data.completed
        ) {
          // User has an incomplete evaluation, use it
          const existingEvaluation = latestResponse.data;
          setEvaluation(existingEvaluation);

          // Figure out which question we're on
          const completedCount = existingEvaluation.answers
            ? Object.keys(existingEvaluation.answers).length
            : 0;
          setCurrentQuestionIndex(completedCount);
        } else {
          // Initialize a new evaluation
          const response = await getUserLatestEvaluation();

          if (!isMounted) return;

          if (response.success && response.data) {
            setEvaluation(response.data);
            setIsComplete(response.data.completed);
            setCurrentQuestionIndex(0);
          } else {
            throw new Error(
              response.message || "Failed to initialize evaluation"
            );
          }
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.message === "No evaluation found for this user"
        ) {
          // Initialize a new evaluation
          const initResponse = await initializeEvaluation({
            session_id: sessionId,
          });

          if (!isMounted) return;

          if (initResponse.success && initResponse.data) {
            setEvaluation(initResponse.data);
            setCurrentQuestionIndex(0);
          } else {
            throw new Error(
              initResponse.message || "Failed to initialize evaluation"
            );
          }
        }

        if (!isMounted) return;

        console.error("Error loading evaluation:", err);
        if (
          err instanceof Error &&
          err.message !== "No evaluation found for this user"
        ) {
          setError(
            err instanceof Error ? err.message : "Failed to load evaluation"
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrInitializeEvaluation();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Update questions with current values - FIXED to prevent infinite loop
  useEffect(() => {
    if (evaluation && evaluation.answers) {
      // Create a deep copy of questions to compare
      const currentQuestionsJSON = JSON.stringify(questions);

      // Create updated questions with values from evaluation
      const updatedQuestions = evaluationQuestions.map((q) => ({
        ...q,
        value: evaluation.answers[q.id as keyof typeof evaluation.answers],
      }));

      // Only update state if questions have actually changed
      if (JSON.stringify(updatedQuestions) !== currentQuestionsJSON) {
        setQuestions(updatedQuestions);
      }
    }
  }, [evaluation]); // Only depends on evaluation, not questions

  // Submit answer to current question
  const submitQuestionAnswer = useCallback(
    async (questionId: string, value: number | string) => {
      if (!evaluation) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await submitAnswer({
          evaluation_id: evaluation._id,
          question_id: questionId,
          value,
        });

        if (response.success && response.data) {
          setEvaluation(response.data);

          // Move to next question if available
          if (currentQuestionIndex < evaluationQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
          } else {
            // This was the last question
            await finalizeEvaluation();
          }
        } else {
          throw new Error(response.message || "Failed to submit answer");
        }
      } catch (err) {
        console.error("Error submitting answer:", err);
        setError(
          err instanceof Error ? err.message : "Failed to submit answer"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentQuestionIndex, evaluation]
  );

  // Finalize the evaluation
  const finalizeEvaluation = useCallback(async () => {
    if (!evaluation) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await completeEvaluation({
        evaluation_id: evaluation._id,
      });

      if (response.success && response.data) {
        setEvaluation(response.data);
        setIsComplete(true);
      } else {
        throw new Error(response.message || "Failed to complete evaluation");
      }
    } catch (err) {
      console.error("Error completing evaluation:", err);
      setError(
        err instanceof Error ? err.message : "Failed to complete evaluation"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [evaluation]);

  // Navigate to previous question
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Navigate to a specific question
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < evaluationQuestions.length) {
      setCurrentQuestionIndex(index);
    }
  }, []);

  // Get the current question
  const currentQuestion = questions[currentQuestionIndex];

  // Calculate progress
  const progress =
    evaluation && evaluation.answers
      ? Object.keys(evaluation.answers).length / evaluationQuestions.length
      : 0;

  return {
    evaluation,
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    isSubmitting,
    error,
    isComplete,
    progress,
    submitQuestionAnswer,
    finalizeEvaluation,
    goToPreviousQuestion,
    goToQuestion,
  };
}