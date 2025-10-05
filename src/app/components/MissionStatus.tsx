import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/types/shared";

interface MissionStatusProps {
  filteredPeople: Person[];
  onViewFeedback: () => void;
}

export function MissionStatus({
  filteredPeople,
  onViewFeedback,
}: MissionStatusProps) {
  return (
    <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Mission Status */}
        <div>
          <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
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
            <div className="text-white/50">Status: READY</div>
          </div>
        </div>

        {/* Feedback Summary */}
        <div>
          <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            PERSONAS LOADED
          </div>
          <div className="text-xs text-white/40 mb-4">
            {filteredPeople.length} personas ready for simulation
          </div>

          {/* Glassmorphic Card Container */}
          <div
            className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              boxShadow:
                "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative z-10">
              <div className="text-center py-6">
                <div className="text-xs text-white/50 mb-2">
                  {filteredPeople.length} personas loaded
                </div>
                <div className="text-xs text-white/30">
                  Click Run Simulation to analyze
                </div>
              </div>
            </div>
          </div>

          {/* View All Feedback Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-8"
          >
            <Button
              onClick={onViewFeedback}
              className="w-full bg-slate-800/80 hover:bg-slate-700/80 text-white text-sm py-3 rounded-lg border border-white/10 hover:border-blue-400/30 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)",
              }}
            >
              View All Personas
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
