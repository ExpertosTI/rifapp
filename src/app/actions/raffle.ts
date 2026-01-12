"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

export async function generateTicketAction(formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return { error: "Datos inválidos. Verifica tu información." };
  }

  // Generate a unique ticket code
  const ticketCode = "APT-" + Math.random().toString(36).substr(2, 6).toUpperCase() + "-" + new Date().getFullYear();

  try {
    // Save to Database
    await prisma.ticket.create({
      data: {
        ticketNumber: ticketCode,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        status: "CONFIRMED"
      }
    });

    // Send email
    await sendEmail({
      to: result.data.email,
      subject: "🎟️ Tu Ticket para la Rifa Inmobiliaria",
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>¡Hola ${result.data.name}!</h1>
            <p>Gracias por participar. Aquí tienes tu ticket digital:</p>
            <div style="background: #f4f4f5; padding: 20px; border-radius: 10px; text-align: center; border: 2px dashed #3b82f6;">
              <h2 style="color: #3b82f6; font-size: 32px; margin: 0;">${ticketCode}</h2>
            </div>
            <p>Guarda este correo. El sorteo será anunciado pronto.</p>
            <p>¡Mucha suerte! 🍀</p>
          </div>
        `,
    });

    return { success: true, ticket: ticketCode };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Error al generar el ticket. Intenta nuevamente." };
  }
}
