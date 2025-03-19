// src/services/survey/ragService.ts
import { ragApiRequest } from "./surveyApiClient";
import { RAGResponse } from "./types";

/**
 * Queries the RAG system with a question
 *
 * @param question - The question to ask the RAG system
 * @returns RAG response containing answer and context
 */
export async function queryRAG(question: string): Promise<RAGResponse> {
  try {
    return await ragApiRequest<RAGResponse>("/api/rag/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  } catch (error) {
    console.error("Error querying RAG system:", error);

    // Return a structured error response
    return {
      question: question,
      context: [],
      answer: `Error: ${
        error instanceof Error
          ? error.message
          : "An error occurred while processing your question"
      }`,
    };
  }
}
