"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Save, RefreshCw, Calendar, DollarSign, Type, Image as ImageIcon,
    ToggleLeft, ToggleRight, Wallet, CreditCard, Phone, Mail
} from "lucide-react"
import { updateRaffleConfig } from "@/app/actions/config"
import { useRouter } from "next/navigation"

interface Config {
    productName: string
    description: string
    ticketPrice: number
    currency: string
    imageUrl: string | null
    isActive: boolean
    startDate: Date
    endDate: Date | null
    drawDate: Date | null
    totalTickets: number
    // Payment Methods
    usdtWallet: string | null
    usdtNetwork: string
    zelleEmail: string | null
    zelleName: string | null
    paypalEmail: string | null
    paypalLink: string | null
    bankName: string | null
    bankAccount: string | null
    bankHolder: string | null
    whatsappNumber: string | null
}

export default function SettingsClient({ initialConfig }: { initialConfig: any }) {
    const [config, setConfig] = useState<Config>({
        ...initialConfig,
        ticketPrice: Number(initialConfig.ticketPrice),
        startDate: new Date(initialConfig.startDate),
        endDate: initialConfig.endDate ? new Date(initialConfig.endDate) : null,
        drawDate: initialConfig.drawDate ? new Date(initialConfig.drawDate) : null,
        usdtWallet: initialConfig.usdtWallet || "",
        usdtNetwork: initialConfig.usdtNetwork || "TRC20",
        zelleEmail: initialConfig.zelleEmail || "",
        zelleName: initialConfig.zelleName || "",
        paypalEmail: initialConfig.paypalEmail || "",
        paypalLink: initialConfig.paypalLink || "",
        bankName: initialConfig.bankName || "",
        bankAccount: initialConfig.bankAccount || "",
        bankHolder: initialConfig.bankHolder || "",
        whatsappNumber: initialConfig.whatsappNumber || "",
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
    const [activeTab, setActiveTab] = useState<'general' | 'payments'>('general')
    const router = useRouter()

    const handleChange = (field: keyof Config, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setLoading(true)
        setMessage(null)
        try {
            const res = await updateRaffleConfig(config)
            if (res.error) throw new Error(res.error)
            setMessage({ text: "Configuración guardada exitosamente", type: 'success' })
            router.refresh()
        } catch (error) {
            setMessage({ text: "Error al guardar la configuración", type: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'general'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        ⚙️ General
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'payments'
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        💳 Métodos de Pago
                    </button>
                </div>

                {activeTab === 'general' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <SettingsIcon className="w-5 h-5 text-blue-400" />
                            Configuración General
                        </h2>

                        <div className="space-y-4">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Nombre del Producto</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={config.productName}
                                        onChange={(e) => handleChange('productName', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Descripción Corta</label>
                                <textarea
                                    value={config.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>

                            {/* Price & Tickets */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Precio Ticket</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="number"
                                            value={config.ticketPrice}
                                            onChange={(e) => handleChange('ticketPrice', parseFloat(e.target.value))}
                                            step="0.01"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Total Tickets</label>
                                    <input
                                        type="number"
                                        value={config.totalTickets}
                                        onChange={(e) => handleChange('totalTickets', parseInt(e.target.value))}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">URL Imagen Principal</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={config.imageUrl || ''}
                                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Draw Date */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Fecha del Sorteo</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="datetime-local"
                                        value={config.drawDate ? new Date(config.drawDate).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => handleChange('drawDate', e.target.value ? new Date(e.target.value) : null)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div>
                                    <p className="font-medium text-white">Estado de la Rifa</p>
                                    <p className="text-sm text-slate-400">{config.isActive ? 'Activa y visible' : 'Pausada / Oculta'}</p>
                                </div>
                                <button
                                    onClick={() => handleChange('isActive', !config.isActive)}
                                    className={`text-2xl transition-colors ${config.isActive ? 'text-green-500' : 'text-slate-500'}`}
                                >
                                    {config.isActive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 space-y-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-green-400" />
                            Métodos de Pago
                        </h2>

                        {/* USDT */}
                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl space-y-3">
                            <h3 className="font-semibold text-green-400 flex items-center gap-2">
                                <span className="text-lg">🟢</span> USDT (Tether)
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs text-slate-400 mb-1">Wallet Address</label>
                                    <input
                                        type="text"
                                        value={config.usdtWallet || ''}
                                        onChange={(e) => handleChange('usdtWallet', e.target.value)}
                                        placeholder="TVYQpPjBp1xe8q..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-green-500 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Red</label>
                                    <select
                                        value={config.usdtNetwork}
                                        onChange={(e) => handleChange('usdtNetwork', e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-green-500"
                                    >
                                        <option value="TRC20">TRC20</option>
                                        <option value="ERC20">ERC20</option>
                                        <option value="BEP20">BEP20</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Zelle */}
                        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl space-y-3">
                            <h3 className="font-semibold text-purple-400 flex items-center gap-2">
                                <span className="text-lg">💜</span> Zelle
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Email Zelle</label>
                                    <input
                                        type="email"
                                        value={config.zelleEmail || ''}
                                        onChange={(e) => handleChange('zelleEmail', e.target.value)}
                                        placeholder="pagos@ejemplo.com"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Nombre Receptor</label>
                                    <input
                                        type="text"
                                        value={config.zelleName || ''}
                                        onChange={(e) => handleChange('zelleName', e.target.value)}
                                        placeholder="Rifasmax RD"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* PayPal */}
                        <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl space-y-3">
                            <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                                <span className="text-lg">💙</span> PayPal
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Email PayPal</label>
                                    <input
                                        type="email"
                                        value={config.paypalEmail || ''}
                                        onChange={(e) => handleChange('paypalEmail', e.target.value)}
                                        placeholder="pagos@ejemplo.com"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Link PayPal.me (opcional)</label>
                                    <input
                                        type="url"
                                        value={config.paypalLink || ''}
                                        onChange={(e) => handleChange('paypalLink', e.target.value)}
                                        placeholder="https://paypal.me/tuusuario"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bank Transfer (Visa/MC) */}
                        <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl space-y-3">
                            <h3 className="font-semibold text-orange-400 flex items-center gap-2">
                                <span className="text-lg">🏦</span> Transferencia Bancaria (Visa/MC)
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Nombre del Banco</label>
                                    <input
                                        type="text"
                                        value={config.bankName || ''}
                                        onChange={(e) => handleChange('bankName', e.target.value)}
                                        placeholder="Banco Popular Dominicano"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-orange-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Número de Cuenta</label>
                                        <input
                                            type="text"
                                            value={config.bankAccount || ''}
                                            onChange={(e) => handleChange('bankAccount', e.target.value)}
                                            placeholder="XXXX-XXXX-XXXX"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Titular</label>
                                        <input
                                            type="text"
                                            value={config.bankHolder || ''}
                                            onChange={(e) => handleChange('bankHolder', e.target.value)}
                                            placeholder="Rifasmax SRL"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3">
                            <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> WhatsApp para Notificaciones
                            </h3>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Número WhatsApp</label>
                                <input
                                    type="tel"
                                    value={config.whatsappNumber || ''}
                                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                    placeholder="+18291234567"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Save Button & Messages */}
                <div className="space-y-4">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Guardar Cambios
                    </button>
                </div>
            </motion.div>


            {/* Live Preview Section */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
            >
                <div>
                    <h3 className="text-lg font-semibold text-slate-400 mb-4 uppercase tracking-wider text-xs">Vista Previa (Live Preview)</h3>

                    {/* Preview Card */}
                    <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl">
                        {/* Image Area */}
                        <div className="h-64 w-full bg-slate-800 relative overflow-hidden group">
                            {config.imageUrl ? (
                                <img
                                    src={config.imageUrl}
                                    alt="Premiere"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                    <ImageIcon className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                            {/* Floating Price Tag */}
                            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-lg">
                                <span className="font-bold text-white">${config.ticketPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 relative">
                            {/* Product Name */}
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
                                {config.productName || "Nombre del Producto"}
                            </h2>

                            {/* Description */}
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                {config.description || "Descripción del producto..."}
                            </p>

                            {/* Progress Bar (Fake data for preview) */}
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between text-xs text-slate-500 uppercase font-medium tracking-wider">
                                    <span>Tickets Vendidos</span>
                                    <span>245 / {config.totalTickets.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[25%]" />
                                </div>
                            </div>

                            {/* Action Button */}
                            <button className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-black shadow-lg shadow-orange-500/20">
                                Comprar Ticket
                            </button>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Preview */}
                {activeTab === 'payments' && (
                    <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">Métodos Configurados</h4>
                        <div className="flex flex-wrap gap-2">
                            {config.usdtWallet && (
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">✓ USDT</span>
                            )}
                            {config.zelleEmail && (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">✓ Zelle</span>
                            )}
                            {config.paypalEmail && (
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">✓ PayPal</span>
                            )}
                            {config.bankAccount && (
                                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium">✓ Banco</span>
                            )}
                            {config.whatsappNumber && (
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">✓ WhatsApp</span>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}
