"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import DashboardIcon from "@/assets/dashboard-icon.png";
import TransactionsIcon from "@/assets/transactions-icon.png";
import Logo from "@/assets/logo.png";
import { LogoutButton } from "./logout";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: DashboardIcon,
    },
    {
      label: "Transações",
      href: "/transactions",
      icon: TransactionsIcon,
    },
  ];

  return (
    <aside className="w-64 border-r border-[#1d293d] flex flex-col bg-[#0f111a] min-h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/30 flex items-center justify-center">
          <Image src={Logo} alt="FinTrack Logo" width={24} height={24} />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">FinTrack</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={isActive ? "brightness-200" : "opacity-70"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1d293d]">
        <LogoutButton />
      </div>
    </aside>
  );
}

export default Sidebar;
