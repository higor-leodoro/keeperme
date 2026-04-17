# KeeperMe API

API REST + WebSocket para o KeeperMe — app de gestão financeira pessoal e em grupo, com chat IA para registro de transações. Esta documentação descreve os contratos da API para consumidores (frontend / mobile).

Para visão de produto, consulte [DESIGN.md](../DESIGN.md). Para deploy, consulte [DEPLOY.md](DEPLOY.md).

## Sumário

1. [Stack Técnica](#stack-técnica)
2. [URL Base e Autenticação](#url-base-e-autenticação)
3. [Convenções Globais](#convenções-globais)
4. [Endpoints REST](#endpoints-rest)
   - [Auth](#auth)
   - [Users](#users)
   - [Categories](#categories)
   - [Transactions](#transactions)
   - [Groups](#groups)
   - [Invites](#invites)
   - [Balance](#balance)
   - [Chat Sessions](#chat-sessions)
   - [Chat Messages (REST)](#chat-messages-rest)
5. [WebSocket — Chat com IA](#websocket--chat-com-ia)
6. [Modelo de Dados e Enums](#modelo-de-dados-e-enums)
7. [Códigos de Erro](#códigos-de-erro)
8. [Rodando Localmente](#rodando-localmente)
9. [Deploy](#deploy)

## Stack Técnica

- **Framework:** NestJS 11 + TypeScript 5.7 (Node.js)
- **Banco:** PostgreSQL via Prisma 7
- **Auth:** JWT (Passport) + OAuth Google + Sign in with Apple
- **Realtime:** Socket.io 4 (`@nestjs/websockets`)
- **IA:** OpenAI (`gpt-4o-mini`)
- **Validação:** `class-validator` + `class-transformer` (DTOs)
- **Docs interativas:** Swagger / OpenAPI (`@nestjs/swagger`)
- **Hash de senha:** `bcrypt` (10 rounds)

## URL Base e Autenticação

### URL base

- Local: `http://localhost:3001`
- Porta configurável via `PORT` (default `3001`)
- CORS habilitado globalmente (todas as origens) — [src/main.ts:12](src/main.ts#L12)

### Swagger

Documentação interativa disponível em `GET /api` — use para explorar schemas, payloads de exemplo e testar rotas com Bearer token.

### Esquema de autenticação

Todas as rotas são **protegidas por JWT globalmente** via `JwtAuthGuard` ([src/main.ts:14](src/main.ts#L14)). Exceções são explicitamente marcadas com `@Public()` e listadas nas tabelas abaixo como _Pública_.

Envie o token em cada request:

```
Authorization: Bearer <jwt>
```

**Características do JWT** ([src/modules/auth/auth.module.ts:15-22](src/modules/auth/auth.module.ts#L15-L22)):

- Algoritmo: HS256
- Segredo: `JWT_SECRET` (env)
- Expira em: **7 dias**
- Payload: `{ sub: <userId>, email: <userEmail> }`

### Como obter o token

| Método | Rota | Para que serve |
| --- | --- | --- |
| POST | `/auth/register` | Cadastro com email + senha |
| POST | `/auth/login` | Login com email + senha |
| POST | `/auth/google` | Login com Google (ID token ou access token) |
| POST | `/auth/apple` | Login com Sign in with Apple |
| POST | `/auth/me` | "Refresh" — revalida token atual e retorna o usuário |

Rotas `register`, `login`, `google`, `apple` retornam `{ user, token }`. Rota `me` retorna apenas o `user` (o token é o mesmo do header).

## Convenções Globais

- **IDs:** todos UUID v4 (strings).
- **Datas:** ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Em `TransactionResponseDto`, o campo `date` é serializado apenas como `YYYY-MM-DD` ([transaction-response.dto.ts:70-74](src/modules/transaction/dtos/transaction-response.dto.ts#L70-L74)).
- **Timestamps escondidos:** `createdAt` e `updatedAt` são **removidos recursivamente de todas as respostas** pelo `StripTimestampsInterceptor` ([strip-timestamps.interceptor.ts](src/common/interceptors/strip-timestamps.interceptor.ts)). Outros campos de data (`date`, `joinedAt`, `expiresAt`, `acceptedAt`, `timestamp`) permanecem.
- **Validação estrita:** `ValidationPipe` global com `whitelist: true` e `forbidNonWhitelisted: true` — qualquer campo extra no body faz o request ser rejeitado com 400 ([main.ts:21-27](src/main.ts#L21-L27)).
- **Formato de erro:** padrão NestJS — `{ statusCode, message, error }`. Veja [Códigos de Erro](#códigos-de-erro).
- **Moeda:** `amount` em transações é `number` (float). Sem formatação/arredondamento — responsabilidade do cliente.

## Endpoints REST

Legenda: **Auth** = _Pública_ (sem token) ou _Protegida_ (requer Bearer JWT).

---

### Auth

Tag Swagger: `Auth`. Controller: [auth.controller.ts](src/modules/auth/auth.controller.ts).

| Método | Rota | Auth | Corpo (DTO) | Resposta |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Pública | `RegisterDto` | `{ user: UserResponseDto, token: string }` |
| POST | `/auth/login` | Pública | `LoginDto` | `{ user: UserResponseDto, token: string }` |
| POST | `/auth/google` | Pública | `GoogleLoginDto` | `{ user: UserResponseDto, token: string }` |
| POST | `/auth/apple` | Pública | `AppleLoginDto` | `{ user: UserResponseDto, token: string }` |
| POST | `/auth/me` | Protegida | _(vazio)_ | `UserResponseDto` |

**RegisterDto** ([register.dto.ts](src/modules/auth/dtos/register.dto.ts))
| Campo | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `email` | string | sim | email válido |
| `password` | string | sim | mínimo 6 caracteres |
| `name` | string | sim | — |
| `lastName` | string | sim | — |

**LoginDto** ([login.dto.ts](src/modules/auth/dtos/login.dto.ts))
| Campo | Tipo | Obrigatório | Regras |
| --- | --- | --- | --- |
| `email` | string | sim | email válido |
| `password` | string | sim | mínimo 6 caracteres |

**GoogleLoginDto** ([google-login.dto.ts](src/modules/auth/dtos/google-login.dto.ts))
| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `token` | string | sim | Aceita **ID token** (mobile) ou **access token** (web). O backend tenta validar como ID token e, em caso de falha, consulta `https://www.googleapis.com/oauth2/v3/userinfo` com o access token. Cria usuário automaticamente se for primeiro login. |

**AppleLoginDto** ([apple-login.dto.ts](src/modules/auth/dtos/apple-login.dto.ts))
| Campo | Tipo | Obrigatório | Observação |
| --- | --- | --- | --- |
| `identityToken` | string | sim | Token da Apple, validado contra JWKS em `https://appleid.apple.com/auth/keys` |
| `email` | string | não | Enviar somente na **primeira autenticação** (Apple só expõe email uma vez) |
| `fullName` | string | não | Idem |

**UserResponseDto** ([user-response.dto.ts](src/modules/auth/dtos/user-response.dto.ts))
| Campo | Tipo | Nullable |
| --- | --- | --- |
| `id` | string (UUID) | não |
| `name` | string | não |
| `lastName` | string \| null | sim |
| `email` | string | não |
| `photo` | string \| null | sim |

**Regras de negócio relevantes:**

- `register` → `409 Conflict` se o email já existir.
- `login` → `401 Unauthorized` com mensagem específica `"This account uses Google sign-in..."` se a conta foi criada via OAuth e não tem senha.
- `apple` → se o Apple não retornar email (logins subsequentes), o backend gera `apple-<sub>@noreply.keeperme.app` como fallback ([auth.service.ts:171-174](src/modules/auth/auth.service.ts#L171-L174)).

---

### Users

Tag Swagger: `Users`. Controller: [user.controller.ts](src/modules/user/user.controller.ts).

| Método | Rota | Auth | Corpo / Params | Resposta |
| --- | --- | --- | --- | --- |
| POST | `/user` | **Pública** | `CreateUserDto` | `User` |
| GET | `/user/:id` | Protegida | `id` (UUID) | `User` |
| GET | `/user/google/:googleId` | Protegida | `googleId` | `User` |
| PATCH | `/user/:id` | Protegida | `UpdateUserDto` | `User` |
| DELETE | `/user/:id` | Protegida | `id` | `{ message: "User deleted successfully" }` |

> ⚠️ `POST /user` faz `findOrCreate` voltado para **Google**: exige `googleId` no body ou retorna `400`. A criação "oficial" de usuários deve ser feita pelas rotas de `/auth`.

**CreateUserDto** ([create-user.dto.ts](src/modules/user/dtos/create-user.dto.ts))
| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `email` | string (email) | sim |
| `name` | string | sim |
| `lastName` | string | sim |
| `googleId` | string | não |
| `appleId` | string | não |
| `photo` | string (URL) | não |

**UpdateUserDto** ([update-user.dto.ts](src/modules/user/dtos/update-user.dto.ts))
| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `name` | string | não |
| `lastName` | string | não |
| `photo` | string | não |

Resposta `User`: objeto Prisma completo (menos `createdAt`/`updatedAt` removidos pelo interceptor). Campos expostos: `id`, `email`, `name`, `lastName`, `password` (hash bcrypt para contas com senha, `null` para contas OAuth-only), `googleId`, `appleId`, `photo`.

---

### Categories

Tag Swagger: `Categories`. Controller: [category.controller.ts](src/modules/category/category.controller.ts).

| Método | Rota | Auth | Corpo | Resposta |
| --- | --- | --- | --- | --- |
| POST | `/categories` | Protegida | `CreateCategoryDto` | `Category` |
| GET | `/categories` | Protegida | — | `Category[]` |
| GET | `/categories/:id` | Protegida | — | `Category` |
| PATCH | `/categories/:id` | Protegida | `UpdateCategoryDto` | `{ message: "Category updated successfully." }` |
| DELETE | `/categories/:id` | Protegida | — | `{ message: "Category deleted successfully." }` |

**CreateCategoryDto / UpdateCategoryDto**: ambos só `{ name: string }` (não vazio).

**Category**: `{ id, name }` (timestamps removidos).

> ⚠️ A relação `Transaction → Category` usa `onDelete: Restrict` no schema ([schema.prisma:80](prisma/schema.prisma#L80)). Tentar deletar uma categoria que está sendo referenciada por transações falhará no banco.

---

### Transactions

Tag Swagger: `Transactions`. Controller: [transaction.controller.ts](src/modules/transaction/transaction.controller.ts).

Todas as rotas são **protegidas**. O `userId` da transação é sempre o do usuário autenticado (não vem no body).

| Método | Rota | Query | Corpo | Resposta |
| --- | --- | --- | --- | --- |
| POST | `/transactions` | — | `CreateTransactionDto` | `TransactionResponseDto` |
| GET | `/transactions` | `groupId?`, `startDate?`, `endDate?` | — | `TransactionResponseDto[]` |
| GET | `/transactions/all-categories` | `CategoryTotalQueryDto` | — | `CategoryTotalDto[]` |
| GET | `/transactions/category/:id` | `CategoryTotalQueryDto` | — | `CategoryTotalDto` |
| GET | `/transactions/:id` | — | — | `TransactionResponseDto` |
| PATCH | `/transactions/:id` | — | `UpdateTransactionDto` | `TransactionResponseDto` |
| DELETE | `/transactions/:id` | — | — | `{ message: "Transaction deleted successfully" }` |

**CreateTransactionDto** ([create-transaction.dto.ts](src/modules/transaction/dtos/create-transaction.dto.ts))
| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `amount` | number | sim |
| `type` | `INCOME` \| `EXPENSE` | sim |
| `categoryId` | string (UUID) | sim |
| `description` | string | não |
| `groupId` | string (UUID) | não |
| `date` | string (ISO date) | não — default `now()` |

**UpdateTransactionDto**: todos os campos acima **opcionais, mas não vazios**. Note que **não é possível alterar `groupId`** via PATCH — só na criação ([update-transaction.dto.ts](src/modules/transaction/dtos/update-transaction.dto.ts)).

**CategoryTotalQueryDto** (query params para `/all-categories` e `/category/:id`)
| Parâmetro | Tipo | Obrigatório |
| --- | --- | --- |
| `groupId` | UUID | não |
| `type` | `INCOME` \| `EXPENSE` | não |
| `startDate` | string (ISO date) | não |
| `endDate` | string (ISO date) | não |

**TransactionResponseDto** ([transaction-response.dto.ts](src/modules/transaction/dtos/transaction-response.dto.ts))
| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | string | |
| `amount` | number | |
| `type` | `INCOME` \| `EXPENSE` | |
| `description` | string \| null | |
| `date` | string | Formato `YYYY-MM-DD` |
| `category` | `{ id, name }` | |
| `groupId` | string \| null | |
| `group` | `{ id, name }` \| null | Só vem se a transação for de grupo |
| `user` | `{ id, name, email }` \| null | |

**CategoryTotalDto** ([category-total.dto.ts](src/modules/transaction/dtos/category-total.dto.ts))
| Campo | Tipo |
| --- | --- |
| `categoryId` | string |
| `categoryName` | string |
| `total` | number |
| `transactionCount` | number |

**Regras de permissão (PATCH / DELETE)** ([transaction.service.ts](src/modules/transaction/transaction.service.ts)):

- **Transações pessoais** (sem `groupId`): apenas o criador pode editar/deletar.
- **Transações de grupo**: depende do `editPermission` do grupo:
  - `OWNER_ONLY` → só o owner do grupo.
  - `ALL_MEMBERS` → qualquer membro ativo.
  - `OWN_TRANSACTIONS_ONLY` → cada membro edita apenas as transações que ele próprio criou (default de grupos novos).

Violar a permissão retorna `403 Forbidden`.

---

### Groups

Tag Swagger: `Groups`. Controller: [group.controller.ts](src/modules/group/group.controller.ts).

Todas as rotas são **protegidas**.

| Método | Rota | Papel necessário | Corpo | Resposta |
| --- | --- | --- | --- | --- |
| POST | `/groups` | qualquer usuário | `CreateGroupDto` | `GroupResponseDto` |
| GET | `/groups` | qualquer usuário | — | `GroupResponseDto[]` (grupos em que é membro ativo) |
| GET | `/groups/:id` | membro | — | `GroupResponseDto` |
| PATCH | `/groups/:id` | **owner** | `UpdateGroupDto` | `GroupResponseDto` |
| DELETE | `/groups/:id` | **owner** | — | `{ message }` (falha com 400 se houver transações) |
| POST | `/groups/:id/invites` | membro | `CreateInviteDto` | `InviteResponseDto` |
| GET | `/groups/:id/invites` | membro | — | `InviteResponseDto[]` (todos os status) |
| DELETE | `/groups/:id/invites/:inviteId` | membro | — | `{ message }` (apenas convite `PENDING`) |
| DELETE | `/groups/:id/members/:userId` | owner **ou** o próprio usuário | — | `{ message }` (soft delete — `isActive=false`; owner não pode sair) |
| GET | `/groups/:id/transactions` | membro | — | `TransactionResponseDto[]` |

**CreateGroupDto** ([create-group.dto.ts](src/modules/group/dtos/create-group.dto.ts))
| Campo | Tipo | Obrigatório |
| --- | --- | --- |
| `name` | string | sim |
| `description` | string | não |
| `editPermission` | `EditPermission` | sim (`OWNER_ONLY` \| `ALL_MEMBERS` \| `OWN_TRANSACTIONS_ONLY`) |

**UpdateGroupDto**: todos os campos acima opcionais.

**CreateInviteDto**: `{ email: string }` (email válido).

**GroupResponseDto** ([group-response.dto.ts](src/modules/group/dtos/group-response.dto.ts))
| Campo | Tipo | Observação |
| --- | --- | --- |
| `id` | string | |
| `name` | string | |
| `description` | string \| null | |
| `editPermission` | enum `EditPermission` | |
| `owner` | `UserInfo` | `{ id, name, email, photo? }` |
| `members` | `GroupMember[]` | ver abaixo |
| `transactionCount` | number \| null | Presente em algumas rotas |

`GroupMember`: `{ id, role: MemberRole, isActive, joinedAt, user: UserInfo }`.

**InviteResponseDto** ([invite-response.dto.ts](src/modules/group/dtos/invite-response.dto.ts))
| Campo | Tipo |
| --- | --- |
| `id` | string |
| `email` | string |
| `token` | string (UUID) |
| `status` | `InviteStatus` |
| `expiresAt` | Date |
| `acceptedAt` | Date \| null |
| `group` | `{ id, name }` \| null |
| `invitedByUser` | `{ name, email, photo? }` \| null |

**Regras de convite:**

- Um convite expira em **7 dias** a partir da criação.
- A unicidade é `(groupId, email, status)` — só pode existir um convite `PENDING` por email por grupo.
- Convite `PENDING` com `expiresAt` passado passa a `EXPIRED` (aplicado nas rotas de listagem/aceitação).

---

### Invites

Tag Swagger: `Invites`. Controller: [invite.controller.ts](src/modules/group/invite.controller.ts).

Rotas consumidas pelo **convidado** (o que recebe o convite). Todas **protegidas**.

| Método | Rota | Corpo | Resposta |
| --- | --- | --- | --- |
| GET | `/invites/pending` | — | `InviteResponseDto[]` (convites `PENDING` cujo email bate com o do usuário logado) |
| POST | `/invites/:token/accept` | — | `{ message: "Invite accepted successfully" }` |
| POST | `/invites/:token/reject` | — | `{ message: "Invite rejected successfully" }` |

**Regras:**

- O `email` do convite precisa bater com o `email` do usuário autenticado — caso contrário, `403 Forbidden`.
- Aceitar: cria `GroupMember` com `role: MEMBER`, `isActive: true`; marca o invite como `ACCEPTED`.
- Rejeitar: marca como `REJECTED`. Só funciona em convites `PENDING`.
- Convite expirado/usado → `400`.

---

### Balance

Tag Swagger: `Balance`. Controller: [balance.controller.ts](src/modules/balance/balance.controller.ts).

| Método | Rota | Query | Resposta |
| --- | --- | --- | --- |
| GET | `/balance` | `groupId?`, `startDate?`, `endDate?` | `BalanceResponseDto` |

**BalanceResponseDto** ([balance-response.dto.ts](src/modules/balance/dtos/balance-response.dto.ts))
| Campo | Tipo | Descrição |
| --- | --- | --- |
| `totalBalance` | number | receitas − despesas |
| `totalIncome` | number | soma `INCOME` |
| `totalExpense` | number | soma `EXPENSE` |

- Sem `groupId` → saldo das transações pessoais do usuário.
- Com `groupId` → saldo das transações do grupo (usuário precisa ser membro).

---

### Chat Sessions

Tag Swagger: `Chat Sessions`. Controller: [chat-session.controller.ts](src/modules/chat-session/chat-session.controller.ts).

| Método | Rota | Corpo | Resposta |
| --- | --- | --- | --- |
| POST | `/chat-session` | `CreateSessionDto` | `{ id }` |
| GET | `/chat-session` | — | `{ id }[]` (sessões do usuário) |
| GET | `/chat-session/:id` | — | `{ id }` |

**CreateSessionDto** ([create-session.dto.ts](src/modules/chat-session/dtos/create-session.dto.ts))
| Campo | Tipo | Obrigatório | Valores |
| --- | --- | --- | --- |
| `platform` | `Platform` | não (default `APP`) | `APP` \| `WHATSAPP` |

Use o `id` retornado para conectar ao WebSocket (próxima seção).

---

### Chat Messages (REST)

Controller: [chat-message.controler.ts](src/modules/chat-message/chat-message.controler.ts).

Endpoint alternativo (síncrono) para enviar mensagens sem WebSocket — útil para testes.

| Método | Rota | Corpo | Resposta |
| --- | --- | --- | --- |
| POST | `/chat-message/:sessionId` | `ChatRequestDto` | `ChatResponseDto` |

**ChatRequestDto**: `{ message: string }` (não vazio).
**ChatResponseDto**: `{ reply: string }`.

## WebSocket — Chat com IA

Gateway: [chat.gatway.ts](src/modules/chat-message/chat.gatway.ts).

### Conexão

- **Protocolo:** Socket.io 4 (compatível com cliente `socket.io-client`).
- **Namespace:** `/chat` — conecte em `ws://<host>:3001/chat` (ou `wss://` em produção).
- **Autenticação:** o gateway **não** valida JWT explicitamente hoje — o controle de acesso é feito pela posse do `sessionId` (que só é criado via REST autenticada).

### Eventos

Cliente → servidor:

| Evento | Payload | Comportamento |
| --- | --- | --- |
| `join` | `{ sessionId: string }` | Entra no room `sessionId`. Se a sessão não existir, emite `chat.error` e **desconecta** o socket. |
| `message` | `{ sessionId: string; message: string }` | Envia mensagem do usuário para o OpenAI. A resposta é broadcast para **todos no room**. |

Servidor → cliente:

| Evento | Payload | Quando |
| --- | --- | --- |
| `chat.reply` | `string` (texto da resposta da IA) | Após a IA responder com sucesso (emitido em broadcast no room). |
| `chat.error` | `{ status: string }` | Sessão inexistente, erro na IA, ou payload inválido. |

### Comportamento da IA

- Modelo: `gpt-4o-mini`
- Temperatura: `0` (respostas determinísticas)
- A conversa é persistida em `ChatMessage` com `sender = USER | ASSISTANT`.
- Quando a conversa cresce, a sessão armazena um `summary` para não estourar o contexto.
- O assistente pode criar transações automaticamente quando o usuário descreve um gasto/receita — a mensagem criada é ligada à `Transaction` via `transactionId`.

## Modelo de Dados e Enums

Fonte de verdade: [prisma/schema.prisma](prisma/schema.prisma).

### Entidades principais

| Entidade | Campos (relevantes para consumidor) |
| --- | --- |
| `User` | `id`, `email`, `name`, `lastName?`, `photo?`, `googleId?`, `appleId?` |
| `Transaction` | `id`, `userId`, `amount`, `type`, `categoryId`, `description?`, `date`, `groupId?` |
| `Category` | `id`, `name` |
| `Group` | `id`, `name`, `description?`, `ownerId`, `editPermission` |
| `GroupMember` | `id`, `groupId`, `userId`, `role`, `isActive`, `joinedAt` |
| `GroupInvite` | `id`, `groupId`, `email`, `token`, `invitedBy`, `status`, `expiresAt`, `acceptedAt?` |
| `ChatSession` | `id`, `userId`, `platform`, `summary?`, `messageCount` |
| `ChatMessage` | `id`, `sessionId`, `parentId?`, `sender`, `messageType`, `content`, `transcript?`, `timestamp`, `transactionId?` |

Lembre: os responses sempre vêm filtrados pelos DTOs listados na seção de endpoints — nem todos os campos da tabela são expostos.

### Enums

| Enum | Valores | Uso |
| --- | --- | --- |
| `TransactionType` | `INCOME`, `EXPENSE` | tipo de transação |
| `EditPermission` | `OWNER_ONLY`, `ALL_MEMBERS`, `OWN_TRANSACTIONS_ONLY` | política de edição de transações de grupo |
| `MemberRole` | `OWNER`, `MEMBER` | papel em `GroupMember` |
| `InviteStatus` | `PENDING`, `ACCEPTED`, `EXPIRED`, `REJECTED` | status de `GroupInvite` |
| `Platform` | `APP`, `WHATSAPP` | origem da `ChatSession` |
| `Sender` | `USER`, `ASSISTANT` | autor de `ChatMessage` |
| `MessageType` | `TEXT`, `AUDIO` | formato de `ChatMessage` |

## Códigos de Erro

Formato padrão do NestJS:

```
{
  "statusCode": <int>,
  "message": <string | string[]>,
  "error": <string>
}
```

| Status | Quando ocorre |
| --- | --- |
| `400 Bad Request` | Falha de validação do `ValidationPipe` (campo faltando, tipo inválido, campo extra proibido). Também: convite expirado, grupo com transações (delete), owner tentando sair do próprio grupo. |
| `401 Unauthorized` | Sem header `Authorization`, JWT inválido/expirado, credenciais erradas no `/auth/login`, tentativa de login com senha em conta OAuth. |
| `403 Forbidden` | Violação de permissão: não é membro do grupo, não é owner em rota restrita, convite não pertence ao email do usuário logado, edit permission do grupo bloqueia a ação. |
| `404 Not Found` | Recurso não existe (usuário, transação, grupo, categoria, convite, sessão de chat). |
| `409 Conflict` | Email já registrado em `/auth/register`. |

## Rodando Localmente

### Pré-requisitos

- Node.js (compatível com NestJS 11)
- Yarn 1.x (`packageManager` fixado em `yarn@1.22.22`)
- PostgreSQL rodando localmente

### Passos

```bash
# 1. Instalar dependências (postinstall roda `prisma generate`)
yarn install

# 2. Criar .env com as variáveis abaixo

# 3. Aplicar migrations
npx prisma migrate dev

# 4. Subir em modo dev (watch)
yarn start:dev
```

A API sobe em `http://localhost:3001` e o Swagger em `http://localhost:3001/api`.

### Variáveis de ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | sim | Connection string do Postgres (`postgresql://user:pass@host:5432/db`) |
| `JWT_SECRET` | sim | Segredo para assinar JWTs |
| `GOOGLE_CLIENT_ID` | sim (se usar login Google) | Client ID do projeto no Google Cloud |
| `APPLE_BUNDLE_ID` | sim (se usar login Apple) | Bundle ID do app iOS (audience do token Apple) |
| `OPENAI_API_KEY` | sim (se usar chat IA) | Chave da API OpenAI |
| `PORT` | não | Default `3001` |
| `NODE_ENV` | não | Use `production` em deploy |

### Scripts úteis ([package.json](package.json))

```bash
yarn start            # start padrão
yarn start:dev        # watch mode
yarn start:prod       # rodar dist/ (após build)
yarn build            # prisma generate + nest build
yarn lint             # eslint --fix
yarn test             # jest
yarn test:e2e         # jest config e2e
```

## Deploy

Instruções completas de deploy em Render.com (build, migrations, GitHub Actions, deploy hook): [DEPLOY.md](DEPLOY.md).
