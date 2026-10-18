export const TIPOS_IMAGEM_PDF = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]
export const TIPOS_VIDEO = ['video/mp4', 'video/quicktime']

export const LIMITE_IMAGEM_PDF = 10 * 1024 * 1024
export const LIMITE_VIDEO = 200 * 1024 * 1024

export const ACCEPT = '.jpg,.jpeg,.png,.webp,.pdf,.mp4,.mov'

export function limitePorTipo(mime: string): number | null {
  if (TIPOS_IMAGEM_PDF.includes(mime)) return LIMITE_IMAGEM_PDF
  if (TIPOS_VIDEO.includes(mime)) return LIMITE_VIDEO
  return null
}

export const ENTIDADES = {
  veiculo: { pasta: 'veiculos' },
  locatario: { pasta: 'locatarios' },
  locacao: { pasta: 'locacoes' },
  vistoria: { pasta: 'vistorias' },
} as const

export type Entidade = keyof typeof ENTIDADES

export const CATEGORIAS: Record<Entidade, { valor: string; rotulo: string }[]> =
  {
    veiculo: [
      { valor: 'crlv', rotulo: 'CRLV' },
      { valor: 'seguro', rotulo: 'Seguro' },
      { valor: 'outro', rotulo: 'Outro' },
    ],
    locatario: [
      { valor: 'cnh', rotulo: 'CNH' },
      { valor: 'comprovante_residencia', rotulo: 'Comprovante de residência' },
      { valor: 'outro', rotulo: 'Outro' },
    ],
    locacao: [{ valor: 'contrato', rotulo: 'Contrato' }],
    vistoria: [
      { valor: 'foto_vistoria', rotulo: 'Foto' },
      { valor: 'video_vistoria', rotulo: 'Vídeo' },
    ],
  }

export function formatarTamanho(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const formatarData = (iso: string) => iso.split('-').reverse().join('/')