"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createBrowserClient } from "@/lib/supabase/client";
import apiClient from "@/lib/api-client";
import type { Database } from "@/database.types";

type Persona = Database["public"]["Tables"]["persona"]["Row"];
type Ad = Database["public"]["Tables"]["ads"]["Row"];
type PersonaResponse = Database["public"]["Tables"]["persona_responses"]["Row"];

export default function Page() {
    const params = useParams<{ jobId: string }>();
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [ad, setAd] = useState<Ad | null>(null);
    const [personaResponses, setPersonaResponses] = useState<PersonaResponse[]>(
        []
    );
    const [loading, setLoading] = useState(true);

    const { mutateAsync: createVideoDetails, isPending: creatingVideoDetails } =
        useMutation({
            mutationFn: async () => {
                const response = await apiClient.POST("/{job_id}/video", {
                    params: {
                        path: {
                            job_id: params.jobId,
                        },
                    },
                });
                return response.data;
            },
        });

    const { mutateAsync: createPersonas, isPending: creatingPersonas } =
        useMutation({
            mutationFn: async () => {
                const response = await apiClient.POST("/{job_id}/search", {
                    params: {
                        path: {
                            job_id: params.jobId,
                        },
                    },
                    body: {
                        sentence: "Tech CEOS in the New York City",
                    },
                });
                console.log(response);
                return response.data;
            },
        });

    const { mutateAsync: createResponses, isPending: creatingResponses } =
        useMutation({
            mutationFn: async () => {
                // // Placeholder endpoint
                const response = await apiClient.POST("/{job_id}/responses", {
                    params: {
                        path: {
                            job_id: params.jobId,
                        },
                    },
                });
                return response.data;
            },
        });

    useEffect(() => {
        const supabase = createBrowserClient();

        const fetchData = async () => {
            setLoading(true);

            // Fetch job to get ad_id
            const { data: job } = await supabase
                .from("jobs")
                .select("ads_id")
                .eq("id", params.jobId)
                .single();

            if (job?.ads_id) {
                // Fetch ad
                const { data: adData } = await supabase
                    .from("ads")
                    .select("*")
                    .eq("id", job.ads_id)
                    .single();
                setAd(adData);
            }

            // Fetch personas
            const { data: personasData } = await supabase
                .from("persona")
                .select("*")
                .eq("job_id", params.jobId);
            setPersonas(personasData || []);

            // Fetch persona responses
            const { data: responsesData } = await supabase
                .from("persona_responses")
                .select("*")
                .eq("job_id", params.jobId);
            setPersonaResponses(responsesData || []);

            setLoading(false);
        };

        fetchData();

        // Poll every 5 seconds
        const interval = setInterval(fetchData, 100);

        return () => clearInterval(interval);
    }, [params.jobId]);

    return (
        <div className="p-8 min-h-screen text-white relative">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Job ID: {params.jobId}</h1>
                <div className="flex gap-3">
                    <button
                        disabled={creatingPersonas}
                        onClick={() => createPersonas()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Personas
                    </button>
                    <button
                        disabled={creatingVideoDetails}
                        onClick={() => createVideoDetails()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Video Details
                    </button>
                    <button
                        disabled={creatingResponses}
                        onClick={() => createResponses()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Responses
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 ">
                {/* Personas Column */}
                <div className="border border-white rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Personas ({personas.length})
                    </h2>
                    <div className="space-y-4">
                        {creatingPersonas && (
                            <p className="text-gray-500">
                                Creating personas...
                            </p>
                        )}
                        {personas.map((persona) => (
                            <div
                                key={persona.id}
                                className="border-b border-white pb-3"
                            >
                                <h3 className="font-medium">
                                    {persona.name || "Unnamed"}
                                </h3>
                                {persona.location && (
                                    <p className="text-sm text-gray-600">
                                        {persona.location}
                                    </p>
                                )}
                                {persona.description && (
                                    <p className="text-sm mt-1">
                                        {persona.description}
                                    </p>
                                )}
                                {persona.linkedin_url && (
                                    <a
                                        href={persona.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 text-sm"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        ))}
                        {personas.length === 0 && (
                            <p className="text-gray-500">No personas yet</p>
                        )}
                    </div>
                </div>

                {/* Ad Column */}
                <div className="border border-white rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Ad</h2>
                    {creatingVideoDetails && (
                        <p className="text-gray-500">
                            Creating video details...
                        </p>
                    )}
                    {ad ? (
                        <div>
                            {ad.video_url && (
                                <video
                                    src={ad.video_url}
                                    controls
                                    className="w-full mb-3 rounded"
                                />
                            )}
                            {ad.description ? (
                                <p className="text-sm">{ad.description}</p>
                            ) : (
                                "No Description Yet"
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-500">No ad associated</p>
                    )}
                </div>

                {/* Persona Responses Column */}
                <div className="border border-white rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">
                        Responses ({personaResponses.length})
                    </h2>
                    {creatingResponses && (
                        <p className="text-gray-500">Creating responses...</p>
                    )}
                    <div className="space-y-4">
                        {personaResponses.map((response) => (
                            <div
                                key={response.id}
                                className="border-b border-white pb-3"
                            >
                                <p className="text-xs text-gray-500 mb-2">
                                    Persona ID: {response.persona_id}
                                </p>
                                {response.conversation && (
                                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
                                        {JSON.stringify(
                                            response.conversation,
                                            null,
                                            2
                                        )}
                                    </pre>
                                )}
                            </div>
                        ))}
                        {personaResponses.length === 0 && (
                            <p className="text-gray-500">No responses yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
