"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Canvas to avoid SSR hydration errors
// @react-three/fiber's reconciler crashes during server-side rendering
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export const Scene = () => {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950">
            <Suspense fallback={<div className="w-full h-full bg-slate-950" />}>
                <SceneCanvas />
            </Suspense>
        </div>
    );
};
