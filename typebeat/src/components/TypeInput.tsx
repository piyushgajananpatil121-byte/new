import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeInputProps {
  targetWord: string;
  onCorrect: () => void;
  onMistake: () => void;
  isActive: boolean;
}

export const TypeInput = ({ targetWord, onCorrect, onMistake, isActive }: TypeInputProps) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      setInput('');
      setFeedback(null);
    }
  }, [targetWord, isActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 0) {
      const isCorrectSoFar = targetWord.toLowerCase().startsWith(value.toLowerCase());

      if (!isCorrectSoFar) {
        setFeedback('wrong');
        onMistake();
        setTimeout(() => setFeedback(null), 300);
      }
    }

    if (value.toLowerCase() === targetWord.toLowerCase()) {
      setFeedback('correct');
      onCorrect();
      setTimeout(() => {
        setInput('');
        setFeedback(null);
      }, 200);
    }
  };

  const getInputColor = () => {
    if (feedback === 'correct') return 'border-neon-green text-neon-green';
    if (feedback === 'wrong') return 'border-neon-red text-neon-red';
    if (input.length > 0) return 'border-neon-cyan text-neon-cyan';
    return 'border-gray-700 text-white';
  };

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="relative"
          >
            <div className="text-center mb-3 text-gray-400 text-sm uppercase tracking-widest">
              Type the word
            </div>

            <motion.input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              className={`
                w-full px-8 py-6 text-4xl md:text-5xl font-bold text-center
                bg-black/50 backdrop-blur-md rounded-2xl border-4
                ${getInputColor()}
                outline-none transition-all duration-200
                ${feedback === 'correct' ? 'neon-glow scale-105' : ''}
                ${feedback === 'wrong' ? 'animate-shake' : ''}
              `}
              placeholder={targetWord}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              animate={
                feedback === 'correct'
                  ? { scale: [1, 1.05, 1] }
                  : feedback === 'wrong'
                  ? { x: [-10, 10, -10, 10, 0] }
                  : {}
              }
              transition={{ duration: 0.3 }}
            />

            <AnimatePresence>
              {feedback === 'correct' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 text-6xl"
                >
                  ✓
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <div className="text-center text-gray-500 text-lg">
          Get ready...
        </div>
      )}
    </div>
  );
};
