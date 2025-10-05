"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { StableSpaceBackground } from "./StableSpaceBackground";

export default function QueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <div className="relative min-h-screen overflow-hidden">
                <StableSpaceBackground />
                {children}
            </div>
        </QueryClientProvider>
    );
}
