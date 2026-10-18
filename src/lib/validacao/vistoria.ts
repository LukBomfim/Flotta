import { z } from 'zod'

export const TIPOS_VISTORIA = ['entrega', 'devolucao'] as const
export type TipoVistoria = (typeof TIPOS_VISTORIA)[number]

export const ROTULO_VISTORIA: Record<TipoVistoria, string> = {
  entrega: 'Vistoria de entrega',
  devolucao: 'Vistoria de devolução',
}

export const vistoriaSchema = z.object({
  data: z
    .string()
    .refine(
      (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
      'Informe a data da vistoria.'
    ),
  km: z.coerce
    .number({ message: 'Informe a quilometragem.' })
    .int('Quilometragem inválida.')
    .min(0, 'Quilometragem inválida.')
    .max(9_999_999, 'Quilometragem inválida.'),
})