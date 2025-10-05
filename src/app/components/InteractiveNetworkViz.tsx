import { useState, useEffect, useRef } from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PersonaReactionPanel } from './PersonaReactionPanel';
import type { Person } from '../App';

interface PersonaNode extends Person {
  color: string;
  x: number;
  y: number;
  engagement: number;
}

interface InteractiveNetworkVizProps {
  isRunning?: boolean;
  onRunSimulation?: () => void;
  people?: Person[];
}

const generatePersonas = (): PersonaNode[] => {
  const personaTemplates = [
    { name: "Alex Chen", title: "Software Engineer", generation: "Gen Z", industry: "Technology", reaction: "intrigued", color: "#22d3ee" },
    { name: "Maya Rodriguez", title: "Art Director", generation: "Millennial", industry: "Creative", reaction: "inspired", color: "#a855f7" },
    { name: "David Kim", title: "Product Manager", generation: "Millennial", industry: "Technology", reaction: "analytical", color: "#f59e0b" },
    { name: "Sarah Johnson", title: "Marketing Director", generation: "Gen X", industry: "Marketing", reaction: "strategic", color: "#eab308" },
    { name: "Luis Martinez", title: "UX Designer", generation: "Millennial", industry: "Design", reaction: "thoughtful", color: "#22c55e" },
    { name: "Emma Wilson", title: "Data Analyst", generation: "Gen Z", industry: "Technology", reaction: "excited", color: "#8b5cf6" },
    { name: "Michael Brown", title: "Business Analyst", generation: "Gen X", industry: "Finance", reaction: "practical", color: "#3b82f6" },
    { name: "Jessica Lee", title: "Creative Director", generation: "Millennial", industry: "Creative", reaction: "inspired", color: "#ec4899" },
    { name: "Ryan Thompson", title: "Operations Manager", generation: "Gen Z", industry: "Operations", reaction: "intrigued", color: "#06b6d4" },
    { name: "Amanda Davis", title: "Social Media Manager", generation: "Gen Z", industry: "Marketing", reaction: "excited", color: "#f97316" },
    { name: "Kevin Park", title: "IT Director", generation: "Gen X", industry: "Technology", reaction: "analytical", color: "#84cc16" },
    { name: "Nicole Garcia", title: "Brand Manager", generation: "Millennial", industry: "Marketing", reaction: "strategic", color: "#6366f1" },
    { name: "Tyler Adams", title: "Finance Lead", generation: "Gen X", industry: "Finance", reaction: "practical", color: "#d946ef" },
    { name: "Zoe Mitchell", title: "Product Designer", generation: "Gen Z", industry: "Design", reaction: "thoughtful", color: "#10b981" },
    { name: "Chris Wong", title: "Growth Manager", generation: "Millennial", industry: "Marketing", reaction: "intrigued", color: "#fbbf24" },
    { name: "Rachel Stone", title: "Operations Chief", generation: "Gen X", industry: "Operations", reaction: "practical", color: "#ef4444" }
  ];

  // Generate stable positions in a circle around center
  return personaTemplates.map((template, index) => {
    const angle = (index / personaTemplates.length) * 2 * Math.PI;
    const radius = 200 + Math.random() * 80;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    const locations = [
      "Toronto, ON", "Vancouver, BC", "Montreal, QC", "Calgary, AB", 
      "Ottawa, ON", "Edmonton, AB", "Winnipeg, MB", "Halifax, NS"
    ];
    
    return {
      id: `persona-${index}`,
      name: template.name,
      age: 25 + Math.floor(Math.random() * 15),
      gender: Math.random() > 0.5 ? "Women" : "Men",
      location: locations[Math.floor(Math.random() * locations.length)],
      title: template.title,
      generation: template.generation,
      industry: template.industry,
      feedback: `Great potential for ${template.industry.toLowerCase()} applications. The approach resonates well with ${template.generation} audiences.`,
      reaction: template.reaction,
      fullReaction: `As a ${template.generation} ${template.title}, this person shows ${template.reaction} engagement with the content, particularly responding to elements that align with their professional background in ${template.industry}.`,
      position: { x: x / 300, y: y / 300, z: 0 },
      color: template.color,
      x,
      y,
      engagement: 45 + Math.random() * 50
    };
  });
};

export function InteractiveNetworkViz({ isRunning = false, onRunSimulation, people }: InteractiveNetworkVizProps) {
  const [personas] = useState<PersonaNode[]>(generatePersonas);
  const [hoveredNode, setHoveredNode] = useState<PersonaNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<PersonaNode | null>(null);
  const [showPersonaPanel, setShowPersonaPanel] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse position for hover cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    if (hoveredNode) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [hoveredNode]);

  const handleRunSimulation = () => {
    setSimulationActive(true);
    onRunSimulation?.();
    
    // Reset after animation
    setTimeout(() => {
      setSimulationActive(false);
    }, 3000);
  };

  const handleNodeClick = (node: PersonaNode) => {
    setSelectedNode(node);
    setShowPersonaPanel(true);
  };

  const handleClosePersonaPanel = () => {
    setShowPersonaPanel(false);
    setSelectedNode(null);
  };

  const handleAddToFeedback = (person: Person) => {
    // This could be passed as a prop to handle feedback addition
    console.log('Adding to feedback:', person.name);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full min-h-[600px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #010310 0%, #0B1120 100%)'
      }}
    >
      {/* Star particles background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Central Video Node */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          className="relative"
          animate={simulationActive ? {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          } : {}}
          transition={{
            duration: 2,
            ease: "easeInOut"
          }}
        >
          {/* Orbit rings */}
          <div className="absolute inset-0 -z-10">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-white/10 rounded-full"
                style={{
                  width: `${120 + i * 60}px`,
                  height: `${120 + i * 60}px`,
                  left: `${-60 - i * 30}px`,
                  top: `${-60 - i * 30}px`
                }}
                animate={{
                  rotate: simulationActive ? 360 : 0
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: simulationActive ? Infinity : 0,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Central node with Towa gradient */}
          <motion.div
            className="w-20 h-20 rounded-full relative overflow-hidden cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6EE7B7 0%, #2563EB 50%, #A855F7 100%)',
              boxShadow: simulationActive 
                ? '0 0 40px rgba(110, 231, 183, 0.6), 0 0 80px rgba(37, 99, 235, 0.4)'
                : '0 0 20px rgba(110, 231, 183, 0.3)'
            }}
            whileHover={{ scale: 1.1 }}
            onClick={handleRunSimulation}
            animate={simulationActive ? {
              boxShadow: [
                '0 0 20px rgba(110, 231, 183, 0.3)',
                '0 0 60px rgba(110, 231, 183, 0.8)',
                '0 0 20px rgba(110, 231, 183, 0.3)'
              ]
            } : {}}
          >
            <div className="absolute inset-2 rounded-full bg-slate-800/80 flex items-center justify-center">
              <span 
                className="text-white text-sm font-medium tracking-wider"
                style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
              >
                VIDEO
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {personas.map((persona) => (
          <motion.line
            key={`line-${persona.id}`}
            x1="50%"
            y1="50%"
            x2={`calc(50% + ${persona.x}px)`}
            y2={`calc(50% + ${persona.y}px)`}
            stroke="url(#connectionGradient)"
            strokeWidth={selectedNode?.id === persona.id ? "2" : "1"}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: simulationActive ? 0.8 : 0.3,
              stroke: simulationActive ? "#6EE7B7" : "url(#connectionGradient)"
            }}
            transition={{ 
              duration: 0.3,
              delay: simulationActive ? Math.random() * 0.5 : 0
            }}
          />
        ))}
      </svg>

      {/* Persona nodes */}
      {personas.map((persona, index) => (
        <motion.div
          key={persona.id}
          className="absolute cursor-pointer z-20"
          style={{
            left: `calc(50% + ${persona.x}px)`,
            top: `calc(50% + ${persona.y}px)`,
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            ...(simulationActive && {
              scale: [1, 1.5, 1],
              boxShadow: [
                `0 0 10px ${persona.color}40`,
                `0 0 30px ${persona.color}80`,
                `0 0 10px ${persona.color}40`
              ]
            })
          }}
          transition={{ 
            delay: index * 0.1,
            duration: simulationActive ? 0.8 : 0.6,
            type: "spring",
            stiffness: 200
          }}
          onHoverStart={() => setHoveredNode(persona)}
          onHoverEnd={() => setHoveredNode(null)}
          onClick={() => handleNodeClick(persona)}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Node glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${persona.color}40 0%, transparent 70%)`,
              filter: 'blur(8px)'
            }}
            animate={selectedNode?.id === persona.id ? {
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: selectedNode?.id === persona.id ? Infinity : 0
            }}
          />
          
          {/* Main node */}
          <div
            className="w-4 h-4 rounded-full border-2 border-white/30 relative"
            style={{ 
              backgroundColor: persona.color,
              boxShadow: `0 0 15px ${persona.color}60`
            }}
          >
            {/* Inner highlight */}
            <div className="absolute inset-0.5 rounded-full bg-white/30" />
          </div>
        </motion.div>
      ))}

      {/* Hover card */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-30 pointer-events-none"
            style={{
              left: mousePosition.x + 20,
              top: mousePosition.y - 80,
              fontFamily: 'Space Grotesk, Inter, sans-serif'
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 min-w-[250px]">
              <div className="text-white text-base font-medium mb-2">
                {hoveredNode.name}
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                  {hoveredNode.generation}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                  {hoveredNode.industry}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="text-xs text-white/60 mb-1">Interest</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: hoveredNode.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${hoveredNode.engagement}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs text-white/80">
                    {Math.round(hoveredNode.engagement)}%
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-white/80 italic">
                "{hoveredNode.feedback}"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run simulation button */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <motion.button
          onClick={handleRunSimulation}
          disabled={simulationActive}
          className="px-6 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {simulationActive ? 'Running Simulation...' : 'Run Simulation'}
        </motion.button>
      </motion.div>

      {/* Powered by footer */}
      <div className="absolute bottom-4 right-4 text-xs text-white/30" style={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
        Powered by Twelve Labs + ElevenLabs
      </div>

      {/* Persona Reaction Panel */}
      <AnimatePresence>
        {showPersonaPanel && selectedNode && (
          <PersonaReactionPanel
            person={selectedNode}
            onClose={handleClosePersonaPanel}
            onAddToFeedback={handleAddToFeedback}
          />
        )}
      </AnimatePresence>
    </div>
  );
}