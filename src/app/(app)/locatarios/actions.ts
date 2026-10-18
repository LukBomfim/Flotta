'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { errosDoZod, type EstadoForm } from '@/lib/form'
import {
  CAMPOS_LOCATARIO,
  locatarioSchema,
} from '@/lib/validacao/locatario'

function lerCampos(formData: FormData): Record<string, string> {
  return Object.fromEntries(
    CAMPOS_LOCATARIO.map((c) => [c, String(formData.get(c) ?? '')])
  )
}

function traduzirErroBanco(error: {
  code?: string
  message: string
}): EstadoForm {
  if (error.code === '23505' && error.message.includes('cpf')) {
    return { erros: { cpf: 'Já existe um locatário com este CPF.' } }
  }
  console.error('ERRO LOCATARIO:', error)
  return { mensagem: 'Não foi possível salvar o locatário. Tente novamente.' }
}

export async function criarLocatario(
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = lerCampos(formData)
  const resultado = locatarioSchema.safeParse(valores)
  if (!resultado.success) {
    return { erros: errosDoZod(resultado.error), valores }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('locatarios')
    .insert({ ...resultado.data, empresa_id: user.id })

  if (error) return { ...traduzirErroBanco(error), valores }

  revalidatePath('/locatarios')
  redirect('/locatarios')
}

export async function editarLocatario(
  id: string,
  _estado: EstadoForm,
  formData: FormData
): Promise<EstadoForm> {
  const valores = lerCampos(formData)
  const resultado = locatarioSchema.safeParse(valores)
  if (!resultado.success) {
    return { erros: errosDoZod(resultado.error), valores }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('locatarios')
    .update(resultado.data)
    .eq('id', id)

  if (error) return { ...traduzirErroBanco(error), valores }

  revalidatePath('/locatarios')
  redirect('/locatarios')
}