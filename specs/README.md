# Especificações

Esta pasta contém as especificações do produto e os contratos técnicos do projeto.

## Organização

Crie uma pasta numerada por funcionalidade:

```text
specs/
└── 001-nome-da-funcionalidade/
    ├── spec.md
    ├── plan.md
    ├── tasks.md
    ├── quickstart.md
    ├── data-model.md
    └── contracts/
```

Use `spec.md` para documentar o que deve ser construído e por quê, sem
detalhar a implementação. Use `plan.md` para decisões técnicas, `tasks.md`
para tarefas executáveis e `quickstart.md` para cenários verificáveis.
Contratos e modelo de dados devem ficar em arquivos separados quando existirem.

A constituição do projeto fica em
[`../.specify/memory/constitution.md`](../.specify/memory/constitution.md).

No código, cada página ou domínio deve separar responsabilidades em:

```text
<nome-da-pagina>/
├── components/
├── services/
└── data/
```

Componentes visuais não devem chamar serviços diretamente. A orquestração deve ficar
na página, em um container ou em um hook de aplicação.

## Dependências

Toda biblioteca nova deve ser avaliada antes da instalação quanto a:

- segurança e vulnerabilidades conhecidas;
- manutenção e atividade recente;
- licença compatível;
- compatibilidade com o stack atual;
- adoção relevante, downloads e comunidade ativa.

APIs nativas e soluções já existentes no projeto devem ser priorizadas quando
atenderem ao requisito.

## Fluxo SDD

1. `specify`: criar ou atualizar a feature e seus requisitos.
2. `clarify`: resolver ambiguidades e registrar decisões.
3. `plan`: definir arquitetura, contratos e modelo de dados.
4. `tasks`: decompor o plano em tarefas executáveis.
5. `implement`: executar tarefas na ordem de dependência.
6. `verify`: executar quickstart, lint, build e testes aplicáveis.
7. Evoluir a spec antes de alterar o código quando o requisito mudar.

Os comandos `/speckit.*` são uma integração opcional do Spec Kit para IDEs. A
estrutura e o workflow acima são mantidos no repositório mesmo quando o CLI não
está instalado.
