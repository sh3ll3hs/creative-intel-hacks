"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut, Play, Pause } from "lucide-react";
import { NetworkVisualization } from "@/app/components/NetworkVisualization";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { SearchProgress } from "@/app/components/SearchProgress";
import { ProfilesStream } from "@/app/components/ProfilesStream";
import { AnalysisReport, ExpandedReport } from "@/app/components/AnalysisReport";
import { VideoAnalysisSidebar } from "@/app/components/VideoAnalysisSidebar";
import { getPersonasByJobId, getJobById } from "@/app/actions/personas";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";

export default function SimulationPage() {
  const { username, projectId } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [showSearchProgress, setShowSearchProgress] = useState(false);
  const [showProfilesStream, setShowProfilesStream] = useState(false);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [showExpandedReport, setShowExpandedReport] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch personas for this job (projectId = jobId)
  const { data: fetchedPersonas, isLoading: personasLoading } = useQuery({
    queryKey: ["personas", projectId],
    queryFn: () => getPersonasByJobId(projectId as string),
    enabled: !!projectId,
  });

  // Fetch job details
  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ["job", projectId],
    queryFn: () => getJobById(projectId as string),
    enabled: !!projectId,
  });

  const isLoading = personasLoading || jobLoading;

  // Use fetched personas if available, otherwise fallback to mock data
  const personas = fetchedPersonas && fetchedPersonas.length > 0 ? fetchedPersonas : mockPeople;

  // Auto-start simulation when personas are loaded
  useEffect(() => {
    if (personas.length > 0 && !isSimulating && !showAnalysisReport) {
      startSimulation(personas);
    }
  }, [personas.length]);

  const startSimulation = (people: Person[]) => {
    setIsSimulating(true);
    setShowSearchProgress(true);
    setShowProfilesStream(false);
    setShowAnalysisReport(false);
    setProgress(0);
    setFoundCount(people.length);

    // Simulate search progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setShowSearchProgress(false);
            setShowProfilesStream(true);

            setTimeout(() => {
              setShowProfilesStream(false);
              setShowAnalysisReport(true);
              setIsSimulating(false);
            }, 3000);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 8 + 2;
      });
    }, 300);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-transparent border-t-white/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Stars Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => {
          const colors = ['bg-white', 'bg-blue-300', 'bg-purple-300', 'bg-cyan-300', 'bg-pink-300'];
          const sizes = ['w-0.5 h-0.5', 'w-1 h-1', 'w-1.5 h-1.5', 'w-2 h-2'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
          
          return (
            <motion.div
              key={i}
              className={`absolute ${randomSize} ${randomColor} rounded-full`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Header */}
      <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/${username}/projects/${projectId}/dashboard`)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl text-white">Simulation</h1>
              <p className="text-sm text-white/60">
                {job?.demographic || "Analyzing persona reactions"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Main Content Area */}
        <div className="flex-1 relative overflow-auto">
          <div className="flex flex-col items-center justify-start min-h-full px-8 py-12">
            {/* Video Player */}
            {job?.ads?.video_url && (
              <motion.div
                className="w-full max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: "rgba(11, 17, 32, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(110, 231, 183, 0.2)",
                    boxShadow: "0 0 40px rgba(110, 231, 183, 0.1)",
                  }}
                >
                  <div
                    className="relative aspect-video cursor-pointer group"
                    onClick={handleVideoClick}
                  >
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                    >
                      <source src={job.ads.video_url} type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />

                    {/* Play/Pause Control */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className="bg-black/60 backdrop-blur-sm rounded-full p-4"
                        style={{
                          border: "1px solid rgba(110, 231, 183, 0.3)",
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8 text-white" />
                        ) : (
                          <Play className="w-8 h-8 text-white" />
                        )}
                      </div>
                    </motion.div>

                    {/* Analyzing Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-6 right-6"
                    >
                      <div
                        className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm text-white"
                        style={{
                          background: "rgba(37, 99, 235, 0.2)",
                          borderColor: "rgba(37, 99, 235, 0.4)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                            }}
                          />
                          <span>Analyzing…</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Video Description */}
            {job?.ads?.description && (
              <motion.div
                className="w-full max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "rgba(11, 17, 32, 0.4)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(110, 231, 183, 0.2)",
                  }}
                >
                  <p className="text-white/80 leading-relaxed text-center">
                    {job.ads.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Network Visualization Background */}
            <div className="absolute inset-0 z-0 opacity-60">
              <NetworkVisualization
                people={personas}
                onPersonClick={setSelectedPerson}
                uploadedVideo={null}
                isSimulating={isSimulating}
                searchComplete={!isSimulating && showAnalysisReport}
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <VideoAnalysisSidebar
          showAnalysisReport={showAnalysisReport}
          onViewFeedback={() => setShowFeedback(true)}
        />
      </div>

      {/* Center Circle with Name */}
      <motion.div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-white/20 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 backdrop-blur-sm flex items-center justify-center shadow-2xl group relative overflow-hidden"
          style={{
            boxShadow: "0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(236, 72, 153, 0.3), 0 0 90px rgba(6, 182, 212, 0.2)"
          }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(236, 72, 153, 0.6), 0 0 120px rgba(6, 182, 212, 0.4)"
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Shine effect overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" />
          
          {/* Glossy overlay */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
          
          <motion.div
            className="text-white text-xs font-bold text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            YOU
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showSearchProgress && (
          <SearchProgress
            progress={progress}
            foundCount={foundCount}
            searchQuery={job?.demographic || ""}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfilesStream && (
          <ProfilesStream
            people={personas}
            onComplete={() => {
              setShowProfilesStream(false);
              setShowAnalysisReport(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnalysisReport && (
          <AnalysisReport
            people={personas}
            searchQuery={job?.demographic || ""}
            onExpand={() => setShowExpandedReport(true)}
            onClose={() => setShowAnalysisReport(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExpandedReport && (
          <ExpandedReport
            people={personas}
            searchQuery={job?.demographic || ""}
            onClose={() => setShowExpandedReport(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPerson && (
          <TowaReactionModal
            person={selectedPerson}
            onClose={() => setSelectedPerson(null)}
            onAddToFeedback={(person) => {
              console.log("Adding to feedback:", person.name);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <FeedbackPanel
            people={personas}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
