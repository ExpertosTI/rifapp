"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";

// Payment method icons as SVG components for better quality
const UsdtIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <circle cx="16" cy="16" r="16" fill="#26A17B" />
        <path fill="#fff" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117" />
    </svg>
);

const ZelleIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <circle cx="16" cy="16" r="16" fill="#6D1ED4" />
        <path fill="#fff" d="M8 10h7.5l-7.5 9v3h16v-3h-8l8-9v-3H8z" />
    </svg>
);

const VisaIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <rect width="32" height="32" rx="4" fill="#1A1F71" />
        <path fill="#fff" d="M13.823 20.482h-2.34l1.464-8.963h2.34zm-4.144-8.963l-2.228 6.15-.264-1.317-.786-4.026s-.095-.807-.978-.807H2.093L2.06 11.8s.961.199 2.086.872l1.73 6.81h2.35l3.574-8.963zm17.31 8.963h2.07l-1.805-8.963h-1.91c-.786.004-1.378.455-1.631 1.136l-3.363 7.827h2.35l.463-1.285h2.87zm-2.486-3.059l1.187-3.257.668 3.257zM20.68 13.563l.323-1.864s-.996-.378-2.035-.378c-1.124 0-3.793.491-3.793 2.88 0 2.249 3.136 2.276 3.136 3.457 0 1.182-2.813 1.004-3.739.232l-.337 1.946s1.011.491 2.551.491c1.54 0 3.892-.812 3.892-2.977 0-2.262-3.164-2.483-3.164-3.457 0-.974 2.208-1.021 3.166-.33z" />
    </svg>
);

const MastercardIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <rect width="32" height="32" rx="4" fill="#000" />
        <circle cx="12" cy="16" r="7" fill="#EB001B" />
        <circle cx="20" cy="16" r="7" fill="#F79E1B" />
        <path fill="#FF5F00" d="M16 10.8a7 7 0 0 0-2.5 5.2 7 7 0 0 0 2.5 5.2 7 7 0 0 0 2.5-5.2 7 7 0 0 0-2.5-5.2z" />
    </svg>
);

const PaypalIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <rect width="32" height="32" rx="4" fill="#003087" />
        <path fill="#fff" d="M23.5 10.5c-.4-1.8-2-3-4.2-3h-6.1c-.4 0-.7.3-.8.6l-2.5 15.6c0 .3.2.5.5.5h3.6l.9-5.6v.2c.1-.3.4-.6.8-.6h1.6c3.2 0 5.7-1.3 6.5-5 0-.2 0-.3.1-.5-.1 0-.1 0 0 0 .2-1.2.1-2-.4-2.2z" />
        <path fill="#009cde" d="M23.1 12.7c-.7 3.5-3.1 5-6.5 5h-1.6c-.4 0-.7.3-.8.6l-1.1 7.2c0 .2.1.4.4.4h2.8c.3 0 .6-.2.7-.5l.8-5c.1-.3.4-.5.7-.5h.4c2.8 0 5-1.1 5.6-4.4.3-1.4.2-2.6-.4-3.3-.2-.2-.4-.4-.6-.5-.1.7-.2 1.3-.4 2z" />
    </svg>
);

const GooglePayIcon = () => (
    <svg viewBox="0 0 32 32" className="w-6 h-6">
        <rect width="32" height="32" rx="4" fill="#fff" />
        <path fill="#4285F4" d="M20.2 16.5c0-.4-.1-.8-.1-1.2H14.2v2.4h3.4c-.1.7-.6 1.4-1.2 1.8v1.5h1.9c1.1-1.1 1.8-2.6 1.8-4.5z" />
        <path fill="#34A853" d="M14.2 21.6c1.7 0 3.1-.6 4.1-1.5l-1.9-1.5c-.6.4-1.3.6-2.2.6-1.7 0-3.1-1.1-3.6-2.6H8.6v1.5c1 2.1 3.1 3.5 5.6 3.5z" />
        <path fill="#FBBC05" d="M10.6 16.6c-.1-.4-.2-.8-.2-1.2s.1-.8.2-1.2v-1.5H8.6C8.3 13.5 8.2 14.4 8.2 15.4s.1 1.9.4 2.8l2-1.6z" />
        <path fill="#EA4335" d="M14.2 11.2c.9 0 1.7.3 2.4.9l1.8-1.8C17.3 9.3 15.9 8.7 14.2 8.7c-2.5 0-4.6 1.4-5.6 3.3l2 1.5c.5-1.5 1.9-2.3 3.6-2.3z" />
    </svg>
);

interface PaymentMethodsProps {
    config?: any;
    selected: string;
    onSelect: (method: string) => void;
}

const paymentMethods = [
    {
        id: "USDT",
        name: "USDT (Tether)",
        icon: UsdtIcon,
        color: "from-green-500/20 to-green-600/20",
        borderColor: "border-green-500/30",
        description: "Criptomoneda estable"
    },
    {
        id: "ZELLE",
        name: "Zelle",
        icon: ZelleIcon,
        color: "from-purple-500/20 to-purple-600/20",
        borderColor: "border-purple-500/30",
        description: "Transferencia bancaria USA"
    },
    {
        id: "VISA",
        name: "Visa",
        icon: VisaIcon,
        color: "from-blue-500/20 to-blue-600/20",
        borderColor: "border-blue-500/30",
        description: "Tarjeta de crédito/débito"
    },
    {
        id: "MASTERCARD",
        name: "Mastercard",
        icon: MastercardIcon,
        color: "from-orange-500/20 to-red-600/20",
        borderColor: "border-orange-500/30",
        description: "Tarjeta de crédito/débito"
    },
    {
        id: "PAYPAL",
        name: "PayPal",
        icon: PaypalIcon,
        color: "from-blue-600/20 to-blue-700/20",
        borderColor: "border-blue-600/30",
        description: "Pago en línea"
    },
    {
        id: "GOOGLEPAY",
        name: "Google Pay",
        icon: GooglePayIcon,
        color: "from-red-500/20 to-red-600/20",
        borderColor: "border-red-500/30",
        description: "Pago móvil"
    },
];

export const PaymentMethods = ({ config, selected, onSelect }: PaymentMethodsProps) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const getPaymentDetails = (methodId: string) => {
        switch (methodId) {
            case "USDT":
                return {
                    wallet: config?.usdtWallet || "TVYQpPjBp1xe8qGCkv9U2NkpZTxxxxxx",
                    network: config?.usdtNetwork || "TRC20",
                };
            case "ZELLE":
                return {
                    email: config?.zelleEmail || "pagos@rifasmax.com",
                    name: config?.zelleName || "Rifasmax RD",
                };
            case "PAYPAL":
                return {
                    email: config?.paypalEmail || "pagos@rifasmax.com",
                    link: config?.paypalLink,
                };
            case "GOOGLEPAY":
                return {
                    number: config?.googlePayNumber || "",
                };
            case "VISA":
            case "MASTERCARD":
                return {
                    bank: config?.bankName || "Banco Popular Dominicano",
                    account: config?.bankAccount || "XXXX-XXXX-XXXX",
                    holder: config?.bankHolder || "Rifasmax SRL",
                };
            default:
                return {};
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm text-white/60 font-medium">Método de Pago</label>
            <div className="grid grid-cols-6 gap-2">
                {paymentMethods.map((method) => (
                    <motion.button
                        key={method.id}
                        type="button"
                        onClick={() => {
                            onSelect(method.id);
                            setExpanded(expanded === method.id ? null : method.id);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${selected === method.id
                            ? `bg-gradient-to-br ${method.color} ${method.borderColor} border-2`
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                    >
                        <method.icon />
                        <span className="text-[10px] text-white/60 mt-1 truncate w-full text-center">
                            {method.id}
                        </span>
                        {selected === method.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"
                            >
                                <Check className="w-2.5 h-2.5 text-white" />
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            {/* Payment Details */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Instrucciones de Pago</span>
                                <span className="text-yellow-400 font-medium">
                                    {paymentMethods.find(m => m.id === selected)?.name}
                                </span>
                            </div>

                            {selected === "USDT" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40">Red:</span>
                                        <span className="text-green-400 font-mono">{getPaymentDetails("USDT").network}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getPaymentDetails("USDT").wallet}
                                            readOnly
                                            className="w-full bg-black/30 rounded-lg px-3 py-2 text-xs font-mono text-white/80 pr-10"
                                        />
                                        <CopyButton text={getPaymentDetails("USDT").wallet || ""} />
                                    </div>
                                    <p className="text-[10px] text-yellow-400/70">
                                        ⚠️ Solo envía USDT por red TRC20. Otras redes no serán acreditadas.
                                    </p>
                                </div>
                            )}

                            {selected === "ZELLE" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40">Enviar a:</span>
                                        <span className="text-purple-400 font-medium">{getPaymentDetails("ZELLE").name}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getPaymentDetails("ZELLE").email}
                                            readOnly
                                            className="w-full bg-black/30 rounded-lg px-3 py-2 text-xs font-mono text-white/80 pr-10"
                                        />
                                        <CopyButton text={getPaymentDetails("ZELLE").email || ""} />
                                    </div>
                                    <p className="text-[10px] text-purple-400/70">
                                        📧 Incluye tu email en la nota del pago para identificarte.
                                    </p>
                                </div>
                            )}

                            {(selected === "VISA" || selected === "MASTERCARD") && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40">Banco:</span>
                                        <span className="text-blue-400 font-medium">{getPaymentDetails(selected).bank}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/40">Titular:</span>
                                        <span className="text-white/80">{getPaymentDetails(selected).holder}</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getPaymentDetails(selected).account}
                                            readOnly
                                            className="w-full bg-black/30 rounded-lg px-3 py-2 text-xs font-mono text-white/80 pr-10"
                                        />
                                        <CopyButton text={getPaymentDetails(selected).account || ""} />
                                    </div>
                                    <p className="text-[10px] text-blue-400/70">
                                        💳 Transferencia bancaria o depósito en cuenta.
                                    </p>
                                </div>
                            )}

                            {selected === "PAYPAL" && (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getPaymentDetails("PAYPAL").email}
                                            readOnly
                                            className="w-full bg-black/30 rounded-lg px-3 py-2 text-xs font-mono text-white/80 pr-10"
                                        />
                                        <CopyButton text={getPaymentDetails("PAYPAL").email || ""} />
                                    </div>
                                    {getPaymentDetails("PAYPAL").link && (
                                        <a
                                            href={getPaymentDetails("PAYPAL").link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-center text-sm font-medium transition-colors"
                                        >
                                            Pagar con PayPal
                                        </a>
                                    )}
                                    <p className="text-[10px] text-blue-400/70">
                                        💰 Envía como "Amigos y Familiares" para evitar comisiones.
                                    </p>
                                </div>
                            )}

                            {selected === "GOOGLEPAY" && (
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={getPaymentDetails("GOOGLEPAY").number}
                                            readOnly
                                            className="w-full bg-black/30 rounded-lg px-3 py-2 text-xs font-mono text-white/80 pr-10"
                                        />
                                        <CopyButton text={getPaymentDetails("GOOGLEPAY").number || ""} />
                                    </div>
                                    <p className="text-[10px] text-red-400/70">
                                        📱 Agrega este correo / número en tu app de Google Pay para enviar.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
            {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
                <Copy className="w-3.5 h-3.5 text-white/40" />
            )}
        </button>
    );
};
