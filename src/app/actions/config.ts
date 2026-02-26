"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getRaffleConfig() {
    const config = await prisma.raffleConfig.findFirst()

    if (!config) {
        // Return default if not exists
        return {
            productName: "Gran Premio Exclusivo",
            description: "¡Participa ahora y gana este increíble premio!",
            ticketPrice: 3.00,
            currency: "USD",
            imageUrl: null,
            isActive: true,
            startDate: new Date(),
            endDate: null,
            drawDate: null,
            totalTickets: 1000000,
            // Payment defaults
            usdtWallet: null,
            usdtNetwork: "TRC20",
            zelleEmail: null,
            zelleName: null,
            paypalEmail: null,
            paypalLink: null,
            bankName: null,
            bankAccount: null,
            bankHolder: null,
            googlePayNumber: null,
            whatsappNumber: null,
        }
    }

    return config
}

export async function updateRaffleConfig(data: any) {
    try {
        const existing = await prisma.raffleConfig.findFirst()

        const configData = {
            productName: data.productName,
            description: data.description,
            ticketPrice: data.ticketPrice,
            imageUrl: data.imageUrl || null,
            isActive: data.isActive,
            endDate: data.endDate ? new Date(data.endDate) : null,
            drawDate: data.drawDate ? new Date(data.drawDate) : null,
            totalTickets: parseInt(data.totalTickets) || 1000000,
            // Payment methods
            usdtWallet: data.usdtWallet || null,
            usdtNetwork: data.usdtNetwork || "TRC20",
            zelleEmail: data.zelleEmail || null,
            zelleName: data.zelleName || null,
            paypalEmail: data.paypalEmail || null,
            paypalLink: data.paypalLink || null,
            bankName: data.bankName || null,
            bankAccount: data.bankAccount || null,
            bankHolder: data.bankHolder || null,
            googlePayNumber: data.googlePayNumber || null,
            whatsappNumber: data.whatsappNumber || null,
        }

        if (existing) {
            await prisma.raffleConfig.update({
                where: { id: existing.id },
                data: configData
            })
        } else {
            await prisma.raffleConfig.create({
                data: configData
            })
        }

        revalidatePath("/")
        revalidatePath("/admin")
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Error updating config:", error)
        return { error: "Failed to update configuration" }
    }
}
