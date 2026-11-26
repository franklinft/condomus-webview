---
applyTo: "**/*"
---

# Regras de Specification-Driven Development

## Antes da implementação

- Identifique a especificação relevante em `specs/`.
- Confirme o objetivo, o escopo, os critérios de aceite e os casos de erro.
- Liste as páginas, componentes, serviços e tipos afetados.
- Confirme que cada página/domínio segue a estrutura `components/`, `services/` e `data/`.

## Durante a implementação

- Faça alterações pequenas e diretamente relacionadas à especificação.
- Preserve o comportamento existente fora do escopo.
- Mantenha os critérios de aceite verificáveis.
- Não substitua uma decisão de produto por uma suposição técnica.
- Atualize a spec, `plan.md`, `tasks.md` ou a documentação técnica sempre que a
  implementação alterar o comportamento, contrato ou fluxo.
- Mantenha dados específicos do domínio fora de `shared/`.
- Antes de adicionar uma biblioteca, registre a avaliação de segurança, manutenção,
  licença, compatibilidade e adoção.

## Depois da implementação

- Execute as validações definidas na especificação.
- Verifique o comportamento no navegador quando houver alteração visual.
- Atualize a especificação se a implementação tiver alterado o contrato ou o fluxo.
- Registre decisões técnicas relevantes em um arquivo Markdown versionado.
- Não instale dependências sem justificar por que uma API nativa ou solução existente
  não atende ao requisito.
