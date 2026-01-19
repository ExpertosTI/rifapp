import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - List all referrals
export async function GET() {
    try {
        const referrals = await prisma.referral.findMany({
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json(referrals);
    } catch (error) {
        console.error("Error fetching referrals:", error);
        return NextResponse.json({ error: "Error fetching referrals" }, { status: 500 });
    }
}

// POST - Create new referral
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { code, ownerName, ownerEmail, discountPercent, maxUses } = body;

        if (!code || !ownerName) {
            return NextResponse.json({ error: "Code and owner name are required" }, { status: 400 });
        }

        // Check if code already exists
        const existing = await prisma.referral.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (existing) {
            return NextResponse.json({ error: "Code already exists" }, { status: 400 });
        }

        const referral = await prisma.referral.create({
            data: {
                code: code.toUpperCase(),
                ownerName,
                ownerEmail: ownerEmail || "",
                discountPercent: discountPercent || 10,
                maxUses: maxUses || null,
                isActive: true
            }
        });

        return NextResponse.json(referral);
    } catch (error) {
        console.error("Error creating referral:", error);
        return NextResponse.json({ error: "Error creating referral" }, { status: 500 });
    }
}
