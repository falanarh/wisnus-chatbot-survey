import React from "react";
import { CheckCircle, Circle, Edit } from "lucide-react";
import Loader from "../other/Loader";

interface AnsweredQuestion {
  question_code: string;
  question_text: string;
  answer: string;
  displayNumber: number;
}

interface Progress {
  total_questions: number;
  current_question_code: string | null;
}

interface AnsweredQuestionListProps {
  questions: AnsweredQuestion[];
  progress: Progress;
  isLoading: boolean;
  onEdit: (question: AnsweredQuestion) => void;
}

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

function replacePlaceholders(text: string, questions: AnsweredQuestion[]): string {
  return text.replace(/\$\{([^}]+)\}/g, (match, placeholder) => {
    const question = questions.find(q => q.question_code === placeholder);
    if (question) {
      return formatAnswer(question.answer);
    }
    return match; // Return original placeholder if not found
  });
}

const AnsweredQuestionList: React.FC<AnsweredQuestionListProps> = ({ questions, progress, isLoading, onEdit }) => {
  return (
    <div className="bg-white/90 dark:bg-gray-900/80 rounded-xl shadow-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-800 h-full flex flex-col">
      <h3 className="text-base font-semibold mb-3 text-gray-700 dark:text-gray-200 flex-shrink-0">Daftar Pertanyaan Terjawab</h3>
      <div className="flex-1 overflow-y-auto hide-scrollbar py-4 pr-2">
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-6">
              <Loader />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat data pertanyaan...</p>
            </div>
          ) : questions.length > 0 ? (
            questions.map((question) => {
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
                          onClick={() => onEdit(question)}
                          aria-label={`Edit jawaban pertanyaan ${questionNumber}`}
                        >
                          <Edit size={16} />
                          <span className="text-xs font-medium">Ubah</span>
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="text-sm text-justify text-gray-800 dark:text-gray-200 font-medium">
                          {replacePlaceholders(formatAnswer(question.question_text), questions)}
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
  );
};

export default AnsweredQuestionList; 