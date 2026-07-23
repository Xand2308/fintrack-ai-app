'use client'

import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import LogoutIcon from '@/assets/logout-icon.png'

export const Logout = () => {
    const router = useRouter()

    async function handleLogout() {
        await authClient.signOut()
        router.push('/sign-in')
    }

    return (
        <button
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all duration-200 text-sm font-medium"
            onClick={handleLogout}
        >
            <Image src={LogoutIcon} alt="Sair" width={20} height={20} className="opacity-70" />
            <span>Sair</span>
        </button>
    )
}

export const LogoutButton = Logout
export default Logout
