import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('RifaAdmin2026!', 12)

    const admin = await prisma.admin.upsert({
        where: { email: 'admin@rifapp.renace.space' },
        update: {},
        create: {
            email: 'admin@rifapp.renace.space',
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN'
        }
    })

    console.log('Created admin:', admin.email)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
