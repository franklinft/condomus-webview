---
name: commit-and-push
description: Prepare, validate, commit, and push repository changes safely. Use when the user explicitly requests a commit, push, or publication of the current work.
---

Use esta skill somente quando o usuário solicitar explicitamente commit ou
push.

1. Verifique a branch atual, o remote e o estado do working tree.
2. Revise o diff completo e confirme que todas as alterações pertencem ao
   escopo solicitado.
3. Procure credenciais, tokens, chaves privadas, arquivos de certificado,
   arquivos `.env` e outros dados sensíveis antes de preparar o commit.
4. Execute as validações relevantes. Para este projeto, use Node.js `>=20.9.0`
   e execute `npm run lint` e `npm run build` dentro de `app/`.
5. Execute `git diff --check`.
6. Faça um commit com mensagem curta e descritiva em português ou inglês,
   incluindo o trailer obrigatório do projeto:
   `Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`.
7. Faça push somente para a branch atual e para o remote configurado,
   sem `--force`, `--force-with-lease` ou alterações destrutivas.
8. Confirme o commit publicado e informe a branch, o hash e as validações.

Se houver mudanças não relacionadas, segredos, validação essencial falhando ou
remote ausente, pare antes do commit e informe o bloqueio.
