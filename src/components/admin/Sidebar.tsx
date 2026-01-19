"use client";

import { Sparkles, LayoutDashboard, Trophy, Settings, LogOut, Menu, X, Tag } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { logoutAction } from "@/app/actions/admin"

export default function AdminSidebar({ session }: { session: any }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 z-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white">RifaApp</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-white"
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
                            <h1 className="font-bold text-lg text-white">RifaApp</h1>
                            <p className="text-xs text-slate-400">Panel Admin</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/admin/roulette"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/roulette')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            <Trophy className="w-5 h-5" />
                            Sorteo
                        </Link>
                        <Link
                            href="/admin/referrals"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/referrals')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            <Tag className="w-5 h-5" />
                            Referidos
                        </Link>
                        <Link
                            href="/admin/settings"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/admin/settings')
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            <Settings className="w-5 h-5" />
                            Configuración
                        </Link>
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                            {session.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-sm text-white">{session.name}</p>
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
        </>
    )
}
