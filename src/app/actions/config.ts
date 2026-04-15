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
            // Public payment info (only flags or public details)
            hasUsdt: false,
            hasZelle: false,
            hasPaypal: false,
            hasBank: false,
            hasGooglePay: false,
            whatsappNumber: null,
        }
    }

    // Return only public fields to prevent data leaks
    return {
        id: config.id,
        productName: config.productName,
        description: config.description,
        ticketPrice: Number(config.ticketPrice),
        currency: config.currency,
        imageUrl: config.imageUrl,
        galleryIds: config.galleryIds,
        startDate: config.startDate,
        endDate: config.endDate,
        drawDate: config.drawDate,
        isActive: config.isActive,
        totalTickets: config.totalTickets,
        // Flags for payment methods (don't send actual wallet/account data to frontend)
        hasUsdt: !!config.usdtWallet,
        hasZelle: !!config.zelleEmail,
        hasPaypal: !!config.paypalEmail,
        hasBank: !!config.bankAccount,
        hasGooglePay: !!config.googlePayNumber,
        whatsappNumber: config.whatsappNumber,
    }
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
