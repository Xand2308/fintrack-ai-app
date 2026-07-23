import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/app/_components/sidebar'
import Header from '@/app/_components/header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TransactionType } from '@/generated/prisma/enums'
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from '../_constants/transaction'

import  EditIcon  from '@/assets/edit-icon.png'
import  DeleteIcon  from '@/assets/delete-icon.png'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const TYPE_BADGE_STYLES: Record<TransactionType, string> = {
  DEPOSIT: 'bg-[#00bc7d]/20 text-[#00d492]',
  EXPENSE: 'bg-[#fb2c36]/20 text-[#ff6647]',
  INVESTMENT: 'bg-[#2b7fff]/20 text-[#51a2ff]',
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const formatDate = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

export default async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const userId = session?.user.id

  if (!userId) {
    redirect('/sign-in')
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return (
    <div className="flex min-h-screen bg-[#0f111a]">
      <Sidebar />

      <div className={`flex flex-1 flex-col ${inter.className}`}>
        <Header userName={session.user.name} date={new Date()} />

        <main className="p-8">
          <section className="space-y-1">
            <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.025] text-white">
              Transações
            </h1>

            <p className="text-sm text-[#90a1b9]">
              Gerencie suas entradas, despesas e investimentos
            </p>
          </section>

          <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[rgba(30,41,59,0.8)] shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.2),0px_20px_25px_-5px_rgba(0,0,0,0.2)]">
            <Table>
              <TableHeader className="bg-white/6">
                <TableRow className="border-b border-white/10 hover:bg-transparent">
                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#cad5e2]">
                    Nome
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Categoria
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Método
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Tipo
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Data
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Valor
                  </TableHead>

                  <TableHead className="h-auto px-4 py-4 text-xs font-semibold uppercase tracking-[0.05] text-[#94a388]">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-b border-white/5 hover:bg-transparent"
                  >
                    <TableCell className="px-4 py-5 text-sm font-medium text-white">
                      {transaction.name}
                    </TableCell>

                    <TableCell className="px-4 py-5 text-sm text-[#cad5e2]">
                      {
                        TRANSACTION_CATEGORY_LABELS[
                          transaction.category
                        ]
                      }
                    </TableCell>

                    <TableCell className="px-4 py-5 text-sm text-[#90a1b9]">
                      {
                        TRANSACTION_PAYMENT_METHOD_LABELS[
                          transaction.paymentMethod as keyof typeof TRANSACTION_PAYMENT_METHOD_LABELS
                        ]
                      }
                    </TableCell>

                    <TableCell className="px-4 py-5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_BADGE_STYLES[transaction.type]}`}
                      >
                        {TRANSACTION_TYPE_LABELS[transaction.type]}
                      </span>
                    </TableCell>

                    <TableCell className="px-4 py-5 text-sm text-[#90a1b9]">
                      {formatDate(transaction.date)}
                    </TableCell>

                    <TableCell
                      className={`px-4 py-5 text-right text-sm font-semibold ${
                        transaction.type === 'EXPENSE'
                          ? 'text-[#ff6467]'
                          : 'text-[#00d492]'
                      }`}
                    >
                      {formatCurrency(Number(transaction.amount))}
                    </TableCell>

                    <TableCell className="px-4 py-5">
                      <div className='flex justify-end gap-4'>
                        <Image 
                        src={EditIcon} alt='Editar Transação'
                        className='cursor-pointer'
                        />

                        <Image
                        src={DeleteIcon} alt='Deletar Transação'
                        className='cursor-pointer'
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </main>
      </div>
    </div>
  )
}