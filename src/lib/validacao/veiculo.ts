import { z } from 'zod'

export const veiculoSchema = z.object({
  marca: z.string().trim().min(1, 'Informe a marca.'),
  modelo: z.string().trim().min(1, 'Informe o modelo.'),
  ano: z.coerce
    .number({ message: 'Informe o ano.' })
    .int('Ano inválido.')
    .min(1900, 'Ano inválido.')
    .max(2100, 'Ano inválido.'),
  // remove tudo que não é letra/número e deixa em maiúsculas
  placa: z
    .string()
    .transform((v) => v.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())
    .pipe(
      z
        .string()
        .regex(
          /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
          'Placa inválida (ex.: ABC1D23 ou ABC1234).'
        )
    ),
  // chassi (VIN): 17 caracteres, sem as letras I, O e Q
  chassi: z
    .string()
    .transform((v) => v.replace(/\s/g, '').toUpperCase())
    .pipe(
      z
        .string()
        .regex(
          /^[A-HJ-NPR-Z0-9]{17}$/,
          'Chassi inválido (17 caracteres, sem I, O ou Q).'
        )
    ),
})

export type VeiculoInput = z.infer<typeof veiculoSchema>