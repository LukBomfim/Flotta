'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { EstadoForm } from '@/lib/form'

export function EncerrarForm({
  action,
}: {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>
}) {
  const [estado, formAction, pendente] = useActionState<EstadoForm, FormData>(
    action,
    {}
  )

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {estado.mensagem && (
        <p className="text-sm text-red-600">{estado.mensagem}</p>
      )}

      <div>
        <label htmlFor="data_fim" className="mb-1 block text-sm">
          Data de fim
        </label>
        <input
          id="data_fim"
          name="data_fim"
          type="date"
          required
          defaultValue={estado.valores?.data_fim ?? ''}
          className="w-full rounded border px-3 py-2"
        />
        {estado.erros?.data_fim && (
          <p className="mt-1 text-sm text-red-600">{estado.erros.data_fim}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={pendente}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pendente ? 'Encerrando...' : 'Encerrar locação'}
        </button>
        <Link href="/locacoes" className="text-sm underline">
          Cancelar
        </Link>
      </div>
    </form>
  )
}