'use client'
import { Resolver } from 'react-hook-form'
import { useState } from 'react'
import Image from 'next/image'

import PlusIcon from '@/assets/plus-icon.png'
import ConfirmIcon from '@/assets/confirm-icon.png'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/app/_components/ui/dialog'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    TRANSACTION_TYPE_OPTIONS,
    TRANSACTION_CATEGORY_OPTIONS,
    TRANSACTION_PAYMENT_METHOD_OPTIONS,
} from '@/app/_constants/transaction'

import {
    createTransactionFormSchema,
    type CreateTransactionFormData,
} from '../_schemas/transaction'
import { addTransaction } from '../_actions/add-transaction'

export const AddTransactionButton = () => {
    const [open, setIsOpen] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CreateTransactionFormData>({
        resolver: zodResolver(
            createTransactionFormSchema
        ) as unknown as Resolver<CreateTransactionFormData>,
        defaultValues: {
            name: '',
            amount: 0,
            type: undefined,
            category: undefined,
            paymentMethod: undefined,
            date: undefined,
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: CreateTransactionFormData) => {
        try {
            console.log(data)
            await addTransaction(data)
            reset()
            setIsOpen(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <section>
                    <button
                        type="button"
                        className="rounded-sm bg-[#9332ef] px-5 py-2.5 text-sm font-semibold text-white shadow-emerald-600/20 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <Image src={PlusIcon} alt="Plus Icon" />
                        <p>Adicionar</p>
                    </button>
                </section>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nova transação</DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    <div className="space-y-2">
                        <label>Titulo</label>

                        <input
                            id="Name"
                            placeholder="Ex: Almoço, Freela..."
                            {...register('name')}
                            className="border rounded-lg p-2"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Valor(R$)</label>

                        <input
                            id="amount"
                            type="number"
                            placeholder="0,00"
                            {...register('amount', { valueAsNumber: true })}
                            className="border rounded-lg p-2"
                        />
                        {errors.amount && (
                            <p className="text-red-500 text-xs">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Tipo</label>

                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {TRANSACTION_TYPE_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={String(option.value)}
                                                    value={String(option.value)}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type && (
                            <p className="text-red-500 text-xs">
                                {errors.type.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Categoria</label>

                        <Controller
                            control={control}
                            name="category"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione a categoria" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {TRANSACTION_CATEGORY_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category && (
                            <p className="text-red-500 text-xs">
                                {errors.category.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Método de pagamento</label>

                        <Controller
                            control={control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione o metodo de pagamento" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {TRANSACTION_PAYMENT_METHOD_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.paymentMethod && (
                            <p className="text-red-500 text-xs">
                                {errors.paymentMethod.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label>Data</label>

                        <input
                            type="date"
                            id="Date"
                            placeholder="__/__/__ "
                            {...register('date')}
                            className="border rounded-lg p-2"
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs">
                                {errors.date.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="gap-4 border-none">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="border border-[#cad5e2] rounded-lg w-1/3 py-2.5 cursor-pointer text-zinc-300"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="bg-[#8e51ff] w-2/3 flex items-center justify-center gap-2 rounded-xl cursor-pointer text-white"
                            disabled={isSubmitting}
                        >
                            <Image src={ConfirmIcon} alt="Confirm Icon" />

                            <p className="font-semibold text-sm">
                                {isSubmitting
                                    ? 'Salvando...'
                                    : 'Salvar Transação'}
                            </p>
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
