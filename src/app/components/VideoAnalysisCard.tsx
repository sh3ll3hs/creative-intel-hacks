import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Play, Pause } from "lucide-react";

interface VideoAnalysisCardProps {
    uploadedVideo: File | null;
    onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRerunSimulation: () => void;
    isSimulating: boolean;
}

export function VideoAnalysisCard({
    uploadedVideo,
    onVideoUpload,
    onRerunSimulation,
    isSimulating,
}: VideoAnalysisCardProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoClick = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);
        // Simulate loading delay
        setTimeout(() => {
            setIsLoading(false);
            onVideoUpload(event);
        }, 1000);
    };

    return (
        <motion.div
            className="h-full w-full p-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main Video Analysis Card */}
            <div
                className="h-full rounded-[20px] overflow-hidden relative"
                style={{
                    background: "rgba(11, 17, 32, 0.3)",
                    backdropFilter: "blur(30px)",
                    border: "1px solid rgba(80, 80, 255, 0.2)",
                    boxShadow: "0 0 40px rgba(80, 80, 255, 0.15)",
                }}
            >
                {/* Video Player Section - 60% height */}
                <div className="relative h-[60%] overflow-hidden">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full bg-gray-900/50 flex items-center justify-center"
                            >
                                <motion.div
                                    className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </motion.div>
                        ) : uploadedVideo ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full h-full cursor-pointer group"
                                onClick={handleVideoClick}
                            >
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                                        border: "1px solid rgba(30, 41, 59, 0.5)",
                                    }}
                                >
                                    <source
                                        src={URL.createObjectURL(uploadedVideo)}
                                        type={uploadedVideo.type}
                                    />
                                </video>

                                {/* Video Overlays */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />

                                {/* Top-left overlay text */}
                                <div className="absolute top-4 left-4 text-white">
                                    <motion.h3
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-lg font-medium"
                                    >
                                        Ad: iPhone 16 Launch
                                    </motion.h3>
                                </div>

                                {/* Top-right overlay badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="absolute top-4 right-4"
                                >
                                    <motion.div
                                        className="px-3 py-1 bg-blue-500/20 backdrop-blur-sm border border-blue-500/40 rounded-full text-xs text-blue-300 relative"
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 0 rgba(59, 130, 246, 0.4)",
                                                "0 0 0 8px rgba(59, 130, 246, 0)",
                                                "0 0 0 0 rgba(59, 130, 246, 0)",
                                            ],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <motion.div
                                            className="absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        />
                                        <span className="ml-3">Analyzing…</span>
                                    </motion.div>
                                </motion.div>

                                {/* Play/Pause indicator */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
                                        {isPlaying ? (
                                            <Pause className="w-6 h-6 text-white" />
                                        ) : (
                                            <Play className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full bg-gray-900/30 flex items-center justify-center"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                                    border: "1px solid rgba(30, 41, 59, 0.5)",
                                }}
                            >
                                <div className="text-center text-white/50">
                                    <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">
                                        Upload video to analyze
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Meta Section - 40% height */}
                <motion.div
                    className="h-[40%] p-6 space-y-6 flex flex-col justify-between"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: uploadedVideo ? 0.6 : 0,
                        duration: 0.5,
                    }}
                >
                    {/* Tags and Description */}
                    <div className="space-y-4">
                        {/* Tag Pills */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                "Tech Product",
                                "Lifestyle Tone",
                                "Cinematic",
                            ].map((tag, index) => (
                                <motion.div
                                    key={tag}
                                    className="px-3 py-1 text-xs rounded-full text-white relative overflow-hidden group cursor-default"
                                    style={{
                                        background: "rgba(30, 41, 59, 0.3)",
                                        border: "1px solid transparent",
                                        backgroundImage:
                                            "linear-gradient(rgba(30, 41, 59, 0.3), rgba(30, 41, 59, 0.3)), linear-gradient(135deg, #6EE7B7 0%, #2563EB 50%, #A855F7 100%)",
                                        backgroundOrigin: "border-box",
                                        backgroundClip:
                                            "content-box, border-box",
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileInView={{
                                        transition: { delay: index * 0.1 },
                                    }}
                                >
                                    <span className="relative z-10">{tag}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Description */}
                        <motion.p
                            className="text-sm text-white/70 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            A cinematic iPhone ad focusing on design and
                            emotional connection.
                        </motion.p>

                        {/* Emotion Graph */}
                        <div>
                            <motion.h4
                                className="text-sm text-white/80 mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Emotion peaks over time
                            </motion.h4>
                            <div className="bg-gray-800/20 rounded-lg p-3 border border-gray-700/20">
                                <div className="flex items-end justify-between h-12 gap-1">
                                    {Array.from({ length: 16 }, (_, i) => (
                                        <motion.div
                                            key={i}
                                            className="bg-gradient-to-t from-blue-500/40 to-blue-400/80 rounded-sm flex-1 relative overflow-hidden"
                                            style={{
                                                height: `${
                                                    20 +
                                                    Math.sin(i * 0.8) * 30 +
                                                    Math.random() * 20
                                                }%`,
                                            }}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: `${
                                                    20 +
                                                    Math.sin(i * 0.8) * 30 +
                                                    Math.random() * 20
                                                }%`,
                                                opacity: 1,
                                            }}
                                            transition={{
                                                delay: 0.5 + i * 0.05,
                                                duration: 0.4,
                                            }}
                                        >
                                            {/* Shimmer effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                                                animate={{
                                                    y: ["-100%", "100%"],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: Math.random() * 2,
                                                    ease: "easeInOut",
                                                }}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Section */}
                    <motion.div
                        className="flex justify-between items-center gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        {/* Left-aligned Re-run button */}
                        <Button
                            onClick={onRerunSimulation}
                            disabled={!uploadedVideo || isSimulating}
                            className="bg-gray-800/50 hover:bg-gray-700/60 text-white border border-gray-600/50 hover:border-gray-500/60 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
                            size="sm"
                        >
                            {isSimulating ? (
                                <>
                                    <motion.div
                                        className="w-3 h-3 border border-white border-t-transparent rounded-full mr-2"
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    />
                                    Running...
                                </>
                            ) : (
                                "Re-run Simulation"
                            )}
                        </Button>

                        {/* Right-aligned Upload button */}
                        <div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleUpload}
                                className="hidden"
                            />
                            <Button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-600/80 hover:bg-blue-500 text-white border border-blue-500/50 hover:border-blue-400 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25 relative overflow-hidden group"
                                size="sm"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <span className="relative z-10 flex items-center gap-1">
                                    <Upload className="w-3 h-3" />
                                    Upload New Video →
                                </span>
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
