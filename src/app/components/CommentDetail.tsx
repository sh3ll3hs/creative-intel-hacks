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
import type { Comment } from "../App";

interface CommentDetailProps {
    comment: Comment;
    onClose: () => void;
}

export function CommentDetail({ comment, onClose }: CommentDetailProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 bg-slate-900 border-slate-700 text-white overflow-hidden">
                <div className="relative">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4">
                        <DialogTitle className="sr-only">
                            Profile Details for {comment.author.name}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            View detailed profile information and reaction for{" "}
                            {comment.author.name}
                        </DialogDescription>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl text-white mb-2">
                                    {comment.author.name}
                                </h2>
                                <div className="space-y-2 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        <span>
                                            Title: {comment.author.title}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>
                                            Location: {comment.author.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Generation:{" "}
                                            {comment.author.generation}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="w-4 h-4" />
                                        <span>
                                            Industry: {comment.author.industry}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="border-t border-slate-700 my-4" />

                    {/* Reaction Section */}
                    <div className="px-6 pb-6">
                        <div className="mb-4">
                            <h3 className="text-lg text-white mb-3">
                                Reaction
                            </h3>
                            <Badge
                                className={`mb-4 ${
                                    comment.reaction === "intrigued"
                                        ? "bg-green-600 text-white"
                                        : comment.reaction === "inspired"
                                        ? "bg-blue-600 text-white"
                                        : "bg-orange-600 text-white"
                                }`}
                            >
                                {comment.reaction}
                            </Badge>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
                                <p className="text-slate-200 leading-relaxed">
                                    {comment.fullReaction}
                                </p>
                            </Card>
                        </motion.div>

                        {/* Quote from original comment */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
                                <div className="border-l-4 border-indigo-500 pl-4">
                                    <p className="text-slate-300 italic">
                                        "
                                        {comment.text.length > 200
                                            ? comment.text.substring(0, 200) +
                                              "..."
                                            : comment.text}
                                        "
                                    </p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex gap-3"
                        >
                            <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                                <Phone className="w-4 h-4 mr-2" />
                                Call {comment.author.name.split(" ")[0]}
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                        </motion.div>

                        {/* Additional Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 pt-4 border-t border-slate-700"
                        >
                            <div className="flex items-center justify-between text-sm">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-400 hover:text-orange-300 hover:bg-slate-800"
                                >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Add to Feedback
                                </Button>
                                <div className="text-slate-500">
                                    • LIVE CALL • 00:01
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
