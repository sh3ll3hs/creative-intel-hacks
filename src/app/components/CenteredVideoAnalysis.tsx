import { useState, useRef, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Upload, Play, Pause, CheckCircle, X } from "lucide-react";

interface CenteredVideoAnalysisProps {
    uploadedVideo: File | null;
    onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    targetAudience: string;
    onTargetAudienceChange: (value: string) => void;
    personaCount: number[];
    onPersonaCountChange: (value: number[]) => void;
    onSimulate: () => void;
    isSimulating: boolean;
}

export function CenteredVideoAnalysis({
    uploadedVideo,
    onVideoUpload,
    targetAudience,
    onTargetAudienceChange,
    personaCount,
    onPersonaCountChange,
    onSimulate,
    isSimulating,
}: CenteredVideoAnalysisProps) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Generate suggested tags based on input
    useEffect(() => {
        if (targetAudience.trim()) {
            const allTags = [
                "Gen Z",
                "Tech Lovers",
                "Marketers",
                "Finance Professionals",
                "Designers",
                "Millennials",
                "Students",
                "Entrepreneurs",
            ];
            const foundTags = allTags.filter((tag) =>
                targetAudience
                    .toLowerCase()
                    .includes(tag.toLowerCase().replace(/\s+/g, ""))
            );
            setSuggestedTags(foundTags);
        } else {
            setSuggestedTags([]);
        }
    }, [targetAudience]);

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
        setTimeout(() => {
            setIsLoading(false);
            onVideoUpload(event);
        }, 1000);
    };

    const removeVideo = () => {
        // Create a fake event to clear the video
        const fakeEvent = {
            target: { files: [] },
        } as React.ChangeEvent<HTMLInputElement>;
        onVideoUpload(fakeEvent);
    };

    const addTag = (tag: string) => {
        if (!targetAudience.toLowerCase().includes(tag.toLowerCase())) {
            onTargetAudienceChange(
                targetAudience.trim() ? `${targetAudience} ${tag}` : tag
            );
        }
    };

    const canRunSimulation = uploadedVideo && targetAudience.trim().length > 0;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-8 py-12 relative">
            {/* Main Content Container */}
            <motion.div
                className="w-full max-w-2xl relative z-10 space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Video Upload Section */}
                <div
                    className="relative rounded-2xl overflow-hidden border border-gray-600/30"
                    style={{
                        background: "rgba(11, 17, 32, 0.4)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <AnimatePresence mode="wait">
                        {isLoading ? (
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
                                />
                            </motion.div>
                        ) : uploadedVideo ? (
                            <motion.div
                                key="video"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className="relative aspect-video"
                            >
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover cursor-pointer"
                                    autoPlay
                                    muted
                                    loop
                                    onClick={handleVideoClick}
                                >
                                    <source
                                        src={URL.createObjectURL(uploadedVideo)}
                                        type={uploadedVideo.type}
                                    />
                                </video>

                                {/* Video Info Overlay */}
                                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/40">
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                        <div>
                                            <div className="text-white text-sm font-medium">
                                                {uploadedVideo.name}
                                            </div>
                                            <div className="text-gray-400 text-xs">
                                                {Math.round(
                                                    (uploadedVideo.size /
                                                        1024 /
                                                        1024) *
                                                        10
                                                ) / 10}
                                                MB
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={removeVideo}
                                        className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-600/40 text-gray-400 hover:text-white hover:border-red-400/40 transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>

                                {/* Play/Pause Control */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/10"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 border border-gray-600/40">
                                        {isPlaying ? (
                                            <Pause className="w-8 h-8 text-white" />
                                        ) : (
                                            <Play className="w-8 h-8 text-white" />
                                        )}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-video flex flex-col items-center justify-center cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <motion.div
                                    className="mb-6"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-700/30 border-2 border-dashed border-gray-600/50 group-hover:border-gray-500/70 transition-colors">
                                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-gray-300" />
                                    </div>
                                </motion.div>
                                <motion.h3 className="text-xl text-gray-300 mb-2 group-hover:text-white transition-colors">
                                    Upload video to analyze
                                </motion.h3>
                                <p className="text-sm text-gray-500">
                                    Supports MP4, MOV files up to 200MB
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Simulation Builder - Only show when video is uploaded */}
                <AnimatePresence>
                    {uploadedVideo && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="space-y-6"
                        >
                            {/* Target Audience Section */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-3">
                                    Describe your target audience
                                </label>
                                <div
                                    className="relative rounded-xl border border-gray-600/30 p-1"
                                    style={{
                                        background: "rgba(0, 0, 0, 0.4)",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <textarea
                                        value={targetAudience}
                                        onChange={(e) =>
                                            onTargetAudienceChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Gen Z Tech Lovers Marketers Finance Professionals Designers"
                                        className="w-full bg-transparent border-none text-white placeholder:text-gray-500 focus:outline-none resize-none p-4 text-sm"
                                        rows={3}
                                    />
                                </div>

                                {/* Suggested Tags */}
                                <AnimatePresence>
                                    {suggestedTags.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex flex-wrap gap-2 mt-3"
                                        >
                                            {suggestedTags.map((tag, index) => (
                                                <motion.button
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
                                                        delay: index * 0.05,
                                                    }}
                                                    onClick={() => addTag(tag)}
                                                    className="px-3 py-1 text-xs bg-gray-700/50 border border-gray-600/50 text-gray-300 rounded-full hover:bg-gray-600/50 hover:border-gray-500/70 transition-colors"
                                                >
                                                    + {tag}
                                                </motion.button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Personas Count Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="text-white text-sm font-medium">
                                        Personas to simulate
                                    </label>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-white">
                                            {personaCount[0]}
                                        </div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                                            personas
                                        </div>
                                    </div>
                                </div>

                                <div className="px-2">
                                    <Slider
                                        value={personaCount}
                                        onValueChange={onPersonaCountChange}
                                        max={100}
                                        min={5}
                                        step={5}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>5</span>
                                        <span>Range: 5-100 personas</span>
                                        <span>100</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Run Simulation Button */}
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: uploadedVideo ? 0.8 : 0.3 }}
                >
                    <motion.div
                        whileHover={canRunSimulation ? { scale: 1.02 } : {}}
                        whileTap={canRunSimulation ? { scale: 0.98 } : {}}
                    >
                        <Button
                            onClick={onSimulate}
                            disabled={!canRunSimulation || isSimulating}
                            className="w-full py-4 text-white border-2 border-transparent relative overflow-hidden group text-lg font-medium"
                            style={{
                                background: canRunSimulation
                                    ? "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)"
                                    : "rgba(55, 65, 81, 0.5)",
                                borderRadius: "12px",
                                opacity: canRunSimulation ? 1 : 0.5,
                            }}
                        >
                            {/* Glow effect */}
                            {canRunSimulation && (
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                                        filter: "blur(4px)",
                                    }}
                                />
                            )}

                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isSimulating ? (
                                    <>
                                        <motion.div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                ease: "linear",
                                            }}
                                        />
                                        Running Simulation...
                                    </>
                                ) : (
                                    "Run Simulation"
                                )}
                            </span>
                        </Button>

                        {/* Help Text */}
                        {!canRunSimulation && !isSimulating && (
                            <div className="mt-3 text-center text-gray-500 text-sm">
                                {!uploadedVideo
                                    ? "Upload a video to begin"
                                    : "Describe your target audience to continue"}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleUpload}
                className="hidden"
            />
        </div>
    );
}
