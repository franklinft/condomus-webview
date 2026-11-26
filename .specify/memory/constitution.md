# Constituição do Condomus Webview

## Princípios

### 1. Especificação antes da implementação

Mudanças de comportamento começam em uma especificação versionada. A
implementação deve atender aos critérios de aceite documentados.

### 2. Simplicidade antes de abstração

Prefira APIs nativas, os padrões já existentes no projeto e a menor solução
que resolva o problema. Dependências novas exigem avaliação registrada.

### 3. Contratos explícitos

Fluxos entre páginas, serviços, mocks e bridge devem possuir tipos e contratos
claros. Mudanças de contrato exigem atualização da especificação e dos testes
ou validações correspondentes.

### 4. Componentes com responsabilidade única

Páginas e containers orquestram serviços e estados assíncronos. Componentes
visuais recebem dados, estados e callbacks por props e não chamam serviços
diretamente.

### 5. Qualidade verificável

Toda mudança deve ser validada com os comandos aplicáveis do projeto. Imports
não utilizados são erros e a interface deve usar Tailwind, sem CSS inline.

### 6. Evolução rastreável

Requisitos novos ou alterados atualizam a spec, o plano, as tarefas e os
contratos afetados antes da implementação.

## Governança

Esta constituição orienta todas as especificações em `specs/`, as instruções em
`.github/` e os agentes do repositório. Exceções devem ser registradas na
specification ou no plano da feature, com justificativa e impacto.
