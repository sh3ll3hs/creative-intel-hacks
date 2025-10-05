import { Card } from "./ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { Person } from "@/types/shared";

interface PersonasPanelProps {
    people: Person[];
    onClose: () => void;
}

export function PersonasPanel({ people, onClose }: PersonasPanelProps) {
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
                        PERSONA SUMMARY
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
                            Total Personas
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
                            2.3s
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
                            Speed
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gray-800 mb-8"></div>

                {/* Persona List */}
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
                        Personas
                    </h3>

                    <div className="space-y-4">
                        {people.map((person, index) => (
                            <motion.div
                                key={person.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 rounded-sm"
                                style={{
                                    background: "rgba(255, 255, 255, 0.02)",
                                    border: "1px solid #1C1C1C",
                                }}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                        style={{
                                            background: `linear-gradient(135deg, ${person.color || "#6EE7B7"}, ${person.color || "#2563EB"})`,
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4
                                            className="text-white mb-1"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {person.name}
                                        </h4>
                                        <p
                                            className="text-white/60"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "12px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {person.generation}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-white/50"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "11px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            Industry
                                        </span>
                                        <span
                                            className="text-white/80"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "12px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {person.industry}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span
                                            className="text-white/50"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "11px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            Location
                                        </span>
                                        <span
                                            className="text-white/80"
                                            style={{
                                                fontFamily: "Inter, system-ui, sans-serif",
                                                fontSize: "12px",
                                                fontWeight: "400",
                                            }}
                                        >
                                            {person.location}
                                        </span>
                                    </div>
                                    {person.interests && person.interests.length > 0 && (
                                        <div className="flex items-start justify-between">
                                            <span
                                                className="text-white/50"
                                                style={{
                                                    fontFamily: "Inter, system-ui, sans-serif",
                                                    fontSize: "11px",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                Interests
                                            </span>
                                            <span
                                                className="text-white/80 text-right"
                                                style={{
                                                    fontFamily: "Inter, system-ui, sans-serif",
                                                    fontSize: "12px",
                                                    fontWeight: "400",
                                                }}
                                            >
                                                {person.interests.slice(0, 2).join(", ")}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
