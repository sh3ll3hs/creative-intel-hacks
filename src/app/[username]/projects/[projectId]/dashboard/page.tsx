"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut, Play } from "lucide-react";
import { NetworkVisualization } from "@/app/components/NetworkVisualization";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { MissionStatus } from "@/app/components/MissionStatus";
import { getPersonasByJobId, getJobById } from "@/app/actions/personas";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";

export default function DashboardPage() {
  const { username, projectId } = useParams();
  const router = useRouter();

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

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

  const handleRunSimulation = () => {
    // Navigate to simulation page
    router.push(`/${username}/projects/${projectId}/simulation`);
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
              onClick={() => router.push(`/${username}/projects`)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl text-white">Dashboard</h1>
              <p className="text-sm text-white/60">
                {job?.demographic || "Explore personas and run simulation"}
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
        {/* Main Area - Network Visualization */}
        <div className="flex-1 relative">
          <NetworkVisualization
            people={personas}
            onPersonClick={setSelectedPerson}
            uploadedVideo={null}
            isSimulating={false}
            searchComplete={false}
          />
          
        </div>

        {/* Right Sidebar */}
        <MissionStatus
          filteredPeople={personas}
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

      {/* Fixed Run Simulation Button */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleRunSimulation}
            disabled={personas.length === 0}
            className="px-8 py-4 text-white border-2 border-transparent relative overflow-hidden group text-lg shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
              borderRadius: "12px",
            }}
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                filter: "blur(4px)",
              }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Run Simulation
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Modals */}
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
