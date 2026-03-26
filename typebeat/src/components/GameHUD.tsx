import { motion, AnimatePresence } from 'framer-motion';
import type { GameStats } from '../types';

interface GameHUDProps {
  stats: GameStats;
  progress: number;
  isFlowMode?: boolean;
}

export const GameHUD = ({ stats, progress, isFlowMode = false }: GameHUDProps) => {
  if (isFlowMode) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-0 z-20 p-6">
      <div className="max-w-7xl mx-auto flex items-start justify-between">
        <div className="flex gap-6">
          <motion.div
            className="relative"
            animate={stats.combo > 0 ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Combo</div>
              <div
                className={`text-4xl font-bold ${
                  stats.combo > 20
                    ? 'text-neon-pink text-glow'
                    : stats.combo > 10
                    ? 'text-neon-purple text-glow'
                    : 'text-neon-cyan'
                }`}
              >
                {stats.combo}x
              </div>
              <AnimatePresence>
                {stats.combo > 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl"
                  >
                    🔥
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Accuracy</div>
            <div
              className={`text-4xl font-bold ${
                stats.accuracy >= 95
                  ? 'text-neon-green'
                  : stats.accuracy >= 80
                  ? 'text-neon-cyan'
                  : 'text-neon-red'
              }`}
            >
              {stats.accuracy.toFixed(0)}%
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">WPM</div>
            <div className="text-4xl font-bold text-neon-purple">{stats.wpm}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">Score</div>
          <motion.div
            key={stats.score}
            initial={{ scale: 1.2, color: '#00f0ff' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-4xl font-bold"
          >
            {stats.score.toLocaleString()}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        <div className="w-full h-2 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink neon-glow"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
