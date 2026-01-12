"use client";
import { motion } from "framer-motion";
import { Shield, Users, Warehouse, Flame, Ticket, LayoutGrid, Dumbbell, Trophy, Utensils, Trees, DoorOpen, Armchair } from "lucide-react";

// Lista completa de amenidades basada en el requerimiento original
const amenities = [
    { icon: Shield, title: "Seguridad Controlada", desc: "Garita de seguridad y control de acceso 24/7." },
    { icon: Users, title: "Gazebo Social", desc: "Espacio perfecto para tus actividades y reuniones." },
    { icon: LayoutGrid, title: "PlayGround", desc: "Área divertida y segura para los niños." },
    { icon: Flame, title: "Gas Común", desc: "Sistema de gas centralizado por bloque." },
    { icon: Trees, title: "Áreas Verdes", desc: "Espacios naturales para respirar aire fresco." },
    { icon: Ticket, title: "Piscina", desc: "Relájate y disfruta en nuestra piscina de lujo." },
    { icon: Dumbbell, title: "Gimnasio", desc: "Equipado para mantener tu estilo de vida saludable." },
    { icon: Trophy, title: "Cancha Baloncesto", desc: "Media cancha para deportes y recreación." },
    { icon: Warehouse, title: "Salón Multiuso", desc: "Para eventos privados y grandes celebraciones." },
    { icon: Armchair, title: "Estar Social", desc: "Ambientes diseñados para la convivencia." },
    { icon: Utensils, title: "Área de BBQ", desc: "Zona especial para tus parrilladas." },
    { icon: DoorOpen, title: "Doble Acceso", desc: "Dos entradas para mayor comodidad y flujo." },
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
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-4xl font-medium tracking-tight text-white md:text-5xl">
                        Todo lo que Necesitas
                    </h2>
                    <p className="mt-4 text-lg font-light text-white/50">
                        Comodidad y excelencia en cada detalle.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {amenities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group flex flex-col items-start gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.05]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-white transition-colors group-hover:bg-white group-hover:text-black">
                                <item.icon size={22} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white">{item.title}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-white/50">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
