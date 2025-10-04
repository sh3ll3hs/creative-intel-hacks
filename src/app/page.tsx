"use client";

import { createBrowserClient } from "@/lib/supabase/client";
import FileUpload from "@/components/kokonutui/file-upload";
import AI_Input_Search from "@/components/kokonutui/ai-input-search";
import { useEffect, useState } from "react";
import type { Tables } from "@/database.types";
import { useMutation } from "@tanstack/react-query";
import { createJob as createJobAction } from "./actions/create-job";
import { updateJob as updateJobAction } from "./actions/update-job";
import { Button } from "@/components/ui/button";

type Persona = Tables<"persona">;
type Ad = Tables<"ads">;

export default function Home() {
    const supabase = createBrowserClient();
    const [data, setData] = useState<Persona[]>([]);
    const [uploadedVideo, setUploadedVideo] = useState<Ad | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [jobId, setJobId] = useState<string | null>(null);

    const { mutate: createJob, isPending: creatingJob } = useMutation({
        mutationFn: async () => {
            const jobData = await createJobAction();

            setJobId(jobData.id);
            return jobData;
        },
    });

    const { mutate: updateJob, isPending: updatingJob } = useMutation({
        mutationFn: async (value: string) => {
            const jobData = await updateJobAction(jobId!, value);

            return jobData;
        },
    });
    const { mutate: uploadVideo } = useMutation({
        mutationFn: async (video: File) => {
            const fileName = `${Date.now()}-${video.name}`;

            // Upload file to Supabase storage
            const { data: uploadData, error: uploadError } =
                await supabase.storage.from("videos").upload(fileName, video, {
                    cacheControl: "3600",
                    upsert: false,
                });
            console.log(uploadData);

            if (uploadError) {
                throw new Error(`Upload failed: ${uploadError.message}`);
            }

            // Get public URL
            const {
                data: { publicUrl },
            } = supabase.storage.from("videos").getPublicUrl(fileName);

            // Insert record into ads table
            const { data: adData, error: adError } = await supabase
                .from("ads")
                .insert({
                    video_url: publicUrl,
                })
                .select()
                .single();

            if (adError) {
                throw new Error(`Database insert failed: ${adError.message}`);
            }

            return adData;
        },
        onSuccess: (data) => {
            setUploading(false);
            setUploadedVideo(data);
            setUploadError(null);
        },
        onError: (error) => {
            setUploadError(error.message);
        },
    });

    useEffect(() => {
        async function fetchData() {
            const { data: fetchedData, error } = await supabase
                .from("persona")
                .select("*");
            if (error) console.error("Error fetching data:", error);
            else setData(fetchedData);
        }
        fetchData();
    }, [supabase]);

    const handleUploadSuccess = (file: File) => {
        setUploading(true);
        uploadVideo(file);
    };

    const handleUploadError = (error: { message: string; code: string }) => {
        setUploadError(error.message);
    };

    const handleFileRemove = () => {
        setUploadedVideo(null);
        setUploadError(null);
    };

    if (!jobId) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <Button
                    disabled={creatingJob}
                    variant="outline"
                    onClick={() => createJob("test")}
                >
                    Create Job
                </Button>
            </div>
        );
    }

    if (!uploadedVideo) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                {uploading ? (
                    <div>Uploading...</div>
                ) : (
                    <FileUpload
                        onUploadSuccess={handleUploadSuccess}
                        onUploadError={handleUploadError}
                        acceptedFileTypes={[".mp4"]}
                        maxFileSize={100 * 1024 * 1024}
                        onFileRemove={handleFileRemove}
                        className=""
                    />
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-3">
            <div className="flex flex-col items-center justify-center w-full py-12">
                <h1 className="text-4xl font-bold">Ad Feedback Simulator</h1>
            </div>
            {/* Upload Status Messages */}
            {uploadError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Upload Error:</strong> {uploadError}
                </div>
            )}
            {uploadedVideo && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <strong>Upload Successful!</strong> Video uploaded and saved
                    to database.
                </div>
            )}
            <AI_Input_Search onSubmit={(value) => updateJob(value)} />
        </div>
    );
}
