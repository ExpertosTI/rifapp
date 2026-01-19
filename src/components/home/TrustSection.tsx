"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Gift, Headphones, Clock, ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "¿Cómo sé que el sorteo es real?",
        answer: "Todos nuestros sorteos son transmitidos en vivo por Instagram/TikTok. Los ganadores son contactados inmediatamente y publicamos fotos/videos de la entrega del premio. Además, puedes verificar tu ticket en cualquier momento."
    },
    {
        question: "¿Cómo recibo mi premio si gano?",
        answer: "Te contactamos por WhatsApp y email. Para Santo Domingo hacemos entrega en persona. Para el interior del país, coordinamos envío gratis o entrega en un punto acordado."
    },
    {
        question: "¿Puedo participar desde fuera de RD?",
        answer: "¡Sí! Aceptamos participantes internacionales. Si ganas, coordinamos el envío o el equivalente en efectivo si la logística es complicada."
    },
    {
        question: "¿Qué pasa si el sorteo no se completa?",
        answer: "Si por alguna razón el sorteo no puede realizarse, todos los participantes reciben un reembolso completo. Tu dinero está 100% seguro."
    },
    {
        question: "¿Puedo elegir mi número de ticket?",
        answer: "¡Sí! Al momento de comprar puedes elegir 'Número Personalizado' y escribir el número de 6 dígitos que prefieras (si está disponible)."
    }
];

const trustBadges = [
    { icon: Shield, label: "Pago Seguro", desc: "SSL 256-bit" },
    { icon: Gift, label: "Entrega Garantizada", desc: "100% Real" },
    { icon: Headphones, label: "Soporte 24/7", desc: "WhatsApp" },
    { icon: Clock, label: "Sorteo en Vivo", desc: "Instagram/TikTok" },
];

export const TrustSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4 space-y-16">
                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trustBadges.map((badge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/10"
                        >
                            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-3">
                                <badge.icon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <p className="font-medium text-white text-sm">{badge.label}</p>
                            <p className="text-xs text-white/50">{badge.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Preguntas Frecuentes
                        </h2>
                        <p className="text-white/60">
                            Todo lo que necesitas saber antes de participar
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                                >
                                    <span className="font-medium text-white pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-white/50 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 md:px-5 md:pb-5">
                                                <p className="text-white/70 text-sm leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
