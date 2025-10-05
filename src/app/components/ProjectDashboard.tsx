import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { motion } from "motion/react";
import { LogOut, Calendar, Plus } from "lucide-react";
import type { Project } from "@/types/shared";
import { TowaIcon } from "./TowaIcon";

interface ProjectDashboardProps {
    username: string;
    projects: Project[];
    onProjectSelect: (project: Project) => void;
    onNewProject: () => void;
    onLogout: () => void;
}

export function ProjectDashboard({
    username,
    projects,
    onProjectSelect,
    onNewProject,
    onLogout,
}: ProjectDashboardProps) {
    return (
        <div
            className="min-h-screen text-[#E5E5E5] relative overflow-hidden"
            style={{
                backgroundColor: "#000000",
                fontFamily:
                    'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
            }}
        >
            {/* Page fade-in animation */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative z-10"
            >
                {/* Top Navigation */}
                <div
                    className="relative z-10 border-b"
                    style={{ borderColor: "#333333" }}
                >
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            {/* Left: Logo */}
                            <div className="flex items-center gap-4">
                                <TowaIcon className="h-8 w-auto" />
                                <span className="text-lg font-medium tracking-wider text-[#E5E5E5]">
                                    TOWA
                                </span>
                                <span className="text-sm text-[#666666] ml-2 uppercase tracking-wider">
                                    projects
                                </span>
                            </div>

                            {/* Right: User + Logout */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-3 text-[#E5E5E5]">
                                    <span className="font-medium">
                                        {username}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onLogout}
                                    className="text-[#E5E5E5] hover:text-[#000000] hover:bg-[#E5E5E5] border border-[#E5E5E5] bg-[#000000] transition-all duration-200 font-mono uppercase tracking-wide text-xs px-3 py-1"
                                    style={{ borderRadius: "0px" }}
                                >
                                    Logout ↗
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Header */}
                <div className="relative z-10 px-8 pt-12 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-[24px] font-medium tracking-tight leading-tight mb-2 text-[#E5E5E5]">
                                    Welcome {username}.
                                </h1>
                                <p className="text-[14px] text-[#999999] font-normal">
                                    Manage your AI simulation projects and view
                                    insights
                                </p>
                            </div>
                            <Button
                                onClick={onNewProject}
                                className="text-[#E5E5E5] hover:text-[#000000] hover:bg-[#E5E5E5] border border-[#E5E5E5] bg-[#000000] transition-all duration-200 font-mono uppercase tracking-wide text-xs px-4 py-2"
                                style={{ borderRadius: "0px" }}
                            >
                                + New Project
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Project Grid - Strict 3x2 Layout */}
                <div className="relative z-10 px-8 pb-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-3 gap-6">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.05,
                                        ease: "easeOut",
                                    }}
                                    className="group cursor-pointer"
                                >
                                    <div
                                        className="border p-6 bg-[#000000] hover:bg-[#111111] transition-all duration-200 relative"
                                        style={{
                                            borderColor: "#333333",
                                            borderRadius: "0px",
                                        }}
                                    >
                                        {/* Content */}
                                        <div className="space-y-4">
                                            {/* Tags */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge
                                                    className="text-[10px] px-2 py-1 bg-[#000000] border text-[#E5E5E5] font-mono uppercase tracking-wider hover:bg-[#E5E5E5] hover:text-[#000000] transition-all duration-200"
                                                    style={{
                                                        borderColor: "#E5E5E5",
                                                        borderRadius: "0px",
                                                    }}
                                                >
                                                    SIMULATION
                                                </Badge>
                                                <Badge
                                                    className="text-[10px] px-2 py-1 bg-[#000000] border text-[#E5E5E5] font-mono uppercase tracking-wider hover:bg-[#E5E5E5] hover:text-[#000000] transition-all duration-200"
                                                    style={{
                                                        borderColor: "#E5E5E5",
                                                        borderRadius: "0px",
                                                    }}
                                                >
                                                    AI-POWERED
                                                </Badge>
                                                <Badge
                                                    className="text-[10px] px-2 py-1 bg-[#000000] border text-[#E5E5E5] font-mono uppercase tracking-wider hover:bg-[#E5E5E5] hover:text-[#000000] transition-all duration-200"
                                                    style={{
                                                        borderColor: "#E5E5E5",
                                                        borderRadius: "0px",
                                                    }}
                                                >
                                                    {project.phase}
                                                </Badge>
                                            </div>

                                            {/* Date */}
                                            <div className="text-[11px] text-[#666666] font-mono">
                                                ⊙{" "}
                                                {new Date(
                                                    project.date
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </div>

                                            {/* Project Title */}
                                            <h3 className="text-[16px] font-medium text-[#E5E5E5] leading-tight font-mono">
                                                {project.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-[12px] text-[#999999] leading-relaxed font-mono">
                                                {project.description}
                                            </p>

                                            {/* Progress */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-[#666666] font-mono uppercase tracking-wider">
                                                        {project.progress}%
                                                    </span>
                                                    <span className="text-[#666666] font-mono uppercase tracking-wider">
                                                        {project.phase}
                                                    </span>
                                                </div>

                                                {/* Progress Bar - Terminal Style */}
                                                <div className="relative">
                                                    <div
                                                        className={`font-mono text-[10px] tracking-wider ${
                                                            project.progress >=
                                                            70
                                                                ? "text-green-400"
                                                                : project.progress >=
                                                                  40
                                                                ? "text-yellow-400"
                                                                : "text-red-400"
                                                        }`}
                                                    >
                                                        [
                                                        {"█".repeat(
                                                            Math.floor(
                                                                project.progress /
                                                                    5
                                                            )
                                                        )}
                                                        {"░".repeat(
                                                            20 -
                                                                Math.floor(
                                                                    project.progress /
                                                                        5
                                                                )
                                                        )}
                                                        ]
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="text-[11px] text-[#666666] font-mono">
                                                ∞ 8 simulations
                                            </div>

                                            {/* Open Project Button */}
                                            <div className="pt-2">
                                                <div
                                                    className="w-full border py-2 px-4 text-center text-[#E5E5E5] text-[12px] font-mono hover:bg-[#E5E5E5] hover:text-[#000000] transition-all duration-200 uppercase tracking-wide bg-[#000000]"
                                                    style={{
                                                        borderColor: "#E5E5E5",
                                                        borderRadius: "0px",
                                                    }}
                                                    onClick={() =>
                                                        onProjectSelect(project)
                                                    }
                                                >
                                                    Open Project →
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
