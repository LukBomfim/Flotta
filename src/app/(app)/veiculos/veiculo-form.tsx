'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { EstadoForm } from './actions'

type Props = {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>
  inicial?: {
    marca: string
    modelo: string
    ano: number | string
    placa: string
    chassi: string
  }
  rotuloBotao: string
}

const campos = [
  { name: 'marca', label: 'Marca', type: 'text' },
  { name: 'modelo', label: 'Modelo', type: 'text' },
  { name: 'ano', label: 'Ano', type: 'number' },
  { name: 'placa', label: 'Placa', type: 'text' },
  { name: 'chassi', label: 'Chassi', type: 'text' },
] as const

export function VeiculoForm({ action, inicial, rotuloBotao }: Props) {
  const [estado, formAction, pendente] = useActionState<EstadoForm, FormData>(
    action,
    {}
  )

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {estado.mensagem && (
        <p className="text-sm text-red-600">{estado.mensagem}</p>
      )}

      {campos.map(({ name, label, type }) => (
        <div key={name}>
          <label htmlFor={name} className="mb-1 block text-sm font-medium">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            required
            defaultValue={
              estado.valores?.[name] ?? inicial?.[name as keyof typeof inicial] ?? ''
            }
            className="w-full rounded border px-3 py-2"
          />
          {estado.erros?.[name] && (
            <p className="mt-1 text-sm text-red-600">{estado.erros[name]}</p>
          )}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          disabled={pendente}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pendente ? 'Salvando...' : rotuloBotao}
        </button>
        <Link href="/veiculos" className="text-sm underline">
          Cancelar
        </Link>
      </div>
    </form>
  )
}