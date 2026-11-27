# Especificação técnica de referência do backend

## 1. Objetivo

Este documento descreve o comportamento atualmente implementado no frontend
Condomus Webview e no mock HTTP/HTTPS utilizado durante o desenvolvimento.
Deve ser utilizado como referência para a implementação do backend real,
preservando os contratos em inglês e os fluxos observáveis pelo frontend.

O documento descreve o comportamento existente, mas também identifica
requisitos de segurança que não devem ser reproduzidos literalmente no mock,
como credenciais em texto puro, armazenamento de sessão em memória e confiança
em identificadores enviados pelo cliente.

## 2. Convenções gerais

- Todas as propriedades de API permanecem em inglês.
- Textos apresentados ao usuário permanecem em português e não fazem parte do
  contrato de domínio.
- As respostas seguem, quando aplicável, o envelope:

```json
{
  "success": true,
  "data": {}
}
```

- Datas são strings ISO 8601 em UTC.
- Identificadores são strings opacas e não devem carregar regras de negócio.
- O frontend usa `Authorization: Bearer <accessToken>` nas operações
  autenticadas.
- O backend real deve responder com códigos HTTP semânticos, além do envelope
  compatível com o frontend.
- Erros de validação, autenticação, autorização, conflito e recurso inexistente
  devem ser distinguíveis por um `code` estável.

## 3. Contexto de identidade e multi-tenant

### 3.1 Entidades

| Entidade | Responsabilidade |
|---|---|
| `person` | Identidade física do usuário |
| `account` | Conta/organização à qual a pessoa está vinculada |
| `tenant` | Condomínio ou contexto isolado de dados |
| `personAccount` | Associação da pessoa com uma conta |
| `accountTenant` | Associação da conta com um tenant |

O contexto autorizado deve ser representado pela associação:

```ts
type TenantAssociation = {
  personId: string;
  accountId: string;
  tenantId: string;
  accountStatus: "active" | "inactive";
};
```

Uma pessoa pode possuir mais de uma associação. O backend nunca deve aceitar
um `tenantId` arbitrário como prova de pertencimento.

### 3.2 Status da conta

O frontend conhece atualmente:

```ts
type AccountStatus = "active" | "inactive";
```

Somente associações com `accountStatus: "active"` podem criar uma sessão
autorizada para uso do aplicativo.

## 4. Autenticação

### 4.1 Login

`POST /v1/auth/login`

Request:

```ts
type LoginCredentials = {
  email: string;
  password: string;
};
```

Response de sucesso:

```ts
type AuthTokenResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  expiresAt: string;
  personId: string;
  accountId: string;
  tenantId: string;
};
```

Exemplo:

```json
{
  "success": true,
  "data": {
    "accessToken": "opaque-token",
    "tokenType": "Bearer",
    "expiresIn": 3600,
    "expiresAt": "2026-11-26T20:10:26.069Z",
    "personId": "person-001",
    "accountId": "account-001",
    "tenantId": "tenant-residencial-milano-1"
  }
}
```

Regras observadas:

1. Credenciais inválidas não criam sessão.
2. O token possui validade.
3. O contexto inicial contém `personId`, `accountId` e `tenantId`.
4. O mock escolhe a primeira associação do usuário.

Requisitos do backend real:

- Armazenar senha somente com hash forte e salt.
- Aplicar rate limiting, auditoria e bloqueio progressivo.
- Não retornar senha, hash ou dados internos.
- Não usar `personId`, `accountId` ou `tenantId` recebidos do cliente para
  construir o contexto de autorização.
- Se houver mais de uma associação ativa, retornar as opções disponíveis ou
  exigir uma etapa explícita de seleção de tenant.

### 4.2 Autorização da sessão

`POST /v1/auth/authorize`

Headers:

```http
Authorization: Bearer <accessToken>
```

Request compatível com o frontend atual:

```ts
type AuthorizationRequest = {
  accessToken: string;
  personId: string;
  accountId: string;
  tenantId: string;
};
```

O backend real deve considerar o token do header como fonte de verdade. Os
identificadores no corpo existem apenas por compatibilidade com o mock atual e
não podem ampliar privilégios.

Response:

```ts
type AuthorizationResponse = {
  authorized: boolean;
  accessToken: string;
  personId: string;
  accountId: string;
  tenantId: string;
  accountStatus: "active" | "inactive";
  displayName: string;
};
```

Regras:

- Token inexistente, inválido ou expirado: não autorizado.
- `personId`, `accountId` e `tenantId` devem pertencer à mesma associação.
- Conta inativa: não autorizado.
- Tenant não associado: não autorizado.
- A autorização deve ser reavaliada em operações protegidas; não basta confiar
  no resultado armazenado no frontend.

## 5. Sessão no frontend

Após login e autorização bem-sucedidos, o frontend armazena:

```ts
type AuthSession = AuthorizationResponse & {
  expiresAt: string;
};
```

O backend deve tratar essa sessão local como cache de UX, nunca como mecanismo
de segurança. Toda chamada protegida deve validar o bearer token no servidor.

## 6. Moradores

### 6.1 Listagem

`GET /v1/residents`

Response:

```ts
type ResidentRecord = {
  id: string;
  name: string;
  apartment: string;
  address: string;
  block?: string;
};
```

O resultado deve ser limitado ao `tenantId` autorizado. O frontend usa essa
listagem para confirmar os dados extraídos de etiquetas por OCR.

### 6.2 Associação por OCR

O reconhecimento de etiqueta produz sugestões de:

- `recipientName`;
- `apartment`;
- `address`;
- `carrier`;
- `trackingCode`.

O frontend normaliza acentos, prefixos como `Apto`, `Apartamento` e `Casa`,
e compara nome, unidade e endereço com os moradores. Essa etapa é uma
assistência de preenchimento e não substitui a validação do backend.

O backend deve aceitar `residentId` quando disponível e validar que:

1. o morador pertence ao tenant da sessão;
2. o apartamento e endereço são compatíveis com o cadastro;
3. o usuário possui permissão para registrar encomenda para essa unidade.

## 7. Convites de visitantes

### 7.1 Modelo

```ts
type VisitorInvitation = {
  id: string;
  visitorName: string;
  visitorType: string;
  additionalInfo?: string;
  authorizationMode: "arrival" | "preauthorized";
  apartment: string;
  block?: string;
  createdAt: string;
  expiresAt: string;
  status:
    | "pending"
    | "awaiting_confirmation"
    | "validated"
    | "denied"
    | "revoked"
    | "expired";
  qrCodeToken: string;
  publicUrl: string;
  residentAuthorized?: boolean;
  arrivalRequestedAt?: string;
  authorizedAt?: string;
};
```

### 7.2 Criar convite

`POST /v1/visitor-invitations`

Request observado:

```ts
type CreateVisitorInvitationRequest = {
  visitorName: string;
  visitorType: string;
  additionalInfo?: string;
  authorizationMode?: "arrival" | "preauthorized";
};
```

O mock cria validade de 24 horas, token único e URL pública. O backend real
deve obter `apartment`, `block` e o morador a partir do contexto autorizado,
em vez de fixar os valores usados no mock.

### 7.3 Listar convites e acessos

`GET /v1/accounts`

O frontend usa atualmente esse endpoint para obter uma lista resumida:

```ts
type VisitorSchedule = {
  id: string;
  name: string;
  apartment: string;
  block?: string;
  time: string;
  day: string;
  type: "visitor" | "service" | "delivery";
  accessStatus: string;
};
```

O nome histórico da rota não representa bem seu comportamento. Para o backend
real, recomenda-se preservar a rota durante a migração e planejar uma versão
mais explícita, como `GET /v1/visitor-invitations`.

Os registros devem ser filtrados pelo tenant e pelas unidades que o usuário
está autorizado a consultar.

### 7.4 Revogar convite

`POST /v1/visitor-invitations/revoke`

```ts
{
  invitationId: string;
}
```

Somente convite com status `pending` pode ser revogado. O backend deve validar
que o convite pertence ao tenant e à unidade do usuário.

### 7.5 Consulta pública

`GET /v1/visitor-invitations/public?token=<token>`

Retorna somente dados necessários para a tela pública:

```ts
{
  visitorName: string;
  visitorType: string;
  expiresAt: string;
  status: string;
}
```

Não deve retornar endereço completo, dados do morador, identificadores
internos ou informações administrativas.

### 7.6 Validar QR Code na portaria

`POST /v1/visitor-invitations/validate`

```ts
type ValidateVisitorInvitationRequest = {
  token: string;
  validationId?: string;
  validatedAt?: string;
};
```

Regras de transição:

| Estado atual | Condição | Estado seguinte |
|---|---|---|
| `pending` | `preauthorized` | `validated` |
| `pending` | `arrival` sem autorização | `awaiting_confirmation` |
| `awaiting_confirmation` | morador autoriza | `pending` |
| `awaiting_confirmation` | morador recusa | `denied` |
| `pending` | token expirado | `expired` |
| `pending` | validação aceita | `validated` |
| `revoked`, `denied`, `expired`, `validated` | nova validação | permanece e retorna inválido |

A operação deve ser idempotente e protegida contra uso concorrente. O token
deve ser de uso único após `validated`.

Para `arrival`, a resposta deve indicar:

```ts
{
  valid: false;
  message: string;
  invitation: VisitorInvitation;
  synchronized: boolean;
  requiresResidentConfirmation: true;
  residentWhatsappUrl?: string;
}
```

Para acesso autorizado:

```ts
{
  valid: true;
  message: string;
  invitation: VisitorInvitation;
  synchronized: boolean;
  residentWhatsappUrl?: string;
}
```

O envio de WhatsApp deve ser responsabilidade de um adaptador/notificação,
não da regra principal de validação.

### 7.7 Autorizar entrada pelo morador

`POST /v1/visitor-invitations/authorize`

```ts
{
  invitationId: string;
  authorized: boolean;
}
```

Somente convites em `awaiting_confirmation` podem ser processados. A
autorização deve ser vinculada ao usuário autenticado, tenant e unidade da
solicitação.

### 7.8 Pendências de autorização

`GET /v1/visitor-invitations/pending-authorizations`

Retorna convites no estado `awaiting_confirmation`, filtrados pelo tenant e
pelas unidades autorizadas do morador.

### 7.9 Sincronização offline

`POST /v1/visitor-invitations/sync`

O mock retorna:

```ts
{
  synchronizedIds: string[];
  rejectedIds: string[];
}
```

O backend real deve definir o payload de entrada para validações realizadas
offline, deduplicar por `validationId` e informar individualmente conflitos,
tokens expirados e tokens já utilizados.

## 8. Encomendas

### 8.1 Modelo

```ts
type PackageRecord = {
  id: string;
  residentId?: string | null;
  recipientName: string;
  apartment: string;
  address: string;
  carrier: string;
  trackingCode?: string;
  status: "notified";
  receivedAt: string;
  photoUrl?: string;
};
```

### 8.2 Listar encomendas

`GET /v1/packages`

Retorna as encomendas do tenant, ordenadas pelas mais recentes no frontend.
O backend deve aplicar paginação antes do crescimento da base.

### 8.3 Registrar recebimento

`POST /v1/packages`

```ts
type ReceivePackageRequest = {
  residentId?: string | null;
  recipientName: string;
  apartment: string;
  address?: string;
  carrier?: string;
  trackingCode?: string;
  photoUrl?: string;
};
```

Regras:

- `recipientName` e `apartment` são obrigatórios no fluxo atual.
- `carrier` recebe `"Não informada"` quando ausente no mock.
- `status` inicial é `notified`.
- `receivedAt` é gerado pelo servidor.
- `photoUrl` representa evidência temporária no frontend e não deve ser
  tratado automaticamente como armazenamento permanente.
- O backend deve validar unidade, morador, tenant e permissões.
- `trackingCode` deve ser normalizado e, quando informado, pode possuir
  restrição de unicidade por tenant.

O frontend comprime a imagem para JPEG antes do envio e o mock aceita JSON de
até 2 MB. O backend real deve preferir upload de arquivo ou URL assinada,
limitar tamanho e tipo MIME, remover metadados sensíveis e aplicar expurgo
configurável da evidência.

## 9. Compatibilidade de transporte

O frontend escolhe entre:

1. bridge nativa `ReactNativeWebView`;
2. mock HTTP/HTTPS durante desenvolvimento.

No desenvolvimento browser, o host do mock é derivado do host da aplicação:

- HTTP: porta `9000`;
- HTTPS: porta `9001`.

O servidor deve aceitar `OPTIONS` e os headers:

```http
Content-Type
Accept
Authorization
correlationId
flowId
```

O backend real deve incluir correlação, observabilidade, timeout e tratamento
consistente de erros de rede. O frontend atualmente converte qualquer resposta
HTTP não-2xx em erro de request.

## 10. Envelope de erros

O mock atual retorna apenas `success: false` em alguns casos. O backend deve
padronizar:

```ts
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  correlationId?: string;
};

type ErrorResponse = {
  success: false;
  error: ApiError;
};
```

Códigos mínimos:

| HTTP | `code` | Uso |
|---:|---|---|
| 400 | `VALIDATION_ERROR` | Payload inválido |
| 401 | `AUTHENTICATION_REQUIRED` | Token ausente ou inválido |
| 401 | `INVALID_CREDENTIALS` | Login inválido |
| 403 | `ACCOUNT_INACTIVE` | Conta sem status ativo |
| 403 | `TENANT_ACCESS_DENIED` | Tenant não associado |
| 404 | `RESOURCE_NOT_FOUND` | Recurso inexistente |
| 409 | `STATE_CONFLICT` | Transição inválida ou uso concorrente |
| 410 | `TOKEN_EXPIRED` | Convite/token expirado |
| 413 | `PAYLOAD_TOO_LARGE` | Evidência acima do limite |
| 429 | `RATE_LIMITED` | Excesso de tentativas |

## 11. Requisitos de segurança e integridade

- Todo endpoint, exceto consulta pública explicitamente definida, exige
  autenticação.
- Toda consulta e mutação deve aplicar filtro por `tenantId` no servidor.
- Nunca confiar em `tenantId`, `accountId`, `personId`, `residentId` ou
  `apartment` enviados pelo cliente sem revalidar a associação.
- Tokens de convite devem ser aleatórios, não previsíveis e armazenados com
  hash quando possível.
- Validação de QR deve ser atômica e idempotente.
- Dados de etiqueta e fotos devem ser tratados como entrada não confiável.
- Logs não devem conter senha, token completo, imagem ou dados pessoais além do
  necessário para auditoria.
- Registrar auditoria para login, autorização, criação/revogação de convite,
  validação de QR, autorização de chegada e registro de encomenda.
- Aplicar controle de acesso por papel/permissão além do status da conta.

## 12. Critérios de aceite do backend

1. Usuário ativo consegue autenticar e recebe contexto completo de tenant.
2. Credencial inválida não cria sessão e retorna `INVALID_CREDENTIALS`.
3. Conta inativa não consegue autorização operacional.
4. Token expirado ou inexistente não acessa recursos protegidos.
5. Uma pessoa não consegue acessar tenant, conta, unidade ou morador de outra
   associação.
6. Convite `preauthorized` válido pode ser validado uma única vez.
7. Convite `arrival` gera pendência e só pode ser validado após autorização.
8. Convites revogados, negados e expirados não podem ser reutilizados.
9. Validações concorrentes do mesmo QR produzem somente uma entrada efetiva.
10. Registro de encomenda persiste dados estruturados e valida o morador no
    tenant correto.
11. Upload/evidência respeita limite, MIME permitido e política de expurgo.
12. Todas as respostas de erro possuem status HTTP e código estável.
13. Listagens são filtradas por tenant e respeitam paginação.
14. Operações relevantes possuem `correlationId` e trilha de auditoria.

## 13. Fontes do comportamento observado

- `app/mock/index.mjs`: implementação dos endpoints, estados e dados mockados.
- `app/scripts/mockserver.mjs`: transporte HTTP/HTTPS, CORS e limite JSON.
- `app/src/shared/utils/relations.ts`: relações/endpoints consumidos.
- `app/src/shared/utils/native-communication.ts`: seleção entre bridge nativa
  e mock.
- `app/src/domain/auth`: contratos, autenticação, autorização e sessão.
- `app/src/domain/visitor-qr`: fluxo de convite, QR Code e validação.
- `app/src/domain/packages`: encomendas, OCR, moradores e matching.
- `specs/001-visitor-qr-code`: especificação existente do fluxo de visitantes.
- `specs/003-package-management`: especificação existente de encomendas.

## 14. Pendências para a implementação real

- Definir o provedor de identidade e o formato final do token.
- Definir papéis e permissões de porteiro, morador, administrador e operador.
- Definir seleção de tenant para pessoas com múltiplas associações.
- Definir política de retenção e armazenamento de fotos.
- Definir contrato de sincronização offline.
- Definir serviço de notificações/WhatsApp e seus retries.
- Definir paginação, filtros e ordenação oficiais.
- Definir versionamento da rota histórica `/v1/accounts`.
