"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Upload, ChevronLeft, LogOut } from "lucide-react";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { mockPeople } from "@/lib/mockPeople";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Tables } from "@/database.types";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { updateJob as updateJobAction } from "@/app/actions/update-job";

type Ad = Tables<"ads">;

export default function UploadPage() {
    const { username, projectId } = useParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createBrowserClient();

    const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
    const [uploadedAd, setUploadedAd] = useState<Ad | null>(null);
    const [prompt, setPrompt] = useState(
        "Simulate how 25 Gen Z tech enthusiasts react to this ad"
    );
    const [isLoading, setIsLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // Video analysis mutation
    const { mutate: analyzeVideo, isPending: analyzingVideo } = useMutation({
        mutationFn: async () => {
            const response = await apiClient.POST("/{job_id}/video", {
                params: {
                    path: {
                        job_id: projectId as string,
                    },
                },
            });
            return response.data;
        },
    });

    // Video upload mutation
    const { mutate: uploadVideoToSupabase, isPending: uploadingVideo } =
        useMutation({
            mutationFn: async (video: File) => {
                const fileName = `${Date.now()}-${video.name}`;

                // Upload file to Supabase storage
                const { data: uploadData, error: uploadError } =
                    await supabase.storage
                        .from("videos")
                        .upload(fileName, video, {
                            cacheControl: "3600",
                            upsert: false,
                        });

                if (uploadError) {
                    throw new Error(`Upload failed: ${uploadError.message}`);
                }

                // Get public URL
                const {
                    data: { publicUrl },
                } = supabase.storage.from("videos").getPublicUrl(fileName);

                // Insert record into ads table
                const { data: adData, error: adError } = await supabase
                    .from("ads")
                    .insert({
                        video_url: publicUrl,
                    })
                    .select()
                    .single();

                if (adError) {
                    throw new Error(
                        `Database insert failed: ${adError.message}`
                    );
                }

                return adData;
            },
            onSuccess: (data) => {
                setUploadedAd(data);
                setUploadError(null);
                setIsLoading(false);

                // Immediately trigger video analysis
                analyzeVideo();
            },
            onError: (error) => {
                setUploadError(error.message);
                setIsLoading(false);
            },
        });

    // Job update mutation
    const { mutateAsync: updateJob, isPending: updatingJob } = useMutation({
        mutationFn: async () => {
            const jobData = await updateJobAction(
                projectId as string,
                prompt,
                uploadedAd!.id
            );
            return jobData;
        },
    });

    // Persona search mutation
    const { mutateAsync: createPersonas, isPending: creatingPersonas } =
        useMutation({
            mutationFn: async () => {
                const response = await apiClient.POST("/{job_id}/search", {
                    params: {
                        path: {
                            job_id: projectId as string,
                        },
                    },
                    body: {
                        sentence: prompt,
                    },
                });
                return response.data;
            },
        });

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith("video/")) {
            // Immediately set the video file for preview
            setUploadedVideo(file);
            setIsLoading(false);

            // Start Supabase upload in background
            uploadVideoToSupabase(file);
        }
    };

    const handleRunSimulation = async () => {
        if (!uploadedVideo || !prompt.trim() || !uploadedAd) return;

        try {
            await updateJob();

            await createPersonas();

            // Navigate to dashboard immediately
            router.push(`/${username}/projects/${projectId}/dashboard`);
        } catch (error) {
            console.error("Error running simulation:", error);
            setUploadError(
                error instanceof Error
                    ? error.message
                    : "Failed to start simulation"
            );
        }
    };

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative">
            {/* Header */}
            <div className="border-b border-gray-800/50 bg-black/80 backdrop-blur-sm relative z-50">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => router.push(`/${username}/projects`)}
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-gray-800"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl text-white">Upload Video</h1>
                            <p className="text-sm text-white/60">
                                Upload and configure your video analysis
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => router.push("/")}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-gray-800 hover:text-red-400 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-8 py-12 relative">
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

                {/* Upload Card */}
                <motion.div
                    className="w-full max-w-2xl relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Video Upload Area */}
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
                        {isLoading ? (
                            <div className="aspect-video flex items-center justify-center bg-gray-900/30">
                                <motion.div
                                    className="w-16 h-16 border-4 border-transparent border-t-white/30 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            </div>
                        ) : uploadedVideo ? (
                            <div className="relative aspect-video">
                                <video
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                >
                                    <source
                                        src={URL.createObjectURL(uploadedVideo)}
                                        type={uploadedVideo.type}
                                    />
                                </video>
                                <div className="absolute top-6 left-6">
                                    <h2 className="text-2xl text-white">
                                        {uploadedVideo.name}
                                    </h2>
                                </div>
                                {/* Upload progress indicator */}
                                {uploadingVideo && (
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    className="w-4 h-4 border-2 border-transparent border-t-white/70 rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                                <span className="text-sm text-white/70">
                                                    Uploading to cloud
                                                    storage... This will
                                                    continue in the background.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Upload progress indicator */}
                                {analyzingVideo && (
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    className="w-4 h-4 border-2 border-transparent border-t-white/70 rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        ease: "linear",
                                                    }}
                                                />
                                                <span className="text-sm text-white/70">
                                                    Analyzing video... This will
                                                    continue in the background.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                className="aspect-video flex flex-col items-center justify-center cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <motion.div
                                    className="mb-6"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, rgba(110, 231, 183, 0.1), rgba(37, 99, 235, 0.1), rgba(168, 85, 247, 0.1))",
                                            border: "2px solid transparent",
                                            backgroundClip: "padding-box",
                                        }}
                                    >
                                        <Upload className="w-8 h-8 text-white/70" />
                                    </div>
                                </motion.div>
                                <h3 className="text-xl text-white/70 mb-2">
                                    Upload video to analyze
                                </h3>
                                <p className="text-sm text-white/50">
                                    Supports MP4, MOV files up to 200MB
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {uploadError && (
                        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-400/20">
                            <p className="text-sm text-red-400">
                                {uploadError}
                            </p>
                        </div>
                    )}

                    {/* Prompt Input */}
                    <div
                        className="rounded-2xl p-4 mb-6"
                        style={{
                            background: "rgba(0, 0, 0, 0.6)",
                            backdropFilter: "blur(20px)",
                            border: `1px solid ${
                                prompt.trim() && uploadedVideo
                                    ? "rgba(110, 231, 183, 0.3)"
                                    : "rgba(255, 255, 255, 0.1)"
                            }`,
                            boxShadow:
                                prompt.trim() && uploadedVideo
                                    ? "0 0 40px rgba(110, 231, 183, 0.1)"
                                    : "none",
                        }}
                    >
                        <Input
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Simulate how 25 Gen Z tech enthusiasts react to this ad"
                            className="bg-transparent border-none text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10"
                            onKeyPress={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    prompt.trim() &&
                                    uploadedVideo
                                ) {
                                    handleRunSimulation();
                                }
                            }}
                        />
                    </div>

                    {/* Run Simulation Button */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            onClick={handleRunSimulation}
                            disabled={
                                !prompt.trim() ||
                                !uploadedVideo ||
                                !uploadedAd ||
                                updatingJob ||
                                creatingPersonas
                            }
                            className="w-full px-6 py-6 text-white border-2 border-transparent relative overflow-hidden group text-lg"
                            style={{
                                background:
                                    "linear-gradient(135deg, #6EE7B7, #2563EB, #A855F7)",
                                borderRadius: "12px",
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(110, 231, 183, 0.3), rgba(37, 99, 235, 0.3), rgba(168, 85, 247, 0.3))",
                                    filter: "blur(4px)",
                                }}
                            />
                            <span className="relative z-10">
                                {updatingJob
                                    ? "Starting Simulation..."
                                    : "Run Simulation"}
                            </span>
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
}
