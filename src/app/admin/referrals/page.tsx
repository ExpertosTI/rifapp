"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Tag, Plus, Trash2, Copy, Check, Users, Percent,
    ToggleLeft, ToggleRight, Loader2, X
} from "lucide-react";

interface Referral {
    id: string;
    code: string;
    ownerName: string;
    ownerEmail: string;
    discountPercent: number;
    usageCount: number;
    maxUses: number | null;
    isActive: boolean;
    createdAt: string;
}

export default function ReferralsPage() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    // Create form state
    const [newCode, setNewCode] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [discount, setDiscount] = useState(10);
    const [maxUses, setMaxUses] = useState<string>("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const res = await fetch("/api/admin/referrals");
            if (res.ok) {
                const data = await res.json();
                setReferrals(data);
            }
        } catch (error) {
            console.error("Error fetching referrals:", error);
        }
        setLoading(false);
    };

    const createReferral = async () => {
        if (!newCode.trim() || !ownerName.trim()) return;

        setCreating(true);
        try {
            const res = await fetch("/api/admin/referrals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: newCode.toUpperCase().replace(/\s/g, ""),
                    ownerName,
                    ownerEmail,
                    discountPercent: discount,
                    maxUses: maxUses ? parseInt(maxUses) : null
                })
            });

            if (res.ok) {
                const created = await res.json();
                setReferrals([created, ...referrals]);
                setShowCreate(false);
                resetForm();
            }
        } catch (error) {
            console.error("Error creating referral:", error);
        }
        setCreating(false);
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            const res = await fetch(`/api/admin/referrals/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentState })
            });

            if (res.ok) {
                setReferrals(referrals.map(r =>
                    r.id === id ? { ...r, isActive: !currentState } : r
                ));
            }
        } catch (error) {
            console.error("Error toggling referral:", error);
        }
    };

    const deleteReferral = async (id: string) => {
        if (!confirm("¿Eliminar este código de referido?")) return;

        try {
            const res = await fetch(`/api/admin/referrals/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setReferrals(referrals.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error("Error deleting referral:", error);
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 2000);
    };

    const resetForm = () => {
        setNewCode("");
        setOwnerName("");
        setOwnerEmail("");
        setDiscount(10);
        setMaxUses("");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Códigos de Referido</h1>
                    <p className="text-white/60 text-sm">Gestiona descuentos y afiliados</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-xl hover:bg-yellow-400 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Código
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/60">Total Códigos</p>
                    <p className="text-2xl font-bold text-white">{referrals.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/60">Códigos Activos</p>
                    <p className="text-2xl font-bold text-green-400">
                        {referrals.filter(r => r.isActive).length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-white/60">Usos Totales</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {referrals.reduce((acc, r) => acc + r.usageCount, 0)}
                    </p>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowCreate(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">Nuevo Código</h2>
                                <button onClick={() => setShowCreate(false)}>
                                    <X className="w-5 h-5 text-white/50 hover:text-white" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    placeholder="Código (ej: RANDY20)"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40"
                                />
                                <input
                                    type="text"
                                    value={ownerName}
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    placeholder="Nombre del afiliado"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40"
                                />
                                <input
                                    type="email"
                                    value={ownerEmail}
                                    onChange={(e) => setOwnerEmail(e.target.value)}
                                    placeholder="Email del afiliado"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40"
                                />
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs text-white/60 mb-1 block">Descuento %</label>
                                        <input
                                            type="number"
                                            value={discount}
                                            onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                                            min={1}
                                            max={50}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-white/60 mb-1 block">Límite usos</label>
                                        <input
                                            type="number"
                                            value={maxUses}
                                            onChange={(e) => setMaxUses(e.target.value)}
                                            placeholder="Ilimitado"
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={createReferral}
                                disabled={!newCode.trim() || !ownerName.trim() || creating}
                                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl disabled:opacity-50"
                            >
                                {creating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Crear Código"}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Referrals List */}
            <div className="space-y-3">
                {referrals.length === 0 ? (
                    <div className="text-center py-12 text-white/50">
                        <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay códigos de referido</p>
                    </div>
                ) : (
                    referrals.map((referral) => (
                        <motion.div
                            key={referral.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${referral.isActive
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-white/2 border-white/5 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                        <Tag className="w-6 h-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-white font-mono text-lg">
                                                {referral.code}
                                            </p>
                                            <button
                                                onClick={() => copyCode(referral.code)}
                                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                            >
                                                {copied === referral.code ? (
                                                    <Check className="w-4 h-4 text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-white/40" />
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-sm text-white/60">
                                            {referral.ownerName} • {referral.ownerEmail}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Percent className="w-4 h-4" />
                                            <span className="font-bold">{referral.discountPercent}%</span>
                                        </div>
                                        <p className="text-xs text-white/50">Descuento</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center gap-1 text-blue-400">
                                            <Users className="w-4 h-4" />
                                            <span className="font-bold">
                                                {referral.usageCount}
                                                {referral.maxUses && `/${referral.maxUses}`}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/50">Usos</p>
                                    </div>

                                    <button
                                        onClick={() => toggleActive(referral.id, referral.isActive)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        {referral.isActive ? (
                                            <ToggleRight className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <ToggleLeft className="w-6 h-6 text-white/40" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => deleteReferral(referral.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
