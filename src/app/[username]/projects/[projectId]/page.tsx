"use client";

import ProjectDashboard from "@/app/components/ProjectDashboard";
import { useParams } from "next/navigation";
export default function Page() {
    const { username, projectId } = useParams();
    return <ProjectDashboard username={username} projectId={projectId} />;
}