// src/services/surveyService.ts

// Interface untuk response API analisis intent
export interface IntentAnalysisResponse {
  success: boolean;
  data?: {
    wants_to_start: boolean;
    confidence: number;
    explanation: string;
  };
  metadata?: {
    processing_time: number;
    api_key_used: number;
    timestamp: string;
  };
  message?: string;
  error?: string;
}

// Interface for a survey question
interface Question {
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
 * Interface for the response from /api/survey/start endpoint
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

 export interface RetrievedDocument {
  document: {
    page_content: string;
    metadata: Record<string, unknown>;
  };
  similarity_score: number;
}

// Interface for the RAG response from /api/rag/ask
export interface RAGResponse {
  question: string;
  context: RetrievedDocument[];
  answer: string;
}

/**
 * Menganalisis intent pengguna untuk memulai survei
 * @param message Pesan pengguna yang akan dianalisis
 * @returns Promise dengan hasil analisis
 */
export async function analyzeIntent(
  token: string,
  message: string
): Promise<IntentAnalysisResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const endpoint = `${apiUrl}/api/survey/analyze-intent`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing intent:", error);
    return {
      success: false,
      message: "Failed to analyze intent",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Starts a new survey session or resumes an existing one
 * @param token JWT authentication token
 * @returns Promise with survey session data
 */
export async function startSurvey(token: string): Promise<SurveyStartResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const endpoint = `${apiUrl}/api/survey/start`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error starting survey:", error);
    return {
      success: false,
      message: "Failed to start survey",
      additional_info: error instanceof Error ? error.message : "Unknown error",
      session_id: "",
    };
  }
}

/**
* Submits a response to the current survey question
* @param token JWT authentication token
* @param sessionId Active survey session ID
* @param userResponse User's response to the current question
* @returns Promise with response processing result
*/
export async function submitSurveyResponse(
  token: string,
  sessionId: string,
  userResponse: string
 ): Promise<SurveyResponseResult> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const endpoint = `${apiUrl}/api/survey/respond`;
 
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        session_id: sessionId,
        user_response: userResponse
      })
    });
 
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
 
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error submitting survey response:", error);
    return {
      success: false,
      info: "",
      message: "Failed to submit survey response",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
 }

 /**
 * Queries the RAG system with a question
 * @param token JWT authentication token
 * @param question The question to ask the RAG system
 * @returns Promise with RAG response containing answer and context
 */
export async function queryRAG(
  question: string
): Promise<RAGResponse> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_RAG_API_URL || "";
    const endpoint = `${apiUrl}/api/rag/ask`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: RAGResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error querying RAG system:", error);
    // Return a structured error response that matches the RAGResponse interface
    return {
      question: question,
      context: [],
      answer: `Error: ${error instanceof Error ? error.message : "Unknown error occurred while processing your question"}`
    };
  }
}