import DolarIcon from "../../../assets/DolarIcon.png"
import Image from 'next/image'
import Link from 'next/link'

interface AuthLayuotProps {
    title: string
    description: string
    children: React.ReactNode
    footerText: string
    footerLinkText: string
    footerHref: string
}

export const AuthLayout = ({
    children,
    description,
    title,
    footerHref,
    footerLinkText,
    footerText,
}: AuthLayuotProps) => {
    return (
        <section className="h-screen flex items-center justify-center p-10">
            <div className="bg-[#181818] w-full max-w-md p-8 rounded-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#9333ea] h-16 w-16 flex items-center justify-center rounded-2xl mb-6">
                        <Image src={DolarIcon} alt="Icone da página de autenticação "/>
                    </div>
                    <h1 className="text-2xl font-bold tex-white mb-2">
                        {title}
                    </h1>
                    <p className="text-[#9f9fa9] text-sm">{description}</p>
                </div>

                {children}

                <div className='mt-10 text-center'>
                    <p className='text-sm text-[#9f9fa9]'>
                        {footerText}

                        <Link href={footerHref} className='ml-1 text-[#9333ea] font-semibold hover:underline'>
                        {footerLinkText}

                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
