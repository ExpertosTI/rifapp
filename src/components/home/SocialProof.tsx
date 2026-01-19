"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MapPin } from "lucide-react";

// Nombres y ciudades típicas de República Dominicana
const firstNames = [
    "Carlos", "María", "Juan", "Ana", "Pedro", "Rosa", "Miguel", "Carmen",
    "Luis", "Juana", "Francisco", "Luz", "José", "Mercedes", "Rafael", "Altagracia",
    "Antonio", "Ángela", "Manuel", "Yolanda", "Ramón", "Milagros", "Fernando", "Esther"
];

const cities = [
    "Santo Domingo", "Santiago", "La Romana", "San Pedro de Macorís",
    "Puerto Plata", "San Cristóbal", "Higüey", "La Vega", "Moca",
    "Bonao", "Baní", "Azua", "San Juan", "Barahona", "Nagua"
];

interface Notification {
    id: number;
    name: string;
    city: string;
    quantity: number;
    timeAgo: string;
}

const timeAgos = ["hace 2 min", "hace 5 min", "hace 8 min", "hace 12 min", "hace 15 min"];

function generateNotification(): Notification {
    return {
        id: Date.now(),
        name: firstNames[Math.floor(Math.random() * firstNames.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        quantity: Math.floor(Math.random() * 5) + 1,
        timeAgo: timeAgos[Math.floor(Math.random() * timeAgos.length)],
    };
}

export const SocialProof = () => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Show first notification after 5 seconds
        const initialDelay = setTimeout(() => {
            showNotification();
        }, 5000);

        return () => clearTimeout(initialDelay);
    }, []);

    const showNotification = () => {
        const newNotification = generateNotification();
        setNotification(newNotification);
        setVisible(true);

        // Hide after 4 seconds
        setTimeout(() => {
            setVisible(false);
            // Schedule next notification (random between 15-40 seconds)
            const nextDelay = Math.floor(Math.random() * 25000) + 15000;
            setTimeout(showNotification, nextDelay);
        }, 4000);
    };

    return (
        <AnimatePresence>
            {visible && notification && (
                <motion.div
                    initial={{ x: -400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -400, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed bottom-4 left-4 z-50 max-w-xs"
                >
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-4 shadow-2xl">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {notification.name} compró {notification.quantity} ticket{notification.quantity > 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-white/50">
                                <MapPin className="w-3 h-3" />
                                <span>{notification.city}</span>
                                <span className="mx-1">•</span>
                                <span>{notification.timeAgo}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
