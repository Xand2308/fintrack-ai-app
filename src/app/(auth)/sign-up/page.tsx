import Image from 'next/image'
import { AuthLayout } from '../_components/auth-layout'
import { inputClass } from '../_styles/input'
import ArrowIcon from '../../../assets/ArrowIcon.png'

export default function SignUpPage() {
    return (
        <AuthLayout
            title="Criar Conta"
            description="Preencha os dados para começar"
            footerText="Já tem uma conta?"
            footerLinkText="Entrar"
            footerHref="/sign-in"
        >
            
            <form className="space-y-6">

                 <label className="block text-sm text-zinc-300 mb-2">
                    Nome
                </label>
                <input
                    type="text"
                    placeholder="seu nome"
                    className={inputClass}
                />


                <label className="block text-sm text-zinc-300 mb-2">
                    E-mail
                </label>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    className={inputClass}
                    />

                <label className="block text-sm text-zinc-300 mb-2">
                    Senha (min. 8 caracteres)
                </label>
                <input
                    type="password"
                    placeholder="........"
                    className={inputClass}
                />

                <button type="submit" className='w-full bg-[#9333ea] flex items-center justify-center gap-2 font-semibold rounded-2xl py-4 cursor-pointer'>
                    <span>Criar  conta</span>
                    <Image src={ArrowIcon} alt="Icone de seta do botão"/>
                </button>
            </form>
        </AuthLayout>
    )
}
