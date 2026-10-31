/* ============================================================
   NÚCLEO ZERO — base de dados do projeto
   Edite aqui: as tabelas do documento são geradas a partir
   destes arrays, então o mesmo arquivo serve como "design
   data" do jogo.
   ============================================================ */

const WEAPONS = [
  // --- PISTOLAS (10) ---
  { id:"W01", nome:'PT-9 "Vespa"', classe:"Pistola", municao:"9x19mm", dano:24, rpm:380, pente:15, reserva:90, recarga:1.6, tatica:1.20, precisao:62, mob:95, unlock:"Bronze III", nota:"Pistola inicial equilibrada; recarga curta perdoa erro de iniciante." },
  { id:"W02", nome:'"Trovão" .38', classe:"Revólver", municao:".38 Special", dano:48, rpm:190, pente:6, reserva:42, recarga:2.6, tatica:2.10, precisao:68, mob:86, unlock:"Bronze I", nota:"Alto dano por tiro, recarga lenta: obriga a lutar perto de cobertura." },
  { id:"W03", nome:'"Canário"', classe:"Pistola automática", municao:"9x19mm", dano:17, rpm:900, pente:18, reserva:90, recarga:1.9, tatica:1.45, precisao:55, mob:92, unlock:"Prata II", nota:"Cadência alta, controle baixo; brilha em corredores curtos." },
  { id:"W04", nome:'"Punhal" .45', classe:"Pistola", municao:".45 ACP", dano:37, rpm:300, pente:8, reserva:56, recarga:1.8, tatica:1.35, precisao:66, mob:88, unlock:"Prata III", nota:"Dano alto com pente curto; pune quem recarrega no meio do duelo." },
  { id:"W05", nome:'"Sentinela" 5.7', classe:"Pistola perfurante", municao:"5.7x28mm", dano:28, rpm:400, pente:20, reserva:100, recarga:2.0, tatica:1.50, precisao:71, mob:90, unlock:"Ouro II", nota:"Perfura 1 alvo leve; excelente contra escudos finos." },
  { id:"W06", nome:'"Bigorna" .50', classe:"Canhão de mão", municao:".50 AE", dano:72, rpm:150, pente:5, reserva:25, recarga:2.8, tatica:2.30, precisao:64, mob:74, unlock:"Ouro I", nota:"Um tiro, um estrago: recarga longa e recuo brutal entre disparos." },
  { id:"W07", nome:'"Coruja"', classe:"Pistola silenciada", municao:".22 LR", dano:21, rpm:340, pente:12, reserva:96, recarga:1.7, tatica:1.25, precisao:74, mob:94, unlock:"Prata I", nota:"Não aparece no minimapa inimigo; dano baixo e alcance curto." },
  { id:"W08", nome:'"Gêmeos"', classe:"Pistola dupla", municao:"9x19mm", dano:22, rpm:620, pente:30, reserva:120, recarga:2.4, tatica:1.95, precisao:48, mob:85, unlock:"Platina III", nota:"Dois canos alternados; recarga dupla é a mais punitiva da classe." },
  { id:"W09", nome:'"Faísca"', classe:"Pistola elétrica", municao:"Célula", dano:15, rpm:500, pente:12, reserva:60, recarga:1.5, tatica:1.15, precisao:70, mob:96, unlock:"Diamante II", nota:"Paralisa 0,4 s; não recarrega pente, dissipa calor (ver overheat)." },
  { id:"W10", nome:'"Réquiem"', classe:"Pistola de precisão", municao:".357", dano:58, rpm:220, pente:7, reserva:49, recarga:2.3, tatica:1.85, precisao:78, mob:82, unlock:"Mestre III", nota:"Precisão de DMR no espaço de uma pistola; pente minúsculo." },

  // --- SMGs (8) ---
  { id:"W11", nome:'"Vagalume"', classe:"SMG", municao:"9x19mm", dano:15, rpm:1000, pente:30, reserva:150, recarga:2.2, tatica:1.65, precisao:52, mob:96, unlock:"Bronze II", nota:"Referência de mobilidade: recarga em movimento sem penalidade." },
  { id:"W12", nome:'"Sucata"', classe:"SMG", municao:".45 ACP", dano:26, rpm:700, pente:25, reserva:125, recarga:2.4, tatica:1.80, precisao:50, mob:90, unlock:"Bronze I", nota:"Dano alto por bala com recuo vertical difícil de dominar." },
  { id:"W13", nome:'"Colibri"', classe:"SMG", municao:"4.6x30mm", dano:13, rpm:1150, pente:40, reserva:200, recarga:2.6, tatica:2.00, precisao:58, mob:94, unlock:"Prata II", nota:"Pente grande que mascara a recarga frequente; ideal para pressão." },
  { id:"W14", nome:'"Cortina"', classe:"SMG", municao:"9x19mm", dano:18, rpm:880, pente:35, reserva:175, recarga:2.3, tatica:1.75, precisao:60, mob:92, unlock:"Ouro III", nota:"A mais estável da classe; spread baixo em hip-fire." },
  { id:"W15", nome:'"Zumbido"', classe:"SMG", municao:"5.7x28mm", dano:21, rpm:820, pente:30, reserva:150, recarga:2.5, tatica:1.90, precisao:63, mob:91, unlock:"Prata I", nota:"Perfuração leve boa contra drones; recarga um pouco acima da média." },
  { id:"W16", nome:'"Barata"', classe:"SMG compacta", municao:".32", dano:12, rpm:1250, pente:45, reserva:225, recarga:2.0, tatica:1.55, precisao:44, mob:98, unlock:"Bronze III", nota:"A arma mais rápida do jogo para sacar; sofre acima de 15 m." },
  { id:"W17", nome:'"Prego"', classe:"SMG perfurante", municao:"4.6x30mm", dano:19, rpm:950, pente:32, reserva:160, recarga:2.7, tatica:2.05, precisao:61, mob:89, unlock:"Platina II", nota:"Atravessa escudos leves; recarga longa precisa ser feita atrás de parede." },
  { id:"W18", nome:'"Miragem"', classe:"SMG silenciada", municao:"9x19mm", dano:16, rpm:900, pente:30, reserva:150, recarga:2.2, tatica:1.70, precisao:72, mob:93, unlock:"Diamante III", nota:"Silenciosa: reduz em 60% o raio de alerta dos inimigos." },

  // --- RIFLES DE ASSALTO (10) ---
  { id:"W19", nome:'"Bandeirante"', classe:"Rifle de assalto", municao:"5.56mm", dano:30, rpm:720, pente:30, reserva:120, recarga:2.5, tatica:1.90, precisao:76, mob:80, unlock:"Bronze I", nota:"Arma-assinatura do jogo: fácil de aprender, difícil de dominar." },
  { id:"W20", nome:'"Tatu"', classe:"Rifle de assalto", municao:"7.62mm", dano:38, rpm:600, pente:25, reserva:100, recarga:2.8, tatica:2.15, precisao:72, mob:72, unlock:"Prata III", nota:"Dois tiros na cabeça encerram duelo; recuo lateral forte." },
  { id:"W21", nome:'"Curió"', classe:"Rifle de assalto", municao:"5.56mm", dano:27, rpm:800, pente:35, reserva:140, recarga:2.4, tatica:1.85, precisao:78, mob:84, unlock:"Prata I", nota:"Cadência alta e controle médio; melhor rifle para iniciante." },
  { id:"W22", nome:'"Serra"', classe:"Rifle de assalto", municao:"7.62mm", dano:42, rpm:560, pente:20, reserva:80, recarga:3.0, tatica:2.30, precisao:70, mob:68, unlock:"Ouro II", nota:"Dano por bala altíssimo, pente de 20 e recarga de 3 s: gestão total." },
  { id:"W23", nome:'"Araponga"', classe:"Rifle de assalto (rajada)", municao:"5.56mm", dano:29, rpm:900, pente:30, reserva:120, recarga:2.6, tatica:2.00, precisao:82, mob:79, unlock:"Ouro I", nota:"Rajada de 3 com recuo previsível: melhor rifle em média distância." },
  { id:"W24", nome:'"Tucano"', classe:"Rifle de assalto", municao:"6.8mm", dano:33, rpm:660, pente:30, reserva:120, recarga:2.7, tatica:2.05, precisao:79, mob:77, unlock:"Platina III", nota:"Equilíbrio puro; sem fraqueza clara e sem excesso em nada." },
  { id:"W25", nome:'"Jaguar"', classe:"Rifle de assalto", municao:"7.62mm", dano:40, rpm:640, pente:25, reserva:100, recarga:2.9, tatica:2.20, precisao:74, mob:70, unlock:"Platina I", nota:"Troca mobilidade por dano; exige recarga sempre com cobertura." },
  { id:"W26", nome:'"Íbis"', classe:"Rifle leve", municao:"5.56mm", dano:25, rpm:860, pente:30, reserva:150, recarga:2.2, tatica:1.75, precisao:80, mob:88, unlock:"Diamante II", nota:"Praticamente uma SMG de precisão; recarga mais rápida do grupo." },
  { id:"W27", nome:'"Cerrado"', classe:"Rifle silenciado", municao:".300 BLK", dano:36, rpm:700, pente:30, reserva:120, recarga:2.8, tatica:2.10, precisao:77, mob:75, unlock:"Mestre II", nota:"Dano de 7.62 com supressor; ótima em modos com objetivo furtivo." },
  { id:"W28", nome:'"Xavante"', classe:"Rifle experimental", municao:"6.5 CBJ", dano:31, rpm:780, pente:30, reserva:135, recarga:2.5, tatica:1.95, precisao:84, mob:81, unlock:"Lendário III", nota:"Mira híbrida que alterna 1x/4x sem trocar de arma." },

  // --- ESCOPETAS (7) ---
  { id:"W29", nome:'"Berrante"', classe:"Escopeta pump", municao:"Calibre 12", dano:96, rpm:75, pente:6, reserva:36, recarga:3.4, tatica:2.60, precisao:45, mob:70, unlock:"Bronze II", nota:"8 bagos por tiro; recarga pellet a pellet (cancelável a cada bago)." },
  { id:"W30", nome:'"Porteira"', classe:"Escopeta semiautomática", municao:"Calibre 12", dano:80, rpm:180, pente:8, reserva:40, recarga:3.8, tatica:3.00, precisao:44, mob:66, unlock:"Ouro III", nota:"Dois tiros rápidos decidem; recarga longa exige planejamento." },
  { id:"W31", nome:'"Chuva"', classe:"Escopeta automática", municao:"Calibre 12", dano:64, rpm:240, pente:10, reserva:50, recarga:4.2, tatica:3.40, precisao:40, mob:62, unlock:"Platina II", nota:"Dano por bago menor, mas a única escopeta que sustenta pressão." },
  { id:"W32", nome:'"Balaio"', classe:"Escopeta de cano duplo", municao:"Calibre 12", dano:112, rpm:120, pente:2, reserva:20, recarga:2.9, tatica:2.30, precisao:42, mob:76, unlock:"Prata II", nota:"Dois tiros devastadores e recarga completa; arma de tudo-ou-nada." },
  { id:"W33", nome:'"Lascas"', classe:"Escopeta de ferrolho", municao:"Calibre 20", dano:90, rpm:60, pente:5, reserva:30, recarga:3.2, tatica:2.50, precisao:58, mob:68, unlock:"Diamante III", nota:"Chumbo mais fechado: funciona como DMR de curta distância." },
  { id:"W34", nome:'"Brasa"', classe:"Escopeta incendiária", municao:"Calibre 12", dano:74, rpm:90, pente:6, reserva:30, recarga:3.6, tatica:2.80, precisao:43, mob:64, unlock:"Mestre I", nota:"Aplica queimadura de 6 s; recarga mais lenta da classe." },
  { id:"W35", nome:'"Marreta"', classe:"Escopeta slug", municao:"Calibre 12 slug", dano:130, rpm:50, pente:4, reserva:20, recarga:3.5, tatica:2.70, precisao:66, mob:60, unlock:"Lendário II", nota:"Um projétil único: acerta a 40 m, mas erra a 3 m se o alvo se mexer." },

  // --- PRECISÃO (7) ---
  { id:"W36", nome:'"Sabiá"', classe:"DMR", municao:"5.56mm", dano:55, rpm:300, pente:10, reserva:60, recarga:2.6, tatica:2.00, precisao:88, mob:72, unlock:"Prata II", nota:"Semiautomática de médio alcance; pune quem dispara sem mirar." },
  { id:"W37", nome:'"Falcão"', classe:"Sniper", municao:".308", dano:95, rpm:55, pente:5, reserva:25, recarga:3.4, tatica:2.70, precisao:94, mob:58, unlock:"Ouro I", nota:"Ciclo de ferrolho visível: cada tiro é um compromisso." },
  { id:"W38", nome:'"Gavião"', classe:"Sniper pesado", municao:".338", dano:135, rpm:40, pente:4, reserva:20, recarga:4.0, tatica:3.20, precisao:96, mob:48, unlock:"Platina I", nota:"Atravessa dois inimigos alinhados; mobilidade mínima." },
  { id:"W39", nome:'"Andorinha"', classe:"Sniper leve", municao:".243", dano:82, rpm:70, pente:5, reserva:30, recarga:3.0, tatica:2.30, precisao:92, mob:66, unlock:"Diamante II", nota:"A sniper mais ágil; recarga 0,4 s mais rápida que a Falcão." },
  { id:"W40", nome:'"Curumim"', classe:"DMR semiauto", municao:"7.62mm", dano:62, rpm:260, pente:12, reserva:72, recarga:2.8, tatica:2.20, precisao:86, mob:70, unlock:"Mestre II", nota:"Pente maior compensa a cadência baixa em duelos longos." },
  { id:"W41", nome:'"Carcará"', classe:"Antimaterial", municao:".50 BMG", dano:210, rpm:30, pente:3, reserva:12, recarga:4.8, tatica:3.90, precisao:97, mob:38, unlock:"Lendário I", nota:"Atravessa paredes finas e escudos; recarga quase 5 s." },
  { id:"W42", nome:'"Peneira"', classe:"Sniper de trilho", municao:"Célula", dano:150, rpm:45, pente:4, reserva:16, recarga:3.6, tatica:2.90, precisao:98, mob:45, unlock:"Lendário III", nota:"Carrega 0,9 s antes do tiro; acerta através de cobertura média." },

  // --- METRALHADORAS (4) ---
  { id:"W43", nome:'"Boiadeiro"', classe:"Metralhadora leve", municao:"5.56mm", dano:32, rpm:750, pente:100, reserva:200, recarga:6.5, tatica:5.20, precisao:66, mob:42, unlock:"Ouro II", nota:"Bipé reduz recuo em 70% ao atirar deitado." },
  { id:"W44", nome:'"Trator"', classe:"Metralhadora leve", municao:"7.62mm", dano:40, rpm:650, pente:75, reserva:150, recarga:7.0, tatica:5.60, precisao:62, mob:36, unlock:"Platina III", nota:"Cobre objetivo sozinha; recarga de 7 s pede time protegendo." },
  { id:"W45", nome:'"Dínamo"', classe:"Metralhadora leve", municao:".300", dano:36, rpm:800, pente:120, reserva:240, recarga:7.5, tatica:6.00, precisao:70, mob:40, unlock:"Diamante I", nota:"Pente enorme; a recarga mais longa do jogo fora da Minigun." },
  { id:"W46", nome:'"Cachoeira"', classe:"Minigun", municao:"7.62mm", dano:28, rpm:1600, pente:200, reserva:400, recarga:9.0, tatica:7.50, precisao:52, mob:22, unlock:"Lendário II", nota:"Spin-up de 0,8 s antes de atirar; recarga de 9 s nunca acontece em combate." },

  // --- EXPLOSIVOS (4) ---
  { id:"W47", nome:'"Buzina"', classe:"Lança-granadas", municao:"40mm", dano:90, rpm:60, pente:4, reserva:12, recarga:3.2, tatica:2.60, precisao:60, mob:55, unlock:"Prata III", nota:"Dano em área 4 m; recuo de arco exige cálculo de distância." },
  { id:"W48", nome:'"Boi"', classe:"Lança-foguetes", municao:"Foguete 80mm", dano:160, rpm:45, pente:1, reserva:5, recarga:3.8, tatica:3.20, precisao:62, mob:48, unlock:"Ouro III", nota:"Um foguete por recarga: cada disparo é uma decisão tática." },
  { id:"W49", nome:'"Cupim"', classe:"Míssil guiado", municao:"Míssil", dano:120, rpm:30, pente:2, reserva:8, recarga:4.2, tatica:3.50, precisao:70, mob:50, unlock:"Diamante III", nota:"Lock-on de 1,2 s; perde o alvo se ele quebrar a linha de visão." },
  { id:"W50", nome:'"Cinzeiro"', classe:"Morteiro portátil", municao:"60mm", dano:140, rpm:25, pente:1, reserva:6, recarga:4.6, tatica:3.80, precisao:55, mob:44, unlock:"Mestre III", nota:"Arco balístico: acerta atrás de cobertura, mas leva 2 s para cair." },

  // --- ENERGIA / PLASMA (6) ---
  { id:"W51", nome:'"Vaga-lume"', classe:"Pistola de plasma", municao:"Célula", dano:26, rpm:420, pente:16, reserva:0, recarga:0, tatica:0, precisao:74, mob:94, unlock:"Ouro III", nota:"Sem pente: 100% de calor = overheat de 1,8 s (não conta como recarga)." },
  { id:"W52", nome:'"Prisma"', classe:"Rifle de plasma", municao:"Célula", dano:34, rpm:700, pente:24, reserva:0, recarga:0, tatica:0, precisao:80, mob:78, unlock:"Platina II", nota:"Rajada de 3 tiros com perfuração; esfria mais devagar que a pistola." },
  { id:"W53", nome:'"Tesla"', classe:"Rifle elétrico", municao:"Célula", dano:22, rpm:600, pente:32, reserva:0, recarga:0, tatica:0, precisao:76, mob:80, unlock:"Diamante I", nota:"Encadeia em até 3 inimigos próximos; -20% de dano por salto." },
  { id:"W54", nome:'"Ímã"', classe:"Rifle de gravidade", municao:"Célula", dano:18, rpm:400, pente:20, reserva:0, recarga:0, tatica:0, precisao:72, mob:76, unlock:"Mestre I", nota:"Puxa inimigos para o centro da mira; ótimo para agrupar e explodir." },
  { id:"W55", nome:'"Aurora"', classe:"Fuzil de raios", municao:"Célula", dano:12, rpm:1200, pente:100, reserva:0, recarga:0, tatica:0, precisao:90, mob:70, unlock:"Platina I", nota:"Feixe contínuo hitscan com DPS fixo; precisa manter o alvo na mira." },
  { id:"W56", nome:'"Nova"', classe:"Canhão de plasma", municao:"Célula", dano:110, rpm:50, pente:5, reserva:0, recarga:0, tatica:0, precisao:82, mob:60, unlock:"Lendário II", nota:"Carga de 1,1 s; tiro carregado atravessa escudos e aplica empurrão." },

  // --- CORPO A CORPO (4) ---
  { id:"W57", nome:'"Facão"', classe:"Corpo a corpo", municao:"—", dano:55, rpm:72, pente:0, reserva:0, recarga:0, tatica:0, precisao:100, mob:100, unlock:"Bronze I", nota:"Golpe de 0,8 s; execução automática pelas costas." },
  { id:"W58", nome:'"Marreta"', classe:"Corpo a corpo", municao:"—", dano:120, rpm:40, pente:0, reserva:0, recarga:0, tatica:0, precisao:100, mob:82, unlock:"Prata II", nota:"Quebra cobertura e escudos; balança 0,8 s antes de acertar." },
  { id:"W59", nome:'"Garras de choque"', classe:"Corpo a corpo", municao:"—", dano:35, rpm:180, pente:0, reserva:0, recarga:0, tatica:0, precisao:100, mob:100, unlock:"Ouro II", nota:"Dois golpes rápidos com atordoamento de 0,3 s cada." },
  { id:"W60", nome:'"Lâmina de fase"', classe:"Corpo a corpo", municao:"—", dano:80, rpm:60, pente:0, reserva:0, recarga:0, tatica:0, precisao:100, mob:96, unlock:"Lendário III", nota:"Ignora 100% do escudo de energia; teletransporta 3 m no golpe final." }
];

const ENEMIES = [
  // --- INFANTARIA (12) ---
  { id:"E01", nome:"Grumete Raso", tipo:"Infantaria", bioma:"Docas", hp:80, dano:8, vel:"Média", ia:"Patrulha em dupla e usa cobertura; recua quando perde 50% da vida.", fraqueza:"Cabeça", rp:10 },
  { id:"E02", nome:"Corredor de Choque", tipo:"Infantaria", bioma:"Docas", hp:60, dano:12, vel:"Alta", ia:"Avança em linha reta aos gritos; ignora cobertura e tenta flanquear pelo lado.", fraqueza:"Explosivo", rp:12 },
  { id:"E03", nome:"Soldado de Trincheira", tipo:"Infantaria", bioma:"Ferro-Velho", hp:110, dano:10, vel:"Baixa", ia:"Fica atrás de caixas, dispara rajadas de 3 e só sai ao ser flanqueado.", fraqueza:"Flanco", rp:14 },
  { id:"E04", nome:"Porta-Estandarte", tipo:"Infantaria", bioma:"Ferro-Velho", hp:100, dano:6, vel:"Baixa", ia:"Concede +25% de dano a aliados próximos; prioriza se esconder.", fraqueza:"Cabeça", rp:18 },
  { id:"E05", nome:"Sargento Ferrão", tipo:"Infantaria", bioma:"Refinaria", hp:160, dano:14, vel:"Média", ia:"Comanda esquadrão de 4 grumetes e ordena cerco em pinça.", fraqueza:"Corpo a corpo", rp:25 },
  { id:"E06", nome:"Batedor Noturno", tipo:"Infantaria", bioma:"Estufa", hp:70, dano:11, vel:"Alta", ia:"Fica invisível parado; aparece por 0,6 s ao atacar e foge para flanquear.", fraqueza:"Área", rp:20 },
  { id:"E07", nome:"Arremessador", tipo:"Infantaria", bioma:"Ruínas", hp:90, dano:18, vel:"Média", ia:"Calcula arco de granada para forçar o jogador a sair da cobertura.", fraqueza:"Cabeça", rp:16 },
  { id:"E08", nome:"Fuzileiro Pesado", tipo:"Infantaria", bioma:"Refinaria", hp:140, dano:13, vel:"Baixa", ia:"Avança atirando; quando recarrega, abaixa a arma e fica vulnerável por 2,5 s.", fraqueza:"Durante recarga", rp:18 },
  { id:"E09", nome:"Escudeiro Balístico", tipo:"Infantaria", bioma:"Cibermercado", hp:120, dano:9, vel:"Baixa", ia:"Escudo frontal absorve 80% do dano; vira de costas ao recuar.", fraqueza:"Costas / perfurante", rp:20 },
  { id:"E10", nome:"Espião Mímico", tipo:"Infantaria", bioma:"Cibermercado", hp:85, dano:22, vel:"Média", ia:"Finge ser caixa ou aliado caído; ataca quando o jogador passa a 4 m.", fraqueza:"Leitura de cenário", rp:22 },
  { id:"E11", nome:"Portador de Mina", tipo:"Infantaria", bioma:"Ruínas", hp:75, dano:30, vel:"Alta", ia:"Corre para perto e explode em 1,5 s telegrafados; ao morrer deixa 2 minas.", fraqueza:"Longa distância", rp:15 },
  { id:"E12", nome:"Vociferador", tipo:"Infantaria", bioma:"Estufa", hp:130, dano:5, vel:"Baixa", ia:"Grita a cada 8 s e chama 3 reforços; matar cedo evita ondas.", fraqueza:"Cabeça", rp:24 },

  // --- PRECISÃO (8) ---
  { id:"E13", nome:"Olho de Vidro", tipo:"Precisão", bioma:"Ferro-Velho", hp:85, dano:55, vel:"Baixa", ia:"Mira com laser vermelho por 1,2 s antes de atirar; troca de telhado sempre.", fraqueza:"Mover + headshot", rp:22 },
  { id:"E14", nome:"Caçador de Telhado", tipo:"Precisão", bioma:"Docas", hp:75, dano:45, vel:"Média", ia:"Sobe em contêineres e atira por cima da cobertura; nunca desce.", fraqueza:"Gancho / ângulo alto", rp:20 },
  { id:"E15", nome:"Atirador de Cristal", tipo:"Precisão", bioma:"Cristal", hp:95, dano:50, vel:"Baixa", ia:"Tiro perfurante que atravessa 2 paredes finas; telegrafa com brilho violeta.", fraqueza:"Perfurante / flanco", rp:24 },
  { id:"E16", nome:"Sentinela de Relógio", tipo:"Precisão", bioma:"Órbita", hp:100, dano:60, vel:"Imóvel", ia:"Atira sempre no mesmo intervalo de 3 s; ensina ritmo de avanço.", fraqueza:"Timing", rp:22 },
  { id:"E17", nome:"Viúva de Ferro", tipo:"Precisão", bioma:"Ruínas", hp:80, dano:40, vel:"Média", ia:"Marca o jogador por 5 s (contorno visível para todos os inimigos).", fraqueza:"Matar antes de marcar", rp:26 },
  { id:"E18", nome:"Flecheiro Elétrico", tipo:"Precisão", bioma:"Estufa", hp:70, dano:15, vel:"Alta", ia:"Dardo paralisante à distância; mantém 12 m de espaçamento.", fraqueza:"Corpo a corpo", rp:18 },
  { id:"E19", nome:"Observador Longo", tipo:"Precisão", bioma:"Órbita", hp:65, dano:0, vel:"Baixa", ia:"Não causa dano: ilumina o jogador e aumenta a precisão de todos os aliados.", fraqueza:"Prioridade alta", rp:28 },
  { id:"E20", nome:"Atirador Fantasma", tipo:"Precisão", bioma:"Cristal", hp:90, dano:70, vel:"Baixa", ia:"Invisível até atirar; o disparo revela a posição por 1 s.", fraqueza:"Som / flash", rp:30 },

  // --- PESADOS / BLINDADOS (8) ---
  { id:"E21", nome:"Bruto de Placas", tipo:"Pesado", bioma:"Ferro-Velho", hp:280, dano:20, vel:"Muito baixa", ia:"Escudo pesado, avança devagar; só vira quando recebe dano pelas costas.", fraqueza:"Costas / explosivo", rp:30 },
  { id:"E22", nome:"Touro de Cerco", tipo:"Pesado", bioma:"Refinaria", hp:320, dano:35, vel:"Alta (investida)", ia:"Carrega em linha reta a cada 6 s e destrói cobertura no caminho.", fraqueza:"Desviar e atacar flanco", rp:32 },
  { id:"E23", nome:"Portão Humano", tipo:"Pesado", bioma:"Cibermercado", hp:350, dano:12, vel:"Baixa", ia:"Carrega escudo de área que protege 3 aliados; anda em formação.", fraqueza:"Perfurante / flanco", rp:34 },
  { id:"E24", nome:"Canhoneiro Blindado", tipo:"Pesado", bioma:"Docas", hp:300, dano:25, vel:"Baixa", ia:"Metralhadora montada com rajada de 2 s e pausa de 3 s (janela de ataque).", fraqueza:"Durante pausa", rp:30 },
  { id:"E25", nome:"Golem de Sucata", tipo:"Pesado", bioma:"Ferro-Velho", hp:400, dano:28, vel:"Baixa", ia:"Junta peças do chão e recupera 20% de vida; precisa ser finalizado rápido.", fraqueza:"Fogo", rp:36 },
  { id:"E26", nome:"Mula de Carga", tipo:"Pesado", bioma:"Ruínas", hp:260, dano:60, vel:"Média", ia:"Exoesqueleto com mochila explosiva; se morrer perto de aliados, eles morrem.", fraqueza:"Detonar à distância", rp:28 },
  { id:"E27", nome:"Baluarte", tipo:"Pesado", bioma:"Órbita", hp:450, dano:22, vel:"Imóvel", ia:"Invulnerável de frente; atira em cone de 90° e gira lentamente.", fraqueza:"Costas", rp:38 },
  { id:"E28", nome:"Titanito", tipo:"Pesado", bioma:"Cristal", hp:520, dano:40, vel:"Baixa", ia:"Mini-chefe de área; golpe de área com 1,5 s de telegrafia no chão.", fraqueza:"Pontos brilhantes nas juntas", rp:45 },

  // --- ANIMAIS / MUTANTES (8) ---
  { id:"E29", nome:"Ratazana Gigante", tipo:"Mutante", bioma:"Estufa", hp:55, dano:14, vel:"Muito alta", ia:"Ataca em matilha de 5, circula e morde pelas laterais.", fraqueza:"Área / escopeta", rp:8 },
  { id:"E30", nome:"Enxame de Vespas de Metal", tipo:"Mutante", bioma:"Refinaria", hp:70, dano:6, vel:"Alta", ia:"Nuvem de 12 unidades que persegue em espiral; dano contínuo pequeno.", fraqueza:"Fogo / elétrico", rp:12 },
  { id:"E31", nome:"Crocodilo de Esgoto", tipo:"Mutante", bioma:"Docas", hp:240, dano:45, vel:"Média (emboscada)", ia:"Fica submerso e emerge sob o jogador; lento fora da água.", fraqueza:"Sair da água", rp:26 },
  { id:"E32", nome:"Fungo Ambulante", tipo:"Mutante", bioma:"Estufa", hp:130, dano:8, vel:"Muito baixa", ia:"Libera nuvem de esporos que reduz a visão por 6 s.", fraqueza:"Fogo", rp:14 },
  { id:"E33", nome:"Louva-a-Deus de Vidro", tipo:"Mutante", bioma:"Cristal", hp:110, dano:38, vel:"Alta", ia:"Salta 8 m e golpeia duas vezes; fica parado 1 s após o salto.", fraqueza:"Após o salto", rp:20 },
  { id:"E34", nome:"Verme de Núcleo", tipo:"Mutante", bioma:"Cristal", hp:180, dano:30, vel:"Média (subsolo)", ia:"Perfura o chão, some e reaparece sob o jogador a cada 4 s.", fraqueza:"Som do solo", rp:24 },
  { id:"E35", nome:"Urso Cinza Mutante", tipo:"Mutante", bioma:"Neve", hp:380, dano:50, vel:"Alta (carga)", ia:"Carrega e derruba o jogador; fica exausto por 3 s depois do impacto.", fraqueza:"Exaustão pós-carga", rp:34 },
  { id:"E36", nome:"Rainha do Enxame", tipo:"Mutante", bioma:"Estufa", hp:300, dano:16, vel:"Baixa", ia:"Gera 2 ratazanas a cada 7 s; se ficar viva, o mapa enche.", fraqueza:"Fogo", rp:36 },

  // --- DRONES / TECNOLÓGICOS (8) ---
  { id:"E37", nome:"Drone Batedor", tipo:"Drone", bioma:"Órbita", hp:50, dano:0, vel:"Alta", ia:"Marca jogadores no minimapa; foge quando recebe dano.", fraqueza:"Qualquer arma", rp:12 },
  { id:"E38", nome:"Drone Kamikaze", tipo:"Drone", bioma:"Cibermercado", hp:40, dano:45, vel:"Alta", ia:"Voa em direção ao jogador e explode ao encostar (bip de 1 s).", fraqueza:"Tiro no ar", rp:12 },
  { id:"E39", nome:"Drone Escudeiro", tipo:"Drone", bioma:"Órbita", hp:90, dano:0, vel:"Média", ia:"Projeta escudo de energia em 2 aliados até ser destruído.", fraqueza:"Elétrico", rp:22 },
  { id:"E40", nome:"Torreta Móvel", tipo:"Drone", bioma:"Ferro-Velho", hp:160, dano:18, vel:"Baixa", ia:"Roda em patrulha e entra em modo tiro ao ver o jogador; recarrega a cada 40 tiros.", fraqueza:"Durante recarga", rp:18 },
  { id:"E41", nome:"Reparador Automático", tipo:"Drone", bioma:"Refinaria", hp:100, dano:0, vel:"Média", ia:"Cura 15 PV/s em inimigos próximos; nunca entra em combate.", fraqueza:"Prioridade alta", rp:26 },
  { id:"E42", nome:"Fantasma Digital", tipo:"Drone", bioma:"Cibermercado", hp:120, dano:24, vel:"Média", ia:"Teleporta 6 m quando recebe dano e deixa um holograma falso.", fraqueza:"Área", rp:26 },
  { id:"E43", nome:"Sentinela de Órbita", tipo:"Drone", bioma:"Órbita", hp:200, dano:30, vel:"Imóvel", ia:"Flutua e varre o corredor com laser contínuo em arco de 120°.", fraqueza:"Ponto cego atrás", rp:28 },
  { id:"E44", nome:"Enxame Alfa", tipo:"Drone", bioma:"Cristal", hp:150, dano:20, vel:"Alta", ia:"4 drones que se movem em formação e atacam em sincronia.", fraqueza:"Elétrico (encadeia)", rp:30 },

  // --- ELITE / CHEFES (6) ---
  { id:"E45", nome:'Capitã "Olho Cego"', tipo:"Chefe", bioma:"Ferro-Velho", hp:2200, dano:35, vel:"Média", ia:"Fase 1: cobre com fumaça. Fase 2: invoca 2 Olhos de Vidro e mira por som.", fraqueza:"Tiro no olho cibernético", rp:150 },
  { id:"E46", nome:'"O Ferreiro"', tipo:"Chefe", bioma:"Refinaria", hp:3000, dano:60, vel:"Baixa", ia:"Martelo de área e forja armadura nas costas; quebre a armadura para expor o núcleo.", fraqueza:"Núcleo exposto", rp:180 },
  { id:"E47", nome:'"Mãe Estufa"', tipo:"Chefe", bioma:"Estufa", hp:2600, dano:30, vel:"Imóvel", ia:"Enraizada no centro; gera mutantes e fecha as saídas com raízes.", fraqueza:"Fogo nas raízes", rp:180 },
  { id:"E48", nome:'"Núcleo Zero"', tipo:"Chefe", bioma:"Órbita", hp:2800, dano:45, vel:"Imóvel", ia:"IA central que controla lasers da arena e tranca setores a cada 20%.", fraqueza:"Sobrecarga do painel (EMP)", rp:200 },
  { id:"E49", nome:'"Gêmeos Espelho"', tipo:"Chefe", bioma:"Cibermercado", hp:2000, dano:40, vel:"Alta", ia:"Dois chefes que compartilham dano; precisam morrer no mesmo intervalo de 8 s.", fraqueza:"Dano dividido", rp:190 },
  { id:"E50", nome:'"O Colecionador"', tipo:"Chefe final", bioma:"Cristal", hp:4000, dano:50, vel:"Média", ia:"Fase final: usa versões das 60 armas do jogo em sequência e copia a última arma do jogador.", fraqueza:"Recarregar junto com ele", rp:300 }
];

const RANKS = [
  { tier:"Bronze",   divisoes:["III","II","I"], rpMin:0,    rpMax:899,    cor:"#b06a3b", premio:"Acesso às 12 primeiras armas e ao modo Treino Ranqueado." },
  { tier:"Prata",    divisoes:["III","II","I"], rpMin:900,  rpMax:1799,   cor:"#c9d2da", premio:"Modificadores de recarga (pente estendido, empunhadura rápida)." },
  { tier:"Ouro",     divisoes:["III","II","I"], rpMin:1800, rpMax:2899,   cor:"#e8b93f", premio:"Armas de Ouro liberadas + primeira skin de arma pixelada animada." },
  { tier:"Platina",  divisoes:["III","II","I"], rpMin:2900, rpMax:4199,   cor:"#63d6d1", premio:"Playlist Ranqueada de 5v5 em mapas competitivos completos." },
  { tier:"Diamante", divisoes:["III","II","I"], rpMin:4200, rpMax:5799,   cor:"#7c9dff", premio:"Armas de energia liberadas e viseira de elite." },
  { tier:"Mestre",   divisoes:["III","II","I"], rpMin:5800, rpMax:7599,   cor:"#c07cff", premio:"Torneios semanais, veto de mapa e chat de voz de equipe." },
  { tier:"Lendário", divisoes:["—"],          rpMin:7600, rpMax:null,    cor:"#ff6b8b", premio:"Leaderboard global, skins exclusivas e o título de 'Colecionador'." }
];

const RELOAD_TYPES = [
  { nome:"Recarga Completa", tecla:"R", tempo:"100% do tempo-base", regra:"Substitui o pente cheio. Pode ser cancelada a qualquer momento — o progresso é perdido, não salvo.", risco:"Alto", uso:"Fora de combate, atrás de cobertura ou com aliado cobrindo." },
  { nome:"Recarga Tática", tecla:"R com munição no pente", tempo:"≈ 75% do tempo-base", regra:"Mantém a bala na câmara (+1 no pente) e é a recarga mais segura. Cancelável sem custo até 60% da animação.", risco:"Baixo", uso:"Sempre que houver 1+ bala no pente: mais rápida e sem perder o +1." },
  { nome:"Recarga de Emergência", tecla:"R duas vezes rápido (duplo toque)", tempo:"≈ 70% do tempo-base", regra:"Descarta o pente parcial: perde a munição restante e o bônus da câmara. Não pode ser cancelada.", risco:"Médio", uso:"Último recurso com 2–3 balas e inimigo encostando." },
  { nome:"Recarga Ativa (timing)", tecla:"Clique esquerdo no momento exato da barra", tempo:"100%, com janela de 0,25 s", regra:"Janela verde acertada = -25% no tempo total + 15% de cadência por 3 s. Errar = +0,4 s de atraso.", risco:"Médio", uso:"Jogadores avançados transformam recarga em vantagem de DPS." },
  { nome:"Cancelamento por troca", tecla:"1/2/3 durante a recarga", tempo:"Progresso retomado em até 6s", regra:"Trocar de arma conserva o progresso da recarga por 6 s: voltar à arma retoma de onde parou.", risco:"Baixo", uso:"Micro-gestão clássica: recarrega, troca para escopeta, volta com pente cheio." },
  { nome:"Recarga em Movimento", tecla:"—", tempo:"Conforme a classe da arma", regra:"SMGs e pistolas recarregam andando sem penalidade; rifles perdem 40% de velocidade; snipers e LMGs ficam 20% mais lentos ao recarregar.", risco:"—", uso:"Escolha de classe de arma influencia o posicionamento." },
  { nome:"Overheat (armas de energia)", tecla:"—", tempo:"1,8–2,6s de travamento", regra:"Armas de energia não têm pente: acumulam calor. 100% = travamento de 1,8–2,6 s. Resfriamento passivo só começa 0,5 s após parar de atirar.", risco:"Médio", uso:"Rajadas curtas mantêm o DPS sem travar em combate." },
  { nome:"Recarga por bago / cartucho", tecla:"R (interrompível)", tempo:"0,35–0,5s por cartucho", regra:"Escopetas e revólveres recarregam um cartucho por vez; interromper guarda o que já entrou — cada bago pode ser um tiro.", risco:"Baixo", uso:"Escopeta: recarregue 2 bagos, atire, recarregue mais 2." }
];

const ART_RULES = [
  { titulo:"Resolução interna fixa", texto:"Renderize o mundo em 480×270 (ou 320×180 no modo 'pixel raiz') e faça upscale com filtro Nearest/Point, sem suavização. A UI é desenhada na resolução nativa da tela para ficar legível." },
  { titulo:"Geometria 3D low-poly + textura pixel", texto:"Modelos com poucos polígonos (80–800 tris para personagens, 20–200 para props) e texturas de 32×32 a 64×64 com paleta quantizada. Nada de PBR realista: albedo + sombreamento flat." },
  { titulo:"Paleta limitada", texto:"Máximo de 24 cores por bioma + 8 cores de UI. Dithering ordenado (Bayer 4×4) para gradientes. Preto nunca absoluto: #10121a para dar leitura de pixel art." },
  { titulo:"Iluminação", texto:"Luzes flat com vertex color, sombras em blocos (shadow map de 256–512 px), sem blur. Três tons por material: luz, base, sombra." },
  { titulo:"Animações", texto:"12–18 FPS para inimigos e armas (animação “stepped”), 60 FPS para câmera e movimento. Recarga com 8–14 keyframes legíveis — cada arma tem animação própria de recarga, com o pente saindo da tela na hora exata." },
  { titulo:"Feedback (juice) pixelado", texto:"Hitmarker em cruz de 3 px, números de dano com fonte bitmap, partículas quadradas, flash de 2 frames no disparo, screen shake de 1–3 px. Nada de motion blur ou bloom pesado." },
  { titulo:"Legibilidade competitiva", texto:"Silhueta de inimigo único por classe (grumete pequeno, pesado largo, drone flutuante, chefe 3× o tamanho). Cor de contorno aliada/inimiga (azul/vermelho) e opção de alto contraste e escala de dano." },
  { titulo:"HUD", texto:"HUD mínimo: munição pente/reserva em fonte bitmap grande, barra de recarga segmentada, minimapa circular, indicador de ranque e 4 slots de arma. Tudo pixelado, escala inteira (1×, 2×, 3×)." }
];
