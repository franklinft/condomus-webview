# Tarefas: validação de visitante por QR Code

## Fase 1: definição e contratos

## Produto e regras

- [ ] Confirmar os atores e permissões.
- [x] Definir período de validade do convite: 1 dia.
- [x] Definir o QR Code como uso único.
- [x] Definir regras de revogação antes da validação.
- [x] Definir estados oficiais do convite.
- [x] Definir mensagens de sucesso e recusa.

## Tecnologia

- [x] Definir estratégia de leitura do QR Code com `BarcodeDetector`.
- [x] Definir contrato de criação do convite.
- [x] Definir contrato de revogação do convite.
- [x] Definir contrato de validação.
- [x] Definir contrato de sincronização offline.
- [x] Definir requisito de sinalização do morador após validação.
- [x] Definir formato do token/identificador sem dados pessoais.
- [x] Confirmar que a validação deve funcionar offline.
- [ ] Definir sincronização da revogação para portarias offline.
- [ ] Definir prevenção de uso duplicado entre portarias offline.
- [ ] Definir auditoria das tentativas.
- [ ] Definir contrato do evento de chegada no backend.
- [ ] Definir canal de entrega da notificação ao morador.
- [ ] Definir persistência, leitura e reenvio das notificações.

## Implementação

- [x] Criar a página de cadastro do convite.
- [x] Criar a página de visualização e compartilhamento do QR Code.
- [x] Adicionar compartilhamento nativo do QR Code para o WhatsApp.
- [x] Criar a área pública não autenticada do convite.
- [x] Criar a página de leitura na portaria.
- [x] Criar a ação de revogação do convite.
- [x] Criar os serviços e tipos do domínio.
- [x] Implementar estados de loading, sucesso, recusa e erro.
- [ ] Validar os critérios de aceite.

## Fase 2: validação integrada

- [ ] Executar o quickstart em HTTP.
- [ ] Executar o quickstart em HTTPS com câmera.
- [ ] Validar o fluxo entre dois dispositivos.
- [ ] Registrar divergências na especificação.
