import { z } from 'zod'

export const CAMPOS_LOCATARIO = [
  'nome',
  'cpf',
  'telefone',
  'email',
  'endereco',
  'cnh_numero',
  'cnh_categoria',
  'cnh_validade',
  'emergencia_nome',
  'emergencia_telefone',
  'emergencia_parentesco',
] as const

export const CATEGORIAS_CNH = ['A', 'B', 'AB', 'C', 'D', 'E', 'AC', 'AD', 'AE']

function cpfValido(cpf: string) {
  if (!/^\d{11}$/.test(cpf)) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false // 111.111.111-11 etc.

  const digito = (base: string, pesoInicial: number) => {
    let soma = 0
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i)
    }
    const resto = (soma * 10) % 11
    return resto === 10 ? 0 : resto
  }

  return (
    digito(cpf.slice(0, 9), 10) === Number(cpf[9]) &&
    digito(cpf.slice(0, 10), 11) === Number(cpf[10])
  )
}

const apenasDigitos = (v: string) => v.replace(/\D/g, '')

const telefone = z
  .string()
  .transform(apenasDigitos)
  .refine((v) => /^\d{10,11}$/.test(v), 'Telefone inválido (DDD + número).')

const textoObrigatorio = (mensagem: string) =>
  z.string().trim().min(1, mensagem)

const textoOpcional = z
  .string()
  .trim()
  .transform((v) => (v === '' ? null : v))

export const locatarioSchema = z.object({
  nome: textoObrigatorio('Informe o nome.'),
  cpf: z
    .string()
    .transform(apenasDigitos)
    .refine(cpfValido, 'CPF inválido.'),
  telefone,
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine(
      (v) => v === '' || z.string().email().safeParse(v).success,
      'E-mail inválido.'
    )
    .transform((v) => (v === '' ? null : v)),
  endereco: textoOpcional,
  cnh_numero: z
    .string()
    .transform(apenasDigitos)
    .refine((v) => /^\d{11}$/.test(v), 'CNH inválida (11 dígitos).'),
  cnh_categoria: z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => CATEGORIAS_CNH.includes(v), 'Categoria inválida.'),
  cnh_validade: z
    .string()
    .refine(
      (v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)),
      'Informe a validade da CNH.'
    ),
  emergencia_nome: textoObrigatorio('Informe o nome do contato.'),
  emergencia_telefone: telefone,
  emergencia_parentesco: textoObrigatorio('Informe o parentesco.'),
})

export type LocatarioInput = z.infer<typeof locatarioSchema>