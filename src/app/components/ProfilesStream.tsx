import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import type { Person } from '@/types/shared';

interface ProfilesStreamProps {
  people: Person[];
  onComplete: () => void;
}

interface StreamingProfile extends Person {
  streamIndex: number;
  isVisible: boolean;
}

export function ProfilesStream({ people, onComplete }: ProfilesStreamProps) {
  const [streamingProfiles, setStreamingProfiles] = useState<StreamingProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < people.length) {
        const newProfile: StreamingProfile = {
          ...people[currentIndex],
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
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 400); // New profile every 400ms

    return () => clearInterval(interval);
  }, [currentIndex, people, onComplete]);

  const getProfileColor = (reaction: string) => {
    switch (reaction) {
      case 'intrigued': return { bg: 'from-green-400/20 to-green-600/20', border: 'border-green-400/50', text: 'text-green-400' };
      case 'inspired': return { bg: 'from-blue-400/20 to-blue-600/20', border: 'border-blue-400/50', text: 'text-blue-400' };
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
                scale: 0.8
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut"
              }}
              className="absolute w-full"
            >
              {/* Profile card */}
              <div className={`relative bg-black/90 backdrop-blur-md border ${colors.border} rounded-lg p-3`}>
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${colors.bg.replace('/20', '/40')} border ${colors.border} flex items-center justify-center text-white text-sm`}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  {/* Profile info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{profile.name}</div>
                    <div className="text-white/60 text-xs truncate">{profile.title}</div>

                    {/* Reaction status */}
                    <div className={`text-xs ${colors.text} flex items-center gap-1 mt-1`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}`}></div>
                      <span className="capitalize">{profile.reaction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}