"use client";

import { ProjectDashboard } from "@/app/components/ProjectDashboard";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/shared";

export default function Page() {
    const { username } = useParams();
    const router = useRouter();
    const handleProjectSelect = (project: Project) => {
        router.push(`/${username}/projects/${project.id}`);
    };

    return (
        <ProjectDashboard
            username={username as string}
            onProjectSelect={handleProjectSelect}
            onLogout={() => {}}
        />
    );
}
