"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Sparkles, Play, RotateCcw, ArrowLeft, Crown } from "lucide-react"
import { AdminPayload } from "@/lib/auth"
import { selectWinner } from "@/app/actions/admin"
import confetti from "canvas-confetti"
import Link from "next/link"

interface Props {
    session: AdminPayload
    tickets: any[]
}

export default function RouletteClient({ session, tickets }: Props) {
    const [spinning, setSpinning] = useState(false)
    const [winner, setWinner] = useState<any>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const fireConfetti = () => {
        const duration = 5000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) {
                clearInterval(interval)
                return
            }

            const particleCount = 50 * (timeLeft / duration)

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            })
        }, 250)
    }

    const startRoulette = async () => {
        if (tickets.length === 0) return

        setSpinning(true)
        setWinner(null)

        // Animate through names
        let speed = 50
        let iterations = 0
        const maxIterations = tickets.length * 5 + Math.floor(Math.random() * tickets.length)

        const animate = () => {
            setCurrentIndex(prev => (prev + 1) % tickets.length)
            iterations++

            if (iterations < maxIterations) {
                // Slow down gradually
                if (iterations > maxIterations * 0.7) {
                    speed += 20
                }
                intervalRef.current = setTimeout(animate, speed)
            } else {
                // Selection complete - call server action
                selectWinner().then(result => {
                    if (result.success && result.winner) {
                        setWinner(result.winner)
                        setSpinning(false)
                        fireConfetti()
                    }
                })
            }
        }

        animate()
    }

    const reset = () => {
        setWinner(null)
        setCurrentIndex(0)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex items-center justify-between border-b border-slate-800/50">
                <Link href="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Volver al Dashboard
                </Link>
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold">Sorteo de Ganador</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-8">
                {!winner ? (
                    <>
                        {/* Roulette Display */}
                        <motion.div
                            className="relative w-full max-w-xl mx-auto mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Current Ticket Display */}
                            <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-slate-900/80 backdrop-blur-xl p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />

                                <div className="relative text-center">
                                    <p className="text-sm text-slate-400 uppercase tracking-widest mb-4">
                                        {spinning ? "🎰 Seleccionando..." : "Participante"}
                                    </p>

                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentIndex}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -50, opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="space-y-2"
                                        >
                                            {tickets.length > 0 ? (
                                                <>
                                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                        {tickets[currentIndex]?.name || "---"}
                                                    </h2>
                                                    <p className="font-mono text-xl text-yellow-400">
                                                        {tickets[currentIndex]?.ticketNumber || "---"}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-slate-400">No hay tickets confirmados</p>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-4 left-4">
                                    <Sparkles className="w-6 h-6 text-purple-400/50" />
                                </div>
                                <div className="absolute bottom-4 right-4">
                                    <Sparkles className="w-6 h-6 text-blue-400/50" />
                                </div>
                            </div>

                            {/* Participants Count */}
                            <div className="mt-6 text-center">
                                <p className="text-slate-400">
                                    <span className="text-2xl font-bold text-white">{tickets.length}</span>
                                    {" "}participantes confirmados
                                </p>
                            </div>
                        </motion.div>

                        {/* Spin Button */}
                        <motion.button
                            onClick={startRoulette}
                            disabled={spinning || tickets.length === 0}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative group px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xl font-bold rounded-2xl shadow-2xl shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="flex items-center gap-3">
                                <Play className="w-6 h-6" />
                                {spinning ? "Girando..." : "Iniciar Sorteo"}
                            </span>
                            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>
                    </>
                ) : (
                    /* Winner Display */
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, -10, 10, -10, 10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="mb-8"
                        >
                            <Crown className="w-24 h-24 mx-auto text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                        </motion.div>

                        <h1 className="text-2xl text-slate-400 mb-4">¡Tenemos un Ganador!</h1>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="relative overflow-hidden rounded-3xl border border-yellow-500/50 bg-slate-900/80 backdrop-blur-xl p-10 max-w-lg mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20" />

                            <div className="relative">
                                <h2 className="text-5xl font-bold text-white mb-4">
                                    {winner.name}
                                </h2>
                                <p className="font-mono text-3xl text-yellow-400 mb-4">
                                    {winner.ticketNumber}
                                </p>
                                <p className="text-slate-400">
                                    {winner.email}
                                </p>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            onClick={reset}
                            className="mt-8 flex items-center gap-2 mx-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Nuevo Sorteo
                        </motion.button>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
