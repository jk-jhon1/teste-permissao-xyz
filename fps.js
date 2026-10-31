import * as THREE from './vendor/three.module.js';

/* ============================ ZONA DE CONFLITO ============================
   FPS de sobrevivência em arena.
   - 60 armas com estatísticas próprias e sistema de recarga
   - 50 tipos de inimigos em 5 tiers
   - Patentes/ranqueamento por nível e XP
   - Sem dependências externas (Three.js vendido em vendor/)
============================================================================= */

const $ = id => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/* ============================ ÁUDIO (Web Audio API) ============================ */
const Audio = {
  ctx: null,
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    return this.ctx;
  },
  tone(freq, dur, type = 'sine', vol = 0.06, when = null) {
    const c = this.ensure();
    const t = when === null ? c.currentTime : when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start(t);
    o.stop(t + dur);
  },
  noise(dur, vol = 0.07, when = null) {
    const c = this.ensure();
    const t = when === null ? c.currentTime : when;
    const len = Math.max(1, c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const n = c.createBufferSource();
    n.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    n.connect(g);
    g.connect(c.destination);
    n.start(t);
    n.stop(t + dur);
  },
  shoot(category) {
    const t = this.ctx.currentTime;
    if (category === 'Pistola') {
      this.noise(0.05, 0.13, t);
      this.tone(240, 0.07, 'square', 0.07, t);
    } else if (category === 'Submetralhadora') {
      this.noise(0.04, 0.10, t);
      this.tone(190, 0.05, 'square', 0.05, t);
    } else if (category === 'Espingarda') {
      this.noise(0.14, 0.20, t);
      this.tone(80, 0.18, 'sawtooth', 0.09, t);
    } else if (category === 'Fuzil de Assalto') {
      this.noise(0.05, 0.11, t);
      this.tone(160, 0.06, 'square', 0.055, t);
    } else if (category === 'Sniper') {
      this.noise(0.10, 0.16, t);
      this.tone(55, 0.22, 'sawtooth', 0.10, t);
      this.tone(105, 0.12, 'square', 0.04, t + 0.07);
    } else {
      this.noise(0.07, 0.13, t);
      this.tone(140, 0.07, 'square', 0.06, t);
    }
  },
  reload() {
    const t = this.ctx.currentTime;
    this.tone(140, 0.05, 'square', 0.06, t);
    this.tone(330, 0.13, 'square', 0.06, t + 0.18);
    this.noise(0.03, 0.05, t + 0.32);
    this.tone(420, 0.16, 'square', 0.05, t + 0.50);
  },
  hit(metal) {
    const t = this.ctx.currentTime;
    if (metal) { this.tone(420, 0.09, 'square', 0.07, t); this.noise(0.06, 0.09, t); }
    else { this.tone(240, 0.11, 'sine', 0.10, t); this.tone(170, 0.11, 'sine', 0.07, t + 0.06); }
  },
  enemyPain() {
    const t = this.ctx.currentTime;
    this.tone(100, 0.16, 'sawtooth', 0.11, t);
  },
  death() {
    const t = this.ctx.currentTime;
    this.tone(55, 0.45, 'sawtooth', 0.13, t);
    this.tone(45, 0.55, 'sawtooth', 0.09, t + 0.18);
    this.noise(0.35, 0.11, t);
  },
  levelUp() {
    const t = this.ctx.currentTime;
    [262, 330, 392, 523].forEach((f, i) => this.tone(f, 0.16, 'square', 0.07, t + i * 0.07));
  },
  buy() {
    const t = this.ctx.currentTime;
    this.tone(900, 0.10, 'square', 0.06, t);
    this.tone(1150, 0.10, 'square', 0.06, t + 0.09);
  },
  step() {
    const t = this.ctx.currentTime;
    this.tone(80, 0.04, 'sine', 0.02, t);
  }
};

/* ============================ PATENTES ============================ */
const RANKS = [
  { name: 'Ferro', color: '#8b97b3', minLevel: 1 },
  { name: 'Bronze', color: '#cd7f32', minLevel: 5 },
  { name: 'Prata', color: '#c0c0c0', minLevel: 10 },
  { name: 'Ouro', color: '#ffd700', minLevel: 15 },
  { name: 'Platina', color: '#8fbcbb', minLevel: 20 },
  { name: 'Diamante', color: '#7fffd4', minLevel: 25 },
  { name: 'Mestre', color: '#a020f0', minLevel: 30 },
  { name: 'Grão-Mestre', color: '#ff1493', minLevel: 35 },
  { name: 'Desafiante', color: '#ff4d6d', minLevel: 40 },
];
function rankOf(level) {
  let r = RANKS[0];
  for (const rank of RANKS) if (level >= rank.minLevel) r = rank;
  return r;
}
function xpFor(level) {
  return Math.floor(100 * Math.pow(1.62, level - 1));
}

/* ============================ ARMAS (60) ============================ */
// id, nome, categoria, dano, cadência(ms), carregador, reserva, recarga(ms), dispersão, recuo, raridade, preço, nível
const WEAPONS = [
  // Pistolas
  { id: 'glock17', name: 'Glock 17', cat: 'Pistola', dmg: 26, rof: 150, mag: 17, res: 170, reload: 1200, spread: 0.012, recoil: 0.35, rarity: 'Comum', price: 0, lvl: 1 },
  { id: 'p250', name: 'P250', cat: 'Pistola', dmg: 30, rof: 200, mag: 12, res: 120, reload: 1200, spread: 0.014, recoil: 0.40, rarity: 'Comum', price: 250, lvl: 2 },
  { id: 'm1911', name: 'M1911', cat: 'Pistola', dmg: 45, rof: 260, mag: 7, res: 70, reload: 1500, spread: 0.010, recoil: 0.60, rarity: 'Comum', price: 300, lvl: 3 },
  { id: 'tec9', name: 'Tec-9', cat: 'Pistola', dmg: 24, rof: 110, mag: 18, res: 180, reload: 1100, spread: 0.020, recoil: 0.50, rarity: 'Comum', price: 350, lvl: 3 },
  { id: 'usp', name: 'USP-S', cat: 'Pistola', dmg: 32, rof: 180, mag: 12, res: 120, reload: 1300, spread: 0.011, recoil: 0.40, rarity: 'Comum', price: 450, lvl: 4 },
  { id: 'cz75', name: 'CZ 75', cat: 'Pistola', dmg: 33, rof: 165, mag: 14, res: 140, reload: 1300, spread: 0.012, recoil: 0.42, rarity: 'Comum', price: 400, lvl: 4 },
  { id: 'p226', name: 'SIG P226', cat: 'Pistola', dmg: 34, rof: 170, mag: 15, res: 150, reload: 1400, spread: 0.011, recoil: 0.42, rarity: 'Comum', price: 520, lvl: 5 },
  { id: 'fiveseven', name: 'Five-seveN', cat: 'Pistola', dmg: 38, rof: 160, mag: 20, res: 200, reload: 1400, spread: 0.013, recoil: 0.45, rarity: 'Raro', price: 900, lvl: 7 },
  { id: 'desert', name: 'Desert Eagle', cat: 'Pistola', dmg: 95, rof: 460, mag: 7, res: 42, reload: 2000, spread: 0.020, recoil: 1.40, rarity: 'Raro', price: 1500, lvl: 6 },
  { id: 'revolver', name: 'Revólver .357', cat: 'Pistola', dmg: 75, rof: 520, mag: 6, res: 36, reload: 1800, spread: 0.008, recoil: 1.20, rarity: 'Raro', price: 1100, lvl: 6 },
  // Submetralhadoras
  { id: 'uzi', name: 'Uzi', cat: 'Submetralhadora', dmg: 21, rof: 90, mag: 32, res: 192, reload: 1100, spread: 0.022, recoil: 0.65, rarity: 'Comum', price: 600, lvl: 4 },
  { id: 'mac10', name: 'MAC-10', cat: 'Submetralhadora', dmg: 23, rof: 70, mag: 24, res: 192, reload: 1000, spread: 0.024, recoil: 0.70, rarity: 'Comum', price: 550, lvl: 4 },
  { id: 'mp9', name: 'MP9', cat: 'Submetralhadora', dmg: 17, rof: 75, mag: 20, res: 200, reload: 950, spread: 0.021, recoil: 0.50, rarity: 'Comum', price: 450, lvl: 4 },
  { id: 'mp5', name: 'MP5', cat: 'Submetralhadora', dmg: 22, rof: 85, mag: 30, res: 300, reload: 1300, spread: 0.020, recoil: 0.50, rarity: 'Comum', price: 800, lvl: 5 },
  { id: 'ump', name: 'UMP-45', cat: 'Submetralhadora', dmg: 35, rof: 130, mag: 25, res: 200, reload: 1500, spread: 0.018, recoil: 0.70, rarity: 'Comum', price: 950, lvl: 6 },
  { id: 'bizon', name: 'PP-19 Bizon', cat: 'Submetralhadora', dmg: 18, rof: 95, mag: 64, res: 128, reload: 1600, spread: 0.025, recoil: 0.55, rarity: 'Comum', price: 1100, lvl: 7 },
  { id: 'mp7', name: 'MP7', cat: 'Submetralhadora', dmg: 19, rof: 80, mag: 30, res: 300, reload: 1200, spread: 0.015, recoil: 0.40, rarity: 'Raro', price: 1600, lvl: 9 },
  { id: 'p90', name: 'P90', cat: 'Submetralhadora', dmg: 20, rof: 85, mag: 50, res: 200, reload: 1500, spread: 0.017, recoil: 0.50, rarity: 'Raro', price: 1800, lvl: 10 },
  { id: 'vector', name: 'KRISS Vector', cat: 'Submetralhadora', dmg: 24, rof: 75, mag: 25, res: 250, reload: 1200, spread: 0.016, recoil: 0.45, rarity: 'Raro', price: 1400, lvl: 8 },
  { id: 'mpx', name: 'SIG MPX', cat: 'Submetralhadora', dmg: 25, rof: 100, mag: 30, res: 240, reload: 1400, spread: 0.017, recoil: 0.60, rarity: 'Raro', price: 1300, lvl: 8 },
  // Espingardas
  { id: 'sawed', name: 'Serrilhada', cat: 'Espingarda', dmg: 110, rof: 300, mag: 2, res: 24, reload: 1800, spread: 0.18, recoil: 2.20, rarity: 'Comum', price: 400, lvl: 3 },
  { id: 'm870', name: 'Remington 870', cat: 'Espingarda', dmg: 120, rof: 450, mag: 6, res: 36, reload: 2500, spread: 0.12, recoil: 1.60, rarity: 'Comum', price: 1000, lvl: 5 },
  { id: 'judge', name: 'Taurus Judge', cat: 'Espingarda', dmg: 75, rof: 350, mag: 5, res: 35, reload: 1900, spread: 0.15, recoil: 1.90, rarity: 'Comum', price: 800, lvl: 6 },
  { id: 'm590', name: 'Mossberg 590', cat: 'Espingarda', dmg: 115, rof: 380, mag: 6, res: 48, reload: 2300, spread: 0.115, recoil: 1.70, rarity: 'Comum', price: 1100, lvl: 6 },
  { id: 'spas12', name: 'SPAS-12', cat: 'Espingarda', dmg: 130, rof: 350, mag: 6, res: 36, reload: 2200, spread: 0.11, recoil: 1.80, rarity: 'Raro', price: 1600, lvl: 8 },
  { id: 'xm1014', name: 'XM1014', cat: 'Espingarda', dmg: 100, rof: 250, mag: 7, res: 42, reload: 2400, spread: 0.10, recoil: 1.40, rarity: 'Raro', price: 2000, lvl: 9 },
  { id: 'ksg', name: 'KSG', cat: 'Espingarda', dmg: 140, rof: 300, mag: 12, res: 48, reload: 2600, spread: 0.095, recoil: 1.50, rarity: 'Raro', price: 2200, lvl: 10 },
  { id: 'striker', name: 'Striker', cat: 'Espingarda', dmg: 95, rof: 200, mag: 12, res: 72, reload: 2500, spread: 0.10, recoil: 1.60, rarity: 'Raro', price: 2400, lvl: 11 },
  { id: 'm3super', name: 'M3 Super 90', cat: 'Espingarda', dmg: 125, rof: 300, mag: 6, res: 48, reload: 2300, spread: 0.105, recoil: 1.70, rarity: 'Épico', price: 3000, lvl: 12 },
  { id: 'aa12', name: 'AA-12', cat: 'Espingarda', dmg: 85, rof: 150, mag: 8, res: 64, reload: 2000, spread: 0.09, recoil: 1.20, rarity: 'Épico', price: 4500, lvl: 14 },
  // Fuzis de assalto
  { id: 'm4a1', name: 'M4A1', cat: 'Fuzil de Assalto', dmg: 36, rof: 140, mag: 30, res: 240, reload: 1400, spread: 0.020, recoil: 0.75, rarity: 'Comum', price: 1600, lvl: 6 },
  { id: 'galil', name: 'Galil AR', cat: 'Fuzil de Assalto', dmg: 37, rof: 140, mag: 35, res: 210, reload: 1400, spread: 0.020, recoil: 0.78, rarity: 'Comum', price: 1900, lvl: 7 },
  { id: 'ak47', name: 'AK-47', cat: 'Fuzil de Assalto', dmg: 42, rof: 160, mag: 30, res: 210, reload: 1500, spread: 0.025, recoil: 0.90, rarity: 'Comum', price: 1800, lvl: 7 },
  { id: 'ak74', name: 'AK-74', cat: 'Fuzil de Assalto', dmg: 36, rof: 150, mag: 30, res: 240, reload: 1500, spread: 0.023, recoil: 0.82, rarity: 'Comum', price: 1750, lvl: 7 },
  { id: 'm16', name: 'M16A4', cat: 'Fuzil de Assalto', dmg: 39, rof: 150, mag: 30, res: 240, reload: 1450, spread: 0.022, recoil: 0.80, rarity: 'Comum', price: 1700, lvl: 7 },
  { id: 'g36', name: 'G36C', cat: 'Fuzil de Assalto', dmg: 35, rof: 145, mag: 30, res: 210, reload: 1450, spread: 0.021, recoil: 0.75, rarity: 'Raro', price: 2200, lvl: 8 },
  { id: 'famass', name: 'FAMAS', cat: 'Fuzil de Assalto', dmg: 34, rof: 120, mag: 25, res: 200, reload: 1300, spread: 0.023, recoil: 0.85, rarity: 'Raro', price: 2100, lvl: 8 },
  { id: 'scar', name: 'SCAR-L', cat: 'Fuzil de Assalto', dmg: 38, rof: 135, mag: 30, res: 240, reload: 1400, spread: 0.019, recoil: 0.70, rarity: 'Raro', price: 2500, lvl: 9 },
  { id: 'l85', name: 'L85A2', cat: 'Fuzil de Assalto', dmg: 40, rof: 135, mag: 30, res: 210, reload: 1450, spread: 0.020, recoil: 0.72, rarity: 'Raro', price: 2600, lvl: 10 },
  { id: 'aug', name: 'AUG A3', cat: 'Fuzil de Assalto', dmg: 39, rof: 130, mag: 30, res: 210, reload: 1400, spread: 0.018, recoil: 0.68, rarity: 'Épico', price: 3200, lvl: 11 },
  // Snipers
  { id: 'ssg', name: 'SSG 08', cat: 'Sniper', dmg: 58, rof: 650, mag: 8, res: 48, reload: 1900, spread: 0.009, recoil: 1.40, rarity: 'Comum', price: 900, lvl: 5 },
  { id: 'kar98', name: 'Kar98k', cat: 'Sniper', dmg: 90, rof: 800, mag: 5, res: 40, reload: 2400, spread: 0.007, recoil: 2.00, rarity: 'Comum', price: 1200, lvl: 5 },
  { id: 'scout', name: 'Scout', cat: 'Sniper', dmg: 55, rof: 600, mag: 8, res: 64, reload: 1800, spread: 0.010, recoil: 1.30, rarity: 'Comum', price: 850, lvl: 5 },
  { id: 'dragunov', name: 'Dragunov', cat: 'Sniper', dmg: 65, rof: 500, mag: 10, res: 60, reload: 2000, spread: 0.008, recoil: 1.50, rarity: 'Raro', price: 3000, lvl: 9 },
  { id: 'm24', name: 'M24', cat: 'Sniper', dmg: 95, rof: 850, mag: 5, res: 30, reload: 2600, spread: 0.006, recoil: 2.20, rarity: 'Raro', price: 2800, lvl: 10 },
  { id: 'rem700', name: 'Remington 700', cat: 'Sniper', dmg: 98, rof: 700, mag: 5, res: 40, reload: 2500, spread: 0.006, recoil: 2.10, rarity: 'Raro', price: 2900, lvl: 10 },
  { id: 'm40', name: 'M40A1', cat: 'Sniper', dmg: 100, rof: 750, mag: 7, res: 42, reload: 2700, spread: 0.005, recoil: 2.30, rarity: 'Raro', price: 3200, lvl: 11 },
  { id: 'l96', name: 'L96A1', cat: 'Sniper', dmg: 105, rof: 720, mag: 6, res: 42, reload: 2600, spread: 0.005, recoil: 2.40, rarity: 'Épico', price: 3500, lvl: 13 },
  { id: 'awp', name: 'AWP', cat: 'Sniper', dmg: 115, rof: 900, mag: 5, res: 30, reload: 2800, spread: 0.005, recoil: 2.50, rarity: 'Épico', price: 4000, lvl: 12 },
  { id: 'barrett', name: 'Barrett M82', cat: 'Sniper', dmg: 150, rof: 1100, mag: 8, res: 40, reload: 3200, spread: 0.004, recoil: 3.00, rarity: 'Legendário', price: 9000, lvl: 18 },
  // Metralhadoras leves
  { id: 'm27', name: 'M27 IAR', cat: 'Metralhadora', dmg: 35, rof: 160, mag: 45, res: 270, reload: 2900, spread: 0.026, recoil: 1.00, rarity: 'Raro', price: 3400, lvl: 12 },
  { id: 'l86', name: 'L86 LSW', cat: 'Metralhadora', dmg: 36, rof: 170, mag: 45, res: 270, reload: 3000, spread: 0.027, recoil: 1.10, rarity: 'Raro', price: 3300, lvl: 12 },
  { id: 'rpk', name: 'RPK', cat: 'Metralhadora', dmg: 38, rof: 180, mag: 75, res: 300, reload: 3100, spread: 0.027, recoil: 1.20, rarity: 'Raro', price: 3600, lvl: 12 },
  { id: 'm249', name: 'M249 SAW', cat: 'Metralhadora', dmg: 34, rof: 170, mag: 100, res: 400, reload: 3200, spread: 0.030, recoil: 1.10, rarity: 'Raro', price: 3800, lvl: 13 },
  { id: 'type85', name: 'Type 85', cat: 'Metralhadora', dmg: 33, rof: 185, mag: 75, res: 300, reload: 3200, spread: 0.030, recoil: 1.30, rarity: 'Comum', price: 3100, lvl: 11 },
  { id: 'mg3', name: 'MG3', cat: 'Metralhadora', dmg: 42, rof: 150, mag: 120, res: 360, reload: 3300, spread: 0.032, recoil: 1.40, rarity: 'Épico', price: 4900, lvl: 14 },
  { id: 'pkmp', name: 'PKM', cat: 'Metralhadora', dmg: 40, rof: 190, mag: 100, res: 300, reload: 3300, spread: 0.028, recoil: 1.40, rarity: 'Épico', price: 5000, lvl: 14 },
  { id: 'm60', name: 'M60', cat: 'Metralhadora', dmg: 45, rof: 200, mag: 100, res: 300, reload: 3400, spread: 0.030, recoil: 1.50, rarity: 'Épico', price: 4800, lvl: 14 },
  { id: 'negev', name: 'Negev', cat: 'Metralhadora', dmg: 31, rof: 130, mag: 150, res: 450, reload: 3500, spread: 0.035, recoil: 1.30, rarity: 'Épico', price: 5200, lvl: 15 },
  { id: 'minigun', name: 'M134 Minigun', cat: 'Metralhadora', dmg: 18, rof: 60, mag: 150, res: 600, reload: 4000, spread: 0.040, recoil: 0.80, rarity: 'Legendário', price: 15000, lvl: 22 },
];
const WEAPONS_BY_ID = {};
WEAPONS.forEach(w => { WEAPONS_BY_ID[w.id] = w; });

/* ============================ INIMIGOS (50) ============================ */
// id, nome, tier, vida, velocidade, tamanho, dano, armadura(0-1), cor, pontos, dinheiro, peso de spawn
const ENEMIES = [
  { id: 'zumbi_comum', name: 'Zumbi Comum', tier: 1, hp: 90, spd: 3.4, size: 0.85, dmg: 14, armor: 0, color: 0x6ea8fe, points: 12, cash: 2, weight: 20 },
  { id: 'zumbi_rast', name: 'Zumbi Rastejante', tier: 1, hp: 60, spd: 4.6, size: 0.6, dmg: 10, armor: 0, color: 0x7df9a1, points: 14, cash: 2, weight: 16 },
  { id: 'cao_morto', name: 'Cão Morto', tier: 1, hp: 70, spd: 5.6, size: 0.65, dmg: 16, armor: 0, color: 0x5a6b7a, points: 16, cash: 3, weight: 14 },
  { id: 'morador', name: 'Morador Assombrado', tier: 1, hp: 80, spd: 3.0, size: 0.8, dmg: 12, armor: 0, color: 0x9aa5b1, points: 13, cash: 2, weight: 15 },
  { id: 'esqueleto_f', name: 'Esqueleto Frágil', tier: 1, hp: 50, spd: 4.0, size: 0.7, dmg: 11, armor: 0, color: 0xe8e8e8, points: 15, cash: 3, weight: 12 },
  { id: 'recruta', name: 'Soldado Recruta', tier: 1, hp: 110, spd: 3.2, size: 0.9, dmg: 15, armor: 0.05, color: 0x8aa0c8, points: 14, cash: 3, weight: 10 },
  { id: 'mutante_m', name: 'Mutante Magro', tier: 1, hp: 100, spd: 3.8, size: 0.95, dmg: 13, armor: 0, color: 0xa8c67a, points: 16, cash: 3, weight: 10 },
  { id: 'fantasma_m', name: 'Fantasma Menor', tier: 1, hp: 55, spd: 4.4, size: 0.75, dmg: 10, armor: 0.1, color: 0xbfd7ff, points: 18, cash: 4, weight: 8 },
  { id: 'zumbi_pano', name: 'Zumbi de Pano', tier: 1, hp: 95, spd: 3.1, size: 0.88, dmg: 13, armor: 0, color: 0xcfaf88, points: 14, cash: 2, weight: 12 },
  { id: 'corvo_i', name: 'Corvo Infectado', tier: 1, hp: 40, spd: 6.2, size: 0.45, dmg: 8, armor: 0, color: 0x222222, points: 20, cash: 4, weight: 8 },
  { id: 'soldado_b', name: 'Soldado Blindado', tier: 2, hp: 160, spd: 2.8, size: 1.0, dmg: 18, armor: 0.15, color: 0x5b7da3, points: 24, cash: 5, weight: 14 },
  { id: 'zumbi_g', name: 'Zumbi Gordo', tier: 2, hp: 260, spd: 2.2, size: 1.25, dmg: 22, armor: 0.05, color: 0x9b7a4c, points: 30, cash: 6, weight: 10 },
  { id: 'cao_robo', name: 'Cão Robótico', tier: 2, hp: 130, spd: 6.0, size: 0.7, dmg: 20, armor: 0.1, color: 0x6e7b8b, points: 28, cash: 6, weight: 10 },
  { id: 'drone', name: 'Drone Sentinela', tier: 2, hp: 80, spd: 5.0, size: 0.5, dmg: 12, armor: 0.2, color: 0x4fa3d1, points: 22, cash: 5, weight: 10 },
  { id: 'aranha', name: 'Aranha Gigante', tier: 2, hp: 110, spd: 4.2, size: 0.95, dmg: 17, armor: 0, color: 0x2d1b2d, points: 26, cash: 5, weight: 9 },
  { id: 'esk_g', name: 'Esqueleto Guerreiro', tier: 2, hp: 100, spd: 3.6, size: 0.85, dmg: 19, armor: 0.05, color: 0xdcdcdc, points: 25, cash: 5, weight: 9 },
  { id: 'mutante_b', name: 'Mutante Bruto', tier: 2, hp: 170, spd: 3.0, size: 1.1, dmg: 21, armor: 0.08, color: 0x6b9a5a, points: 29, cash: 6, weight: 8 },
  { id: 'fantasma_c', name: 'Fantasma Choro', tier: 2, hp: 75, spd: 4.8, size: 0.8, dmg: 14, armor: 0.15, color: 0xa8c0ff, points: 27, cash: 6, weight: 7 },
  { id: 'zumbi_fogo', name: 'Zumbi Flamejante', tier: 2, hp: 140, spd: 3.4, size: 0.95, dmg: 18, armor: 0.05, color: 0xff6b22, points: 28, cash: 6, weight: 8 },
  { id: 'assassino', name: 'Assassino Sombrio', tier: 2, hp: 95, spd: 5.2, size: 0.8, dmg: 20, armor: 0.1, color: 0x2a1a40, points: 32, cash: 7, weight: 7 },
  { id: 'ciborgue', name: 'Ciborgue', tier: 3, hp: 220, spd: 3.2, size: 1.05, dmg: 24, armor: 0.25, color: 0xbf8fff, points: 42, cash: 9, weight: 12 },
  { id: 'tanque', name: 'Tanque Humano', tier: 3, hp: 400, spd: 2.0, size: 1.35, dmg: 28, armor: 0.2, color: 0x7a8a9a, points: 50, cash: 10, weight: 8 },
  { id: 'golem_p', name: 'Golem de Pedra', tier: 3, hp: 330, spd: 2.4, size: 1.2, dmg: 26, armor: 0.3, color: 0x8c8c7a, points: 46, cash: 10, weight: 8 },
  { id: 'demonio_m', name: 'Demônio Menor', tier: 3, hp: 180, spd: 4.4, size: 0.95, dmg: 25, armor: 0.15, color: 0x8e24aa, points: 44, cash: 9, weight: 9 },
  { id: 'zumbi_t', name: 'Zumbi Tanque', tier: 3, hp: 380, spd: 2.2, size: 1.3, dmg: 24, armor: 0.12, color: 0x7a5a3a, points: 48, cash: 10, weight: 7 },
  { id: 'atirador', name: 'Atirador de Elite', tier: 3, hp: 130, spd: 3.4, size: 0.9, dmg: 30, armor: 0.1, color: 0x4a6fa5, points: 52, cash: 10, weight: 7 },
  { id: 'mutante_a', name: 'Mutante Alfa', tier: 3, hp: 260, spd: 3.8, size: 1.15, dmg: 27, armor: 0.18, color: 0x5a9a5a, points: 50, cash: 10, weight: 7 },
  { id: 'esk_mago', name: 'Esqueleto Mago', tier: 3, hp: 100, spd: 3.0, size: 0.85, dmg: 22, armor: 0.2, color: 0xe0e0e0, points: 46, cash: 9, weight: 7 },
  { id: 'fantasma_p', name: 'Fantasma Pútrido', tier: 3, hp: 110, spd: 4.2, size: 0.85, dmg: 20, armor: 0.25, color: 0x8fc0ff, points: 44, cash: 9, weight: 6 },
  { id: 'aranha_v', name: 'Aranha Venenosa', tier: 3, hp: 120, spd: 4.6, size: 1.0, dmg: 21, armor: 0.05, color: 0x1a121a, points: 48, cash: 9, weight: 7 },
  { id: 'demonio_f', name: 'Demônio de Fogo', tier: 4, hp: 300, spd: 3.8, size: 1.1, dmg: 32, armor: 0.25, color: 0xff4d6d, points: 72, cash: 14, weight: 10 },
  { id: 'golem_f', name: 'Golem de Ferro', tier: 4, hp: 480, spd: 2.0, size: 1.35, dmg: 34, armor: 0.35, color: 0x6e7a86, points: 78, cash: 15, weight: 8 },
  { id: 'ciborgue_p', name: 'Ciborgue Pesado', tier: 4, hp: 380, spd: 3.0, size: 1.15, dmg: 33, armor: 0.3, color: 0x7f8c9a, points: 76, cash: 15, weight: 8 },
  { id: 'caçador_i', name: 'Caçador Invisível', tier: 4, hp: 160, spd: 5.2, size: 0.9, dmg: 35, armor: 0.15, color: 0x3a2a5a, points: 82, cash: 16, weight: 7 },
  { id: 'zumbi_m', name: 'Zumbi Mutante', tier: 4, hp: 420, spd: 2.8, size: 1.25, dmg: 30, armor: 0.18, color: 0x4a9a3a, points: 80, cash: 15, weight: 7 },
  { id: 'cavaleiro_n', name: 'Cavaleiro Negro', tier: 4, hp: 340, spd: 3.4, size: 1.1, dmg: 36, armor: 0.28, color: 0x1a1a2e, points: 84, cash: 16, weight: 6 },
  { id: 'bruxa', name: 'Bruxa Sombria', tier: 4, hp: 180, spd: 3.0, size: 0.9, dmg: 34, armor: 0.22, color: 0x9b4fd9, points: 82, cash: 16, weight: 6 },
  { id: 'minotauro', name: 'Minotauro', tier: 4, hp: 520, spd: 2.4, size: 1.5, dmg: 38, armor: 0.32, color: 0x6b4a2a, points: 90, cash: 17, weight: 6 },
  { id: 'espectro', name: 'Espectro', tier: 4, hp: 150, spd: 4.6, size: 0.85, dmg: 31, armor: 0.35, color: 0xa8c0ff, points: 85, cash: 16, weight: 6 },
  { id: 'berserker', name: 'Berserker', tier: 4, hp: 360, spd: 3.6, size: 1.1, dmg: 37, armor: 0.2, color: 0x9a2a2a, points: 88, cash: 17, weight: 6 },
  { id: 'demonio_M', name: 'Demônio Maior', tier: 5, hp: 520, spd: 3.6, size: 1.2, dmg: 42, armor: 0.35, color: 0xff1a4d, points: 130, cash: 24, weight: 8 },
  { id: 'golem_d', name: 'Golem de Diamante', tier: 5, hp: 700, spd: 1.8, size: 1.5, dmg: 44, armor: 0.45, color: 0x7fd4ff, points: 140, cash: 25, weight: 6 },
  { id: 'ciborgue_m', name: 'Ciborgue Mestre', tier: 5, hp: 560, spd: 3.2, size: 1.25, dmg: 43, armor: 0.4, color: 0x8faadc, points: 138, cash: 24, weight: 7 },
  { id: 'caçador_s', name: 'Caçador Sombrio', tier: 5, hp: 260, spd: 5.4, size: 1.0, dmg: 46, armor: 0.25, color: 0x2a1a3e, points: 144, cash: 25, weight: 6 },
  { id: 'zumbi_a', name: 'Zumbi Ancestral', tier: 5, hp: 640, spd: 2.6, size: 1.4, dmg: 40, armor: 0.3, color: 0x3a5a2a, points: 142, cash: 24, weight: 6 },
  { id: 'cavaleiro_m', name: 'Cavaleiro da Morte', tier: 5, hp: 580, spd: 3.0, size: 1.25, dmg: 48, armor: 0.38, color: 0x1a1a1a, points: 150, cash: 26, weight: 5 },
  { id: 'arcanista', name: 'Arcanista Sombrio', tier: 5, hp: 300, spd: 2.8, size: 1.05, dmg: 45, armor: 0.42, color: 0x7a3fd9, points: 148, cash: 25, weight: 5 },
  { id: 'minotauro_a', name: 'Minotauro Ancião', tier: 5, hp: 760, spd: 2.2, size: 1.65, dmg: 50, armor: 0.48, color: 0x5a3a2a, points: 160, cash: 27, weight: 5 },
  { id: 'senhor_a', name: 'Senhor do Abismo', tier: 5, hp: 460, spd: 3.4, size: 1.15, dmg: 47, armor: 0.4, color: 0x4a1a6a, points: 155, cash: 26, weight: 5 },
  { id: 'colossal', name: 'O Colossal', tier: 5, hp: 950, spd: 1.6, size: 1.9, dmg: 55, armor: 0.5, color: 0xaa5511, points: 200, cash: 30, weight: 4 },
];

function enemyPoolForWave(wave) {
  let tiers = [1];
  if (wave >= 4) tiers = [1, 2];
  if (wave >= 9) tiers = [1, 2, 3];
  if (wave >= 16) tiers = [1, 2, 3, 4];
  if (wave >= 26) tiers = [1, 2, 3, 4, 5];
  const pool = ENEMIES.filter(e => tiers.includes(e.tier));
  const wsum = pool.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * wsum;
  for (const e of pool) { r -= e.weight; if (r <= 0) return e; }
  return pool[0];
}

/* ============================ ESTADO DO JOGO ============================ */
const G = {
  state: 'MENU', // MENU, PLAYING, PAUSED, GAMEOVER
  hp: 100,
  eye: 1.7,
  pos: new THREE.Vector3(0, 0, 0),
  vel: new THREE.Vector3(),
  yaw: 0, pitch: 0, recoilPitch: 0,
  sens: 0.0022,
  cash: 250,
  kills: 0, score: 0, waveBest: 0,
  xp: 0, level: 1,
  ammoMag: 17, ammoRes: 170,
  reloading: false, reloadUntil: 0,
  lastShot: 0,
  mouseDown: false,
  currentSlot: 0,
  weaponsOwned: ['glock17'],
  equipped: ['glock17', null, null, null, null, null],
};
function currentWeapon() {
  const id = G.equipped[G.currentSlot];
  return id ? WEAPONS_BY_ID[id] : null;
}
function currentWeaponObj() { return currentWeapon(); }

/* ============================ THREE.JS ============================ */
const canvas = $('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05070a);
scene.fog = new THREE.FogExp2(0x05070a, 0.035);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 220);
camera.position.set(0, 1.7, 0);

const hemi = new THREE.HemisphereLight(0x88aadd, 0x222233, 0.7);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 0.85);
sun.position.set(25, 60, -15);
sun.castShadow = true;
sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60; sun.shadow.camera.bottom = -60;
sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048;
scene.add(sun);

// Mundo
const floorGeo = new THREE.PlaneGeometry(400, 400);
const floorMat = new THREE.MeshLambertMaterial({ color: 0x0a101a });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);
const grid = new THREE.GridHelper(400, 80, 0x1a263a, 0x0e1424);
scene.add(grid);

const blocks = []; // {mesh}
const wallMat = new THREE.MeshLambertMaterial({ color: 0x141c2b });
function addBlock(x, y, z, w, h, d) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, wallMat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  scene.add(m);
  blocks.push({ mesh: m, half: new THREE.Vector3(w / 2, h / 2, d / 2) });
}
// Paredes da arena
addBlock(0, 6, -100, 220, 12, 4);
addBlock(0, 6, 100, 220, 12, 4);
addBlock(-100, 6, 0, 4, 12, 220);
addBlock(100, 6, 0, 4, 12, 220);
// Blocos de cobertura aleatórios
const placed = [];
for (let i = 0; i < 42; i++) {
  const x = rand(-85, 85), z = rand(-85, 85);
  const w = rand(2.5, 5.5), h = rand(1.6, 3.6), d = rand(2.5, 5.5);
  let ok = true;
  for (const p of placed) {
    if (Math.abs(x - p.x) < w / 2 + p.w / 2 + 2.5 && Math.abs(z - p.z) < d / 2 + p.d / 2 + 2.5) { ok = false; break; }
  }
  if (!ok) continue;
  placed.push({ x, w, z, d });
  addBlock(x, h / 2, z, w, h, d);
}

/* ============================ EFEITOS ============================ */
// Partículas (pontos)
const parts = [];
const pGeo = new THREE.BufferGeometry();
const pMat = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, sizeAttenuation: true });
const pMesh = new THREE.Points(pGeo, pMat);
pMesh.visible = false;
scene.add(pMesh);
function spawnParticles(pos, count, color, scale = 1) {
  for (let i = 0; i < count; i++) {
    parts.push({
      pos: pos.clone(),
      vel: new THREE.Vector3((Math.random() - 0.5) * 4 * scale, rand(1, 5) * scale, (Math.random() - 0.5) * 4 * scale),
      life: rand(0.35, 1.0),
      maxLife: 1,
      color: new THREE.Color(color),
    });
  }
  pMesh.visible = true;
}

// Traçadores
const tracers = [];
function addTracer(start, end) {
  const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
  const m = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.75 }));
  scene.add(m);
  tracers.push({ mesh: m, life: 0.10 });
}

// Flash de boca
const flashes = [];
function addMuzzle(pos, dir) {
  const geo = new THREE.ConeGeometry(0.16, 0.45, 4, 1, false);
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffd166 }));
  m.position.copy(pos);
  m.lookAt(pos.clone().add(dir));
  m.rotation.x -= Math.PI / 2;
  m.scale.setScalar(0.5 + Math.random() * 0.5);
  scene.add(m);
  flashes.push({ mesh: m, life: 0.06 });
}

// Estojos
const shells = [];
function addShell(pos) {
  const geo = new THREE.BoxGeometry(0.04, 0.07, 0.018);
  const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xc5a059, roughness: 0.6 }));
  m.position.copy(pos).add(new THREE.Vector3((Math.random() - 0.5) * 0.15, 0.25, (Math.random() - 0.5) * 0.15));
  const vel = new THREE.Vector3((Math.random() - 0.5) * 1.4, rand(1.4, 2.4), (Math.random() - 0.5) * 1.4);
  shells.push({ mesh: m, vel, life: 2.2 });
  scene.add(m);
}

// Modelo de arma procedural anexado à câmera
const gunGroup = new THREE.Group();
camera.add(gunGroup);
function buildGun(w) {
  const g = new THREE.Group();
  const rarityColors = { Comum: 0x9aa5b1, Raro: 0x7fb3ff, Épico: 0xbf8fff, Legendário: 0xffd166 };
  const mat = new THREE.MeshStandardMaterial({ color: rarityColors[w.rarity] || 0x9aa5b1, roughness: 0.4, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1a2230, roughness: 0.5 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.115, 0.4), mat);
  body.position.set(0.13, -0.105, -0.22);
  g.add(body);
  const slide = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.075, 0.3), dark);
  slide.position.set(0.13, -0.03, -0.42);
  g.add(slide);
  const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, w.cat === 'Sniper' ? 0.55 : 0.3), dark);
  barrel.position.set(0.13, -0.03, -0.62);
  g.add(barrel);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.16, 0.14), mat);
  grip.position.set(0.13, -0.25, 0.04);
  g.add(grip);
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.05), dark);
  sight.position.set(0.13, 0.01, -0.52);
  g.add(sight);
  // camada de cor da raridade na culatra
  const accent = new THREE.Mesh(new THREE.BoxGeometry(0.142, 0.035, 0.06), new THREE.MeshBasicMaterial({ color: mat.color }));
  accent.position.set(0.13, -0.075, 0.075);
  g.add(accent);
  g.position.set(0.22, -0.28, -0.7);
  g.rotation.set(-0.15, 0.1, 0);
  return g;
}
const gun = buildGun(WEAPONS_BY_ID.glock17);
gunGroup.add(gun);
function swapGunModel(w) {
  while (gunGroup.children.length > 0) gunGroup.remove(gunGroup.children[0]);
  const g = buildGun(w);
  gunGroup.add(g);
}

/* ============================ INIMIGOS ============================ */
const enemies = [];
class Enemy {
  constructor(type, wave) {
    this.type = type;
    this.wave = wave;
    const mult = 1 + 0.35 * (wave - 1);
    const tMult = [1, 1.5, 2.4, 3.8, 6.2][type.tier - 1];
    this.hp = Math.floor(type.hp * mult * tMult);
    this.maxHp = this.hp;
    this.speed = type.speed * (1 + 0.04 * (wave - 1));
    this.dmg = type.dmg;
    this.armor = type.armor;
    this.points = Math.floor(type.points * mult);
    this.cash = Math.floor(type.cash * mult);
    this.size = type.size;
    this.color = type.color;
    this.dead = false;
    this.attackCooldown = 0;
    const geo = new THREE.BoxGeometry(type.size * 0.9, type.size * 1.9, type.size * 0.9);
    const mat = new THREE.MeshLambertMaterial({ color: type.color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.y = type.size * 0.95;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.enemy = this;
    this.spawn();
    scene.add(this.mesh);
  }
  spawn() {
    const ang = Math.random() * Math.PI * 2;
    const dist = rand(42, 78);
    this.pos = new THREE.Vector3(Math.sin(ang) * dist, 0, Math.cos(ang) * dist);
    // não nasce em cima do jogador
    if (this.pos.distanceTo(G.pos) < 22) this.pos.addScaledVector(new THREE.Vector3(Math.sin(ang), 0, Math.cos(ang)), 22);
    this.mesh.position.copy(this.pos);
    this.mesh.position.y = this.size * 0.95;
  }
  update(dt, playerPos) {
    if (this.dead) return;
    const dir = new THREE.Vector3().subVectors(playerPos, this.pos);
    dir.y = 0;
    const d = dir.length();
    if (d > 1.3) {
      dir.normalize();
      let step = dir.multiplyScalar(this.speed * dt);
      for (const e of enemies) {
        if (e === this || e.dead) continue;
        const dd = new THREE.Vector3().subVectors(this.pos, e.pos).setY(0);
        const dl = dd.length();
        if (dl < 1.7 && dl > 0) {
          dd.normalize().multiplyScalar((1.7 - dl) * dt * 3);
          step.add(dd);
        }
      }
      this.pos.add(step);
      this.mesh.position.copy(this.pos);
      this.mesh.position.y = this.size * 0.95;
      this.mesh.lookAt(playerPos);
    } else {
      this.attackCooldown -= dt;
      if (this.attackCooldown <= 0) {
        this.attackCooldown = 1.3;
        takePlayerDamage(this.dmg);
      }
    }
  }
  takeDamage(amount, headshot) {
    const real = Math.floor(amount * (1 - this.armor));
    this.hp -= real;
    spawnParticles(this.pos.clone().add(new THREE.Vector3(0, this.size * 1.3, 0)), 6, 0xa02020);
    ui.showDamageNumber(this.pos, real, headshot);
    if (this.hp <= 0 && !this.dead) this.die(headshot);
  }
  die(headshot) {
    this.dead = true;
    Audio.death();
    spawnParticles(this.pos.clone().add(new THREE.Vector3(0, this.size, 0)), 14, this.color, 1.2);
    game.addScore(this.points);
    game.addCash(this.cash);
    game.addXP(this.points * 1.25);
    game.kills++;
    ui.addKillfeed(this.type.name, headshot);
    if (headshot) ui.centerMsg('HEADSHOT', 1.1);
    scene.remove(this.mesh);
  }
}

/* ============================ LÓGICA DE COMBATE ============================ */
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

function getShotDir(spread) {
  const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  const right = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
  const up = camera.up.clone();
  dir.add(right.multiplyScalar((Math.random() - 0.5) * spread * 2));
  dir.add(up.multiplyScalar((Math.random() - 0.5) * spread * 2));
  return dir.normalize();
}

function tryFire() {
  if (G.state !== 'PLAYING') return;
  if (document.pointerLockElement !== canvas) return;
  const w = currentWeapon();
  if (!w) return;
  const now = performance.now();
  if (G.reloading && now < G.reloadUntil) return;
  if (G.ammoMag <= 0) { startReload(); return; }
  if (now - G.lastShot < w.rof) return;
  G.lastShot = now;
  G.ammoMag--;
  Audio.shoot(w.cat);

  // recuo
  G.recoilPitch += w.recoil * 0.055;
  const kick = new THREE.Vector3(0, -w.recoil * 0.015, 0); // arma sobe

  const dir = getShotDir(w.spread);
  raycaster.set(camera.position, dir);
  raycaster.far = w.range || 160;

  const emeshes = enemies.filter(e => !e.dead).map(e => e.mesh);
  const bmeshes = blocks.map(b => b.mesh);
  const hits = raycaster.intersectObjects([...emeshes, ...bmeshes], true);

  let hitPoint = null;
  let hitEnemy = null;
  if (hits.length) {
    hitPoint = hits[0].point;
    // achar inimigo no caminho (blocos param a bala)
    for (const h of hits) {
      const e = enemies.find(en => !en.dead && en.mesh === h.object);
      if (e) { hitEnemy = e; hitPoint = h.point; break; }
    }
  }
  if (!hitPoint) hitPoint = camera.position.clone().add(dir.multiplyScalar(w.range || 160));

  // efeitos
  addTracer(camera.position, hitPoint);
  addMuzzle(camera.position.clone().add(dir.multiplyScalar(0.62)), dir);
  addShell(camera.position.clone().add(dir.multiplyScalar(0.45)));
  if (hitEnemy) {
    const hs = hitPoint.y > hitEnemy.pos.y + hitEnemy.size * 0.45;
    hitEnemy.takeDamage(w.dmg * (hs ? 1.75 : 1), hs);
    Audio.hit(false);
    ui.showHitmarker();
  } else {
    // impacto em bloco
    spawnParticles(hitPoint, 3, 0x8fa0b8);
    Audio.hit(true);
  }
}

function startReload() {
  if (G.state !== 'PLAYING') return;
  const w = currentWeapon();
  if (!w || G.reloading || G.ammoMag >= w.mag || G.ammoRes <= 0) return;
  G.reloading = true;
  G.reloadUntil = performance.now() + w.reloadTime;
  Audio.reload();
}
function finishReload() {
  const w = currentWeapon();
  if (!w) return;
  const need = w.mag - G.ammoMag;
  const take = Math.min(need, G.ammoRes);
  G.ammoMag += take;
  G.ammoRes -= take;
  G.reloading = false;
  G.reloadUntil = 0;
}
function switchSlot(index) {
  if (G.state !== 'PLAYING') return;
  const id = G.equipped[index];
  if (!id) return;
  if (G.equipped[G.currentSlot] === id) return;
  G.reloading = false;
  G.reloadUntil = 0;
  G.currentSlot = index;
  G.recoilPitch = 0;
  swapGunModel(WEAPONS_BY_ID[id]);
  ui.updateHUD();
}

/* ============================ JOGADOR ============================ */
function takePlayerDamage(dmg) {
  if (G.state !== 'PLAYING') return;
  G.hp = clamp(G.hp - dmg, 0, 100);
  Audio.hit(false);
  ui.flashDamage();
  ui.updateHUD();
  if (G.hp <= 0) game.gameOver();
}

/* ============================ ONDAS ============================ */
const Wave = { current: 0, target: 0, timer: 0, intermission: 0 };
function startWave() {
  Wave.current++;
  Wave.target = Math.min(6 + Wave.current * 2, 70);
  Wave.timer = 1.0;
  Wave.intermission = 0;
  ui.centerMsg(`ONDA ${Wave.current}`, 1.6);
  // espingarda/munição inicial já vem do loadout
}
function spawnEnemyIfNeeded() {
  if (enemies.filter(e => !e.dead).length >= 18) return;
  if (Wave.spawningCount >= Wave.target) return;
  const type = enemyPoolForWave(Wave.current);
  const e = new Enemy(type, Wave.current);
  enemies.push(e);
  Wave.spawningCount++;
}

/* ============================ LOOP ============================ */
let lastT = performance.now();
let frameId;
function loop(t) {
  frameId = requestAnimationFrame(loop);
  const dt = Math.min((t - lastT) / 1000, 0.05);
  lastT = t;
  const now = performance.now();

  if (G.state === 'PLAYING') {
    updateGame(dt, now);
  } else if (G.state === 'PAUSED') {
    // nada
  }
  updateEffects(dt);
  render();
}

function updateGame(dt, now) {
  // movimento
  const moveSpeed = (G.keys && G.keys['ShiftLeft'] ? 7.6 : 5.4);
  const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, G.yaw, 0));
  const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, G.yaw, 0));
  const wish = new THREE.Vector3();
  if (G.keys['KeyW']) wish.add(forward);
  if (G.keys['KeyS']) wish.sub(forward);
  if (G.keys['KeyD']) wish.add(right);
  if (G.keys['KeyA']) wish.sub(right);
  const moving = wish.length() > 0.01;
  if (moving) {
    wish.normalize().multiplyScalar(moveSpeed * dt);
    G.vel.lerp(wish, dt * 12);
  } else {
    G.vel.multiplyScalar(1 - dt * 10);
  }
  // passo de som
  if (moving) {
    G.stepTimer = (G.stepTimer || 0) + dt;
    while (G.stepTimer > 0.42) { G.stepTimer -= 0.42; Audio.step(); }
  }
  tryMove(G.vel.x, 0);
  tryMove(0, G.vel.z);

  // gravidade / pulo
  if (G.keys['Space'] && G.grounded) { G.jumpVel = 7.2; G.grounded = false; Audio.step(); }
  G.jumpVel -= 26 * dt;
  G.jumpY += G.jumpVel * dt;
  if (G.jumpY < 0) { G.jumpY = 0; G.jumpVel = 0; G.grounded = true; }

  camera.position.set(G.pos.x, G.eye + G.jumpY, G.pos.z);

  // mira
  camera.rotation.order = 'YXZ';
  camera.rotation.y = G.yaw;
  camera.rotation.x = G.pitch + G.recoilPitch;

  // recuo decai
  G.recoilPitch *= Math.pow(0.55, dt * 60);

  // fogo automático
  if (G.mouseDown) tryFire();

  // recarga termina
  if (G.reloading && now >= G.reloadUntil) finishReload();

  // arma: balanço (bob)
  const moveLen = Math.min(G.vel.length(), 7);
  const bob = moving ? Math.sin(now * 0.014) * 0.006 * (moveLen / 5.4) : 0;
  gun.position.z = -0.7 + bob * 6;
  gun.position.y = -0.28 + Math.cos(now * 0.014) * 0.003 * moveLen;
  gun.rotation.z = Math.cos(now * 0.014) * 0.02 * moveLen;
  gun.rotation.x = -0.15 - G.recoilPitch;

  // inimigos
  const alive = [];
  for (const e of enemies) {
    e.update(dt, G.pos);
    if (!e.dead) alive.push(e);
  }
  enemies.length = 0;
  enemies.push(...alive);

  // ondas
  if (Wave.intermission > 0) {
    Wave.intermission -= dt;
    if (Wave.intermission <= 0) startWave();
  } else {
    Wave.spawningCount = enemies.filter(e => !e.dead).length;
    if (Wave.spawningCount < Wave.target) {
      Wave.timer -= dt;
      while (Wave.timer <= 0) {
        spawnEnemyIfNeeded();
        Wave.timer += clamp(0.75 - Wave.current * 0.022, 0.3, 0.9);
      }
    } else if (enemies.filter(e => !e.dead).length === 0) {
      Wave.intermission = 5.5;
      ui.centerMsg(`ONDA ${Wave.current} CONCLUÍDA`, 1.4);
    }
  }

  ui.updateHUD();
}

function tryMove(dx, dz) {
  const next = G.pos.clone();
  if (dx !== 0) next.x += dx;
  if (dz !== 0) next.z += dz;
  const r = 0.38;
  for (const b of blocks) {
    const bx = b.mesh.position.x, bz = b.mesh.position.z;
    if (Math.abs(next.x - bx) < r + b.half.x && Math.abs(next.z - bz) < r + b.half.z) {
      return; // colisão: não move nesse eixo
    }
  }
  // limites da arena
  const lim = 94;
  next.x = clamp(next.x, -lim, lim);
  next.z = clamp(next.z, -lim, lim);
  G.pos.copy(next);
}

/* ============================ EFEITOS ============================ */
function updateEffects(dt) {
  // partículas
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.pos.addScaledVector(p.vel, dt);
    p.vel.y -= 18 * dt;
    p.vel.multiplyScalar(1 - 5 * dt);
    p.life -= dt;
    if (p.life <= 0) parts.splice(i, 1);
  }
  if (parts.length) {
    const pos = new Float32Array(parts.length * 3);
    const col = new Float32Array(parts.length * 3);
    const sz = new Float32Array(parts.length);
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const a = p.life / p.maxLife;
      pos[3 * i] = p.pos.x; pos[3 * i + 1] = p.pos.y; pos[3 * i + 2] = p.pos.z;
      col[3 * i] = p.color.r; col[3 * i + 1] = p.color.g; col[3 * i + 2] = p.color.b;
      sz[i] = 0.14 * a * 1.6;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(sz, 1));
    pMesh.visible = true;
  } else {
    pMesh.visible = false;
  }
  // traçadores
  for (let i = tracers.length - 1; i >= 0; i--) {
    const tr = tracers[i];
    tr.life -= dt;
    tr.mesh.material.opacity = tr.life / 0.10;
    if (tr.life <= 0) { scene.remove(tr.mesh); tracers.splice(i, 1); }
  }
  // flashes
  for (let i = flashes.length - 1; i >= 0; i--) {
    const fl = flashes[i];
    fl.life -= dt;
    fl.mesh.material.opacity = fl.life / 0.06;
    fl.mesh.scale.setScalar(1 - fl.life / 0.06 + 0.4);
    if (fl.life <= 0) { scene.remove(fl.mesh); flashes.splice(i, 1); }
  }
  // estojos
  for (let i = shells.length - 1; i >= 0; i--) {
    const sh = shells[i];
    sh.mesh.position.addScaledVector(sh.vel, dt);
    sh.vel.y -= 14 * dt;
    sh.mesh.rotation.x += dt * 4;
    sh.mesh.rotation.z += dt * 2;
    sh.life -= dt;
    if (sh.life <= 0) { scene.remove(sh.mesh); shells.splice(i, 1); }
  }
}

function render() {
  renderer.render(scene, camera);
  drawEnemyUI();
}

const uiCanvas = document.createElement('canvas');
uiCanvas.style.position = 'absolute';
uiCanvas.style.inset = '0';
uiCanvas.style.pointerEvents = 'none';
uiCanvas.style.zIndex = '7';
document.body.appendChild(uiCanvas);
const uictx = uiCanvas.getContext('2d');
function resizeUI() {
  uiCanvas.width = window.innerWidth * window.devicePixelRatio;
  uiCanvas.height = window.innerHeight * window.devicePixelRatio;
  uictx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  resizeUI();
});
resizeUI();

function worldToScreen(v) {
  const p = v.clone().project(camera);
  return {
    x: (p.x * 0.5 + 0.5) * window.innerWidth,
    y: (1 - (p.y * 0.5 + 0.5)) * window.innerHeight,
    z: p.z,
  };
}
function drawEnemyUI() {
  const w = window.innerWidth, h = window.innerHeight;
  uictx.clearRect(0, 0, w * window.devicePixelRatio, h * window.devicePixelRatio);
  uictx.scale(window.devicePixelRatio, window.devicePixelRatio);
  for (const e of enemies) {
    if (e.dead) continue;
    const p = worldToScreen(e.mesh.position.clone().add(new THREE.Vector3(0, e.size * 2.35, 0)));
    if (p.z < -1 || p.z > 1) continue;
    const x = p.x - 40, y = p.y - 14;
    const pct = clamp(e.hp / e.maxHp, 0, 1);
    uictx.fillStyle = 'rgba(0,0,0,0.6)';
    uictx.fillRect(x, y, 80, 9);
    uictx.fillStyle = pct > 0.6 ? '#4ade80' : pct > 0.3 ? '#facc15' : '#ff4d6d';
    uictx.fillRect(x + 1, y + 1, 78 * pct, 7);
    uictx.strokeStyle = 'rgba(255,255,255,0.25)';
    uictx.strokeRect(x, y, 80, 9);
    uictx.font = 'bold 11px sans-serif';
    uictx.fillStyle = '#e8eef7';
    uictx.textAlign = 'center';
    uictx.fillText(e.type.name, p.x, y - 5);
  }
  uictx.resetTransform ? uictx.resetTransform() : uictx.setTransform(1, 0, 0, 1, 0, 0);
}

/* ============================ UI ============================ */
const ui = {
  updateHUD() {
    const r = rankOf(G.level);
    const pct = clamp(G.xp / xpFor(G.level), 0, 1);
    $('txt-rank').textContent = r.name;
    $('txt-rank').style.color = r.color;
    $('txt-lvl').textContent = G.level;
    $('fill-xp').style.width = (pct * 100) + '%';
    $('txt-xp').textContent = G.xp;
    $('txt-xpnext').textContent = xpFor(G.level);
    $('txt-wave').textContent = Wave.current;
    const alive = enemies.filter(e => !e.dead).length;
    $('txt-enemies').textContent = `Inimigos: ${alive}`;
    const w = currentWeapon();
    if (w) {
      $('txt-weapon').textContent = `${w.name} · ${w.cat}`;
      $('txt-weapon').style.color = { Comum: '#c9d2e0', Raro: '#7fb3ff', Épico: '#bf8fff', Legendário: '#ffd166' }[w.rarity] || '#fff';
      $('ammo-mag').textContent = G.ammoMag;
      $('ammo-res').textContent = G.ammoRes;
      const low = G.ammoMag <= Math.ceil(w.mag * 0.3);
      $('ammo-mag').style.color = low && !G.reloading ? '#ff8a8a' : '#fff';
    }
    const wrap = $('reloadWrap');
    const w2 = currentWeapon();
    if (G.reloading && w2) {
      wrap.style.display = 'block';
      const pctR = clamp((G.reloadUntil - performance.now()) / (w2.reloadTime || 1), 0, 1);
      $('fill-reload').style.width = ((1 - pctR) * 100) + '%';
    } else {
      wrap.style.display = 'none';
    }
    $('fill-hp').style.width = (G.hp / 100 * 100) + '%';
    $('fill-hp').style.background = G.hp > 35 ? '#4ade80' : G.hp > 15 ? '#facc15' : '#ff4d6d';
    $('txt-hp').textContent = G.hp;
    $('txt-cash').textContent = `$${G.cash}`;
  },
  flashDamage() {
    const d = $('dmgFlash');
    d.style.opacity = '1';
    setTimeout(() => { d.style.opacity = '0'; }, 220);
  },
  showHitmarker() {
    const hm = $('hitmarker');
    hm.classList.add('hit');
    setTimeout(() => hm.classList.remove('hit'), 140);
  },
  showDamageNumber(worldPos, amount, headshot) {
    const p = worldToScreen(worldPos);
    if (p.z < -1 || p.z > 1) return;
    const el = document.createElement('div');
    el.className = 'dmg';
    el.textContent = headshot ? `+${amount} ✖` : `-${amount}`;
    el.style.left = p.x + 'px';
    el.style.top = p.y + 'px';
    el.style.fontSize = headshot ? '20px' : '16px';
    el.style.color = headshot ? '#ffd166' : '#fff';
    $('damage-numbers').appendChild(el);
    setTimeout(() => el.remove(), 950);
  },
  addKillfeed(name, headshot) {
    const el = document.createElement('div');
    el.className = 'kf-item';
    el.innerHTML = `<span style="color:#ffd166">Jogador</span> <span style="color:#7fb3ff">eliminou</span> <span style="color:${headshot ? '#ffd166' : '#ff8a8a'}">${headshot ? '✖ ' : ''}${name}</span>`;
    const kf = $('killfeed');
    kf.insertBefore(el, kf.firstChild);
    setTimeout(() => el.remove(), 5200);
  },
  centerMsg(text, secs) {
    const m = $('msgCenter');
    m.innerHTML = `<div class="msg-big">${text}</div>`;
    m.classList.remove('hidden');
    setTimeout(() => m.classList.add('hidden'), Math.max(300, secs * 1000));
  },
  show(id) {
    ['menuMain', 'menuPause', 'menuGameOver', 'menuLoadout', 'menuLeaderboard', 'menuCredits'].forEach(mid => $(mid).classList.add('hidden'));
    $('overlay').classList.toggle('hidden', !id);
    if (id === 'loadout') this.renderLoadout();
    if (id === 'leaderboard') this.renderLeaderboard();
    document.exitPointerLock();
  },
  toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  },
  renderLoadout() {
    const slots = $('slotsContainer');
    slots.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const id = G.equipped[i];
      const div = document.createElement('div');
      div.className = `slot ${id ? '' : 'empty'}`;
      if (id) {
        const w = WEAPONS_BY_ID[id];
        div.innerHTML = `<div class="slot-num">SLOT ${i + 1}</div><div class="slot-name">${w.name}</div><div class="slot-ammo">${w.cat} · ${w.dmg} DMG</div>`;
        div.onclick = () => { G.currentSlot = i; ui.renderLoadout(); ui.updateHUD(); };
      } else {
        div.innerHTML = `<div class="slot-num">SLOT ${i + 1}</div><div class="slot-name">Vazio</div><div class="slot-ammo">Pressione 1–6</div>`;
      }
      slots.appendChild(div);
    }
    const list = $('arsenalList');
    list.innerHTML = '';
    for (const w of WEAPONS) {
      const owned = G.weaponsOwned.includes(w.id);
      const equipped = G.equipped.includes(w.id);
      const row = document.createElement('div');
      row.className = `weapon-row ${owned ? 'owned' : ''} ${equipped ? 'equipped' : ''}`;
      const affordable = G.cash >= w.price && G.level >= w.lvl;
      let action = '';
      if (equipped) action = 'EQUIPADO';
      else if (owned) action = 'Equipar';
      else if (!affordable) action = `Nível ${w.lvl}`;
      else action = `Comprar $${w.price}`;
      row.innerHTML = `
        <div class="wrow-info">
          <span class="wrow-tag tag-${w.rarity.toLowerCase()}">${w.rarity}</span>
          <span class="wrow-name">${w.name}</span>
          <span class="wrow-cat">${w.cat}</span>
          <div class="wrow-stats">Dano ${w.dmg} · Cad ${w.rof}ms · Carreg ${w.mag} · Rec ${(w.reload / 1000).toFixed(1)}s</div>
        </div>
        <div class="wrow-actions"><button class="btn" onclick="game.buyOrEquip('${w.id}')">${action}</button></div>
      `;
      list.appendChild(row);
    }
    $('lCash').textContent = `$${G.cash}`;
  },
  renderLeaderboard() {
    let lb = [];
    try { lb = JSON.parse(localStorage.getItem('zoc_lb_v1') || '[]'); } catch (e) {}
    lb.sort((a, b) => b.score - a.score);
    const list = $('lbList');
    list.innerHTML = '';
    lb.slice(0, 10).forEach((e, i) => {
      const r = rankOf(e.level || 1);
      const el = document.createElement('div');
      el.className = 'lb-row';
      el.innerHTML = `<span class="place">${i + 1}</span><span class="name">${e.name}</span><span class="score">${e.score} <span style="font-weight:600;color:var(--muted);font-size:11px">${r.name}</span></span>`;
      list.appendChild(el);
    });
  }
};

window.ui = ui;

/* ============================ JOGO ============================ */
const game = {
  init() {
    // áudio no primeiro clique
    document.addEventListener('click', () => Audio.ensure(), { once: true });
    // input
    G.keys = {};
    window.addEventListener('keydown', e => {
      G.keys[e.code] = true;
      if (e.code === 'KeyR' && G.state === 'PLAYING') startReload();
      if (e.code === 'Escape') {
        if (G.state === 'PLAYING') { G.state = 'PAUSED'; ui.show('menuPause'); document.exitPointerLock(); }
        else if (G.state === 'PAUSED') { G.state = 'PLAYING'; ui.show(null); canvas.requestPointerLock(); }
      }
      if (G.state === 'PLAYING' && /^Digit[1-6]$/.test(e.code)) switchSlot(parseInt(e.code[5]) - 1);
    });
    window.addEventListener('keyup', e => { G.keys[e.code] = false; });
    canvas.addEventListener('mousedown', e => {
      if (G.state === 'PLAYING') G.mouseDown = true;
    });
    window.addEventListener('mouseup', () => { G.mouseDown = false; });
    document.addEventListener('pointerlockchange', () => {
      if (G.state === 'PLAYING' && document.pointerLockElement !== canvas) { G.state = 'PAUSED'; ui.show('menuPause'); }
    });
    window.addEventListener('mousemove', e => {
      if (G.state !== 'PLAYING') return;
      if (document.pointerLockElement === canvas) {
        G.yaw -= e.movementX * G.sens;
        G.pitch = clamp(G.pitch - e.movementY * G.sens, -1.45, 1.45);
      }
    });
    // carregar save
    const saved = localStorage.getItem('zoc_save_v1');
    if (saved) {
      try {
        const d = JSON.parse(saved);
        G.cash = d.cash ?? 250;
        G.kills = d.kills ?? 0;
        G.score = d.score ?? 0;
        G.waveBest = d.waveBest ?? 0;
        G.xp = d.xp ?? 0;
        G.level = d.level ?? 1;
        G.weaponsOwned = d.weaponsOwned || ['glock17'];
        G.equipped = d.equipped || ['glock17', null, null, null, null, null];
        if (!G.equipped[0]) G.equipped[0] = 'glock17';
        swapGunModel(WEAPONS_BY_ID[G.equipped[0]]);
      } catch (e) { console.warn('save inválido', e); }
    }
    swapGunModel(WEAPONS_BY_ID.glock17);
    ui.updateHUD();
    loop(performance.now());
  },
  startGame() {
    Audio.ensure();
    G.state = 'PLAYING';
    G.hp = 100;
  G.pos.set(0, 0, 0);
  G.vel.set(0, 0, 0);
  G.jumpY = 0; G.jumpVel = 0; G.grounded = true;
  G.yaw = 0; G.pitch = 0; G.recoilPitch = 0;
    G.kills = 0; G.score = 0;
    G.ammoMag = currentWeapon().mag;
    G.ammoRes = currentWeapon().res;
    G.reloading = false; G.reloadUntil = 0;
    Wave.current = 0; Wave.target = 0; Wave.timer = 0; Wave.intermission = 0;
    enemies.forEach(e => scene.remove(e.mesh));
    enemies.length = 0;
    startWave();
    ui.show(null);
    canvas.requestPointerLock();
  },
  resume() {
    G.state = 'PLAYING';
    ui.show(null);
    canvas.requestPointerLock();
  },
  backToMenu() {
    G.state = 'MENU';
    ui.show('menuMain');
    document.exitPointerLock();
    const r = rankOf(G.level);
    $('mRank').textContent = r.name; $('mRank').style.color = r.color;
    $('mKills').textContent = G.kills;
    $('mWave').textContent = G.waveBest;
  },
  gameOver() {
    G.state = 'GAMEOVER';
    G.waveBest = Math.max(G.waveBest, Wave.current);
    const lb = JSON.parse(localStorage.getItem('zoc_lb_v1') || '[]');
    lb.push({ name: 'Jogador', score: G.score, kills: G.kills, wave: Wave.current, level: G.level, date: Date.now() });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem('zoc_lb_v1', JSON.stringify(lb.slice(0, 10)));
    localStorage.setItem('zoc_save_v1', JSON.stringify({
      cash: G.cash, kills: G.kills, score: G.score, waveBest: G.waveBest,
      xp: G.xp, level: G.level, weaponsOwned: G.weaponsOwned, equipped: G.equipped,
    }));
    $('goWave').textContent = Wave.current;
    $('goKills').textContent = G.kills;
    $('goScore').textContent = G.score;
    const r = rankOf(G.level);
    $('goRank').textContent = r.name; $('goRank').style.color = r.color;
    ui.show('menuGameOver');
    document.exitPointerLock();
  },
  buyOrEquip(id) {
    const w = WEAPONS_BY_ID[id];
    if (G.weaponsOwned.includes(id)) {
      // equipar no slot atual
      G.equipped[G.currentSlot] = id;
      swapGunModel(w);
      G.ammoMag = w.mag;
      G.ammoRes = w.res;
      Audio.buy();
      ui.toast(`${w.name} equipado no slot ${G.currentSlot + 1}`);
      ui.updateHUD();
      this.save();
    } else {
      if (G.cash < w.price) { ui.toast('Dinheiro insuficiente'); return; }
      if (G.level < w.lvl) { ui.toast(`Nível ${w.lvl} necessário`); return; }
      G.cash -= w.price;
      G.weaponsOwned.push(id);
      G.equipped[G.currentSlot] = id;
      swapGunModel(w);
      G.ammoMag = w.mag;
      G.ammoRes = w.res;
      Audio.buy();
      ui.toast(`${w.name} comprado e equipado`);
      ui.updateHUD();
      this.save();
    }
  },
  save() {
    try {
      localStorage.setItem('zoc_save_v1', JSON.stringify({
        cash: G.cash, kills: G.kills, score: G.score, waveBest: G.waveBest,
        xp: G.xp, level: G.level, weaponsOwned: G.weaponsOwned, equipped: G.equipped,
      }));
    } catch (e) {}
  },
  addXP(amount) {
    G.xp += amount;
    while (G.xp >= xpFor(G.level)) {
      G.xp -= xpFor(G.level);
      G.level++;
      Audio.levelUp();
      ui.centerMsg(`NÍVEL ${G.level}`, 1.5);
    }
  },
  addScore(points) {
    G.score += Math.floor(points * (1 + (G.level - 1) * 0.1));
  },
  addCash(amount) {
    G.cash += amount;
  }
};

window.game = game;
game.init();
