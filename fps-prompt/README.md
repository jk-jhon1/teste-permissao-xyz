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
| `NUCLEO-ZERO-pacote.zip` | **ZIP pronto para baixar**: PDF + PROMPT.md + data.js + os arquivos da página + geradores |
| `NUCLEO-ZERO-prompt.pdf` | **PDF de 24 páginas pronto para baixar/imprimir**: capa, sumário, prompt completo, ficha das 60 armas e bestiário em paisagem, ranque, recarga, arte e fases |
| `build.cjs` | Regenera as tabelas do `PROMPT.md` a partir do `data.js` (`node build.cjs`) |
| `make_pdf.py` | Regenera o PDF a partir do `data.js` (`pip install fpdf2 && python3 make_pdf.py`) |
| `cover.png` | Arte-alvo usada na capa do PDF e no topo do documento HTML |

## Rodar

Basta abrir `index.html` no navegador — não há dependências nem build. Para servir a pasta:

```bash
npx serve .        # ou: python3 -m http.server 8000
```

## Download em ZIP

`NUCLEO-ZERO-pacote.zip` (~657 KB) traz tudo: o PDF de 24 páginas, o prompt em Markdown, os dados das 60 armas e 50 inimigos, a página HTML e os scripts que regeneram PDF/tabelas.

- Página do projeto: botão **“↓ Baixar ZIP com o PDF”**
- Link direto: <https://github.com/jk-jhon1/teste-permissao-xyz/raw/arena/b1be692c-teste-permissao-xyz/fps-prompt/NUCLEO-ZERO-pacote.zip>
- Servindo localmente: `python3 serve.py` → `/zip` (ZIP) e `/download` (PDF)

Para recriar o ZIP depois de editar algo:

```bash
cd fps-prompt && zip -9 NUCLEO-ZERO-pacote.zip NUCLEO-ZERO-prompt.pdf PROMPT.md README.md data.js \
  index.html styles.css app.js build.cjs make_pdf.py serve.py cover.png
```

## PDF para download

O arquivo **`NUCLEO-ZERO-prompt.pdf`** (24 páginas) concentra o prompt mestre e o documento de design: capa, sumário com páginas, contexto, pilares, ficha das 60 armas e bestiário dos 50 inimigos em tabelas paisagem, sistema de recarga, ranqueamento, biomas, direção de arte e fases de entrega. Para regerar depois de editar `data.js`:

```bash
python3 -m pip install fpdf2
python3 make_pdf.py
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
