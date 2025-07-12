// src/utils/textUtils.ts
// Contoh penggunaan fungsi-fungsi text splitting

import {
  splitTextIntoSentences,
  splitTextIntoWords,
  splitTextIntoCharacters,
  splitTextIntoChunks,
  getFirstSentence,
  getLastSentence,
  countSentences,
  countWords,
  countCharacters,
  truncateToSentences,
  truncateToWords,
  extractSentencesWithKeywords,
  formatTextWithLineBreaks
} from './surveyMessageFormatters';

/**
 * Contoh penggunaan fungsi-fungsi text splitting
 */
export function demonstrateTextSplitting() {
  const sampleText = "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara. Maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia. Sebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini? Contoh: Saya sudah siap untuk mengikuti survei ini.";

  console.log("=== DEMO TEXT SPLITTING FUNCTIONS ===");
  
  // 1. Split into sentences
  const sentences = splitTextIntoSentences(sampleText);
  console.log("Sentences:", sentences);
  
  // 2. Split into words
  const words = splitTextIntoWords(sampleText);
  console.log("Words:", words);
  
  // 3. Split into characters
  const characters = splitTextIntoCharacters(sampleText);
  console.log("Characters count:", characters.length);
  
  // 4. Split into chunks
  const chunks = splitTextIntoChunks(sampleText, 50);
  console.log("Chunks (50 chars):", chunks);
  
  // 5. Get first and last sentence
  console.log("First sentence:", getFirstSentence(sampleText));
  console.log("Last sentence:", getLastSentence(sampleText));
  
  // 6. Count statistics
  console.log("Sentence count:", countSentences(sampleText));
  console.log("Word count:", countWords(sampleText));
  console.log("Character count:", countCharacters(sampleText));
  
  // 7. Truncate text
  console.log("Truncated to 2 sentences:", truncateToSentences(sampleText, 2));
  console.log("Truncated to 10 words:", truncateToWords(sampleText, 10));
  
  // 8. Extract sentences with keywords
  const keywordSentences = extractSentencesWithKeywords(sampleText, ['survei', 'wisatawan']);
  console.log("Sentences with keywords:", keywordSentences);
  
  // 9. Format with line breaks
  console.log("Formatted text:", formatTextWithLineBreaks(sampleText));
}

/**
 * Fungsi untuk animasi teks per kalimat
 * @param text Teks yang akan dianimasikan
 * @param onSentenceUpdate Callback untuk setiap kalimat yang diupdate
 * @param delay Delay antara kalimat (ms)
 */
export function animateTextBySentences(
  text: string,
  onSentenceUpdate: (currentText: string, sentenceIndex: number) => void,
  delay: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    const sentences = splitTextIntoSentences(text);
    let currentIndex = 0;
    
    const animate = () => {
      if (currentIndex < sentences.length) {
        const currentText = sentences.slice(0, currentIndex + 1).join(' ');
        onSentenceUpdate(currentText, currentIndex);
        currentIndex++;
        setTimeout(animate, delay);
      } else {
        resolve();
      }
    };
    
    animate();
  });
}

/**
 * Fungsi untuk animasi teks per kata
 * @param text Teks yang akan dianimasikan
 * @param onWordUpdate Callback untuk setiap kata yang diupdate
 * @param delay Delay antara kata (ms)
 */
export function animateTextByWords(
  text: string,
  onWordUpdate: (currentText: string, wordIndex: number) => void,
  delay: number = 200
): Promise<void> {
  return new Promise((resolve) => {
    const words = splitTextIntoWords(text);
    let currentIndex = 0;
    
    const animate = () => {
      if (currentIndex < words.length) {
        const currentText = words.slice(0, currentIndex + 1).join(' ');
        onWordUpdate(currentText, currentIndex);
        currentIndex++;
        setTimeout(animate, delay);
      } else {
        resolve();
      }
    };
    
    animate();
  });
}

/**
 * Fungsi untuk mendapatkan preview teks (kalimat pertama + ...)
 * @param text Teks lengkap
 * @param maxSentences Jumlah maksimal kalimat untuk preview
 * @returns Teks preview
 */
export function getTextPreview(text: string, maxSentences: number = 1): string {
  const sentences = splitTextIntoSentences(text);
  if (sentences.length <= maxSentences) {
    return text;
  }
  
  const preview = sentences.slice(0, maxSentences).join(' ');
  return preview + '...';
}

/**
 * Fungsi untuk mengecek apakah teks mengandung kata kunci tertentu
 * @param text Teks yang akan dicek
 * @param keywords Array kata kunci
 * @returns true jika mengandung salah satu kata kunci
 */
export function containsKeywords(text: string, keywords: string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * Fungsi untuk menghitung kemiripan teks berdasarkan kata kunci
 * @param text1 Teks pertama
 * @param text2 Teks kedua
 * @returns Skor kemiripan (0-1)
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(splitTextIntoWords(text1.toLowerCase()));
  const words2 = new Set(splitTextIntoWords(text2.toLowerCase()));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Fungsi untuk membersihkan teks dari karakter khusus
 * @param text Teks yang akan dibersihkan
 * @returns Teks yang sudah dibersihkan
 */
export function cleanText(text: string): string {
  return text
    .replace(/[^\w\s.!?,]/g, '') // Hapus karakter khusus kecuali punctuation
    .replace(/\s+/g, ' ') // Normalisasi whitespace
    .trim();
}

/**
 * Fungsi untuk mengekstrak angka dari teks
 * @param text Teks yang akan diekstrak
 * @returns Array angka yang ditemukan
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Fungsi untuk mengekstrak email dari teks
 * @param text Teks yang akan diekstrak
 * @returns Array email yang ditemukan
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.match(emailRegex) || [];
}

/**
 * Fungsi untuk mengekstrak URL dari teks
 * @param text Teks yang akan diekstrak
 * @returns Array URL yang ditemukan
 */
export function extractUrls(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || [];
} 