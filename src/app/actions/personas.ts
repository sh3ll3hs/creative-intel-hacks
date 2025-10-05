"use server";

import { createServerClient } from "@/lib/supabase/server";
import type { Person } from "@/types/shared";

export async function getPersonasByJobId(jobId: string): Promise<Person[]> {
    const supabase = await createServerClient();

    const { data: personas, error } = await supabase
        .from("persona")
        .select("*")
        .eq("job_id", jobId);

    if (error) {
        console.error("Error fetching personas:", error);
        return [];
    }

    // Map database personas to Person interface
    return personas.map((persona) => {
        // Parse position if it exists, otherwise generate random position
        const position = persona.position
            ? (persona.position as { x: number; y: number; z: number })
            : {
                  x: Math.random() * 2 - 1,
                  y: Math.random() * 2 - 1,
                  z: Math.random() * 2 - 1,
              };

        // Parse description to extract fields (hardcoded for now)
        // TODO: Store these fields properly in the database
        return {
            id: persona.id,
            name: persona.name || "Unknown",
            age: 28, // Hardcoded - not in DB
            gender: "Men", // Hardcoded - not in DB
            location: persona.location || "Unknown",
            title: "Professional", // Hardcoded - not in DB (could be derived from linkedin)
            generation: "Millennial", // Hardcoded - not in DB
            industry: "Technology", // Hardcoded - not in DB
            feedback: persona.description || "",
            reaction: "interested", // Hardcoded - not in DB (should come from persona_responses)
            fullReaction: persona.description || "",
            position,
        };
    });
}

export async function getJobById(jobId: string) {
    const supabase = await createServerClient();

    const { data: job, error } = await supabase
        .from("jobs")
        .select("*, ads(*)")
        .eq("id", jobId)
        .single();

    if (error) {
        console.error("Error fetching job:", error);
        return null;
    }

    return job;
}

export async function createJob(adsId: string, demographic: string) {
    const supabase = await createServerClient();

    const { data: job, error } = await supabase
        .from("jobs")
        .insert({
            ads_id: adsId,
            demographic,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating job:", error);
        throw error;
    }

    return job;
}

export async function createAd(description: string, videoUrl?: string) {
    const supabase = await createServerClient();

    const { data: ad, error } = await supabase
        .from("ads")
        .insert({
            description,
            video_url: videoUrl,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating ad:", error);
        throw error;
    }

    return ad;
}

export async function getPersonaResponses(jobId: string) {
    const supabase = await createServerClient();

    const { data: responses, error } = await supabase
        .from("persona_responses")
        .select("*, persona(*)")
        .eq("job_id", jobId);

    if (error) {
        console.error("Error fetching persona responses:", error);
        return [];
    }

    return responses;
}
