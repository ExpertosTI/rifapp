"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Send, Ticket as TicketIcon, Upload, PartyPopper, Sparkles, Shuffle, Hash } from "lucide-react";
import { generateTicketAction, checkTicketAvailability } from "@/app/actions/raffle";
import confetti from "canvas-confetti";
import { PaymentMethods } from "./PaymentMethods";
import { TermsModal } from "./TermsModal";

export const TicketGenerator = ({ config }: { config?: any }) => {
    const [tickets, setTickets] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentProof, setPaymentProof] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    // Número personalizado
    const [customNumber, setCustomNumber] = useState("");
    const [useCustomNumber, setUseCustomNumber] = useState(false);
    const [checkingNumber, setCheckingNumber] = useState(false);
    const [numberAvailable, setNumberAvailable] = useState<boolean | null>(null);

    // Cantidad de tickets
    const [quantity, setQuantity] = useState(1);

    const ticketPrice = Number(config?.ticketPrice || 3);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Check localStorage for terms acceptance and URL params for quantity
    useEffect(() => {
        const accepted = localStorage.getItem("rifasmax_terms_accepted");
        if (accepted === "true") {
            setTermsAccepted(true);
        }

        // Un único link para las cantidades
        const params = new URLSearchParams(window.location.search);
        const qtyParam = params.get("qty");
        if (qtyParam) {
            const parsed = parseInt(qtyParam);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
                setQuantity(parsed);
                setUseCustomNumber(false);
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Limit file size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                setError("El archivo es muy grande. Máximo 5MB.");
                return;
            }
            setFileName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentProof(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Check if custom number is available
    const checkNumber = async (num: string) => {
        if (num.length !== 6 || !/^\d{6}$/.test(num)) {
            setNumberAvailable(null);
            return;
        }

        setCheckingNumber(true);
        try {
            const result = await checkTicketAvailability(num);
            setNumberAvailable(result.available);
        } catch {
            setNumberAvailable(null);
        }
        setCheckingNumber(false);
    };

    const handleCustomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
        setCustomNumber(value);
        setNumberAvailable(null);
        setQuantity(1); // Force quantity to 1 when choosing custom number

        if (value.length === 6) {
            checkNumber(value);
        }
    };

    const handleQuantityChange = (delta: number) => {
        if (useCustomNumber) return; // Cannot change quantity in custom mode
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= 100) {
            setQuantity(newQty);
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

        if (!termsAccepted) {
            setShowTerms(true);
            return;
        }

        if (!paymentMethod) {
            setError("Por favor, selecciona un método de pago.");
            return;
        }

        if (!paymentProof) {
            setError("Por favor, adjunta el comprobante de pago.");
            return;
        }

        if (useCustomNumber && customNumber.length !== 6) {
            setError("El número debe tener 6 dígitos.");
            return;
        }

        if (useCustomNumber && numberAvailable === false) {
            setError("Este número ya está ocupado. Elige otro.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set('paymentProof', paymentProof);
        formData.set('paymentMethod', paymentMethod);
        formData.set('quantity', quantity.toString());

        if (useCustomNumber && customNumber) {
            formData.set('customNumber', customNumber);
        }

        const result: any = await generateTicketAction(formData);

        if (result.success && result.tickets) {
            setTickets(result.tickets);
            fireConfetti();
        } else if (result.ticket) {
            // Fallback for single ticket legacy response support
            setTickets([result.ticket]);
            fireConfetti();
        } else {
            setError(result.error || "Algo salió mal. Intenta de nuevo.");
        }
        setLoading(false);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetForm = () => {
        setTickets([]);
        setPaymentProof(null);
        setFileName(null);
        setPaymentMethod("");
        setCustomNumber("");
        setUseCustomNumber(false);
        setNumberAvailable(null);
        setQuantity(1);
    };

    const handleTermsAccept = () => {
        setTermsAccepted(true);
        localStorage.setItem("rifasmax_terms_accepted", "true");
        setShowTerms(false);
    };

    return (
        <>
            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleTermsAccept}
            />

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
                                Completa el formulario y adjunta tu comprobante de pago de <span className="text-yellow-400 font-bold">${Number(config?.ticketPrice || 3).toFixed(2)}</span> por ticket.
                            </p>

                            <AnimatePresence mode="wait">
                                {tickets.length === 0 ? (
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
                                                placeholder="Teléfono (con WhatsApp)"
                                                required
                                                className="w-full rounded-xl md:rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:px-6 md:py-4 text-base md:text-lg text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-white/30 focus:bg-white/10 focus:outline-none"
                                            />

                                            {/* Configuración de Tickets */}
                                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-white/60">Modo de Selección</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setUseCustomNumber(false);
                                                            }}
                                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${!useCustomNumber
                                                                ? 'bg-yellow-500 text-black'
                                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                                }`}
                                                        >
                                                            <Shuffle className="w-3 h-3" /> Aleatorio
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setUseCustomNumber(true);
                                                                setQuantity(1);
                                                            }}
                                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${useCustomNumber
                                                                ? 'bg-yellow-500 text-black'
                                                                : 'bg-white/10 text-white/60 hover:bg-white/20'
                                                                }`}
                                                        >
                                                            <Hash className="w-3 h-3" /> Elegir
                                                        </button>
                                                    </div>
                                                </div>

                                                {useCustomNumber ? (
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={customNumber}
                                                            onChange={handleCustomNumberChange}
                                                            placeholder="000000"
                                                            maxLength={6}
                                                            className={`w-full rounded-xl border ${numberAvailable === true
                                                                ? 'border-green-500/50 bg-green-500/10'
                                                                : numberAvailable === false
                                                                    ? 'border-red-500/50 bg-red-500/10'
                                                                    : 'border-white/10 bg-white/5'
                                                                } px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] text-white placeholder-white/20 transition-all focus:outline-none`}
                                                        />
                                                        {checkingNumber && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            </div>
                                                        )}
                                                        {!checkingNumber && numberAvailable === true && (
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                                                                <Check className="w-5 h-5" />
                                                            </div>
                                                        )}
                                                        {!checkingNumber && numberAvailable === false && (
                                                            <p className="text-xs text-red-400 mt-1 text-center">
                                                                Este número ya está ocupado
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-white/5 rounded-xl p-3 border border-white/10">
                                                        <span className="text-sm text-white/60">Cantidad de Tickets</span>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(-1)}
                                                                disabled={quantity <= 1}
                                                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleQuantityChange(1)}
                                                                disabled={quantity >= 100}
                                                                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                                    <span className="text-white/60">Total a Pagar:</span>
                                                    <span className="text-xl font-bold text-yellow-400">${(quantity * ticketPrice).toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* Payment Methods */}
                                            <PaymentMethods
                                                config={config}
                                                selected={paymentMethod}
                                                onSelect={setPaymentMethod}
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
                                                            <span className="text-xs text-white/40">PNG, JPG (máx. 5MB)</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Terms Checkbox */}
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={termsAccepted}
                                                    onChange={(e) => {
                                                        if (e.target.checked && !termsAccepted) {
                                                            setShowTerms(true);
                                                        } else {
                                                            setTermsAccepted(e.target.checked);
                                                        }
                                                    }}
                                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0"
                                                />
                                                <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
                                                    He leído y acepto los{" "}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowTerms(true)}
                                                        className="text-yellow-400 hover:underline"
                                                    >
                                                        Términos y Condiciones
                                                    </button>
                                                </span>
                                            </label>
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
                                            disabled={loading || !termsAccepted}
                                            type="submit"
                                            className="group mt-2 flex h-12 md:h-16 w-full items-center justify-center gap-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-base md:text-lg font-semibold text-black shadow-xl shadow-orange-500/25 transition-all hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                                            ) : (
                                                <>
                                                    Participar ({quantity} Ticket{quantity > 1 ? 's' : ''}) <Sparkles className="h-5 w-5" />
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
                                            <h3 className="text-2xl font-bold text-white mb-2">¡{tickets.length} Ticket{tickets.length > 1 ? 's' : ''} Registrado{tickets.length > 1 ? 's' : ''}!</h3>
                                            <p className="text-white/60">Pendiente de confirmación de pago</p>
                                        </div>

                                        <div className="w-full max-h-[300px] overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                            {tickets.map((ticketNum, index) => (
                                                <div key={ticketNum} className="relative w-full max-w-sm mx-auto overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 px-8 py-6 shadow-2xl backdrop-blur-md">
                                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                                        <TicketIcon className="h-12 w-12 text-yellow-400" />
                                                    </div>

                                                    <div className="relative z-10 text-center">
                                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-400/70">Ticket #{index + 1}</div>
                                                        <div className="mt-1 text-4xl font-bold tracking-[0.2em] text-white drop-shadow-lg font-mono">
                                                            {ticketNum}
                                                        </div>
                                                        <button
                                                            onClick={() => copyToClipboard(ticketNum)}
                                                            className="mt-3 flex items-center justify-center gap-2 mx-auto text-xs text-white/50 hover:text-white transition-colors"
                                                        >
                                                            {copied ? "Copiado" : "Copiar"} <Copy className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-3 w-full max-w-xs">
                                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                                                <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                                                <span className="text-sm font-medium text-yellow-400">Pendiente de Verificación</span>
                                            </div>

                                            <p className="text-xs text-white/50 text-center px-4">
                                                Recibirás un email y WhatsApp cuando tus tickets sean confirmados.
                                            </p>

                                            <button
                                                onClick={resetForm}
                                                className="mt-4 text-xs text-white/40 hover:text-white transition-colors"
                                            >
                                                Registrar Más Tickets
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};
