import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

async function ListaVeiculos() {
  const supabase = await createClient()

  const { data: veiculos, error } = await supabase
    .from('veiculos_com_status')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <p>Erro ao carregar veículos.</p>
  if (veiculos.length === 0) return <p>Nenhum veículo cadastrado.</p>

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Placa</th>
          <th>Veículo</th>
          <th>Ano</th>
          <th>Status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {veiculos.map((v) => (
          <tr key={v.id} className="border-b">
            <td className="py-2 font-mono">{v.placa}</td>
            <td>
              {v.marca} {v.modelo}
            </td>
            <td>{v.ano}</td>
            <td>
              <span
                className={
                  v.status === 'alugado' ? 'text-amber-700' : 'text-green-700'
                }
              >
                {v.status === 'alugado' ? 'Alugado' : 'Disponível'}
              </span>
            </td>
            <td className="text-right">
              <Link href={`/veiculos/${v.id}/editar`} className="underline">
                Editar
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function VeiculosPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Veículos</h1>
        <Link
          href="/veiculos/novo"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Novo veículo
        </Link>
      </div>
      <Suspense fallback={<p>Carregando...</p>}>
        <ListaVeiculos />
      </Suspense>
    </div>
  )
}