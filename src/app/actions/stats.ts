"use server";

import prisma from "@/lib/prisma";

export async function getTicketStats() {
    try {
        const [total, pending, confirmed] = await Promise.all([
            prisma.ticket.count(),
            prisma.ticket.count({ where: { status: "PENDING" } }),
            prisma.ticket.count({ where: { status: "CONFIRMED" } }),
        ]);

        return {
            total,
            pending,
            confirmed,
            sold: total, // For progress bar
        };
    } catch (error) {
        console.error("Error fetching ticket stats:", error);
        return { total: 0, pending: 0, confirmed: 0, sold: 0 };
    }
}

export async function applyReferralCode(code: string) {
    try {
        const referral = await prisma.referral.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!referral) {
            return { valid: false, error: "Código no válido" };
        }

        if (!referral.isActive) {
            return { valid: false, error: "Este código ya no está activo" };
        }

        if (referral.maxUses && referral.usageCount >= referral.maxUses) {
            return { valid: false, error: "Este código ha alcanzado su límite de usos" };
        }

        return {
            valid: true,
            discount: referral.discountPercent,
            ownerName: referral.ownerName
        };
    } catch (error) {
        console.error("Error applying referral code:", error);
        return { valid: false, error: "Error al verificar el código" };
    }
}

export async function incrementReferralUsage(code: string) {
    try {
        await prisma.referral.update({
            where: { code: code.toUpperCase() },
            data: { usageCount: { increment: 1 } }
        });
        return { success: true };
    } catch (error) {
        console.error("Error incrementing referral usage:", error);
        return { success: false };
    }
}

// Get recent purchases for social proof (real data)
export async function getRecentPurchases(limit: number = 5) {
    try {
        const recentTickets = await prisma.ticket.findMany({
            where: { status: { in: ["PENDING", "CONFIRMED"] } },
            orderBy: { createdAt: "desc" },
            take: limit,
            select: {
                name: true,
                createdAt: true,
            }
        });

        // Anonymize names (just first name initial + last name)
        return recentTickets.map((ticket: { name: string; createdAt: Date }) => {
            const nameParts = ticket.name.split(" ");
            const displayName = nameParts.length > 1
                ? `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`
                : ticket.name;

            return {
                name: displayName,
                timeAgo: getTimeAgo(ticket.createdAt)
            };
        });
    } catch (error) {
        console.error("Error fetching recent purchases:", error);
        return [];
    }
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "hace unos segundos";
    if (seconds < 3600) return `hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)} horas`;
    return `hace ${Math.floor(seconds / 86400)} días`;
}
