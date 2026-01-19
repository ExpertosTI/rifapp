"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, CheckCircle, Clock, XCircle, Trophy, ArrowRight, Hash } from "lucide-react";

interface TicketResult {
    ticketNumber: string;
    name: string;
    status: string;
    createdAt: string;
    paymentMethod?: string;
}

export const TicketChecker = () => {
    const [ticketNumber, setTicketNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TicketResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (ticketNumber.length !== 6 || !/^\d{6}$/.test(ticketNumber)) {
            setError("Por favor ingresa un número válido de 6 dígitos.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setSearched(true);

        try {
            const res = await fetch(`/api/verify/${ticketNumber}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else if (data.ticket) {
                setResult(data.ticket);
            } else {
                setError("No se encontró ningún ticket con este número.");
            }
        } catch (err) {
            setError("Error al verificar el ticket. Intenta de nuevo.");
        }

        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setTicketNumber(value);
        setError(null);
        setSearched(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const statusConfig: Record<string, { icon: any; color: string; label: string; bg: string }> = {
        PENDING: {
            icon: Clock,
            color: "text-yellow-400",
            label: "Pendiente de Verificación",
            bg: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30"
        },
        CONFIRMED: {
            icon: CheckCircle,
            color: "text-green-400",
            label: "Confirmado ✓",
            bg: "from-green-500/20 to-emerald-500/20 border-green-500/30"
        },
        REJECTED: {
            icon: XCircle,
            color: "text-red-400",
            label: "Rechazado",
            bg: "from-red-500/20 to-rose-500/20 border-red-500/30"
        },
        WINNER: {
            icon: Trophy,
            color: "text-purple-400",
            label: "¡GANADOR! 🎉",
            bg: "from-purple-500/20 to-pink-500/20 border-purple-500/30"
        }
    };

    return (
        <section className="py-12 px-4">
            <div className="max-w-md mx-auto">
                {/* Search Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/40">
                        <Hash className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={ticketNumber}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-3xl font-mono tracking-[0.5em] text-center text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSearch}
                        disabled={loading || ticketNumber.length !== 6}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-xl font-semibold text-white transition-all flex items-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                Buscar
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Result Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`mt-8 overflow-hidden rounded-3xl border bg-gradient-to-br ${statusConfig[result.status]?.bg || statusConfig.PENDING.bg} backdrop-blur-xl`}
                        >
                            <div className="p-6 md:p-8">
                                {/* Status Badge */}
                                <div className="flex justify-center mb-6">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 ${statusConfig[result.status]?.color || 'text-white'}`}>
                                        {(() => {
                                            const StatusIcon = statusConfig[result.status]?.icon || Clock;
                                            return <StatusIcon className="w-5 h-5" />;
                                        })()}
                                        <span className="font-semibold">
                                            {statusConfig[result.status]?.label || result.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Ticket Display */}
                                <div className="text-center mb-6">
                                    <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
                                        Número de Ticket
                                    </p>
                                    <div className="flex items-center justify-center gap-1">
                                        <Ticket className="w-8 h-8 text-yellow-400 mr-2" />
                                        <span className="text-5xl md:text-6xl font-bold font-mono tracking-[0.3em] text-white">
                                            {result.ticketNumber}
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 bg-black/20 rounded-xl p-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Participante:</span>
                                        <span className="text-white font-medium">{result.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/50">Registrado:</span>
                                        <span className="text-white/70">
                                            {new Date(result.createdAt).toLocaleDateString("es-DO", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric"
                                            })}
                                        </span>
                                    </div>
                                    {result.paymentMethod && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-white/50">Método de pago:</span>
                                            <span className="text-white/70">{result.paymentMethod}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Status-specific messages */}
                                {result.status === "PENDING" && (
                                    <p className="mt-4 text-center text-sm text-yellow-400/70">
                                        Tu pago está siendo verificado. Recibirás un email cuando sea confirmado.
                                    </p>
                                )}
                                {result.status === "CONFIRMED" && (
                                    <p className="mt-4 text-center text-sm text-green-400/70">
                                        ¡Tu ticket está activo para el sorteo! Buena suerte 🍀
                                    </p>
                                )}
                                {result.status === "WINNER" && (
                                    <div className="mt-4 text-center">
                                        <p className="text-lg text-purple-300 font-bold mb-2">
                                            🎊 ¡Felicidades! ¡Eres el ganador! 🎊
                                        </p>
                                        <p className="text-sm text-white/60">
                                            Contáctanos para reclamar tu premio.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No result message */}
                {searched && !result && !error && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center text-white/40"
                    >
                        No se encontró ningún ticket con este número.
                    </motion.div>
                )}
            </div>
        </section>
    );
};
