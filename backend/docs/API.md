# Keeperme API

API REST para gerenciamento financeiro pessoal e em grupo.

**Stack:** NestJS, Prisma ORM, PostgreSQL
**Porta padrão:** 3001
**Swagger:** disponível em `/api`

---

## Autenticacao

Todas as rotas protegidas exigem o header:

```
Authorization: Bearer <jwt_token>
```

O payload do JWT contém `{ sub: userId, email: string }`.

**Rotas públicas** (não exigem token):
- `POST /auth/google`
- `POST /auth/apple`
- `POST /user`
- `GET /`

---

## Validacao Global

- `ValidationPipe` com `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- Propriedades não declaradas nos DTOs são rejeitadas automaticamente

---

## Endpoints

### Auth (`/auth`)

#### `POST /auth/google`

Login via Google OAuth.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| token | string | sim |

**Resposta** `201`:
```json
{
  "id": "uuid",
  "name": "string",
  "lastName": "string | null",
  "email": "string",
  "photo": "string | null"
}
```

---

#### `POST /auth/apple`

Login via Apple ID.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| identityToken | string | sim |
| email | string | não |
| fullName | string | não |

**Resposta** `201`: mesmo formato de `/auth/google`.

---

#### `POST /auth/me`

Auto sign-in com JWT. Retorna os dados do usuário autenticado.

**Autenticação:** JWT obrigatório
**Body:** nenhum

**Resposta** `201`: mesmo formato de `/auth/google`.

---

### Usuários (`/user`)

#### `POST /user`

Cria um novo usuário.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| email | string | sim |
| name | string | sim |
| lastName | string | sim |
| googleId | string | não |
| appleId | string | não |
| photo | string | não |

**Resposta** `201`: objeto User completo.

---

#### `GET /user/:id`

Retorna um usuário pelo ID.

**Autenticação:** JWT obrigatório

**Resposta** `200`: objeto User.

---

#### `GET /user/google/:googleId`

Retorna um usuário pelo Google ID.

**Autenticação:** JWT obrigatório

**Resposta** `200`: objeto User.

---

#### `PATCH /user/:id`

Atualiza dados do usuário.

**Autenticação:** JWT obrigatório

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | não |
| lastName | string | não |
| photo | string | não |

**Resposta** `200`: objeto User atualizado.

---

#### `DELETE /user/:id`

Remove um usuário.

**Autenticação:** JWT obrigatório

**Resposta** `200`:
```json
{ "message": "string" }
```

---

### Categorias (`/categories`)

Todas as rotas exigem JWT.

#### `POST /categories`

Cria uma categoria.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | sim |

**Resposta** `201`: objeto Category.

---

#### `GET /categories`

Lista todas as categorias.

**Resposta** `200`: `Category[]`

---

#### `GET /categories/:id`

Retorna uma categoria pelo ID.

**Resposta** `200`: objeto Category.

---

#### `PATCH /categories/:id`

Atualiza uma categoria.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | sim |

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `DELETE /categories/:id`

Remove uma categoria.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

### Transações (`/transactions`)

Todas as rotas exigem JWT.

#### `POST /transactions`

Cria uma transação.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| amount | number | sim |
| type | `INCOME` \| `EXPENSE` | sim |
| categoryId | string (UUID) | sim |
| description | string | não |
| date | string (ISO 8601) | não |
| groupId | string (UUID) | não |

**Resposta** `201`: `TransactionResponseDto`

```json
{
  "id": "uuid",
  "amount": 150.00,
  "type": "EXPENSE",
  "description": "string | null",
  "date": "2025-01-15",
  "category": {
    "id": "uuid",
    "name": "string"
  },
  "group": {
    "id": "uuid",
    "name": "string"
  },
  "user": {
    "id": "uuid",
    "name": "string",
    "email": "string"
  },
  "groupId": "uuid | null"
}
```

---

#### `GET /transactions`

Lista transações do usuário autenticado.

| Query Param | Tipo | Obrigatório |
|-------------|------|-------------|
| groupId | string (UUID) | não |

**Resposta** `200`: `TransactionResponseDto[]`

---

#### `GET /transactions/:id`

Retorna uma transação pelo ID.

**Resposta** `200`: `TransactionResponseDto`

---

#### `PATCH /transactions/:id`

Atualiza uma transação.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| amount | number | não |
| type | `INCOME` \| `EXPENSE` | não |
| categoryId | string (UUID) | não |
| description | string | não |
| date | string (ISO 8601) | não |

**Resposta** `200`: `TransactionResponseDto`

---

#### `DELETE /transactions/:id`

Remove uma transação.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `GET /transactions/all-categories`

Retorna o total gasto por todas as categorias.

| Query Param | Tipo | Obrigatório |
|-------------|------|-------------|
| groupId | string (UUID) | não |
| type | `INCOME` \| `EXPENSE` | não |
| startDate | string (YYYY-MM-DD) | não |
| endDate | string (YYYY-MM-DD) | não |

**Resposta** `200`: `CategoryTotalDto[]`

```json
[
  {
    "categoryId": "uuid",
    "categoryName": "string",
    "total": 500.00,
    "transactionCount": 10
  }
]
```

---

#### `GET /transactions/category/:id`

Retorna o total gasto por uma categoria específica.

Aceita os mesmos query params de `/transactions/all-categories`.

**Resposta** `200`: `CategoryTotalDto`

---

### Saldo (`/balance`)

#### `GET /balance`

Retorna o saldo do usuário autenticado.

**Autenticação:** JWT obrigatório

| Query Param | Tipo | Obrigatório |
|-------------|------|-------------|
| groupId | string (UUID) | não |

**Resposta** `200`:

```json
{
  "totalBalance": 1500.00,
  "totalIncome": 3000.00,
  "totalExpense": 1500.00
}
```

---

### Grupos (`/groups`)

Todas as rotas exigem JWT.

#### `POST /groups`

Cria um grupo. O usuário autenticado se torna o owner.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string (1-100 chars) | sim |
| description | string | não |
| editPermission | `OWNER_ONLY` \| `ALL_MEMBERS` \| `OWN_TRANSACTIONS_ONLY` | sim |

**Resposta** `201`: `GroupResponseDto`

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string | null",
  "editPermission": "OWN_TRANSACTIONS_ONLY",
  "owner": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "photo": "string | null"
  },
  "members": [
    {
      "id": "uuid",
      "role": "OWNER",
      "isActive": true,
      "joinedAt": "datetime",
      "user": {
        "id": "uuid",
        "name": "string",
        "email": "string",
        "photo": "string | null"
      }
    }
  ],
  "transactionCount": 0,
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

#### `GET /groups`

Lista todos os grupos do usuário autenticado.

**Resposta** `200`: `GroupResponseDto[]`

---

#### `GET /groups/:id`

Retorna um grupo pelo ID.

**Resposta** `200`: `GroupResponseDto`

---

#### `PATCH /groups/:id`

Atualiza um grupo. Apenas o owner pode atualizar.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| name | string | não |
| description | string | não |
| editPermission | `OWNER_ONLY` \| `ALL_MEMBERS` \| `OWN_TRANSACTIONS_ONLY` | não |

**Resposta** `200`: `GroupResponseDto`

---

#### `DELETE /groups/:id`

Remove um grupo. Apenas o owner pode remover. O grupo não pode ter transações.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `POST /groups/:id/invites`

Cria um convite para o grupo. Apenas o owner pode convidar.

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| email | string (email válido) | sim |

**Resposta** `201`: `InviteResponseDto`

```json
{
  "id": "uuid",
  "email": "string",
  "token": "uuid",
  "status": "PENDING",
  "expiresAt": "datetime",
  "acceptedAt": null,
  "group": {
    "id": "uuid",
    "name": "string"
  },
  "invitedByUser": {
    "name": "string",
    "email": "string",
    "photo": "string | null"
  },
  "createdAt": "datetime"
}
```

---

#### `GET /groups/:id/invites`

Lista todos os convites do grupo.

**Resposta** `200`: `InviteResponseDto[]`

---

#### `DELETE /groups/:id/invites/:inviteId`

Cancela um convite.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `DELETE /groups/:id/members/:userId`

Remove um membro do grupo. O owner pode remover qualquer membro. Membros podem remover a si mesmos.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `GET /groups/:id/transactions`

Lista as transações do grupo.

**Resposta** `200`: `TransactionResponseDto[]`

---

### Convites (`/invites`)

Todas as rotas exigem JWT.

#### `GET /invites/pending`

Lista os convites pendentes para o email do usuário autenticado.

**Resposta** `200`: `InviteResponseDto[]`

---

#### `POST /invites/:token/accept`

Aceita um convite pelo token.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

#### `POST /invites/:token/reject`

Rejeita um convite pelo token.

**Resposta** `200`:
```json
{ "message": "string" }
```

---

## Enums

| Enum | Valores |
|------|---------|
| TransactionType | `INCOME`, `EXPENSE` |
| EditPermission | `OWNER_ONLY`, `ALL_MEMBERS`, `OWN_TRANSACTIONS_ONLY` |
| MemberRole | `OWNER`, `MEMBER` |
| InviteStatus | `PENDING`, `ACCEPTED`, `EXPIRED`, `REJECTED` |

---

## Modelos do Banco

### User

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| email | string | único |
| name | string | |
| lastName | string? | |
| googleId | string? | único |
| appleId | string? | único |
| photo | string? | URL |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Transaction

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| userId | UUID | FK -> User |
| categoryId | UUID | FK -> Category |
| groupId | UUID? | FK -> Group |
| amount | Float | |
| type | TransactionType | |
| description | string? | |
| date | DateTime | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Category

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| name | string | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### Group

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| name | string | |
| description | string? | |
| ownerId | UUID | FK -> User |
| editPermission | EditPermission | default: OWN_TRANSACTIONS_ONLY |
| createdAt | DateTime | |
| updatedAt | DateTime | |

### GroupMember

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| groupId | UUID | FK -> Group |
| userId | UUID | FK -> User |
| role | MemberRole | default: MEMBER |
| isActive | boolean | default: true |
| joinedAt | DateTime | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Constraint único: `(groupId, userId)`

### GroupInvite

| Campo | Tipo | Notas |
|-------|------|-------|
| id | UUID | PK |
| groupId | UUID | FK -> Group |
| email | string | |
| token | UUID | único |
| invitedBy | UUID | FK -> User |
| status | InviteStatus | default: PENDING |
| expiresAt | DateTime | 7 dias após criação |
| acceptedAt | DateTime? | |
| createdAt | DateTime | |
| updatedAt | DateTime | |

Constraint único: `(groupId, email, status)`

---

## Permissões de Grupo

| Ação | Quem pode |
|------|-----------|
| Criar grupo | Qualquer usuário autenticado |
| Atualizar grupo | Apenas o owner |
| Deletar grupo | Apenas o owner (sem transações) |
| Criar convite | Apenas o owner |
| Remover membro | Owner (qualquer) ou o próprio membro |
| Criar transação no grupo | Depende do `editPermission` |
| Editar transação no grupo | Depende do `editPermission` |

**EditPermission:**
- `OWNER_ONLY` — apenas o owner pode editar transações
- `ALL_MEMBERS` — todos os membros podem editar transações
- `OWN_TRANSACTIONS_ONLY` — membros editam apenas suas próprias transações
