import { motion, AnimatePresence } from 'framer-motion';
import type { LyricWord } from '../types';
import { useEffect, useState } from 'react';

interface FallingLyricsProps {
  words: LyricWord[];
  currentTime: number;
  activeWordId: string | null;
  onWordComplete: (word: LyricWord) => void;
}

export const FallingLyrics = ({ words, currentTime, activeWordId }: FallingLyricsProps) => {
  const [visibleWords, setVisibleWords] = useState<LyricWord[]>([]);

  useEffect(() => {
    const upcoming = words.filter(
      (word) => word.startTime >= currentTime - 1 && word.startTime <= currentTime + 6
    );
    setVisibleWords(upcoming);
  }, [words, currentTime]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {visibleWords.map((word) => {
          const timeUntilWord = word.startTime - currentTime;
          const yPosition = 100 - (timeUntilWord / 6) * 100;
          const isActive = word.id === activeWordId;

          return (
            <motion.div
              key={word.id}
              initial={{ y: '-10%', opacity: 0, scale: 0.8 }}
              animate={{
                y: `${yPosition}%`,
                opacity: timeUntilWord > 0 ? 1 : 0.3,
                scale: isActive ? 1.2 : 1,
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                top: '10%',
                zIndex: isActive ? 30 : 10,
              }}
            >
              <motion.div
                className={`
                  px-6 py-3 text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider
                  ${
                    isActive
                      ? 'text-neon-cyan text-glow scale-110'
                      : 'text-white/80'
                  }
                  transition-all duration-300
                `}
                animate={
                  isActive
                    ? {
                        textShadow: [
                          '0 0 10px #00f0ff, 0 0 20px #00f0ff',
                          '0 0 20px #00f0ff, 0 0 40px #00f0ff',
                          '0 0 10px #00f0ff, 0 0 20px #00f0ff',
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {word.word}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
