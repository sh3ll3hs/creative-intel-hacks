export interface Project {
    id: string;
    title: string;
    date: string;
    progress: number;
    phase: string;
    description: string;
}

export interface Person {
    id: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    title: string;
    generation: string;
    industry: string;
    feedback: string;
    reaction: string;
    fullReaction: string;
    position: { x: number; y: number; z: number };
}
