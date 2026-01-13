import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()

    // Note: Login page handles its own auth check
    const isLoginPage = typeof window === 'undefined' // Server-side check

    return <>{children}</>
}
