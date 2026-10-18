import { criarLocatario } from '../actions'
import { LocatarioForm } from '../locatario-form'

export default function NovoLocatarioPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Novo locatário</h1>
      <LocatarioForm action={criarLocatario} rotuloBotao="Cadastrar" />
    </div>
  )
}