'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { iniciarLocacao } from './actions'
import type { EstadoForm } from '@/lib/form'

type Opcao = { id: string; rotulo: string }

export function LocacaoForm({
  veiculos,
  locatarios,
}: {
  veiculos: Opcao[]
  locatarios: Opcao[]
}) {
  const [estado, formAction, pendente] = useActionState<EstadoForm, FormData>(
    iniciarLocacao,
    {}
  )

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {estado.mensagem && (
        <p className="text-sm text-red-600">{estado.mensagem}</p>
      )}

      <div>
        <label htmlFor="veiculo_id" className="mb-1 block text-sm">
          Veículo (disponíveis)
        </label>
        <select
          id="veiculo_id"
          name="veiculo_id"
          required
          defaultValue={estado.valores?.veiculo_id ?? ''}
          className="w-full rounded border px-3 py-2"
        >
          <option value="" disabled>
            Selecione
          </option>
          {veiculos.map((v) => (
            <option key={v.id} value={v.id}>
              {v.rotulo}
            </option>
          ))}
        </select>
        {estado.erros?.veiculo_id && (
          <p className="mt-1 text-sm text-red-600">{estado.erros.veiculo_id}</p>
        )}
      </div>

      <div>
        <label htmlFor="locatario_id" className="mb-1 block text-sm">
          Locatário (sem locação ativa)
        </label>
        <select
          id="locatario_id"
          name="locatario_id"
          required
          defaultValue={estado.valores?.locatario_id ?? ''}
          className="w-full rounded border px-3 py-2"
        >
          <option value="" disabled>
            Selecione
          </option>
          {locatarios.map((l) => (
            <option key={l.id} value={l.id}>
              {l.rotulo}
            </option>
          ))}
        </select>
        {estado.erros?.locatario_id && (
          <p className="mt-1 text-sm text-red-600">
            {estado.erros.locatario_id}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="data_inicio" className="mb-1 block text-sm">
          Data de início
        </label>
        <input
          id="data_inicio"
          name="data_inicio"
          type="date"
          required
          defaultValue={estado.valores?.data_inicio ?? ''}
          className="w-full rounded border px-3 py-2"
        />
        {estado.erros?.data_inicio && (
          <p className="mt-1 text-sm text-red-600">{estado.erros.data_inicio}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          disabled={pendente}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pendente ? 'Salvando...' : 'Iniciar locação'}
        </button>
        <Link href="/locacoes" className="text-sm underline">
          Cancelar
        </Link>
      </div>
    </form>
  )
}