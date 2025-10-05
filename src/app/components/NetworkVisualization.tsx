import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Person } from "@/types/shared";

interface NetworkVisualizationProps {
    people: Person[];
    onPersonClick: (person: Person) => void;
    uploadedVideo?: File | null;
    isSimulating?: boolean;
    searchComplete?: boolean;
}

interface AnimatedPerson extends Person {
    animatedPosition: { x: number; y: number; z: number };
    screenPosition: { x: number; y: number };
    scale: number;
    isVisible: boolean;
}

export function NetworkVisualization({
    people,
    onPersonClick,
    uploadedVideo,
    isSimulating = false,
    searchComplete = false,
}: NetworkVisualizationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [animatedPeople, setAnimatedPeople] = useState<AnimatedPerson[]>([]);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [rotation] = useState({ x: 0, y: 0 }); // Fixed rotation - no changes

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    // Generate random positions on a sphere surface
    const generateSpherePositions = (count: number) => {
        const positions = [];
        for (let i = 0; i < count; i++) {
            const phi = Math.acos(1 - 2 * Math.random()); // Inclination angle
            const theta = 2 * Math.PI * Math.random(); // Azimuth angle

            const radius = 200 + Math.random() * 100; // Varying distance from center

            positions.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.sin(phi) * Math.sin(theta),
                z: radius * Math.cos(phi),
            });
        }
        return positions;
    };

    useEffect(() => {
        if (containerSize.width && containerSize.height && people.length > 0) {
            const spherePositions = generateSpherePositions(people.length);

            const convertedPeople: AnimatedPerson[] = people.map(
                (person, index) => {
                    const pos3d = spherePositions[index];

                    // Project 3D position to 2D screen coordinates
                    const perspective = 800;
                    const centerX = containerSize.width / 2;
                    const centerY = containerSize.height / 2;

                    const rotatedX =
                        pos3d.x * Math.cos(rotation.y) -
                        pos3d.z * Math.sin(rotation.y);
                    const rotatedZ =
                        pos3d.x * Math.sin(rotation.y) +
                        pos3d.z * Math.cos(rotation.y);
                    const rotatedY =
                        pos3d.y * Math.cos(rotation.x) -
                        rotatedZ * Math.sin(rotation.x);
                    const finalZ =
                        pos3d.y * Math.sin(rotation.x) +
                        rotatedZ * Math.cos(rotation.x);

                    const scale = perspective / (perspective + finalZ);
                    const screenX = centerX + rotatedX * scale;
                    const screenY = centerY + rotatedY * scale;

                    return {
                        ...person,
                        animatedPosition: pos3d,
                        screenPosition: { x: screenX, y: screenY },
                        scale: Math.max(0.3, scale),
                        isVisible: finalZ > -100,
                    };
                }
            );

            setAnimatedPeople(convertedPeople);
        }
    }, [people, containerSize, rotation]);

    // Static rotation - no auto-rotation

    const getPersonColor = (reaction: string, index: number) => {
        const colors = [
            "bg-green-400", "bg-blue-400", "bg-purple-400", "bg-orange-400", 
            "bg-pink-400", "bg-cyan-400", "bg-yellow-400", "bg-red-400",
            "bg-indigo-400", "bg-teal-400", "bg-lime-400", "bg-rose-400"
        ];
        const gradients = [
            "from-green-400 to-green-600", "from-blue-400 to-blue-600", 
            "from-purple-400 to-purple-600", "from-orange-400 to-orange-600",
            "from-pink-400 to-pink-600", "from-cyan-400 to-cyan-600",
            "from-yellow-400 to-yellow-600", "from-red-400 to-red-600",
            "from-indigo-400 to-indigo-600", "from-teal-400 to-teal-600",
            "from-lime-400 to-lime-600", "from-rose-400 to-rose-600"
        ];
        
        const colorIndex = index % colors.length;
        return {
            bg: gradients[colorIndex],
            dot: colors[colorIndex],
        };
    };

    const getPersonSize = (index: number) => {
        const sizes = [
            { w: "w-2", h: "h-2", scale: "scale-75" },
            { w: "w-3", h: "h-3", scale: "scale-100" },
            { w: "w-4", h: "h-4", scale: "scale-125" },
            { w: "w-5", h: "h-5", scale: "scale-150" },
        ];
        return sizes[index % sizes.length];
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative bg-transparent overflow-hidden"
        >
            {/* Subtle starry radial gradient background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Central radial blur gradient */}
                <div
                    className="absolute w-96 h-96 rounded-full opacity-20"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(110, 231, 183, 0.1) 0%, rgba(37, 99, 235, 0.08) 40%, rgba(168, 85, 247, 0.06) 70%, transparent 100%)",
                        filter: "blur(40px)",
                    }}
                />
            </div>

            {/* People Dots floating around */}
            {animatedPeople.map(
                (person, index) =>
                    person.isVisible && (
                        <motion.div
                            key={person.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                scale: person.scale,
                                opacity: 1,
                                x: person.screenPosition.x,
                                y: person.screenPosition.y,
                            }}
                            transition={{
                                delay: searchComplete
                                    ? index * 0.05
                                    : index * 0.1,
                                duration: searchComplete ? 0.8 : 0.6,
                                type: "spring",
                                stiffness: searchComplete ? 300 : 200,
                            }}
                            className="absolute cursor-pointer group z-10"
                            style={{
                                left: "-6px",
                                top: "-6px",
                                zIndex: Math.floor(person.scale * 100),
                            }}
                            onClick={() => onPersonClick(person)}
                        >
                            <div className="relative">
                                {/* Subtle static glow - no pulsing */}
                                <div
                                    className={`absolute inset-0 rounded-full ${
                                        getPersonColor(person.reaction, index).dot
                                    } opacity-30`}
                                    style={{
                                        transform: "scale(1.2)",
                                        filter: "blur(2px)",
                                    }}
                                />

                                {/* Main Star Dot - Static */}
                                <div
                                    className={`
                  ${getPersonSize(index).w} ${getPersonSize(index).h} rounded-full ${getPersonColor(person.reaction, index).dot}
                  border border-white/40 backdrop-blur-sm
                  group-hover:scale-150 group-hover:border-white/80
                  transition-all duration-300 relative z-10
                `}
                                    style={{
                                        boxShadow: `0 0 20px ${getPersonColor(
                                            person.reaction, index
                                        )
                                            .dot.replace("bg-", "rgba(")
                                            .replace("-400", ", 0.8)")}, 0 0 40px ${getPersonColor(
                                            person.reaction, index
                                        )
                                            .dot.replace("bg-", "rgba(")
                                            .replace("-400", ", 0.4)")}, 0 0 60px ${getPersonColor(
                                            person.reaction, index
                                        )
                                            .dot.replace("bg-", "rgba(")
                                            .replace("-400", ", 0.2)")}`,
                                    }}
                                >
                                    {/* Bright inner highlight */}
                                    <div className="absolute inset-0.5 rounded-full bg-white/40" />
                                    
                                    {/* Extra bright shine effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-70" />
                                </div>

                                {/* Hover Info */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-0 group-hover:scale-110">
                                    <div className="bg-black/95 text-white text-sm p-4 rounded-lg border border-white/30 whitespace-nowrap backdrop-blur-sm shadow-2xl">
                                        <div className="text-center">
                                            <div className="text-white text-base font-semibold">
                                                {person.name}
                                            </div>
                                            <div className="text-white/70 text-sm">
                                                {person.title}
                                            </div>
                                            <div className="text-white/70 text-sm">
                                                {person.location}
                                            </div>
                                            <div className="text-green-400 text-xs mt-2 font-medium">
                                                Click to explore →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
            )}

            {/* Connection lines between nearby dots */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
                {animatedPeople.map((person, index) =>
                    animatedPeople
                        .slice(index + 1)
                        .map((otherPerson, otherIndex) => {
                            if (!person.isVisible || !otherPerson.isVisible)
                                return null;

                            const distance = Math.sqrt(
                                Math.pow(
                                    person.screenPosition.x -
                                        otherPerson.screenPosition.x,
                                    2
                                ) +
                                    Math.pow(
                                        person.screenPosition.y -
                                            otherPerson.screenPosition.y,
                                        2
                                    )
                            );

                            if (distance < 150) {
                                return (
                                    <motion.line
                                        key={`${person.id}-${otherPerson.id}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.1 }}
                                        transition={{
                                            delay: Math.random() * 2,
                                        }}
                                        x1={person.screenPosition.x}
                                        y1={person.screenPosition.y}
                                        x2={otherPerson.screenPosition.x}
                                        y2={otherPerson.screenPosition.y}
                                        stroke="url(#connectionGradient)"
                                        strokeWidth="1"
                                    />
                                );
                            }
                            return null;
                        })
                )}

                {/* SVG Gradients */}
                <defs>
                    <linearGradient
                        id="connectionGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                    >
                        <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity="0.2"
                        />
                        <stop
                            offset="100%"
                            stopColor="#06d6a0"
                            stopOpacity="0.2"
                        />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
