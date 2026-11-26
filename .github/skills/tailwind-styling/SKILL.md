---
name: tailwind-styling
description: Use Tailwind CSS for all component styling in the Condomus Webview. Use when creating or modifying React components, pages, layouts, or visual states.
---

Use esta skill sempre que criar ou alterar a interface visual de componentes,
páginas, layouts ou estados de carregamento, erro e sucesso.

- Use classes utilitárias do Tailwind em `className`.
- Não use a propriedade React `style={{ ... }}` nem CSS inline.
- Não crie novos arquivos CSS para estilos de componentes quando as classes
  utilitárias do Tailwind atenderem ao requisito.
- Para valores dinâmicos compatíveis com Tailwind, use classes arbitrárias,
  como `w-[var(--panel-width)]`, em vez de `style`.
- Preserve o padrão visual existente, a responsividade e a acessibilidade.
- Reutilize componentes e classes existentes antes de duplicar estilos.
- Mantenha estados visuais explícitos para loading, vazio, sucesso, erro,
  foco, hover e disabled quando aplicável.
- Execute `npm run lint` e `npm run build` dentro de `app/` após alterações
  relevantes na interface.

Se uma regra não puder ser expressa com as classes existentes do Tailwind,
registre a exceção e prefira uma solução global reutilizável em vez de CSS
inline.
