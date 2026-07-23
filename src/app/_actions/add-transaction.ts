'use server'

import { 
  AddTransactionParams, 
  createTransactionFormSchema 
} from "../_schemas/transaction"
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const addTransaction = async (params: AddTransactionParams) => {
    const data = createTransactionFormSchema.parse(params)

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const userId = session?.user.id

    if (!userId) {
        redirect('/sign-in')
    }

    await prisma.transaction.create({
        data: {
            ...data,
            user: { connect: { id: userId } },
        },
    })

    revalidatePath('/')
}
