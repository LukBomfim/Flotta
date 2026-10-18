import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { encerrarLocacao } from '../../actions'
import { EncerrarForm } from './encerrar-form'

const formatarData = (iso: string) => iso.split('-').reverse().join('/')

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: locacao } = await supabase
    .from('locacoes')
    .select('id, data_inicio, data_fim, veiculos(placa, marca, modelo), locatarios(nome)')
    .eq('id', id)
    .maybeSingle()

  if (!locacao) notFound()
  if (locacao.data_fim) return <p>Esta locação já foi encerrada.</p>

  return (
    <div className="space-y-4">
      <p className="text-sm">
        {locacao.veiculos?.placa} · {locacao.veiculos?.marca}{' '}
        {locacao.veiculos?.modelo} com {locacao.locatarios?.nome}, desde{' '}
        {formatarData(locacao.data_inicio)}.
      </p>
      <EncerrarForm action={encerrarLocacao.bind(null, id)} />
    </div>
  )
}

export default function EncerrarLocacaoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Encerrar locação</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}