import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/types/shared";
import { useState } from "react";

interface MissionStatusProps {
    filteredPeople: Person[];
    onViewFeedback: () => void;
    personaResponses?: Array<{
        id: string;
        persona_id: string | null;
        conversation: any;
    }>;
    isResponsesState?: boolean;
}

export function MissionStatus({
    filteredPeople,
    onViewFeedback,
    personaResponses = [],
    isResponsesState = false,
}: MissionStatusProps) {
    const [activeTab, setActiveTab] = useState<"personas" | "analysis">(
        "personas"
    );

    const progress =
        filteredPeople.length > 0
            ? Math.round(
                  (personaResponses.length / filteredPeople.length) * 100
              )
            : 0;

    return (
        <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto flex flex-col">
            <div className="flex-1 p-4 space-y-6">
                {activeTab === "personas" && (
                    <>
                        {/* Mission Status */}
                        <div>
                            <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        !isResponsesState
                                            ? filteredPeople.length > 0
                                                ? "bg-green-400"
                                                : "bg-yellow-400"
                                            : progress === 100
                                            ? "bg-green-400"
                                            : "bg-yellow-400"
                                    }`}
                                ></div>
                                {!isResponsesState
                                    ? "PERSONA GENERATION"
                                    : "MISSION STATUS"}
                                <span className="ml-auto text-white">
                                    {!isResponsesState
                                        ? filteredPeople.length > 0
                                            ? "ACTIVE"
                                            : "PENDING"
                                        : progress === 100
                                        ? "COMPLETE"
                                        : "IN PROGRESS"}
                                </span>
                            </div>
                            {!isResponsesState ? (
                                <div className="text-xs space-y-1 text-white/70">
                                    <div>
                                        Personas loaded: {filteredPeople.length}
                                    </div>
                                    <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
                                        <motion.div
                                            className="bg-yellow-400 h-full"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${Math.min(
                                                    100,
                                                    (filteredPeople.length /
                                                        10) *
                                                        100
                                                )}%`,
                                            }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="text-white/50">
                                        Personas Generated
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs space-y-1 text-white/70">
                                    <div>Progress: {progress}%</div>
                                    <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
                                        <div
                                            className="bg-green-400 h-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-white/50">
                                        {personaResponses.length} /{" "}
                                        {filteredPeople.length} responses
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Responses Summary */}
                        <div>
                            <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                {!isResponsesState
                                    ? "PERSONA LIST"
                                    : "PERSONA RESPONSES"}
                            </div>

                            {/* Glassmorphic Card Container */}
                            <div
                                className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20 max-h-96 overflow-y-auto"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                    boxShadow:
                                        "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
                                }}
                            >
                                <div className="relative z-10 space-y-3">
                                    {!isResponsesState ? (
                                        filteredPeople.length === 0 ? (
                                            <div className="text-center py-6">
                                                <div className="text-xs text-white/50 mb-2">
                                                    Personas Generated...
                                                </div>
                                                <div className="text-xs text-white/30">
                                                    Please wait
                                                </div>
                                            </div>
                                        ) : (
                                            filteredPeople.map((person) => (
                                                <motion.div
                                                    key={person.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="p-3 rounded bg-slate-800/40 border border-white/5"
                                                >
                                                    <div className="text-xs text-white/70 mb-1">
                                                        {person.name}
                                                    </div>
                                                    <div className="text-xs text-white/50">
                                                        {person.generation} •{" "}
                                                        {person.industry}
                                                    </div>
                                                </motion.div>
                                            ))
                                        )
                                    ) : personaResponses.length === 0 ? (
                                        <div className="text-center py-6">
                                            <div className="text-xs text-white/50 mb-2">
                                                {filteredPeople.length} personas
                                                loaded
                                            </div>
                                            <div className="text-xs text-white/30">
                                                Click Run Simulation to analyze
                                            </div>
                                        </div>
                                    ) : (
                                        personaResponses.map((response) => (
                                            <div
                                                key={response.id}
                                                className="p-3 rounded bg-slate-800/40 border border-white/5"
                                            >
                                                <div className="text-xs text-white/70 mb-1">
                                                    Response{" "}
                                                    {response.id.slice(0, 8)}
                                                </div>
                                                <div className="text-xs text-white/50">
                                                    Persona:{" "}
                                                    {response.persona_id?.slice(
                                                        0,
                                                        8
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* View All Feedback Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="mt-8"
                            >
                                <Button
                                    onClick={onViewFeedback}
                                    className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                                        boxShadow:
                                            "0 0 15px rgba(59, 130, 246, 0.15)",
                                    }}
                                >
                                    View All Personas
                                </Button>
                            </motion.div>
                        </div>
                    </>
                )}

                {activeTab === "analysis" && (
                    <div className="text-center py-12">
                        <div className="text-sm text-white/50 mb-4">
                            Simulation Analysis
                        </div>
                        <div className="text-xs text-white/30">
                            Analysis results will appear here after running the
                            simulation
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-800/50 p-2 flex gap-2">
                <button
                    onClick={() => setActiveTab("personas")}
                    className={`flex-1 py-2 px-4 rounded text-xs font-medium transition-all duration-200 ${
                        activeTab === "personas"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                            : "bg-gray-800/40 text-white/50 border border-transparent hover:bg-gray-800/60"
                    }`}
                >
                    Personas
                </button>
                <button
                    onClick={() => setActiveTab("analysis")}
                    disabled={!isResponsesState}
                    className={`flex-1 py-2 px-4 rounded text-xs font-medium transition-all duration-200 ${
                        activeTab === "analysis"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                            : isResponsesState
                            ? "bg-gray-800/40 text-white/50 border border-transparent hover:bg-gray-800/60"
                            : "bg-gray-800/20 text-white/20 border border-transparent cursor-not-allowed"
                    }`}
                >
                    Simulation Analysis
                </button>
            </div>
        </div>
    );
}
