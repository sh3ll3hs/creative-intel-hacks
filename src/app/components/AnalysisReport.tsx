import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Download,
    Expand,
    FileText,
    BarChart3,
    Users,
    TrendingUp,
    X,
} from "lucide-react";
import type { Person } from "../App";

interface AnalysisReportProps {
    isVisible: boolean;
    people: Person[];
    videoName?: string;
    onExpand: () => void;
}

interface ExpandedReportProps {
    isOpen: boolean;
    onClose: () => void;
    people: Person[];
    videoName?: string;
}

export function AnalysisReport({
    isVisible,
    people,
    videoName,
    onExpand,
}: AnalysisReportProps) {
    const handleDownload = () => {
        // Create downloadable report
        const reportData = {
            timestamp: new Date().toISOString(),
            videoName: videoName || "Uploaded Video",
            totalParticipants: people.length,
            summary: generateSummary(),
            participants: people,
            insights: generateInsights(),
        };

        const blob = new Blob([JSON.stringify(reportData, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analysis-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const generateSummary = () => {
        const reactions = people.reduce((acc, person) => {
            acc[person.reaction] = (acc[person.reaction] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topReaction = Object.entries(reactions).sort(
            ([, a], [, b]) => b - a
        )[0];
        return {
            topReaction: topReaction?.[0] || "neutral",
            topReactionCount: topReaction?.[1] || 0,
            averageAge: Math.round(
                people.reduce((sum, p) => sum + p.age, 0) / people.length
            ),
            topIndustry: "Fintech",
            overallScore: 87,
        };
    };

    const generateInsights = () => {
        return [
            "Strong interest from Gen X demographic in fintech solutions",
            "Security and privacy concerns are primary factors",
            "Trust-building features could improve adoption",
            "Mobile-first design is crucial for this audience",
        ];
    };

    const summary = generateSummary();

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 50, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    {/* Glowing background effect */}
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-xl blur-lg"></div>

                    <Card className="relative bg-black/95 backdrop-blur-md border border-yellow-500/30 p-4 w-80">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-yellow-400" />
                                <span className="text-white text-sm">
                                    Analysis Report
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleDownload}
                                    className="text-white/70 hover:text-white p-1 h-auto"
                                >
                                    <Download className="w-3 h-3" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={onExpand}
                                    className="text-white/70 hover:text-white p-1 h-auto"
                                >
                                    <Expand className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-800/50 rounded p-2">
                                    <div className="text-yellow-400 text-xs">
                                        Overall Score
                                    </div>
                                    <div className="text-white text-lg">
                                        {summary.overallScore}%
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 rounded p-2">
                                    <div className="text-yellow-400 text-xs">
                                        Participants
                                    </div>
                                    <div className="text-white text-lg">
                                        {people.length}
                                    </div>
                                </div>
                            </div>

                            {/* Top reaction */}
                            <div className="bg-gray-800/50 rounded p-2">
                                <div className="text-yellow-400 text-xs mb-1">
                                    Primary Reaction
                                </div>
                                <Badge
                                    className={`text-xs ${
                                        summary.topReaction === "intrigued"
                                            ? "bg-green-600/20 text-green-400"
                                            : summary.topReaction === "inspired"
                                            ? "bg-blue-600/20 text-blue-400"
                                            : "bg-orange-600/20 text-orange-400"
                                    }`}
                                >
                                    {summary.topReaction} (
                                    {summary.topReactionCount})
                                </Badge>
                            </div>

                            {/* Key insights */}
                            <div className="bg-gray-800/50 rounded p-2">
                                <div className="text-yellow-400 text-xs mb-2">
                                    Key Insights
                                </div>
                                <div className="space-y-1">
                                    <div className="text-white/70 text-xs">
                                        • Strong fintech interest
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        • Security concerns noted
                                    </div>
                                    <div className="text-white/70 text-xs">
                                        • Mobile-first approach
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2 border-t border-gray-700/30">
                                <Button
                                    size="sm"
                                    onClick={handleDownload}
                                    className="flex-1 bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30 text-xs"
                                >
                                    <Download className="w-3 h-3 mr-1" />
                                    Export
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={onExpand}
                                    className="flex-1 bg-blue-600/20 border border-blue-500/50 text-blue-400 hover:bg-blue-600/30 text-xs"
                                >
                                    <Expand className="w-3 h-3 mr-1" />
                                    Expand
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function ExpandedReport({
    isOpen,
    onClose,
    people,
    videoName,
}: ExpandedReportProps) {
    const summary = {
        overallScore: 87,
        totalParticipants: people.length,
        averageAge: Math.round(
            people.reduce((sum, p) => sum + p.age, 0) / people.length
        ),
        topIndustry: "Fintech",
        topReaction: "intrigued",
    };

    const insights = [
        "Strong interest from Gen X demographic in fintech solutions",
        "Security and privacy concerns are primary factors",
        "Trust-building features could improve adoption",
        "Mobile-first design is crucial for this audience",
    ];

    const recommendations = [
        "Implement robust security features with clear privacy policies",
        "Focus on educational content about fintech benefits",
        "Simplify user interface for better accessibility",
        "Add customer testimonials and trust indicators",
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-black/95 backdrop-blur-md border border-gray-700/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <BarChart3 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-white text-xl">
                                        Comprehensive Analysis Report
                                    </h2>
                                    <p className="text-white/60 text-sm">
                                        {videoName || "Video Analysis"} •
                                        Generated{" "}
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-white/70 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Overview Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Card className="bg-gray-800/50 border-green-500/30 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <span className="text-green-400 text-sm">
                                            Overall Score
                                        </span>
                                    </div>
                                    <div className="text-white text-2xl">
                                        {summary.overallScore}%
                                    </div>
                                    <div className="text-white/60 text-xs">
                                        Excellent engagement
                                    </div>
                                </Card>

                                <Card className="bg-gray-800/50 border-blue-500/30 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-400 text-sm">
                                            Participants
                                        </span>
                                    </div>
                                    <div className="text-white text-2xl">
                                        {summary.totalParticipants}
                                    </div>
                                    <div className="text-white/60 text-xs">
                                        Analyzed profiles
                                    </div>
                                </Card>

                                <Card className="bg-gray-800/50 border-purple-500/30 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <BarChart3 className="w-4 h-4 text-purple-400" />
                                        <span className="text-purple-400 text-sm">
                                            Avg Age
                                        </span>
                                    </div>
                                    <div className="text-white text-2xl">
                                        {summary.averageAge}
                                    </div>
                                    <div className="text-white/60 text-xs">
                                        Years old
                                    </div>
                                </Card>

                                <Card className="bg-gray-800/50 border-orange-500/30 p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-orange-400" />
                                        <span className="text-orange-400 text-sm">
                                            Top Industry
                                        </span>
                                    </div>
                                    <div className="text-white text-lg">
                                        {summary.topIndustry}
                                    </div>
                                    <div className="text-white/60 text-xs">
                                        Primary sector
                                    </div>
                                </Card>
                            </div>

                            {/* Detailed Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Key Insights */}
                                <Card className="bg-gray-800/30 border-gray-700/50 p-4">
                                    <h3 className="text-white text-lg mb-3 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        Key Insights
                                    </h3>
                                    <div className="space-y-2">
                                        {insights.map((insight, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                                className="flex items-start gap-2 text-white/80 text-sm"
                                            >
                                                <div className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                                                {insight}
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Recommendations */}
                                <Card className="bg-gray-800/30 border-gray-700/50 p-4">
                                    <h3 className="text-white text-lg mb-3 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        Recommendations
                                    </h3>
                                    <div className="space-y-2">
                                        {recommendations.map((rec, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: index * 0.1 + 0.2,
                                                }}
                                                className="flex items-start gap-2 text-white/80 text-sm"
                                            >
                                                <div className="w-1 h-1 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                                {rec}
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Participant Breakdown */}
                            <Card className="bg-gray-800/30 border-gray-700/50 p-4">
                                <h3 className="text-white text-lg mb-3">
                                    Participant Breakdown
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {people.slice(0, 6).map((person, index) => (
                                        <motion.div
                                            key={person.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-gray-900/50 rounded p-3"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                                                        person.reaction ===
                                                        "intrigued"
                                                            ? "from-green-400 to-green-600"
                                                            : person.reaction ===
                                                              "inspired"
                                                            ? "from-blue-400 to-blue-600"
                                                            : "from-orange-400 to-orange-600"
                                                    } flex items-center justify-center text-white text-xs`}
                                                >
                                                    {person.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </div>
                                                <div>
                                                    <div className="text-white text-sm">
                                                        {person.name}
                                                    </div>
                                                    <div className="text-white/60 text-xs">
                                                        {person.title}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-white/70 text-xs line-clamp-2">
                                                {person.feedback}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-700/30">
                                <Button className="bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Full Report
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-gray-600/50 text-white/70"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as PDF
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
