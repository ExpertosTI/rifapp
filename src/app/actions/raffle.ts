"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

// Generate a unique 6-digit LEIDSA-style ticket number
async function generateUniqueTicketNumber(): Promise<string> {
  const maxAttempts = 100;

  for (let i = 0; i < maxAttempts; i++) {
    // Generate random number between 0 and 999999
    const randomNum = Math.floor(Math.random() * 1000000);
    // Pad to 6 digits
    const ticketNumber = randomNum.toString().padStart(6, "0");

    // Check if already exists
    const existing = await prisma.ticket.findUnique({
      where: { ticketNumber }
    });

    if (!existing) {
      return ticketNumber;
    }
  }

  throw new Error("No se pudo generar un número único. Intenta de nuevo.");
}

// Check if a ticket number is available
export async function checkTicketAvailability(ticketNumber: string) {
  // Validate format
  if (!/^\d{6}$/.test(ticketNumber)) {
    return { available: false, error: "Formato inválido. Debe ser 6 dígitos." };
  }

  const existing = await prisma.ticket.findUnique({
    where: { ticketNumber }
  });

  return { available: !existing };
}

export async function generateTicketAction(formData: FormData) {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const paymentProof = formData.get("paymentProof") as string | null;
  const paymentMethod = formData.get("paymentMethod") as string | null;
  const customNumber = formData.get("customNumber") as string | null;

  const result = schema.safeParse(data);

  if (!result.success) {
    return { error: "Datos inválidos. Verifica tu información." };
  }

  if (!paymentMethod) {
    return { error: "Debes seleccionar un método de pago." };
  }

  // Generate or validate ticket number
  let ticketNumber: string;

  if (customNumber && /^\d{6}$/.test(customNumber)) {
    // User chose a custom number - verify it's available
    const availability = await checkTicketAvailability(customNumber);
    if (!availability.available) {
      return { error: "Este número ya está ocupado. Elige otro." };
    }
    ticketNumber = customNumber;
  } else {
    // Generate random number
    try {
      ticketNumber = await generateUniqueTicketNumber();
    } catch (err) {
      return { error: "Error generando número. Intenta de nuevo." };
    }
  }

  // Step 1: Save to Database
  try {
    await prisma.ticket.create({
      data: {
        ticketNumber,
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone,
        status: "PENDING",
        paymentProof: paymentProof || null,
        paymentMethod: paymentMethod,
      }
    });
  } catch (dbError) {
    console.error("Database error creating ticket:", dbError);
    return { error: "Error al guardar el ticket en la base de datos." };
  }

  // Fetch config for email details
  const config = await prisma.raffleConfig.findFirst();
  const productName = config?.productName || "Rifasmax";

  // Step 2: Try to send email (non-blocking - ticket is already saved)
  try {
    await sendEmail({
      to: result.data.email,
      subject: `🎟️ Tu Ticket #${ticketNumber} para ${productName} - Pendiente de Confirmación`,
      html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://rifasmax.com/logo-rifasmax.png" alt="Rifasmax" style="height: 60px;" />
            </div>
            <h1 style="color: #fff; text-align: center; margin: 0;">🎉 ¡Hola ${result.data.name}!</h1>
            <p style="color: #ccc; text-align: center; font-size: 18px; margin-top: 10px;">Tu ticket para <strong>${productName}</strong> ha sido registrado exitosamente.</p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 40px 30px; border-radius: 20px; text-align: center; margin: 30px 0; border: 2px dashed #fbbf24;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Tu Número de Ticket</p>
              <h2 style="color: #fbbf24; font-size: 56px; margin: 15px 0; letter-spacing: 8px; font-family: monospace;">${ticketNumber}</h2>
              <p style="color: #fbbf24; margin: 0; font-size: 14px;">⏳ Pendiente de Confirmación</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                <strong style="color: #fff;">Método de pago:</strong> ${paymentMethod}
              </p>
            </div>
            
            <p style="color: #9ca3af; text-align: center; font-size: 14px;">Tu pago está siendo verificado. Recibirás otro email cuando tu ticket sea confirmado.</p>
            <p style="color: #9ca3af; text-align: center; font-size: 14px;">¡Gracias por participar y buena suerte! 🍀</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #666; font-size: 11px; margin: 0;">Rifasmax RD - República Dominicana</p>
            </div>
          </div>
        `,
    });
  } catch (emailError) {
    // Email failed but ticket was saved - log but don't fail
    console.error("Email notification failed (ticket was saved):", emailError);
  }

  return { success: true, ticket: ticketNumber };
}
