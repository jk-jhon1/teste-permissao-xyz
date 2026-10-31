# NÚCLEO ZERO — Prompt mestre + documento de design

**Gênero:** FPS 3D competitivo · **Estilo:** pixel art 3D (low-poly + texturas pixeladas) · **Plataforma:** WebGL (navegador) e desktop
**Escopo:** 60 armas · 50 inimigos · 8 mecânicas de recarga · 7 tiers de ranque · 6 biomas · 4 modos

> Este documento é o prompt completo, feito para ser entregue a um agente de código (ou a um time) junto com os dados de `data.js`. A versão curta para copiar e colar está no final. As tabelas das seções 8 e 9 são as mesmas que o documento visual em `index.html` mostra.

---

## 1. Contexto e objetivo

Crie **NÚCLEO ZERO**, um **FPS 3D em primeira pessoa com estética pixel art**, focado em partidas rápidas 5v5 e progressão ranqueada. O jogo deve ser legível como um jogo competitivo de verdade — silhuetas claras, feedback imediato, nenhum dano impossível de prever — mas com a identidade visual de um jogo 3D de 32 bits: geometria low-poly, texturas pequenas, render interno em baixa resolução e **upscale nearest-neighbor**, sem suavização.

**Premissas:**

- Partida padrão de 8 a 15 minutos, 5v5, com respawn em Escolta/Domínio.
- 60 FPS como meta mínima em hardware modesto e no navegador.
- Primeira build jogável de verdade no final da **Fase 1** (ver seção 10), não no final do projeto.
- Toda vantagem competitiva é conquistada jogando. Loja só vende cosmético.

---

## 2. Pilares de design

1. **Leitura clara acima de realismo.** Tudo que importa (inimigo, classe, perigo, janela de recarga) é identificável em 0,3 s por silhueta, cor e animação. Nada de camuflagem que esconde inimigos.
2. **A recarga é uma decisão, não uma espera.** O sistema de recarga é a mecânica-assinatura: recarga tática, cancelamento por troca, timing ativo, overheat. O jogador que domina a recarga tem vantagem mensurável.
3. **60 armas, 60 identidades.** Nenhuma arma é "a melhor". Cada uma ganha em uma faixa e perde em outra. Se duas armas têm os mesmos números, uma delas é cortada.
4. **50 inimigos, 50 problemas.** Cada inimigo ensina algo (flanquear, esperar, mirar no ponto fraco). Nada de reskin com vida maior.
5. **Ranque honesto.** RP mede resultado e desempenho, nunca tempo jogado. MMR separado do RP impede inflação e farming.
6. **Arte com orçamento.** Pixel art não é desculpa para asset genérico: paleta limitada, atlas único por bioma, animação a 12–18 FPS com poses exageradas.

---

## 3. Sistema de arsenal — 60 armas

Nove famílias, todas com papel claro:

| Família | Qtde | Papel |
|---|---|---|
| Pistolas / revólveres | 10 | Mobilidade máxima, saque rápido, recarga curta |
| SMGs | 8 | Pressão em curta distância, recarga em movimento |
| Rifles de assalto | 10 | Base do meta, média distância |
| Escopetas | 7 | Duelo a até 8 m, recarga bago a bago |
| Precisão (DMR/sniper) | 7 | Ângulo longo, cadência baixa, recarga caríssima |
| Metralhadoras | 4 | Supressão e objetivo, recarga de 6–9 s |
| Explosivos | 4 | Dano em área, pente mínimo |
| Energia/plasma | 6 | Overheat em vez de pente |
| Corpo a corpo | 4 | Silencioso, ignora escudo |

### Ficha completa das 60 armas

| ID | Arma | Família | Munição | Dano | RPM | Pente | Reserva | Recarga | Tática | Prec. | Mob. | Desbloqueio | Nota de design |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W01 | PT-9 "Vespa" | Pistola | 9x19mm | 24 | 380 | 15 | 90 | 1.6s | 1.2s | 62 | 95 | Bronze III | Pistola inicial equilibrada; recarga curta perdoa erro de iniciante. |
| W02 | "Trovão" .38 | Revólver | .38 Special | 48 | 190 | 6 | 42 | 2.6s | 2.1s | 68 | 86 | Bronze I | Alto dano por tiro, recarga lenta: obriga a lutar perto de cobertura. |
| W03 | "Canário" | Pistola automática | 9x19mm | 17 | 900 | 18 | 90 | 1.9s | 1.4s | 55 | 92 | Prata II | Cadência alta, controle baixo; brilha em corredores curtos. |
| W04 | "Punhal" .45 | Pistola | .45 ACP | 37 | 300 | 8 | 56 | 1.8s | 1.4s | 66 | 88 | Prata III | Dano alto com pente curto; pune quem recarrega no meio do duelo. |
| W05 | "Sentinela" 5.7 | Pistola perfurante | 5.7x28mm | 28 | 400 | 20 | 100 | 2.0s | 1.5s | 71 | 90 | Ouro II | Perfura 1 alvo leve; excelente contra escudos finos. |
| W06 | "Bigorna" .50 | Canhão de mão | .50 AE | 72 | 150 | 5 | 25 | 2.8s | 2.3s | 64 | 74 | Ouro I | Um tiro, um estrago: recarga longa e recuo brutal entre disparos. |
| W07 | "Coruja" | Pistola silenciada | .22 LR | 21 | 340 | 12 | 96 | 1.7s | 1.3s | 74 | 94 | Prata I | Não aparece no minimapa inimigo; dano baixo e alcance curto. |
| W08 | "Gêmeos" | Pistola dupla | 9x19mm | 22 | 620 | 30 | 120 | 2.4s | 1.9s | 48 | 85 | Platina III | Dois canos alternados; recarga dupla é a mais punitiva da classe. |
| W09 | "Faísca" | Pistola elétrica | Célula | 15 | 500 | 12 | 60 | 1.5s | 1.1s | 70 | 96 | Diamante II | Paralisa 0,4 s; não recarrega pente, dissipa calor (ver overheat). |
| W10 | "Réquiem" | Pistola de precisão | .357 | 58 | 220 | 7 | 49 | 2.3s | 1.9s | 78 | 82 | Mestre III | Precisão de DMR no espaço de uma pistola; pente minúsculo. |
| W11 | "Vagalume" | SMG | 9x19mm | 15 | 1000 | 30 | 150 | 2.2s | 1.6s | 52 | 96 | Bronze II | Referência de mobilidade: recarga em movimento sem penalidade. |
| W12 | "Sucata" | SMG | .45 ACP | 26 | 700 | 25 | 125 | 2.4s | 1.8s | 50 | 90 | Bronze I | Dano alto por bala com recuo vertical difícil de dominar. |
| W13 | "Colibri" | SMG | 4.6x30mm | 13 | 1150 | 40 | 200 | 2.6s | 2.0s | 58 | 94 | Prata II | Pente grande que mascara a recarga frequente; ideal para pressão. |
| W14 | "Cortina" | SMG | 9x19mm | 18 | 880 | 35 | 175 | 2.3s | 1.8s | 60 | 92 | Ouro III | A mais estável da classe; spread baixo em hip-fire. |
| W15 | "Zumbido" | SMG | 5.7x28mm | 21 | 820 | 30 | 150 | 2.5s | 1.9s | 63 | 91 | Prata I | Perfuração leve boa contra drones; recarga um pouco acima da média. |
| W16 | "Barata" | SMG compacta | .32 | 12 | 1250 | 45 | 225 | 2.0s | 1.6s | 44 | 98 | Bronze III | A arma mais rápida do jogo para sacar; sofre acima de 15 m. |
| W17 | "Prego" | SMG perfurante | 4.6x30mm | 19 | 950 | 32 | 160 | 2.7s | 2.0s | 61 | 89 | Platina II | Atravessa escudos leves; recarga longa precisa ser feita atrás de parede. |
| W18 | "Miragem" | SMG silenciada | 9x19mm | 16 | 900 | 30 | 150 | 2.2s | 1.7s | 72 | 93 | Diamante III | Silenciosa: reduz em 60% o raio de alerta dos inimigos. |
| W19 | "Bandeirante" | Rifle de assalto | 5.56mm | 30 | 720 | 30 | 120 | 2.5s | 1.9s | 76 | 80 | Bronze I | Arma-assinatura do jogo: fácil de aprender, difícil de dominar. |
| W20 | "Tatu" | Rifle de assalto | 7.62mm | 38 | 600 | 25 | 100 | 2.8s | 2.1s | 72 | 72 | Prata III | Dois tiros na cabeça encerram duelo; recuo lateral forte. |
| W21 | "Curió" | Rifle de assalto | 5.56mm | 27 | 800 | 35 | 140 | 2.4s | 1.9s | 78 | 84 | Prata I | Cadência alta e controle médio; melhor rifle para iniciante. |
| W22 | "Serra" | Rifle de assalto | 7.62mm | 42 | 560 | 20 | 80 | 3.0s | 2.3s | 70 | 68 | Ouro II | Dano por bala altíssimo, pente de 20 e recarga de 3 s: gestão total. |
| W23 | "Araponga" | Rifle de assalto (rajada) | 5.56mm | 29 | 900 | 30 | 120 | 2.6s | 2.0s | 82 | 79 | Ouro I | Rajada de 3 com recuo previsível: melhor rifle em média distância. |
| W24 | "Tucano" | Rifle de assalto | 6.8mm | 33 | 660 | 30 | 120 | 2.7s | 2.0s | 79 | 77 | Platina III | Equilíbrio puro; sem fraqueza clara e sem excesso em nada. |
| W25 | "Jaguar" | Rifle de assalto | 7.62mm | 40 | 640 | 25 | 100 | 2.9s | 2.2s | 74 | 70 | Platina I | Troca mobilidade por dano; exige recarga sempre com cobertura. |
| W26 | "Íbis" | Rifle leve | 5.56mm | 25 | 860 | 30 | 150 | 2.2s | 1.8s | 80 | 88 | Diamante II | Praticamente uma SMG de precisão; recarga mais rápida do grupo. |
| W27 | "Cerrado" | Rifle silenciado | .300 BLK | 36 | 700 | 30 | 120 | 2.8s | 2.1s | 77 | 75 | Mestre II | Dano de 7.62 com supressor; ótima em modos com objetivo furtivo. |
| W28 | "Xavante" | Rifle experimental | 6.5 CBJ | 31 | 780 | 30 | 135 | 2.5s | 1.9s | 84 | 81 | Lendário III | Mira híbrida que alterna 1x/4x sem trocar de arma. |
| W29 | "Berrante" | Escopeta pump | Calibre 12 | 96 | 75 | 6 | 36 | 3.4s | 2.6s | 45 | 70 | Bronze II | 8 bagos por tiro; recarga pellet a pellet (cancelável a cada bago). |
| W30 | "Porteira" | Escopeta semiautomática | Calibre 12 | 80 | 180 | 8 | 40 | 3.8s | 3.0s | 44 | 66 | Ouro III | Dois tiros rápidos decidem; recarga longa exige planejamento. |
| W31 | "Chuva" | Escopeta automática | Calibre 12 | 64 | 240 | 10 | 50 | 4.2s | 3.4s | 40 | 62 | Platina II | Dano por bago menor, mas a única escopeta que sustenta pressão. |
| W32 | "Balaio" | Escopeta de cano duplo | Calibre 12 | 112 | 120 | 2 | 20 | 2.9s | 2.3s | 42 | 76 | Prata II | Dois tiros devastadores e recarga completa; arma de tudo-ou-nada. |
| W33 | "Lascas" | Escopeta de ferrolho | Calibre 20 | 90 | 60 | 5 | 30 | 3.2s | 2.5s | 58 | 68 | Diamante III | Chumbo mais fechado: funciona como DMR de curta distância. |
| W34 | "Brasa" | Escopeta incendiária | Calibre 12 | 74 | 90 | 6 | 30 | 3.6s | 2.8s | 43 | 64 | Mestre I | Aplica queimadura de 6 s; recarga mais lenta da classe. |
| W35 | "Marreta" | Escopeta slug | Calibre 12 slug | 130 | 50 | 4 | 20 | 3.5s | 2.7s | 66 | 60 | Lendário II | Um projétil único: acerta a 40 m, mas erra a 3 m se o alvo se mexer. |
| W36 | "Sabiá" | DMR | 5.56mm | 55 | 300 | 10 | 60 | 2.6s | 2.0s | 88 | 72 | Prata II | Semiautomática de médio alcance; pune quem dispara sem mirar. |
| W37 | "Falcão" | Sniper | .308 | 95 | 55 | 5 | 25 | 3.4s | 2.7s | 94 | 58 | Ouro I | Ciclo de ferrolho visível: cada tiro é um compromisso. |
| W38 | "Gavião" | Sniper pesado | .338 | 135 | 40 | 4 | 20 | 4.0s | 3.2s | 96 | 48 | Platina I | Atravessa dois inimigos alinhados; mobilidade mínima. |
| W39 | "Andorinha" | Sniper leve | .243 | 82 | 70 | 5 | 30 | 3.0s | 2.3s | 92 | 66 | Diamante II | A sniper mais ágil; recarga 0,4 s mais rápida que a Falcão. |
| W40 | "Curumim" | DMR semiauto | 7.62mm | 62 | 260 | 12 | 72 | 2.8s | 2.2s | 86 | 70 | Mestre II | Pente maior compensa a cadência baixa em duelos longos. |
| W41 | "Carcará" | Antimaterial | .50 BMG | 210 | 30 | 3 | 12 | 4.8s | 3.9s | 97 | 38 | Lendário I | Atravessa paredes finas e escudos; recarga quase 5 s. |
| W42 | "Peneira" | Sniper de trilho | Célula | 150 | 45 | 4 | 16 | 3.6s | 2.9s | 98 | 45 | Lendário III | Carrega 0,9 s antes do tiro; acerta através de cobertura média. |
| W43 | "Boiadeiro" | Metralhadora leve | 5.56mm | 32 | 750 | 100 | 200 | 6.5s | 5.2s | 66 | 42 | Ouro II | Bipé reduz recuo em 70% ao atirar deitado. |
| W44 | "Trator" | Metralhadora leve | 7.62mm | 40 | 650 | 75 | 150 | 7.0s | 5.6s | 62 | 36 | Platina III | Cobre objetivo sozinha; recarga de 7 s pede time protegendo. |
| W45 | "Dínamo" | Metralhadora leve | .300 | 36 | 800 | 120 | 240 | 7.5s | 6.0s | 70 | 40 | Diamante I | Pente enorme; a recarga mais longa do jogo fora da Minigun. |
| W46 | "Cachoeira" | Minigun | 7.62mm | 28 | 1600 | 200 | 400 | 9.0s | 7.5s | 52 | 22 | Lendário II | Spin-up de 0,8 s antes de atirar; recarga de 9 s nunca acontece em combate. |
| W47 | "Buzina" | Lança-granadas | 40mm | 90 | 60 | 4 | 12 | 3.2s | 2.6s | 60 | 55 | Prata III | Dano em área 4 m; recuo de arco exige cálculo de distância. |
| W48 | "Boi" | Lança-foguetes | Foguete 80mm | 160 | 45 | 1 | 5 | 3.8s | 3.2s | 62 | 48 | Ouro III | Um foguete por recarga: cada disparo é uma decisão tática. |
| W49 | "Cupim" | Míssil guiado | Míssil | 120 | 30 | 2 | 8 | 4.2s | 3.5s | 70 | 50 | Diamante III | Lock-on de 1,2 s; perde o alvo se ele quebrar a linha de visão. |
| W50 | "Cinzeiro" | Morteiro portátil | 60mm | 140 | 25 | 1 | 6 | 4.6s | 3.8s | 55 | 44 | Mestre III | Arco balístico: acerta atrás de cobertura, mas leva 2 s para cair. |
| W51 | "Vaga-lume" | Pistola de plasma | Célula | 26 | 420 | 16 | — | overheat | — | 74 | 94 | Ouro III | Sem pente: 100% de calor = overheat de 1,8 s (não conta como recarga). |
| W52 | "Prisma" | Rifle de plasma | Célula | 34 | 700 | 24 | — | overheat | — | 80 | 78 | Platina II | Rajada de 3 tiros com perfuração; esfria mais devagar que a pistola. |
| W53 | "Tesla" | Rifle elétrico | Célula | 22 | 600 | 32 | — | overheat | — | 76 | 80 | Diamante I | Encadeia em até 3 inimigos próximos; -20% de dano por salto. |
| W54 | "Ímã" | Rifle de gravidade | Célula | 18 | 400 | 20 | — | overheat | — | 72 | 76 | Mestre I | Puxa inimigos para o centro da mira; ótimo para agrupar e explodir. |
| W55 | "Aurora" | Fuzil de raios | Célula | 12 | 1200 | 100 | — | overheat | — | 90 | 70 | Platina I | Feixe contínuo hitscan com DPS fixo; precisa manter o alvo na mira. |
| W56 | "Nova" | Canhão de plasma | Célula | 110 | 50 | 5 | — | overheat | — | 82 | 60 | Lendário II | Carga de 1,1 s; tiro carregado atravessa escudos e aplica empurrão. |
| W57 | "Facão" | Corpo a corpo | — | 55 | 72 | — | — | overheat | — | 100 | 100 | Bronze I | Golpe de 0,8 s; execução automática pelas costas. |
| W58 | "Marreta" | Corpo a corpo | — | 120 | 40 | — | — | overheat | — | 100 | 82 | Prata II | Quebra cobertura e escudos; balança 0,8 s antes de acertar. |
| W59 | "Garras de choque" | Corpo a corpo | — | 35 | 180 | — | — | overheat | — | 100 | 100 | Ouro II | Dois golpes rápidos com atordoamento de 0,3 s cada. |
| W60 | "Lâmina de fase" | Corpo a corpo | — | 80 | 60 | — | — | overheat | — | 100 | 96 | Lendário III | Ignora 100% do escudo de energia; teletransporta 3 m no golpe final. |

**Regras de balanceamento obrigatórias:**

- **Orçamento de poder:** cada arma recebe 100 pontos distribuídos entre dano, cadência, precisão, mobilidade e tempo de recarga. Nenhuma arma fica acima de 100 sem pagar em outra.
- **TTK alvo:** 0,25–0,45 s em curta distância; 0,5–0,9 s em média; 0,9–1,6 s em longa.
- **Custo de recarga:** quanto maior o DPS sustentado, maior o tempo de recarga **e** maior a penalidade de mobilidade durante ela.
- **Desbloqueio:** 60 armas distribuídas por ranque (Bronze → Lendário), nenhuma exclusiva de compra. Nada de arma "paga e melhor".
- **Modificadores:** apenas trocas (pente estendido × recarga mais lenta), nunca bônus puros. Máximo 20% de redução de tempo de recarga com modificadores.
- **Teste:** toda arma precisa matar em até 1 pente cheio, senão o pente ou o dano estão errados.

---

## 4. Sistema de recarga — 8 mecânicas

Essencial: a munição é creditada **no fim** da animação (com checkpoints), cada arma tem animação e som próprios, e existem decisões em todos os momentos.

| Mecânica | Tecla | Tempo | Risco | Regra | Quando usar |
|---|---|---|---|---|---|
| Recarga Completa | R | 100% do tempo-base | Alto | Substitui o pente cheio. Pode ser cancelada a qualquer momento — o progresso é perdido, não salvo. | Fora de combate, atrás de cobertura ou com aliado cobrindo. |
| Recarga Tática | R com munição no pente | ≈ 75% do tempo-base | Baixo | Mantém a bala na câmara (+1 no pente) e é a recarga mais segura. Cancelável sem custo até 60% da animação. | Sempre que houver 1+ bala no pente: mais rápida e sem perder o +1. |
| Recarga de Emergência | R duas vezes rápido (duplo toque) | ≈ 70% do tempo-base | Médio | Descarta o pente parcial: perde a munição restante e o bônus da câmara. Não pode ser cancelada. | Último recurso com 2–3 balas e inimigo encostando. |
| Recarga Ativa (timing) | Clique esquerdo no momento exato da barra | 100%, com janela de 0,25 s | Médio | Janela verde acertada = -25% no tempo total + 15% de cadência por 3 s. Errar = +0,4 s de atraso. | Jogadores avançados transformam recarga em vantagem de DPS. |
| Cancelamento por troca | 1/2/3 durante a recarga |  | Baixo | Trocar de arma conserva o progresso da recarga por 6 s: voltar à arma retoma de onde parou. | Micro-gestão clássica: recarrega, troca para escopeta, volta com pente cheio. |
| Recarga em Movimento | — |  | — | SMGs e pistolas recarregam andando sem penalidade; rifles perdem 40% de velocidade; snipers e LMGs ficam 20% mais lentos ao recarregar. | Escolha de classe de arma influencia o posicionamento. |
| Overheat (armas de energia) | — |  | Médio | Armas de energia não têm pente: acumulam calor. 100% = travamento de 1,8–2,6 s. Resfriamento passivo só começa 0,5 s após parar de atirar. | Rajadas curtas mantêm o DPS sem travar em combate. |
| Recarga por bago / cartucho | R (interrompível) |  | Baixo | Escopetas e revólveres recarregam um cartucho por vez; interromper guarda o que já entrou — cada bago pode ser um tiro. | Escopeta: recarregue 2 bagos, atire, recarregue mais 2. |

### Máquina de estados

```
IDLE
 ├─ fire + munição > 0 .............. FIRE → IDLE
 ├─ fire + munição = 0 .............. EMPTY (clique seco, +0,15s)
 ├─ R (pente > 0) .................. RELOAD_TACTICAL
 ├─ R (pente = 0) .................. RELOAD_FULL
 ├─ R R (duplo toque) .............. RELOAD_EMERGENCY
 ├─ troca de arma .................. SWAP (salva progresso 6s)
 └─ calor 100% (energia) ........... OVERHEAT (1,8–2,6s)

RELOAD_*: checkpoints de animação
  0.0s — arma abaixa, som de pente saindo
  0.6s — pente novo entra  ◀ janela de "active reload"
  1.0s — ferrolho / câmara
  fim  — munição creditada AQUI (não no início)
```

**Regras de ouro:**

- **Munição entra no fim:** cancelar após o checkpoint do pente concede a munição; cancelar antes, não.
- **Tudo cancelável**, exceto a recarga de emergência (compromisso total).
- **Progresso salvo por 6 s** ao trocar de arma: recompensa a gestão dos dois slots.
- **Feedback total:** som único por arma, barra segmentada no HUD, 1 px de screen shake ao finalizar.
- **Inimigos também recarregam** — e essa é a janela de ataque do jogador (Fuzileiro Pesado, Torreta Móvel).
- **Sem recarga gratuita:** nenhum perk zera o tempo.

---

## 5. Bestiário — 50 inimigos

Seis famílias em seis biomas. Todos têm **telegrafia** antes do dano alto e **janela de vulnerabilidade** clara.

| Família | Qtde | Função |
|---|---|---|
| Infantaria | 12 | Corpo de base, pressão, cobertura, chamada de reforço |
| Precisão | 8 | Punem exposição, obrigam movimentação |
| Pesados / blindados | 8 | Rompem posição, exigem flanco ou explosivo |
| Mutantes | 8 | Pressão em espaço fechado, enxames |
| Drones | 8 | Negação de área, suporte, marcadores |
| Chefes | 6 | Marcos de PvE, 1 chefão final com as 60 armas |

| ID | Inimigo | Família | Bioma | Vida | Dano | Velocidade | Comportamento de IA | Fraqueza | RP |
|---|---|---|---|---|---|---|---|---|---|
| E01 | Grumete Raso | Infantaria | Docas | 80 | 8 | Média | Patrulha em dupla e usa cobertura; recua quando perde 50% da vida. | Cabeça | 10 |
| E02 | Corredor de Choque | Infantaria | Docas | 60 | 12 | Alta | Avança em linha reta aos gritos; ignora cobertura e tenta flanquear pelo lado. | Explosivo | 12 |
| E03 | Soldado de Trincheira | Infantaria | Ferro-Velho | 110 | 10 | Baixa | Fica atrás de caixas, dispara rajadas de 3 e só sai ao ser flanqueado. | Flanco | 14 |
| E04 | Porta-Estandarte | Infantaria | Ferro-Velho | 100 | 6 | Baixa | Concede +25% de dano a aliados próximos; prioriza se esconder. | Cabeça | 18 |
| E05 | Sargento Ferrão | Infantaria | Refinaria | 160 | 14 | Média | Comanda esquadrão de 4 grumetes e ordena cerco em pinça. | Corpo a corpo | 25 |
| E06 | Batedor Noturno | Infantaria | Estufa | 70 | 11 | Alta | Fica invisível parado; aparece por 0,6 s ao atacar e foge para flanquear. | Área | 20 |
| E07 | Arremessador | Infantaria | Ruínas | 90 | 18 | Média | Calcula arco de granada para forçar o jogador a sair da cobertura. | Cabeça | 16 |
| E08 | Fuzileiro Pesado | Infantaria | Refinaria | 140 | 13 | Baixa | Avança atirando; quando recarrega, abaixa a arma e fica vulnerável por 2,5 s. | Durante recarga | 18 |
| E09 | Escudeiro Balístico | Infantaria | Cibermercado | 120 | 9 | Baixa | Escudo frontal absorve 80% do dano; vira de costas ao recuar. | Costas / perfurante | 20 |
| E10 | Espião Mímico | Infantaria | Cibermercado | 85 | 22 | Média | Finge ser caixa ou aliado caído; ataca quando o jogador passa a 4 m. | Leitura de cenário | 22 |
| E11 | Portador de Mina | Infantaria | Ruínas | 75 | 30 | Alta | Corre para perto e explode em 1,5 s telegrafados; ao morrer deixa 2 minas. | Longa distância | 15 |
| E12 | Vociferador | Infantaria | Estufa | 130 | 5 | Baixa | Grita a cada 8 s e chama 3 reforços; matar cedo evita ondas. | Cabeça | 24 |
| E13 | Olho de Vidro | Precisão | Ferro-Velho | 85 | 55 | Baixa | Mira com laser vermelho por 1,2 s antes de atirar; troca de telhado sempre. | Mover + headshot | 22 |
| E14 | Caçador de Telhado | Precisão | Docas | 75 | 45 | Média | Sobe em contêineres e atira por cima da cobertura; nunca desce. | Gancho / ângulo alto | 20 |
| E15 | Atirador de Cristal | Precisão | Cristal | 95 | 50 | Baixa | Tiro perfurante que atravessa 2 paredes finas; telegrafa com brilho violeta. | Perfurante / flanco | 24 |
| E16 | Sentinela de Relógio | Precisão | Órbita | 100 | 60 | Imóvel | Atira sempre no mesmo intervalo de 3 s; ensina ritmo de avanço. | Timing | 22 |
| E17 | Viúva de Ferro | Precisão | Ruínas | 80 | 40 | Média | Marca o jogador por 5 s (contorno visível para todos os inimigos). | Matar antes de marcar | 26 |
| E18 | Flecheiro Elétrico | Precisão | Estufa | 70 | 15 | Alta | Dardo paralisante à distância; mantém 12 m de espaçamento. | Corpo a corpo | 18 |
| E19 | Observador Longo | Precisão | Órbita | 65 | 0 | Baixa | Não causa dano: ilumina o jogador e aumenta a precisão de todos os aliados. | Prioridade alta | 28 |
| E20 | Atirador Fantasma | Precisão | Cristal | 90 | 70 | Baixa | Invisível até atirar; o disparo revela a posição por 1 s. | Som / flash | 30 |
| E21 | Bruto de Placas | Pesado | Ferro-Velho | 280 | 20 | Muito baixa | Escudo pesado, avança devagar; só vira quando recebe dano pelas costas. | Costas / explosivo | 30 |
| E22 | Touro de Cerco | Pesado | Refinaria | 320 | 35 | Alta (investida) | Carrega em linha reta a cada 6 s e destrói cobertura no caminho. | Desviar e atacar flanco | 32 |
| E23 | Portão Humano | Pesado | Cibermercado | 350 | 12 | Baixa | Carrega escudo de área que protege 3 aliados; anda em formação. | Perfurante / flanco | 34 |
| E24 | Canhoneiro Blindado | Pesado | Docas | 300 | 25 | Baixa | Metralhadora montada com rajada de 2 s e pausa de 3 s (janela de ataque). | Durante pausa | 30 |
| E25 | Golem de Sucata | Pesado | Ferro-Velho | 400 | 28 | Baixa | Junta peças do chão e recupera 20% de vida; precisa ser finalizado rápido. | Fogo | 36 |
| E26 | Mula de Carga | Pesado | Ruínas | 260 | 60 | Média | Exoesqueleto com mochila explosiva; se morrer perto de aliados, eles morrem. | Detonar à distância | 28 |
| E27 | Baluarte | Pesado | Órbita | 450 | 22 | Imóvel | Invulnerável de frente; atira em cone de 90° e gira lentamente. | Costas | 38 |
| E28 | Titanito | Pesado | Cristal | 520 | 40 | Baixa | Mini-chefe de área; golpe de área com 1,5 s de telegrafia no chão. | Pontos brilhantes nas juntas | 45 |
| E29 | Ratazana Gigante | Mutante | Estufa | 55 | 14 | Muito alta | Ataca em matilha de 5, circula e morde pelas laterais. | Área / escopeta | 8 |
| E30 | Enxame de Vespas de Metal | Mutante | Refinaria | 70 | 6 | Alta | Nuvem de 12 unidades que persegue em espiral; dano contínuo pequeno. | Fogo / elétrico | 12 |
| E31 | Crocodilo de Esgoto | Mutante | Docas | 240 | 45 | Média (emboscada) | Fica submerso e emerge sob o jogador; lento fora da água. | Sair da água | 26 |
| E32 | Fungo Ambulante | Mutante | Estufa | 130 | 8 | Muito baixa | Libera nuvem de esporos que reduz a visão por 6 s. | Fogo | 14 |
| E33 | Louva-a-Deus de Vidro | Mutante | Cristal | 110 | 38 | Alta | Salta 8 m e golpeia duas vezes; fica parado 1 s após o salto. | Após o salto | 20 |
| E34 | Verme de Núcleo | Mutante | Cristal | 180 | 30 | Média (subsolo) | Perfura o chão, some e reaparece sob o jogador a cada 4 s. | Som do solo | 24 |
| E35 | Urso Cinza Mutante | Mutante | Neve | 380 | 50 | Alta (carga) | Carrega e derruba o jogador; fica exausto por 3 s depois do impacto. | Exaustão pós-carga | 34 |
| E36 | Rainha do Enxame | Mutante | Estufa | 300 | 16 | Baixa | Gera 2 ratazanas a cada 7 s; se ficar viva, o mapa enche. | Fogo | 36 |
| E37 | Drone Batedor | Drone | Órbita | 50 | 0 | Alta | Marca jogadores no minimapa; foge quando recebe dano. | Qualquer arma | 12 |
| E38 | Drone Kamikaze | Drone | Cibermercado | 40 | 45 | Alta | Voa em direção ao jogador e explode ao encostar (bip de 1 s). | Tiro no ar | 12 |
| E39 | Drone Escudeiro | Drone | Órbita | 90 | 0 | Média | Projeta escudo de energia em 2 aliados até ser destruído. | Elétrico | 22 |
| E40 | Torreta Móvel | Drone | Ferro-Velho | 160 | 18 | Baixa | Roda em patrulha e entra em modo tiro ao ver o jogador; recarrega a cada 40 tiros. | Durante recarga | 18 |
| E41 | Reparador Automático | Drone | Refinaria | 100 | 0 | Média | Cura 15 PV/s em inimigos próximos; nunca entra em combate. | Prioridade alta | 26 |
| E42 | Fantasma Digital | Drone | Cibermercado | 120 | 24 | Média | Teleporta 6 m quando recebe dano e deixa um holograma falso. | Área | 26 |
| E43 | Sentinela de Órbita | Drone | Órbita | 200 | 30 | Imóvel | Flutua e varre o corredor com laser contínuo em arco de 120°. | Ponto cego atrás | 28 |
| E44 | Enxame Alfa | Drone | Cristal | 150 | 20 | Alta | 4 drones que se movem em formação e atacam em sincronia. | Elétrico (encadeia) | 30 |
| E45 | Capitã "Olho Cego" | Chefe | Ferro-Velho | 2200 | 35 | Média | Fase 1: cobre com fumaça. Fase 2: invoca 2 Olhos de Vidro e mira por som. | Tiro no olho cibernético | 150 |
| E46 | "O Ferreiro" | Chefe | Refinaria | 3000 | 60 | Baixa | Martelo de área e forja armadura nas costas; quebre a armadura para expor o núcleo. | Núcleo exposto | 180 |
| E47 | "Mãe Estufa" | Chefe | Estufa | 2600 | 30 | Imóvel | Enraizada no centro; gera mutantes e fecha as saídas com raízes. | Fogo nas raízes | 180 |
| E48 | "Núcleo Zero" | Chefe | Órbita | 2800 | 45 | Imóvel | IA central que controla lasers da arena e tranca setores a cada 20%. | Sobrecarga do painel (EMP) | 200 |
| E49 | "Gêmeos Espelho" | Chefe | Cibermercado | 2000 | 40 | Alta | Dois chefes que compartilham dano; precisam morrer no mesmo intervalo de 8 s. | Dano dividido | 190 |
| E50 | "O Colecionador" | Chefe final | Cristal | 4000 | 50 | Média | Fase final: usa versões das 60 armas do jogo em sequência e copia a última arma do jogador. | Recarregar junto com ele | 300 |

---

## 6. Ranqueamento

Sete tiers, RP transparente, MMR escondido para matchmaking.

| Tier | Divisões | Faixa de RP | Cor | Recompensa |
|---|---|---|---|---|
| Bronze | III · II · I | 0–899 | #b06a3b | Acesso às 12 primeiras armas e ao modo Treino Ranqueado. |
| Prata | III · II · I | 900–1799 | #c9d2da | Modificadores de recarga (pente estendido, empunhadura rápida). |
| Ouro | III · II · I | 1800–2899 | #e8b93f | Armas de Ouro liberadas + primeira skin de arma pixelada animada. |
| Platina | III · II · I | 2900–4199 | #63d6d1 | Playlist Ranqueada de 5v5 em mapas competitivos completos. |
| Diamante | III · II · I | 4200–5799 | #7c9dff | Armas de energia liberadas e viseira de elite. |
| Mestre | III · II · I | 5800–7599 | #c07cff | Torneios semanais, veto de mapa e chat de voz de equipe. |
| Lendário | — | 7600+ | #ff6b8b | Leaderboard global, skins exclusivas e o título de 'Colecionador'. |

### Fórmula

```
RP final = base(resultado) + desempenho + objetivo + bônus − penalidade
         × multi(MMR)          // ±30% conforme força dos adversários
         × multi(tier)         // ajuste de curva por tier
```

### Tabela de RP

| Evento | RP |
|---|---|
| Vitória | +25 |
| Derrota | −20 |
| Eliminação | +2 |
| Assistência | +1 |
| Objetivo / captura | +5 |
| MVP da partida | +8 |
| Sequência de 5 eliminações | +3 |
| Abandono / AFK | −30 e fila de 15 min |
| Desempenho muito abaixo do MMR | até −5 extra |

### Regras competitivas

- **Colocação:** 5 partidas definem o tier inicial, teto de Ouro III.
- **Divisões:** Bronze → Mestre têm III, II e I. Lendário é faixa única com leaderboard global.
- **Proteção de divisão:** 2 derrotas protegidas logo após subir.
- **Decaimento:** a partir de Diamante, −25 RP por semana sem jogar (limite de 1 tier).
- **Reset de temporada:** suave, queda máxima de 1 tier + 5 partidas de recolocação.
- **Antiabuso:** MMR separado do RP; grupos com mais de 2 tiers de diferença bloqueados; relatório pós-partida mostra a origem de cada RP.
- **Recompensas:** cosmético (skins pixeladas, viseiras, títulos) e acesso a torneios. Nunca vantagem.

---

## 7. Conteúdo: biomas e modos

| Bioma | Identidade visual | Leitura de gameplay |
|---|---|---|
| Docas | Azul-aço, contêineres, água rasa, guindastes | Verticalidade média, rotas de flanco por água |
| Ferro-Velho | Ferrugem, sucata, corredores estreitos | Emboscada, curta distância dominante |
| Refinaria | Laranja de fogo, tanques, passarelas | Áreas abertas perigosas, explosões em cadeia |
| Estufa | Verde saturado, névoa de esporos | Visibilidade curta, mutantes em enxame |
| Cristal | Violeta, reflexos, vãos verticais | Precisão e luz revelam posições |
| Órbita | Branco-azulado, estação espacial | Setores com gravidade baixa, simetria competitiva |

**Modos:** Escolta (5v5, carga em 3 pontos) · Domínio (5v5, três zonas) · Eliminação (5v5, rounds de 90 s) · Sobrevivência (PvE, 12 ondas usando o bestiário completo).

---

## 8. Direção de arte 3D pixelada

| Regra | Especificação |
|---|---|
| Resolução interna fixa | Renderize o mundo em 480×270 (ou 320×180 no modo 'pixel raiz') e faça upscale com filtro Nearest/Point, sem suavização. A UI é desenhada na resolução nativa da tela para ficar legível. |
| Geometria 3D low-poly + textura pixel | Modelos com poucos polígonos (80–800 tris para personagens, 20–200 para props) e texturas de 32×32 a 64×64 com paleta quantizada. Nada de PBR realista: albedo + sombreamento flat. |
| Paleta limitada | Máximo de 24 cores por bioma + 8 cores de UI. Dithering ordenado (Bayer 4×4) para gradientes. Preto nunca absoluto: #10121a para dar leitura de pixel art. |
| Iluminação | Luzes flat com vertex color, sombras em blocos (shadow map de 256–512 px), sem blur. Três tons por material: luz, base, sombra. |
| Animações | 12–18 FPS para inimigos e armas (animação “stepped”), 60 FPS para câmera e movimento. Recarga com 8–14 keyframes legíveis — cada arma tem animação própria de recarga, com o pente saindo da tela na hora exata. |
| Feedback (juice) pixelado | Hitmarker em cruz de 3 px, números de dano com fonte bitmap, partículas quadradas, flash de 2 frames no disparo, screen shake de 1–3 px. Nada de motion blur ou bloom pesado. |
| Legibilidade competitiva | Silhueta de inimigo único por classe (grumete pequeno, pesado largo, drone flutuante, chefe 3× o tamanho). Cor de contorno aliada/inimiga (azul/vermelho) e opção de alto contraste e escala de dano. |
| HUD | HUD mínimo: munição pente/reserva em fonte bitmap grande, barra de recarga segmentada, minimapa circular, indicador de ranque e 4 slots de arma. Tudo pixelado, escala inteira (1×, 2×, 3×). |

### Especificação técnica da imagem

- **Resolução interna:** 480×270 (padrão) ou 320×180 ("pixel raiz"). Upscale com filtro **Point/Nearest**. A UI é desenhada na resolução nativa da tela, em escala inteira (1×/2×/3×).
- **Modelos:** 80–800 triângulos para personagens, 20–200 para props. Texturas de **32×32 a 64×64**, atlas único por bioma, paleta quantizada.
- **Materiais:** albedo + sombreamento flat. Sem PBR, sem normal map detalhado, sem reflexos realistas.
- **Luz:** luzes flat com vertex color; sombras em blocos com shadow map de 256–512 px e sem blur; três tons por material (luz, base, sombra).
- **Animação:** 12–18 FPS com interpolação "stepped" para personagens e armas; câmera e movimento a 60 FPS. Cada arma tem animação própria de recarga de 8–14 keyframes, com o pente saindo no instante exato.
- **Feedback:** hitmarker de 3 px, números de dano em fonte bitmap, partículas quadradas, flash de 2 frames no disparo, screen shake de 1–3 px (desativável).
- **Proibido:** motion blur, bloom pesado, TAA, filtro bilinear no mundo, chromatic aberration, texturas acima de 128 px.
- **Acessibilidade:** alto contraste, contorno aliado/inimigo configurável, escala de HUD, remapeamento total de teclas, reduzir screen shake, opção de desligar flashes.

### Paleta base (bioma Docas)

`#10121a` `#1d2233` `#2c3550` `#41507a` `#5f79a8` `#8fb3d9` `#cfe4f2` `#e8b93f` `#d4623c` `#8b3a3a` `#3f8f6a` `#ff6b8b`

---

## 9. Áudio, UI e técnico

**Áudio (obrigatório no escopo mínimo):**

- Tiro, recarga (pente saindo, pente entrando, ferrolho), passo, dano recebido, hitmarker, headshot, morte.
- Cada família de arma tem timbre próprio; a recarga é o som mais informativo do jogo (inimigo recarregando = oportunidade).
- Música por bioma em loop curto (chiptune/industrial), com camada extra nos últimos 60 s da partida.

**HUD:**

- Munição pente/reserva em fonte bitmap grande + **barra segmentada de recarga** com zona de timing ativo.
- Minimapa circular, indicador de ranque/RP, 4 slots de arma, ícone de calor para armas de energia.
- Tela pós-partida com a origem de cada RP, MMR estimado e próximo tier.

**Stack sugerida:** Three.js + Vite (navegador primeiro, build desktop depois) **ou** Godot 4 com viewport 480×270 e filtro nearest. Dados de armas e inimigos em arquivos de conteúdo separados da lógica.

```
nucleo-zero/
├─ index.html
├─ src/
│  ├─ main.js            # bootstrap, loop, cenas
│  ├─ engine/            # render pixelado, input, áudio
│  ├─ systems/
│  │  ├─ weaponState.js  # máquina de estados + recarga
│  │  ├─ damage.js
│  │  ├─ ai.js           # comportamentos de inimigo
│  │  └─ rank.js         # RP/MMR (funções puras + testes)
│  ├─ data/
│  │  ├─ weapons.js      # 60 armas
│  │  ├─ enemies.js      # 50 inimigos
│  │  └─ maps.js         # 6 biomas × 2 mapas
│  ├─ ui/                # HUD pixelado, menus, tela de ranque
│  └─ art/               # modelos low-poly, texturas 32–64px
└─ tests/
```

**Performance:** um draw call por material compartilhado, atlas único por bioma, IA com atualização em LOD (longe = 4 Hz), limite de 20 inimigos ativos simultâneos na cena de teste.

---

## 10. Entrega em fases (com critérios de aceite)

**Fase 1 — Fundação jogável**
Entregar: projeto, cena de tiro ao alvo, movimentação, 3 armas (Bandeirante, Berrante, Sabiá), HUD mínimo.
Aceite: atirar, matar alvo, recarregar e trocar de arma funcionam; 60 FPS.

**Fase 2 — Recarga completa**
Entregar: as 8 mecânicas, máquina de estados com checkpoints, animação e som por família, barra de recarga com timing ativo.
Aceite: cancelar após o checkpoint concede munição; antes, não; recarga tática vale +1; overheat funciona nas armas de energia.

**Fase 3 — Ranque**
Entregar: módulo `rank.js` testável, tiers, divisões, colocações, decaimento, tela de progresso e pós-partida.
Aceite: todos os eventos da tabela alteram o RP exatamente como especificado; tier atualiza em tempo real; testes unitários verdes.

**Fase 4 — Conteúdo**
Entregar: as 60 armas e os 50 inimigos vindos de dados, galeria navegável, 2 mapas de Docas, hordas de Sobrevivência.
Aceite: galeria lista 60/50; cada inimigo tem comportamento próprio e telegrafia; spawn funciona por bioma.

**Fase 5 — Arte e polimento**
Entregar: passe de arte 3D pixelada nos 6 biomas, juize/hit feedback, acessibilidade, áudio completo, 5v5 em Escolta.
Aceite: render interno 480×270 verificável, paleta limitada, sombras em blocos, opções de acessibilidade funcionando.

---

## 11. Não faça (restrições)

- Não usar assets realistas, PBR ou pós-processamento pesado.
- Não criar arma "boa em tudo" nem reskin com números maiores.
- Não transformar ranque em XP por tempo jogado.
- Não vender vantagem competitiva.
- Não usar recarga como tempo morto: sempre deve existir uma decisão.
- Não deixar inimigo sem telegrafia.
- Não esconder informação essencial só em efeito sonoro (jogo acessível).
- Não usar loot box com conteúdo que altere gameplay.

---

## 12. Prompt curto (copiar e colar)

```
Crie um FPS 3D em pixel art chamado NÚCLEO ZERO. 3D low-poly com render interno em
480x270 e upscale nearest-neighbor, 60 FPS, 5v5 competitivo.

Obrigatório:
1. 60 armas em 9 famílias, cada uma com dano, RPM, pente, reserva, recarga completa,
   recarga tática, precisão, mobilidade, alcance, recuo e desbloqueio por ranque.
   Nenhuma arma domina todas as faixas.
2. 8 mecânicas de recarga: completa, tática (+1 na câmara, 25% mais rápida), emergência
   (descarta o pente), timing ativo (janela de 0,25s = -25% tempo e +15% cadência por 3s),
   cancelamento por troca (progresso salvo por 6s), velocidade por classe, overheat para
   armas de energia e recarga bago a bago para escopetas/revólveres. Munição creditada no
   fim da animação, com checkpoints. Animação e som próprios por arma.
3. 50 inimigos em 6 famílias (12 infantaria, 8 precisão, 8 pesados, 8 mutantes, 8 drones,
   6 chefes), com IA legível, telegrafia e fraqueza. Um chefe final usa as 60 armas.
4. Ranque com 7 tiers (Bronze, Prata, Ouro, Platina, Diamante, Mestre, Lendário), divisões
   III/II/I até Mestre, RP por kill/assist/objetivo/MVP/resultado, 5 partidas de colocação,
   MMR escondido, decaimento a partir de Diamante, proteção de divisão e reset suave.
5. 6 biomas e 4 modos (Escolta, Domínio, Eliminação, Sobrevivência PvE).

Arte: paleta de 24 cores por bioma, texturas 32-64px, iluminação flat com vertex color,
sombras em blocos, animação stepped a 12-18 FPS, partículas quadradas, hitmarker de 3px,
HUD pixelado. Sem motion blur, sem bloom, sem filtro bilinear. Acessibilidade desde o
primeiro commit.

Stack: Three.js + Vite (ou Godot 4), dados de armas/inimigos em arquivos de conteúdo,
rank.js como módulo testável, 60 FPS com 20 inimigos na cena de teste.

Entregue em fases rodando ao final de cada uma:
1) fundação + 3 armas + tiro ao alvo; 2) recarga completa; 3) ranque; 4) 60 armas e
50 inimigos; 5) arte pixelada, áudio e polimento.
```

---

*Documento gerado a partir de `data.js`. Para atualizar as tabelas: `node build.cjs`.*
