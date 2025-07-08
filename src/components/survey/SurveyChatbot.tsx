//src/components/survey/SurveyChatbot.tsx

"use client";

import React, { useState, useEffect } from "react";
import SurveyCompletionPage from "@/components/survey/SurveyCompletionPage";
import { useSurveyStatus } from "@/hooks/useSurveyStatus";
import { useAnsweredQuestions } from "@/hooks/useAnsweredQuestions";
import ChatLayout from "./ChatLayout";
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
import StyledBackground from "./StyledBackground";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { getValidAnsweredQuestions, sortQuestionCodes } from "@/utils/surveyUtils";

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
    
    // Ganti logika validAnsweredQuestions:
    const validAnsweredQuestions = getValidAnsweredQuestions(answeredQuestionsData, sortQuestionCodes);
    
    return (
      <StyledBackground>
        {/* Floating Progress Button */}
        <FloatingProgressButton onClick={() => setDrawerOpen(true)} progress={Math.round((validAnsweredQuestions.length / progress.total_questions) * 100)} />

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