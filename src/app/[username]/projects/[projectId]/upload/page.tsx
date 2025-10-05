"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Upload, ChevronLeft, LogOut } from "lucide-react";
import { parseSearchQuery } from "@/lib/parseSearchQuery";
import { mockPeople } from "@/lib/mockPeople";

export default function UploadPage() {
  const { username, projectId } = useParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [prompt, setPrompt] = useState(
    "Simulate how 25 Gen Z tech enthusiasts react to this ad"
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setIsLoading(true);
      setTimeout(() => {
        setUploadedVideo(file);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleRunSimulation = () => {
    if (!uploadedVideo || !prompt.trim()) return;

    // Parse the query and filter people
    const filtered = parseSearchQuery(prompt, mockPeople);

    // TODO: Save state (video, prompt, filteredPeopleIds) to backend/storage
    // This will be implemented separately from decoupling

    // Navigate to dashboard
    router.push(`/${username}/projects/${projectId}/dashboard`);
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
                  <h2 className="text-2xl text-white">{uploadedVideo.name}</h2>
                </div>
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleRunSimulation}
              disabled={!prompt.trim() || !uploadedVideo}
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
              <span className="relative z-10">Run Simulation</span>
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
