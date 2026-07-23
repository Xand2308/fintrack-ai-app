'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const deleteTransaction = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user.id

  if (!userId) {
    redirect('/sign-in')
  }

  await prisma.transaction.delete({
    where: {
      id,
      userId,
    },
  })

  revalidatePath('/transactions')
  revalidatePath('/')
}
