import Link from "next/link";
import React from "react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-500 text-sm">
                        © {currentYear} Rifa Inmobiliaria. Todos los derechos reservados.
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">
                            Términos
                        </Link>
                        <Link href="/privacy" className="text-gray-400 hover:text-gray-900 transition-colors text-sm">
                            Privacidad
                        </Link>
                    </div>

                    <a 
                        href="https://renace.tech" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 opacity-30 hover:opacity-70 transition-all duration-300 group grayscale hover:grayscale-0"
                    >
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase group-hover:text-blue-600">
                            Powered by
                        </span>
                        <img 
                            src="/renace.svg" 
                            alt="Renace" 
                            className="h-4 w-auto"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
}
