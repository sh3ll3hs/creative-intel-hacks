import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { Person } from '../App';

interface ProfilesStreamProps {
  isActive: boolean;
  people: Person[];
  onProfileClick: (person: Person) => void;
}

interface StreamingProfile extends Person {
  streamIndex: number;
  isVisible: boolean;
}

export function ProfilesStream({ isActive, people, onProfileClick }: ProfilesStreamProps) {
  const [streamingProfiles, setStreamingProfiles] = useState<StreamingProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setStreamingProfiles([]);
      setCurrentIndex(0);
      return;
    }

    // Generate extended profiles list (25 total)
    const extendedProfiles: Person[] = [];
    while (extendedProfiles.length < 25) {
      people.forEach((person, index) => {
        if (extendedProfiles.length < 25) {
          extendedProfiles.push({
            ...person,
            id: `${person.id}-${Math.floor(extendedProfiles.length / people.length)}`,
            name: `${person.name} ${extendedProfiles.length > people.length - 1 ? Math.floor(extendedProfiles.length / people.length) + 1 : ''}`.trim()
          });
        }
      });
    }

    const interval = setInterval(() => {
      if (currentIndex < 25) {
        const newProfile: StreamingProfile = {
          ...extendedProfiles[currentIndex],
          streamIndex: currentIndex,
          isVisible: true
        };

        setStreamingProfiles(prev => {
          const updated = [...prev, newProfile];
          // Keep only the last 5 visible
          return updated.map((profile, index) => ({
            ...profile,
            isVisible: index >= updated.length - 5
          }));
        });

        setCurrentIndex(prev => prev + 1);
      } else {
        clearInterval(interval);
      }
    }, 800); // New profile every 800ms

    return () => clearInterval(interval);
  }, [isActive, people, currentIndex]);

  const getProfileColor = (reaction: string) => {
    switch (reaction) {
      case 'intrigued': return { bg: 'from-green-400/20 to-green-600/20', border: 'border-green-400/50', text: 'text-green-400' };
      case 'inspired': return { bg: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-400/50', text: 'text-blue-400' };
      case 'partial': return { bg: 'from-orange-400/20 to-orange-600/20', border: 'border-orange-400/50', text: 'text-orange-400' };
      default: return { bg: 'from-purple-400/20 to-purple-600/20', border: 'border-purple-400/50', text: 'text-purple-400' };
    }
  };

  return (
    <div className="fixed top-24 right-6 z-40 w-80 max-h-[500px] overflow-hidden">
      <AnimatePresence mode="popLayout">
        {streamingProfiles.filter(profile => profile.isVisible).map((profile, index) => {
          const colors = getProfileColor(profile.reaction);
          
          return (
            <motion.div
              key={`${profile.id}-${profile.streamIndex}`}
              initial={{ 
                opacity: 0, 
                x: 100, 
                y: -20,
                scale: 0.8 
              }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                y: index * 85,
                scale: 1 
              }}
              exit={{ 
                opacity: 0, 
                x: -100, 
                scale: 0.8,
                transition: { duration: 0.3 }
              }}
              transition={{ 
                duration: 0.6, 
                ease: "easeOut",
                delay: 0.1
              }}
              className="absolute w-full"
            >
              {/* Light beam effect */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.3 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute -left-20 top-1/2 transform -translate-y-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent to-white/50"
                style={{ originX: 0 }}
              />

              {/* Glowing background */}
              <div className={`absolute -inset-2 bg-gradient-to-r ${colors.bg} rounded-lg blur-md opacity-50`}></div>
              
              {/* Profile card */}
              <motion.div
                className={`relative bg-black/90 backdrop-blur-md border ${colors.border} rounded-lg p-3 cursor-pointer group hover:scale-105 transition-transform duration-200`}
                onClick={() => onProfileClick(profile)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Corner light effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-white/30 to-transparent rounded-bl-lg"
                />

                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors.bg.replace('/20', '/40')} border ${colors.border} flex items-center justify-center text-white text-sm relative overflow-hidden`}
                    >
                      {profile.name.split(' ').map(n => n[0]).join('')}
                      
                      {/* Scanning line effect */}
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '-100%' }}
                        transition={{ 
                          delay: 0.5, 
                          duration: 1.5, 
                          ease: "easeInOut" 
                        }}
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                      />
                    </motion.div>
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 min-w-0">
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="space-y-1"
                    >
                      <div className="text-white text-sm truncate">{profile.name}</div>
                      <div className="text-white/60 text-xs truncate">{profile.title}</div>
                      <div className="text-white/50 text-xs truncate">{profile.location}</div>
                      
                      {/* Reaction status */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`text-xs ${colors.text} flex items-center gap-1`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                        <span className="capitalize">{profile.reaction}</span>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Status indicator */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
                    className="text-white/40 text-xs"
                  >
                    #{profile.streamIndex + 1}
                  </motion.div>
                </div>

                {/* Feedback preview */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="mt-2 pt-2 border-t border-white/10"
                >
                  <div className="text-white/60 text-xs line-clamp-2">
                    {profile.feedback.substring(0, 80)}...
                  </div>
                </motion.div>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}