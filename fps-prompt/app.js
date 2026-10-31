/* ============================================================
   NÚCLEO ZERO — renderização do documento
   Lê os dados de data.js e monta tabelas, filtros e cards.
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- utilidades ---------- */
const tierKey = (u) => {
  const k = (u || "").toLowerCase();
  if (k.startsWith("bronze")) return "bronze";
  if (k.startsWith("prata")) return "prata";
  if (k.startsWith("ouro")) return "ouro";
  if (k.startsWith("platina")) return "platina";
  if (k.startsWith("diamante")) return "diamante";
  if (k.startsWith("mestre")) return "mestre";
  if (k.startsWith("lend")) return "lendario";
  return "";
};

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const bar = (v, label) => {
  const color = v >= 80 ? "var(--green)" : v >= 60 ? "var(--cyan)" : v >= 45 ? "var(--amber)" : "var(--red)";
  return `<div class="bar" title="${esc(label)}: ${v}/100">
      <i><s style="width:${v}%;background:${color}"></s></i><span>${v}</span>
    </div>`;
};

const fmt = (n) => (n === 0 ? "—" : n.toFixed(1).replace(".", ","));

/* ---------- chips ---------- */
function buildChips(host, values, onPick, counts) {
  const all = document.createElement("button");
  all.className = "chip on";
  all.type = "button";
  all.textContent = "Todos";
  all.dataset.value = "";
  host.appendChild(all);

  values.forEach((v) => {
    const b = document.createElement("button");
    b.className = "chip";
    b.type = "button";
    const n = counts && counts[v] != null ? ` <span class="c">${counts[v]}</span>` : "";
    b.innerHTML = `${v}${n}`;
    b.dataset.value = v;
    host.appendChild(b);
  });

  host.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".chip");
    if (!btn) return;
    $$(".chip", host).forEach((c) => c.classList.remove("on"));
    btn.classList.add("on");
    onPick(btn.dataset.value);
  });
}

/* ============================================================
   ARMAS
   ============================================================ */
const wBody = $("#wTable tbody");
let wFilter = "", wQuery = "";

function weaponRow(w) {
  const tk = tierKey(w.unlock);
  return `<tr data-id="${w.id}">
    <td class="id">${w.id}</td>
    <td class="name"><b>${esc(w.nome)}</b></td>
    <td class="fam">${esc(w.classe)}</td>
    <td>${esc(w.municao)}</td>
    <td class="n">${w.dano}</td>
    <td class="n">${w.rpm}</td>
    <td class="n">${w.pente || "—"}</td>
    <td class="n">${w.reserva || "—"}</td>
    <td class="n">${w.recarga ? fmt(w.recarga) + "s" : "overheat"}</td>
    <td class="n">${w.tatica ? fmt(w.tatica) + "s" : "—"}</td>
    <td>${bar(w.precisao, "Precisão")}</td>
    <td>${bar(w.mob, "Mobilidade")}</td>
    <td><span class="tier-tag ${tk}">${esc(w.unlock)}</span></td>
  </tr>`;
}

function renderWeapons() {
  const q = wQuery.trim().toLowerCase();
  const list = WEAPONS.filter((w) => {
    const okFam = !wFilter || w.familia === wFilter;
    const hay = `${w.id} ${w.nome} ${w.classe} ${w.municao} ${w.unlock} ${w.nota}`.toLowerCase();
    return okFam && (!q || hay.includes(q));
  });
  wBody.innerHTML = list.map(weaponRow).join("") ||
    `<tr><td colspan="13" style="padding:24px;color:var(--muted)">Nenhuma arma encontrada.</td></tr>`;
  $("#wCount").textContent = `${list.length} / ${WEAPONS.length} armas`;
}

/* família de jogo, derivada do ID (W01–W10 = pistolas, etc.) */
const familiaDe = (id) => {
  const n = Number(id.slice(1));
  if (n <= 10) return "Pistola";
  if (n <= 18) return "SMG";
  if (n <= 28) return "Rifle";
  if (n <= 35) return "Escopeta";
  if (n <= 42) return "Precisão";
  if (n <= 46) return "Metralhadora";
  if (n <= 50) return "Explosivo";
  if (n <= 56) return "Energia";
  return "Corpo a corpo";
};
WEAPONS.forEach((w) => { w.familia = familiaDe(w.id); });

const FAMILIAS = ["Pistola", "SMG", "Rifle", "Escopeta", "Precisão", "Metralhadora", "Explosivo", "Energia", "Corpo a corpo"];
const famCounts = FAMILIAS.reduce((acc, f) => {
  acc[f] = WEAPONS.filter((w) => w.familia === f).length;
  return acc;
}, {});

buildChips($("#wChips"), FAMILIAS, (v) => { wFilter = v; renderWeapons(); }, famCounts);
$("#wSearch").addEventListener("input", (e) => { wQuery = e.target.value; renderWeapons(); });
renderWeapons();

/* ============================================================
   INIMIGOS
   ============================================================ */
const eBody = $("#eTable tbody");
let eFilter = "", eQuery = "";

function enemyRow(e) {
  return `<tr data-id="${e.id}">
    <td class="id">${e.id}</td>
    <td class="name"><b>${esc(e.nome)}</b></td>
    <td class="fam">${esc(e.tipo)}</td>
    <td>${esc(e.bioma)}</td>
    <td class="n">${e.hp}</td>
    <td class="n">${e.dano}</td>
    <td style="white-space:nowrap">${esc(e.vel)}</td>
    <td class="note">${esc(e.ia)}</td>
    <td style="white-space:nowrap;color:var(--green)">${esc(e.fraqueza)}</td>
    <td class="n" style="color:var(--amber)">${e.rp}</td>
  </tr>`;
}

function renderEnemies() {
  const q = eQuery.trim().toLowerCase();
  const list = ENEMIES.filter((e) => {
    const okT = !eFilter || e.tipo === eFilter || (eFilter === "Chefe" && e.tipo.startsWith("Chefe"));
    const hay = `${e.id} ${e.nome} ${e.tipo} ${e.bioma} ${e.ia} ${e.fraqueza}`.toLowerCase();
    return okT && (!q || hay.includes(q));
  });
  eBody.innerHTML = list.map(enemyRow).join("") ||
    `<tr><td colspan="10" style="padding:24px;color:var(--muted)">Nenhum inimigo encontrado.</td></tr>`;
  $("#eCount").textContent = `${list.length} / ${ENEMIES.length} inimigos`;
}

const TIPOS = ["Infantaria", "Precisão", "Pesado", "Mutante", "Drone", "Chefe"];
const tipoCounts = TIPOS.reduce((acc, t) => {
  acc[t] = ENEMIES.filter((e) => e.tipo === t || (t === "Chefe" && e.tipo.startsWith("Chefe"))).length;
  return acc;
}, {});

buildChips($("#eChips"), TIPOS, (v) => {
  eFilter = v; renderEnemies();
}, tipoCounts);
$("#eSearch").addEventListener("input", (e) => { eQuery = e.target.value; renderEnemies(); });
renderEnemies();

/* ============================================================
   TOOLTIP (nota de design)
   ============================================================ */
const tip = $("#tip");
function showTip(html, x, y) {
  tip.innerHTML = html;
  tip.classList.add("on");
  const pad = 14;
  const r = tip.getBoundingClientRect();
  let left = x + pad, top = y + pad;
  if (left + r.width > innerWidth - 8) left = x - r.width - pad;
  if (top + r.height > innerHeight - 8) top = y - r.height - pad;
  tip.style.left = Math.max(8, left) + "px";
  tip.style.top = Math.max(8, top) + "px";
}
function hideTip() { tip.classList.remove("on"); }

wBody.addEventListener("mousemove", (ev) => {
  const tr = ev.target.closest("tr[data-id]");
  if (!tr) return hideTip();
  const w = WEAPONS.find((x) => x.id === tr.dataset.id);
  showTip(`<b>${esc(w.nome)}</b>${esc(w.nota)}<br><span style="color:#5e6a86">Alcance/mobilidade e recuo definidos na ficha de balanceamento.</span>`, ev.clientX, ev.clientY);
});
wBody.addEventListener("mouseleave", hideTip);

eBody.addEventListener("mousemove", (ev) => {
  const tr = ev.target.closest("tr[data-id]");
  if (!tr) return hideTip();
  const e = ENEMIES.find((x) => x.id === tr.dataset.id);
  showTip(`<b>${esc(e.nome)}</b>${esc(e.ia)}<br><span style="color:#5e6a86">Fraqueza: ${esc(e.fraqueza)} · ${esc(e.bioma)}</span>`, ev.clientX, ev.clientY);
});
eBody.addEventListener("mouseleave", hideTip);

/* toque: mostra a nota por 2,5 s */
[wBody, eBody].forEach((body) => {
  body.addEventListener("touchstart", (ev) => {
    const tr = ev.target.closest("tr[data-id]");
    if (!tr) return;
    const t = ev.touches[0];
    const isW = body === wBody;
    const item = isW ? WEAPONS.find((x) => x.id === tr.dataset.id) : ENEMIES.find((x) => x.id === tr.dataset.id);
    showTip(isW ? `<b>${esc(item.nome)}</b>${esc(item.nota)}` : `<b>${esc(item.nome)}</b>${esc(item.ia)}`, t.clientX, t.clientY);
    clearTimeout(body._tt);
    body._tt = setTimeout(hideTip, 2500);
  }, { passive: true });
});

/* ============================================================
   RANKS
   ============================================================ */
$("#ranks").innerHTML = RANKS.map((r, i) => {
  const rp = r.rpMax === null ? `RP ${r.rpMin}+` : `RP ${r.rpMin}–${r.rpMax}`;
  const div = r.divisoes.join(" · ");
  return `<div class="rank" style="--rc:${r.cor}">
    <div class="hex">${i + 1}</div>
    <h4>${esc(r.tier)}</h4>
    <div class="div">${esc(div)}</div>
    <div class="rp">${rp}</div>
    <p>${esc(r.premio)}</p>
  </div>`;
}).join("");

/* ============================================================
   RECARGA
   ============================================================ */
$("#reloadGrid").innerHTML = RELOAD_TYPES.map((r) => {
  const risk = (r.risco || "").toLowerCase();
  const riskCls = risk.startsWith("alto") ? "alto" : risk.startsWith("méd") ? "medio" : risk.startsWith("baixo") ? "baixo" : "";
  return `<article class="reload">
    <div class="top"><h4>${esc(r.nome)}</h4><span class="key">${esc(r.tecla)}</span></div>
    <div class="t">${esc(r.tempo)}</div>
    ${riskCls ? `<span class="risk ${riskCls}">Risco ${esc(r.risco)}</span>` : ""}
    <p>${esc(r.regra)}</p>
    <div class="use">▸ ${esc(r.uso)}</div>
  </article>`;
}).join("");

/* ============================================================
   ARTE
   ============================================================ */
$("#artGrid").innerHTML = ART_RULES.map((a) => `
  <article class="art"><h4>${esc(a.titulo)}</h4><p>${esc(a.texto)}</p></article>
`).join("");

/* ============================================================
   COPIAR PROMPT
   ============================================================ */
$("#copyBtn").addEventListener("click", async () => {
  const text = $("#promptText").textContent;
  const btn = $("#copyBtn");
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Copiado ✓";
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    btn.textContent = "Copiado ✓";
  }
  btn.classList.add("done");
  setTimeout(() => { btn.textContent = "Copiar prompt"; btn.classList.remove("done"); }, 2200);
});

/* data */
$("#today").textContent = new Date().toLocaleDateString("pt-BR");

/* ============================================================
   DOWNLOAD (ZIP e PDF) com fallback por Blob
   ============================================================ */
(function () {
  const note = document.getElementById("dlNote");

  function say(html) {
    if (note) note.innerHTML = html;
  }

  async function blobDownload(url, filename) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const blob = await res.blob();
    if (blob.size < 1000) throw new Error("arquivo vazio");
    const obj = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = obj;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(obj), 5000);
    return blob.size;
  }

  function wire(id, url, filename, label) {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", async (ev) => {
      ev.preventDefault();
      try {
        const size = await blobDownload(url, filename);
        say(`Download de <b>${filename}</b> iniciado (${Math.round(size / 1024)} KB). Confira a pasta de downloads.`);
      } catch (err) {
        // segue o link normal do botão
        say(`Não foi possível baixar por aqui. Use o botão <b>ZIP no GitHub</b> ou abra <a href="${url}" download>${label}</a> com o botão direito → “Salvar link como…”`);
        window.location.href = url;
      }
    });
  }

  wire("zipBtn", "zip", "NUCLEO-ZERO-pacote.zip", "o ZIP");
})();
