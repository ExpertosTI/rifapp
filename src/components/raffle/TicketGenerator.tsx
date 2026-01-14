"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Send, Ticket as TicketIcon, Upload, Image, PartyPopper, Sparkles } from "lucide-react";
import { generateTicketAction } from "@/app/actions/raffle";
import confetti from "canvas-confetti";

export const TicketGenerator = ({ config }: { config?: any }) => {
    const [ticket, setTicket] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const fireConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];

        const frame = () => {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            }
        };

        frame();

        // Big burst in the middle
        setTimeout(() => {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: colors
            });
        }, 200);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!paymentProof) {
            setError("Por favor, adjunta el comprobante de pago.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('paymentProof', paymentProof);

        const result = await generateTicketAction(formData);

        if (result.success && result.ticket) {
            setTicket(result.ticket);
            fireConfetti();
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

    const resetForm = () => {
        setTicket(null);
        setPaymentProof(null);
        setFileName(null);
    };

    return (
        <section className="relative w-full py-16 md:py-24 text-white">
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
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                        >
                            <PartyPopper className="w-8 h-8 text-white" />
                        </motion.div>

                        <h2 className="mb-4 text-2xl font-medium tracking-tight text-white md:mb-6 md:text-5xl">
                            ¡Participa por {config?.productName || "tu Premio"}!
                        </h2>
                        <p className="mb-6 max-w-lg text-base font-light text-white/60 md:mb-10 md:text-lg">
                            Completa el formulario y adjunta tu comprobante de pago de <span className="text-yellow-400 font-bold">${Number(config?.ticketPrice || 10).toFixed(2)}</span>.
                        </p>

                        <AnimatePresence mode="wait">
                            {!ticket ? (
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    className="flex w-full max-w-md flex-col gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="space-y-3">
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

                                        {/* Payment Proof Upload */}
                                        <div className="relative">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`w-full rounded-xl md:rounded-2xl border-2 border-dashed ${paymentProof ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 bg-white/5'} px-4 py-6 transition-all hover:border-white/40 hover:bg-white/10 flex flex-col items-center gap-2`}
                                            >
                                                {paymentProof ? (
                                                    <>
                                                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                                            <Check className="w-6 h-6 text-green-400" />
                                                        </div>
                                                        <span className="text-sm text-green-400 font-medium">Comprobante Adjunto</span>
                                                        <span className="text-xs text-white/40">{fileName}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                                            <Upload className="w-6 h-6 text-white/60" />
                                                        </div>
                                                        <span className="text-sm text-white/60">Subir Comprobante de Pago</span>
                                                        <span className="text-xs text-white/40">PNG, JPG o PDF</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                                        >
                                            {error}
                                        </motion.p>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        disabled={loading}
                                        type="submit"
                                        className="group mt-2 flex h-12 md:h-16 w-full items-center justify-center gap-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-base md:text-lg font-semibold text-black shadow-xl shadow-orange-500/25 transition-all hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                        ) : (
                                            <>
                                                Pagar ${Number(config?.ticketPrice || 10).toFixed(2)} <Sparkles className="h-5 w-5" />
                                            </>
                                        )}
                                    </motion.button>

                                    <p className="text-xs text-white/40 text-center mt-2">
                                        Tu ticket será válido una vez confirmado el pago por nuestro equipo.
                                    </p>
                                </motion.form>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="relative flex w-full flex-col items-center gap-8"
                                >
                                    {/* Success Animation */}
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", duration: 0.8 }}
                                        className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
                                    >
                                        <Check className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-white mb-2">¡Ticket Registrado!</h3>
                                        <p className="text-white/60">Pendiente de confirmación de pago</p>
                                    </div>

                                    <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 px-8 py-10 shadow-2xl backdrop-blur-md">
                                        <div className="absolute top-0 right-0 p-6 opacity-20">
                                            <TicketIcon className="h-24 w-24 text-yellow-400" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400/70">Tu Número de Ticket</div>
                                            <div className="mt-2 text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                                                {ticket}
                                            </div>
                                            <div className="mt-6 flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                                                <span className="text-sm font-medium text-yellow-400">Pendiente de Verificación</span>
                                            </div>
                                            <p className="mt-4 text-xs text-white/50">
                                                Recibirás un email cuando tu ticket sea confirmado.
                                            </p>
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
                                            onClick={resetForm}
                                            className="text-xs text-white/40 hover:text-white transition-colors"
                                        >
                                            Registrar Otro Ticket
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
