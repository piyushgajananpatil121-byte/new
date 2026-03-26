import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Song, GameMode } from '../types';
import { sampleSongs, getSampleLyrics, getAudioUrl } from '../data/sampleSongs';
import { parseLyrics } from '../utils/lyricsParser';

interface SongSelectorProps {
  onSelectSong: (song: Song, mode: GameMode) => void;
}

export const SongSelector = ({ onSelectSong }: SongSelectorProps) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('challenge');
  const [customLyrics, setCustomLyrics] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleSampleSong = (sampleSong: Song) => {
    const lyricsText = getSampleLyrics(sampleSong.id);
    const parsedLyrics = parseLyrics(lyricsText);
    const audioUrl = getAudioUrl(sampleSong.id);
    const song: Song = {
      ...sampleSong,
      lyrics: parsedLyrics,
      audioUrl,
    };
    onSelectSong(song, selectedMode);
  };

  const handleCustomSong = () => {
    if (!customLyrics.trim()) return;

    const parsedLyrics = parseLyrics(customLyrics);
    const audioUrl = getAudioUrl('sample-1');
    const song: Song = {
      id: 'custom-' + Date.now(),
      title: 'Custom Song',
      artist: 'You',
      audioUrl,
      lyrics: parsedLyrics,
      duration: 60,
      language: 'en',
    };
    onSelectSong(song, selectedMode);
  };

  const modes: Array<{ id: GameMode; name: string; description: string }> = [
    { id: 'flow', name: 'Flow Mode', description: 'Pure immersion, no distractions' },
    { id: 'challenge', name: 'Challenge Mode', description: 'Score-based with stats tracking' },
    { id: 'endless', name: 'Endless Mode', description: 'Keep typing forever' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,240,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,0,255,0.1),transparent_50%)]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-4 text-glow bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent"
            animate={{
              textShadow: [
                '0 0 20px #00f0ff',
                '0 0 40px #ff00ff',
                '0 0 20px #00f0ff',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            TypeBeat
          </motion.h1>
          <p className="text-xl text-gray-400">Type the rhythm. Feel the beat.</p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center text-neon-cyan">Select Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${
                    selectedMode === mode.id
                      ? 'border-neon-cyan bg-neon-cyan/10 neon-glow'
                      : 'border-gray-700 bg-black/30 hover:border-gray-600'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                <p className="text-sm text-gray-400">{mode.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-neon-purple">Choose a Song</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleSongs.map((song) => (
              <motion.button
                key={song.id}
                onClick={() => handleSampleSong(song)}
                className="p-6 rounded-xl border-2 border-gray-700 bg-black/30 hover:border-neon-purple hover:bg-neon-purple/10 transition-all text-left"
                whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(139, 0, 255, 0.5)' }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-2xl font-bold mb-2">{song.title}</h3>
                <p className="text-gray-400">{song.artist}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm">
                    {song.duration}s
                  </span>
                  <span className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-sm uppercase">
                    {song.language}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className="w-full p-4 rounded-xl border-2 border-dashed border-gray-700 hover:border-neon-green bg-black/30 hover:bg-neon-green/10 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-neon-green font-bold">+ Add Custom Lyrics</span>
          </motion.button>

          {showCustomInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <textarea
                value={customLyrics}
                onChange={(e) => setCustomLyrics(e.target.value)}
                placeholder="Paste LRC format lyrics here...
Example:
[00:00.50]Type these words
[00:02.00]Feel the rhythm"
                className="w-full h-40 p-4 bg-black/50 border-2 border-gray-700 rounded-xl text-white focus:border-neon-green outline-none resize-none"
              />
              <motion.button
                onClick={handleCustomSong}
                disabled={!customLyrics.trim()}
                className="w-full p-4 rounded-xl bg-neon-green text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: customLyrics.trim() ? 1.02 : 1 }}
                whileTap={{ scale: customLyrics.trim() ? 0.98 : 1 }}
              >
                Start with Custom Lyrics
              </motion.button>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>No login required. Just pick a song and start typing.</p>
        </div>
      </motion.div>
    </div>
  );
};
