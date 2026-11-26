# Contrato: convite de visitante

## Criar convite

`POST /v1/visitor-invitations`

```ts
{
  visitorName: string;
  visitorType: string;
  additionalInfo: string;
}
```

Retorna um `VisitorInvitation` com validade de um dia.

## Revogar convite

`POST /v1/visitor-invitations/revoke`

```ts
{
  invitationId: string;
}
```

Somente convites pendentes podem ser revogados.

## Validar convite

`POST /v1/visitor-invitations/validate`

```ts
{
  token: string;
  validationId: string;
  validatedAt: string;
}
```

Retorna o resultado da validação e, no mock, uma URL `wa.me` com a mensagem
preparada para o morador.

## Consulta pública

`GET /v1/visitor-invitations/public?token=<token>`

Retorna somente os dados necessários para exibir o convite público.
