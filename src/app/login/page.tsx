import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>
}) {
  const { erro } = await searchParams

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <form action={login} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Flotta</h1>

        {erro && (
          <p className="text-sm text-red-600">E-mail ou senha inválidos.</p>
        )}

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