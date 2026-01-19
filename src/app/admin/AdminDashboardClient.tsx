"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Ticket, Users, Trophy, LogOut,
    CheckCircle, XCircle, Clock, Eye, Search, Filter,
    ChevronDown, MoreHorizontal, Sparkles, Menu, X
} from "lucide-react"
import { AdminPayload } from "@/lib/auth"
import { confirmTicket, rejectTicket } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/Sidebar"

interface Props {
    session: AdminPayload
    stats: { total: number; pending: number; confirmed: number; rejected: number }
    tickets: any[]
}

export default function AdminDashboardClient({ session, stats, tickets: initialTickets }: Props) {
    const [tickets, setTickets] = useState(initialTickets)
    const [filter, setFilter] = useState<string>("ALL")
    const [paymentFilter, setPaymentFilter] = useState<string>("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [rejectReason, setRejectReason] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const filteredTickets = tickets.filter(ticket => {
        const matchesFilter = filter === "ALL" || ticket.status === filter
        const matchesPayment = paymentFilter === "ALL" || ticket.paymentMethod === paymentFilter
        const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesPayment && matchesSearch
    })

    const handleConfirm = async (ticketId: string) => {
        setLoading(true)
        await confirmTicket(ticketId, session.id)
        router.refresh()
        setShowModal(false)
        setLoading(false)
    }

    const handleReject = async (ticketId: string) => {
        if (!rejectReason.trim()) return
        setLoading(true)
        await rejectTicket(ticketId, rejectReason)
        router.refresh()
        setShowModal(false)
        setRejectReason("")
        setLoading(false)
    }

    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
        REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
        WINNER: "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }

    const statusIcons: Record<string, any> = {
        PENDING: Clock,
        CONFIRMED: CheckCircle,
        REJECTED: XCircle,
        WINNER: Trophy
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <AdminSidebar session={session} />

            {/* Main Content */}
            <main className="pt-20 md:pt-8 md:ml-64 p-4 md:p-8 pr-4 md:pr-80 min-h-screen transition-all duration-300">
                {/* Header */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Dashboard</h1>
                        <p className="text-slate-400 mt-1">Gestión en tiempo real</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Sistema Operativo
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Total Tickets", value: stats.total, icon: Ticket, color: "blue" },
                        { label: "Pendientes", value: stats.pending, icon: Clock, color: "yellow" },
                        { label: "Confirmados", value: stats.confirmed, icon: CheckCircle, color: "green" },
                        { label: "Rechazados", value: stats.rejected, icon: XCircle, color: "red" }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6 group hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10 transition-all"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl group-hover:bg-${stat.color}-500/20 transition-colors`} />
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                                </div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tickets Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-xl">
                    {/* ... (Keep existing table, just wrapped in cleaner container) ... */}
                    {/* Table Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-blue-400" />
                            Tickets Recientes
                        </h2>
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64"
                                />
                            </div>
                            {/* Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-10 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
                                >
                                    <option value="ALL">Todos</option>
                                    <option value="PENDING">Pendientes</option>
                                    <option value="CONFIRMED">Confirmados</option>
                                    <option value="REJECTED">Rechazados</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                            </div>
                            {/* Payment Method Filter */}
                            <select
                                value={paymentFilter}
                                onChange={(e) => setPaymentFilter(e.target.value)}
                                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-900 transition-colors"
                            >
                                <option value="ALL">💳 Todos los pagos</option>
                                <option value="USDT">🟢 USDT</option>
                                <option value="ZELLE">💜 Zelle</option>
                                <option value="VISA">💳 Visa</option>
                                <option value="MASTERCARD">🟠 Mastercard</option>
                                <option value="PAYPAL">💙 PayPal</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4 text-left">Ticket</th>
                                    <th className="px-6 py-4 text-left">Participante</th>
                                    <th className="px-6 py-4 text-left">Pago</th>
                                    <th className="px-6 py-4 text-left">Estado</th>
                                    <th className="px-6 py-4 text-left">Comprobante</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredTickets.map((ticket) => {
                                    const StatusIcon = statusIcons[ticket.status] || Clock
                                    const paymentEmojis: Record<string, string> = {
                                        USDT: "🟢",
                                        ZELLE: "💜",
                                        VISA: "💳",
                                        MASTERCARD: "🟠",
                                        PAYPAL: "💙"
                                    }
                                    return (
                                        <motion.tr
                                            key={ticket.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-blue-500/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-yellow-400 font-bold text-lg bg-yellow-500/10 px-3 py-1.5 rounded-lg group-hover:bg-yellow-500/20 transition-colors tracking-wider">
                                                    {ticket.ticketNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-200">{ticket.name}</span>
                                                    <span className="text-xs text-slate-500">{ticket.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.paymentMethod ? (
                                                    <span className="text-sm">
                                                        {paymentEmojis[ticket.paymentMethod] || "💰"} {ticket.paymentMethod}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-600 text-xs">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.paymentProof ? (
                                                    <button
                                                        onClick={() => { setSelectedTicket(ticket); setShowModal(true) }}
                                                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-white group/btn bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-all"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Ver Foto
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-600 text-xs italic">Sin adjunto</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => { setSelectedTicket(ticket); setShowModal(true) }}
                                                    className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Right Sidebar - Activity Feed */}
            <aside className="fixed right-0 top-0 h-full w-80 bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl z-40 hidden md:block pt-20 p-6 overflow-y-auto">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Actividad Reciente
                </h3>

                <div className="space-y-6">
                    {/* Activity Items */}
                    {tickets.slice(0, 8).map((ticket, i) => (
                        <motion.div
                            key={`activity-${ticket.id}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-3 relative"
                        >
                            {/* Line connecting items */}
                            {i !== tickets.slice(0, 8).length - 1 && (
                                <div className="absolute left-2.5 top-8 bottom-[-24px] w-px bg-slate-800" />
                            )}

                            <div className="relative z-10 w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center shrink-0">
                                <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'CONFIRMED' ? 'bg-green-500' :
                                    ticket.status === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-300">
                                    <span className="font-medium text-white">{ticket.name}</span>
                                    <span className="text-slate-500"> registró el ticket </span>
                                    <span className="font-mono text-blue-400 text-xs">#{ticket.ticketNumber.split('-')[1]}</span>
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Hace {Math.floor(Math.random() * 24)}h
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </aside>

            {/* Ticket Detail Modal */}
            <AnimatePresence>
                {showModal && selectedTicket && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-800">
                                <h3 className="text-xl font-semibold">Detalles del Ticket</h3>
                                <p className="text-slate-400 text-sm mt-1">#{selectedTicket.ticketNumber}</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Participant Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nombre</p>
                                        <p className="font-medium">{selectedTicket.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-slate-300">{selectedTicket.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Teléfono</p>
                                        <p className="text-slate-300">{selectedTicket.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estado</p>
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedTicket.status]}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Proof */}
                                {selectedTicket.paymentProof && (
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Comprobante de Pago</p>
                                        <div className="bg-slate-800 rounded-xl p-4 flex justify-center">
                                            <img
                                                src={selectedTicket.paymentProof}
                                                alt="Comprobante"
                                                className="max-h-64 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Actions for Pending */}
                                {selectedTicket.status === "PENDING" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                                                Razón de Rechazo (opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Ej: Comprobante ilegible, monto incorrecto..."
                                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-red-500"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleConfirm(selectedTicket.id)}
                                                disabled={loading}
                                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                ✓ Confirmar Ticket
                                            </button>
                                            <button
                                                onClick={() => handleReject(selectedTicket.id)}
                                                disabled={loading || !rejectReason.trim()}
                                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                ✗ Rechazar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
