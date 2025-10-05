import { motion } from 'motion/react';
import { useMemo } from 'react';

interface StarField {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinkleDelay: number;
  color: 'white' | 'violet' | 'cyan';
}

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export function StableSpaceBackground() {
  // Generate a fixed, seeded starfield and particles
  const { starfield, particles } = useMemo(() => {
    const stars: StarField[] = [];
    const dustParticles: Particle[] = [];
    const seed = 12345; // Fixed seed for consistent positions
    let random = seed;
    
    const seededRandom = () => {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    };

    // Generate 100 stars (reduced from 150 for performance)
    for (let i = 0; i < 100; i++) {
      stars.push({
        id: `star-${i}`,
        x: seededRandom() * 100,
        y: seededRandom() * 100,
        size: seededRandom() > 0.8 ? (seededRandom() * 2 + 1) : 1,
        brightness: 0.3 + seededRandom() * 0.5,
        twinkleDelay: seededRandom() * 8,
        color: 'white',
      });
    }

    // Generate fixed dust particles (reduced from 35 to 15)
    for (let i = 0; i < 15; i++) {
      dustParticles.push({
        id: `dust-${i}`,
        x: seededRandom() * 100,
        y: seededRandom() * 100,
        size: seededRandom() > 0.7 ? 2 : 1,
        opacity: 0.05 + seededRandom() * 0.1,
      });
    }
    
    return { starfield: stars, particles: dustParticles };
  }, []);

  const getStarColor = (color: 'white' | 'violet' | 'cyan') => {
    // Pure vintage monochromatic white for all stars
    return 'rgba(255, 255, 255, 0.7)';
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Deep Navy to Black Gradient Base */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #020617 0%, #0B1120 50%, #020617 100%)'
        }}
      />

      {/* Simplified Film Grain */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Simplified Nebula System */}
      <div className="absolute inset-0">
        {/* Primary Central Nebula */}
        <motion.div
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[1400px] h-[600px] opacity-4"
          animate={{
            scale: [1, 1.01, 1],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.015) 40%, transparent 80%)',
            filter: 'blur(4px)',
          }}
        />
        
        {/* Secondary Nebula */}
        <motion.div
          className="absolute top-1/5 right-1/4 w-[800px] h-[400px] opacity-3"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 100, repeat: Infinity, ease: "easeInOut", delay: 30 }}
          style={{
            background: 'radial-gradient(ellipse 50% 60% at 60% 40%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.01) 50%, transparent 85%)',
            filter: 'blur(5px)',
          }}
        />
      </div>

      {/* Fixed Position Starfield */}
      <div className="absolute inset-0">
        {starfield.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: getStarColor(star.color),
              boxShadow: `0 0 ${star.size}px ${getStarColor(star.color)}`,
            }}
            animate={{
              opacity: [star.brightness * 0.7, star.brightness, star.brightness * 0.7],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Simplified Orbit Ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ rotate: 360 }}
          transition={{
            duration: 600, // Reduced from 1200 for better performance
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Single Ring - Vintage monochromatic */}
          <div 
            className="w-[600px] h-[600px] rounded-full border opacity-6"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: '1px',
            }}
          />
        </motion.div>
      </div>

      {/* Optimized Dust Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: `rgba(255, 255, 255, ${particle.opacity})`,
            }}
            animate={{
              opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Subtle Vignette */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 0%, transparent 70%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
    </div>
  );
}