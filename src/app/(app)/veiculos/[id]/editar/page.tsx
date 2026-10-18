import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { editarVeiculo } from '../../actions'
import { VeiculoForm } from '../../veiculo-form'

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: veiculo } = await supabase
    .from('veiculos')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!veiculo) notFound()

  return (
    <VeiculoForm
      action={editarVeiculo.bind(null, id)}
      inicial={veiculo}
      rotuloBotao="Salvar alterações"
    />
  )
}

export default function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Editar veículo</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}