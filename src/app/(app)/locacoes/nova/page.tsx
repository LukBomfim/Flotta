import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { LocacaoForm } from '../locacao-form'

type SearchParams = Promise<{ veiculo?: string }>

async function Conteudo({ searchParams }: { searchParams: SearchParams }) {
  const { veiculo: veiculoInicial } = await searchParams
  const supabase = await createClient()

  const [veiculosRes, locatariosRes, ativasRes] = await Promise.all([
    supabase
      .from('veiculos_com_status')
      .select('id, placa, marca, modelo')
      .eq('status', 'disponivel')
      .order('placa'),
    supabase.from('locatarios').select('id, nome, cpf').order('nome'),
    supabase.from('locacoes').select('locatario_id').is('data_fim', null),
  ])

  if (veiculosRes.error || locatariosRes.error || ativasRes.error) {
    return <p>Erro ao carregar os dados.</p>
  }

  const ocupados = new Set((ativasRes.data ?? []).map((a) => a.locatario_id))

  const veiculos = (veiculosRes.data ?? [])
    .filter((v) => v.id)
    .map((v) => ({
      id: v.id as string,
      rotulo: `${v.placa} · ${v.marca} ${v.modelo}`,
    }))

  const locatarios = (locatariosRes.data ?? [])
    .filter((l) => !ocupados.has(l.id))
    .map((l) => ({ id: l.id, rotulo: l.nome }))

  if (veiculos.length === 0) return <p>Nenhum veículo disponível.</p>
  if (locatarios.length === 0) return <p>Nenhum locatário livre.</p>

  return (
    <LocacaoForm
      veiculos={veiculos}
      locatarios={locatarios}
      veiculoInicial={veiculoInicial}
    />
  )
}

export default function NovaLocacaoPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Nova locação</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <Conteudo searchParams={searchParams} />
      </Suspense>
    </div>
  )
}