import { criarVeiculo } from '../actions'
import { VeiculoForm } from '../veiculo-form'

export default function NovoVeiculoPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Novo veículo</h1>
      <VeiculoForm action={criarVeiculo} rotuloBotao="Cadastrar" />
    </div>
  )
}