import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH - Update referral (toggle active, update discount, etc.)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const referral = await prisma.referral.update({
            where: { id },
            data: body
        });

        return NextResponse.json(referral);
    } catch (error) {
        console.error("Error updating referral:", error);
        return NextResponse.json({ error: "Error updating referral" }, { status: 500 });
    }
}

// DELETE - Remove referral
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.referral.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting referral:", error);
        return NextResponse.json({ error: "Error deleting referral" }, { status: 500 });
    }
}
