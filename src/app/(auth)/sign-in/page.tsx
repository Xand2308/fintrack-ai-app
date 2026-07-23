'use client'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '../_components/auth-layout'
import ArrowIcon from '../../../assets/ArrowIcon.png'
import Image from 'next/image'
import z from 'zod'
import { inputClass } from '../_styles/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

const signInFormSchema = z.object({
    email: z
        .string()
        .min(1, 'Email é obrigatótio ')
        .regex(z.regexes.email, 'Informe um email válido.'),
    password: z.string().min(8, 'A senha tem que ter no mínimo 8 caracteres.'),
})

type SignInFormData = z.infer<typeof signInFormSchema>

export default function SignInPage() {
    const [apiError, setApiError] = useState<string>('')

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: undefined,
        },
        mode: 'onBlur',
    })

    const router = useRouter()

    const onSubmit = async (data: SignInFormData) => {
        console.log(data)
        try {
            const { data: result, error: err } = await authClient.signIn.email({
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
            title="Bem-vindo de volta"
            description="Entre com suas credenciais para continuar"
            footerText="Não tem uma conta?"
            footerLinkText="Criar conta"
            footerHref="/sign-up"
        >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                )}

                <label className="block text-sm text-zinc-300 mb-2">
                    Senha
                </label>
                <input
                    type="password"
                    placeholder="........"
                    className={inputClass}
                    {...register('password')}
                />

                {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                )}

                {apiError && <p className="text-sm text-red-500">{apiError}</p>}

                <button
                    type="submit"
                    className="w-full bg-[#9333ea] flex items-center justify-center gap-2 font-semibold rounded-2xl py-4 cursor-pointer disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
                    <Image src={ArrowIcon} alt="Icone de seta do botão" />
                </button>
            </form>
        </AuthLayout>
    )
}
