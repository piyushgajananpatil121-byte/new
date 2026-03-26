import { useRef, useCallback, useEffect } from 'react';

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const initAudio = useCallback((audioElement: HTMLAudioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    audioElementRef.current = audioElement;

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = ctx.createMediaElementSource(audioElement);

      gainNodeRef.current = ctx.createGain();
      filterNodeRef.current = ctx.createBiquadFilter();
      analyserRef.current = ctx.createAnalyser();

      filterNodeRef.current.type = 'lowpass';
      filterNodeRef.current.frequency.value = 22050;
      analyserRef.current.fftSize = 256;

      sourceNodeRef.current
        .connect(filterNodeRef.current)
        .connect(gainNodeRef.current)
        .connect(analyserRef.current)
        .connect(ctx.destination);
    }
  }, []);

  const applyCorrectEffect = useCallback(() => {
    if (!filterNodeRef.current || !gainNodeRef.current) return;

    filterNodeRef.current.frequency.setValueAtTime(22050, audioContextRef.current!.currentTime);
    gainNodeRef.current.gain.setValueAtTime(1, audioContextRef.current!.currentTime);
  }, []);

  const applyMistakeEffect = useCallback(() => {
    if (!filterNodeRef.current || !gainNodeRef.current || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    filterNodeRef.current.frequency.cancelScheduledValues(now);
    filterNodeRef.current.frequency.setValueAtTime(filterNodeRef.current.frequency.value, now);
    filterNodeRef.current.frequency.linearRampToValueAtTime(800, now + 0.1);
    filterNodeRef.current.frequency.linearRampToValueAtTime(22050, now + 0.3);

    gainNodeRef.current.gain.cancelScheduledValues(now);
    gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
    gainNodeRef.current.gain.linearRampToValueAtTime(0.5, now + 0.1);
    gainNodeRef.current.gain.linearRampToValueAtTime(1, now + 0.3);
  }, []);

  const applyComboEffect = useCallback((comboLevel: number) => {
    if (!gainNodeRef.current || !audioContextRef.current) return;

    const boost = Math.min(1 + (comboLevel * 0.01), 1.3);
    gainNodeRef.current.gain.setValueAtTime(boost, audioContextRef.current.currentTime);
  }, []);

  const getFrequencyData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(0);

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  const play = useCallback(async () => {
    if (audioElementRef.current && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      await audioElementRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    audioElementRef.current?.pause();
  }, []);

  const setCurrentTime = useCallback((time: number) => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = time;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    initAudio,
    play,
    pause,
    setCurrentTime,
    applyCorrectEffect,
    applyMistakeEffect,
    applyComboEffect,
    getFrequencyData,
    cleanup,
  };
};
