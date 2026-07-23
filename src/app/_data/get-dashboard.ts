import { TransactionType } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const getDashboard = async (month: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    const year = 2026

    const startOfMonth = new Date(`${year}-${month}-01T00:00:00.000Z`)

    const startOfNextMonth = new Date(
        month === '12'
            ? `${year + 1}-01-01T00:00:00.000Z`
            : `${year}-${String(Number(month) + 1).padStart(2, '0')}-01T00:00:00.000Z`
    )

    const where = {
        userId,
        date: {
            gte: startOfMonth,
            lt: startOfNextMonth,
        },
    }

    //aggregate

    const depositsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'DEPOSIT',
                },

                _sum: {
                    amount: true,
                },
            })
        )._sum.amount ?? 0
    )

    const INVESTMENTsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'INVESTMENT',
                },

                _sum: {
                    amount: true,
                },
            })
        )._sum.amount ?? 0
    )

    const expensesTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                    type: 'EXPENSE',
                },

                _sum: {
                    amount: true,
                },
            })
        )._sum.amount ?? 0
    )

    const balance = depositsTotal - INVESTMENTsTotal - expensesTotal // saldo

    const transactionsTotal = Number(
        (
            await prisma.transaction.aggregate({
                where: {
                    ...where,
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount ?? 0
    )

    const typePercentage = {
        [TransactionType.DEPOSIT]:
            transactionsTotal > 0
                ? Math.round(
                      (Number(depositsTotal) / Number(transactionsTotal)) * 100
                  )
                : 0,

        [TransactionType.EXPENSE]:
            transactionsTotal > 0
                ? Math.round(
                      (Number(expensesTotal) / Number(transactionsTotal)) * 100
                  )
                : 0,

        [TransactionType.INVESTMENT]:
            transactionsTotal > 0
                ? Math.round(
                      (Number(INVESTMENTsTotal) / Number(transactionsTotal)) *
                          100
                  )
                : 0,
    }

    const totalExpensePerCategory = (
        await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                ...where,
                type: TransactionType.EXPENSE,
            },

            _sum: {
                amount: true,
            },
        })
    ).map((category) => ({
        category: category.category,
        totalAmount: Number(category._sum.amount),
        percentageOfTotal: Math.round(
            (Number(category._sum.amount) / Number(expensesTotal)) * 100
        ),
    }))

    const lastTransaction = (
        await prisma.transaction.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
            take: 3,
        })
    ).map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
    }))

    return {
        depositsTotal,
        INVESTMENTsTotal,
        expensesTotal,
        transactionsTotal,
        balance,
        totalExpensePerCategory,
        typePercentage,
        session,
        lastTransaction,
    }
}
