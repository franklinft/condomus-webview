# Instruções para agentes

## Especialização

Este agente é especializado em React, Next.js, TypeScript e interfaces web.

Priorize:

- componentes funcionais e composição;
- hooks e gerenciamento de estado local;
- rotas e renderização do Next.js;
- formulários tipados e validação;
- acessibilidade, responsividade e consistência visual;
- reutilização de componentes compartilhados.

Ao alterar uma interface:

- preserve os padrões visuais existentes;
- mantenha componentes pequenos e com responsabilidade única;
- evite estado duplicado e efeitos desnecessários;
- use semântica HTML adequada;
- valide estados de carregamento, vazio, sucesso e erro;
- verifique o comportamento em diferentes tamanhos de tela.

## Padrão arquitetural

Cada página ou domínio deve organizar seu código nesta estrutura:

```text
<nome-da-pagina>/
├── components/
├── services/
└── data/
```

- `components/`: componentes e containers específicos da página/domínio.
- `services/`: chamadas de API, bridge nativa e integrações externas.
- `data/`: tipos, contratos, constantes e dados específicos da página/domínio.
- `shared/`: somente componentes, utilitários e tipos realmente reutilizáveis entre páginas.

Componentes visuais não devem chamar serviços diretamente. A página, um container ou
um hook de aplicação deve orquestrar os serviços e passar dados e estados por props.

## Objetivo

Trabalhe neste repositório seguindo Specification-Driven Development (SDD):

1. Entenda o pedido e localize a especificação relacionada em `specs/`.
2. Se não existir uma especificação adequada, crie ou atualize uma antes de implementar.
3. Faça a menor alteração necessária para atender ao escopo.
4. Atualize a documentação relacionada ao comportamento ou contrato alterado.
5. Valide o código e a documentação com os comandos e critérios definidos na especificação.
6. Informe claramente alterações, documentação atualizada, validações executadas e bloqueios.

## Playbooks

### PB-0: Skill de higiene de imports

Ao criar, alterar ou revisar componentes React e páginas TSX:

1. Aplique a skill `.github/skills/clean-imports/SKILL.md`.
2. Revise imports adicionados, removidos e mantidos.
3. Remova imports não utilizados sem alterar o comportamento do componente.
4. Execute `npm run lint` dentro de `app/`.

### PB-1: Análise de impacto

Execute antes de alterar o código:

1. Identifique a especificação e o fluxo afetados.
2. Localize as rotas, componentes, serviços, tipos e integrações relacionados.
3. Verifique dependências entre os arquivos e possíveis efeitos no comportamento existente.
4. Confirme a aderência ao padrão `components/`, `services/` e `data/`.
5. Identifique se a página/container deve orquestrar os serviços e passar dados por props.
6. Avalie dependências novas quanto a segurança, manutenção, licença e adoção.
7. Liste os arquivos que serão criados, alterados ou documentados.
8. Registre riscos, decisões pendentes e critérios de validação.

Saída obrigatória:

- escopo confirmado;
- mapa de impacto;
- aderência arquitetural;
- avaliação de dependências;
- riscos e dependências;
- plano de validação.

### PB-2: Doc-first -> código

Execute depois do PB-1 e antes da implementação:

1. Crie ou atualize a especificação da funcionalidade.
2. Defina objetivo, escopo, regras, estados, erros e critérios de aceite.
3. Registre decisões técnicas relevantes em Markdown.
4. Faça a página ou container orquestrar chamadas de API e estados assíncronos.
5. Use hooks genéricos para comportamentos reutilizáveis; evite hooks específicos de uma única API sem necessidade.
6. Passe dados, estados e callbacks para componentes visuais por props.
7. Avalie bibliotecas novas antes da instalação e registre a decisão na documentação.
8. Implemente o código estritamente conforme a documentação.
9. Atualize `tasks.md` com o progresso e os resultados da validação.
10. Revise a documentação após a implementação para garantir que ela corresponde ao código final.

Critério de conclusão:

- a especificação está atualizada;
- a página/container é responsável pela orquestração dos serviços;
- componentes visuais não fazem chamadas de API;
- hooks específicos só existem quando encapsulam comportamento realmente reutilizável;
- dependências novas foram avaliadas e consideradas seguras e suficientemente adotadas;
- o código atende aos critérios de aceite;
- `tasks.md` registra as validações;
- não existem divergências conhecidas entre documentação e implementação.

### PB-3: Estilização com Tailwind

Ao criar ou alterar componentes, páginas, layouts ou estados visuais:

1. Aplique a skill `.github/skills/tailwind-styling/SKILL.md`.
2. Use classes utilitárias do Tailwind em `className`.
3. Não use `style={{ ... }}` nem CSS inline.
4. Prefira classes arbitrárias do Tailwind para valores dinâmicos.
5. Reutilize estilos e componentes existentes antes de criar novos.
6. Execute `npm run lint` e `npm run build` dentro de `app/`.

### PB-4: Commit e push

Execute este playbook somente após uma solicitação explícita do usuário:

1. Aplique a skill `.github/skills/commit-and-push/SKILL.md`.
2. Revise branch, remote, diff completo e arquivos sensíveis.
3. Execute `npm run lint`, `npm run build` e `git diff --check`.
4. Crie o commit no padrão Conventional Commits
   (`type(scope): description`) e inclua o trailer obrigatório.
5. Faça push para a branch atual sem usar force push.
6. Confirme o hash publicado e as validações executadas.

### PB-5: Design de telas com visão de UX sênior

Ao criar ou modernizar uma tela:

1. Entenda o objetivo principal do usuário e destaque a ação mais importante
   para o contexto da tela, não necessariamente a ação de criação.
2. Em telas operacionais, priorize a visão do estado atual: indicadores,
   pendências, alertas, confirmações e itens recentes.
3. Organize a informação por hierarquia visual clara, reduzindo ruído e
   decisões desnecessárias.
4. Trate ações de criação como CTAs proporcionais ao contexto; elas devem ser
   fáceis de encontrar, mas não dominar a tela quando o usuário precisa
   principalmente monitorar ou resolver pendências.
5. Projete mobile-first, considerando toque, leitura, contraste e diferentes
   tamanhos de tela.
6. Modele explicitamente os estados de carregamento, vazio, sucesso, erro,
   bloqueio e confirmação quando aplicável.
7. Preserve consistência entre tipografia, cores, espaçamentos, ícones,
   componentes e linguagem da aplicação.
8. Garanta acessibilidade básica: semântica, labels, foco visível, áreas de
   toque adequadas e mensagens compreensíveis.
9. Use a skill `tailwind-styling` e valide a tela visualmente no navegador
   sempre que possível.

Padrão de construção modernizada:

- Comece com contexto e resumo da situação atual.
- Exiba indicadores compactos quando ajudarem na tomada de decisão.
- Coloque alertas e confirmações pendentes antes de ações secundárias.
- Use cards com hierarquia, respiro e agrupamento por tarefa.
- Mantenha CTAs de criação compactos quando não forem o objetivo primário.
- Finalize com ações complementares, sem competir visualmente com o conteúdo
  operacional principal.

## Regras de trabalho

- Leia o contexto existente antes de modificar arquivos.
- Preserve o comportamento fora do escopo solicitado.
- Reutilize padrões, componentes e utilitários existentes.
- Use Tailwind para estilização; não utilize CSS inline.
- Ao construir telas, aplique o PB-5: priorize o contexto operacional,
  hierarquia visual, clareza, acessibilidade, responsividade e consistência
  visual. Não transforme automaticamente ações de criação no maior elemento
  da interface.
- Remova imports, variáveis e componentes não utilizados; o lint deve tratar
  imports não utilizados como erro.
- Trate a documentação como parte do código: mudanças de comportamento exigem atualização dos arquivos `.md` relacionados.
- Mantenha specs, planos, tarefas, contratos e decisões técnicas sincronizados
  com a implementação.
- Não adicione dependências sem justificativa e avaliação de segurança, manutenção, licença e adoção.
- Não altere, reverta ou remova mudanças feitas pelo usuário.
- Não faça commit, push, merge ou publicação sem solicitação explícita.
- Não oculte erros com fallbacks silenciosos ou capturas genéricas.
- Mantenha textos da interface em português, salvo requisito contrário.

## Validação

Para alterações na aplicação, execute dentro de `app/`:

```bash
npm run lint
npm run build
```

Use Node.js `>=20.9.0`. Para alterações visuais, verifique também a rota no navegador ou em um servidor local.

## Política de dependências

Antes de instalar qualquer biblioteca:

- confirme que ela é mantida e compatível com a versão atual do projeto;
- verifique vulnerabilidades conhecidas e o histórico de segurança;
- confirme licença compatível com o projeto;
- prefira bibliotecas com adoção relevante, comunidade ativa e uso comprovado;
- verifique downloads, dependentes e atividade recente;
- prefira APIs nativas ou soluções já existentes quando forem suficientes;
- registre a justificativa e a avaliação na especificação ou no plano.

## Entrega

Ao finalizar:

- descreva o que foi alterado;
- liste os arquivos `.md` atualizados ou justifique por que a documentação não foi afetada;
- liste as validações executadas;
- destaque warnings, limitações ou decisões pendentes;
- não declare sucesso se alguma validação essencial tiver falhado.
