import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import {
    Upload,
    Play,
    ChevronLeft,
    LogOut,
    Users,
    BarChart3,
    MessageSquare,
    Zap,
} from "lucide-react";
import { TowaReactionModal } from "./TowaReactionModal";
import { FeedbackPanel } from "./FeedbackPanel";
import { NetworkVisualization } from "./NetworkVisualization";
import { InteractiveNetworkViz } from "./InteractiveNetworkViz";
import { CenteredVideoAnalysis } from "./AlternateCenteredVideoAnalysis";

import { SearchProgress } from "./SearchProgress";
import { ProfilesStream } from "./ProfilesStream";
import { AnalysisReport, ExpandedReport } from "./AnalysisReport";
import type { Project, Person } from "@/types/shared";

interface CoreProductProps {
    project: Project;
    onBack: () => void;
    onLogout: () => void;
}

const mockPeople: Person[] = [
    {
        id: "1",
        name: "James Wilson",
        age: 25,
        gender: "Men",
        location: "Toronto, Canada",
        title: "CEO",
        generation: "Gen Z",
        industry: "Fintech",
        feedback:
            "When he got his first job he didn't know what to do... all they told him was \"here are some boxes figure out what to do with them\" lol but from there he kept going until he created his own business. Gotta keep going to keep growing and if you're not stacking you're lackin'",
        reaction: "intrigued",
        fullReaction:
            "James Wilson, a Gen Z fintech CEO with a high risk tolerance and interest in innovation, is likely to be intrigued by an idea that targets his generation with a fintech app.",
        position: { x: 0.3, y: 0.4, z: 0.6 },
    },
    {
        id: "2",
        name: "Sarah Chen",
        age: 32,
        gender: "Women",
        location: "Clovis, CA",
        title: "Software Engineer",
        generation: "Millennial",
        industry: "Software Development",
        feedback:
            "In the beginning, where he was just going to work for a little while to save up so he could travel and stayed 50 plus years. Amazing how someone can be inspired to stay with a company for so long.",
        reaction: "inspired",
        fullReaction:
            "Sarah Chen, a millennial software engineer who values financial planning and career growth, is likely to be inspired by an app that helps her demographic manage finances effectively.",
        position: { x: -0.2, y: 0.7, z: -0.3 },
    },
    {
        id: "3",
        name: "Marcus Thompson",
        age: 28,
        gender: "Men",
        location: "Montreal, Quebec",
        title: "Product Manager",
        generation: "Gen Z",
        industry: "Technology",
        feedback:
            "The most important thing is building something that people actually want to use. You can have the best technology in the world but if it doesn't solve a real problem, nobody cares.",
        reaction: "interested",
        fullReaction:
            "Marcus Thompson, a Gen Z product manager in tech, is likely to be interested in evaluating the product-market fit and user experience of a new fintech solution.",
        position: { x: 0.8, y: -0.2, z: 0.1 },
    },
    {
        id: "4",
        name: "Emily Rodriguez",
        age: 29,
        gender: "Women",
        location: "Vancouver, BC",
        title: "Marketing Director",
        generation: "Gen Z",
        industry: "Marketing",
        feedback:
            "Gen X in Canada is such an underserved market. Most apps focus on millennials or boomers, but Gen X has real money and specific needs that nobody talks about.",
        reaction: "excited",
        fullReaction:
            "Emily Rodriguez, a Gen Z marketing director, is likely to be excited about the market opportunity and positioning strategy of targeting Gen X Canadians.",
        position: { x: -0.5, y: 0.3, z: 0.8 },
    },
    {
        id: "5",
        name: "David Kim",
        age: 35,
        gender: "Men",
        location: "Calgary, Alberta",
        title: "Financial Advisor",
        generation: "Millennial",
        industry: "Financial Services",
        feedback:
            "Canadian financial regulations are complex, and Gen X clients often feel overwhelmed by existing solutions. A simple, compliant app could really help bridge that gap.",
        reaction: "analytical",
        fullReaction:
            "David Kim, a millennial financial advisor, is likely to take an analytical approach to evaluating the compliance and practical utility of the proposed fintech solution.",
        position: { x: 0.1, y: -0.6, z: -0.4 },
    },
    {
        id: "6",
        name: "Lisa Wang",
        age: 31,
        gender: "Women",
        location: "Ottawa, Ontario",
        title: "UX Designer",
        generation: "Millennial",
        industry: "Design",
        feedback:
            "The key is making sure the interface doesn't alienate Gen X users who might not be as tech-savvy as younger generations. Clean, simple design with clear value props.",
        reaction: "thoughtful",
        fullReaction:
            "Lisa Wang, a millennial UX designer, is likely to be thoughtful about the user experience considerations and design challenges for serving Gen X users.",
        position: { x: -0.7, y: -0.1, z: 0.5 },
    },
    {
        id: "7",
        name: "Ryan O'Connor",
        age: 26,
        gender: "Men",
        location: "Halifax, Nova Scotia",
        title: "Business Analyst",
        generation: "Gen Z",
        industry: "Finance",
        feedback:
            "Atlantic Canada has different economic pressures than Toronto or Vancouver. Regional considerations could be a major differentiator for this type of product.",
        reaction: "strategic",
        fullReaction:
            "Ryan O'Connor, a Gen Z business analyst in finance, is likely to think strategically about regional market differences and competitive positioning.",
        position: { x: 0.6, y: 0.5, z: -0.7 },
    },
    {
        id: "8",
        name: "Jessica Brown",
        age: 33,
        gender: "Women",
        location: "Winnipeg, Manitoba",
        title: "Operations Manager",
        generation: "Millennial",
        industry: "Operations",
        feedback:
            "Execution is everything. Lots of fintech startups have good ideas but fail on the operational side. Customer support, onboarding, compliance - that's where you win or lose.",
        reaction: "practical",
        fullReaction:
            "Jessica Brown, a millennial operations manager, is likely to focus on the practical execution challenges and operational requirements for launching a successful fintech product.",
        position: { x: -0.3, y: 0.8, z: 0.2 },
    },
];

export function CoreProduct({ project, onBack, onLogout }: CoreProductProps) {
    const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
    const [prompt, setPrompt] = useState(
        "Simulate how 25 Gen Z tech enthusiasts react to this ad"
    );
    const [isSimulating, setIsSimulating] = useState(false);
    const [progress, setProgress] = useState(8);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [allPeople] = useState<Person[]>(mockPeople);
    const [filteredPeople, setFilteredPeople] = useState<Person[]>(mockPeople);
    const [foundCount, setFoundCount] = useState(0);
    const [showSearchProgress, setShowSearchProgress] = useState(false);
    const [showProfilesStream, setShowProfilesStream] = useState(false);
    const [showAnalysisReport, setShowAnalysisReport] = useState(false);
    const [showExpandedReport, setShowExpandedReport] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            setUploadedVideo(file);
        }
    };

    // Smart filtering function that parses natural language queries
    const parseSearchQuery = (query: string): Person[] => {
        const lowerQuery = query.toLowerCase();

        // Extract filters from the query
        let ageMin: number | null = null;
        let ageMax: number | null = null;
        let gender: string | null = null;
        let generation: string | null = null;
        let location: string | null = null;
        let industry: string | null = null;

        // Age range patterns
        const ageRangeMatch = lowerQuery.match(
            /age\s+(?:range\s+)?(?:around\s+|between\s+)?(\d+)[-–\s]*(?:to\s+)?(\d+)/
        );
        if (ageRangeMatch) {
            ageMin = parseInt(ageRangeMatch[1]);
            ageMax = parseInt(ageRangeMatch[2]);
        } else {
            const singleAgeMatch = lowerQuery.match(
                /age\s+(?:around\s+|about\s+)?(\d+)/
            );
            if (singleAgeMatch) {
                const age = parseInt(singleAgeMatch[1]);
                ageMin = age - 2;
                ageMax = age + 2;
            }
        }

        // Gender patterns
        if (lowerQuery.includes("women") || lowerQuery.includes("female")) {
            gender = "Women";
        } else if (lowerQuery.includes("men") || lowerQuery.includes("male")) {
            gender = "Men";
        }

        // Generation patterns
        if (
            lowerQuery.includes("gen z") ||
            lowerQuery.includes("generation z")
        ) {
            generation = "Gen Z";
        } else if (
            lowerQuery.includes("millennial") ||
            lowerQuery.includes("gen y")
        ) {
            generation = "Millennial";
        } else if (
            lowerQuery.includes("gen x") ||
            lowerQuery.includes("generation x")
        ) {
            generation = "Gen X";
        }

        // Location patterns
        const canadianCities = [
            "toronto",
            "vancouver",
            "montreal",
            "calgary",
            "ottawa",
            "edmonton",
            "winnipeg",
            "quebec",
            "hamilton",
            "kitchener",
            "london",
            "halifax",
        ];
        const canadianProvinces = [
            "ontario",
            "quebec",
            "british columbia",
            "alberta",
            "manitoba",
            "saskatchewan",
            "nova scotia",
            "new brunswick",
            "newfoundland",
            "prince edward island",
        ];

        for (const city of canadianCities) {
            if (lowerQuery.includes(city)) {
                location = city;
                break;
            }
        }

        if (!location) {
            for (const province of canadianProvinces) {
                if (lowerQuery.includes(province)) {
                    location = province;
                    break;
                }
            }
        }

        if (lowerQuery.includes("canada") || lowerQuery.includes("canadian")) {
            location = location || "canada";
        }

        // Industry patterns
        const industries = [
            "fintech",
            "finance",
            "technology",
            "tech",
            "software",
            "marketing",
            "design",
            "operations",
        ];
        for (const ind of industries) {
            if (lowerQuery.includes(ind)) {
                industry = ind;
                break;
            }
        }

        // Filter people based on extracted criteria
        return allPeople.filter((person) => {
            let matches = true;

            if (ageMin !== null && ageMax !== null) {
                matches =
                    matches && person.age >= ageMin && person.age <= ageMax;
            }

            if (gender) {
                matches =
                    matches &&
                    person.gender.toLowerCase() === gender.toLowerCase();
            }

            if (generation) {
                matches =
                    matches &&
                    person.generation.toLowerCase() ===
                        generation.toLowerCase();
            }

            if (location && location !== "canada") {
                matches =
                    matches &&
                    person.location
                        .toLowerCase()
                        .includes(location.toLowerCase());
            }

            if (industry) {
                matches =
                    matches &&
                    person.industry
                        .toLowerCase()
                        .includes(industry.toLowerCase());
            }

            return matches;
        });
    };

    const handleSimulate = async () => {
        if (!prompt.trim() || !uploadedVideo) return;

        setIsSimulating(true);
        setShowSearchProgress(true);
        setShowProfilesStream(false);
        setShowAnalysisReport(false);
        setProgress(0);

        // Parse the query and filter people
        const filtered = parseSearchQuery(prompt);
        setFilteredPeople(filtered);
        setFoundCount(filtered.length);

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

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative">
            {/* Header */}
            <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={onBack}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-gray-800"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl text-white">
                                {project.title}
                            </h1>
                            <p className="text-sm text-white/60">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-sm text-white/60">
                            Progress: {project.progress}%
                        </div>
                        <Button
                            onClick={onLogout}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-73px)] relative">
                {/* Center Area - Video Analysis */}
                <div className="flex-1 relative">
                    <CenteredVideoAnalysis
                        uploadedVideo={uploadedVideo}
                        onVideoUpload={handleVideoUpload}
                        prompt={prompt}
                        onPromptChange={setPrompt}
                        onSimulate={handleSimulate}
                        isSimulating={isSimulating}
                        showAnalysisReport={showAnalysisReport}
                    />

                    {/* Interactive Network Visualization - Always visible when not uploading/configuring */}
                    <AnimatePresence>
                        {uploadedVideo &&
                        !isSimulating &&
                        !showAnalysisReport ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20"
                            >
                                <InteractiveNetworkViz
                                    isRunning={isSimulating}
                                    onRunSimulation={handleSimulate}
                                    people={filteredPeople}
                                />
                            </motion.div>
                        ) : isSimulating || showAnalysisReport ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-20"
                            >
                                <NetworkVisualization
                                    people={filteredPeople}
                                    onPersonClick={setSelectedPerson}
                                    uploadedVideo={uploadedVideo}
                                    isSimulating={isSimulating}
                                    searchComplete={
                                        !isSimulating && showAnalysisReport
                                    }
                                />
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {/* Mission Status */}
                        <div>
                            <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
                                {!showAnalysisReport && (
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                )}
                                MISSION STATUS
                                <span className="ml-auto text-white">
                                    ACTIVE
                                </span>
                            </div>
                            <div className="text-xs space-y-1 text-white/70">
                                <div>Progress: {Math.round(progress)}%</div>
                                <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
                                    <div
                                        className="bg-green-400 h-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-white/50">
                                    Status: CRITICAL
                                </div>
                            </div>
                        </div>

                        {/* Feedback Summary */}
                        <div>
                            <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
                                {!showAnalysisReport && (
                                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                )}
                                FEEDBACK SUMMARY
                            </div>
                            <div className="text-xs text-white/40 mb-4">
                                AI Personas' key reactions
                            </div>

                            {/* Glassmorphic Card Container */}
                            <div
                                className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                    boxShadow:
                                        "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
                                }}
                            >
                                {/* Subtle blue inner glow overlay */}
                                <div
                                    className="absolute inset-0 rounded-lg opacity-40"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
                                        filter: "blur(0.5px)",
                                    }}
                                />

                                <div className="relative z-10">
                                    {showAnalysisReport ? (
                                        <div className="space-y-4">
                                            {/* Highlights Section */}
                                            <div>
                                                <div className="text-xs text-cyan-300 mb-2 font-medium">
                                                    Highlights
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        "Loved the emotional storytelling approach.",
                                                        "Strong visual identity, but message unclear.",
                                                        "Great potential for viral sharing.",
                                                    ].map((highlight, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{
                                                                opacity: 0,
                                                                x: -10,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    0.3 +
                                                                    i * 0.3,
                                                                duration: 0.6,
                                                                ease: "easeOut",
                                                            }}
                                                            className="text-xs text-white/70 flex items-start gap-2"
                                                        >
                                                            <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                                                            <span>
                                                                "{highlight}"
                                                            </span>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Themes (Tags) */}
                                            <div>
                                                <div className="text-xs text-cyan-300 mb-2 font-medium">
                                                    Themes
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        "Innovation",
                                                        "Emotion",
                                                        "BrandTrust",
                                                        "Lifestyle",
                                                    ].map((tag, i) => (
                                                        <motion.div
                                                            key={tag}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    0.9 +
                                                                    i * 0.1,
                                                                duration: 0.4,
                                                            }}
                                                            className="px-2 py-1 rounded-full text-xs border border-white/20 text-white/70 cursor-pointer hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/5 transition-all duration-300"
                                                            style={{
                                                                background:
                                                                    "rgba(110, 231, 183, 0.05)",
                                                            }}
                                                            whileHover={{
                                                                scale: 1.05,
                                                                boxShadow:
                                                                    "0 0 10px rgba(110, 231, 183, 0.3)",
                                                            }}
                                                            animate={{
                                                                boxShadow: [
                                                                    "0 0 5px rgba(110, 231, 183, 0.1)",
                                                                    "0 0 8px rgba(110, 231, 183, 0.2)",
                                                                    "0 0 5px rgba(110, 231, 183, 0.1)",
                                                                ],
                                                            }}
                                                            transition={{
                                                                boxShadow: {
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut",
                                                                },
                                                            }}
                                                        >
                                                            #{tag}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Sentiment Overview */}
                                            <div>
                                                <div className="text-xs text-cyan-300 mb-2 font-medium">
                                                    Sentiment Overview
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        {
                                                            label: "Positive",
                                                            value: 74,
                                                            color: "#22c55e",
                                                        },
                                                        {
                                                            label: "Neutral",
                                                            value: 18,
                                                            color: "#fbbf24",
                                                        },
                                                        {
                                                            label: "Negative",
                                                            value: 8,
                                                            color: "#ef4444",
                                                        },
                                                    ].map((sentiment, i) => (
                                                        <div
                                                            key={
                                                                sentiment.label
                                                            }
                                                            className="flex items-center gap-3"
                                                        >
                                                            <div className="w-16 text-xs text-white/60">
                                                                {
                                                                    sentiment.label
                                                                }
                                                            </div>
                                                            <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            sentiment.color,
                                                                    }}
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${sentiment.value}%`,
                                                                    }}
                                                                    transition={{
                                                                        delay:
                                                                            1.2 +
                                                                            i *
                                                                                0.2,
                                                                        duration: 0.6,
                                                                        ease: "easeOut",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="w-8 text-xs text-white/80 text-right">
                                                                {
                                                                    sentiment.value
                                                                }
                                                                %
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Demographic Reactions */}
                                            <div>
                                                <div className="text-xs text-cyan-300 mb-2 font-medium">
                                                    Demographic Reactions
                                                </div>
                                                <div className="space-y-2">
                                                    {[
                                                        {
                                                            label: "Gen Z Engagement",
                                                            value: 86,
                                                            color: "#a855f7",
                                                        },
                                                        {
                                                            label: "Millennials",
                                                            value: 64,
                                                            color: "#2563eb",
                                                        },
                                                    ].map((demo, i) => (
                                                        <div
                                                            key={demo.label}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <div className="w-20 text-xs text-white/60">
                                                                {demo.label}
                                                            </div>
                                                            <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            demo.color,
                                                                    }}
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${demo.value}%`,
                                                                    }}
                                                                    transition={{
                                                                        delay:
                                                                            1.8 +
                                                                            i *
                                                                                0.2,
                                                                        duration: 0.6,
                                                                        ease: "easeOut",
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="w-8 text-xs text-white/80 text-right">
                                                                {demo.value}%
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="text-xs text-white/50 mb-2">
                                                No feedback collected yet
                                            </div>
                                            <div className="text-xs text-white/30">
                                                Run simulation to see AI
                                                reactions
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Text */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: showAnalysisReport ? 2.8 : 0.5,
                                    duration: 0.6,
                                }}
                                className="text-xs text-white/30 mt-6 leading-relaxed"
                                style={{
                                    fontFamily:
                                        "Space Grotesk, Inter, sans-serif",
                                }}
                            >
                                Generated by AI personas trained on 25 audience
                                profiles.
                            </motion.div>

                            {/* View All Feedback Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: showAnalysisReport ? 3.0 : 0.7,
                                    duration: 0.4,
                                }}
                                className="mt-8"
                            >
                                <Button
                                    onClick={() => setShowFeedback(true)}
                                    className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                                        boxShadow:
                                            "0 0 15px rgba(59, 130, 246, 0.15)",
                                    }}
                                >
                                    View All Feedback
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Progress Modal */}
            <AnimatePresence>
                {showSearchProgress && (
                    <SearchProgress
                        progress={progress}
                        foundCount={foundCount}
                        searchQuery={prompt}
                    />
                )}
            </AnimatePresence>

            {/* Profiles Stream Modal */}
            <AnimatePresence>
                {showProfilesStream && (
                    <ProfilesStream
                        people={filteredPeople}
                        onComplete={() => {
                            setShowProfilesStream(false);
                            setShowAnalysisReport(true);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Analysis Report Modal */}
            <AnimatePresence>
                {showAnalysisReport && (
                    <AnalysisReport
                        people={filteredPeople}
                        searchQuery={prompt}
                        onExpand={() => setShowExpandedReport(true)}
                        onClose={() => setShowAnalysisReport(false)}
                    />
                )}
            </AnimatePresence>

            {/* Expanded Report Modal */}
            <AnimatePresence>
                {showExpandedReport && (
                    <ExpandedReport
                        people={filteredPeople}
                        searchQuery={prompt}
                        onClose={() => setShowExpandedReport(false)}
                    />
                )}
            </AnimatePresence>

            {/* Towa Reaction Modal */}
            <AnimatePresence>
                {selectedPerson && (
                    <TowaReactionModal
                        person={selectedPerson}
                        onClose={() => setSelectedPerson(null)}
                        onAddToFeedback={(person) => {
                            // Add to feedback summary logic here
                            console.log("Adding to feedback:", person.name);
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Feedback Panel */}
            <AnimatePresence>
                {showFeedback && (
                    <FeedbackPanel
                        people={filteredPeople}
                        onClose={() => setShowFeedback(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
