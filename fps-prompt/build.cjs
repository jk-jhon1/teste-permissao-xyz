/* Gera as tabelas do PROMPT.md a partir de data.js.
   Uso: node build.cjs                                          */
const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(__dirname, "data.js"), "utf8")
  + "\nmodule.exports = { WEAPONS, ENEMIES, RANKS, RELOAD_TYPES, ART_RULES };";
const tmp = path.join(__dirname, ".data.cjs");
fs.writeFileSync(tmp, src);
const { WEAPONS, ENEMIES, RANKS, RELOAD_TYPES, ART_RULES } = require(tmp);
fs.unlinkSync(tmp);

const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const table = (head, rows) =>
  [
    `| ${head.join(" | ")} |`,
    `|${head.map(() => "---").join("|")}|`,
    ...rows.map((r) => `| ${r.map(esc).join(" | ")} |`),
  ].join("\n");

const weapons = table(
  ["ID", "Arma", "Família", "Munição", "Dano", "RPM", "Pente", "Reserva", "Recarga", "Tática", "Prec.", "Mob.", "Desbloqueio", "Nota de design"],
  WEAPONS.map((w) => [
    w.id, w.nome, w.classe, w.municao, w.dano, w.rpm,
    w.pente || "—", w.reserva || "—",
    w.recarga ? w.recarga.toFixed(1) + "s" : "overheat",
    w.tatica ? w.tatica.toFixed(1) + "s" : "—",
    w.precisao, w.mob, w.unlock, w.nota,
  ])
);

const enemies = table(
  ["ID", "Inimigo", "Família", "Bioma", "Vida", "Dano", "Velocidade", "Comportamento de IA", "Fraqueza", "RP"],
  ENEMIES.map((e) => [e.id, e.nome, e.tipo, e.bioma, e.hp, e.dano, e.vel, e.ia, e.fraqueza, e.rp])
);

const ranks = table(
  ["Tier", "Divisões", "Faixa de RP", "Cor", "Recompensa"],
  RANKS.map((r) => [
    r.tier, r.divisoes.join(" · "),
    r.rpMax === null ? `${r.rpMin}+` : `${r.rpMin}–${r.rpMax}`,
    r.cor, r.premio,
  ])
);

const reload = table(
  ["Mecânica", "Tecla", "Tempo", "Risco", "Regra", "Quando usar"],
  RELOAD_TYPES.map((r) => [r.nome, r.tecla, r.tempo, r.risco, r.regra, r.uso])
);

const art = table(
  ["Regra", "Especificação"],
  ART_RULES.map((a) => [a.titulo, a.texto])
);

const file = path.join(__dirname, "PROMPT.md");
let md = fs.readFileSync(file, "utf8");
const map = {
  "{{WEAPONS_TABLE}}": weapons,
  "{{ENEMIES_TABLE}}": enemies,
  "{{RANKS_TABLE}}": ranks,
  "{{RELOAD_TABLE}}": reload,
  "{{ART_TABLE}}": art,
};
for (const [k, v] of Object.entries(map)) md = md.split(k).join(v);
fs.writeFileSync(file, md);

console.log(`PROMPT.md atualizado — ${WEAPONS.length} armas, ${ENEMIES.length} inimigos, ${RANKS.length} tiers, ${RELOAD_TYPES.length} recargas, ${ART_RULES.length} regras de arte.`);
