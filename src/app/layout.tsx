import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
    title: "Rifa Inmobiliaria de Lujo",
    description: "Participa y gana tu apartamento de ensueño.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className="antialiased">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
