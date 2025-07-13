import { useState, useCallback } from "react";
import { apiRequest } from "@/utils/authConfig";

export interface AnsweredQuestion {
  question_code: string;
  question_text: string;
  answer: string | number | string[];
}

export function useAnsweredQuestions() {
  const [data, setData] = useState<AnsweredQuestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiRequest("/api/survey/answered")
      .then((data) => {
        if (data.success) setData(data.data);
        else throw new Error(data.message || 'Gagal mengambil data');
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Lazy: fetch only when called
  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
} 