"use client";
import { LandingPage } from "./components/LandingPage";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const handleLogin = (username: string) => {
        router.push(`/${username}/projects`);
    };

    return <LandingPage onLogin={handleLogin} />;
}
