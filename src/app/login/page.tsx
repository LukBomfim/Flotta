import { Suspense } from 'react'
import { login } from './actions'

type SearchParams = Promise<{ erro?: string }>

async function MensagemErro({ searchParams }: { searchParams: SearchParams }) {
  const { erro } = await searchParams
  if (!erro) return null
  return <p className="text-sm text-red-600">E-mail ou senha inválidos.</p>
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <main className="min-h-screen grid place-items-center p-4">
      <form action={login} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Flotta</h1>

        <Suspense>
          <MensagemErro searchParams={searchParams} />
        </Suspense>

        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          autoComplete="email"
          className="w-full rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          required
          autoComplete="current-password"
          className="w-full rounded border px-3 py-2"
        />
        <button className="w-full rounded bg-black py-2 text-white">
          Entrar
        </button>
      </form>
    </main>
  )
}