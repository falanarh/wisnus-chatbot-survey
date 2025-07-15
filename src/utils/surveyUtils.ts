// Utility untuk survei
export interface AnsweredQuestion {
  question_code: string;
  question_text: string;
  answer: unknown;
}

export function getValidAnsweredQuestions(answeredQuestionsData: AnsweredQuestion[], sortQuestionCodes: (a: string, b: string) => number) {
  const filteredQuestions = answeredQuestionsData.filter(question => {
    const isValid = question.answer !== "N/A" && question.answer !== "n/a";
    return isValid;
  });
  
  const sortedQuestions = filteredQuestions.sort((a, b) => sortQuestionCodes(a.question_code, b.question_code));
  
  const result = sortedQuestions.map((question, index) => ({
      ...question,
      displayNumber: index + 1, // Urutan tampilan yang sesuai
      answer: formatAnswer(question.answer)
    }));
  
  return result;
}

export function formatAnswer(answer: unknown): string {
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
  // Parse question codes to extract prefix, numeric part, and suffix
  const parseCode = (code: string) => {
    // Match pattern like "S017A" -> prefix: "S", number: 17, suffix: "A"
    const match = code.match(/^([A-Z]+)(\d+)([A-Z]*)$/);
    if (match) {
      return {
        prefix: match[1],
        number: parseInt(match[2]),
        suffix: match[3] || ''
  };
    }
    // Fallback for codes that don't match the pattern
    return {
      prefix: code.replace(/\d+/g, ''),
      number: parseInt(code.match(/\d+/)?.[0] || '0'),
      suffix: ''
    };
  };

  const parsedA = parseCode(a);
  const parsedB = parseCode(b);

  // Define priority order for prefixes
  const prefixPriority = {
    'KR': 1,  // KR001, KR002, etc. come first
    'S': 2    // S001, S002, S017A, S017B, S019, etc. come second
  };

  const priorityA = prefixPriority[parsedA.prefix as keyof typeof prefixPriority] || 999;
  const priorityB = prefixPriority[parsedB.prefix as keyof typeof prefixPriority] || 999;

  // Sort by priority first
  if (priorityA !== priorityB) {
    return priorityA - priorityB;
  }

  // If same prefix, sort by numeric part
  if (parsedA.number !== parsedB.number) {
    return parsedA.number - parsedB.number;
  }

  // If same number, sort by suffix (empty suffix comes first)
  if (parsedA.suffix !== parsedB.suffix) {
    if (parsedA.suffix === '') {
      return -1;
    }
    if (parsedB.suffix === '') {
      return 1;
    }
    return parsedA.suffix.localeCompare(parsedB.suffix);
  }

  // If everything is the same, sort alphabetically by full code
  return a.localeCompare(b);
} 

// export function formatAnswer(answer: unknown): string {
//   if (typeof answer === 'string') {
//     return answer.trim() !== '' ? answer : '(Belum diisi)';
//   }
//   if (typeof answer === 'number') {
//     return answer.toString();
//   }
//   if (Array.isArray(answer)) {
//     return answer.length > 0 ? answer.join(', ') : '(Belum diisi)';
//   }
//   return '(Belum diisi)';
// }

export function replacePlaceholders(text: string, questions: AnsweredQuestion[]): string {
  // First replace currentMonth placeholder
  const processedText = text.replace(/\$\{currentMonth\}/g, () => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const currentMonth = new Date().getMonth();
    return months[currentMonth];
  });

  // Then replace question code placeholders
  return processedText.replace(/\$\{([^}]+)\}/g, (match, placeholder) => {
    // Skip if it's currentMonth as it's already handled
    if (placeholder === 'currentMonth') {
      return match;
    }
    
    const question = questions.find(q => q.question_code === placeholder);
    if (question) {
      return formatAnswer(question.answer);
    }
    return match; // Return original placeholder if not found
  });
}