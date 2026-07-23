import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const getRecentTransactions = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    const lastTransactions = await prisma.transaction.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: 'desc',
        },
        take: 3,
    })

    return lastTransactions
}
