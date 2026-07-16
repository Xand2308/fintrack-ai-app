import Image from "next/image";
import Link from "next/link";
import DashboardIcon from "../../assets/figma/sidebar/dashboard-icon.png";
import Logo from "../../assets/figma/sidebar/logo.png";
import LogoutIcon from "../../assets/figma/sidebar/logout-icon.png";
import TransactionsIcon from "../../assets/figma/sidebar/transactions-icon.png";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: DashboardIcon,
    active: true,
  },
  {
    label: "Transações",
    href: "/transactions",
    icon: TransactionsIcon,
    active: false,
  },
] as const;

export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#1e293b] bg-[#0f111a] font-sans">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="size-10 shrink-0 overflow-hidden">
          <Image
            src={Logo}
            alt="FinTrack"
            width={40}
            height={46}
            className="size-full object-contain"
            priority
          />
        </div>
        <h1 className="text-xl font-bold tracking-[-0.5px] text-[#f1f5f9]">
          FinTrack
        </h1>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
              item.active
                ? "bg-[#9333ea] text-white"
                : "text-[#94a3b8] hover:bg-[#1e293b]/50"
            }`}
          >
            <span className="size-5 shrink-0 overflow-hidden">
              <Image
                src={item.icon}
                alt=""
                width={20}
                height={20}
                className="size-full object-contain"
              />
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-[#1e293b] px-6 py-6">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-[#94a3b8] transition-colors hover:bg-[#1e293b]/50"
        >
          <span className="size-5 shrink-0 overflow-hidden">
            <Image
              src={LogoutIcon}
              alt=""
              width={20}
              height={20}
              className="size-full object-contain"
            />
          </span>
          Sair
        </button>
      </div>
    </aside>
  );
};
