import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { AnalysisData } from "@/app/actions/analysis";

interface VideoAnalysisSidebarProps {
  showAnalysisReport: boolean;
  onViewFeedback: () => void;
  analysisData?: AnalysisData | null;
  isAnalyzing?: boolean;
}

export function VideoAnalysisSidebar({
  showAnalysisReport,
  onViewFeedback,
  analysisData = null,
  isAnalyzing = false,
}: VideoAnalysisSidebarProps) {
  return (
    <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Mission Status */}
        <div>
          <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
            {!showAnalysisReport && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
            MISSION STATUS
            <span className="ml-auto text-white">ACTIVE</span>
          </div>
          <div className="text-xs space-y-1 text-white/70">
            <div>Progress: 100%</div>
            <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
              <div
                className="bg-green-400 h-full"
                style={{ width: "100%" }}
              ></div>
            </div>
            <div className="text-white/50">Status: COMPLETE</div>
          </div>
        </div>

        {/* Feedback Summary */}
        <div>
          <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
            {!showAnalysisReport && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            )}
            FEEDBACK SUMMARY
          </div>
          <div className="text-xs text-white/40 mb-4">
            AI Personas&apos; key reactions
          </div>

          {/* Glassmorphic Card Container */}
          <div
            className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              boxShadow:
                "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative z-10">
              {isAnalyzing ? (
                <div className="text-center py-6">
                  <div className="text-xs text-white/50 mb-2">
                    Analyzing responses with AI...
                  </div>
                  <div className="text-xs text-white/30">
                    Generating insights
                  </div>
                </div>
              ) : showAnalysisReport && analysisData ? (
                <div className="space-y-4">
                  {/* Highlights Section */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Highlights
                    </div>
                    <div className="space-y-2">
                      {analysisData.highlights.map((highlight, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.3 + i * 0.3,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                          className="text-xs text-white/70 flex items-start gap-2"
                        >
                          <div className="w-1 h-1 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                          <span>&quot;{highlight}&quot;</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Themes (Tags) */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Themes
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.themes.map((tag, i) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 0.9 + i * 0.1,
                            duration: 0.4,
                          }}
                          className="px-2 py-1 rounded-full text-xs border border-white/20 text-white/70 cursor-pointer hover:border-cyan-400/50 hover:text-cyan-300 hover:bg-cyan-400/5 transition-all duration-300"
                          style={{
                            background: "rgba(110, 231, 183, 0.05)",
                          }}
                        >
                          #{tag}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Sentiment Overview */}
                  <div>
                    <div className="text-xs text-cyan-300 mb-2 font-medium">
                      Sentiment Overview
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          label: "Positive",
                          value: analysisData.sentiment.positive,
                          color: "#22c55e",
                        },
                        {
                          label: "Neutral",
                          value: analysisData.sentiment.neutral,
                          color: "#fbbf24",
                        },
                        {
                          label: "Negative",
                          value: analysisData.sentiment.negative,
                          color: "#ef4444",
                        },
                      ].map((sentiment, i) => (
                        <div key={sentiment.label} className="flex items-center gap-3">
                          <div className="w-16 text-xs text-white/60">
                            {sentiment.label}
                          </div>
                          <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: sentiment.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${sentiment.value}%` }}
                              transition={{
                                delay: 1.2 + i * 0.2,
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <div className="w-8 text-xs text-white/80 text-right">
                            {sentiment.value}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demographic Reactions */}
                  {analysisData.demographics.length > 0 && (
                    <div>
                      <div className="text-xs text-cyan-300 mb-2 font-medium">
                        Demographic Reactions
                      </div>
                      <div className="space-y-2">
                        {analysisData.demographics.map((demo, i) => (
                          <div key={demo.label} className="flex items-center gap-3">
                            <div className="w-20 text-xs text-white/60">
                              {demo.label}
                            </div>
                            <div className="flex-1 bg-white/5 h-2 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: demo.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${demo.value}%` }}
                                transition={{
                                  delay: 1.8 + i * 0.2,
                                  duration: 0.6,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                            <div className="w-8 text-xs text-white/80 text-right">
                              {demo.value}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-xs text-white/50 mb-2">
                    Running simulation...
                  </div>
                  <div className="text-xs text-white/30">
                    Analyzing persona reactions
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: showAnalysisReport ? 2.8 : 0.5,
              duration: 0.6,
            }}
            className="text-xs text-white/30 mt-6 leading-relaxed"
          >
            Generated by AI personas trained on audience profiles.
          </motion.div>

          {/* View All Feedback Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: showAnalysisReport ? 3.0 : 0.7,
              duration: 0.4,
            }}
            className="mt-8"
          >
            <Button
              onClick={onViewFeedback}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)",
              }}
            >
              View All Feedback
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
