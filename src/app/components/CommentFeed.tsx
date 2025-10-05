import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Bookmark, MessageCircle, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { Comment } from "../App";

interface CommentFeedProps {
    comments: Comment[];
    onCommentClick: (comment: Comment) => void;
}

export function CommentFeed({ comments, onCommentClick }: CommentFeedProps) {
    const allTags = Array.from(new Set(comments.flatMap((c) => c.tags)));

    return (
        <div className="space-y-6">
            {/* Tags Filter */}
            <Card className="p-4 bg-white/70 backdrop-blur-sm border-slate-200">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <span className="text-slate-700">All Themes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, 15).map((tag, index) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </Card>

            {/* Comments */}
            <div className="space-y-4">
                {comments.map((comment, index) => (
                    <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card
                            className="p-6 bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white/90 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            onClick={() => onCommentClick(comment)}
                        >
                            <div className="space-y-4">
                                <p className="text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors">
                                    {comment.text}
                                </p>

                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <div className="flex items-center gap-4">
                                        <span>Age {comment.author.age}</span>
                                        <span>•</span>
                                        <span>{comment.author.gender}</span>
                                        <span>•</span>
                                        <span>{comment.author.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MessageCircle className="w-4 h-4 text-indigo-500" />
                                        <Bookmark className="w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <Badge
                                        variant="outline"
                                        className={`${
                                            comment.reaction === "intrigued"
                                                ? "border-green-300 text-green-700 bg-green-50"
                                                : comment.reaction ===
                                                  "inspired"
                                                ? "border-blue-300 text-blue-700 bg-blue-50"
                                                : "border-orange-300 text-orange-700 bg-orange-50"
                                        }`}
                                    >
                                        {comment.reaction}
                                    </Badge>

                                    <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click for details →
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
