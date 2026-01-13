import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getTickets } from '@/app/actions/admin'
import RouletteClient from './RouletteClient'

export default async function RoulettePage() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    const tickets = await getTickets('CONFIRMED')

    return <RouletteClient session={session} tickets={tickets} />
}
