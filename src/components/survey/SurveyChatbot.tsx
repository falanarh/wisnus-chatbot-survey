//src/components/survey/SurveyChatbot.tsx

"use client";

import React, { useState, useEffect } from "react";
import SurveyCompletionPage from "@/components/survey/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import { useAnsweredQuestions } from "@/hooks/useAnsweredQuestions";
import ChatLayout from "./ChatLayout";
import Loader from "../other/Loader";
import { useSurveyMessages } from "@/hooks/useSurveyMessages";
import { CheckCircle, Circle, BarChart2, Edit, X, Send } from "lucide-react";
import { motion } from "framer-motion";
// import { getUserData } from "@/services/auth";
import { updateSurveyAnswer } from "@/services/survey";

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

  // Debug: Cek userData dan activeSurveySessionId
  // const userData = getUserData();
  // console.log("userData:", userData);
  // console.log("activeSurveySessionId:", userData?.activeSurveySessionId);

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

  // Show error state if API call fails
  if (error) {
    return <ErrorState error={error} refreshStatus={refreshStatus} />;
  }

  // console.log("sessionData", sessionData);

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

    // console.log("validAnsweredQuestions:", validAnsweredQuestions)
    
    return (
      <StyledBackground>
        {/* Floating Progress Button */}
        <div className="fixed z-40 right-5 bottom-5 md:bottom-28 md:right-24 flex flex-col items-center gap-2 select-none">
          <button
            className="mb-0.5 px-4 py-1 rounded-full bg-white/90 dark:bg-gray-800/80 text-blue-700 dark:text-blue-200 font-semibold text-xs shadow-md border border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{letterSpacing: '.01em'}}
            aria-label="Lihat progress survei"
            onClick={() => setDrawerOpen(true)}
          >
            Cek progress
          </button>
          <button
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-xl p-3 md:p-3.5 hover:scale-110 active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 border-white dark:border-gray-900"
            aria-label="Lihat progress survei"
            onClick={() => setDrawerOpen(true)}
          >
            <BarChart2 size={28} />
          </button>
        </div>

        {/* Drawer Overlay */}
        <div
          className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen}
        />

        {/* Drawer Panel */}
        <aside
          className={`fixed top-0 right-0 h-full w-full sm:w-[520px] max-w-full z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-label="Progress Survei"
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">Progress Survei</h2>
            <button
              className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setDrawerOpen(false)}
              aria-label="Tutup progress"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Progress Bar - Fixed */}
            <div className="px-6 py-4 flex-shrink-0">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 font-medium">
                    {validAnsweredQuestions.length} / {progress.total_questions} terjawab
                </span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {Math.round((validAnsweredQuestions.length / progress.total_questions) * 100)}%
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative shadow-inner">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(validAnsweredQuestions.length / progress.total_questions) * 100}%` }}
                    aria-label={`Progress: ${Math.round((validAnsweredQuestions.length / progress.total_questions) * 100)}%`}
                ></div>
                </div>
              </div>
            </div>

            {/* Questions List - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full px-6 pb-6">
                <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800 h-full flex flex-col">
                  <h3 className="text-base font-semibold mb-3 text-gray-700 dark:text-gray-200 flex-shrink-0">Daftar Pertanyaan Terjawab & Jawaban</h3>
                  <div className="flex-1 overflow-y-auto hide-scrollbar py-4 pr-2">
                    <div className="space-y-3">
                      {isLoadingAnsweredQuestions ? (
                        <div className="text-center py-6">
                          <Loader />
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat data pertanyaan...</p>
                        </div>
                      ) : validAnsweredQuestions.length > 0 ? (
                        validAnsweredQuestions.map((question) => {
                          const questionNumber = question.displayNumber;
                          const isCurrentQuestion = progress.current_question_code === question.question_code;
                          
                  return (
                    <div
                              key={question.question_code}
                              className={`p-3 rounded-lg border transition-all ${
                                isCurrentQuestion 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 p-1 rounded-full ${
                                  isCurrentQuestion 
                                    ? 'bg-blue-100 dark:bg-blue-800' 
                                    : 'bg-green-100 dark:bg-green-800'
                                }`}>
                                  {isCurrentQuestion ? (
                                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
                                  ) : (
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className={`font-semibold text-sm ${
                                        isCurrentQuestion 
                                          ? 'text-blue-700 dark:text-blue-300' 
                                          : 'text-green-700 dark:text-green-300'
                                      }`}>
                                        Pertanyaan {questionNumber}
                                      </span>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                        {question.question_code}
                                      </span>
                                      {isCurrentQuestion && (
                                        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded font-medium">
                                          Sedang Berlangsung
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      className={`flex items-center gap-1.5 py-1.5 rounded-md transition-colors ${
                                        isCurrentQuestion
                                          ? 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30'
                                          : 'text-orange-600 hover:bg-green-100 dark:text-orange-400 dark:hover:bg-green-900/30'
                                      }`}
                                      onClick={() => handleEditQuestion(question)}
                                      aria-label={`Edit jawaban pertanyaan ${questionNumber}`}
                                    >
                                      <Edit size={16} />
                                      <span className="text-xs font-medium">Ubah</span>
                                    </button>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm text-justify text-gray-800 dark:text-gray-200 font-medium">
                                      {formatAnswer(question.question_text)}
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-md p-2 border border-gray-200 dark:border-gray-700">
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Jawaban Anda:</div>
                                    <div className="text-sm text-justify text-gray-800 dark:text-gray-200 font-medium">
                                      {formatAnswer(question.answer)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Circle className="text-gray-400" size={24} />
                          </div>
                          <p className="text-sm">Belum ada pertanyaan yang dijawab</p>
                          <p className="text-xs mt-1">Mulai menjawab pertanyaan survei untuk melihat progress di sini</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
        <ChatLayout 
          messages={messages} 
          addMessage={addMessage} 
          updateLastMessage={updateLastMessage} 
          refreshStatus={refreshStatusSilent}
          refreshAnsweredQuestions={refetchAnsweredQuestions}
        />

        {/* Edit Answer Popup */}
        {editPopupOpen && (
          <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Edit Jawaban
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pertanyaan {editingQuestion?.displayNumber} • {editingQuestion?.question_code}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditPopupOpen(false);
                    setEditingQuestion(null);
                    setEditChatMessages([]);
                    setEditInput("");
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {editChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.user
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                  </div>
                ))}
                {editLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area - Using main chat input style */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`flex items-center gap-2 
                  bg-gray-100/90 dark:bg-gray-700/90 
                  rounded-full pl-5 pr-2 py-3 border 
                  border-gray-300/60 dark:border-gray-600/60 
                  focus-within:border-blue-400 dark:focus-within:border-blue-400 
                  focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-500/30 
                  backdrop-blur-md shadow-lg transition-all
                  ${editLoading ? 'opacity-80' : 'opacity-100'}`}
                >
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendEditMessage()}
                    placeholder={editLoading ? "Memperbarui jawaban..." : "Ketik jawaban baru Anda..."}
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    disabled={editLoading}
                  />

                  {/* Send Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={!editLoading && editInput.trim() ? { scale: 1.1, rotate: 10 } : {}}
                    onClick={handleSendEditMessage}
                    disabled={!editInput.trim() || editLoading}
                    className={`p-3 rounded-full backdrop-blur-sm ${!editLoading && editInput.trim()
                      ? 'bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-400 dark:hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 border border-gray-400 dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500'
                    } transition-colors duration-200`}
                    aria-label="Kirim jawaban baru"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Status indicator */}
                {editLoading && (
                  <div className="text-center mt-2">
                    <p className="text-xs text-blue-600 dark:text-blue-300">
                      Memperbarui jawaban...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Success Edit Jawaban */}
        {showEditSuccessToast && (
          <div className="fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-semibold animate-fade-in-up">
            Jawaban berhasil diubah!
          </div>
        )}
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