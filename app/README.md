# Condomus Webview

Webview do Condomus para gerenciamento de visitantes, convites com QR Code e
validação na portaria. O projeto funciona atualmente com um mock compartilhado
entre dispositivos na rede local.

## Requisitos

- Node.js `>= 20.9.0`
- npm
- OpenSSL (necessário apenas para o modo HTTPS)

## Instalação

```bash
cd app
npm install
```

## Desenvolvimento

### HTTP

Para executar a aplicação e o mock server:

```bash
npm run dev
```

Acesse:

- Aplicação: <http://localhost:3000>
- Pela rede local: `http://<IP-DA-MAQUINA>:3000`
- Mock server: `http://<IP-DA-MAQUINA>:9000`

O mock server mantém os convites em memória e compartilha o estado entre
dispositivos que acessam o mesmo endereço da máquina hospedeira.

### HTTPS e câmera

A câmera do navegador exige um contexto seguro em dispositivos móveis:

```bash
npm run dev:camera
```

Acesse:

```text
https://<IP-DA-MAQUINA>.nip.io:3000
```

No primeiro acesso, aceite o certificado local no navegador. O mock server
HTTPS usa a porta `9001`.

O certificado é gerado em `app/certificates/` e não deve ser versionado.

## Fluxos disponíveis

| Rota | Objetivo |
| --- | --- |
| `/login` | Acesso visual ao sistema |
| `/home` | Painel do morador e visitantes agendados |
| `/new-invitation` | Criação, visualização, revogação e compartilhamento do convite |
| `/visitor-access` | Consulta pública do convite pelo token |
| `/qr-reader` | Leitura e validação do QR Code na portaria |

Fluxo principal:

1. O morador cria um convite.
2. O sistema gera um QR Code e um link público.
3. O morador compartilha o convite pelo WhatsApp.
4. O visitante apresenta o QR Code na portaria.
5. O porteiro valida o convite.
6. O sistema impede convites expirados, revogados ou já utilizados.
7. Após a validação, o porteiro pode abrir o WhatsApp com uma mensagem pronta
   para avisar o morador. O envio é confirmado manualmente e não usa API paga.

## Limitações atuais do mock

- Os dados são mantidos em memória pelo mock server e são perdidos ao
  reiniciá-lo.
- O número do WhatsApp do morador é fixo para testes e está definido em
  `mock/index.mjs`.
- O envio pelo WhatsApp depende da confirmação manual do porteiro.
- Não há autenticação real nem integração com backend.
- A validação offline está documentada, mas a sincronização real ainda depende
  do backend futuro.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Next.js HTTP + mock server HTTP |
| `npm run dev:camera` | Next.js HTTPS + mock server HTTPS |
| `npm run lint` | Executa o ESLint |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o build de produção |

## Estrutura

```text
app/
├── mock/                 # Handlers e estado dos mocks
├── scripts/               # Mock server HTTP/HTTPS
├── src/app/               # Rotas Next.js
├── src/domain/            # Domínios, serviços e contratos
├── src/shared/            # Componentes e utilitários compartilhados
└── certificates/          # Certificados locais gerados no modo HTTPS
```

As especificações funcionais e decisões técnicas ficam em
[`../specs`](../specs). As regras de arquitetura e desenvolvimento ficam em
[`../AGENTS.md`](../AGENTS.md).

## Validação local

```bash
npm run lint
npm run build
```

O lint pode apresentar warnings conhecidos de `react-hook-form.watch` e do uso
de `<img>` no componente de QR Code; eles não impedem o build.
