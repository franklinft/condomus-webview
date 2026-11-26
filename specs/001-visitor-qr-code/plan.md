# Plano: Validação de visitante por QR Code

## Referência

- Especificação: [`spec.md`](spec.md)
- Tarefas: [`tasks.md`](tasks.md)
- Quickstart: [`quickstart.md`](quickstart.md)
- Contratos: [`contracts/visitor-invitation.md`](contracts/visitor-invitation.md)

## Abordagem

1. Manter a regra de convite no domínio de visitantes.
2. Expor serviços tipados para criação, revogação, consulta pública e
   validação.
3. Usar o mock server compartilhado durante o desenvolvimento em múltiplos
   dispositivos.
4. Manter a leitura no navegador com `BarcodeDetector`.
5. Abrir o WhatsApp com mensagem pronta após uma validação bem-sucedida,
   exigindo confirmação manual do porteiro.

## Componentes afetados

- Rotas Next.js de criação, acesso público e leitura.
- Serviços e tipos em `app/src/domain/visitor-qr/`.
- Handlers em `app/mock/index.mjs`.
- Mock server em `app/scripts/mockserver.mjs`.
- Comunicação em `app/src/shared/utils/native-communication.ts`.

## Riscos e decisões

- O estado do mock é perdido quando o processo é reiniciado.
- O WhatsApp não permite envio automático sem API; o porteiro confirma o
  envio.
- A validação offline e a entrega persistente de notificações dependem do
  backend futuro.

## Validação

```bash
cd app
npm run lint
npm run build
```
