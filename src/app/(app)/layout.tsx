import Link from 'next/link'
import { logout } from '@/app/login/actions'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center gap-6 border-b px-6 py-3">
        <strong>Flotta</strong>
        <nav className="flex gap-4 text-sm">
          <Link href="/veiculos">Veículos</Link>
          <Link href="/locatarios">Locatários</Link>
          <Link href="/locacoes">Locações</Link>
        </nav>
        <form action={logout} className="ml-auto">
          <button className="text-sm underline">Sair</button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}