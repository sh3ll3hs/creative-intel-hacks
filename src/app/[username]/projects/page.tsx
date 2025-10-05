"use client";

import { ProjectDashboard } from "@/app/components/ProjectDashboard";
import { useParams, useRouter } from "next/navigation";
import { Project } from "@/types/shared";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Tables } from "@/database.types";

type Job = Tables<"jobs">;

export default function Page() {
    const { username } = useParams();
    const router = useRouter();
    const supabase = createBrowserClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            const { data: jobs, error } = await supabase
                .from("jobs")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching jobs:", error);
                setIsLoading(false);
                return;
            }

            // Convert jobs to projects format
            const mappedProjects: Project[] =
                jobs?.map((job) => ({
                    id: job.id,
                    title: job.demographic || "Untitled Project",
                    date: new Date(job.created_at).toISOString().split("T")[0],
                    progress: 0,
                    phase: "Phase 1",
                    description: "You are on track to reach engagement goals.",
                })) || [];

            setProjects(mappedProjects);
            setIsLoading(false);
        }

        fetchJobs();
    }, [supabase]);

    const handleProjectSelect = (project: Project) => {
        router.push(`/${username}/projects/${project.id}/upload`);
    };

    const handleNewProject = async () => {
        // Create empty job record
        const { data: newJob, error } = await supabase
            .from("jobs")
            .insert({})
            .select()
            .single();

        if (error) {
            console.error("Error creating job:", error);
            return;
        }

        // Redirect to upload page
        router.push(`/${username}/projects/${newJob.id}/upload`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-lg">Loading projects...</div>
            </div>
        );
    }

    return (
        <ProjectDashboard
            username={username as string}
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onNewProject={handleNewProject}
            onLogout={() => {}}
        />
    );
}
