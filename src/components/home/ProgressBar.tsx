"use client";

import { motion } from "framer-motion";
import { Ticket, Target, TrendingUp } from "lucide-react";

interface ProgressBarProps {
    soldTickets?: number;
    totalTickets?: number;
    goal?: number; // Optional fundraising goal
}

export const ProgressBar = ({
    soldTickets = 127,
    totalTickets = 1000,
    goal
}: ProgressBarProps) => {
    const percentage = Math.min((soldTickets / totalTickets) * 100, 100);
    const remaining = totalTickets - soldTickets;

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-yellow-400" />
                        </div>
                        <span className="text-sm font-medium text-white/80">Progreso del Sorteo</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-white">{percentage.toFixed(1)}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                    />
                    {/* Animated shine effect */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-green-400" />
                        <span className="text-white/60">
                            <span className="text-green-400 font-bold">{soldTickets.toLocaleString()}</span> vendidos
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-400" />
                        <span className="text-white/60">
                            <span className="text-yellow-400 font-bold">{remaining.toLocaleString()}</span> disponibles
                        </span>
                    </div>
                </div>

                {/* Urgency message when close to selling out */}
                {percentage > 70 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-medium text-red-400">
                            ¡Quedan pocos tickets! No te quedes sin participar
                        </span>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
