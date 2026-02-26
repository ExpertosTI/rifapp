"use client";
import { motion } from "framer-motion";
import { Shield, Users, Warehouse, Flame, Ticket, LayoutGrid, Dumbbell, Trophy, Utensils, Trees, DoorOpen, Armchair } from "lucide-react";

// Lista completa de amenidades basada en el requerimiento original
const prizes = [
    { icon: Trophy, title: "1er Lugar", desc: "Pega más al llegar al 100%. Pega 3 más." },
    { icon: Trophy, title: "2do Lugar", desc: "Ganador Quiniela Palé." },
    { icon: Trophy, title: "3er Lugar", desc: "Ganador Pega 3 más (Noche)." },
    { icon: Trophy, title: "4to Lugar", desc: "Ganador Quiniela Palé (Noche)." },
    { icon: Ticket, title: "Motos", desc: "5 motos baja y un Daihatsu Mira al llegar al 50%." },
    { icon: Shield, title: "Reglas Válidas", desc: "Ejemplo: ganador 1 al 6, un número arriba/abajo moto. 80k efectivo o vehículo." },
    { icon: Users, title: "Reglas Flexibles", desc: "3 arriba / 3 abajo 1 al 8. 120k casa, vehículo o efectivo." },
];

const vehicles = [
    { title: "Toyota 4Runner 2025", image: "/prizes/runner25.avif" },
    { title: "Isuzu D-Max 2025", image: "/prizes/d-max25.png" },
    { title: "Toyota Prado 2026", image: "/prizes/pradoback.png" },
];

export const Amenities = () => {
    return (
        <section className="relative w-full py-24 text-white">
            {/* Background Gradient Blurs specific to this section */}
            <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-600/10 blur-[100px]" />
            <div className="absolute right-0 bottom-0 h-96 w-96 translate-x-1/2 rounded-full bg-purple-600/10 blur-[100px]" />

            <div className="mx-auto max-w-7xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-16 text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-medium mb-6"
                    >
                        <Trophy className="w-4 h-4" />
                        <span>Premios Increíbles</span>
                    </motion.div>

                    <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                        Detalles del <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Premio</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-white/50 leading-relaxed text-balance">
                        Vehículos cero kilómetros, dinero en efectivo y premios sorpresa. Descubre todo lo que puedes ganar al participar.
                    </p>
                </motion.div>

                {/* Vehicles Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
                    {vehicles.map((v, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10 }}
                            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl transition-all hover:shadow-yellow-500/20 hover:border-yellow-500/30"
                        >
                            {/* Animated Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-orange-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />

                            <div className="aspect-[4/3] w-full overflow-hidden relative">
                                <motion.img
                                    src={v.image}
                                    alt={v.title}
                                    animate={{
                                        y: [0, -8, 0],
                                    }}
                                    transition={{
                                        duration: 6 + i,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

                                {/* Corner Accents */}
                                <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-yellow-500/50 rounded-tr-xl opacity-0 translate-x-4 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-yellow-500/50 rounded-bl-xl opacity-0 -translate-x-4 translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                                <div className="h-1 w-12 bg-yellow-500 rounded-full mb-4 transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-500 transition-colors duration-300">
                                    {v.title}
                                </h3>
                                <p className="text-sm font-medium text-white/50 mt-2 opacity-0 -translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                                    Vehículo 0 Km
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {prizes.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="group relative flex flex-col items-start gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.05] hover:border-white/10 overflow-hidden"
                        >
                            {/* Hover highlight */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

                            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-inner text-white transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-yellow-400 group-hover:to-orange-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-yellow-500/25 group-hover:shadow-lg group-hover:-translate-y-1 relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{
                                        opacity: [0, 0.5, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                                <item.icon size={24} strokeWidth={1.8} className="relative z-10" />
                            </div>
                            <div className="relative z-10 w-full">
                                <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60 group-hover:text-white/80 transition-colors">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
