import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { motion } from "motion/react";
import { X, TrendingUp, Users, MessageSquare, BarChart } from "lucide-react";
import type { Person } from "../App";

interface FeedbackPanelProps {
    people: Person[];
    onClose: () => void;
}

export function FeedbackPanel({ people, onClose }: FeedbackPanelProps) {
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

    return (
        <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-96 bg-black/95 border-l border-yellow-500/30 text-white font-mono z-50 overflow-y-auto"
        >
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl text-yellow-400">
                        FEEDBACK SUMMARY
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Overview Stats */}
                <Card className="bg-yellow-950/20 border-yellow-500/30 p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-2xl text-yellow-400">
                                {people.length}
                            </div>
                            <div className="text-xs text-white/60">
                                TOTAL RESPONSES
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl text-yellow-400">
                                94.2%
                            </div>
                            <div className="text-xs text-white/60">
                                ACCURACY RATE
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Reaction Distribution */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                            REACTION BREAKDOWN
                        </span>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(reactionCounts).map(
                            ([reaction, count]) => {
                                const percentage = (
                                    (count / people.length) *
                                    100
                                ).toFixed(1);
                                return (
                                    <div key={reaction} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <Badge
                                                className={`${
                                                    reaction === "intrigued"
                                                        ? "bg-green-600"
                                                        : reaction ===
                                                          "inspired"
                                                        ? "bg-blue-600"
                                                        : "bg-orange-600"
                                                } text-white`}
                                            >
                                                {reaction.toUpperCase()}
                                            </Badge>
                                            <span className="text-white/70">
                                                {count} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <motion.div
                                                className={`h-2 rounded-full ${
                                                    reaction === "intrigued"
                                                        ? "bg-green-500"
                                                        : reaction ===
                                                          "inspired"
                                                        ? "bg-blue-500"
                                                        : "bg-orange-500"
                                                }`}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${percentage}%`,
                                                }}
                                                transition={{
                                                    delay: 0.5,
                                                    duration: 1,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Demographics */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                            TOP INDUSTRIES
                        </span>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(topIndustries)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([industry, count]) => (
                                <div
                                    key={industry}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-white/90">
                                        {industry}
                                    </span>
                                    <span className="text-yellow-400">
                                        {count}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Generations */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <BarChart className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                            GENERATIONS
                        </span>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(generations).map(
                            ([generation, count]) => (
                                <div
                                    key={generation}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-white/90">
                                        {generation}
                                    </span>
                                    <span className="text-yellow-400">
                                        {count}
                                    </span>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Key Insights */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">
                            KEY INSIGHTS
                        </span>
                    </div>

                    <Card className="bg-white/5 border-white/10 p-3">
                        <ul className="text-xs text-white/80 space-y-2">
                            <li>• Gen X shows highest engagement (67%)</li>
                            <li>• Fintech professionals most receptive</li>
                            <li>• Urban demographics prefer innovation</li>
                            <li>• 25-49 age group drives sentiment</li>
                        </ul>
                    </Card>
                </div>

                {/* Export Options */}
                <div className="space-y-3">
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
                        EXPORT FULL REPORT
                    </Button>
                    <Button
                        variant="outline"
                        className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-400/10"
                    >
                        SAVE TO PROJECT
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
