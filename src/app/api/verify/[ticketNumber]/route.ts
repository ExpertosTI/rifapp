import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ ticketNumber: string }> }
) {
    try {
        const { ticketNumber } = await params;

        // Validate format
        if (!ticketNumber || !/^\d{6}$/.test(ticketNumber)) {
            return NextResponse.json(
                { error: "Número de ticket inválido. Debe ser de 6 dígitos." },
                { status: 400 }
            );
        }

        const ticket = await prisma.ticket.findUnique({
            where: { ticketNumber },
            select: {
                ticketNumber: true,
                name: true,
                status: true,
                createdAt: true,
                isWinner: true,
            }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: "No se encontró ningún ticket con este número." },
                { status: 404 }
            );
        }

        return NextResponse.json({ ticket });
    } catch (error) {
        console.error("Error verifying ticket:", error);
        return NextResponse.json(
            { error: "Error al verificar el ticket." },
            { status: 500 }
        );
    }
}
