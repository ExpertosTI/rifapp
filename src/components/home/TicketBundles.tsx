"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Crown } from "lucide-react";

interface Bundle {
    id: string;
    quantity: number;
    pricePerTicket: number;
    discount: number;
    popular?: boolean;
    bestValue?: boolean;
    icon: React.ReactNode;
    label: string;
}

interface TicketBundlesProps {
    basePrice?: number;
    selectedBundle: number;
    onSelect: (quantity: number) => void;
}

export const TicketBundles = ({
    basePrice = 3.00,
    selectedBundle,
    onSelect
}: TicketBundlesProps) => {
    const bundles: Bundle[] = [
        {
            id: "single",
            quantity: 1,
            pricePerTicket: basePrice,
            discount: 0,
            icon: <Sparkles className="w-5 h-5" />,
            label: "Básico"
        },
        {
            id: "starter",
            quantity: 3,
            pricePerTicket: basePrice * 0.90,
            discount: 10,
            icon: <Star className="w-5 h-5" />,
            label: "Starter"
        },
        {
            id: "popular",
            quantity: 5,
            pricePerTicket: basePrice * 0.85,
            discount: 15,
            popular: true,
            icon: <Zap className="w-5 h-5" />,
            label: "Popular"
        },
        {
            id: "premium",
            quantity: 10,
            pricePerTicket: basePrice * 0.80,
            discount: 20,
            bestValue: true,
            icon: <Crown className="w-5 h-5" />,
            label: "Premium"
        }
    ];

    return (
        <div className="w-full space-y-3">
            <p className="text-sm text-white/60 text-center">Elige tu paquete y ahorra</p>

            <div className="grid grid-cols-2 gap-3">
                {bundles.map((bundle) => {
                    const isSelected = selectedBundle === bundle.quantity;
                    const totalPrice = bundle.pricePerTicket * bundle.quantity;
                    const originalPrice = basePrice * bundle.quantity;
                    const savings = originalPrice - totalPrice;

                    return (
                        <motion.button
                            key={bundle.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelect(bundle.quantity)}
                            className={`relative rounded-xl p-4 text-left transition-all ${isSelected
                                    ? 'bg-yellow-500/20 border-2 border-yellow-500'
                                    : 'bg-white/5 border-2 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Badge */}
                            {(bundle.popular || bundle.bestValue) && (
                                <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${bundle.bestValue
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                                        : 'bg-blue-500 text-white'
                                    }`}>
                                    {bundle.bestValue ? '¡MEJOR!' : 'POPULAR'}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-yellow-500 text-black' : 'bg-white/10 text-white/60'
                                    }`}>
                                    {bundle.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-white/50">{bundle.label}</p>
                                    <p className="text-lg font-bold text-white">{bundle.quantity} Ticket{bundle.quantity > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-yellow-400">${totalPrice.toFixed(2)}</span>
                                    {bundle.discount > 0 && (
                                        <span className="text-xs text-white/40 line-through">${originalPrice.toFixed(2)}</span>
                                    )}
                                </div>

                                {bundle.discount > 0 && (
                                    <p className="text-xs text-green-400">
                                        Ahorras ${savings.toFixed(2)} ({bundle.discount}% OFF)
                                    </p>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
