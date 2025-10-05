"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut, Play } from "lucide-react";
import { InteractiveNetworkViz } from "@/app/components/InteractiveNetworkViz";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { MissionStatus } from "@/app/components/MissionStatus";
import { getPersonasByJobId, getJobById, getPersonaResponses } from "@/app/actions/personas";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";
import apiClient from "@/lib/api-client";

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

    // Fetch persona responses with polling
    const { data: personaResponses, isLoading: responsesLoading } = useQuery({
        queryKey: ["personaResponses", projectId],
        queryFn: () => getPersonaResponses(projectId as string),
        enabled: !!projectId,
        refetchInterval: 5000, // Poll every 5 seconds
    });

    const isLoading = personasLoading || jobLoading;

    // Use fetched personas if available, otherwise fallback to mock data
    const personas =
        fetchedPersonas && fetchedPersonas.length > 0
            ? fetchedPersonas
            : mockPeople;

    // Persona response mutation
    const { mutateAsync: createResponses, isPending: creatingResponses } = useMutation({
        mutationFn: async () => {
            const response = await apiClient.POST("/{job_id}/responses", {
                params: {
                    path: {
                        job_id: projectId as string,
                    },
                },
            });
            return response.data;
        },
    });

    const handleRunSimulation = async () => {
        try {
            // Trigger persona response generation
            await createResponses();

            // Navigate to simulation page
            router.push(`/${username}/projects/${projectId}/simulation`);
        } catch (error) {
            console.error("Error generating responses:", error);
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
                                {job?.demographic ||
                                    "Explore personas and run simulation"}
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
                {/* Main Area - Interactive Network Visualization */}
                <div className="flex-1 relative">
                    <InteractiveNetworkViz
                        people={personas}
                        isRunning={false}
                        onRunSimulation={handleRunSimulation}
                    />
                </div>

                {/* Right Sidebar */}
                <MissionStatus
                    filteredPeople={personas}
                    onViewFeedback={() => setShowFeedback(true)}
                    personaResponses={personaResponses}
                />
            </div>

            {/* Fixed Run Simulation Button */}
            <motion.div
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        onClick={handleRunSimulation}
                        disabled={personas.length === 0 || creatingResponses}
                        className="px-8 py-4 text-white border-2 border-transparent relative overflow-hidden group text-lg shadow-2xl"
                        style={{
                            background:
                                "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
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
                            {creatingResponses ? "Generating Responses..." : "Run Simulation"}
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
