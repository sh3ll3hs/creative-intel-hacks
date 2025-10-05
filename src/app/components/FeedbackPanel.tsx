import { Card } from "./ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Person } from "@/types/shared";
import type { AnalysisData } from "@/app/actions/analysis";

interface FeedbackPanelProps {
    people: Person[];
    onClose: () => void;
    analysisData?: AnalysisData | null;
}

export function FeedbackPanel({ people, onClose, analysisData = null }: FeedbackPanelProps) {
    const reactionCounts = people.reduce((acc, person) => {
        acc[person.reaction] = (acc[person.reaction] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topIndustries = people.reduce((acc, person) => {
        acc[person.industry] = (acc[person.industry] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const generations = people.reduce((acc, person) => {
        acc[person.generation] = (acc[person.generation] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Reaction color mapping for clean professional look
    const getReactionColor = (reaction: string) => {
        switch (reaction) {
            case "intrigued":
            case "inspired":
                return "#22C55E"; // Green for positive
            case "skeptical":
                return "#F59E0B"; // Orange for neutral
            default:
                return "#EF4444"; // Red for negative
        }
    };

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-96 text-white z-50 overflow-y-auto"
            style={{
                background: "linear-gradient(180deg, #000000 0%, #0A0A0A 100%)",
                borderLeft: "1px solid #1C1C1C",
                boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.8)",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2
                        className="text-white tracking-wide"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "18px",
                            fontWeight: "500",
                            letterSpacing: "0.05em",
                        }}
                    >
                        FEEDBACK SUMMARY
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white/50 hover:text-white hover:bg-white/5 border-0 transition-colors duration-200"
                        style={{ width: "32px", height: "32px" }}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <div
                            className="text-white mb-1"
                            style={{
                                fontFamily: "Inter Mono, monospace",
                                fontSize: "32px",
                                fontWeight: "400",
                                lineHeight: "1",
                            }}
                        >
                            {people.length}
                        </div>
                        <div
                            className="text-white/60"
                            style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontSize: "12px",
                                fontWeight: "400",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Total Responses
                        </div>
                    </div>
                    <div>
                        <div
                            className="text-white mb-1"
                            style={{
                                fontFamily: "Inter Mono, monospace",
                                fontSize: "32px",
                                fontWeight: "400",
                                lineHeight: "1",
                            }}
                        >
                            {analysisData ? `${analysisData.sentiment.positive}%` : "94.2%"}
                        </div>
                        <div
                            className="text-white/60"
                            style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontSize: "12px",
                                fontWeight: "400",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Positive Sentiment
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gray-800 mb-8"></div>

                {/* Reaction Breakdown */}
                <div className="mb-8">
                    <h3
                        className="text-white/90 mb-4"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Reaction Breakdown
                    </h3>

                    <div className="space-y-4">
                        {Object.entries(reactionCounts).map(
                            ([reaction, count]) => {
                                const percentage = (
                                    (count / people.length) *
                                    100
                                ).toFixed(1);
                                const color = getReactionColor(reaction);
                                return (
                                    <div key={reaction}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span
                                                className="text-white/80 capitalize"
                                                style={{
                                                    fontFamily:
                                                        "Inter, system-ui, sans-serif",
                                                    fontSize: "13px",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                {reaction}
                                            </span>
                                            <span
                                                className="text-white/60"
                                                style={{
                                                    fontFamily:
                                                        "Inter Mono, monospace",
                                                    fontSize: "12px",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-sm overflow-hidden">
                                            <motion.div
                                                className="h-1 rounded-sm"
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${percentage}%`,
                                                }}
                                                transition={{
                                                    delay: 0.5,
                                                    duration: 1,
                                                    ease: "easeOut",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gray-800 mb-8"></div>

                {/* Top Industries */}
                <div className="mb-8">
                    <h3
                        className="text-white/90 mb-4"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Top Industries
                    </h3>

                    <div className="space-y-3">
                        {Object.entries(topIndustries)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([industry, count]) => (
                                <div
                                    key={industry}
                                    className="flex items-center justify-between"
                                >
                                    <span
                                        className="text-white/70"
                                        style={{
                                            fontFamily:
                                                "Inter, system-ui, sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        {industry}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Inter Mono, monospace",
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            color: "#48A9A6",
                                        }}
                                    >
                                        {count}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gray-800 mb-8"></div>

                {/* Generations */}
                <div className="mb-8">
                    <h3
                        className="text-white/90 mb-4"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Generations
                    </h3>

                    <div className="space-y-3">
                        {Object.entries(generations).map(
                            ([generation, count]) => (
                                <div
                                    key={generation}
                                    className="flex items-center justify-between"
                                >
                                    <span
                                        className="text-white/70"
                                        style={{
                                            fontFamily:
                                                "Inter, system-ui, sans-serif",
                                            fontSize: "13px",
                                            fontWeight: "400",
                                        }}
                                    >
                                        {generation}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "Inter Mono, monospace",
                                            fontSize: "12px",
                                            fontWeight: "400",
                                            color: "#F5D76E",
                                        }}
                                    >
                                        {count}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gray-800 mb-8"></div>

                {/* Key Insights */}
                <div className="mb-10">
                    <h3
                        className="text-white/90 mb-4"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "14px",
                            fontWeight: "500",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Key Insights
                    </h3>

                    <div
                        className="p-4 rounded-sm"
                        style={{
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid #1C1C1C",
                        }}
                    >
                        <ul className="space-y-3">
                            {(analysisData?.highlights || [
                                "Gen X shows highest engagement (67%)",
                                "Fintech professionals most receptive",
                                "Urban demographics prefer innovation",
                                "25-49 age group drives sentiment"
                            ]).map((insight, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 text-white/70"
                                    style={{
                                        fontFamily: "Inter, system-ui, sans-serif",
                                        fontSize: "12px",
                                        fontWeight: "400",
                                        lineHeight: "1.4",
                                    }}
                                >
                                    <span className="text-white/40 mt-1">•</span>
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Export Options */}
                <div className="space-y-3">
                    <Button
                        className="w-full text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all duration-200"
                        style={{
                            background: "#1A1A1A",
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "13px",
                            fontWeight: "500",
                            height: "40px",
                            letterSpacing: "0.02em",
                        }}
                    >
                        Export Full Report
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 hover:text-white transition-all duration-200"
                        style={{
                            fontFamily: "Inter, system-ui, sans-serif",
                            fontSize: "13px",
                            fontWeight: "500",
                            height: "40px",
                            letterSpacing: "0.02em",
                            background: "transparent",
                        }}
                    >
                        Save to Project
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
