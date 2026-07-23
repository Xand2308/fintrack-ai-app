import {
    TransactionType,
    TransactionCategory,
    TransactionPaymentMethod,
} from '@/generated/prisma/enums'


import { z } from 'zod'


export const createTransactionFormSchema = z.object({
    name: z.string().trim().min(1, 'O nome é obrigatório.'),
    amount: z.coerce
        .number()
        .positive({ message: 'O valor deve ser positivo.' }),
    type: z.nativeEnum(TransactionType, { message: 'O tipo é obrigatório.' }),
    category: z.nativeEnum(TransactionCategory, {
        message: 'A categoria é obrigatória.',
    }),
    paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
        message: 'O método de pagamento é obrigatório.',
    }),
    date: z.coerce.date(),
})

export type CreateTransactionFormData = z.infer<typeof createTransactionFormSchema>
export type AddTransactionParams = CreateTransactionFormData