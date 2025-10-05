"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface LandingPageProps {
    onLogin: (username: string) => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
    const handleLogin = () => {
        const username = "hackathon-demo";
        onLogin(username.trim());
    };

    return (
        <div className="min-h-screen text-white relative">
            {/* Removed background - using stable background from App */}

            {/* Navigation */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-6">
                <div className="flex items-center gap-2">
                    <div className="text-2xl">T</div>
                    <span className="text-sm text-white/80">Towa</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm text-white/80">
                    <button className="hover:text-white transition-colors">
                        Home
                    </button>
                    <button className="hover:text-white transition-colors">
                        About
                    </button>
                    <button className="hover:text-white transition-colors">
                        Pricing
                    </button>
                    <button className="hover:text-white transition-colors flex items-center gap-1">
                        Discovery <ChevronDown className="w-3 h-3" />
                    </button>
                </div>

                <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/5 flex items-center gap-1"
                    onClick={() => handleLogin()}
                >
                    Login <ChevronDown className="w-3 h-3" />
                </Button>
            </nav>

            {/* Hero Section */}
            <div className="relative z-20 flex flex-col items-center justify-center px-8 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl text-center relative"
                >
                    <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight leading-none relative z-10">
                        AI agents for simulated
                        <br />
                        market research
                    </h1>

                    <p className="text-lg text-white/60 mb-12 max-w-lg mx-auto relative z-10">
                        Get a market analysis in minutes, not months.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="relative z-10"
                    >
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-white/90 px-8 py-4 text-base"
                            onClick={() => handleLogin()}
                        >
                            Explore Towa <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Preview Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="relative z-20 px-8 pb-16"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-b from-white/5 to-white/2 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-xl mb-4">
                                    Real-time simulation
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Deploy thousands of AI agents with unique
                                    personas to test your ideas against diverse
                                    market segments. Get instant feedback and
                                    actionable insights.
                                </p>
                            </div>
                            <div className="bg-black/40 rounded-lg p-6 border border-white/5">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            Active agents
                                        </span>
                                        <span>2,847</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            Response rate
                                        </span>
                                        <span>94.2%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">
                                            Avg. response time
                                        </span>
                                        <span>1.3s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
