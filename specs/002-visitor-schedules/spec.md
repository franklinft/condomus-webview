# Visitantes agendados

## Objetivo

Exibir os visitantes agendados no painel inicial usando a comunicação disponível
para a aplicação webview.

## Escopo

- Carregar os agendamentos ao abrir o painel.
- Exibir estados de carregamento, erro, lista preenchida e lista vazia.
- Manter a chamada de serviço fora do componente visual.
- Usar o hook genérico `useService<TArgs, TData>` baseado em callback.
- Centralizar o tratamento de erro no `useService`.
- Manter `SuspenseComponent` como recurso opcional do hook.
- Não utilizar cache ou revalidação automática para esta leitura.

## Fluxo principal

1. A página inicial chama o serviço por meio do `useService`.
2. A página repassa dados e estados para o componente do painel.
3. O componente do painel repassa os dados para o card visual.
4. O card apresenta os agendamentos ou o estado correspondente.

## Critérios de aceite

- [x] A tela não importa nem utiliza SWR.
- [x] O serviço `getVisitorsSchedules` é chamado por um hook/container, não pelo card visual.
- [x] A página inicial é responsável por orquestrar o carregamento.
- [x] O card apresenta loading, erro, lista e estado vazio.
- [x] A aplicação continua compatível com o mock server e a comunicação nativa.

## Validação

```bash
cd app
npm run lint
npm run build
```
