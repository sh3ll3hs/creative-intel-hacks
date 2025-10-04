"use client";

import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams<{ jobId: string }>();

    const { mutateAsync: createVideoDetails } = useMutation({
        mutationFn: async (data: { field: string }) => {
            const response = await fetch("/api/endpoint1", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response.json();
        },
    });

    const { mutateAsync: createPersonas } = useMutation({
        mutationFn: async (data: { field: string }) => {
            const response = await fetch("/search", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response.json();
        },
    });

    const { mutateAsync: createResponses } = useMutation({
        mutationFn: async (data: { field: string }) => {
            const response = await fetch("/api/endpoint2", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response.json();
        },
    });

    // const handleConcurrentMutations = async () => {
    //     try {
    //         // Run all three mutations concurrently
    //         const results = await Promise.all([
    //             createVideoDetails({ field: "value1" }),
    //             createPersonas({ field: "value2" }),
    //             createResponses({ field: "value3" }),
    //         ]);

    //         console.log("All mutations completed:", results);
    //         // results[0] = result from mutation1
    //         // results[1] = result from mutation2
    //         // results[2] = result from mutation3
    //     } catch (error) {
    //         console.error("One or more mutations failed:", error);
    //     }
    // };

    return (
        <div>
            <h1>Job ID: {params.jobId}</h1>
            <button
                onClick={() => createPersonas({ field: "value1" })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Create Personas
            </button>
            <button
                onClick={() => createVideoDetails({ field: "value1" })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Create Video Details
            </button>
            <button
                onClick={() => createResponses({ field: "value1" })}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Create Responses
            </button>
        </div>
    );
}
