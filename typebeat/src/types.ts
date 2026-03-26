export type GameMode = 'flow' | 'challenge' | 'endless';

export interface LyricWord {
  word: string;
  startTime: number;
  endTime: number;
  id: string;
}

export interface LyricLine {
  words: LyricWord[];
  startTime: number;
  endTime: number;
  id: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  lyrics: LyricLine[];
  duration: number;
  language: 'en' | 'hi' | 'te';
}

export interface GameState {
  mode: GameMode;
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  score: number;
  combo: number;
  maxCombo: number;
  accuracy: number;
  wpm: number;
  correctWords: number;
  totalWords: number;
  mistakes: number;
}

export interface GameStats {
  combo: number;
  accuracy: number;
  wpm: number;
  score: number;
}
