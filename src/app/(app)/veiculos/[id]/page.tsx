import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArquivosSecao } from '@/components/arquivos/arquivos-secao'
import { formatarData } from '@/lib/arquivos'

type Params = Promise<{ id: string }>

async function Conteudo({ params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: veiculo } = await supabase
    .from('veiculos_com_status')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!veiculo) notFound()

  const { data: historico, error } = await supabase
    .from('locacoes')
    .select('id, data_inicio, data_fim, locatarios(id, nome)')
    .eq('veiculo_id', id)
    .order('data_inicio', { ascending: false })

  if (error) console.error('ERRO HISTORICO VEICULO:', error)

  const alugado = veiculo.status === 'alugado'

  return (
    <div className="space-y-8">
      <section className="space-y-1 text-sm">
        <p className="text-lg">
          <span className="font-mono">{veiculo.placa}</span> · {veiculo.marca}{' '}
          {veiculo.modelo}
        </p>
        <p>Ano: {veiculo.ano}</p>
        <p>
          Chassi: <span className="font-mono">{veiculo.chassi}</span>
        </p>
        <p>
          Status:{' '}
          <span className={alugado ? 'text-amber-700' : 'text-green-700'}>
            {alugado ? 'Alugado' : 'Disponível'}
          </span>
        </p>
        <div className="flex items-center gap-4 pt-2">
            <Link href={`/veiculos/${id}/editar`} className="underline">
                Editar dados
            </Link>
            {!alugado && (
                <Link
                href={`/locacoes/nova?veiculo=${id}`}
                className="rounded bg-black px-3 py-1.5 text-white"
                >
                Nova locação
                </Link>
            )}
        </div>
      </section>

      <section className="max-w-2xl space-y-3">
        <h2 className="text-lg font-semibold">Histórico de locatários</h2>

        {!historico || historico.length === 0 ? (
          <p className="text-sm">Este veículo ainda não foi alugado.</p>
        ) : (
          <ul className="divide-y rounded border text-sm">
            {historico.map((l) => {
              const ativa = !l.data_fim
              return (
                <li
                  key={l.id}
                  className={`flex items-center gap-4 px-4 py-3 ${
                    ativa ? 'bg-amber-50' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {l.locatarios?.nome}
                      {ativa && (
                        <span className="ml-2 rounded bg-amber-200 px-2 py-0.5 text-xs">
                          Atual
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatarData(l.data_inicio)} até{' '}
                      {l.data_fim ? formatarData(l.data_fim) : 'em andamento'}
                    </p>
                  </div>
                  <Link href={`/locacoes/${l.id}`} className="underline">
                    Detalhes
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <Suspense fallback={<p>Carregando arquivos...</p>}>
        <ArquivosSecao entidade="veiculo" entidadeId={id} />
      </Suspense>
    </div>
  )
}

export default function VeiculoPage({ params }: { params: Params }) {
  return (
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}