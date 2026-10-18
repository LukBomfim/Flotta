import type { ZodError } from 'zod'

export type EstadoForm = {
  erros?: Record<string, string>
  mensagem?: string
  valores?: Record<string, string>
}

// Primeiro erro de cada campo
export function errosDoZod(error: ZodError): Record<string, string> {
  const erros: Record<string, string> = {}
  for (const issue of error.issues) {
    const campo = String(issue.path[0])
    if (!erros[campo]) erros[campo] = issue.message
  }
  return erros
}