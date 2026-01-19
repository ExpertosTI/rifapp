"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Check, X, Loader2 } from "lucide-react";
import { applyReferralCode } from "@/app/actions/stats";

interface ReferralInputProps {
    onApply: (discount: number, code: string) => void;
    disabled?: boolean;
}

export const ReferralInput = ({ onApply, disabled }: ReferralInputProps) => {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [applied, setApplied] = useState<{ discount: number; ownerName: string } | null>(null);

    const handleApply = async () => {
        if (!code.trim() || loading) return;

        setLoading(true);
        setError(null);

        const result = await applyReferralCode(code.trim());

        if (result.valid && result.discount) {
            setApplied({ discount: result.discount, ownerName: result.ownerName || "" });
            onApply(result.discount, code.trim().toUpperCase());
        } else {
            setError(result.error || "Código inválido");
        }

        setLoading(false);
    };

    const handleClear = () => {
        setCode("");
        setApplied(null);
        setError(null);
        onApply(0, "");
    };

    if (applied) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-green-400">
                            ¡{applied.discount}% de descuento aplicado!
                        </p>
                        <p className="text-xs text-white/50">
                            Código: {code.toUpperCase()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClear}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    disabled={disabled}
                >
                    <X className="w-4 h-4 text-white/50" />
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value.toUpperCase());
                            setError(null);
                        }}
                        placeholder="Código de referido"
                        maxLength={20}
                        disabled={disabled || loading}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-yellow-500/50 disabled:opacity-50"
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApply}
                    disabled={!code.trim() || loading || disabled}
                    className="px-4 py-3 rounded-xl bg-yellow-500/20 text-yellow-400 font-medium text-sm hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Aplicar"
                    )}
                </motion.button>
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-400"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
