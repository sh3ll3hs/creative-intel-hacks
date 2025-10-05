import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase/client";

interface CenteredVideoAnalysisProps {
    jobId: string;
    prompt: string;
    onPromptChange: (value: string) => void;
    onSimulate: () => void;
    isSimulating: boolean;
    showAnalysisReport?: boolean;
}

export function CenteredVideoAnalysis({
    jobId,
    prompt,
    onPromptChange,
    onSimulate,
    isSimulating,
    showAnalysisReport = false,
}: CenteredVideoAnalysisProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Fetch video URL from Supabase
    useEffect(() => {
        const fetchVideoUrl = async () => {
            try {
                const supabase = createBrowserClient();

                // First get the ads_id from the job
                const { data: job, error: jobError } = await supabase
                    .from("jobs")
                    .select("ads_id")
                    .eq("id", jobId)
                    .single();

                if (jobError) {
                    console.error("Error fetching job:", jobError);
                    setIsLoadingVideo(false);
                    return;
                }

                if (!job?.ads_id) {
                    console.error("No ads_id found for job:", jobId);
                    setIsLoadingVideo(false);
                    return;
                }

                // Then get the video_url from ads table
                const { data: ad, error: adError } = await supabase
                    .from("ads")
                    .select("video_url")
                    .eq("id", job.ads_id)
                    .single();

                if (adError) {
                    console.error("Error fetching ad:", adError);
                    setIsLoadingVideo(false);
                    return;
                }

                setVideoUrl(ad?.video_url || null);
                setIsLoadingVideo(false);
            } catch (error) {
                console.error("Error fetching video URL:", error);
                setIsLoadingVideo(false);
            }
        };

        if (jobId) {
            fetchVideoUrl();
        }
    }, [jobId]);

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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 relative">
            {/* Orbit Ring Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="w-[800px] h-[800px] border border-white/5 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 120,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                <motion.div
                    className="absolute w-[600px] h-[600px] border border-white/3 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 80,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Main Video Analysis Card */}
            <motion.div
                className="w-full max-w-2xl relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Video Player */}
                <div
                    className="relative mb-8 rounded-2xl overflow-hidden"
                    style={{
                        background: "rgba(11, 17, 32, 0.4)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(110, 231, 183, 0.2)",
                        boxShadow: `
              0 0 40px rgba(110, 231, 183, 0.1),
              0 0 80px rgba(37, 99, 235, 0.05),
              0 0 120px rgba(168, 85, 247, 0.03)
            `,
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isLoadingVideo ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="aspect-video flex items-center justify-center bg-gray-900/30"
                            >
                                <motion.div
                                    className="w-16 h-16 border-4 border-transparent border-t-white/30 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    style={{
                                        borderImage:
                                            "linear-gradient(45deg, #6EE7B7, #2563EB, #A855F7) 1",
                                    }}
                                />
                            </motion.div>
                        ) : videoUrl ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="relative aspect-video cursor-pointer group"
                                onClick={handleVideoClick}
                            >
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                >
                                    <source src={videoUrl} type="video/mp4" />
                                </video>

                                {/* Video Overlay */}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-200" />

                                {/* Play/Pause Control */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div
                                        className="bg-black/60 backdrop-blur-sm rounded-full p-4"
                                        style={{
                                            border: "1px solid rgba(110, 231, 183, 0.3)",
                                        }}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-8 h-8 text-white" />
                                        ) : (
                                            <Play className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </motion.div>

                                {/* Video Title Overlay */}
                                <div className="absolute top-6 left-6">
                                    <motion.h2
                                        className="text-2xl text-white"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        iPhone 16 Launch
                                    </motion.h2>
                                </div>

                                {/* Analyzing Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="absolute top-6 right-6"
                                >
                                    <motion.div
                                        className="px-4 py-2 backdrop-blur-sm border rounded-full text-sm text-white relative"
                                        style={{
                                            background:
                                                "rgba(37, 99, 235, 0.2)",
                                            borderColor:
                                                "rgba(37, 99, 235, 0.4)",
                                        }}
                                        animate={{
                                            boxShadow: [
                                                "0 0 0 0 rgba(37, 99, 235, 0.4)",
                                                "0 0 0 12px rgba(37, 99, 235, 0)",
                                                "0 0 0 0 rgba(37, 99, 235, 0)",
                                            ],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <motion.div
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        />
                                        <span className="ml-4">Analyzing…</span>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-video"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-video flex flex-col items-center justify-center"
                            >
                                <p className="text-white/60">No video found</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Analysis Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="rounded-2xl p-8 mb-8"
                    style={{
                        background: "rgba(11, 17, 32, 0.4)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(110, 231, 183, 0.2)",
                        boxShadow: `
              0 0 40px rgba(110, 231, 183, 0.1),
              0 0 80px rgba(37, 99, 235, 0.05)
            `,
                    }}
                >
                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {["Tech Product", "Lifestyle Tone", "Cinematic"].map(
                            (tag, index) => (
                                <motion.div
                                    key={tag}
                                    className="px-4 py-2 text-sm rounded-full text-white/80 relative overflow-hidden"
                                    style={{
                                        background: "rgba(30, 41, 59, 0.5)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: 0.7 + index * 0.1,
                                    }}
                                >
                                    {tag}
                                </motion.div>
                            )
                        )}
                    </div>

                    {/* AI Summary */}
                    <motion.p
                        className="text-white/80 leading-relaxed mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        A cinematic iPhone ad focusing on design and emotional
                        connection.
                    </motion.p>

                    {/* Emotion Timeline */}
                    <div>
                        <motion.h4
                            className="text-white/90 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.0 }}
                        >
                            Emotion peaks over time
                        </motion.h4>

                        <div
                            className="rounded-lg p-4"
                            style={{
                                background: "rgba(30, 41, 59, 0.2)",
                                border: "1px solid rgba(110, 231, 183, 0.1)",
                            }}
                        >
                            <div className="flex items-end justify-between h-20 gap-2">
                                {Array.from({ length: 20 }, (_, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 rounded-t-sm relative overflow-hidden"
                                        style={{
                                            height: `${
                                                25 +
                                                Math.sin(i * 0.6) * 35 +
                                                Math.random() * 15
                                            }%`,
                                            background:
                                                "linear-gradient(to top, rgba(37, 99, 235, 0.6), rgba(110, 231, 183, 0.8))",
                                        }}
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: `${
                                                25 +
                                                Math.sin(i * 0.6) * 35 +
                                                Math.random() * 15
                                            }%`,
                                            opacity: 1,
                                        }}
                                        transition={{
                                            delay: 1.1 + i * 0.03,
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
                                                duration: 2.5,
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
                </motion.div>

                {/* Prompt Input - Hide when analysis report is shown */}
                {!showAnalysisReport && (
                    <motion.div
                        className="w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: 1.3 }}
                    >
                        <div
                            className="rounded-2xl p-4"
                            style={{
                                background: "rgba(0, 0, 0, 0.6)",
                                backdropFilter: "blur(20px)",
                                border: `1px solid ${
                                    prompt.trim()
                                        ? "rgba(110, 231, 183, 0.3)"
                                        : "rgba(255, 255, 255, 0.1)"
                                }`,
                                boxShadow: prompt.trim()
                                    ? "0 0 40px rgba(110, 231, 183, 0.1)"
                                    : "none",
                            }}
                        >
                            {/* Ready indicator */}

                            <div className="flex items-center gap-3">
                                <Input
                                    value={prompt}
                                    onChange={(e) =>
                                        onPromptChange(e.target.value)
                                    }
                                    placeholder="Simulate how 25 Gen Z tech enthusiasts react to this ad"
                                    className="bg-transparent border-none text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 flex-1"
                                    onKeyPress={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            prompt.trim() &&
                                            !isSimulating
                                        ) {
                                            onSimulate();
                                        }
                                    }}
                                />
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        onClick={onSimulate}
                                        disabled={
                                            !prompt.trim() || isSimulating
                                        }
                                        className="px-6 py-2 text-white border-2 border-transparent relative overflow-hidden group"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
                                            borderRadius: "12px",
                                        }}
                                    >
                                        {/* Glow effect */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                                                filter: "blur(4px)",
                                            }}
                                        />

                                        <span className="relative z-10 flex items-center gap-2">
                                            {isSimulating ? (
                                                <>
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{
                                                            rotate: 360,
                                                        }}
                                                        transition={{
                                                            duration: 1,
                                                            repeat: Infinity,
                                                            ease: "linear",
                                                        }}
                                                    />
                                                    Running...
                                                </>
                                            ) : (
                                                "Run Simulation"
                                            )}
                                        </span>
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
