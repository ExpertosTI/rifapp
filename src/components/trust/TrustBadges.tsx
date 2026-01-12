"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Building2 } from "lucide-react";

export const TrustBadges = () => {
    return (
        <section className="relative border-t border-white/5 bg-black/20 py-16 backdrop-blur-lg">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-8 px-4 text-gray-400 md:gap-16">
                {[
                    { icon: ShieldCheck, text: "Garantía Fiduciaria" },
                    { icon: Building2, text: "Constructora Certificada" },
                    { icon: Lock, text: "Pagos 100% Seguros" }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="flex items-center gap-4 rounded-full border border-cyan-500/20 bg-cyan-900/10 px-6 py-3 transition-all hover:bg-cyan-500/10 hover:text-cyan-200 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    >
                        <item.icon className="h-6 w-6 text-cyan-400" />
                        <span className="text-lg font-medium">{item.text}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
