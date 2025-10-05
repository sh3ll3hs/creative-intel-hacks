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

    const getPersonColor = (reaction: string) => {
        switch (reaction) {
            case "intrigued":
                return {
                    bg: "from-green-400 to-green-600",
                    dot: "bg-green-400",
                };
            case "inspired":
                return { bg: "from-blue-400 to-blue-600", dot: "bg-blue-400" };
            case "partial":
                return {
                    bg: "from-orange-400 to-orange-600",
                    dot: "bg-orange-400",
                };
            default:
                return {
                    bg: "from-purple-400 to-purple-600",
                    dot: "bg-purple-400",
                };
        }
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
                                        getPersonColor(person.reaction).dot
                                    } opacity-30`}
                                    style={{
                                        transform: "scale(1.2)",
                                        filter: "blur(2px)",
                                    }}
                                />

                                {/* Main Star Dot - Static */}
                                <div
                                    className={`
                  w-3 h-3 rounded-full ${getPersonColor(person.reaction).dot}
                  border border-white/40 backdrop-blur-sm
                  group-hover:scale-150 group-hover:border-white/80
                  transition-all duration-300 relative z-10
                `}
                                    style={{
                                        boxShadow: `0 2px 4px ${getPersonColor(
                                            person.reaction
                                        )
                                            .dot.replace("bg-", "rgba(")
                                            .replace("-400", ", 0.3)")}`,
                                    }}
                                >
                                    {/* Static inner highlight */}
                                    <div className="absolute inset-0.5 rounded-full bg-white/20" />
                                </div>

                                {/* Hover Info */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-0 group-hover:scale-100">
                                    <div className="bg-black/90 text-white text-xs p-2 rounded border border-white/20 whitespace-nowrap backdrop-blur-sm">
                                        <div className="text-center">
                                            <div className="text-white">
                                                {person.name}
                                            </div>
                                            <div className="text-white/60">
                                                {person.title}
                                            </div>
                                            <div className="text-white/60">
                                                {person.location}
                                            </div>
                                            <div className="text-green-400 text-[10px] mt-1">
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
