'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  solicitarUpload,
  registrarArquivo,
  urlDownloadArquivo,
  excluirArquivo,
} from '@/app/(app)/arquivos/actions'
import {
  ACCEPT,
  CATEGORIAS,
  formatarData,
  formatarTamanho,
  type Entidade,
} from '@/lib/arquivos'

export type ArquivoItem = {
  id: string
  categoria: string
  nome_original: string
  tamanho_bytes: number
  data_vencimento: string | null
}

export function ArquivosPainel({
  entidade,
  entidadeId,
  arquivos,
}: {
  entidade: Entidade
  entidadeId: string
  arquivos: ArquivoItem[]
}) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const categorias = CATEGORIAS[entidade]
  const rotulo = (valor: string) =>
    categorias.find((c) => c.valor === valor)?.rotulo ?? valor

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const dados = new FormData(e.currentTarget)
    const arquivo = dados.get('arquivo')
    if (!(arquivo instanceof File) || arquivo.size === 0) {
      setErro('Selecione um arquivo.')
      return
    }

    setErro(null)
    setEnviando(true)
    try {
      const sol = await solicitarUpload({
        entidade,
        entidadeId,
        nome: arquivo.name,
        mime: arquivo.type,
        tamanho: arquivo.size,
      })
      if (!sol.ok) throw new Error(sol.erro)

      const put = await fetch(sol.url, {
        method: 'PUT',
        body: arquivo,
        headers: { 'Content-Type': arquivo.type },
      })
      if (!put.ok) throw new Error('Falha no envio do arquivo.')

      const reg = await registrarArquivo({
        entidade,
        entidadeId,
        caminho: sol.caminho,
        categoria: String(dados.get('categoria') ?? ''),
        nome: arquivo.name,
        vencimento: String(dados.get('vencimento') ?? ''),
      })
      if (!reg.ok) throw new Error(reg.erro)

      formRef.current?.reset()
      router.refresh()
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar o arquivo.')
    } finally {
      setEnviando(false)
    }
  }

  async function abrir(id: string) {
    // abre a aba antes do await para o navegador não bloquear o pop-up
    const janela = window.open('', '_blank')
    const r = await urlDownloadArquivo(id)
    if (!r.ok) {
      janela?.close()
      setErro(r.erro)
      return
    }
    if (janela) janela.location.href = r.url
    else window.location.assign(r.url)
  }

  async function excluir(id: string, nome: string) {
    if (!window.confirm(`Excluir "${nome}"?`)) return
    const r = await excluirArquivo(id)
    if (!r.ok) {
      setErro(r.erro)
      return
    }
    router.refresh()
  }

  return (
    <section className="mt-10 max-w-2xl space-y-4">
      <h2 className="text-lg font-semibold">Arquivos</h2>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <form
        ref={formRef}
        onSubmit={enviar}
        className="grid gap-3 rounded border p-4 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="categoria" className="mb-1 block text-sm">
            Tipo
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            className="w-full rounded border px-3 py-2"
          >
            {categorias.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="vencimento" className="mb-1 block text-sm">
            Vencimento (opcional)
          </label>
          <input
            id="vencimento"
            name="vencimento"
            type="date"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="arquivo" className="mb-1 block text-sm">
            Arquivo (fotos e PDF até 10 MB, vídeos até 200 MB)
          </label>
          <input
            id="arquivo"
            name="arquivo"
            type="file"
            accept={ACCEPT}
            required
            className="w-full text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            disabled={enviando}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {enviando ? 'Enviando...' : 'Enviar arquivo'}
          </button>
        </div>
      </form>

      {arquivos.length === 0 ? (
        <p className="text-sm">Nenhum arquivo enviado.</p>
      ) : (
        <ul className="divide-y rounded border text-sm">
          {arquivos.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{a.nome_original}</p>
                <p className="text-xs text-gray-600">
                  {rotulo(a.categoria)} · {formatarTamanho(a.tamanho_bytes)}
                  {a.data_vencimento &&
                    ` · vence em ${formatarData(a.data_vencimento)}`}
                </p>
              </div>
              <button onClick={() => abrir(a.id)} className="underline">
                Abrir
              </button>
              <button
                onClick={() => excluir(a.id, a.nome_original)}
                className="text-red-700 underline"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}