import { useState } from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { X, Mic, PhoneOff, Plus, MessageSquare, Phone } from "lucide-react";
import type { Person } from "../App";

interface PersonaReactionPanelProps {
    person: Person;
    onClose: () => void;
    onAddToFeedback?: (person: Person) => void;
}

const getReactionColor = (reaction: string) => {
    switch (reaction.toLowerCase()) {
        case "intrigued":
        case "inspired":
        case "excited":
            return {
                bg: "from-green-400/20 to-cyan-400/20",
                border: "border-green-400/40",
                text: "text-green-300",
                label: "POSITIVE",
            };
        case "analytical":
        case "thoughtful":
        case "strategic":
            return {
                bg: "from-blue-400/20 to-purple-400/20",
                border: "border-blue-400/40",
                text: "text-blue-300",
                label: "NEUTRAL",
            };
        case "partial":
        case "practical":
            return {
                bg: "from-yellow-400/20 to-orange-400/20",
                border: "border-yellow-400/40",
                text: "text-yellow-300",
                label: "SKEPTICAL",
            };
        default:
            return {
                bg: "from-purple-400/20 to-pink-400/20",
                border: "border-purple-400/40",
                text: "text-purple-300",
                label: "CURIOUS",
            };
    }
};

export function PersonaReactionPanel({
    person,
    onClose,
    onAddToFeedback,
}: PersonaReactionPanelProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isCallActive, setIsCallActive] = useState(false);
    const reactionStyle = getReactionColor(person.reaction);

    const handleStartCall = () => {
        setIsCallActive(true);
        setIsRecording(false);
    };

    const handleEndCall = () => {
        setIsCallActive(false);
        setIsRecording(false);
    };

    const handleToggleRecord = () => {
        if (!isCallActive) {
            setIsCallActive(true);
        }
        setIsRecording(!isRecording);
    };

    const handleAddToFeedback = () => {
        onAddToFeedback?.(person);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                className="max-w-lg p-0 border-0 bg-transparent shadow-none"
                style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
                {/* Hidden accessibility elements */}
                <DialogHeader className="sr-only">
                    <DialogTitle>
                        AI Persona Reaction - {person.name}
                    </DialogTitle>
                    <DialogDescription>
                        View detailed reaction analysis and feedback from{" "}
                        {person.name}, a {person.generation} {person.title}{" "}
                        working in {person.industry}.
                    </DialogDescription>
                </DialogHeader>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative rounded-xl backdrop-blur-xl border overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0B0F1A 0%, rgba(11, 15, 26, 0.95) 100%)",
                        borderImage:
                            "linear-gradient(135deg, #6EE7B7 0%, #2563EB 50%, #A855F7 100%) 1",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        boxShadow:
                            "0 0 40px rgba(110, 231, 183, 0.15), 0 0 80px rgba(37, 99, 235, 0.1), 0 0 120px rgba(168, 85, 247, 0.05)",
                    }}
                >
                    {/* Glassmorphic Glow Overlay */}
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(110, 231, 183, 0.05) 0%, rgba(37, 99, 235, 0.05) 50%, rgba(168, 85, 247, 0.05) 100%)",
                            filter: "blur(2px)",
                        }}
                    />

                    {/* Close Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <X className="w-4 h-4 text-white/70 hover:text-white" />
                    </motion.button>

                    <div className="relative z-10 p-6 space-y-6">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-xl text-white mb-2 tracking-wide">
                                {person.name}
                            </h2>
                            <div className="space-y-1 text-sm text-white/60">
                                <div>{person.title}</div>
                                <div>{person.location}</div>
                                <div className="flex items-center gap-3">
                                    <span>{person.generation}</span>
                                    <span>•</span>
                                    <span>{person.industry}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Reaction Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <h3 className="text-sm text-cyan-300 tracking-wide">
                                    REACTION SUMMARY
                                </h3>
                                <Badge
                                    className={`px-3 py-1 text-xs border ${reactionStyle.border} ${reactionStyle.text} bg-gradient-to-r ${reactionStyle.bg}`}
                                >
                                    {reactionStyle.label}
                                </Badge>
                            </div>

                            {/* Reaction Paragraphs */}
                            <div className="space-y-3 text-sm leading-relaxed">
                                <p className="text-white/80">
                                    {person.fullReaction}
                                </p>
                                <p className="text-white/70">
                                    This persona shows {person.reaction}{" "}
                                    engagement with the content, particularly
                                    responding to elements that align with their{" "}
                                    {person.generation}
                                    perspective and {person.industry}{" "}
                                    background.
                                </p>
                            </div>

                            {/* User Quote */}
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative pl-4 border-l-2 border-cyan-400/40"
                            >
                                <p className="text-white/90 italic text-sm">
                                    "{person.feedback}"
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Live Interaction */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 rounded-lg border border-white/10 bg-gradient-to-r from-slate-800/20 to-slate-700/20 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-xs text-cyan-300 tracking-wide">
                                    LIVE INTERACTION
                                </h4>
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            isCallActive
                                                ? "bg-green-400"
                                                : "bg-gray-400"
                                        }`}
                                    />
                                    <span className="text-xs text-white/60">
                                        {isCallActive ? "CONNECTED" : "STANDBY"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-xs text-white/50">
                                    {isRecording ? (
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                }}
                                                className="w-2 h-2 bg-red-400 rounded-full"
                                            />
                                            Recording...
                                        </div>
                                    ) : isCallActive ? (
                                        "Connected - Ready to record"
                                    ) : (
                                        "Waiting for connection..."
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {!isCallActive ? (
                                        <Button
                                            onClick={handleStartCall}
                                            size="sm"
                                            className="bg-green-600/80 hover:bg-green-600 text-white text-xs px-3 py-1 h-7"
                                        >
                                            <Phone className="w-3 h-3 mr-1" />
                                            Connect
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={handleToggleRecord}
                                                size="sm"
                                                className={`text-xs px-3 py-1 h-7 ${
                                                    isRecording
                                                        ? "bg-red-600/80 hover:bg-red-600 text-white"
                                                        : "bg-blue-600/80 hover:bg-blue-600 text-white"
                                                }`}
                                            >
                                                <Mic className="w-3 h-3 mr-1" />
                                                {isRecording
                                                    ? "Stop"
                                                    : "Record"}
                                            </Button>
                                            <Button
                                                onClick={handleEndCall}
                                                size="sm"
                                                variant="outline"
                                                className="text-xs px-3 py-1 h-7 border-white/20 text-white/70 hover:text-white hover:border-white/40"
                                            >
                                                <PhoneOff className="w-3 h-3 mr-1" />
                                                End
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Footer Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-3 pt-2"
                        >
                            <Button
                                onClick={handleAddToFeedback}
                                className="flex-1 bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-600 hover:to-blue-600 text-white text-sm py-2 transition-all duration-300"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Feedback Summary
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="outline"
                                className="px-6 border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm py-2 transition-all duration-300"
                            >
                                Close Persona Card
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
