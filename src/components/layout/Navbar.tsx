"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export const Navbar = () => {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login"; // Keep navbar on login? Maybe not. Screenshot showed overlap.
    // Actually, hide on all /admin
    if (pathname?.startsWith("/admin")) return null;

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm bg-gradient-to-b from-black/60 to-transparent"
        >
            <div className="flex items-center">
                {/* Logo Implementation - Natural Size */}
                <div className="relative h-20 w-auto">
                    <Image
                        src="/logo-white.png"
                        alt="Logo Rifa"
                        width={180}
                        height={80}
                        className="h-full w-auto object-contain drop-shadow-lg"
                        priority
                    />
                </div>
            </div>

            <div className="hidden items-center gap-8 md:flex">
                <button onClick={() => document.getElementById('amenities-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">
                    Premios
                </button>
                <button onClick={() => document.getElementById('ticket-section')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Comprar Ticket
                </button>
            </div>
        </motion.nav>
    );
};
