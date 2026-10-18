'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { errosDoZod, type EstadoForm } from '@/lib/form'
import { vistoriaSchema, type TipoVistoria } from '@/lib/validacao/vistoria'

export async function salvarVistoria(
  locacaoId: string,
  tipo: TipoVistoria,
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = {
    data: String(formData.get('data') ?? ''),
    km: String(formData.get('km') ?? ''),
  }

  if (!z.string().uuid().safeParse(locacaoId).success) {
    return { mensagem: 'Locação inválida.', valores }
  }

  const resultado = vistoriaSchema.safeParse(valores)
  if (!resultado.success) {
    return { erros: errosDoZod(resultado.error), valores }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // A quilometragem da devolução não pode ser menor que a da entrega
  const outroTipo: TipoVistoria = tipo === 'entrega' ? 'devolucao' : 'entrega'
  const { data: outra } = await supabase
    .from('vistorias')
    .select('km')
    .eq('locacao_id', locacaoId)
    .eq('tipo', outroTipo)
    .maybeSingle()

  if (outra) {
    const km = resultado.data.km
    if (tipo === 'devolucao' && km < outra.km) {
      return {
        erros: { km: `Menor que a quilometragem da entrega (${outra.km}).` },
        valores,
      }
    }
    if (tipo === 'entrega' && km > outra.km) {
      return {
        erros: { km: `Maior que a quilometragem da devolução (${outra.km}).` },
        valores,
      }
    }
  }

  const { error } = await supabase.from('vistorias').upsert(
    {
      empresa_id: user.id,
      locacao_id: locacaoId,
      tipo,
      data: resultado.data.data,
      km: resultado.data.km,
    },
    { onConflict: 'locacao_id,tipo' }
  )

  if (error) {
    // 23503 = a locação não existe ou não é da sua empresa
    console.error('ERRO VISTORIA:', error)
    return { mensagem: 'Não foi possível salvar a vistoria.', valores }
  }

  revalidatePath(`/locacoes/${locacaoId}`)
  redirect(`/locacoes/${locacaoId}/vistoria/${tipo}`)
}