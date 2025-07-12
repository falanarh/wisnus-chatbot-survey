import React, { useState, useEffect } from 'react';
import { animateTextBySentences, animateTextByWords } from '../../utils/textUtils';

interface AnimatedTextProps {
  text: string;
  animationType?: 'sentences' | 'words' | 'characters';
  delay?: number;
  className?: string;
  onAnimationComplete?: () => void;
  showCursor?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  animationType = 'sentences',
  delay = 1000,
  className = '',
  onAnimationComplete,
  showCursor = true
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    setIsAnimating(true);
    setDisplayText('');

    if (animationType === 'sentences') {
      animateTextBySentences(
        text,
        (currentText) => {
          setDisplayText(currentText);
        },
        delay
      ).then(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      });
    } else if (animationType === 'words') {
      animateTextByWords(
        text,
        (currentText) => {
          setDisplayText(currentText);
        },
        delay
      ).then(() => {
        setIsAnimating(false);
        onAnimationComplete?.();
      });
    } else {
      // Characters animation
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
          onAnimationComplete?.();
        }
      }, delay);
    }
  }, [text, animationType, delay, onAnimationComplete]);

  return (
    <div className={`animated-text ${className}`}>
      <span>{displayText}</span>
      {showCursor && isAnimating && (
        <span className="animate-pulse text-blue-500">|</span>
      )}
    </div>
  );
};

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  className = '',
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }

    setDisplayText('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className={`typewriter-text ${className}`}>
      <span>{displayText}</span>
      <span className="animate-pulse text-blue-500">|</span>
    </div>
  );
};

interface ProgressiveTextProps {
  text: string;
  sentencesPerStep?: number;
  delay?: number;
  className?: string;
  onStepComplete?: (step: number, totalSteps: number) => void;
  onComplete?: () => void;
}

export const ProgressiveText: React.FC<ProgressiveTextProps> = ({
  text,
  sentencesPerStep = 1,
  delay = 1500,
  className = '',
  onStepComplete,
  onComplete
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }

    setDisplayText('');
    setIsComplete(false);

    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
    const totalSteps = Math.ceil(sentences.length / sentencesPerStep);
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      const endIndex = Math.min(currentStep * sentencesPerStep, sentences.length);
      const currentSentences = sentences.slice(0, endIndex);
      
      setDisplayText(currentSentences.join(' '));
      onStepComplete?.(currentStep, totalSteps);

      if (endIndex >= sentences.length) {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, sentencesPerStep, delay, onStepComplete, onComplete]);

  return (
    <div className={`progressive-text ${className}`}>
      <span>{displayText}</span>
      {!isComplete && (
        <span className="animate-pulse text-blue-500 ml-1">|</span>
      )}
    </div>
  );
};

// Hook untuk menggunakan animasi teks
export const useTextAnimation = (
  text: string,
  animationType: 'sentences' | 'words' | 'characters' = 'sentences',
  delay: number = 1000
) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (!text) return;

    setIsAnimating(true);
    setDisplayText('');

    if (animationType === 'sentences') {
      animateTextBySentences(
        text,
        (currentText) => setDisplayText(currentText),
        delay
      ).then(() => setIsAnimating(false));
    } else if (animationType === 'words') {
      animateTextByWords(
        text,
        (currentText) => setDisplayText(currentText),
        delay
      ).then(() => setIsAnimating(false));
    }
  };

  const resetAnimation = () => {
    setDisplayText('');
    setIsAnimating(false);
  };

  return {
    displayText,
    isAnimating,
    startAnimation,
    resetAnimation
  };
}; 