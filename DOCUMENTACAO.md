# Documentação do Projeto — Flotta

## 1. Identificação do Projeto

**Nome do projeto:** Flotta

**Descrição:** Sistema de Gestão e Locação de Veículos

**Tipo de sistema:** Sistema web (multiempresa)

**Responsável:** Lucas Bomfim

## 2. Descrição do Projeto

Sistema web para organizar veículos e locatários de empresas de locação de veículos.

A primeira versão é um **organizador**: centraliza o cadastro de veículos e locatários, o vínculo entre eles (locação mínima) e os arquivos relacionados (documentos, contratos e vistorias). Ela **não** faz gestão financeira nem de contratos.

O sistema será desenvolvido de forma incremental, adicionando funcionalidades conforme o projeto evoluir.

## 3. Objetivos

### 3.1 Objetivo geral

Centralizar e organizar as informações e os arquivos relacionados a veículos, locatários e suas locações.

### 3.2 Objetivos específicos

- Cadastrar, consultar e editar veículos;
- Cadastrar, consultar e editar locatários;
- Registrar o vínculo entre veículo e locatário (locação mínima);
- Armazenar arquivos de veículos, locatários, contratos e vistorias;
- Exibir, na tela do veículo, o histórico de locatários, destacando o atual;
- Permitir futuras expansões para gestão completa de locações.

## 4. Escopo da versão 1

**Inclui:**

- Cadastro, consulta e edição de veículos;
- Cadastro, consulta e edição de locatários (com contato de emergência);
- Locação mínima: veículo, locatário, data de início e data de fim;
- Duas vistorias por locação (entrega e devolução), com quilometragem, fotos e vídeos;
- Armazenamento de arquivos de veículos, locatários, contratos (por locação) e vistorias;
- Status do veículo: **Alugado** ou **Disponível**;
- Pesquisa de registros.

**Não inclui (versões futuras):**

- Valores, pagamentos e controle financeiro;
- Geração ou regras de contratos (apenas o arquivo do contrato é armazenado);
- Reservas, manutenção, multas e relatórios;
- Alertas de vencimento (o campo de vencimento já é armazenado);
- Múltiplos usuários e perfis por empresa.

## 5. Metodologia de desenvolvimento

Desenvolvimento incremental, em etapas.

**Incremento 1:** Cadastro de veículos e locatários, locação mínima, vistorias e arquivos.

**Incremento 2:** Refinamento do gerenciamento de documentos (categorias, vencimentos e alertas).

**Incremento 3:** Gestão completa de locações e contratos.

**Incremento 4:** Controle financeiro e outras funcionalidades futuras.

As etapas podem ser ajustadas conforme as necessidades identificadas.

## 6. Tecnologias

- **Frontend:** TypeScript
- **Backend:** TypeScript + Node.js
- **Banco de dados e autenticação:** Supabase (PostgreSQL)
- **Hospedagem:** Vercel
- **Armazenamento de arquivos:** Cloudflare R2 (bucket privado)

## 7. Organização dos dados

### 7.1 Multiempresa e acesso

- Cada **empresa** possui um único login, com acesso total aos seus dados (usuário = empresa).
- Não há perfis ou permissões na v1.
- Toda tabela de dados possui `empresa_id`. O isolamento entre empresas é garantido por **RLS (Row Level Security)** no Supabase (`empresa_id = auth.uid()`).

### 7.2 Entidades

**Veículo**

- Marca, modelo, ano, chassi e placa (todos obrigatórios);
- Placa e chassi únicos por empresa;
- Status: *Alugado* (calculado: existe locação sem data de fim) ou *Disponível* (caso contrário). Não há campo de status manual.

**Locatário** (somente pessoa física)

- Nome, CPF, telefone, e-mail e endereço;
- Dados da CNH: número, categoria e validade;
- Contato de emergência (um): nome, telefone e parentesco;
- CPF único por empresa.

**Locação (mínima)**

- Veículo, locatário, data de início e data de fim (vazia enquanto ativa);
- Um veículo só pode ter **uma locação ativa** por vez;
- Um locatário só pode ter **uma locação ativa** por vez;
- A locação é encerrada ao preencher a data de fim; o veículo volta a *Disponível* automaticamente.

**Vistoria**

- Pertence a uma locação;
- Tipo: entrega ou devolução (no máximo uma de cada tipo por locação);
- Data e quilometragem;
- Fotos e vídeos como arquivos.

**Arquivo**

- Vinculado a exatamente um de: veículo, locatário, locação (contrato) ou vistoria;
- Tipo/categoria, nome original, caminho no R2, tamanho, formato e data de vencimento (opcional).

### 7.3 Armazenamento de arquivos

- Dados cadastrais no PostgreSQL; arquivos no Cloudflare R2.
- Bucket privado, acesso por URLs assinadas com expiração.
- Estrutura de caminhos: `{empresa_id}/{veiculos|locatarios|locacoes|vistorias}/{id}/{arquivo}`.
- Upload direto do navegador para o R2 via URL pré-assinada (a Vercel limita o tamanho das requisições).
- Limites iniciais:
  - Fotos e PDFs: até 10 MB (jpg, png, webp, pdf);
  - Vídeos: até 200 MB (mp4, mov).

## 8. Requisitos gerais

O sistema deverá:

- Permitir cadastro, consulta e edição de informações;
- Organizar arquivos por veículo, locatário, locação ou vistoria;
- Proteger dados e documentos (dados pessoais sujeitos à LGPD);
- Isolar completamente os dados de cada empresa;
- Permitir a pesquisa de registros;
- Manter a integridade das informações (restrições no banco);
- Possibilitar a inclusão de novas funcionalidades no futuro.

## 9. Evolução futura

- Gestão completa de locações e contratos;
- Pagamentos e recebimentos;
- Manutenção dos veículos (e status adicionais);
- Controle de multas;
- Relatórios gerenciais;
- Alertas de vencimento de documentos;
- Múltiplos usuários e perfis por empresa.

## 10. Decisões tomadas

- Usuário = empresa, um login com acesso total;
- Sistema multiempresa com RLS;
- Somente pessoa física, com um contato de emergência;
- Veículo: marca, modelo, ano, chassi e placa obrigatórios;
- Status do veículo apenas calculado (Alugado/Disponível);
- Uma locação ativa por veículo e por locatário (bloqueado no banco);
- Duas vistorias por locação, com apenas a quilometragem como dado extra;
- Limites de arquivo e upload direto para o R2 conforme seção 7.3.

## 11. Decisões pendentes

- [Definir o framework do frontend (ex.: Next.js, React + Vite) e se o backend será separado ou via API routes/server actions]
- [Definir critérios de pesquisa (placa, nome, CPF, modelo?)]
- [Definir política de exclusão: exclusão definitiva ou lógica (arquivos e registros)]
- [Definir fluxo de cadastro/criação da conta da empresa]