//src/components/survey/SurveyChatbot.tsx

"use client";

import React, { useState, useEffect } from "react";
import SurveyCompletionPage from "@/components/survey/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import { useAnsweredQuestions } from "@/hooks/useAnsweredQuestions";
import ChatLayout from "./ChatLayout";
import Loader from "../other/Loader";
import { useSurveyMessages } from "@/hooks/useSurveyMessages";
// import { getUserData } from "@/services/auth";
import { updateSurveyAnswer } from "@/services/survey";
import SurveyCodeInputPopup from "./SurveyCodeInputPopup";
import { assignUniqueSurveyCode } from "@/services/survey/assignUniqueCode";
import { getUserData, updateUserProperty } from "@/services/auth/userStorage";
import EditAnswerPopup from "./EditAnswerPopup";
import FloatingProgressButton from "./FloatingProgressButton";
import SurveyDrawer from "./SurveyDrawer";
import ProgressBar from "./ProgressBar";
import AnsweredQuestionList from "./AnsweredQuestionList";
import SuccessToast from "./SuccessToast";

// Reusable background component
const StyledBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen relative">
    {/* Fixed Background Layer - same as homepage */}
    <div
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Base Background Color */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900" />

      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-30 dark:opacity-10"
        style={{
          backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                          linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Subtle Dots Pattern */}
      <div
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          backgroundImage: `radial-gradient(#333 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Colored Blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
    </div>

    {/* Content on top of background */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Loading component with styled background
const LoadingState = () => (
  <StyledBackground>
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center">
        <Loader />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Memuat data survei...</p>
      </div>
    </div>
  </StyledBackground>
);

// Error component with styled background
const ErrorState = ({ error, refreshStatus }: { error: string, refreshStatus: () => void }) => (
  <StyledBackground>
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-6 rounded-lg max-w-md shadow-lg">
        <h2 className="font-bold text-lg mb-2">Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button
          onClick={refreshStatus}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  </StyledBackground>
);

// Utility function to format answer for display
function formatAnswer(answer: unknown): string {
  if (typeof answer === 'string') {
    return answer.trim() !== '' ? answer : '(Belum diisi)';
  }
  if (typeof answer === 'number') {
    return answer.toString();
  }
  if (Array.isArray(answer)) {
    return answer.length > 0 ? answer.join(', ') : '(Belum diisi)';
  }
  return '(Belum diisi)';
}

const SurveyChatbot: React.FC = () => {
  const { isLoading: isLoadingSurveyStatus, error, sessionData, refreshStatus, refreshStatusSilent } = useSurveyStatus();
  const { isLoading: isLoadingSurveyMessages, messages, addMessage, updateLastMessage } = useSurveyMessages();
  const { data: answeredQuestions, isLoading: isLoadingAnsweredQuestions, refetch: refetchAnsweredQuestions } = useAnsweredQuestions();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    question_code: string;
    question_text: string;
    answer: string;
    displayNumber: number;
  } | null>(null);
  const [editChatMessages, setEditChatMessages] = useState<Array<{
    id: string;
    text: string;
    user: boolean;
    mode: 'survey' | 'qa';
    questionObject?: {
      code: string;
      text: string;
    };
  }>>([]);
  const [editInput, setEditInput] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [showEditSuccessToast, setShowEditSuccessToast] = useState(false);
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [codeError, setCodeError] = useState<string | undefined>(undefined);

  // Cek apakah user sudah punya session dan kode unik
  useEffect(() => {
    const userData = getUserData();
    if (!userData?.activeSurveySessionId && !userData?.activeSurveyUniqueCode) {
      setShowCodePopup(true);
    }
  }, []);

  // Handler submit kode unik
  const handleSubmitCode = async (code: string) => {
    setCodeError(undefined);
    const result = await assignUniqueSurveyCode(code);
    if (result.success && result.kode_unik) {
      // Simpan ke localStorage user
      updateUserProperty("activeSurveyUniqueCode", result.kode_unik);
      setShowCodePopup(false);
      setCodeError(undefined);
    } else {
      setCodeError(result.message || "Kode unik tidak valid");
    }
  };

  // Fetch answered questions when session is in progress
  useEffect(() => {
    if (sessionData?.status === 'IN_PROGRESS') {
      refetchAnsweredQuestions();
    }
  }, [sessionData?.status, refetchAnsweredQuestions]);

  // Handle edit question
  const handleEditQuestion = (question: {
    question_code: string;
    question_text: string;
    answer: string;
    displayNumber: number;
  }) => {
    setEditingQuestion(question);
    // Initialize chat messages with the question
    setEditChatMessages([
      {
        id: 'system-question',
        text: question.question_text,
        user: false,
        mode: 'survey',
        questionObject: {
          code: question.question_code,
          text: question.question_text
        }
      },
    ]);
    setEditPopupOpen(true);
  };

  // Handle send edit message
  const handleSendEditMessage = async () => {
    if (!editInput.trim() || editLoading || !editingQuestion) return;

    const userMessage = {
      id: `edit-user-${Date.now()}`,
      text: editInput,
      user: true,
      mode: 'survey' as const
    };

    setEditChatMessages(prev => [...prev, userMessage]);
    setEditLoading(true);

    try {
      const data = await updateSurveyAnswer(editingQuestion.question_code, editInput);

      console.log("Data: ", data);

      // Type narrowing: hanya akses properti jika ada 'info' (SurveyResponseResult)
      if ('info' in data && typeof data.info === 'string') {
        if (data.info === 'answer_updated') {
          setEditChatMessages(prev => [
            ...prev,
            {
              id: `edit-system-success-${Date.now()}`,
              text: 'improved_response' in data && typeof data.improved_response === 'string' ? data.improved_response : 'Jawaban berhasil diperbarui.',
              user: false,
              mode: 'survey' as const
            },
          ]);
          setEditInput("");
          setEditLoading(false);
          // Refresh data utama
          refetchAnsweredQuestions();
          setTimeout(() => {
            setEditPopupOpen(false);
            setEditingQuestion(null);
            setEditChatMessages([]);
            setShowEditSuccessToast(true);
            setTimeout(() => setShowEditSuccessToast(false), 2500);
          }, 1200);
        } else if (data.info === 'unexpected_answer_or_other') {
          setEditChatMessages(prev => [
            ...prev,
            {
              id: `edit-system-clarify-${Date.now()}`,
              text: ((('clarification_reason' in data && typeof data.clarification_reason === 'string') ? data.clarification_reason : 'Jawaban memerlukan klarifikasi.') + ((('follow_up_question' in data && typeof data.follow_up_question === 'string') ? `\n${data.follow_up_question}` : ''))),
              user: false,
              mode: 'survey' as const
            },
          ]);
          setEditInput(""); // Kosongkan input untuk klarifikasi lanjutan
          setEditLoading(false);
        } else if (data.info === 'question') {
          setEditChatMessages(prev => [
            ...prev,
            {
              id: `edit-system-rag-${Date.now()}`,
              text: 'answer' in data && typeof data.answer === 'string' ? `${data.answer} \n\nPertanyaan saat ini:\n\n ${data.currentQuestion?.text}` : 'Pertanyaan Anda telah dijawab.',
              user: false,
              mode: 'survey' as const
            },
          ]);
          setEditInput("");
          setEditLoading(false);
          refetchAnsweredQuestions();
          // Tidak menutup popup otomatis
        } else if (data.info === 'error') {
          setEditChatMessages(prev => [
            ...prev,
            {
              id: `edit-system-error2-${Date.now()}`,
              text: 'additional_info' in data && typeof data.additional_info === 'string' ? data.additional_info : (data.message || 'Terjadi kesalahan.'),
              user: false,
              mode: 'survey' as const
            },
          ]);
          setEditLoading(false);
        } else {
          setEditChatMessages(prev => [
            ...prev,
            {
              id: `edit-system-unknown-${Date.now()}`,
              text: data.message || 'Respon tidak dikenali.',
              user: false,
              mode: 'survey' as const
            },
          ]);
          setEditLoading(false);
        }
      } else {
        // Fallback jika bukan SurveyResponseResult
        setEditChatMessages(prev => [
          ...prev,
          {
            id: `edit-system-unknown2-${Date.now()}`,
            text: data.message || 'Respon tidak dikenali.',
            user: false,
            mode: 'survey' as const
          },
        ]);
        setEditLoading(false);
      }
    } catch {
      setEditChatMessages(prev => [
        ...prev,
        {
          id: `edit-system-catch-${Date.now()}`,
          text: 'Terjadi kesalahan jaringan.',
          user: false,
          mode: 'survey' as const
        },
      ]);
      setEditLoading(false);
    }
  };

  // Selalu tampilkan LoadingState terlebih dahulu
  if (isLoadingSurveyStatus || isLoadingSurveyMessages) {
    return <LoadingState />;
  }

  // Tampilkan popup kode unik jika perlu
  if (showCodePopup) {
    return (
      <SurveyCodeInputPopup
        open={showCodePopup}
        onSubmit={handleSubmitCode}
        errorMessage={codeError}
      />
    );
  }

  // Show error state if API call fails
  if (error) {
    return <ErrorState error={error} refreshStatus={refreshStatus} />;
  }
  // Show completion page if survey is completed
  if (sessionData?.status === 'COMPLETED') {
    return (
      <StyledBackground>
        <SurveyCompletionPage sessionData={sessionData} />
      </StyledBackground>
    );
  } else if (sessionData?.status === 'IN_PROGRESS') {
    const progress = sessionData.progress;
    const answeredQuestionsData = answeredQuestions || [];
    
    // Helper function untuk sorting question codes
    const sortQuestionCodes = (a: string, b: string) => {
      // Extract numeric parts from question codes (handle leading zeros)
      const getNumericPart = (code: string) => {
        const match = code.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      
      // Extract prefix (non-numeric part)
      const getPrefix = (code: string) => {
        return code.replace(/\d+/g, '');
      };
      
      const prefixA = getPrefix(a);
      const prefixB = getPrefix(b);
      
      // If prefixes are the same, sort by numeric part
      if (prefixA === prefixB) {
        return getNumericPart(a) - getNumericPart(b);
      }
      
      // Define priority order for prefixes
      const prefixPriority = {
        'KR': 1,  // KR001, KR002, etc. come first
        'S': 2    // S001, S002, etc. come second
      };
      
      const priorityA = prefixPriority[prefixA as keyof typeof prefixPriority] || 999;
      const priorityB = prefixPriority[prefixB as keyof typeof prefixPriority] || 999;
      
      // Sort by priority first, then alphabetically if same priority
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort alphabetically by prefix
      return prefixA.localeCompare(prefixB);
    };

    // Filter pertanyaan yang tidak memiliki jawaban "N/A", sort berdasarkan kode, dan berikan urutan yang sesuai
    const validAnsweredQuestions = answeredQuestionsData
      .filter(question => question.answer !== "N/A" && question.answer !== "n/a")
      .sort((a, b) => sortQuestionCodes(a.question_code, b.question_code))
      .map((question, index) => ({
        ...question,
        displayNumber: index + 1, // Urutan tampilan yang sesuai
        answer: formatAnswer(question.answer)
      }));
    
    return (
      <StyledBackground>
        {/* Floating Progress Button */}
        <FloatingProgressButton onClick={() => setDrawerOpen(true)} />

        {/* Drawer Overlay */}
        <SurveyDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Progress Survei">
          <ProgressBar
            value={Math.round((validAnsweredQuestions.length / progress.total_questions) * 100)}
            leftLabel={`${validAnsweredQuestions.length} / ${progress.total_questions} terjawab`}
            rightLabel={`${Math.round((validAnsweredQuestions.length / progress.total_questions) * 100)}%`}
            className="px-6 py-4 flex-shrink-0"
          />
          <div className="flex-1 overflow-hidden">
            <div className="h-full px-6 pb-6">
              <AnsweredQuestionList
                questions={validAnsweredQuestions}
                progress={progress}
                isLoading={isLoadingAnsweredQuestions}
                onEdit={handleEditQuestion}
              />
            </div>
          </div>
        </SurveyDrawer>
        <ChatLayout 
          messages={messages} 
          addMessage={addMessage} 
          updateLastMessage={updateLastMessage} 
          refreshStatus={refreshStatusSilent}
          refreshAnsweredQuestions={refetchAnsweredQuestions}
        />

        {/* Edit Answer Popup */}
        {editPopupOpen && (
          <EditAnswerPopup
            open={editPopupOpen}
            onClose={() => {
              setEditPopupOpen(false);
              setEditingQuestion(null);
              setEditChatMessages([]);
              setEditInput("");
            }}
            messages={editChatMessages}
            loading={editLoading}
            input={editInput}
            onInputChange={setEditInput}
            onSend={handleSendEditMessage}
            editingQuestion={editingQuestion}
          />
        )}

        {/* Toast Success Edit Jawaban */}
        <SuccessToast open={showEditSuccessToast} message="Jawaban berhasil diperbarui!" onClose={() => setShowEditSuccessToast(false)} />
      </StyledBackground>
    );
  }

  // Fallback loading state
  return (
    <StyledBackground>
      <ChatLayout messages={messages} addMessage={addMessage} updateLastMessage={updateLastMessage} refreshStatus={refreshStatusSilent} refreshAnsweredQuestions={refetchAnsweredQuestions} />
    </StyledBackground>
  );
};

export default SurveyChatbot;