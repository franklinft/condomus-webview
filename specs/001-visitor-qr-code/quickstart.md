# Quickstart: convite e QR Code

## Preparação

```bash
cd app
npm install
npm run dev
```

Para testar a câmera em outro dispositivo:

```bash
npm run dev:camera
```

Aceite o certificado local e acesse
`https://<IP-DA-MAQUINA>.nip.io:3000`.

## Cenário principal

1. Acesse `/login` e entre em `/home`.
2. Abra `/new-invitation`.
3. Crie um convite e confirme a geração do QR Code.
4. Abra o link público em `/visitor-access`.
5. Na portaria, abra `/qr-reader` e valide o QR Code.
6. Confirme a mensagem de acesso liberado.
7. Clique em **Avisar pelo WhatsApp** e confirme o envio manual.

## Cenários de recusa

- Revogue o convite antes da leitura e confirme a recusa.
- Valide o mesmo convite duas vezes e confirme que o segundo uso é recusado.
- Use um token inválido e confirme que nenhum dado sensível é exposto.

## Critério de conclusão

O fluxo principal e os cenários de recusa devem funcionar, e `npm run lint` e
`npm run build` devem concluir sem erros.
