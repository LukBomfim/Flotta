import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArquivosSecao } from '@/components/arquivos/arquivos-secao'
import { formatarData } from '@/lib/arquivos'
import {
  ROTULO_VISTORIA,
  TIPOS_VISTORIA,
} from '@/lib/validacao/vistoria'

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: locacao } = await supabase
    .from('locacoes')
    .select(
      'id, data_inicio, data_fim, veiculos(placa, marca, modelo), locatarios(nome)'
    )
    .eq('id', id)
    .maybeSingle()

  if (!locacao) notFound()

  const { data: vistorias } = await supabase
    .from('vistorias')
    .select('tipo, data, km')
    .eq('locacao_id', id)

  const porTipo = new Map((vistorias ?? []).map((v) => [v.tipo, v]))

  return (
    <div className="space-y-8">
      <section className="space-y-1 text-sm">
        <p>
          <span className="font-mono">{locacao.veiculos?.placa}</span>{' '}
          {locacao.veiculos?.marca} {locacao.veiculos?.modelo}
        </p>
        <p>Locatário: {locacao.locatarios?.nome}</p>
        <p>
          Período: {formatarData(locacao.data_inicio)} até{' '}
          {locacao.data_fim ? (
            formatarData(locacao.data_fim)
          ) : (
            <span className="text-amber-700">locação ativa</span>
          )}
        </p>
        {!locacao.data_fim && (
          <Link href={`/locacoes/${id}/encerrar`} className="underline">
            Encerrar locação
          </Link>
        )}
      </section>

      <section className="max-w-2xl space-y-3">
        <h2 className="text-lg font-semibold">Vistorias</h2>
        <ul className="divide-y rounded border text-sm">
          {TIPOS_VISTORIA.map((tipo) => {
            const v = porTipo.get(tipo)
            return (
              <li key={tipo} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <p className="font-medium">{ROTULO_VISTORIA[tipo]}</p>
                  <p className="text-xs text-gray-600">
                    {v
                      ? `${formatarData(v.data)} · ${v.km.toLocaleString('pt-BR')} km`
                      : 'Não registrada'}
                  </p>
                </div>
                <Link
                  href={`/locacoes/${id}/vistoria/${tipo}`}
                  className="underline"
                >
                  {v ? 'Abrir' : 'Registrar'}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <Suspense fallback={<p>Carregando contrato...</p>}>
        <ArquivosSecao entidade="locacao" entidadeId={id} />
      </Suspense>
    </div>
  )
}

export default function LocacaoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Locação</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}