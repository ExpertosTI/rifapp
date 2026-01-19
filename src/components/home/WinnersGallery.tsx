"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Award, CheckCircle } from "lucide-react";

interface Winner {
    id: string;
    name: string;
    location: string;
    prize: string;
    prizeValue: string;
    testimonial: string;
    date: string;
    imageUrl?: string;
    verified: boolean;
}

// Demo winners for display
const demoWinners: Winner[] = [
    {
        id: "1",
        name: "María G.",
        location: "Santo Domingo",
        prize: "iPhone 15 Pro Max",
        prizeValue: "$1,199",
        testimonial: "¡No puedo creerlo! Compré solo 2 tickets y gané. Rifasmax es 100% real, ya tengo mi teléfono en la mano. ¡Gracias!",
        date: "Diciembre 2025",
        verified: true
    },
    {
        id: "2",
        name: "Carlos R.",
        location: "Santiago",
        prize: "PS5 + 5 Juegos",
        prizeValue: "$650",
        testimonial: "Participé por primera vez y gané. El proceso fue súper transparente, me contactaron por WhatsApp y en 2 días tenía mi premio.",
        date: "Noviembre 2025",
        verified: true
    },
    {
        id: "3",
        name: "Ana M.",
        location: "La Romana",
        prize: "MacBook Air M3",
        prizeValue: "$1,299",
        testimonial: "Mi esposo no me creía cuando le dije que había ganado. Ahora él también compra tickets jaja. ¡Super recomendado!",
        date: "Octubre 2025",
        verified: true
    }
];

interface WinnersGalleryProps {
    winners?: Winner[];
}

export const WinnersGallery = ({ winners = demoWinners }: WinnersGalleryProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % winners.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + winners.length) % winners.length);
    };

    const currentWinner = winners[currentIndex];

    return (
        <section className="w-full py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-4">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-400">Ganadores Verificados</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Historias de Éxito
                    </h2>
                    <p className="text-white/60 max-w-md mx-auto">
                        Conoce a las personas que ya cambiaron su suerte con Rifasmax
                    </p>
                </div>

                {/* Winner Card */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentWinner.id}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-20 h-20 text-yellow-400" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                {/* Stars */}
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    ))}
                                </div>

                                {/* Testimonial */}
                                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                                    "{currentWinner.testimonial}"
                                </p>

                                {/* Winner Info */}
                                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-black font-bold text-lg">
                                            {currentWinner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-white">{currentWinner.name}</p>
                                                {currentWinner.verified && (
                                                    <CheckCircle className="w-4 h-4 text-blue-400" />
                                                )}
                                            </div>
                                            <p className="text-sm text-white/50">{currentWinner.location} • {currentWinner.date}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-white/50">Premio Ganado</p>
                                        <p className="font-bold text-yellow-400">{currentWinner.prize}</p>
                                        <p className="text-xs text-white/40">Valor: {currentWinner.prizeValue}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <button
                            onClick={prev}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {winners.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                                            ? 'bg-yellow-400 w-6'
                                            : 'bg-white/30 hover:bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={next}
                            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
