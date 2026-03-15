"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/nodemailer";
import prisma from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
});

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function buildVerificationLink(phone: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "https://rifasmax.com").replace(/\/$/, "");
  return `${baseUrl}/verify?phone=${phone}`;
}

function parseCustomNumbers(rawValue: string | null) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return Array.from(
      new Set(
        parsed
          .map((value) => String(value).replace(/\D/g, "").slice(0, 6))
          .filter((value) => /^\d{6}$/.test(value))
      )
    );
  } catch {
    return [];
  }
}

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
  const customNumbers = parseCustomNumbers(formData.get("customNumbers") as string | null);
  // Parse quantity, default to 1, max 100 for safety
  let quantity = parseInt(formData.get("quantity") as string) || 1;
  if (quantity < 1) quantity = 1;
  if (quantity > 100) quantity = 100;

  const result = schema.safeParse(data);

  if (!result.success) {
    return { error: "Datos inválidos. Verifica tu información." };
  }

  if (!paymentMethod) {
    return { error: "Debes seleccionar un método de pago." };
  }

  const requestedCustomNumbers = customNumbers.length > 0
    ? customNumbers
    : customNumber && /^\d{6}$/.test(customNumber)
      ? [customNumber]
      : [];

  if (requestedCustomNumbers.length > 100) {
    return { error: "Solo puedes elegir hasta 100 números por compra." };
  }

  if (requestedCustomNumbers.length > 0) {
    quantity = requestedCustomNumbers.length;

    const occupiedNumbers = await prisma.ticket.findMany({
      where: {
        ticketNumber: {
          in: requestedCustomNumbers,
        },
      },
      select: {
        ticketNumber: true,
      },
    });

    if (occupiedNumbers.length > 0) {
      return {
        error: `Estos números ya están ocupados: ${occupiedNumbers.map((ticket: { ticketNumber: string }) => ticket.ticketNumber).join(", ")}`,
      };
    }
  }

  const createdTickets: string[] = [];
  const errors: string[] = [];
  const normalizedPhone = normalizePhone(result.data.phone);
  const verificationLink = buildVerificationLink(normalizedPhone);

  // Loop to generate tickets
  for (let i = 0; i < quantity; i++) {
    let ticketNumber: string;

    if (requestedCustomNumbers.length > 0) {
      ticketNumber = requestedCustomNumbers[i];
    } else {
      // Generate random number
      try {
        ticketNumber = await generateUniqueTicketNumber();
      } catch (err) {
        errors.push("Error generando un número aleatorio.");
        continue; // Skip this one
      }
    }

    // Save to Database
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
      createdTickets.push(ticketNumber);
    } catch (dbError) {
      console.error("Database error creating ticket:", dbError);
      errors.push("Error guardando ticket en base de datos.");
    }
  }

  if (createdTickets.length === 0) {
    return { error: errors[0] || "No se pudo generar ningún ticket. Intenta de nuevo." };
  }

  // Fetch config for email details
  const config = await prisma.raffleConfig.findFirst();
  const productName = config?.productName || "Rifasmax";

  // Generate HTML for ticket list
  const ticketsHtml = createdTickets.map(num => `
    <div style="background: rgba(255,255,255,0.1); padding: 20px 10px; border-radius: 12px; text-align: center; margin: 10px 0; border: 2px dashed #fbbf24; display: inline-block; min-width: 150px; margin: 5px;">
      <h2 style="color: #fbbf24; font-size: 32px; margin: 0; letter-spacing: 4px; font-family: monospace;">${num}</h2>
    </div>
  `).join('');

  // Step 2: Try to send email (non-blocking)
  try {
    await sendEmail({
      to: result.data.email,
      subject: `🎟️ Tus Tickets para ${productName} - Pendiente de Confirmación`,
      html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://rifasmax.com/logo-rifasmax.png" alt="Rifasmax" style="height: 60px;" />
            </div>
            <h1 style="color: #fff; text-align: center; margin: 0;">🎉 ¡Hola ${result.data.name}!</h1>
            <p style="color: #ccc; text-align: center; font-size: 18px; margin-top: 10px;">Hemos registrado <strong>${createdTickets.length} ticket(s)</strong> exitosamente.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="color: #9ca3af; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 3px;">Tus Números</p>
              ${ticketsHtml}
              <p style="color: #fbbf24; margin-top: 15px; font-size: 14px;">⏳ Pendiente de Confirmación</p>
            </div>
            
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                <strong style="color: #fff;">Método de pago:</strong> ${paymentMethod}
              </p>
            </div>

            <div style="background: rgba(59,130,246,0.12); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(96,165,250,0.25);">
              <p style="color: #bfdbfe; text-align: center; margin-top: 0; font-size: 14px;">Usa este enlace único para consultar todos tus tickets con tu teléfono:</p>
              <div style="text-align: center; margin-top: 18px;">
                <a href="${verificationLink}" style="display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 10px; font-weight: 600;">
                  Ver mis tickets
                </a>
              </div>
              <p style="color: #93c5fd; text-align: center; margin: 16px 0 0; font-size: 12px; word-break: break-all;">${verificationLink}</p>
            </div>
            
            <p style="color: #9ca3af; text-align: center; font-size: 14px;">Tu pago está siendo verificado. Recibirás otro email cuando tus tickets sean confirmados.</p>
            <p style="color: #9ca3af; text-align: center; font-size: 14px;">¡Gracias por participar y buena suerte! 🍀</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
              <p style="color: #666; font-size: 11px; margin: 0;">Rifasmax RD - República Dominicana</p>
            </div>
          </div>
        `,
    });
  } catch (emailError) {
    console.error("Email notification failed:", emailError);
  }

  // Return list of tickets
  return { success: true, tickets: createdTickets, verificationLink };
}
