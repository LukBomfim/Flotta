# Documentação do Projeto — Flotta

## 1. Identificação do Projeto

**Nome do projeto:** Flotta

**Descrição:** Sistema de Gestão e Locação de Veículos

**Tipo de sistema:** Sistema web

**Responsável:** Lucas Bomfim

## 2. Descrição do Projeto

O projeto consiste no desenvolvimento de um sistema web para auxiliar na gestão de veículos e locatários de uma empresa de locação de veículos.

Inicialmente, o sistema será voltado para o cadastro e a organização das informações dos veículos e locatários, incluindo o armazenamento de seus respectivos documentos e arquivos.

O sistema será desenvolvido de forma incremental, permitindo adicionar novas funcionalidades conforme o projeto evoluir.

## 3. Objetivos

### 3.1 Objetivo geral

Desenvolver um sistema para centralizar e organizar as informações e os documentos relacionados aos veículos e locatários.

### 3.2 Objetivos específicos

- Cadastrar e consultar veículos;
- Armazenar informações detalhadas dos veículos;
- Organizar os documentos de cada veículo;
- Cadastrar e consultar locatários;
- Armazenar informações dos locatários;
- Organizar os documentos de cada locatário;
- Permitir futuras expansões para a gestão de locações.

## 4. Escopo inicial

A primeira versão do sistema contemplará:

- Cadastro de veículos;
- Consulta e edição dos dados dos veículos;
- Armazenamento de documentos, fotos e vídeos de vistoria;
- Cadastro de locatários;
- Consulta e edição dos dados dos locatários;
- Armazenamento dos documentos dos locatários.

Funcionalidades como contratos, pagamentos, reservas e manutenção poderão ser desenvolvidas em versões futuras.

## 5. Metodologia de desenvolvimento

Será utilizado o desenvolvimento incremental, no qual o sistema será construído por etapas.

Cada etapa acrescentará novas funcionalidades ao sistema, permitindo que ele evolua gradualmente.

**Incremento 1:** Cadastro de veículos e locatários.

**Incremento 2:** Organização e gerenciamento dos documentos.

**Incremento 3:** Gestão de locações e contratos.

**Incremento 4:** Controle financeiro e outras funcionalidades futuras.

As etapas poderão ser ajustadas conforme as necessidades identificadas durante o desenvolvimento.

## 6. Tecnologias

As tecnologias utilizadas serão definidas durante o planejamento do projeto.

- **Frontend:** Typescript
- **Backend:** Typescript + Node.js
- **Banco de dados:** Supabase (PostgreSQL)
- **Hospedagem:** Vercel
- **Armazenamento de arquivos:** Cloudlfare R2

## 7. Organização dos dados

O sistema deverá organizar os dados em duas categorias principais:

**Veículos**

- Informações cadastrais;
- Documentos;
- Fotos e vídeos de vistoria;
- Histórico futuro do veículo.

**Locatários**

- Informações pessoais;
- Dados da habilitação;
- Documentos pessoais;
- Histórico futuro de locações.

Os dados cadastrais serão armazenados no banco de dados, enquanto os arquivos poderão ser armazenados em um serviço específico de armazenamento.

## 8. Requisitos gerais

O sistema deverá:

- Permitir o cadastro, a consulta e a edição de informações;
- Organizar os documentos por veículo ou locatário;
- Proteger os dados e documentos armazenados;
- Permitir a pesquisa de registros;
- Manter a integridade das informações;
- Possibilitar a inclusão de novas funcionalidades no futuro.

## 9. Evolução futura

Após a implementação das funcionalidades iniciais, o sistema poderá receber novos módulos, como:

- Gestão de locações;
- Controle de contratos;
- Pagamentos e recebimentos;
- Manutenção dos veículos;
- Controle de multas;
- Relatórios gerenciais;
- Alertas de vencimento de documentos.

## 10. Observações e decisões pendentes

Espaço reservado para registrar decisões e dúvidas que surgirem durante o planejamento.

- [Definir as tecnologias do projeto]
- [Definir a estrutura do banco de dados]
- [Definir como será feito o armazenamento dos arquivos]
- [Definir os tipos de usuários e suas permissões]
- [Adicionar novas decisões conforme o projeto evoluir]
