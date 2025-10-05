"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, LogOut } from "lucide-react";
import { CenteredVideoAnalysis } from "@/app/components/CenteredVideoAnalysis";
import { TowaReactionModal } from "@/app/components/TowaReactionModal";
import { FeedbackPanel } from "@/app/components/FeedbackPanel";
import { SearchProgress } from "@/app/components/SearchProgress";
import { ProfilesStream } from "@/app/components/ProfilesStream";
import {
    AnalysisReport,
    ExpandedReport,
} from "@/app/components/AnalysisReport";
import { VideoAnalysisSidebar } from "@/app/components/VideoAnalysisSidebar";
import { getPersonasByJobId, getJobById } from "@/app/actions/personas";
import { mockPeople } from "@/lib/mockPeople";
import type { Person } from "@/types/shared";

export default function SimulationPage() {
    const { username, projectId } = useParams();
    const router = useRouter();

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const [isSimulating, setIsSimulating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [foundCount, setFoundCount] = useState(0);
    const [showSearchProgress, setShowSearchProgress] = useState(false);
    const [showProfilesStream, setShowProfilesStream] = useState(false);
    const [showAnalysisReport, setShowAnalysisReport] = useState(false);
    const [showExpandedReport, setShowExpandedReport] = useState(false);

    // Prompt state
    const [prompt, setPrompt] = useState("");

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
    const personas =
        fetchedPersonas && fetchedPersonas.length > 0
            ? fetchedPersonas
            : mockPeople;

    // Prompt change handler
    const handlePromptChange = (value: string) => {
        setPrompt(value);
    };

    // Simulation handler
    const handleSimulate = () => {
        if (prompt.trim()) {
            startSimulation(personas);
        }
    };

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
                            onClick={() =>
                                router.push(
                                    `/${username}/projects/${projectId}/dashboard`
                                )
                            }
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
                                {job?.demographic ||
                                    "Analyzing persona reactions"}
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
                    <CenteredVideoAnalysis
                        jobId={projectId as string}
                        prompt={prompt}
                        onPromptChange={handlePromptChange}
                        onSimulate={handleSimulate}
                        isSimulating={isSimulating}
                        showAnalysisReport={showAnalysisReport}
                    />
                </div>

                {/* Right Sidebar */}
                <VideoAnalysisSidebar
                    showAnalysisReport={showAnalysisReport}
                    onViewFeedback={() => setShowFeedback(true)}
                />
            </div>

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
                        isVisible={showAnalysisReport}
                        people={personas}
                        onExpand={() => setShowExpandedReport(true)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showExpandedReport && (
                    <ExpandedReport
                        isOpen={showExpandedReport}
                        people={personas}
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
