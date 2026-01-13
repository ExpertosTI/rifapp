"use server"

import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { setSession, clearSession, getSession, AdminPayload } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
    try {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return { error: 'Email y contraseña son requeridos' }
        }

        // Check if admin table exists and has users
        const adminCount = await prisma.admin.count()

        if (adminCount === 0) {
            // Auto-create default admin if none exists
            const hashedPassword = await bcrypt.hash('RifaAdmin2026!', 12)
            await prisma.admin.create({
                data: {
                    email: 'admin@rifapp.renace.space',
                    password: hashedPassword,
                    name: 'Super Admin',
                    role: 'SUPER_ADMIN'
                }
            })
            console.log('Default admin created automatically')
        }

        const admin = await prisma.admin.findUnique({
            where: { email }
        })

        if (!admin) {
            return { error: 'Credenciales inválidas' }
        }

        const isValid = await bcrypt.compare(password, admin.password)
        if (!isValid) {
            return { error: 'Credenciales inválidas' }
        }

        await setSession({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role
        })

        redirect('/admin')
    } catch (error) {
        console.error('Login error:', error)
        return { error: 'Error del servidor. Intenta más tarde.' }
    }
}

export async function logoutAction() {
    await clearSession()
    redirect('/admin/login')
}

export async function getCurrentAdmin(): Promise<AdminPayload | null> {
    return getSession()
}

// Ticket Management Actions
export async function getTickets(status?: string) {
    const where = status ? { status } : {}
    return prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })
}

export async function getTicketStats() {
    const [total, pending, confirmed, rejected] = await Promise.all([
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: 'PENDING' } }),
        prisma.ticket.count({ where: { status: 'CONFIRMED' } }),
        prisma.ticket.count({ where: { status: 'REJECTED' } })
    ])

    return { total, pending, confirmed, rejected }
}

export async function confirmTicket(ticketId: string, adminId: string) {
    const ticket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
            status: 'CONFIRMED',
            confirmedBy: adminId,
            confirmedAt: new Date()
        }
    })

    // Send confirmation email
    const { sendEmail } = await import('@/lib/nodemailer')
    await sendEmail({
        to: ticket.email,
        subject: '✅ ¡Tu Ticket ha sido Confirmado!',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px; border-radius: 20px;">
        <h1 style="color: #fff; text-align: center;">🎉 ¡Felicidades, ${ticket.name}!</h1>
        <p style="color: #ccc; text-align: center; font-size: 18px;">Tu pago ha sido verificado y tu ticket está activo.</p>
        <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0; border: 2px dashed #4ade80;">
          <p style="color: #9ca3af; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Tu Número de Ticket</p>
          <h2 style="color: #4ade80; font-size: 36px; margin: 10px 0;">${ticket.ticketNumber}</h2>
          <p style="color: #4ade80; margin: 0;">✓ Confirmado para el Sorteo</p>
        </div>
        <p style="color: #9ca3af; text-align: center;">El sorteo será anunciado próximamente. ¡Mucha suerte! 🍀</p>
      </div>
    `
    })

    return ticket
}

export async function rejectTicket(ticketId: string, reason: string) {
    const ticket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
            status: 'REJECTED',
            rejectedAt: new Date(),
            rejectReason: reason
        }
    })

    // Send rejection email
    const { sendEmail } = await import('@/lib/nodemailer')
    await sendEmail({
        to: ticket.email,
        subject: '❌ Ticket No Confirmado',
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; padding: 40px; border-radius: 20px;">
        <h1 style="color: #fff; text-align: center;">Lo sentimos, ${ticket.name}</h1>
        <p style="color: #ccc; text-align: center;">Tu ticket no pudo ser confirmado.</p>
        <div style="background: rgba(239,68,68,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="color: #f87171; margin: 0;"><strong>Razón:</strong> ${reason}</p>
        </div>
        <p style="color: #9ca3af; text-align: center;">Por favor, intenta nuevamente con un comprobante válido.</p>
      </div>
    `
    })

    return ticket
}

export async function selectWinner() {
    // Get all confirmed tickets
    const confirmedTickets = await prisma.ticket.findMany({
        where: { status: 'CONFIRMED', isWinner: false }
    })

    if (confirmedTickets.length === 0) {
        return { error: 'No hay tickets confirmados para el sorteo' }
    }

    // Random selection
    const randomIndex = Math.floor(Math.random() * confirmedTickets.length)
    const winner = confirmedTickets[randomIndex]

    // Mark as winner
    await prisma.ticket.update({
        where: { id: winner.id },
        data: {
            status: 'WINNER',
            isWinner: true
        }
    })

    return { success: true, winner }
}
