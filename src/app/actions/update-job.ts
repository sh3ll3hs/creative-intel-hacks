"use server";

import { createServerClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

export async function updateJob(jobId: string, demographic: string) {
    const supabase = await createServerClient();

    const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .update({
            demographic: demographic,
        })
        .eq("id", jobId)
        .select()
        .single();

    if (jobError) {
        throw new Error(`Failed to create job: ${jobError.message}`);
    }

    redirect(`/jobs/${jobId}`);

    return jobData;
}
