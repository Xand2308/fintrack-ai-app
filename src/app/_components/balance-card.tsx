import Image from 'next/image'
import Decorative from '@/assets/decorative-icon.png'
import RevenuesIcon from '@/assets/revenues-icon.png'
import ExpensesIcon from '@/assets/expenses-icon.png'

interface BalanceCardProps {
    balance: number
    revenues: number
    expenses: number
}

export default function BalanceCard({
    balance,
    revenues,
    expenses,
}: BalanceCardProps) {
    return (
        <div className="lg:col-span-2 bg-[#9333EA] p-8 rounded-3xl text-white min-h-60">
            <div className="flex justify-between">
                <div>
                    <p className="text-sm">Saldo total</p>
                    <h3 className="text-5xl font-bold">
                        {balance.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </h3>
                </div>

                <div className="w-15 h-15 bg-white/20 p-3 rounded-2xl flex items-center justify-center">
                    <Image src={Decorative} alt="Decorative"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
                <div>
                    <div className="flex items-center gap-2">
                        <Image
                            src={RevenuesIcon}
                            alt=""
                            width={20}
                            height={20}
                        />
                        <p className="text-xs opacity-80">Receitas</p>
                    </div>

                    <p className="text-xl font-semibold mt-1">
                        {revenues.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </p>
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <Image
                            src={ExpensesIcon}
                            alt=""
                            width={20}
                            height={20}
                        />
                        <p className="text-xs opacity-80">Despesas</p>
                    </div>

                    <p className="text-xl font-semibold mt-1">
                        {expenses.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}
