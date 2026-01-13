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

  const paymentProof = formData.get("paymentProof") as string | null;

  const result = schema.safeParse(data);

  if (!result.success) {
    return { error: "Datos inválidos. Verifica tu información." };
  }

  // Generate a unique ticket code
  const ticketCode = "APT-" + Math.random().toString(36).substr(2, 6).toUpperCase() + "-" + new Date().getFullYear();

  try {
    // Save to Database with PENDING status (awaiting payment confirmation)
    await prisma.ticket.create({
      data: {
        ticketNumber: ticketCode,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        status: "PENDING",
        paymentProof: paymentProof || null
      }
    });

    // Send email notification
    await sendEmail({
      to: result.data.email,
      subject: "🎟️ Tu Ticket para la Rifa Inmobiliaria - Pendiente de Confirmación",
      html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; border-radius: 20px;">
            <h1 style="color: #fff; text-align: center;">🎉 ¡Hola ${result.data.name}!</h1>
            <p style="color: #ccc; text-align: center; font-size: 18px;">Tu ticket ha sido registrado exitosamente.</p>
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; border: 2px dashed #fbbf24;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Tu Número de Ticket</p>
              <h2 style="color: #fbbf24; font-size: 36px; margin: 10px 0;">${ticketCode}</h2>
              <p style="color: #fbbf24; margin: 0;">⏳ Pendiente de Confirmación</p>
            </div>
            <p style="color: #9ca3af; text-align: center;">Tu pago está siendo verificado. Recibirás otro email cuando tu ticket sea confirmado.</p>
            <p style="color: #9ca3af; text-align: center;">¡Gracias por participar! 🍀</p>
          </div>
        `,
    });

    return { success: true, ticket: ticketCode };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { error: "Error al generar el ticket. Intenta nuevamente." };
  }
}
