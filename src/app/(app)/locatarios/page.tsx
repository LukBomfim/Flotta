import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const formatarCpf = (cpf: string) =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')

const formatarData = (iso: string) => iso.split('-').reverse().join('/')

async function ListaLocatarios() {
  const supabase = await createClient()

  const { data: locatarios, error } = await supabase
    .from('locatarios')
    .select('id, nome, cpf, telefone, cnh_validade')
    .order('nome')

  if (error) return <p>Erro ao carregar locatários.</p>
  if (locatarios.length === 0) return <p>Nenhum locatário cadastrado.</p>

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Nome</th>
          <th>CPF</th>
          <th>Telefone</th>
          <th>Validade CNH</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {locatarios.map((l) => (
          <tr key={l.id} className="border-b">
            <td className="py-2">{l.nome}</td>
            <td className="font-mono">{formatarCpf(l.cpf)}</td>
            <td>{l.telefone}</td>
            <td>{formatarData(l.cnh_validade)}</td>
            <td className="text-right">
              <Link href={`/locatarios/${l.id}/editar`} className="underline">
                Editar
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function LocatariosPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Locatários</h1>
        <Link
          href="/locatarios/novo"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Novo locatário
        </Link>
      </div>
      <Suspense fallback={<p>Carregando...</p>}>
        <ListaLocatarios />
      </Suspense>
    </div>
  )
}