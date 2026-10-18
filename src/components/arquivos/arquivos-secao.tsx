import { createClient } from '@/lib/supabase/server'
import { type Entidade } from '@/lib/arquivos'
import { ArquivosPainel } from './arquivos-painel'

const COLUNAS = {
  veiculo: 'veiculo_id',
  locatario: 'locatario_id',
  locacao: 'locacao_id',
  vistoria: 'vistoria_id',
} as const satisfies Record<Entidade, string>

export async function ArquivosSecao({
  entidade,
  entidadeId,
}: {
  entidade: Entidade
  entidadeId: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('arquivos')
    .select('id, categoria, nome_original, tamanho_bytes, data_vencimento')
    .eq(COLUNAS[entidade], entidadeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('ERRO LISTA ARQUIVOS:', error)
    return <p>Erro ao carregar arquivos.</p>
  }

  return (
    <ArquivosPainel
      entidade={entidade}
      entidadeId={entidadeId}
      arquivos={data ?? []}
    />
  )
}
