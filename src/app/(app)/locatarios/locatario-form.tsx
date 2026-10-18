'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import type { EstadoForm } from '@/lib/form'
import { CATEGORIAS_CNH } from '@/lib/validacao/locatario'

type Valores = Partial<Record<string, string | null>>

type Campo = {
  name: string
  label: string
  type?: 'text' | 'email' | 'date' | 'tel' | 'select'
  obrigatorio?: boolean
}

const secoes: { titulo: string; campos: Campo[] }[] = [
  {
    titulo: 'Dados pessoais',
    campos: [
      { name: 'nome', label: 'Nome completo', obrigatorio: true },
      { name: 'cpf', label: 'CPF', obrigatorio: true },
      { name: 'telefone', label: 'Telefone', type: 'tel', obrigatorio: true },
      { name: 'email', label: 'E-mail', type: 'email' },
      { name: 'endereco', label: 'Endereço' },
    ],
  },
  {
    titulo: 'CNH',
    campos: [
      { name: 'cnh_numero', label: 'Número da CNH', obrigatorio: true },
      {
        name: 'cnh_categoria',
        label: 'Categoria',
        type: 'select',
        obrigatorio: true,
      },
      {
        name: 'cnh_validade',
        label: 'Validade',
        type: 'date',
        obrigatorio: true,
      },
    ],
  },
  {
    titulo: 'Contato de emergência',
    campos: [
      { name: 'emergencia_nome', label: 'Nome', obrigatorio: true },
      {
        name: 'emergencia_telefone',
        label: 'Telefone',
        type: 'tel',
        obrigatorio: true,
      },
      { name: 'emergencia_parentesco', label: 'Parentesco', obrigatorio: true },
    ],
  },
]

type Props = {
  action: (estado: EstadoForm, formData: FormData) => Promise<EstadoForm>
  inicial?: Valores
  rotuloBotao: string
}

export function LocatarioForm({ action, inicial, rotuloBotao }: Props) {
  const [estado, formAction, pendente] = useActionState<EstadoForm, FormData>(
    action,
    {}
  )

  return (
    <form action={formAction} className="max-w-md space-y-6">
      {estado.mensagem && (
        <p className="text-sm text-red-600">{estado.mensagem}</p>
      )}

      {secoes.map((secao) => (
        <fieldset key={secao.titulo} className="space-y-4">
          <legend className="mb-2 font-medium">{secao.titulo}</legend>

          {secao.campos.map(({ name, label, type = 'text', obrigatorio }) => {
            const valor = estado.valores?.[name] ?? inicial?.[name] ?? ''
            return (
              <div key={name}>
                <label htmlFor={name} className="mb-1 block text-sm">
                  {label}
                </label>

                {type === 'select' ? (
                  <select
                    id={name}
                    name={name}
                    required={obrigatorio}
                    defaultValue={valor}
                    className="w-full rounded border px-3 py-2"
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {CATEGORIAS_CNH.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={type}
                    required={obrigatorio}
                    defaultValue={valor}
                    className="w-full rounded border px-3 py-2"
                  />
                )}

                {estado.erros?.[name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {estado.erros[name]}
                  </p>
                )}
              </div>
            )
          })}
        </fieldset>
      ))}

      <div className="flex items-center gap-4">
        <button
          disabled={pendente}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {pendente ? 'Salvando...' : rotuloBotao}
        </button>
        <Link href="/locatarios" className="text-sm underline">
          Cancelar
        </Link>
      </div>
    </form>
  )
}