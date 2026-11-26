# Validação de visitante por QR Code

## Status

Regras principais definidas; contrato técnico de sincronização offline ainda
precisa ser detalhado.

## Objetivo

Permitir que um morador cadastre um visitante e gere um QR Code temporário.
Ao chegar ao condomínio, o porteiro lê o QR Code e o sistema valida se o
acesso está liberado.

## Histórias de usuário

- Como morador, quero criar e compartilhar um convite temporário para que meu
  visitante consiga se identificar na portaria.
- Como porteiro, quero ler e validar o QR Code para liberar ou recusar o acesso
  conforme as regras do convite.
- Como morador, quero ser avisado quando meu visitante chegar para acompanhar
  o atendimento na portaria.

## Atores

- **Morador:** cadastra o visitante e compartilha o QR Code.
- **Visitante:** apresenta o QR Code na portaria.
- **Porteiro:** lê o QR Code e consulta a validade do acesso.
- **Sistema:** gera, consulta e valida o acesso do visitante.

## Fluxo principal

### 1. Cadastro pelo morador

1. O morador acessa a funcionalidade de novo convite.
2. Informa os dados do visitante.
3. O sistema define a validade do acesso para 1 dia.
4. Confirma o cadastro.
5. O sistema cria um convite e gera um QR Code.
6. O morador compartilha o QR Code com o visitante.

### 2. Validação na portaria

1. O visitante apresenta o QR Code.
2. O porteiro abre a interface de leitura.
3. O porteiro aponta a câmera para o QR Code.
4. O sistema lê o identificador do convite.
5. O sistema valida o convite.
6. A interface informa se o acesso está liberado ou recusado.
7. O sistema registra a tentativa de validação.

## Estados do convite

- `pending`: convite criado, ainda não validado.
- `validated`: QR Code validado com sucesso e consumido.
- `expired`: período de validade encerrado.
- `revoked`: acesso cancelado pelo morador antes da validação.
- `denied`: tentativa recusada por regra de acesso.

O estado `revoked` deve impedir qualquer validação posterior do convite.

## Regras de negócio

- O QR Code deve representar um convite específico.
- O convite deve ser válido por 1 dia a partir da sua criação.
- O convite pode ser validado uma única vez.
- A lista de visitantes agendados deve exibir o convite mais recentemente
  criado no primeiro item.
- Após uma validação bem-sucedida, o convite deve ser considerado consumido.
- O morador pode revogar o convite antes da validação.
- O morador deve conseguir compartilhar o QR Code pelo mecanismo nativo de
  compartilhamento do dispositivo, selecionando o WhatsApp quando disponível.
- Um convite expirado ou revogado não pode liberar acesso.
- Um convite já consumido não pode liberar um segundo acesso.
- Uma tentativa com QR Code inválido deve ser recusada sem expor dados sensíveis.
- A validação deve informar claramente o motivo da recusa.
- Toda tentativa de leitura deve ser registrada para auditoria.
- O QR Code não deve conter dados pessoais diretamente; deve conter um
  identificador ou token de convite dentro de uma URL pública protegida.
- O morador compartilha a imagem do QR Code com o visitante pelo WhatsApp.
- O visitante apresenta o QR Code recebido na portaria.
- A validação deve funcionar sem conexão com a internet quando o convite
  estiver disponível na base local da portaria.
- O resultado das validações offline deve ser sincronizado quando a conexão
  estiver disponível.
- Após uma validação bem-sucedida na portaria, o morador deve ser sinalizado
  de que o visitante chegou e teve o acesso liberado.
- A sinalização deve conter, no mínimo, o nome do visitante, o apartamento,
  a data/hora da validação e a portaria responsável quando disponível.
- A sinalização é informativa e não substitui a validação do QR Code.

## Estados da interface de leitura

- Inicial: aguardando permissão e leitura da câmera.
- Permissão negada: orientar o porteiro a habilitar o acesso à câmera.
- Leitura em andamento: câmera ativa e aguardando QR Code.
- QR Code inválido: informar que o código não foi reconhecido.
- Validando: consulta em andamento.
- Acesso liberado: apresentar confirmação visual clara.
- Acesso recusado: apresentar motivo sem expor informações indevidas.
- Erro de comunicação: permitir tentar novamente.
- Sincronização pendente: informar que o resultado será enviado quando houver
  conexão.

## Critérios de aceite

- [ ] O morador consegue cadastrar um visitante e gerar um convite.
- [ ] O convite gera um QR Code compartilhável.
- [ ] O porteiro consegue abrir a interface de leitura.
- [ ] A interface solicita e trata a permissão da câmera.
- [ ] Um QR Code válido libera o acesso conforme as regras do convite.
- [ ] QR Codes inválidos, expirados, revogados ou já consumidos são recusados.
- [ ] O morador consegue revogar um convite ainda não utilizado.
- [ ] A interface apresenta loading, sucesso, recusa e erro de comunicação.
- [ ] A tentativa de validação é registrada.
- [ ] Nenhum dado pessoal sensível é exposto no QR Code.

## Impacto técnico inicial

- Rotas:
  - cadastro de convite;
  - exibição/compartilhamento do QR Code;
  - área pública `/visitor-access`;
  - leitura e validação na portaria.
- Componentes:
  - formulário de visitante;
  - visualização do QR Code;
  - leitor de QR Code;
  - resultado da validação.
- Serviços:
  - criação de convite;
  - geração ou recuperação do QR Code;
  - validação do convite;
  - registro da tentativa.
- Dados:
  - visitante;
  - convite;
  - validade;
  - status;
  - tentativa de validação.
  - fila de sincronização das validações offline.

Cada página/domínio deve seguir a estrutura arquitetural:

```text
<nome-da-pagina>/
├── components/
├── services/
└── data/
```

## Decisões confirmadas

- Validade do convite: 1 dia.
- Uso do QR Code: único.
- Revogação: permitida antes da validação.
- Validação: deve funcionar offline.
- Compartilhamento: o morador envia a imagem do QR Code pelo WhatsApp.
- Área pública: a URL do convite pode ser acessada sem login, usando token
  protegido e sem expor dados sensíveis.

## Decisões pendentes

- Qual será o comportamento quando a câmera não estiver disponível?
- O porteiro precisará estar autenticado?
- Quais dados devem aparecer após uma validação bem-sucedida?
- Qual serviço nativo será usado para a leitura do QR Code?
- Como a revogação será sincronizada com as portarias offline?
- Como evitar que um convite revogado seja validado enquanto uma portaria estiver
  sem conexão?
- Qual armazenamento local será utilizado pela aplicação nativa para suportar a
  validação offline?
- Qual mecanismo entregará a sinalização ao morador: push notification,
  WebSocket, polling ou evento da bridge nativa?
- Como a notificação será armazenada, marcada como lida e reenviada quando o
  morador estiver offline?

## Clarificações

- [NEEDS CLARIFICATION] O porteiro precisará estar autenticado?
- [NEEDS CLARIFICATION] Qual mecanismo substituirá o link `wa.me` no backend
  real para entregar a notificação sem confirmação manual?
- [NEEDS CLARIFICATION] Qual política será aplicada quando uma portaria offline
  validar um convite que foi revogado em outro dispositivo?

## Decisões técnicas

- Geração do QR Code: pacote `qrcode`, versão avaliada `1.5.4`.
- Licença: MIT.
- Adoção observada: aproximadamente 42 milhões de downloads na última semana
  e mais de 8 mil estrelas no repositório.
- Leitura no navegador: API nativa `BarcodeDetector`, sem adicionar uma
  biblioteca de leitura neste momento.
- QR Code: representa a URL pública `/visitor-access?token=<token>`.
- Persistência: não utilizar `localStorage` como fonte de verdade. Criação,
  revogação, validação e sincronização devem passar pelos serviços do domínio
  ou pela bridge nativa.

## Contratos de serviço

### Criar convite

`POST /v1/visitor-invitations`

Entrada:

```ts
{
  visitorName: string;
  visitorType: string;
  additionalInfo: string;
}
```

Saída: `VisitorInvitation`, contendo `id`, `createdAt`, `expiresAt`, `status`
e `qrCodeToken`. A validade de 1 dia é definida pelo serviço.

### Revogar convite

`POST /v1/visitor-invitations/revoke`

Entrada:

```ts
{
  invitationId: string;
}
```

O serviço deve recusar a revogação de convites já validados ou expirados.

### Validar convite

`POST /v1/visitor-invitations/validate`

Entrada:

```ts
{
  token: string;
  validationId: string;
  validatedAt: string;
}
```

Saída: validade, mensagem, convite e indicação de sincronização.

### Sincronizar validações offline

`POST /v1/visitor-invitations/sync`

Entrada: lista de validações realizadas offline. A resposta informa quais
identificadores foram sincronizados ou rejeitados.

### Sinalizar chegada do visitante

Após a validação bem-sucedida, o backend deve publicar um evento associado ao
convite e ao morador. O evento deve permitir uma notificação com:

```ts
{
  invitationId: string;
  visitorName: string;
  apartment?: string;
  block?: string;
  validatedAt: string;
  gatehouseId?: string;
}
```

O canal de entrega e a confirmação de leitura ainda serão definidos durante a
construção do backend.

## Validação planejada

```bash
cd app
npm run lint
npm run build
```

Além das validações técnicas, testar os fluxos de convite válido, expirado,
revogado, consumido, inválido, câmera sem permissão e falha de comunicação.
