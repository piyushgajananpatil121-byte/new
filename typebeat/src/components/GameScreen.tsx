import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Song, GameMode } from '../types';
import { GameHUD } from './GameHUD';
import { FallingLyrics } from './FallingLyrics';
import { TypeInput } from './TypeInput';
import { DynamicBackground } from './DynamicBackground';
import { useGameState } from '../hooks/useGameState';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { getActiveWord, getCurrentWords } from '../utils/lyricsParser';

interface GameScreenProps {
  song: Song;
  mode: GameMode;
  onExit: () => void;
}

export const GameScreen = ({ song, mode, onExit }: GameScreenProps) => {
  const { gameState, recordCorrectWord, recordMistake, updateTime, updateWPM } = useGameState();
  const audioEngine = useAudioEngine();
  const [currentTime, setCurrentTime] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [targetWord, setTargetWord] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const wordsTypedRef = useRef<number>(0);

  const updateFrequencyData = useCallback(() => {
    const data = audioEngine.getFrequencyData();
    setFrequencyData(data);
  }, [audioEngine]);

  useEffect(() => {
    if (!audioRef.current) return;

    audioEngine.initAudio(audioRef.current);

    const startPlayback = async () => {
      await audioEngine.play();
    };

    startPlayback();

    return () => {
      audioEngine.cleanup();
    };
  }, [audioEngine]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateFrequencyData();
    }, 50);

    return () => clearInterval(interval);
  }, [updateFrequencyData]);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const time = audioRef.current.currentTime;
        setCurrentTime(time);
        updateTime(time);

        const active = getActiveWord(song.lyrics, time);
        if (active) {
          setActiveWord(active.id);
          setTargetWord(active.word);
        } else {
          setActiveWord(null);
          setTargetWord('');
        }
      }
    };

    const handleEnded = () => {
      onExit();
    };

    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song, updateTime, onExit]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTimeRef.current) / 60000;
      const wpm = elapsedMinutes > 0 ? Math.round(wordsTypedRef.current / elapsedMinutes) : 0;
      updateWPM(wpm);
    }, 1000);

    return () => clearInterval(interval);
  }, [updateWPM]);

  const handleCorrectWord = useCallback(() => {
    recordCorrectWord();
    audioEngine.applyCorrectEffect();
    audioEngine.applyComboEffect(gameState.combo + 1);
    wordsTypedRef.current += 1;
  }, [recordCorrectWord, audioEngine, gameState.combo]);

  const handleMistake = useCallback(() => {
    recordMistake();
    audioEngine.applyMistakeEffect();
  }, [recordMistake, audioEngine]);

  const progress = song.duration > 0 ? (currentTime / song.duration) * 100 : 0;
  const upcomingWords = getCurrentWords(song.lyrics, currentTime, 6);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <DynamicBackground frequencyData={frequencyData} isPlaying={true} />

      <audio ref={audioRef} src={song.audioUrl} />

      <GameHUD
        stats={{
          combo: gameState.combo,
          accuracy: gameState.accuracy,
          wpm: gameState.wpm,
          score: gameState.score,
        }}
        progress={progress}
        isFlowMode={mode === 'flow'}
      />

      <FallingLyrics
        words={upcomingWords}
        currentTime={currentTime}
        activeWordId={activeWord}
        onWordComplete={() => {}}
      />

      <TypeInput
        targetWord={targetWord}
        onCorrect={handleCorrectWord}
        onMistake={handleMistake}
        isActive={!!activeWord}
      />

      <motion.button
        onClick={onExit}
        className="fixed top-6 right-6 z-40 px-6 py-3 bg-red-600/80 hover:bg-red-600 rounded-lg font-bold backdrop-blur-sm transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Exit
      </motion.button>

      {mode !== 'flow' && (
        <div className="fixed bottom-6 left-6 z-20 text-sm text-gray-400">
          <div>{song.title} - {song.artist}</div>
          <div className="mt-1 capitalize">{mode} Mode</div>
        </div>
      )}
    </div>
  );
};
