"use server";

import { createServerClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

export async function updateJob(
    jobId: string,
    demographic: string,
    adsId: string
) {
    const supabase = await createServerClient();

    const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .update({
            demographic: demographic,
            ads_id: adsId,
        })
        .eq("id", jobId)
        .select()
        .single();

    if (jobError) {
        throw new Error(`Failed to create job: ${jobError.message}`);
    }

    redirect(`/stable/jobs/${jobId}`);

    return jobData;
}
