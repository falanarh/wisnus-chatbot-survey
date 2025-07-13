// Utility untuk survei
export interface AnsweredQuestion {
  question_code: string;
  question_text: string;
  answer: unknown;
}

export function getValidAnsweredQuestions(answeredQuestionsData: AnsweredQuestion[], sortQuestionCodes: (a: string, b: string) => number) {
  console.log("getValidAnsweredQuestions input:", answeredQuestionsData);
  
  const filteredQuestions = answeredQuestionsData.filter(question => {
    const isValid = question.answer !== "N/A" && question.answer !== "n/a";
    if (!isValid) {
      console.log(`Filtered out question ${question.question_code} with answer:`, question.answer);
    }
    return isValid;
  });
  
  console.log("After filtering:", filteredQuestions);
  
  const sortedQuestions = filteredQuestions.sort((a, b) => sortQuestionCodes(a.question_code, b.question_code));
  console.log("After sorting:", sortedQuestions.map(q => q.question_code));
  
  const result = sortedQuestions.map((question, index) => ({
    ...question,
    displayNumber: index + 1, // Urutan tampilan yang sesuai
    answer: formatAnswer(question.answer)
  }));
  
  console.log("Final result:", result);
  return result;
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
  
  // Debug logging for sorting
  console.log(`Sorting: ${a} vs ${b}`);
  console.log(`  ${a}: prefix=${parsedA.prefix}, number=${parsedA.number}, suffix=${parsedA.suffix}`);
  console.log(`  ${b}: prefix=${parsedB.prefix}, number=${parsedB.number}, suffix=${parsedB.suffix}`);

  // Define priority order for prefixes
  const prefixPriority = {
    'KR': 1,  // KR001, KR002, etc. come first
    'S': 2    // S001, S002, S017A, S017B, S019, etc. come second
  };

  const priorityA = prefixPriority[parsedA.prefix as keyof typeof prefixPriority] || 999;
  const priorityB = prefixPriority[parsedB.prefix as keyof typeof prefixPriority] || 999;

  // Sort by priority first
  if (priorityA !== priorityB) {
    const result = priorityA - priorityB;
    console.log(`  Result: ${result < 0 ? a : b} comes first (priority)`);
    return result;
  }

  // If same prefix, sort by numeric part
  if (parsedA.number !== parsedB.number) {
    const result = parsedA.number - parsedB.number;
    console.log(`  Result: ${result < 0 ? a : b} comes first (numeric)`);
    return result;
  }

  // If same number, sort by suffix (empty suffix comes first)
  if (parsedA.suffix !== parsedB.suffix) {
    if (parsedA.suffix === '') {
      console.log(`  Result: ${a} comes before ${b} (empty suffix)`);
      return -1;
    }
    if (parsedB.suffix === '') {
      console.log(`  Result: ${b} comes before ${a} (empty suffix)`);
      return 1;
    }
    const result = parsedA.suffix.localeCompare(parsedB.suffix);
    console.log(`  Result: ${result < 0 ? a : b} comes first (suffix comparison)`);
    return result;
  }

  // If everything is the same, sort alphabetically by full code
  const result = a.localeCompare(b);
  console.log(`  Result: ${result < 0 ? a : b} comes first (alphabetical)`);
  return result;
} 