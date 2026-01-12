import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

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
            <body className={outfit.className}>
                <Navbar />
                {children}
            </body>
        </html>
    );
}
