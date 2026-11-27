# Controle de encomendas

## Objetivo

Permitir que a portaria registre o recebimento de encomendas, preserve os
dados estruturados da etiqueta e notifique o morador com uma foto temporária
do pacote.

## Fluxo inicial

1. O porteiro acessa a tela de encomendas.
2. Fotografa a etiqueta usando a câmera do dispositivo.
3. Informa ou confirma o morador, apartamento, transportadora e código da
   etiqueta.
4. Registra o recebimento e dispara a notificação do morador.
5. O pacote aparece no histórico com seu status atual.

## Dados persistentes

- Nome do morador.
- Apartamento e bloco quando disponíveis.
- Transportadora.
- Código de barras ou código de rastreio da etiqueta.
- Data e hora do recebimento.
- Status da encomenda.

O código e os dados estruturados da etiqueta devem permanecer disponíveis após
o expurgo automático da imagem.

## Imagem

- A captura deve ser orientada para a etiqueta do pacote.
- A imagem funciona como comprovante temporário do recebimento.
- O armazenamento definitivo da imagem não faz parte deste primeiro fluxo.
- A política de expurgo deve remover a imagem sem remover os dados da etiqueta.

## Estados

- `received`: encomenda recebida, aguardando notificação.
- `notified`: morador notificado e aguardando retirada.
- `collected`: encomenda retirada pelo morador.

## Interface

- Exibir indicadores compactos de encomendas aguardando, notificadas e
  retiradas.
- Oferecer captura da foto antes dos dados manuais.
- Permitir confirmação manual dos dados reconhecidos.
- Informar claramente que os dados da etiqueta permanecem após o expurgo da
  imagem.
- Manter o fluxo principal em uma única tela para reduzir o tempo de operação
  da portaria.
