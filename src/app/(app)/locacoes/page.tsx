import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

const formatarData = (iso: string) => iso.split('-').reverse().join('/')

async function ListaLocacoes() {
  const supabase = await createClient()

  const { data: locacoes, error } = await supabase
    .from('locacoes')
    .select(
      'id, data_inicio, data_fim, veiculos(placa, marca, modelo), locatarios(nome)'
    )
    .order('data_inicio', { ascending: false })

  if (error) {
    console.error('ERRO LISTA LOCACOES:', error)
    return <p>Erro ao carregar locações.</p>
  }
  if (locacoes.length === 0) return <p>Nenhuma locação registrada.</p>

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2">Veículo</th>
          <th>Locatário</th>
          <th>Início</th>
          <th>Fim</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {locacoes.map((l) => (
          <tr key={l.id} className="border-b">
            <td className="py-2">
              <span className="font-mono">{l.veiculos?.placa}</span>{' '}
              {l.veiculos?.marca} {l.veiculos?.modelo}
            </td>
            <td>{l.locatarios?.nome}</td>
            <td>{formatarData(l.data_inicio)}</td>
            <td>
              {l.data_fim ? (
                formatarData(l.data_fim)
              ) : (
                <span className="text-amber-700">Ativa</span>
              )}
            </td>
            <td className="text-right">
              {!l.data_fim && (
                <Link href={`/locacoes/${l.id}/encerrar`} className="underline">
                  Encerrar
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function LocacoesPage() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Locações</h1>
        <Link
          href="/locacoes/nova"
          className="rounded bg-black px-4 py-2 text-sm text-white"
        >
          Nova locação
        </Link>
      </div>
      <Suspense fallback={<p>Carregando...</p>}>
        <ListaLocacoes />
      </Suspense>
    </div>
  )
}