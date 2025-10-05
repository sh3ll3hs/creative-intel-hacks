import { motion } from 'motion/react';

interface SearchProgressProps {
  progress: number;
  foundCount: number;
  searchQuery: string;
}

export function SearchProgress({ progress, foundCount, searchQuery }: SearchProgressProps) {
  const getETA = () => {
    const remaining = 100 - progress;
    const eta = Math.max(1, Math.round((remaining / 100) * 30)); // 30 seconds max
    return `${eta}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, y: -20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: -50, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-24 left-6 z-50"
    >
      <div className="bg-black/90 backdrop-blur-md border border-gray-600/50 rounded p-3 min-w-[280px]">
        {/* Header dots */}
        <div className="flex gap-1 mb-3">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              animate={{
                backgroundColor: progress > (i + 1) * 25 ? '#ffffff' : '#ffffff40'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Main text */}
        <div className="text-white text-sm mb-2">
          Processing opinions...
        </div>

        {/* Personas count */}
        <div className="text-white/80 text-sm mb-2">
          Personas Processed
        </div>

        {/* Count display */}
        <div className="text-white text-sm mb-3">
          <motion.span
            key={foundCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="tabular-nums"
          >
            {foundCount}
          </motion.span> / 25
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-1 bg-gray-700/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ETA */}
        <div className="text-white/80 text-sm">
          ETA: {getETA()}
        </div>
      </div>
    </motion.div>
  );
}