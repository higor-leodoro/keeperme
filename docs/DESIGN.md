# KeeperMe — Documento de Produto (Mobile)

Documento funcional do app **KeeperMe**, usado como base para a recriação do design system. Foco exclusivo no **mobile**; cobre o que o app faz, suas telas, fluxos e entidades — sem detalhes visuais ou técnicos.

---

## 1. Visão geral do produto

**KeeperMe** é um app de **gestão financeira pessoal** que permite ao usuário registrar, categorizar e acompanhar suas receitas e despesas do dia a dia.

- **Proposta de valor**: dar ao usuário uma visão clara e rápida da sua saúde financeira — quanto entrou, quanto saiu, onde está gastando — com o menor atrito possível para registrar transações.
- **Público-alvo**: pessoas físicas que querem controlar finanças pessoais de forma simples, sem planilhas nem ferramentas complexas.
- **Plataformas**: iOS e Android (app nativo mobile).
- **Idiomas**: Português (Brasil) e Inglês (EUA).
- **Moedas**: Real (BRL) e Dólar (USD).

---

## 2. Principais funcionalidades

1. **Autenticação** — login/cadastro por email e senha, Google Sign-In e Apple Sign-In, com sessão persistente (auto sign-in ao reabrir o app).
2. **Transações** — criar, visualizar, editar e remover transações de **receita** ou **despesa**.
3. **Categorias** — cada transação é associada a uma das 9 categorias fixas do sistema.
4. **Saldo** — visão consolidada do saldo total, total de receitas e total de despesas do usuário.
5. **Relatório** — listagem das transações com filtros por tipo (todas / receitas / despesas), agrupadas por categoria.
6. **Resumo por categoria** — visualização rápida de quanto foi gasto em cada categoria.
7. **Ações rápidas** — atalhos na Home para lançar uma nova receita ou despesa com menos cliques.
8. **Preferências do usuário** — troca de idioma (pt-BR / en-US) e moeda (BRL / USD).
9. **Perfil** — edição de nome e sobrenome, avatar e logout.

---

## 3. Estrutura de navegação

O app decide o fluxo a partir do estado de autenticação:

- **Não autenticado** → fluxo de autenticação (apenas a tela de SignIn).
- **Autenticado** → app principal com:
  - **Tab bar** inferior com 3 abas fixas: **Home**, **Transações**, **Perfil**.
  - **Modais** empilhados sobre as abas: **Nova Transação** e **Detalhes da Transação**.

Ao abrir o app, enquanto o estado de autenticação é resolvido, é exibida uma tela de carregamento.

---

## 4. Telas

### Fluxo de autenticação

- **SignIn** — tela única que alterna entre **login** e **cadastro** por animação de flip do card. Oferece três vias de entrada: **email/senha**, **Google** e **Apple**. Campos pedidos no cadastro: nome, email e senha.

### App principal (abas)

- **Home** — saudação com nome e avatar do usuário, cards de saldo (saldo total, receitas, despesas), ações rápidas para nova receita / nova despesa / ver extrato, e um resumo dos gastos por categoria.
- **Transações (Relatório)** — lista completa das transações do usuário, com filtros por tipo (todas / receitas / despesas) e agrupamento por categoria. Cada item é clicável e abre os detalhes da transação.
- **Perfil** — avatar do usuário, edição de nome e sobrenome, seletor de idioma (pt-BR / en-US), seletor de moeda (BRL / USD), botão de salvar preferências e botão de logout.

### Modais

- **Nova Transação** — formulário para criar uma transação. Campos: tipo (receita / despesa), valor (com máscara monetária), descrição, data (calendário) e categoria (seleção horizontal). Botão principal para salvar com estado de carregamento.
- **Detalhes da Transação** — abre ao tocar em uma transação existente. Permite visualizar e editar todos os campos da transação ou excluí-la. Exibe mensagem de fallback quando a transação não é encontrada.

---

## 5. Fluxos principais do usuário

### 5.1. Primeiro acesso
1. Usuário abre o app → tela de SignIn.
2. Escolhe uma das opções: email/senha, Google ou Apple.
3. Se novo, preenche o cadastro; se existente, faz login.
4. É levado direto para a **Home**.
5. Nas próximas aberturas, o auto sign-in pula o login.

### 5.2. Registrar uma transação (receita ou despesa)
1. Na Home, toca em uma **ação rápida** (Nova Receita / Nova Despesa) ou em uma categoria do resumo.
2. Abre o modal **Nova Transação** já com tipo (e categoria, se vier de uma categoria) pré-selecionados.
3. Preenche valor, descrição, data e ajusta categoria se necessário.
4. Toca em salvar → volta para a tela anterior com os saldos e listas atualizados.

### 5.3. Consultar e filtrar transações
1. Abre a aba **Transações**.
2. Usa os filtros (todas / receitas / despesas) para restringir a visão.
3. Percorre a lista agrupada por categoria.
4. Toca em qualquer transação para abrir os detalhes.

### 5.4. Editar ou excluir uma transação
1. Abre a transação pelo **Relatório** (ou a partir de outro ponto que leve aos detalhes).
2. No modal **Detalhes**, altera os campos desejados e salva, ou exclui a transação.
3. Volta para a tela anterior com os dados atualizados.

### 5.5. Alterar preferências e sair
1. Abre a aba **Perfil**.
2. Edita nome/sobrenome, troca idioma e/ou moeda.
3. Salva as preferências (o app passa a exibir textos e valores no novo formato).
4. Se desejar, toca em **Sair** para encerrar a sessão e voltar ao SignIn.

---

## 6. Entidades do domínio

### Transação
Registro de uma movimentação financeira do usuário.

| Campo | Descrição |
|---|---|
| `id` | Identificador único |
| `type` | `INCOME` (receita) ou `EXPENSE` (despesa) |
| `amount` | Valor monetário |
| `category` | Categoria associada (uma das 9 fixas) |
| `description` | Descrição livre digitada pelo usuário |
| `date` | Data da transação |
| `user` | Usuário dono da transação |

### Categoria
Conjunto **fixo de 9 categorias** do sistema:

1. **Casa** (HOUSE)
2. **Comida** (FOOD)
3. **Mercado** (GROCERY)
4. **Transporte** (TRANSPORT)
5. **Saúde** (HEALTH)
6. **Educação** (EDUCATION)
7. **Entretenimento** (ENTERTAINMENT)
8. **Finanças** (FINANCE)
9. **Outros** (OTHERS)

### Usuário
| Campo | Descrição |
|---|---|
| `id` | Identificador único |
| `name` | Primeiro nome |
| `lastName` | Sobrenome (opcional) |
| `email` | Email de login |
| `photo` | Foto/avatar (opcional — fallback para inicial do nome) |

### Saldo (derivado)
Calculado a partir das transações do usuário:

| Campo | Descrição |
|---|---|
| `totalBalance` | Saldo total (receitas − despesas) |
| `totalIncome` | Soma das receitas |
| `totalExpense` | Soma das despesas |

---

## 7. Internacionalização e moeda

- **Idiomas suportados**: Português (Brasil) — `pt-BR` — e Inglês (EUA) — `en-US`.
- **Moedas suportadas**: Real (`BRL`) e Dólar (`USD`).
- A preferência de idioma afeta **todos os textos da interface**; a de moeda afeta **formatação e máscara dos valores** exibidos e digitados.
- Ambas as preferências são salvas no perfil do usuário.

---

## 8. Resumo para o redesign

Ao recriar o design system, cada tela precisa suportar:

| Tela | Elementos essenciais |
|---|---|
| SignIn | Alternância login/cadastro, campos de formulário, botões de Google e Apple |
| Home | Saudação + avatar, cards de saldo, ações rápidas, resumo por categoria |
| Transações | Filtros por tipo, lista agrupada por categoria, item clicável |
| Perfil | Avatar, campos editáveis, seletores (idioma e moeda), logout |
| Nova Transação | Toggle tipo, input monetário, input texto, data, seletor de categoria, CTA |
| Detalhes da Transação | Mesmos campos de Nova Transação + editar/excluir |

**Componentes recorrentes que o novo design precisará cobrir**: tab bar inferior, header com voltar, cards (saldo, categoria, transação), botão primário, input de texto, input monetário, seletor de data, seletor de categoria horizontal, avatar, estado vazio e estado de carregamento.
