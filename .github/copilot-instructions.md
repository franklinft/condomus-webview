# Condomus Webview

## Desenvolvimento orientado a especificações

Este projeto segue Specification-Driven Development (SDD):

1. Leia a especificação relacionada em `specs/` antes de alterar o código.
2. Se o comportamento ainda não estiver especificado, atualize ou crie uma especificação antes da implementação.
3. Implemente somente o escopo descrito na especificação.
4. Atualize a documentação relacionada sempre que o código, comportamento, contrato ou fluxo mudar.
5. Valide a implementação e a documentação com lint, build e testes aplicáveis.
6. Não considere a tarefa concluída enquanto a documentação estiver desatualizada.

As instruções detalhadas de SDD ficam em `.github/instructions/sdd.instructions.md`.
Skills reutilizáveis ficam em `.github/skills/` e devem ser carregadas somente
quando a tarefa corresponder à descrição da skill.

## Estrutura do projeto

- `app/src/app/`: rotas e páginas Next.js.
- `app/src/domain/`: regras e componentes organizados por domínio.
- `app/src/shared/`: componentes, contexto, configurações e utilitários compartilhados.
- `specs/`: especificações funcionais e técnicas versionadas.
- `.github/skills/`: workflows especializados para agentes.
- `.github/instructions/`: instruções condicionais por caminho.

Cada página ou domínio deve separar seu código em `components/`, `services/` e `data/`.
Use `shared/` somente para código reutilizável entre múltiplas páginas.

## Comandos

Execute os comandos dentro de `app/` usando Node.js `>=20.9.0`:

```bash
npm run dev
npm run lint
npm run build
```

## Convenções

- Preserve o layout, as cores e os padrões de componentes já existentes.
- Ao criar telas, atue com visão de UX sênior: priorize o contexto operacional,
  indicadores, pendências e estados relevantes antes de ações secundárias.
  Ações de criação devem ser CTAs proporcionais e não dominar a tela quando o
  usuário precisa principalmente monitorar ou resolver pendências. Preserve
  hierarquia visual, clareza, acessibilidade, responsividade e estados completos
  da interface.
- Use classes utilitárias do Tailwind para toda estilização de componentes.
- Não use `style={{ ... }}` nem CSS inline.
- Use TypeScript com tipos explícitos para dados de formulário e domínio.
- Reutilize componentes e utilitários existentes antes de criar novos.
- Não adicione dependências sem necessidade.
- Toda dependência nova deve ser avaliada quanto a segurança, manutenção, licença,
  compatibilidade e adoção relevante antes da instalação.
- Prefira APIs nativas e bibliotecas já utilizadas no projeto quando forem suficientes.
- Mensagens e textos da interface devem permanecer em português.
