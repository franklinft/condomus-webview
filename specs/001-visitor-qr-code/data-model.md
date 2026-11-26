# Modelo de dados: convite de visitante

## Entidades

### VisitorInvitation

Representa um convite criado pelo morador.

- `id`: identificador do convite.
- `visitorName`: nome do visitante.
- `visitorType`: tipo do visitante.
- `additionalInfo`: observações adicionais.
- `createdAt`: data de criação.
- `expiresAt`: fim da validade.
- `status`: `pending`, `validated`, `expired` ou `revoked`.
- `qrCodeToken`: token usado no QR Code.
- `publicUrl`: URL pública do convite.

### VisitorValidatedNotification

Representa o aviso preparado após uma validação bem-sucedida.

- `invitationId`: convite validado.
- `visitorName`: nome do visitante.
- `apartment` e `block`: localização do convite.
- `validatedAt`: data/hora da validação.
- `gatehouseId`: portaria responsável.
- `read`: reservado para o backend futuro.

## Regras de integridade

- Um convite só pode mudar de `pending` para `validated` uma vez.
- Convites `revoked` ou `expired` não podem ser validados.
- O token não deve conter dados pessoais diretamente.
