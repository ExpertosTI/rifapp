import { Suspense } from "react";
import { TicketChecker } from "@/components/raffle/TicketChecker";

export const dynamic = 'force-dynamic';

export default function VerifyPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-purple-900/20" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 pt-20 pb-10 px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <a href="/" className="inline-block mb-8">
                            <img
                                src="/logo-rifasmax.png"
                                alt="Rifasmax"
                                className="h-16 mx-auto"
                            />
                        </a>
                        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4">
                            Verificar Tu Ticket
                        </h1>
                        <p className="text-white/60 text-lg">
                            Ingresa tu teléfono para consultar todos los números asociados a tu compra.
                        </p>
                    </div>
                </div>
            </div>

            {/* Checker Component */}
            <Suspense fallback={
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            }>
                <TicketChecker />
            </Suspense>

            {/* Footer */}
            <footer className="py-8 text-center text-white/30 text-sm">
                <a href="/" className="hover:text-white transition-colors">
                    ← Volver a la página principal
                </a>
            </footer>
        </main>
    );
}
