import { createClient } from '@/lib/supabase/server'

export default async function VeiculosPage() {
  const supabase = await createClient()

  const { data: veiculos, error } = await supabase
    .from('veiculos_com_status')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return <p>Erro ao carregar veículos.</p>

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">Veículos</h1>
      {veiculos.length === 0 ? (
        <p>Nenhum veículo cadastrado.</p>
      ) : (
        <ul>
          {veiculos.map((v) => (
            <li key={v.id}>
              {v.placa} · {v.marca} {v.modelo} · {v.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}