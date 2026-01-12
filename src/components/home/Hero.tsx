"use client";
import { Scene } from "../3d/Scene";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
            {/* Dark Gradient Overlay for the "Clean Photo" look */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />

            {/* 3D Background - Made Subtle/Dark */}
            <div className="opacity-30 mix-blend-screen grayscale">
                <Scene />
            </div>

            <div className="z-10 mx-auto flex max-w-5xl flex-col items-center gap-10 pt-24">

                {/* Pill - Exact Match: Dark container, Green Dot, All Caps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 backdrop-blur-md shadow-xl ring-1 ring-white/5"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">Edición Limitada 2026</span>
                </motion.div>

                {/* Typography - Stacked, High Contrast */}
                <h1 className="flex flex-col items-center leading-none text-white gap-2">
                    <span className="text-5xl font-extralight tracking-tight md:text-7xl lg:text-8xl text-white">
                        Tu Nuevo Hogar
                    </span>
                    <span className="font-serif italic text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                        De Lujo
                    </span>
                </h1>

                {/* Subtitle - Clean Serif/Sans Mix */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-md text-center text-lg font-light text-white/50 md:text-xl tracking-wide"
                >
                    Fusión perfecta entre arquitectura y confort.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30"
                >
                    Garantía Fiduciaria • Seguridad 24/7
                </motion.div>

                {/* Buttons - Primary White Pill */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4 flex flex-col items-center gap-8"
                >
                    <button
                        onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group flex min-w-[260px] items-center justify-center gap-4 rounded-full bg-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:bg-gray-100"
                    >
                        Adquirir Ticket
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    <button
                        onClick={() => document.getElementById('amenities-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white border-b border-transparent hover:border-white/20 pb-1"
                    >
                        Ver Detalles
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
