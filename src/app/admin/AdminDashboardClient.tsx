"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard, Ticket, Users, Trophy, LogOut,
    CheckCircle, XCircle, Clock, Eye, Search, Filter,
    ChevronDown, MoreHorizontal, Sparkles
} from "lucide-react"
import { AdminPayload } from "@/lib/auth"
import { logoutAction, confirmTicket, rejectTicket } from "@/app/actions/admin"
import { logoutAction, confirmTicket, rejectTicket } from "@/app/actions/admin"
import { useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

interface Props {
    session: AdminPayload
    stats: { total: number; pending: number; confirmed: number; rejected: number }
    tickets: any[]
}

export default function AdminDashboardClient({ session, stats, tickets: initialTickets }: Props) {
    const [tickets, setTickets] = useState(initialTickets)
    const [filter, setFilter] = useState<string>("ALL")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTicket, setSelectedTicket] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [rejectReason, setRejectReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const router = useRouter()

    const filteredTickets = tickets.filter(ticket => {
        const matchesFilter = filter === "ALL" || ticket.status === filter
        const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
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
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold">RifaApp</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-full w-64 bg-slate-900/95 border-r border-slate-800 backdrop-blur-xl z-50
                transition-transform duration-300 ease-in-out md:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">RifaApp</h1>
                            <p className="text-xs text-slate-400">Panel Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </a>
                        <a href="/admin/roulette" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 transition-colors">
                            <Trophy className="w-5 h-5" />
                            Sorteo
                        </a>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                            {session.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{session.name}</p>
                            <p className="text-xs text-slate-400">{session.role}</p>
                        </div>
                    </div>
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pt-20 md:pt-8 md:ml-64 p-4 md:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 mt-1">Gestión de tickets y participantes</p>
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
                            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-6"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl`} />
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center mb-4`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                                </div>
                                <p className="text-slate-400 text-sm">{stat.label}</p>
                                <p className="text-3xl font-bold mt-1">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tickets Table */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Ticket className="w-5 h-5 text-blue-400" />
                            Tickets
                        </h2>
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            {/* Filter */}
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="ALL">Todos</option>
                                <option value="PENDING">Pendientes</option>
                                <option value="CONFIRMED">Confirmados</option>
                                <option value="REJECTED">Rechazados</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Ticket</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Participante</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Contacto</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Comprobante</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredTickets.map((ticket) => {
                                    const StatusIcon = statusIcons[ticket.status] || Clock
                                    return (
                                        <motion.tr
                                            key={ticket.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-blue-400">{ticket.ticketNumber}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium">{ticket.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-400">{ticket.email}</p>
                                                <p className="text-xs text-slate-500">{ticket.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[ticket.status]}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {ticket.paymentProof ? (
                                                    <button
                                                        onClick={() => { setSelectedTicket(ticket); setShowModal(true) }}
                                                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Ver
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-500 text-sm">Sin comprobante</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {ticket.status === "PENDING" && (
                                                    <button
                                                        onClick={() => { setSelectedTicket(ticket); setShowModal(true) }}
                                                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-colors"
                                                    >
                                                        Gestionar
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

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
