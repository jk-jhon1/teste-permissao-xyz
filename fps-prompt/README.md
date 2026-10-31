# NÚCLEO ZERO — pacote de produção

Prompt mestre + documento de design (GDD) para um **FPS 3D em pixel art** com ranqueamento, 60 armas, 50 inimigos e sistema de recarga profundo.

## Arquivos

| Arquivo | O que é |
|---|---|
| `index.html` | Documento visual navegável: prompt copiável, tabelas filtráveis, cards de ranque, recarga e arte |
| `styles.css` | Estilo pixel/terminal do documento |
| `app.js` | Renderiza tabelas, filtros, tooltips e o botão de copiar |
| `data.js` | **Fonte única de verdade**: 60 armas, 50 inimigos, 7 tiers, 8 mecânicas de recarga, 8 regras de arte |
| `PROMPT.md` | Prompt mestre completo, com as tabelas geradas, regras de balanceamento e fases de entrega |
| `build.cjs` | Regenera as tabelas do `PROMPT.md` a partir do `data.js` (`node build.cjs`) |

## Rodar

Basta abrir `index.html` no navegador — não há dependências nem build. Para servir a pasta:

```bash
npx serve .        # ou: python3 -m http.server 8000
```

## Conteúdo do jogo proposto

- **60 armas** em 9 famílias (pistolas, SMGs, rifles, escopetas, precisão, metralhadoras, explosivos, energia e corpo a corpo), cada uma com dano, RPM, pente, reserva, recarga completa e tática, precisão, mobilidade e desbloqueio por ranque.
- **8 mecânicas de recarga**: completa, tática (+1 na câmara), emergência, timing ativo, cancelamento por troca, velocidade por classe, overheat e recarga bago a bago — com munição creditada no fim da animação e animação/som próprios por arma.
- **50 inimigos** em 6 famílias (12 infantaria, 8 precisão, 8 pesados, 8 mutantes, 8 drones, 6 chefes), com IA legível, telegrafia e fraqueza.
- **Ranque em 7 tiers** (Bronze → Lendário), divisões III/II/I, 5 partidas de colocação, MMR escondido, decaimento a partir de Diamante e reset suave de temporada.
- **Arte 3D pixelada**: render interno 480×270 com upscale nearest, low-poly com texturas 32–64 px, paleta de 24 cores por bioma, sombras em blocos, animação stepped a 12–18 FPS.

## Como usar o prompt

1. Copie o prompt do topo de `index.html` (botão **Copiar prompt**) ou a versão curta no fim de `PROMPT.md`.
2. Peça a implementação em fases — o documento já define 5 fases com critérios de aceite.
3. Entregue `data.js` junto: ele contém os números das armas e inimigos que o agente deve implementar.
