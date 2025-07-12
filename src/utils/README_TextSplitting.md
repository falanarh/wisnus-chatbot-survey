# Text Splitting & Animation Utilities

Kumpulan fungsi utilitas untuk memecah teks menjadi berbagai format dan komponen React untuk animasi teks.

## 📁 File Structure

```
src/utils/
├── surveyMessageFormatters.tsx  # Fungsi utama text splitting
├── textUtils.ts                 # Contoh penggunaan & fungsi tambahan
└── README_TextSplitting.md      # Dokumentasi ini

src/components/survey/
├── AnimatedText.tsx             # Komponen animasi teks
└── TextAnimationDemo.tsx        # Demo komponen
```

## 🚀 Fungsi Utama

### 1. `splitTextIntoSentences(text: string): string[]`

Memecah teks menjadi array kalimat berdasarkan tanda baca (., !, ?).

```typescript
import { splitTextIntoSentences } from './utils/surveyMessageFormatters';

const text = "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi. Apakah Anda siap?";
const sentences = splitTextIntoSentences(text);
// Result: ["Selamat datang!", "Survei ini bertujuan untuk mengumpulkan informasi.", "Apakah Anda siap?"]
```

### 2. `splitTextIntoWords(text: string): string[]`

Memecah teks menjadi array kata-kata.

```typescript
import { splitTextIntoWords } from './utils/surveyMessageFormatters';

const text = "Selamat datang di survei wisatawan";
const words = splitTextIntoWords(text);
// Result: ["Selamat", "datang", "di", "survei", "wisatawan"]
```

### 3. `splitTextIntoCharacters(text: string): string[]`

Memecah teks menjadi array karakter individual.

```typescript
import { splitTextIntoCharacters } from './utils/surveyMessageFormatters';

const text = "Hello";
const characters = splitTextIntoCharacters(text);
// Result: ["H", "e", "l", "l", "o"]
```

### 4. `splitTextIntoChunks(text: string, chunkSize: number): string[]`

Memecah teks menjadi chunk dengan ukuran tertentu.

```typescript
import { splitTextIntoChunks } from './utils/surveyMessageFormatters';

const text = "Ini adalah teks yang panjang";
const chunks = splitTextIntoChunks(text, 10);
// Result: ["Ini adalah ", "teks yang ", "panjang"]
```

## 📊 Fungsi Analisis

### 1. `countSentences(text: string): number`

Menghitung jumlah kalimat dalam teks.

```typescript
import { countSentences } from './utils/surveyMessageFormatters';

const text = "Kalimat pertama. Kalimat kedua. Kalimat ketiga.";
const count = countSentences(text);
// Result: 3
```

### 2. `countWords(text: string): number`

Menghitung jumlah kata dalam teks.

```typescript
import { countWords } from './utils/surveyMessageFormatters';

const text = "Ini adalah contoh teks";
const count = countWords(text);
// Result: 4
```

### 3. `countCharacters(text: string): number`

Menghitung jumlah karakter (tanpa spasi).

```typescript
import { countCharacters } from './utils/surveyMessageFormatters';

const text = "Hello World";
const count = countCharacters(text);
// Result: 10 (tanpa spasi)
```

## ✂️ Fungsi Manipulasi

### 1. `getFirstSentence(text: string): string`

Mengambil kalimat pertama dari teks.

```typescript
import { getFirstSentence } from './utils/surveyMessageFormatters';

const text = "Kalimat pertama. Kalimat kedua.";
const first = getFirstSentence(text);
// Result: "Kalimat pertama."
```

### 2. `getLastSentence(text: string): string`

Mengambil kalimat terakhir dari teks.

```typescript
import { getLastSentence } from './utils/surveyMessageFormatters';

const text = "Kalimat pertama. Kalimat kedua.";
const last = getLastSentence(text);
// Result: "Kalimat kedua."
```

### 3. `truncateToSentences(text: string, maxSentences: number): string`

Memotong teks hingga jumlah kalimat tertentu.

```typescript
import { truncateToSentences } from './utils/surveyMessageFormatters';

const text = "Kalimat 1. Kalimat 2. Kalimat 3. Kalimat 4.";
const truncated = truncateToSentences(text, 2);
// Result: "Kalimat 1. Kalimat 2."
```

### 4. `truncateToWords(text: string, maxWords: number): string`

Memotong teks hingga jumlah kata tertentu.

```typescript
import { truncateToWords } from './utils/surveyMessageFormatters';

const text = "Ini adalah contoh teks yang panjang";
const truncated = truncateToWords(text, 3);
// Result: "Ini adalah contoh..."
```

## 🔍 Fungsi Pencarian

### 1. `extractSentencesWithKeywords(text: string, keywords: string[]): string[]`

Mengekstrak kalimat yang mengandung kata kunci tertentu.

```typescript
import { extractSentencesWithKeywords } from './utils/surveyMessageFormatters';

const text = "Survei ini tentang wisatawan. Data akan dikumpulkan. Wisatawan domestik.";
const sentences = extractSentencesWithKeywords(text, ['survei', 'wisatawan']);
// Result: ["Survei ini tentang wisatawan.", "Wisatawan domestik."]
```

### 2. `containsKeywords(text: string, keywords: string[]): boolean`

Mengecek apakah teks mengandung kata kunci.

```typescript
import { containsKeywords } from './utils/textUtils';

const text = "Survei wisatawan nusantara";
const hasKeywords = containsKeywords(text, ['survei', 'wisatawan']);
// Result: true
```

## 🎨 Komponen React

### 1. `AnimatedText`

Komponen untuk animasi teks dengan berbagai tipe.

```typescript
import { AnimatedText } from './components/survey/AnimatedText';

<AnimatedText
  text="Teks yang akan dianimasikan"
  animationType="sentences" // 'sentences' | 'words' | 'characters'
  delay={1000}
  onAnimationComplete={() => console.log('Selesai!')}
/>
```

### 2. `TypewriterText`

Komponen untuk efek typewriter.

```typescript
import { TypewriterText } from './components/survey/AnimatedText';

<TypewriterText
  text="Teks typewriter"
  speed={50} // ms per karakter
  onComplete={() => console.log('Selesai!')}
/>
```

### 3. `ProgressiveText`

Komponen untuk menampilkan teks secara bertahap per kalimat.

```typescript
import { ProgressiveText } from './components/survey/AnimatedText';

<ProgressiveText
  text="Kalimat 1. Kalimat 2. Kalimat 3."
  sentencesPerStep={1}
  delay={1500}
  onStepComplete={(step, total) => console.log(`${step}/${total}`)}
/>
```

### 4. `useTextAnimation` Hook

Hook untuk mengontrol animasi teks secara programatik.

```typescript
import { useTextAnimation } from './components/survey/AnimatedText';

const { displayText, isAnimating, startAnimation, resetAnimation } = useTextAnimation(
  text,
  'sentences',
  1000
);
```

## 🎯 Contoh Penggunaan dalam Chat

```typescript
import { splitTextIntoSentences, animateTextBySentences } from './utils/surveyMessageFormatters';

// Dalam komponen chat message
const ChatMessage = ({ message }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    // Animate text by sentences
    animateTextBySentences(
      message.text,
      (currentText) => setDisplayText(currentText),
      1000
    );
  }, [message.text]);

  return (
    <div className="chat-message">
      <p>{displayText}</p>
    </div>
  );
};
```

## 🔧 Fungsi Tambahan

### Text Processing

```typescript
import { 
  cleanText, 
  extractNumbers, 
  extractEmails, 
  extractUrls,
  calculateTextSimilarity 
} from './utils/textUtils';

// Membersihkan teks
const clean = cleanText("Teks dengan karakter khusus!@#");

// Ekstrak angka
const numbers = extractNumbers("Harga Rp 150.000 dan Rp 200.000");

// Ekstrak email
const emails = extractEmails("Contact: user@example.com");

// Ekstrak URL
const urls = extractUrls("Visit https://example.com");

// Hitung kemiripan teks
const similarity = calculateTextSimilarity("Teks A", "Teks B");
```

## 📝 Demo

Untuk melihat demo lengkap, gunakan komponen `TextAnimationDemo`:

```typescript
import TextAnimationDemo from './components/survey/TextAnimationDemo';

// Dalam halaman atau route
<TextAnimationDemo />
```

## 🎨 Styling

Komponen animasi menggunakan Tailwind CSS classes dan dapat dikustomisasi:

```typescript
<AnimatedText
  text="Custom styled text"
  className="text-lg font-semibold text-blue-600"
/>
```

## ⚡ Performance Tips

1. **Gunakan `useMemo` untuk text splitting yang mahal:**
```typescript
const sentences = useMemo(() => splitTextIntoSentences(longText), [longText]);
```

2. **Debounce animasi untuk input real-time:**
```typescript
const debouncedText = useDebounce(inputText, 300);
```

3. **Cleanup timers dalam useEffect:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    // animation logic
  }, delay);
  
  return () => clearTimeout(timer);
}, [text]);
```

## 🐛 Troubleshooting

### Masalah Umum

1. **Regex tidak mengenali kalimat dengan tanda baca ganda:**
   - Fungsi sudah menangani kasus ini dengan regex `(?<=[.!?])\s+`

2. **Animasi tidak berhenti:**
   - Pastikan cleanup function di useEffect
   - Cek kondisi stop animation

3. **Performance issue dengan teks panjang:**
   - Gunakan chunking untuk teks > 1000 karakter
   - Implementasikan virtual scrolling jika perlu

### Debug

```typescript
// Enable debug logging
console.log('Sentences:', splitTextIntoSentences(text));
console.log('Words:', splitTextIntoWords(text));
console.log('Animation state:', isAnimating);
``` 