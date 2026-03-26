import { useState } from 'react';
import type { Song, GameMode } from './types';
import { SongSelector } from './components/SongSelector';
import { GameScreen } from './components/GameScreen';

type AppState = 'menu' | 'playing';

function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedMode, setSelectedMode] = useState<GameMode>('challenge');

  const handleStartGame = (song: Song, mode: GameMode) => {
    setSelectedSong(song);
    setSelectedMode(mode);
    setAppState('playing');
  };

  const handleExitGame = () => {
    setAppState('menu');
    setSelectedSong(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      {appState === 'menu' && <SongSelector onSelectSong={handleStartGame} />}
      {appState === 'playing' && selectedSong && (
        <GameScreen song={selectedSong} mode={selectedMode} onExit={handleExitGame} />
      )}
    </div>
  );
}

export default App;
