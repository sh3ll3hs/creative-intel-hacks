import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
    X,
    Phone,
    UserCheck,
    Building,
    MapPin,
    Calendar,
    Briefcase,
} from "lucide-react";
import { motion } from "motion/react";
import type { Person } from "../App";

interface PersonModalProps {
    person: Person;
    onClose: () => void;
}

export function PersonModal({ person, onClose }: PersonModalProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 bg-black border-green-500/30 text-white overflow-hidden font-mono">
                <div className="relative">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="sr-only">
                            Profile Details for {person.name}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            View detailed profile information and reaction for{" "}
                            {person.name}
                        </DialogDescription>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl text-white mb-2">
                                    {person.name}
                                </h2>
                                <div className="space-y-2 text-green-300">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>TITLE: {person.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>LOCATION: {person.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            GENERATION: {person.generation}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4" />
                                        <span>INDUSTRY: {person.industry}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="border-t border-green-500/30 my-4" />

                    {/* Reaction Section */}
                    <div className="px-6 pb-6">
                        <div className="mb-4">
                            <h3 className="text-lg text-white mb-3">
                                REACTION ANALYSIS
                            </h3>
                            <Badge
                                className={`mb-4 ${
                                    person.reaction === "intrigued"
                                        ? "bg-green-600 text-white"
                                        : person.reaction === "inspired"
                                        ? "bg-blue-600 text-white"
                                        : "bg-orange-600 text-white"
                                }`}
                            >
                                {person.reaction.toUpperCase()}
                            </Badge>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-green-950/20 border-green-500/30 p-4 mb-6">
                                <div className="text-xs text-green-400 mb-2">
                                    AI ANALYSIS:
                                </div>
                                <p className="text-white/90 leading-relaxed">
                                    {person.fullReaction}
                                </p>
                            </Card>
                        </motion.div>

                        {/* Feedback from Person */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-purple-950/20 border-purple-500/30 p-4 mb-6">
                                <div className="text-xs text-purple-400 mb-2">
                                    PERSON FEEDBACK:
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <p className="text-white/90 italic">
                                        "{person.feedback}"
                                    </p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Metadata Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 gap-4 mb-6"
                        >
                            <Card className="bg-white/5 border-white/10 p-3">
                                <div className="text-xs text-white/60">AGE</div>
                                <div className="text-lg">{person.age}</div>
                            </Card>

                            <Card className="bg-white/5 border-white/10 p-3">
                                <div className="text-xs text-white/60">
                                    GENDER
                                </div>
                                <div className="text-lg">{person.gender}</div>
                            </Card>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-3"
                        >
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                <Phone className="w-4 h-4 mr-2" />
                                CALL {person.name.split(" ")[0].toUpperCase()}
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
                                onClick={onClose}
                            >
                                CLOSE
                            </Button>
                        </motion.div>

                        {/* Additional Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-4 pt-4 border-t border-green-500/30"
                        >
                            <div className="flex items-center justify-between text-sm">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                                >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    ADD TO FEEDBACK
                                </Button>
                                <div className="text-green-400 text-xs">
                                    • LIVE SIMULATION • ACTIVE
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
