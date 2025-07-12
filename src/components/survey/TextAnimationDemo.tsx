import React, { useState } from 'react';
import { AnimatedText, TypewriterText, ProgressiveText, useTextAnimation } from './AnimatedText';
import {
  splitTextIntoSentences,
  splitTextIntoWords,
  countSentences,
  countWords,
  getTextPreview,
  extractSentencesWithKeywords
} from '../../utils/surveyMessageFormatters';

const TextAnimationDemo: React.FC = () => {
  const [sampleText, setSampleText] = useState(
    "Selamat datang! Survei ini bertujuan untuk mengumpulkan informasi tentang profil wisatawan nusantara. Maksud perjalanan, akomodasi yang digunakan, lama perjalanan, dan rata-rata pengeluaran terkait perjalanan yang dilakukan oleh penduduk Indonesia di dalam wilayah teritorial Indonesia. Sebelum memulai, apakah Anda sudah siap untuk mengikuti survei ini?"
  );
  const [animationType, setAnimationType] = useState<'sentences' | 'words' | 'characters'>('sentences');
  const [delay, setDelay] = useState(1000);
  const [showDemo, setShowDemo] = useState(false);

  // Hook example
  const { displayText, isAnimating, startAnimation, resetAnimation } = useTextAnimation(
    sampleText,
    animationType,
    delay
  );

  const handleAnalyzeText = () => {
    const sentences = splitTextIntoSentences(sampleText);
    const words = splitTextIntoWords(sampleText);
    const sentenceCount = countSentences(sampleText);
    const wordCount = countWords(sampleText);
    const preview = getTextPreview(sampleText, 2);
    const keywordSentences = extractSentencesWithKeywords(sampleText, ['survei', 'wisatawan']);

    console.log('=== TEXT ANALYSIS ===');
    console.log('Sentences:', sentences);
    console.log('Words:', words);
    console.log('Sentence count:', sentenceCount);
    console.log('Word count:', wordCount);
    console.log('Preview:', preview);
    console.log('Sentences with keywords:', keywordSentences);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Text Splitting & Animation Demo</h1>

      {/* Text Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Sample Text:
        </label>
        <textarea
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
          placeholder="Enter your text here..."
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Animation Type:
          </label>
          <select
            value={animationType}
            onChange={(e) => setAnimationType(e.target.value as any)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
            <option value="characters">Characters</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Delay (ms):
          </label>
          <input
            type="number"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-lg"
            min="100"
            max="5000"
            step="100"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            {showDemo ? 'Hide' : 'Show'} Demo
          </button>
        </div>
      </div>

      {/* Analysis Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyzeText}
          className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
        >
          Analyze Text (Check Console)
        </button>
      </div>

      {/* Demo Section */}
      {showDemo && (
        <div className="space-y-8">
          {/* AnimatedText Component */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">AnimatedText Component</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
              <AnimatedText
                text={sampleText}
                animationType={animationType}
                delay={delay}
                className="text-lg"
                onAnimationComplete={() => console.log('Animation completed!')}
              />
            </div>
          </div>

          {/* TypewriterText Component */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">TypewriterText Component</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
              <TypewriterText
                text={sampleText}
                speed={50}
                className="text-lg"
                onComplete={() => console.log('Typewriter completed!')}
              />
            </div>
          </div>

          {/* ProgressiveText Component */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">ProgressiveText Component</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
              <ProgressiveText
                text={sampleText}
                sentencesPerStep={1}
                delay={1500}
                className="text-lg"
                onStepComplete={(step, total) => console.log(`Step ${step}/${total} completed`)}
                onComplete={() => console.log('Progressive text completed!')}
              />
            </div>
          </div>

          {/* Hook Example */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">useTextAnimation Hook</h2>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[100px] mb-4">
              <div className="text-lg">
                {displayText}
                {isAnimating && <span className="animate-pulse text-blue-500">|</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Start Animation
              </button>
              <button
                onClick={resetAnimation}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Text Statistics */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Text Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{countSentences(sampleText)}</div>
                <div className="text-sm text-gray-600">Sentences</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{countWords(sampleText)}</div>
                <div className="text-sm text-gray-600">Words</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sampleText.length}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((countWords(sampleText) / countSentences(sampleText)) * 10) / 10}
                </div>
                <div className="text-sm text-gray-600">Words/Sentence</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnimationDemo; 