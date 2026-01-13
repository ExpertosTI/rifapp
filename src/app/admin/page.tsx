import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTicketStats, getTickets } from '@/app/actions/admin'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    const stats = await getTicketStats()
    const tickets = await getTickets()

    return <AdminDashboardClient session={session} stats={stats} tickets={tickets} />
}
