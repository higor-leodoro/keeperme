# Revisão do Backend KeeperMe

Revisão técnica do backend NestJS em [backend/](backend/). Este documento registra o estado atual — não prescreve correções.

---

## 1. Sumário executivo

O backend tem **fundamentos sólidos** (módulos bem separados, Prisma + validação via DTO, bcrypt para senhas, validação server-side dos tokens Google/Apple), mas apresenta **problemas críticos de segurança** que precisam ser endereçados antes de uso em produção — principalmente segredos commitados no `.env`, CORS totalmente aberto, bypass de autorização em rotas que retornam dados do usuário e ausência total de rate limiting.

### Resumo por severidade

| Severidade | Quantidade | Foco |
|---|---|---|
| 🚨 Crítico | 8 | Segurança (segredos, autorização, CORS, JWT, rate limit) |
| ⚠️ Médio | 11 | Qualidade, logging, tipagem, convenções |
| ❌ Faltando | 4 | Ops (Dockerfile, health check, testes, .env.example) |
| ✅ Bem feito | 10+ | Arquitetura, OAuth, validação, Prisma |

---

## 2. Pontos positivos (✅)

Coisas que estão bem feitas — **não tocar**:

- **Senhas com bcrypt** (cost factor 10) em [backend/src/modules/auth/auth.service.ts](backend/src/modules/auth/auth.service.ts#L110)
- **Validação server-side do Google ID token** com `google-auth-library` e verificação de audience — [backend/src/modules/auth/auth.service.ts:31-65](backend/src/modules/auth/auth.service.ts#L31-L65)
- **Validação server-side do Apple ID token** com `jose` + JWKS do endpoint oficial, com checagem de issuer e audience — [backend/src/modules/auth/auth.service.ts:149-165](backend/src/modules/auth/auth.service.ts#L149-L165)
- **DTOs com `class-validator`** em todas as rotas de escrita (email, enums, UUIDs, tipos)
- **`ValidationPipe` global** com `whitelist` e `forbidNonWhitelisted` em [backend/src/main.ts](backend/src/main.ts)
- **Módulos bem separados** — 8 domínios: `auth`, `user`, `transaction`, `category`, `group`, `balance`, `chat-message`, `chat-session`
- **Swagger/OpenAPI** configurado com bearer auth, tags e descrições
- **Modelo de permissões de grupo** sofisticado: `OWNER_ONLY`, `ALL_MEMBERS`, `OWN_TRANSACTIONS_ONLY` — respeitado em `transaction.service`
- **Soft delete em `GroupMember`** via flag `isActive`
- **Uso consistente do Prisma** com queries parametrizadas — **sem risco de SQL injection**
- **Cascade rules corretas** nas relações principais (User → Group, GroupMember, ChatSession)

---

## 3. Problemas críticos (🚨)

### 3.1 Segredos commitados no `.env`
Arquivo [backend/.env](backend/.env) contém:
- `JWT_SECRET="@supersecret"` — fraco e público
- `OPENAI_API_KEY=sk-proj-...` — key real exposta
- `GOOGLE_CLIENT_ID` — OAuth client ID
- `DATABASE_URL` com senha do banco

Embora `.env` esteja no `.gitignore` hoje, pode ter sido commitado antes. Vale checar `git log -- backend/.env`.

### 3.2 CORS totalmente aberto
[backend/src/main.ts:12](backend/src/main.ts#L12) chama `app.enableCors()` **sem restringir origem**. Aceita requests de qualquer site — combinado com auth pública, abre margem para CSRF e abuso das rotas de OAuth.

### 3.3 Bypass de autorização em `GET /transaction/:id`
[backend/src/modules/transaction/transaction.controller.ts:72-75](backend/src/modules/transaction/transaction.controller.ts#L72-L75)
```ts
@Get(':id')
async findOne(@Param('id') id: string) {
  return this.transactionService.findOne(id);  // não filtra por userId
}
```
O service em [backend/src/modules/transaction/transaction.service.ts:177-208](backend/src/modules/transaction/transaction.service.ts#L177-L208) busca pelo id sem checar se a transação pertence ao usuário autenticado. **Qualquer usuário logado consegue ler transação alheia** sabendo o UUID.

### 3.4 Bypass de autorização em `ChatSession.findOne()`
[backend/src/modules/chat-session/chat-session.service.ts:56-65](backend/src/modules/chat-session/chat-session.service.ts#L56-L65) faz `findUniqueOrThrow` só pelo `sessionId`, sem checar o `userId`. Mesmo padrão do problema acima.

### 3.5 JWT sem expiração
`JwtService.sign()` é chamado sem `expiresIn` em 4 pontos de [backend/src/modules/auth/auth.service.ts](backend/src/modules/auth/auth.service.ts) (linhas **88, 120, 144, 192**). Tokens emitidos **valem para sempre** — se vazarem, não há como revogar sem trocar o `JWT_SECRET`.

### 3.6 JWT secret fraco
[backend/src/modules/auth/jwt.strategy.ts:20](backend/src/modules/auth/jwt.strategy.ts#L20) — `"@supersecret"` é adivinhável e não aleatório. Deveria ser ≥32 caracteres aleatórios.

### 3.7 Sem rate limiting
Nenhum `ThrottlerModule` configurado no projeto. Endpoints de auth (`/auth/register`, `/auth/login`, `/auth/google`, `/auth/apple`) ficam **expostos a brute force** e enumeração de usuários.

### 3.8 Endpoint público `GET /user/google/:googleId`
[backend/src/modules/user/user.controller.ts:33-35](backend/src/modules/user/user.controller.ts#L33-L35) não tem `@UseGuards` nem `@Public()` explícito, mas o fallback do projeto torna ele público. Permite **enumerar quem usa OAuth Google** na plataforma só iterando IDs.

---

## 4. Questões médias (⚠️)

- **Senha mínima de 6 chars** — [backend/src/modules/auth/dtos/register.dto.ts:12](backend/src/modules/auth/dtos/register.dto.ts#L12). Padrão atual é 8+, idealmente com complexidade.
- **Sem filtro global de exceção** — erros saem com formato inconsistente; erros do Prisma (ex. `P2002`) podem vazar mensagens como "Email already registered" (enumeração).
- **`console.error()` em vez do `Logger` do Nest** — espalhado em `auth.service.ts`, `group.service.ts`, `group-invite.service.ts`, `chat.gatway.ts`. Dificulta log estruturado e filtragem por nível.
- **`tsconfig.json` pouco estrito** — `noImplicitAny: false` habilita ~17 usos de `any` no código (ex.: `whereClauseBase: any` em `balance.service.ts`, `transactionData: any` em `transaction.service.ts`).
- **Falta `.env.example`** — ninguém que clone o repo sabe quais variáveis precisam ser setadas.
- **Sem índices no `User`** para `email`, `googleId`, `appleId` em [backend/prisma/schema.prisma](backend/prisma/schema.prisma). Os campos têm `@unique` (que cria índice implícito em Postgres), então na prática ok, mas vale confirmar performance em produção.
- **Sem versionamento de API** — sem prefixo `/v1`. Qualquer mudança breaking quebra todos os clients.
- **Typos em nomes de arquivo**:
  - `chat-message.controler.ts` → deveria ser `controller.ts`
  - `chat.gatway.ts` → deveria ser `gateway.ts`
- **Endpoints com intenção ambígua de proteção**:
  - `/category` em [backend/src/modules/category/category.controller.ts](backend/src/modules/category/category.controller.ts) — sem `@UseGuards` nem `@Public()` explícitos
  - `/user/:id` idem — dá pra iterar UUIDs para vazar informação
- **DELETEs retornam `200` em vez de `204 No Content`** — não quebra nada, mas foge da convenção REST.
- **Retorno de modelos Prisma crus em alguns endpoints** (`Category`, `User` no `user.controller`) — expõe detalhes do schema direto no response.
- **Falta `maxLength` em campos de texto livre** (ex: `description` da transação pode receber 1MB).
- **Falta `@Min`/`@Max` em `amount`** — valor negativo pode entrar.

---

## 5. Operações / Deploy

- ❌ **Sem Dockerfile** no projeto — deploy depende só do build direto no host.
- ❌ **Sem health check** — nenhum endpoint `/health` ou `/liveness` para load balancer / oncall.
- ❌ **Praticamente sem testes** — apenas [backend/test/app.e2e-spec.ts](backend/test/app.e2e-spec.ts) com o `/ (GET) → Hello World!` padrão do Nest. **Cobertura efetiva ≈ 0%**.
- ⚠️ **Logging via `console.*`** — não é estruturado, não tem níveis, dificulta observabilidade.
- ✅ **`DEPLOY.md` para Render** presente.
- ✅ **`docker-compose.yml`** para dev local (Postgres + PgAdmin) presente — mas usa senha hardcoded (`1234`), aceitável só para dev.

---

## 6. Banco de dados (Prisma)

- ✅ **8 migrations consistentes** e sequenciais em [backend/prisma/migrations/](backend/prisma/migrations/)
- ✅ **Unique constraints** corretos em `email`, `googleId`, `appleId`
- ✅ **Soft delete** em `GroupMember` via `isActive`
- ✅ **Cascade rules** corretas nas relações principais (User → Group, GroupMember, ChatSession)
- ✅ **Composite unique** em `GroupInvite(groupId, email, status)`
- ⚠️ **Nullable fields justificados** — `password`, `googleId`, `appleId` nullable é correto para suportar múltiplos providers

---

## 7. Referências rápidas

### Arquivos para revisar primeiro
- [backend/src/main.ts](backend/src/main.ts) — CORS, pipes globais, Swagger
- [backend/src/modules/auth/auth.service.ts](backend/src/modules/auth/auth.service.ts) — JWT sem expiração, validação OAuth
- [backend/src/modules/auth/jwt.strategy.ts](backend/src/modules/auth/jwt.strategy.ts) — secret fraco
- [backend/src/modules/transaction/transaction.controller.ts](backend/src/modules/transaction/transaction.controller.ts) — bypass de autorização
- [backend/src/modules/chat-session/chat-session.service.ts](backend/src/modules/chat-session/chat-session.service.ts) — bypass de autorização
- [backend/src/modules/user/user.controller.ts](backend/src/modules/user/user.controller.ts) — endpoints públicos ambíguos
- [backend/.env](backend/.env) — segredos
- [backend/tsconfig.json](backend/tsconfig.json) — strictness

### Arquivos para endereçar em fase 2 (qualidade)
- [backend/src/modules/auth/dtos/register.dto.ts](backend/src/modules/auth/dtos/register.dto.ts) — senha
- [backend/prisma/schema.prisma](backend/prisma/schema.prisma) — índices
- `backend/src/modules/chat-message/chat-message.controler.ts` — rename + conteúdo
- `backend/src/modules/chat-message/chat.gatway.ts` — rename + conteúdo
