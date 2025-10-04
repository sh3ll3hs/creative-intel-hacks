"use server";

import { createServerClient } from "@/lib/supabase/server";

export async function createJob() {
    const supabase = await createServerClient();

    const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .insert({})
        .select()
        .single();

    if (jobError) {
        throw new Error(`Failed to create job: ${jobError.message}`);
    }

    return jobData;
}
