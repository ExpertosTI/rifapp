
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getRaffleConfig } from '@/app/actions/config'
import SettingsClient from './SettingsClient'
import AdminSidebar from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await getSession()

    if (!session) {
        redirect('/admin/login')
    }

    const config = await getRaffleConfig()

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <AdminSidebar session={session} />
            <main className="pt-20 md:pt-8 md:ml-64 p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Configuración</h1>
                    <p className="text-slate-400 mt-1">Personaliza tu rifa y el producto estrella</p>
                </div>
                <SettingsClient initialConfig={config} />
            </main>
        </div>
    )
}
