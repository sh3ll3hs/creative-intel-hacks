import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Phone, Plus, UserCheck } from "lucide-react";
import type { Person } from "@/types/shared";

interface TowaReactionModalProps {
    person: Person;
    onClose: () => void;
    onAddToFeedback?: (person: Person) => void;
}

const getReactionType = (reaction: string) => {
    const positiveReactions = [
        "intrigued",
        "inspired",
        "excited",
        "impressed",
        "engaged",
    ];
    const negativeReactions = [
        "skeptical",
        "confused",
        "bored",
        "unimpressed",
        "dismissive",
    ];

    const isPositive = positiveReactions.some((positive) =>
        reaction.toLowerCase().includes(positive)
    );
    const isNegative = negativeReactions.some((negative) =>
        reaction.toLowerCase().includes(negative)
    );

    if (isPositive) {
        return {
            label: "POSITIVE",
            color: "#1EE0B9",
            bgColor: "rgba(30, 224, 185, 0.15)",
            borderColor: "rgba(30, 224, 185, 0.3)",
        };
    } else if (isNegative) {
        return {
            label: "NEGATIVE",
            color: "#F87171",
            bgColor: "rgba(248, 113, 113, 0.15)",
            borderColor: "rgba(248, 113, 113, 0.3)",
        };
    } else {
        return {
            label: "NEUTRAL",
            color: "#60A5FA",
            bgColor: "rgba(96, 165, 250, 0.15)",
            borderColor: "rgba(96, 165, 250, 0.3)",
        };
    }
};

export function TowaReactionModal({
    person,
    onClose,
    onAddToFeedback,
}: TowaReactionModalProps) {
    const [connectionStatus, setConnectionStatus] = useState<
        "waiting" | "connecting" | "connected"
    >("waiting");
    const reactionType = getReactionType(person.reaction);

    const handleConnect = () => {
        setConnectionStatus("connecting");
        setTimeout(() => {
            setConnectionStatus("connected");
        }, 2000);
    };

    const handleAddToFeedback = () => {
        onAddToFeedback?.(person);
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                className="p-0 border-0 bg-transparent shadow-none max-w-none w-[600px] h-[750px]"
                style={{ fontFamily: "Space Grotesk, Inter, sans-serif" }}
            >
                {/* Hidden accessibility elements */}
                <DialogHeader className="sr-only">
                    <DialogTitle>
                        Towa Reaction Summary - {person.name}
                    </DialogTitle>
                    <DialogDescription>
                        AI persona reaction analysis for {person.name}, showing
                        detailed feedback and interaction options.
                    </DialogDescription>
                </DialogHeader>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full h-full rounded-2xl backdrop-blur-xl border overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #0B0F14 0%, #101720 100%)",
                        borderColor: "rgba(110, 231, 183, 0.2)",
                        boxShadow:
                            "0 0 60px rgba(110, 231, 183, 0.1), 0 0 100px rgba(37, 99, 235, 0.08), 0 25px 50px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {/* Glassmorphic Glow Overlay */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            background:
                                "radial-gradient(circle at 50% 0%, rgba(110, 231, 183, 0.1) 0%, rgba(37, 99, 235, 0.05) 50%, transparent 100%)",
                            filter: "blur(1px)",
                        }}
                    />

                    {/* Close Button */}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </motion.button>

                    <div className="relative z-10 p-8 h-full flex flex-col">
                        {/* Top Section - Persona Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="mb-8"
                        >
                            <h1
                                className="text-3xl text-white mb-4 tracking-tight"
                                style={{
                                    fontFamily: "Space Grotesk, sans-serif",
                                    fontWeight: 600,
                                }}
                            >
                                {person.name}
                            </h1>
                            <div
                                className="space-y-2 text-base"
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 400,
                                    color: "#9CA3AF",
                                }}
                            >
                                <div>{person.title}</div>
                                <div>{person.location}</div>
                                <div className="flex items-center gap-3">
                                    <span>{person.generation}</span>
                                    <span>•</span>
                                    <span>{person.industry}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Middle Section - Reaction Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex-1 space-y-6"
                        >
                            {/* Section Header */}
                            <div className="flex items-center justify-between">
                                <h2
                                    className="text-sm tracking-wide"
                                    style={{
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 600,
                                        color: "#06B6D4",
                                    }}
                                >
                                    REACTION SUMMARY
                                </h2>
                                <div
                                    className="px-4 py-2 rounded-full text-xs font-medium border"
                                    style={{
                                        color: reactionType.color,
                                        backgroundColor: reactionType.bgColor,
                                        borderColor: reactionType.borderColor,
                                        fontFamily: "Space Grotesk, sans-serif",
                                        fontWeight: 600,
                                    }}
                                >
                                    {reactionType.label}
                                </div>
                            </div>

                            {/* AI-Generated Summary */}
                            <div className="space-y-6">
                                <p
                                    className="text-white leading-relaxed"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {person.fullReaction}
                                </p>

                                <p
                                    className="text-white/85 leading-relaxed"
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    This {person.generation} persona
                                    demonstrates {person.reaction} engagement,
                                    particularly resonating with content
                                    elements that align with their professional
                                    background in {person.industry} and
                                    demographic preferences.
                                </p>

                                {/* Quoted Insight */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="relative pl-6 py-4"
                                    style={{
                                        borderLeft: `3px solid #2563EB`,
                                    }}
                                >
                                    <p
                                        className="text-white/95 italic leading-relaxed"
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        "{person.feedback}"
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Bottom Section - Live Interaction */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-4"
                        >
                            {/* Live Interaction Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3
                                        className="text-sm tracking-wide"
                                        style={{
                                            fontFamily:
                                                "Space Grotesk, sans-serif",
                                            fontWeight: 600,
                                            color: "#06B6D4",
                                        }}
                                    >
                                        LIVE INTERACTION
                                    </h3>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.7, 1, 0.7],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: "#06B6D4" }}
                                    />
                                </div>
                            </div>

                            {/* Status Text */}
                            <p
                                className="text-white/60 text-sm mb-6"
                                style={{ fontFamily: "Inter, sans-serif" }}
                            >
                                {connectionStatus === "waiting" &&
                                    "Waiting for connection..."}
                                {connectionStatus === "connecting" &&
                                    "Establishing connection..."}
                                {connectionStatus === "connected" &&
                                    "Connected - Ready for interaction"}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleConnect}
                                        disabled={
                                            connectionStatus === "connected"
                                        }
                                        className="px-6 py-3 text-sm font-medium rounded-lg border-0 transition-all duration-300"
                                        style={{
                                            background:
                                                connectionStatus === "connected"
                                                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                                                    : "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
                                            color: "white",
                                            fontFamily:
                                                "Space Grotesk, sans-serif",
                                            boxShadow:
                                                connectionStatus !== "connected"
                                                    ? "0 0 20px rgba(34, 197, 94, 0.3)"
                                                    : "0 0 20px rgba(16, 185, 129, 0.3)",
                                        }}
                                    >
                                        <Phone className="w-4 h-4 mr-2" />
                                        {connectionStatus === "connected"
                                            ? "Connected"
                                            : "Connect"}
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    animate={{
                                        boxShadow: [
                                            "0 0 10px rgba(37, 99, 235, 0.2)",
                                            "0 0 20px rgba(37, 99, 235, 0.4)",
                                            "0 0 10px rgba(37, 99, 235, 0.2)",
                                        ],
                                    }}
                                    transition={{
                                        boxShadow: {
                                            duration: 0.8,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        },
                                    }}
                                    className="flex-1"
                                >
                                    <Button
                                        onClick={handleAddToFeedback}
                                        className="w-full px-6 py-3 text-sm font-medium rounded-lg border-0 transition-all duration-300"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                                            color: "white",
                                            fontFamily:
                                                "Space Grotesk, sans-serif",
                                        }}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add to Feedback Summary
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={onClose}
                                        className="px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-300"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)",
                                            borderColor:
                                                "rgba(37, 99, 235, 0.3)",
                                            color: "white",
                                            fontFamily:
                                                "Space Grotesk, sans-serif",
                                        }}
                                    >
                                        Close
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
