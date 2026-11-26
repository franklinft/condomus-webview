---
name: clean-imports
description: Remove imports não utilizados de componentes React e Next.js. Use ao criar, editar ou revisar componentes em app/src/**/components ou app/src/app.
---

Use esta skill sempre que um componente React ou uma página TSX for criada,
modificada ou revisada.

- Inspecione todos os imports do componente após a alteração.
- Remova imports que não são referenciados pelo componente.
- Remova variáveis locais, props e componentes filhos que não são mais usados
  somente quando isso não alterar o comportamento.
- Preserve imports com efeitos colaterais quando o efeito for intencional e
  estiver documentado pelo projeto.
- Prefira componentes, hooks e utilitários compartilhados existentes em vez de
  duplicar implementações.
- Execute `npm run lint` dentro de `app/` após a alteração.
- Trate imports e variáveis não utilizados como erros. Não silencie o problema
  com disables genéricos do ESLint, comentários ou casts de tipo.

Não altere comportamento, markup, estilos ou props públicas ao limpar imports.
Se remover uma variável ou prop puder alterar o comportamento, preserve-a.
