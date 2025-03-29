// src/services/survey/currentQuestion.ts
import { surveyApiRequest } from "./surveyApiClient";
import { CurrentQuestionResponseResult } from "./types";

/**
 * Mendapatkan pertanyaan saat ini dari sesi survei aktif pengguna
 * 
 * @param signal - AbortSignal opsional untuk membatalkan permintaan
 * @returns Respons dengan pertanyaan saat ini atau pesan status
 */
export async function getCurrentQuestion(
  signal?: AbortSignal
): Promise<CurrentQuestionResponseResult> {
  try {
    const response = await surveyApiRequest(
      "/api/survey/current-question",
      { method: "GET" },
      signal
    ) as CurrentQuestionResponseResult;
    
    return response;
  } catch (error) {
    console.error("Error mendapatkan pertanyaan saat ini:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Terjadi kesalahan saat mendapatkan pertanyaan",
    };
  }
}