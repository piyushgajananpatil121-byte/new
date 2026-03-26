import type { LyricLine, LyricWord } from '../types';

export const parseLyrics = (lrcContent: string): LyricLine[] => {
  const lines = lrcContent.trim().split('\n');
  const lyricLines: LyricLine[] = [];

  lines.forEach((line) => {
    const timeMatch = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1]);
      const seconds = parseFloat(timeMatch[2]);
      const startTime = minutes * 60 + seconds;
      const text = timeMatch[3].trim();

      if (text) {
        const words = text.split(' ').filter(w => w.length > 0);
        const wordDuration = 0.5;
        const lyricWords: LyricWord[] = words.map((word, index) => ({
          word,
          startTime: startTime + (index * wordDuration),
          endTime: startTime + ((index + 1) * wordDuration),
          id: `${startTime}-${index}`,
        }));

        lyricLines.push({
          words: lyricWords,
          startTime,
          endTime: startTime + (words.length * wordDuration),
          id: `line-${startTime}`,
        });
      }
    }
  });

  return lyricLines;
};

export const getCurrentWords = (lyrics: LyricLine[], currentTime: number, lookahead: number = 5): LyricWord[] => {
  const currentWords: LyricWord[] = [];

  for (const line of lyrics) {
    for (const word of line.words) {
      if (word.startTime >= currentTime && word.startTime <= currentTime + lookahead) {
        currentWords.push(word);
      }
    }
  }

  return currentWords.sort((a, b) => a.startTime - b.startTime);
};

export const getActiveWord = (lyrics: LyricLine[], currentTime: number): LyricWord | null => {
  for (const line of lyrics) {
    for (const word of line.words) {
      if (currentTime >= word.startTime && currentTime < word.endTime) {
        return word;
      }
    }
  }
  return null;
};
