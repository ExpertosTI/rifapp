"use client";

import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ticket, CheckCircle, Clock, XCircle, Trophy, Phone } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface TicketResult {
    ticketNumber: string;
    name: string;
    phone: string;
    status: string;
    createdAt: string;
    paymentMethod?: string | null;
}

export const TicketChecker = () => {
    const searchParams = useSearchParams();
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<TicketResult[]>([]);
    const [participantName, setParticipantName] = useState("");
    const [participantPhone, setParticipantPhone] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (value?: string) => {
        const sanitizedPhone = (value ?? phone).replace(/\D/g, "");

        if (sanitizedPhone.length < 10) {
            setError("Por favor ingresa un número de teléfono válido.");
            return;
        }

        setLoading(true);
        setError(null);
        setResults([]);
        setParticipantName("");
        setParticipantPhone("");
        setSearched(true);

        try {
            const res = await fetch(`/api/verify?phone=${sanitizedPhone}`);
            const data = await res.json();

            if (data.error) {
                setError(data.error);
            } else if (Array.isArray(data.tickets)) {
                setResults(data.tickets);
                setParticipantName(data.name || "");
                setParticipantPhone(data.phone || sanitizedPhone);
            } else {
                setError("No se encontraron tickets asociados a este teléfono.");
            }
        } catch {
            setError("Error al verificar los tickets. Intenta de nuevo.");
        }

        setLoading(false);
    };

    useEffect(() => {
        const phoneParam = searchParams.get("phone");

        if (!phoneParam) {
            return;
        }

        const normalizedPhone = phoneParam.replace(/\D/g, "");
        if (normalizedPhone.length < 10) {
            return;
        }

        setPhone(normalizedPhone);
        void handleSearch(normalizedPhone);
    }, [searchParams]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 15);
        setPhone(value);
        setError(null);
        setSearched(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            void handleSearch();
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
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
                >
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white md:text-4xl">
                            Verificar Ticket
                        </h2>
                        <p className="mt-3 text-sm text-white/60 md:text-base">
                            Ingresa tu teléfono para ver todos los números asociados a tu compra.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 md:flex-row">
                        <div className="relative flex-1">
                            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Teléfono con WhatsApp"
                                className="w-full rounded-2xl border border-white/10 bg-slate-800/50 py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => void handleSearch()}
                            disabled={loading || phone.replace(/\D/g, "").length < 10}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition-all hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed"
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
                    </div>
                </motion.div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {results.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-8 space-y-6"
                        >
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Participante</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{participantName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">Teléfono</p>
                                        <p className="mt-2 text-lg font-semibold text-white">{participantPhone}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {results.map((ticket: TicketResult) => {
                                    const status = statusConfig[ticket.status] || statusConfig.PENDING;
                                    const StatusIcon = status.icon;

                                    return (
                                        <motion.div
                                            key={ticket.ticketNumber}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`overflow-hidden rounded-3xl border bg-gradient-to-br ${status.bg} p-6 backdrop-blur-xl`}
                                        >
                                            <div className="mb-5 flex justify-center">
                                                <div className={`flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 ${status.color}`}>
                                                    <StatusIcon className="w-5 h-5" />
                                                    <span className="font-semibold">{status.label}</span>
                                                </div>
                                            </div>

                                            <div className="mb-6 text-center">
                                                <p className="mb-2 text-xs uppercase tracking-widest text-white/40">
                                                    Número de Ticket
                                                </p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Ticket className="w-7 h-7 text-yellow-400" />
                                                    <span className="text-4xl font-bold font-mono tracking-[0.2em] text-white">
                                                        {ticket.ticketNumber}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-3 rounded-xl bg-black/20 p-4">
                                                <div className="flex justify-between gap-4 text-sm">
                                                    <span className="text-white/50">Registrado:</span>
                                                    <span className="text-right text-white/70">
                                                        {new Date(ticket.createdAt).toLocaleDateString("es-DO", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                {ticket.paymentMethod && (
                                                    <div className="flex justify-between gap-4 text-sm">
                                                        <span className="text-white/50">Método de pago:</span>
                                                        <span className="text-right text-white/70">{ticket.paymentMethod}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {searched && results.length === 0 && !error && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 text-center text-white/40"
                    >
                        No se encontraron tickets asociados a este teléfono.
                    </motion.div>
                )}
            </div>
        </section>
    );
};
