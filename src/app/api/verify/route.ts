import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type TicketLookupResult = {
  ticketNumber: string;
  name: string;
  phone: string;
  status: string;
  createdAt: Date;
  paymentMethod: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const rawPhone = request.nextUrl.searchParams.get("phone") || "";
    const normalizedPhone = rawPhone.replace(/\D/g, "");
    const lastTenDigits = normalizedPhone.slice(-10);

    if (normalizedPhone.length < 10) {
      return NextResponse.json(
        { error: "Ingresa un número de teléfono válido para verificar tus tickets." },
        { status: 400 }
      );
    }

    const tickets = await prisma.$queryRaw<TicketLookupResult[]>`
      SELECT "ticketNumber", "name", "phone", "status", "createdAt", "paymentMethod"
      FROM "Ticket"
      WHERE regexp_replace("phone", '[^0-9]', '', 'g') = ${normalizedPhone}
         OR right(regexp_replace("phone", '[^0-9]', '', 'g'), 10) = ${lastTenDigits}
      ORDER BY "createdAt" DESC
    `;

    if (tickets.length === 0) {
      return NextResponse.json(
        { error: "No encontramos tickets asociados a este teléfono." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      phone: tickets[0].phone,
      name: tickets[0].name,
      tickets: tickets.map((ticket: TicketLookupResult) => ({
        ticketNumber: ticket.ticketNumber,
        name: ticket.name,
        phone: ticket.phone,
        status: ticket.status,
        createdAt: ticket.createdAt,
        paymentMethod: ticket.paymentMethod,
      })),
    });
  } catch (error) {
    console.error("Error verifying tickets by phone:", error);
    return NextResponse.json(
      { error: "Error al verificar los tickets por teléfono." },
      { status: 500 }
    );
  }
}
