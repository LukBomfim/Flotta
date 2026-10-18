-- Flotta — esquema inicial (v1)
-- Modelo: usuário = empresa (empresas.id = auth.users.id)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Função utilitária: updated_at
-- ---------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------
-- empresas
-- ---------------------------------------------------------------
create table empresas (
  id         uuid primary key references auth.users(id) on delete cascade,
  nome       text not null,
  created_at timestamptz not null default now()
);

-- Cria a empresa automaticamente quando um usuário é criado no Auth
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into empresas (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------------
-- veiculos
-- ---------------------------------------------------------------
create table veiculos (
  id         uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  marca      text not null,
  modelo     text not null,
  ano        smallint not null check (ano between 1900 and 2100),
  chassi     text not null check (chassi = upper(chassi)),
  placa      text not null check (placa ~ '^[A-Z0-9]{7}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (empresa_id, placa),
  unique (empresa_id, chassi),
  unique (empresa_id, id)
);
create trigger trg_veiculos_updated before update on veiculos
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------
-- locatarios (somente pessoa física)
-- ---------------------------------------------------------------
create table locatarios (
  id                    uuid primary key default gen_random_uuid(),
  empresa_id            uuid not null references empresas(id) on delete cascade,
  nome                  text not null,
  cpf                   text not null check (cpf ~ '^\d{11}$'),
  telefone              text not null,
  email                 text,
  endereco              text,
  cnh_numero            text not null,
  cnh_categoria         text not null,
  cnh_validade          date not null,
  emergencia_nome       text not null,
  emergencia_telefone   text not null,
  emergencia_parentesco text not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (empresa_id, cpf),
  unique (empresa_id, id)
);
create trigger trg_locatarios_updated before update on locatarios
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------
-- locacoes (locação mínima)
-- ---------------------------------------------------------------
create table locacoes (
  id           uuid primary key default gen_random_uuid(),
  empresa_id   uuid not null references empresas(id) on delete cascade,
  veiculo_id   uuid not null,
  locatario_id uuid not null,
  data_inicio  date not null,
  data_fim     date,  -- nula = locação ativa
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (data_fim is null or data_fim >= data_inicio),
  unique (empresa_id, id),
  foreign key (empresa_id, veiculo_id)   references veiculos(empresa_id, id),
  foreign key (empresa_id, locatario_id) references locatarios(empresa_id, id)
);
create trigger trg_locacoes_updated before update on locacoes
  for each row execute function set_updated_at();

-- Uma locação ativa por veículo e por locatário
create unique index uq_locacao_ativa_veiculo
  on locacoes (veiculo_id) where data_fim is null;
create unique index uq_locacao_ativa_locatario
  on locacoes (locatario_id) where data_fim is null;

create index idx_locacoes_empresa   on locacoes (empresa_id);
create index idx_locacoes_veiculo   on locacoes (veiculo_id);
create index idx_locacoes_locatario on locacoes (locatario_id);

-- ---------------------------------------------------------------
-- vistorias (no máximo uma de cada tipo por locação)
-- ---------------------------------------------------------------
create table vistorias (
  id         uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  locacao_id uuid not null,
  tipo       text not null check (tipo in ('entrega', 'devolucao')),
  data       date not null,
  km         integer not null check (km >= 0),
  created_at timestamptz not null default now(),
  unique (locacao_id, tipo),
  unique (empresa_id, id),
  foreign key (empresa_id, locacao_id) references locacoes(empresa_id, id) on delete cascade
);

create index idx_vistorias_empresa on vistorias (empresa_id);

-- ---------------------------------------------------------------
-- arquivos (vinculado a exatamente uma entidade)
-- ---------------------------------------------------------------
create table arquivos (
  id              uuid primary key default gen_random_uuid(),
  empresa_id      uuid not null references empresas(id) on delete cascade,
  veiculo_id      uuid,
  locatario_id    uuid,
  locacao_id      uuid,
  vistoria_id     uuid,
  categoria       text not null,  -- ex.: crlv, seguro, cnh, contrato, foto_vistoria
  nome_original   text not null,
  caminho_r2      text not null unique,
  mime_type       text not null,
  tamanho_bytes   bigint not null check (tamanho_bytes > 0),
  data_vencimento date,
  created_at      timestamptz not null default now(),

  foreign key (empresa_id, veiculo_id)   references veiculos(empresa_id, id)   on delete cascade,
  foreign key (empresa_id, locatario_id) references locatarios(empresa_id, id) on delete cascade,
  foreign key (empresa_id, locacao_id)   references locacoes(empresa_id, id)   on delete cascade,
  foreign key (empresa_id, vistoria_id)  references vistorias(empresa_id, id)  on delete cascade,

  check (num_nonnulls(veiculo_id, locatario_id, locacao_id, vistoria_id) = 1),

  check (
    (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')
       and tamanho_bytes <= 10 * 1024 * 1024)
    or
    (mime_type in ('video/mp4', 'video/quicktime')
       and tamanho_bytes <= 200 * 1024 * 1024)
  )
);

create index idx_arquivos_empresa   on arquivos (empresa_id);
create index idx_arquivos_veiculo   on arquivos (veiculo_id)   where veiculo_id   is not null;
create index idx_arquivos_locatario on arquivos (locatario_id) where locatario_id is not null;
create index idx_arquivos_locacao   on arquivos (locacao_id)   where locacao_id   is not null;
create index idx_arquivos_vistoria  on arquivos (vistoria_id)  where vistoria_id  is not null;

-- ---------------------------------------------------------------
-- View: veículo com status calculado (Alugado / Disponível)
-- ---------------------------------------------------------------
create view veiculos_com_status
with (security_invoker = true) as
select
  v.*,
  case when exists (
    select 1 from locacoes l
    where l.veiculo_id = v.id and l.data_fim is null
  ) then 'alugado' else 'disponivel' end as status
from veiculos v;

-- ---------------------------------------------------------------
-- RLS: cada empresa só acessa os próprios dados
-- ---------------------------------------------------------------
alter table empresas   enable row level security;
alter table veiculos   enable row level security;
alter table locatarios enable row level security;
alter table locacoes   enable row level security;
alter table vistorias  enable row level security;
alter table arquivos   enable row level security;

create policy empresa_propria on empresas
  for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy isolamento_veiculos on veiculos
  for all to authenticated
  using (empresa_id = (select auth.uid())) with check (empresa_id = (select auth.uid()));

create policy isolamento_locatarios on locatarios
  for all to authenticated
  using (empresa_id = (select auth.uid())) with check (empresa_id = (select auth.uid()));

create policy isolamento_locacoes on locacoes
  for all to authenticated
  using (empresa_id = (select auth.uid())) with check (empresa_id = (select auth.uid()));

create policy isolamento_vistorias on vistorias
  for all to authenticated
  using (empresa_id = (select auth.uid())) with check (empresa_id = (select auth.uid()));

create policy isolamento_arquivos on arquivos
  for all to authenticated
  using (empresa_id = (select auth.uid())) with check (empresa_id = (select auth.uid()));