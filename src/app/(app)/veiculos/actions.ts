'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { veiculoSchema } from '@/lib/validacao/veiculo'

export type EstadoForm = {
  erros?: Record<string, string>
  mensagem?: string
  valores?: Record<string, string>
}

function lerCampos(formData: FormData) {
  return {
    marca: String(formData.get('marca') ?? ''),
    modelo: String(formData.get('modelo') ?? ''),
    ano: String(formData.get('ano') ?? ''),
    placa: String(formData.get('placa') ?? ''),
    chassi: String(formData.get('chassi') ?? ''),
  }
}

function traduzirErroBanco(error: { code?: string; message: string }) {
  if (error.code === '23505') {
    if (error.message.includes('placa')) {
      return { erros: { placa: 'Já existe um veículo com esta placa.' } }
    }
    if (error.message.includes('chassi')) {
      return { erros: { chassi: 'Já existe um veículo com este chassi.' } }
    }
  }
  console.error('ERRO VEICULO:', error)
  return { mensagem: 'Não foi possível salvar o veículo. Tente novamente.' }
}

export async function criarVeiculo(
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = lerCampos(formData)
  const resultado = veiculoSchema.safeParse(valores)

  if (!resultado.success) {
    const erros: Record<string, string> = {}
    for (const issue of resultado.error.issues) {
      const campo = String(issue.path[0])
      if (!erros[campo]) erros[campo] = issue.message
    }
    return { erros, valores }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('veiculos')
    .insert({ ...resultado.data, empresa_id: user.id })

  if (error) return { ...traduzirErroBanco(error), valores }

  revalidatePath('/veiculos')
  redirect('/veiculos')
}

export async function editarVeiculo(
  id: string,
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = lerCampos(formData)
  const resultado = veiculoSchema.safeParse(valores)

  if (!resultado.success) {
    const erros: Record<string, string> = {}
    for (const issue of resultado.error.issues) {
      const campo = String(issue.path[0])
      if (!erros[campo]) erros[campo] = issue.message
    }
    return { erros, valores }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('veiculos')
    .update(resultado.data)
    .eq('id', id)

  if (error) return { ...traduzirErroBanco(error), valores }

  revalidatePath('/veiculos')
  redirect('/veiculos')
}