"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Send, Ticket as TicketIcon } from "lucide-react";
import { generateTicketAction } from "@/app/actions/raffle";

export const TicketGenerator = () => {
    const [ticket, setTicket] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await generateTicketAction(formData);

        if (result.success && result.ticket) {
            setTicket(result.ticket);
        } else {
            setError(result.error || "Algo salió mal. Intenta de nuevo.");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        if (ticket) {
            navigator.clipboard.writeText(ticket);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section className="relative w-full py-24 text-white">
            {/* Subtle Glows */}
            <div className="absolute left-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
            <div className="absolute right-1/4 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

            <div className="mx-auto flex max-w-4xl flex-col items-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:p-14 shadow-2xl"
                >
                    <div className="flex flex-col items-center text-center">
                        <h2 className="mb-4 text-2xl font-medium tracking-tight text-white md:mb-6 md:text-5xl">
                            Obtén tu Ticket
                        </h2>
                        <p className="mb-6 max-w-lg text-base font-light text-white/60 md:mb-10 md:text-lg">
                            Completa el formulario para participar en el sorteo exclusivo.
                        </p>

                        {!ticket ? (
                            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-5">
                                <div className="space-y-4">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Nombre Completo"
                                        required
                                        className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-white/30 focus:bg-white/10 focus:outline-none"
                                    />
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        required
                                        className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-white/30 focus:bg-white/10 focus:outline-none"
                                    />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="Teléfono"
                                        required
                                        className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-white/30 focus:bg-white/10 focus:outline-none"
                                    />
                                </div>

                                {error && <p className="text-sm font-medium text-red-400">{error}</p>}

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    disabled={loading}
                                    type="submit"
                                    className="group mt-2 flex h-12 md:h-16 w-full items-center justify-center gap-3 rounded-xl md:rounded-2xl bg-white text-base md:text-lg font-semibold text-black shadow-xl transition-all hover:bg-white/90 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                    ) : (
                                        <>
                                            Generar Ticket <Send className="h-4 w-4 opacity-50" />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative flex w-full flex-col items-center gap-8"
                            >
                                <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 px-8 py-10 shadow-2xl backdrop-blur-md">
                                    <div className="absolute top-0 right-0 p-6 opacity-20">
                                        <TicketIcon className="h-24 w-24 text-white" />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">Ticket ID</div>
                                        <div className="mt-2 text-4xl font-medium tracking-tight text-white drop-shadow-lg">
                                            {ticket}
                                        </div>
                                        <div className="mt-8 flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                            <span className="text-sm font-medium text-emerald-400">Activo para Sorteo</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={copyToClipboard}
                                        className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/20"
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        {copied ? "Copiado" : "Copiar ID"}
                                    </button>

                                    <button
                                        onClick={() => setTicket(null)}
                                        className="text-xs text-white/40 hover:text-white transition-colors"
                                    >
                                        Generar Nuevo
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
