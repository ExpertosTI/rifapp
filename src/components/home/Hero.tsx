"use client";
import { Scene } from "../3d/Scene";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Ticket, Users, Timer } from "lucide-react";
import { useEffect, useState } from "react";

export const Hero = ({ config }: { config: any }) => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // calculate "tickets left" - fake it if no real stats passed yet
    const total = config?.totalTickets || 1000;
    // Mock sold count for visual urgency (random between 60-80% sold)
    const [sold, setSold] = useState(0);

    useEffect(() => {
        setSold(Math.floor(total * 0.72));
    }, [total]);

    const percentage = Math.round((sold / total) * 100);

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 text-center">
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black z-0" />

            {/* 3D Background */}
            <div className="opacity-40 mix-blend-screen grayscale absolute inset-0">
                <Scene />
            </div>

            <div className="z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 pt-24 relative">

                {/* Parallax Product Image Background (Optional/Subtle) */}
                {config?.imageUrl && (
                    <motion.div
                        style={{ y: y1 }}
                        className="absolute -top-20 opacity-20 blur-3xl w-[800px] h-[800px] rounded-full overflow-hidden pointer-events-none"
                    >
                        <img src={config.imageUrl} alt="Background" className="w-full h-full object-cover" />
                    </motion.div>
                )}

                {/* Limited Edition Pill */}
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
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/90">
                        {config?.isActive ? 'Edición Limitada 2026' : 'Sorteo Finalizado'}
                    </span>
                </motion.div>

                {/* Typography */}
                <motion.div style={{ y: y2 }} className="flex flex-col items-center gap-4">
                    <h1 className="flex flex-col items-center leading-none text-white gap-2">
                        <span className="text-4xl font-extralight tracking-tight md:text-6xl lg:text-7xl text-white/90">
                            Participa por
                        </span>
                        <span className="font-serif italic text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] text-center max-w-4xl">
                            {config?.productName || "Tu Nuevo Hogar"}
                        </span>
                    </h1>

                    <p className="max-w-xl text-center text-lg font-light text-white/60 md:text-xl tracking-wide leading-relaxed">
                        {config?.description || "Fusión perfecta entre arquitectura y confort."}
                    </p>
                </motion.div>



                {/* Social Proof (Fake) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-2 text-xs text-white/40"
                >
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">U{i}</div>
                        ))}
                    </div>
                    <span>+120 personas viendo esto ahora</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4 flex flex-col items-center gap-8"
                >
                    <button
                        onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="group relative flex min-w-[280px] items-center justify-center gap-4 rounded-full bg-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-black shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all hover:scale-105 hover:bg-gray-100 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Adquirir Ticket ${Number(config?.ticketPrice || 10).toFixed(2)}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                    </button>

                    <button
                        onClick={() => document.getElementById('amenities-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-white border-b border-transparent hover:border-white/20 pb-1"
                    >
                        Ver Detalles del Premio
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

