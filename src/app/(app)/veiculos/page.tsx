import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

async function ListaVeiculos() {
  const supabase = await createClient()

  const { data: veiculos, error } = await supabase
    .from('veiculos_com_status')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <p>Erro ao carregar veículos.</p>
  if (veiculos.length === 0) return <p>Nenhum veículo cadastrado.</p>

  return (
    <ul>
      {veiculos.map((v) => (
        <li key={v.id}>
          {v.placa} · {v.marca} {v.modelo} · {v.status}
        </li>
      ))}
    </ul>
  )
}

export default function VeiculosPage() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Veículos</h1>
      <Suspense fallback={<p>Carregando...</p>}>
        <ListaVeiculos />
      </Suspense>
    </div>
  )
}