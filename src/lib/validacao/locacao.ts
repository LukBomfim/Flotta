import { z } from 'zod'

const data = (mensagem: string) =>
  z
    .string()
    .refine(
      (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
      mensagem
    )

export const iniciarLocacaoSchema = z.object({
  veiculo_id: z.string().uuid('Selecione um veículo.'),
  locatario_id: z.string().uuid('Selecione um locatário.'),
  data_inicio: data('Informe a data de início.'),
})

export const encerrarLocacaoSchema = z.object({
  data_fim: data('Informe a data de fim.'),
})