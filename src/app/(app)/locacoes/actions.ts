'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { errosDoZod, type EstadoForm } from '@/lib/form'
import {
  iniciarLocacaoSchema,
  encerrarLocacaoSchema,
} from '@/lib/validacao/locacao'

function traduzirErroBanco(error: {
  code?: string
  message: string
}): EstadoForm {
  if (error.code === '23505') {
    if (error.message.includes('uq_locacao_ativa_veiculo')) {
      return { erros: { veiculo_id: 'Este veículo já está alugado.' } }
    }
    if (error.message.includes('uq_locacao_ativa_locatario')) {
      return {
        erros: { locatario_id: 'Este locatário já tem uma locação ativa.' },
      }
    }
  }
  if (error.code === '23514') {
    return { erros: { data_fim: 'A data de fim não pode ser anterior ao início.' } }
  }
  console.error('ERRO LOCACAO:', error)
  return { mensagem: 'Não foi possível salvar a locação. Tente novamente.' }
}

export async function iniciarLocacao(
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = {
    veiculo_id: String(formData.get('veiculo_id') ?? ''),
    locatario_id: String(formData.get('locatario_id') ?? ''),
    data_inicio: String(formData.get('data_inicio') ?? ''),
  }
  const resultado = iniciarLocacaoSchema.safeParse(valores)
  if (!resultado.success) {
    return { erros: errosDoZod(resultado.error), valores }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('locacoes')
    .insert({ ...resultado.data, empresa_id: user.id })

  if (error) return { ...traduzirErroBanco(error), valores }

  revalidatePath('/locacoes')
  revalidatePath('/veiculos')
  redirect('/locacoes')
}

export async function encerrarLocacao(
  id: string,
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = { data_fim: String(formData.get('data_fim') ?? '') }
  const resultado = encerrarLocacaoSchema.safeParse(valores)
  if (!resultado.success) {
    return { erros: errosDoZod(resultado.error), valores }
  }

  const supabase = await createClient()
  const { data: atualizada, error } = await supabase
    .from('locacoes')
    .update({ data_fim: resultado.data.data_fim })
    .eq('id', id)
    .is('data_fim', null) // só encerra locação ainda ativa
    .select('id')

  if (error) return { ...traduzirErroBanco(error), valores }
  if (!atualizada || atualizada.length === 0) {
    return { mensagem: 'Locação não encontrada ou já encerrada.', valores }
  }

  revalidatePath('/locacoes')
  revalidatePath('/veiculos')
  redirect('/locacoes')
}