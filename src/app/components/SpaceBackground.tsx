import { motion } from 'motion/react';

export function SpaceBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Animated light gradients */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(ellipse 1200px 800px at 20% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 25%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)',
            'radial-gradient(ellipse 1000px 600px at 80% 20%, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 30%, rgba(6, 182, 212, 0.06) 60%, transparent 80%)',
            'radial-gradient(ellipse 1400px 900px at 60% 80%, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.08) 35%, rgba(99, 102, 241, 0.06) 65%, transparent 85%)',
            'radial-gradient(ellipse 800px 500px at 30% 70%, rgba(16, 185, 129, 0.08) 0%, rgba(139, 92, 246, 0.06) 40%, rgba(99, 102, 241, 0.04) 70%, transparent 90%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary gradient layer */}
      <motion.div
        className="absolute inset-0 opacity-15"
        animate={{
          background: [
            'radial-gradient(circle 600px at 70% 40%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle 800px at 30% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle 500px at 90% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%)',
            'radial-gradient(circle 700px at 10% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
        {/* Large stars */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`large-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
        
        {/* Medium stars */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`medium-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Small stars */}
        {[...Array(60)].map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute w-px h-px bg-white/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Subtle geometric grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Flowing light streaks */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            'linear-gradient(45deg, transparent 0%, rgba(99, 102, 241, 0.3) 50%, transparent 100%)',
            'linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.3) 50%, transparent 100%)',
            'linear-gradient(225deg, transparent 0%, rgba(6, 182, 212, 0.3) 50%, transparent 100%)',
            'linear-gradient(315deg, transparent 0%, rgba(16, 185, 129, 0.3) 50%, transparent 100%)',
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}