import { surveyApiRequest } from "./surveyApiClient";

export interface AssignUniqueCodeResult {
  success: boolean;
  kode_unik?: string;
  message?: string;
  error?: unknown;
}

export async function assignUniqueSurveyCode(kode_unik: string): Promise<AssignUniqueCodeResult> {
  try {
    const response = await surveyApiRequest(
      "/api/unique-codes/assign-to-user",
      {
        method: "POST",
        body: JSON.stringify({ kode_unik }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const respObj = response as unknown as Record<string, unknown>;
    if (respObj && respObj.success) {
      return { success: true, kode_unik: respObj.kode_unik as string };
    } else {
      return {
        success: false,
        message: (respObj.message as string) || "Gagal assign kode unik",
        error: response,
      };
    }
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error)?.message || "Gagal assign kode unik (exception)",
      error,
    };
  }
} 