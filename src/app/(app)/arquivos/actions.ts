'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import {
  apagarObjeto,
  metadadosDoObjeto,
  urlParaDownload,
  urlParaUpload,
} from '@/lib/r2'
import { ENTIDADES, limitePorTipo } from '@/lib/arquivos'

type Resultado<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; erro: string }

const entidadeEnum = z.enum(['veiculo', 'locatario', 'locacao', 'vistoria'])

async function usuarioAtual() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

function nomeSeguro(nome: string) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(-100)
}

// ---------------------------------------------------------------
// 1) Gera a URL pré-assinada
// ---------------------------------------------------------------
const solicitarSchema = z.object({
  entidade: entidadeEnum,
  entidadeId: z.string().uuid(),
  nome: z.string().min(1).max(255),
  mime: z.string(),
  tamanho: z.number().int().positive(),
})

export async function solicitarUpload(
  entrada: z.input<typeof solicitarSchema>
): Promise<Resultado<{ url: string; caminho: string }>> {
  const parsed = solicitarSchema.safeParse(entrada)
  if (!parsed.success) return { ok: false, erro: 'Dados do arquivo inválidos.' }
  const { entidade, entidadeId, nome, mime, tamanho } = parsed.data

  const limite = limitePorTipo(mime)
  if (limite === null) {
    return { ok: false, erro: 'Formato não permitido (jpg, png, webp, pdf, mp4, mov).' }
  }
  if (tamanho > limite) {
    return {
      ok: false,
      erro: `Arquivo acima do limite de ${limite / (1024 * 1024)} MB para este formato.`,
    }
  }

  const { user } = await usuarioAtual()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre novamente.' }

  const caminho = `${user.id}/${ENTIDADES[entidade].pasta}/${entidadeId}/${crypto.randomUUID()}-${nomeSeguro(nome)}`

  try {
    const url = await urlParaUpload(caminho, mime, tamanho)
    return { ok: true, url, caminho }
  } catch (e) {
    console.error('ERRO PRESIGN UPLOAD:', e)
    return { ok: false, erro: 'Não foi possível preparar o envio.' }
  }
}

// ---------------------------------------------------------------
// 2) Registra o arquivo depois que o navegador enviou ao R2
// ---------------------------------------------------------------
const registrarSchema = z.object({
  entidade: entidadeEnum,
  entidadeId: z.string().uuid(),
  caminho: z.string().min(1),
  categoria: z.string().trim().min(1).max(50),
  nome: z.string().min(1).max(255),
  vencimento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal(''))
    .transform((v) => (v === '' ? null : v)),
})

export async function registrarArquivo(
  entrada: z.input<typeof registrarSchema>
): Promise<Resultado> {
  const parsed = registrarSchema.safeParse(entrada)
  if (!parsed.success) return { ok: false, erro: 'Dados do arquivo inválidos.' }
  const { entidade, entidadeId, caminho, categoria, nome, vencimento } =
    parsed.data

  const { supabase, user } = await usuarioAtual()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre novamente.' }

  // O caminho precisa pertencer à empresa e à entidade informadas
  const prefixo = `${user.id}/${ENTIDADES[entidade].pasta}/${entidadeId}/`
  if (!caminho.startsWith(prefixo) || caminho.includes('..')) {
    return { ok: false, erro: 'Caminho de arquivo inválido.' }
  }

  // Confere no R2 o que realmente foi enviado (não confia no cliente)
  const meta = await metadadosDoObjeto(caminho)
  if (!meta) return { ok: false, erro: 'O arquivo não chegou ao armazenamento.' }

  const limite = limitePorTipo(meta.mime)
  if (limite === null || meta.tamanho <= 0 || meta.tamanho > limite) {
    await apagarObjeto(caminho).catch(() => {})
    return { ok: false, erro: 'Arquivo fora das regras de formato ou tamanho.' }
  }

  const { error } = await supabase.from('arquivos').insert({
    empresa_id: user.id,
    veiculo_id: entidade === 'veiculo' ? entidadeId : null,
    locatario_id: entidade === 'locatario' ? entidadeId : null,
    locacao_id: entidade === 'locacao' ? entidadeId : null,
    vistoria_id: entidade === 'vistoria' ? entidadeId : null,
    categoria,
    nome_original: nome,
    caminho_r2: caminho,
    mime_type: meta.mime,
    tamanho_bytes: meta.tamanho,
    data_vencimento: vencimento,
  })

  if (error) {
    console.error('ERRO REGISTRAR ARQUIVO:', error)
    await apagarObjeto(caminho).catch(() => {}) // evita objeto órfão
    return { ok: false, erro: 'Não foi possível registrar o arquivo.' }
  }

  return { ok: true }
}

// ---------------------------------------------------------------
// 3) Abrir (URL assinada de leitura)
// ---------------------------------------------------------------
export async function urlDownloadArquivo(
  id: string
): Promise<Resultado<{ url: string }>> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, erro: 'Arquivo inválido.' }
  }
  const { supabase, user } = await usuarioAtual()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre novamente.' }

  // A RLS garante que só arquivos da própria empresa são encontrados
  const { data } = await supabase
    .from('arquivos')
    .select('caminho_r2, nome_original')
    .eq('id', id)
    .maybeSingle()
  if (!data) return { ok: false, erro: 'Arquivo não encontrado.' }

  const url = await urlParaDownload(data.caminho_r2, data.nome_original)
  return { ok: true, url }
}

// ---------------------------------------------------------------
// 4) Excluir
// ---------------------------------------------------------------
export async function excluirArquivo(id: string): Promise<Resultado> {
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, erro: 'Arquivo inválido.' }
  }
  const { supabase, user } = await usuarioAtual()
  if (!user) return { ok: false, erro: 'Sessão expirada. Entre novamente.' }

  const { data } = await supabase
    .from('arquivos')
    .select('caminho_r2')
    .eq('id', id)
    .maybeSingle()
  if (!data) return { ok: false, erro: 'Arquivo não encontrado.' }

  const { error } = await supabase.from('arquivos').delete().eq('id', id)
  if (error) {
    console.error('ERRO EXCLUIR ARQUIVO:', error)
    return { ok: false, erro: 'Não foi possível excluir o arquivo.' }
  }

  // Banco primeiro: se o R2 falhar, sobra só um objeto privado sem registro
  await apagarObjeto(data.caminho_r2).catch((e) =>
    console.error('OBJETO ORFAO NO R2:', data.caminho_r2, e)
  )
  return { ok: true }
}