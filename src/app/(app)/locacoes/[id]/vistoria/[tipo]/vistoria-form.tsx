'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { EstadoForm } from '@/lib/form'

export function VistoriaForm({
  action,
  inicial,
  voltarPara,
}: {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>
  inicial?: { data: string; km: number }
  voltarPara: string
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
        <label htmlFor="data" className="mb-1 block text-sm">
          Data
        </label>
        <input
          id="data"
          name="data"
          type="date"
          required
          defaultValue={estado.valores?.data ?? inicial?.data ?? ''}
          className="w-full rounded border px-3 py-2"
        />
        {estado.erros?.data && (
          <p className="mt-1 text-sm text-red-600">{estado.erros.data}</p>
        )}
      </div>

      <div>
        <label htmlFor="km" className="mb-1 block text-sm">
          Quilometragem
        </label>
        <input
          id="km"
          name="km"
          type="number"
          min={0}
          required
          defaultValue={estado.valores?.km ?? inicial?.km ?? ''}
          className="w-full rounded border px-3 py-2"
        />
        {estado.erros?.km && (
          <p className="mt-1 text-sm text-red-600">{estado.erros.km}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={pendente}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pendente ? 'Salvando...' : 'Salvar vistoria'}
        </button>
        <Link href={voltarPara} className="text-sm underline">
          Voltar à locação
        </Link>
      </div>
    </form>
  )
}