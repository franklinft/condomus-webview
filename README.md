# Condomus Webview

Aplicação webview do Condomus para criação e validação de convites de visitantes
por QR Code. O projeto usa Next.js, TypeScript e um mock server compartilhado
para desenvolvimento em múltiplos dispositivos na rede local.

## Começar

```bash
cd app
npm install
npm run dev
```

Abra <http://localhost:3000>. Para acessar de outro dispositivo, use o IP da
máquina hospedeira na porta `3000`.

Para testar a câmera em dispositivos móveis:

```bash
cd app
npm run dev:camera
```

Acesse `https://<IP-DA-MAQUINA>.nip.io:3000` e aceite o certificado local no
primeiro acesso.

## Documentação

- [Guia de desenvolvimento e operação](app/README.md)
- [Especificações](specs/README.md)
- [Instruções do Copilot](.github/copilot-instructions.md)
- [Instruções SDD](.github/instructions/sdd.instructions.md)
- [Skills do projeto](.github/skills/)
- [Instruções de agentes](AGENTS.md)

## Validação

Execute dentro de `app/`, usando Node.js `>=20.9.0`:

```bash
npm run lint
npm run build
```
