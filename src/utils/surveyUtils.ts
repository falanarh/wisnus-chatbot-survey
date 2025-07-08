// Utility untuk survei
export interface AnsweredQuestion {
  question_code: string;
  question_text: string;
  answer: unknown;
}

export function getValidAnsweredQuestions(answeredQuestionsData: AnsweredQuestion[], sortQuestionCodes: (a: string, b: string) => number) {
  return answeredQuestionsData
    .filter(question => question.answer !== "N/A" && question.answer !== "n/a")
    .sort((a, b) => sortQuestionCodes(a.question_code, b.question_code))
    .map((question, index) => ({
      ...question,
      displayNumber: index + 1, // Urutan tampilan yang sesuai
      answer: formatAnswer(question.answer)
    }));
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

export function sortQuestionCodes(a: string, b: string): number {
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
} 