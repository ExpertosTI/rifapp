"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Timer } from "lucide-react";

interface CountdownProps {
    targetDate: Date | string | null;
    title?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

export const Countdown = ({ targetDate, title = "El sorteo será en" }: CountdownProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!targetDate) return;

        const target = new Date(targetDate).getTime();

        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const difference = target - now;

            if (difference <= 0) {
                setIsExpired(true);
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    total: 0
                };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                total: difference
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!targetDate) return null;

    const timeBlocks = [
        { value: timeLeft.days, label: "Días" },
        { value: timeLeft.hours, label: "Horas" },
        { value: timeLeft.minutes, label: "Minutos" },
        { value: timeLeft.seconds, label: "Segundos" },
    ];

    return (
        <section className="relative w-full py-12 md:py-20">
            <div className="mx-auto max-w-4xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-900/20 via-slate-900/50 to-blue-900/20 p-8 md:p-12 backdrop-blur-xl"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                <Timer className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-medium text-white/80">
                                {isExpired ? "¡El sorteo ha comenzado!" : title}
                            </h2>
                        </div>

                        {!isExpired ? (
                            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto">
                                {timeBlocks.map((block, i) => (
                                    <motion.div
                                        key={block.label}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative"
                                    >
                                        <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/10 p-4 md:p-6">
                                            {/* Glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <motion.div
                                                key={block.value}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="relative z-10"
                                            >
                                                <div className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-mono tracking-tight">
                                                    {String(block.value).padStart(2, "0")}
                                                </div>
                                                <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/40 mt-2">
                                                    {block.label}
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Separator dots */}
                                        {i < 3 && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 hidden md:flex flex-col gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse" />
                                                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 animate-pulse delay-100" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl"
                                >
                                    <span className="text-2xl font-bold text-white">🎉 ¡EN VIVO AHORA!</span>
                                </motion.div>
                            </div>
                        )}

                        {/* Draw date display */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-white/40">
                                Fecha del sorteo:{" "}
                                <span className="text-white/70 font-medium">
                                    {new Date(targetDate).toLocaleDateString("es-DO", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
