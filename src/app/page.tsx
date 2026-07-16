import { Sidebar } from "./_components/sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#0f111a]">
      <Sidebar />
      <main className="flex flex-1 items-center justify-center">
        <p className="text-[#94a3b8]">Conteúdo principal</p>
      </main>
    </div>
  );
}
