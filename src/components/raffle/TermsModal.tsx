"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, CheckSquare } from "lucide-react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full md:w-[95%] md:max-w-lg max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-t-3xl md:rounded-2xl border border-white/10 bg-slate-900 md:bg-slate-900/95 backdrop-blur-xl shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex-shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h2 className="text-lg md:text-xl font-bold text-white">Términos y Condiciones</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content - takes remaining space and scrolls */}
                        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                                <p className="text-xs text-yellow-400 font-medium uppercase tracking-wider">
                                    RIFASMAX - República Dominicana
                                </p>

                                <div className="space-y-3">
                                    <TermItem number={1}>
                                        Los números disponibles para la compra en cada uno de nuestros sorteos
                                        se especificarán en la página de detalles correspondiente a cada sorteo.
                                    </TermItem>

                                    <TermItem number={2}>
                                        Solo podrán participar en nuestros sorteos personas naturales mayores
                                        de 18 años con nacionalidad dominicana o extranjeros que residan
                                        legalmente en <span className="text-white font-medium">República Dominicana</span>.
                                    </TermItem>

                                    <TermItem number={3}>
                                        Los premios deberán ser retirados en persona en la ubicación designada
                                        para cada sorteo en <span className="text-white font-medium">Santo Domingo, RD</span>.
                                        Solo se realizarán entregas personales en la dirección indicada por el
                                        ganador del primer premio o premio mayor.
                                    </TermItem>

                                    <TermItem number={4}>
                                        La compra mínima requerida para participar en nuestros sorteos es de un
                                        ticket. Los tickets serán asignados de manera aleatoria o elegidos por
                                        el participante (si están disponibles) y los recibirás a través del
                                        correo electrónico y WhatsApp proporcionados.
                                    </TermItem>

                                    <TermItem number={5}>
                                        Para reclamar tu premio tienes un lapso de <span className="text-yellow-400 font-bold">72 horas</span>
                                        {" "}después de anunciado el resultado oficial del sorteo.
                                    </TermItem>

                                    <TermItem number={6} important>
                                        Los ganadores aceptan aparecer en el contenido audiovisual del sorteo
                                        mostrando su presencia en las redes y entrega de los premios.
                                        <span className="text-red-400 font-bold"> Esto es OBLIGATORIO.</span>
                                    </TermItem>

                                    <TermItem number={7}>
                                        Usted acepta recibir correos y mensajes de WhatsApp sobre nuestras
                                        ofertas, notificaciones del sorteo y resultados.
                                    </TermItem>

                                    <TermItem number={8}>
                                        Rifasmax se reserva el derecho de verificar la identidad del ganador
                                        mediante <span className="text-white font-medium">cédula de identidad dominicana vigente</span> o
                                        documento de residencia legal.
                                    </TermItem>

                                    <TermItem number={9}>
                                        En caso de disputa sobre los resultados o cualquier aspecto del sorteo,
                                        la decisión de Rifasmax será final e inapelable.
                                    </TermItem>

                                    <TermItem number={10}>
                                        Al participar en cualquiera de nuestros sorteos, usted confirma que ha
                                        leído, entendido y aceptado todos estos términos y condiciones.
                                    </TermItem>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 p-4 md:p-6 border-t border-white/10 bg-slate-900">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onAccept}
                                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg shadow-xl shadow-orange-500/25 hover:from-yellow-400 hover:to-orange-400 transition-all"
                            >
                                <CheckSquare className="w-5 h-5" />
                                Aceptar Términos
                            </motion.button>
                            <p className="text-xs text-white/30 text-center mt-3">
                                Al hacer clic en "Aceptar", confirmas que has leído y aceptas estos términos.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const TermItem = ({
    number,
    children,
    important = false
}: {
    number: number;
    children: React.ReactNode;
    important?: boolean;
}) => (
    <div className={`flex gap-3 ${important ? 'bg-red-500/10 border border-red-500/20 rounded-xl p-3 -mx-3' : ''}`}>
        <span className={`flex-shrink-0 w-6 h-6 rounded-lg ${important ? 'bg-red-500/30 text-red-400' : 'bg-white/10 text-white/50'} flex items-center justify-center text-xs font-bold`}>
            {number}
        </span>
        <p className="flex-1">{children}</p>
    </div>
);
