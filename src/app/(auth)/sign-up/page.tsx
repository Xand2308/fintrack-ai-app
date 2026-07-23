'use client'

import Image from 'next/image'
import { AuthLayout } from '../_components/auth-layout'
import { inputClass } from '../_styles/input'
import ArrowIcon from '../../../assets/ArrowIcon.png'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'

const signUpFormSchema = z.object({
    name: z.string().trim().nonempty('O nome é obrigatório'),
    email: z.string().nonempty('O email é obrigatório.'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
})

type signUpFormData = z.input<typeof signUpFormSchema>

export default function SignUpPage() {
    const [apiError, setApiError] = useState<string>('')

    const router = useRouter()



    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<signUpFormData>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
        mode: 'onBlur',
    })

    const onSubmit = async (data: signUpFormData) => {
        console.log(data)
        try {
            const { data: result, error: err } = await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.password,
                callbackURL: '/',
            })

            if (err) {
                setApiError(
                    err.message ?? 'Error ao criar conta. Tente outro email.'
                )
                return
            }

            if (result) router.push('/')
            reset()
        } catch {
            setApiError('Erro inesperado. Tente novamente.')
        }
    }

    return (
        <AuthLayout
            title="Criar Conta"
            description="Preencha os dados para começar"
            footerText="Já tem uma conta?"
            footerLinkText="Entrar"
            footerHref="/sign-in"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <label className="block text-sm text-zinc-300 mb-2">Nome</label>
                <input
                    type="text"
                    placeholder="seu nome"
                    className={inputClass}
                    {...register('name')}
                />

                {errors.name && (
                    <p className="text-xs text-red-500">
                        {errors.name.message}
                    </p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    E-mail
                </label>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    className={inputClass}
                    {...register('email')}
                />

                {errors.email && (
                    <p className="text-xs text-red-500">
                        {errors.email.message}
                    </p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    Senha (min. 8 caracteres)
                </label>
                <input
                    type="password"
                    placeholder="........"
                    className={inputClass}
                    {...register('password')}
                />
                {errors.password && (
                    <p className="text-xs text-red-500">
                        {errors.password.message}
                    </p>
                )}

                {apiError && <p className="text-sm text-red-500">{apiError}</p>}

                <button
                    type="submit"
                    className="w-full bg-[#9333ea] flex items-center justify-center gap-2 font-semibold rounded-2xl py-4 cursor-pointer disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    <span>{isSubmitting ? 'Criando conta...' : 'Criar conta'}</span>
                    <Image src={ArrowIcon} alt="Icone de seta do botão" />
                </button>
            </form>
        </AuthLayout>
    )
}
