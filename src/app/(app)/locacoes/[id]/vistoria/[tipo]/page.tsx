import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArquivosSecao } from '@/components/arquivos/arquivos-secao'
import {
  ROTULO_VISTORIA,
  TIPOS_VISTORIA,
  type TipoVistoria,
} from '@/lib/validacao/vistoria'
import { salvarVistoria } from './actions'
import { VistoriaForm } from './vistoria-form'

type Params = Promise<{ id: string; tipo: string }>

async function Conteudo({ params }: { params: Params }) {
  const { id, tipo } = await params
  if (!TIPOS_VISTORIA.includes(tipo as TipoVistoria)) notFound()
  const tipoVistoria = tipo as TipoVistoria

  const supabase = await createClient()

  const { data: locacao } = await supabase
    .from('locacoes')
    .select('id')
    .eq('id', id)
    .maybeSingle()
  if (!locacao) notFound()

  const { data: vistoria } = await supabase
    .from('vistorias')
    .select('id, data, km')
    .eq('locacao_id', id)
    .eq('tipo', tipoVistoria)
    .maybeSingle()

  return (
    <>
      <h1 className="mb-4 text-xl font-semibold">
        {ROTULO_VISTORIA[tipoVistoria]}
      </h1>

      <VistoriaForm
        action={salvarVistoria.bind(null, id, tipoVistoria)}
        inicial={vistoria ?? undefined}
        voltarPara={`/locacoes/${id}`}
      />

      {vistoria ? (
        <Suspense fallback={<p className="mt-10">Carregando arquivos...</p>}>
          <ArquivosSecao entidade="vistoria" entidadeId={vistoria.id} />
        </Suspense>
      ) : (
        <p className="mt-10 text-sm text-gray-600">
          Salve a vistoria para poder anexar fotos e vídeos.
        </p>
      )}
    </>
  )
}

export default function VistoriaPage({ params }: { params: Params }) {
  return (
    <div>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}