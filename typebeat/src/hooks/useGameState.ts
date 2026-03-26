import { useState, useCallback } from 'react';
import type { GameState, GameMode, Song } from '../types';

const initialState: GameState = {
  mode: 'challenge',
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  accuracy: 100,
  wpm: 0,
  correctWords: 0,
  totalWords: 0,
  mistakes: 0,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const startGame = useCallback((song: Song, mode: GameMode) => {
    setGameState({
      ...initialState,
      currentSong: song,
      mode,
      isPlaying: true,
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const updateTime = useCallback((time: number) => {
    setGameState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const recordCorrectWord = useCallback(() => {
    setGameState(prev => {
      const newCombo = prev.combo + 1;
      const newCorrect = prev.correctWords + 1;
      const newTotal = prev.totalWords + 1;
      const newAccuracy = (newCorrect / newTotal) * 100;
      const comboBonus = Math.floor(newCombo / 10) * 50;
      const newScore = prev.score + 100 + comboBonus;

      return {
        ...prev,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        correctWords: newCorrect,
        totalWords: newTotal,
        accuracy: newAccuracy,
        score: newScore,
      };
    });
  }, []);

  const recordMistake = useCallback(() => {
    setGameState(prev => {
      const newTotal = prev.totalWords + 1;
      const newAccuracy = (prev.correctWords / newTotal) * 100;

      return {
        ...prev,
        combo: 0,
        mistakes: prev.mistakes + 1,
        totalWords: newTotal,
        accuracy: newAccuracy,
      };
    });
  }, []);

  const updateWPM = useCallback((wpm: number) => {
    setGameState(prev => ({ ...prev, wpm }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    updateTime,
    recordCorrectWord,
    recordMistake,
    updateWPM,
    resetGame,
  };
};
