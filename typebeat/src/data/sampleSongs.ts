import type { Song } from '../types';
import { generateBeepTrack } from '../utils/audioGenerator';

const sampleLyrics1 = `[00:00.50]Welcome to the rhythm zone
[00:03.00]Feel the beat in your bones
[00:05.50]Type the words as they flow
[00:08.00]Let the music take control
[00:10.50]Every letter syncs with sound
[00:13.00]Perfect timing all around
[00:15.50]Keep your focus stay on track
[00:18.00]There is no turning back
[00:20.50]Speed it up don't miss a beat
[00:23.00]Feel the energy and heat
[00:25.50]Words are falling from above
[00:28.00]This is what we truly love
[00:30.50]Neon lights are shining bright
[00:33.00]Typing through the endless night
[00:35.50]Combo rising feel the power
[00:38.00]This is your finest hour`;

const sampleLyrics2 = `[00:00.50]Digital dreams in neon streams
[00:03.00]Nothing is quite what it seems
[00:05.50]Fingers dancing on the keys
[00:08.00]Moving with such graceful ease
[00:10.50]Cyberpunk aesthetic glow
[00:13.00]Watch the rhythm as it flows
[00:15.50]Every word a perfect strike
[00:18.00]Typing faster through the night
[00:20.50]Letters falling from the sky
[00:23.00]Reach for them and amplify
[00:25.50]Accuracy is what we need
[00:28.00]Type with incredible speed
[00:30.50]Music pumping in your ears
[00:33.00]Overcome all of your fears
[00:35.50]This is more than just a game
[00:38.00]Setting records making names`;

let audioUrl1: string | null = null;
let audioUrl2: string | null = null;

export const initializeAudio = () => {
  if (!audioUrl1) audioUrl1 = generateBeepTrack(40);
  if (!audioUrl2) audioUrl2 = generateBeepTrack(40);
};

export const sampleSongs: Song[] = [
  {
    id: 'sample-1',
    title: 'Rhythm Zone',
    artist: 'TypeBeat',
    audioUrl: '',
    lyrics: [],
    duration: 40,
    language: 'en',
  },
  {
    id: 'sample-2',
    title: 'Digital Dreams',
    artist: 'TypeBeat',
    audioUrl: '',
    lyrics: [],
    duration: 40,
    language: 'en',
  },
];

export const getAudioUrl = (songId: string): string => {
  initializeAudio();
  switch (songId) {
    case 'sample-1':
      return audioUrl1 || '';
    case 'sample-2':
      return audioUrl2 || '';
    default:
      return audioUrl1 || '';
  }
};

export const getSampleLyrics = (songId: string): string => {
  switch (songId) {
    case 'sample-1':
      return sampleLyrics1;
    case 'sample-2':
      return sampleLyrics2;
    default:
      return sampleLyrics1;
  }
};
