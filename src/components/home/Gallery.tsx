"use client";
import { motion } from "framer-motion";

export const Gallery = () => {
    return (
        <section className="relative w-full py-24 text-white">
            <div className="mx-auto max-w-7xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="bg-gradient-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
                        Espacios Soñados
                    </h2>
                    <p className="mt-4 text-gray-400">
                        Imagina tu vida en estos modernos apartamentos.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:h-[600px] lg:grid-cols-3 lg:grid-rows-2">
                    {/* Main Large Item */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gray-900/40 md:col-span-2 md:row-span-2 shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all hover:border-cyan-400/50"
                    >
                        {/* Holographic Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent opacity-50" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-slate-900/0 to-slate-900/0" />

                        <div className="flex h-full flex-col justify-end p-8 relative z-10">
                            <div className="h-full w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm transition-all hover:bg-white/10 border border-white/5" />
                            <h3 className="mt-4 text-2xl font-bold text-white">Sala Espaciosa</h3>
                            <p className="text-cyan-200/70">Diseño abierto con iluminación natural.</p>
                        </div>
                    </motion.div>

                    {/* Secondary Items */}
                    {[
                        { title: "Cocina Modular", bg: "from-purple-500/20" },
                        { title: "Habitación Principal", bg: "from-cyan-500/20" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 hover:border-purple-500/30 transition-all"
                        >
                            <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${item.bg} via-slate-900/0 to-slate-900/0`} />
                            <div className="flex h-full flex-col justify-end p-6 relative z-10">
                                <div className="h-32 w-full rounded-xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/5" />
                                <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
