import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Person } from "@/types/shared";

interface MissionStatusProps {
  filteredPeople: Person[];
  onViewFeedback: () => void;
  personaResponses?: Array<{
    id: string;
    persona_id: string | null;
    conversation: any;
  }>;
}

export function MissionStatus({
  filteredPeople,
  onViewFeedback,
  personaResponses = [],
}: MissionStatusProps) {
  const progress = filteredPeople.length > 0
    ? Math.round((personaResponses.length / filteredPeople.length) * 100)
    : 0;

  return (
    <div className="w-80 border-l border-gray-800/50 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Mission Status */}
        <div>
          <div className="text-sm text-white/50 mb-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${progress === 100 ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            MISSION STATUS
            <span className="ml-auto text-white">
              {progress === 100 ? 'COMPLETE' : 'IN PROGRESS'}
            </span>
          </div>
          <div className="text-xs space-y-1 text-white/70">
            <div>Progress: {progress}%</div>
            <div className="bg-gray-700/50 h-1 rounded overflow-hidden">
              <div
                className="bg-green-400 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-white/50">
              {personaResponses.length} / {filteredPeople.length} responses
            </div>
          </div>
        </div>

        {/* Responses Summary */}
        <div>
          <div className="text-sm text-white/50 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            PERSONA RESPONSES
          </div>

          {/* Glassmorphic Card Container */}
          <div
            className="relative rounded-lg p-5 backdrop-blur-sm border border-blue-400/20 max-h-96 overflow-y-auto"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              boxShadow:
                "inset 0 0 30px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.15)",
            }}
          >
            <div className="relative z-10 space-y-3">
              {personaResponses.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-xs text-white/50 mb-2">
                    {filteredPeople.length} personas loaded
                  </div>
                  <div className="text-xs text-white/30">
                    Click Run Simulation to analyze
                  </div>
                </div>
              ) : (
                personaResponses.map((response) => (
                  <div
                    key={response.id}
                    className="p-3 rounded bg-slate-800/40 border border-white/5"
                  >
                    <div className="text-xs text-white/70 mb-1">
                      Response {response.id.slice(0, 8)}
                    </div>
                    <div className="text-xs text-white/50">
                      Persona: {response.persona_id?.slice(0, 8)}
                    </div>
                  </div>
                ))
              )}
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
