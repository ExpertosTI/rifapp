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
            ticketPrice: 10.00,
            currency: "USD",
            imageUrl: null,
            isActive: true,
            startDate: new Date(),
            endDate: null,
            totalTickets: 1000
        }
    }

    return config
}

export async function updateRaffleConfig(data: any) {
    try {
        const existing = await prisma.raffleConfig.findFirst()

        if (existing) {
            await prisma.raffleConfig.update({
                where: { id: existing.id },
                data: {
                    productName: data.productName,
                    description: data.description,
                    ticketPrice: data.ticketPrice,
                    imageUrl: data.imageUrl,
                    isActive: data.isActive,
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    totalTickets: parseInt(data.totalTickets)
                }
            })
        } else {
            await prisma.raffleConfig.create({
                data: {
                    productName: data.productName,
                    description: data.description,
                    ticketPrice: data.ticketPrice,
                    imageUrl: data.imageUrl,
                    isActive: data.isActive || true,
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    totalTickets: parseInt(data.totalTickets) || 1000
                }
            })
        }

        revalidatePath("/")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Error updating config:", error)
        return { error: "Failed to update configuration" }
    }
}
