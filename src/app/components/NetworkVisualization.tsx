import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { Person } from '../App';

interface NetworkVisualizationProps {
  people: Person[];
  onPersonClick: (person: Person) => void;
  uploadedVideo?: File | null;
  isSimulating?: boolean;
  searchComplete?: boolean;
}

interface AnimatedPerson extends Person {
  animatedPosition: { x: number; y: number; z: number };
  screenPosition: { x: number; y: number };
  scale: number;
  isVisible: boolean;
}

export function NetworkVisualization({ people, onPersonClick, uploadedVideo, isSimulating = false, searchComplete = false }: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatedPeople, setAnimatedPeople] = useState<AnimatedPerson[]>([]);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Generate random positions on a sphere surface
  const generateSpherePositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * Math.random()); // Inclination angle
      const theta = 2 * Math.PI * Math.random(); // Azimuth angle
      
      const radius = 200 + Math.random() * 100; // Varying distance from center
      
      positions.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi)
      });
    }
    return positions;
  };

  useEffect(() => {
    if (containerSize.width && containerSize.height && people.length > 0) {
      const spherePositions = generateSpherePositions(people.length);
      
      const convertedPeople: AnimatedPerson[] = people.map((person, index) => {
        const pos3d = spherePositions[index];
        
        // Project 3D position to 2D screen coordinates
        const perspective = 800;
        const centerX = containerSize.width / 2;
        const centerY = containerSize.height / 2;
        
        const rotatedX = pos3d.x * Math.cos(rotation.y) - pos3d.z * Math.sin(rotation.y);
        const rotatedZ = pos3d.x * Math.sin(rotation.y) + pos3d.z * Math.cos(rotation.y);
        const rotatedY = pos3d.y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x);
        const finalZ = pos3d.y * Math.sin(rotation.x) + rotatedZ * Math.cos(rotation.x);
        
        const scale = perspective / (perspective + finalZ);
        const screenX = centerX + rotatedX * scale;
        const screenY = centerY + rotatedY * scale;
        
        return {
          ...person,
          animatedPosition: pos3d,
          screenPosition: { x: screenX, y: screenY },
          scale: Math.max(0.3, scale),
          isVisible: finalZ > -100
        };
      });

      setAnimatedPeople(convertedPeople);
    }
  }, [people, containerSize, rotation]);

  // Auto-rotate the globe
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.005
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getPersonColor = (reaction: string) => {
    switch (reaction) {
      case 'intrigued': return { bg: 'from-green-400 to-green-600', dot: 'bg-green-400' };
      case 'inspired': return { bg: 'from-blue-400 to-blue-600', dot: 'bg-blue-400' };
      case 'partial': return { bg: 'from-orange-400 to-orange-600', dot: 'bg-orange-400' };
      default: return { bg: 'from-purple-400 to-purple-600', dot: 'bg-purple-400' };
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative bg-transparent overflow-hidden"
    >
      {/* Globe wireframe effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Longitude lines */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`long-${i}`}
              className="absolute border border-white/5 rounded-full"
              style={{
                width: '400px',
                height: '400px',
                left: '-200px',
                top: '-200px',
                transform: `rotateY(${i * 30}deg) rotateX(${rotation.x}deg)`,
              }}
              animate={{
                rotateY: i * 30 + rotation.y * 180 / Math.PI,
              }}
              transition={{ duration: 0 }}
            />
          ))}
          
          {/* Latitude lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`lat-${i}`}
              className="absolute border border-white/5 rounded-full"
              style={{
                width: `${400 * Math.sin((i + 1) * Math.PI / 7)}px`,
                height: `${400 * Math.sin((i + 1) * Math.PI / 7)}px`,
                left: `-${200 * Math.sin((i + 1) * Math.PI / 7)}px`,
                top: `-${200 * Math.sin((i + 1) * Math.PI / 7)}px`,
                transform: `translateY(${100 * Math.cos((i + 1) * Math.PI / 7)}px)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Central Planet (Uploaded Video) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
      >
        <div className="relative">
          <motion.div
            className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 relative overflow-hidden"
            animate={{
              rotate: 360,
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
          >
            {/* Planet surface texture */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_50%)]"></div>
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/30 rounded-full"></div>
                <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full"></div>
              </div>
              
              {/* Video indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs opacity-80">
                  {uploadedVideo ? '🎬' : 'VIDEO'}
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/20 to-green-500/20 blur-md"></div>
          </motion.div>
        </div>
      </motion.div>

      {/* People Dots floating around */}
      {animatedPeople.map((person, index) => (
        person.isVisible && (
          <motion.div
            key={person.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: person.scale,
              opacity: 1,
              x: person.screenPosition.x,
              y: person.screenPosition.y
            }}
            transition={{ 
              delay: searchComplete ? index * 0.05 : index * 0.1,
              duration: searchComplete ? 0.8 : 0.6,
              type: "spring",
              stiffness: searchComplete ? 300 : 200
            }}
            className="absolute cursor-pointer group z-10"
            style={{
              left: '-6px',
              top: '-6px',
              zIndex: Math.floor(person.scale * 100)
            }}
            onClick={() => onPersonClick(person)}
          >
            <div className="relative">
              {/* Star burst effect when search completes */}
              {searchComplete && (
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 1.2,
                    ease: "easeOut"
                  }}
                >
                  {/* Star rays */}
                  {[...Array(8)].map((_, rayIndex) => (
                    <motion.div
                      key={rayIndex}
                      className="absolute w-8 h-0.5 bg-gradient-to-r from-yellow-300 via-white to-transparent"
                      style={{
                        transformOrigin: '0 50%',
                        transform: `rotate(${rayIndex * 45}deg)`,
                        left: '6px',
                        top: '6px'
                      }}
                      initial={{ scaleX: 0, opacity: 1 }}
                      animate={{ scaleX: 1, opacity: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.8,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {/* Enhanced pulse effect */}
              <motion.div
                className={`absolute inset-0 rounded-full ${getPersonColor(person.reaction).dot}`}
                animate={{
                  scale: searchComplete ? [1, 2, 1] : [1, 1.5, 1],
                  opacity: searchComplete ? [0.8, 0.3, 0.8] : [0.6, 0.2, 0.6]
                }}
                transition={{
                  duration: searchComplete ? 1.5 : 2 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: searchComplete ? index * 0.05 : 0
                }}
              />
              
              {/* Main Star Dot */}
              <motion.div 
                className={`
                  w-3 h-3 rounded-full ${getPersonColor(person.reaction).dot}
                  border border-white/30 backdrop-blur-sm
                  group-hover:scale-150 group-hover:border-white/60
                  transition-all duration-300 relative z-10
                  shadow-lg
                `}
                animate={{
                  boxShadow: searchComplete 
                    ? [
                        `0 0 10px ${getPersonColor(person.reaction).dot.replace('bg-', '#')}80`,
                        `0 0 20px ${getPersonColor(person.reaction).dot.replace('bg-', '#')}ff`,
                        `0 0 10px ${getPersonColor(person.reaction).dot.replace('bg-', '#')}80`
                      ]
                    : `0 4px 6px -1px ${getPersonColor(person.reaction).dot.replace('bg-', '#')}50`
                }}
                transition={{
                  duration: 2,
                  repeat: searchComplete ? Infinity : 0,
                  ease: "easeInOut",
                  delay: searchComplete ? index * 0.05 : 0
                }}
              >
                {/* Enhanced inner glow */}
                <motion.div 
                  className="absolute inset-0.5 rounded-full bg-white/30"
                  animate={{
                    opacity: searchComplete ? [0.3, 0.8, 0.3] : 0.3
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: searchComplete ? Infinity : 0,
                    ease: "easeInOut",
                    delay: searchComplete ? index * 0.05 : 0
                  }}
                />
                
                {/* Star core */}
                {searchComplete && (
                  <motion.div
                    className="absolute inset-1 rounded-full bg-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0.7] }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                  />
                )}
              </motion.div>

              {/* Hover Info */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-0 group-hover:scale-100">
                <div className="bg-black/90 text-white text-xs p-2 rounded border border-white/20 whitespace-nowrap backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-white">{person.name}</div>
                    <div className="text-white/60">{person.title}</div>
                    <div className="text-white/60">{person.location}</div>
                    <div className="text-green-400 text-[10px] mt-1">Click to explore →</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      ))}

      {/* Connection lines between nearby dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
        {animatedPeople.map((person, index) => 
          animatedPeople.slice(index + 1).map((otherPerson, otherIndex) => {
            if (!person.isVisible || !otherPerson.isVisible) return null;
            
            const distance = Math.sqrt(
              Math.pow(person.screenPosition.x - otherPerson.screenPosition.x, 2) +
              Math.pow(person.screenPosition.y - otherPerson.screenPosition.y, 2)
            );
            
            if (distance < 150) {
              return (
                <motion.line
                  key={`${person.id}-${otherPerson.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  transition={{ delay: Math.random() * 2 }}
                  x1={person.screenPosition.x}
                  y1={person.screenPosition.y}
                  x2={otherPerson.screenPosition.x}
                  y2={otherPerson.screenPosition.y}
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                />
              );
            }
            return null;
          })
        )}
        
        {/* SVG Gradients */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06d6a0" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: searchComplete ? 1 : 3 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <div className={`text-sm transition-all duration-300 ${
          searchComplete ? 'text-green-300' : 'text-white/40'
        }`}>
          {searchComplete 
            ? `✨ Found ${animatedPeople.filter(p => p.isVisible).length} matching personas • Click any star to explore`
            : `Click any dot to explore as a planet • ${animatedPeople.filter(p => p.isVisible).length} people found`
          }
        </div>
      </motion.div>
    </div>
  );
}