import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { editarLocatario } from '../../actions'
import { LocatarioForm } from '../../locatario-form'

async function Conteudo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: locatario } = await supabase
    .from('locatarios')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!locatario) notFound()

  return (
    <LocatarioForm
      action={editarLocatario.bind(null, id)}
      inicial={locatario}
      rotuloBotao="Salvar alterações"
    />
  )
}

export default function EditarLocatarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Editar locatário</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo params={params} />
      </Suspense>
    </div>
  )
}