#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera NUCLEO-ZERO-prompt.pdf — versão para download/impressão do prompt mestre
e do documento de design do FPS 3D pixelado.

Uso:  python3 make_pdf.py
Requer: fpdf2  (pip install fpdf2)  +  Node.js (para ler data.js)
"""
import json
import os
import subprocess
import sys
import datetime as dt

from fpdf import FPDF
from fpdf.enums import XPos, YPos

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "NUCLEO-ZERO-prompt.pdf")
FONTS = "/usr/share/fonts/truetype/dejavu"

# ---------------------------------------------------------------- paleta
INK      = (14, 17, 26)
TXT      = (34, 40, 54)
MUTED    = (108, 117, 138)
LINE     = (214, 220, 232)
PANEL    = (243, 246, 252)
PANEL2   = (233, 238, 248)
AMBER    = (158, 106, 12)
AMBER_L  = (232, 185, 63)
CYAN     = (20, 104, 102)
CYAN_L   = (99, 214, 209)
PINK     = (186, 58, 88)
PINK_L   = (255, 107, 139)
GREEN    = (34, 122, 74)
RED      = (176, 58, 52)
WHITE    = (255, 255, 255)


def load_data():
    js = (
        'const fs=require("fs");'
        'const src=fs.readFileSync("data.js","utf8")'
        '+"\\nmodule.exports={WEAPONS,ENEMIES,RANKS,RELOAD_TYPES,ART_RULES};";'
        'fs.writeFileSync(".data.cjs",src);'
        'const d=require("./.data.cjs");fs.unlinkSync(".data.cjs");'
        'fs.writeFileSync("/tmp/nz.json",JSON.stringify(d));'
    )
    subprocess.run(["node", "-e", js], cwd=HERE, check=True)
    with open("/tmp/nz.json", encoding="utf-8") as f:
        return json.load(f)


D = load_data()
WEAPONS, ENEMIES = D["WEAPONS"], D["ENEMIES"]
RANKS, RELOAD, ART = D["RANKS"], D["RELOAD_TYPES"], D["ART_RULES"]

FAMILIAS = [
    ("Pistola", "10", "Mobilidade máxima, saque rápido, recarga curta"),
    ("SMG", "8", "Pressão em curta distância, recarga em movimento"),
    ("Rifle", "10", "Base do meta, média distância"),
    ("Escopeta", "7", "Duelo até 8 m, recarga bago a bago"),
    ("Precisão", "7", "Ângulo longo, cadência baixa, recarga caríssima"),
    ("Metralhadora", "4", "Supressão e objetivo, recarga de 6 a 9 s"),
    ("Explosivo", "4", "Dano em área, pente mínimo"),
    ("Energia", "6", "Overheat em vez de pente"),
    ("Corpo a corpo", "4", "Silencioso, ignora escudo de energia"),
]


def familia_de(wid):
    n = int(wid[1:])
    return ("Pistola" if n <= 10 else "SMG" if n <= 18 else "Rifle" if n <= 28
            else "Escopeta" if n <= 35 else "Precisão" if n <= 42
            else "Metralhadora" if n <= 46 else "Explosivo" if n <= 50
            else "Energia" if n <= 56 else "Corpo a corpo")


# ================================================================ documento
class Doc(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(True, margin=20)
        self.set_margins(16, 20, 16)
        self.add_font("Sans", "", os.path.join(FONTS, "DejaVuSans.ttf"))
        self.add_font("Sans", "B", os.path.join(FONTS, "DejaVuSans-Bold.ttf"))
        self.add_font("Mono", "", os.path.join(FONTS, "DejaVuSansMono.ttf"))
        self.add_font("Mono", "B", os.path.join(FONTS, "DejaVuSansMono-Bold.ttf"))
        self.alias_nb_pages()
        self.set_title("NÚCLEO ZERO — Prompt mestre + GDD de FPS 3D pixelado")
        self.set_subject("60 armas, 50 inimigos, 8 mecânicas de recarga, ranque em 7 tiers")
        self.set_author("Pacote de produção NÚCLEO ZERO")
        self.set_keywords("FPS, pixel art, game design document, prompt, ranque, recarga, 3D")
        self.chapter = ""
        self.toc_pages = {}
        self.record_toc = False
        self.cur_orientation = "P"
        self.cur_margins = (16, 20)

    # ------------------------------------------------ utilidades de página
    def add_page(self, orientation="", format="", same=False, duration=0):
        """Mantém a orientação atual (a quebra automática não volta para retrato)."""
        if not orientation and not same:
            orientation = getattr(self, "cur_orientation", "P")
        return super().add_page(orientation=orientation, format=format, same=same,
                                duration=duration)

    @property
    def cw(self):
        return self.w - self.l_margin - self.r_margin

    def section_mark(self, key):
        if self.record_toc and key not in self.toc_pages:
            self.toc_pages[key] = self.page_no()

    def n_lines(self, text, w, h=None):
        """Quantas linhas um multi_cell ocuparia (dry run)."""
        return len(self.multi_cell(w, h or 4.2, text, dry_run=True, output="LINES"))

    def ensure(self, h):
        """Nova página (mantendo orientação) se o bloco de altura h não couber."""
        if self.get_y() + h > self.h - self.b_margin:
            self.body_page(self.cur_orientation, self.cur_margins)

    def body_page(self, orientation="P", margins=(16, 20)):
        self.cur_orientation, self.cur_margins = orientation, margins
        self.add_page(orientation=orientation)
        self.set_margins(margins[0], margins[1], margins[0])
        self.set_top_margin(max(margins[1] - 6, 14))

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Mono", "", 6.6)
        self.set_text_color(*MUTED)
        self.set_y(9)
        self.cell(0, 4, "NÚCLEO ZERO · FPS 3D PIXELADO · PROMPT DE PRODUÇÃO",
                  align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        right = self.chapter.upper()
        self.set_xy(self.l_margin, 9)
        self.cell(0, 4, right, align="R")
        self.set_draw_color(*LINE)
        self.set_line_width(0.3)
        self.line(self.l_margin, 14.5, self.w - self.r_margin, 14.5)
        self.set_y(max(self.t_margin, 20))

    def footer(self):
        if self.page_no() == 1:
            return
        self.set_y(-13)
        self.set_draw_color(*LINE)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.set_y(-11)
        self.set_font("Mono", "", 6.6)
        self.set_text_color(*MUTED)
        self.cell(0, 4, "v1.0 · gerado a partir de data.js", align="L")
        self.set_y(-11)
        self.cell(0, 4, f"pág. {self.page_no()} / {{nb}}", align="R")

    # ------------------------------------------------ blocos de conteúdo
    def kicker(self, text, color=AMBER):
        self.ln(2)
        self.set_font("Mono", "", 6.8)
        self.set_text_color(*color)
        self.cell(0, 4, text.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1)

    def h1(self, num, title, lead=None, key=None):
        self.section_mark(key or title)
        need = 26 + (10 if lead else 0)
        self.ensure(need)
        y = self.get_y()
        self.set_fill_color(*AMBER_L)
        self.rect(self.l_margin, y + 0.6, 11, 7.6, style="F")
        self.set_font("Mono", "B", 7.4)
        self.set_text_color(*INK)
        self.set_xy(self.l_margin, y + 1.6)
        self.cell(11, 5, num, align="C")
        self.set_font("Sans", "B", 17)
        self.set_text_color(*INK)
        self.set_xy(self.l_margin + 14, y)
        self.cell(0, 8.8, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*AMBER_L)
        self.set_line_width(0.5)
        yy = self.get_y() + 0.4
        self.line(self.l_margin, yy, self.l_margin + 16, yy)
        self.set_draw_color(*LINE)
        self.line(self.l_margin + 18, yy, self.w - self.r_margin, yy)
        self.set_y(yy + 4)
        if lead:
            self.para(lead, size=8.6, color=MUTED, lh=4.4)
        self.ln(1)

    def h2(self, text, color=INK, gap=2):
        self.ln(gap)
        self.ensure(12)
        self.set_font("Sans", "B", 10.2)
        self.set_text_color(*color)
        self.cell(0, 6, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1.2)

    def para(self, text, size=8.8, color=TXT, lh=4.5, bold=False, mono=False):
        self.set_font("Mono" if mono else "Sans", "B" if bold else "", size)
        self.set_text_color(*color)
        self.multi_cell(self.cw, lh, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(1.2)

    def bullets(self, items, size=8.4, color=TXT, mark="▪", mark_color=CYAN, lh=4.2):
        for it in items:
            self.ensure(lh + 1)
            self.set_font("Sans", "", size)
            self.set_text_color(*mark_color)
            x0 = self.get_x()
            self.cell(4, lh, mark, new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.set_text_color(*color)
            self.multi_cell(self.cw - 4, lh, it, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.set_x(x0)
            self.ln(0.8)
        self.ln(1.2)

    def numbered(self, items, size=8.4, lh=4.2, color=AMBER):
        for i, it in enumerate(items, 1):
            self.ensure(lh + 2)
            self.set_font("Mono", "B", size - 0.6)
            self.set_text_color(*color)
            self.cell(5, lh, f"{i:02d}", new_x=XPos.RIGHT, new_y=YPos.TOP)
            self.set_font("Sans", "", size)
            self.set_text_color(*TXT)
            self.multi_cell(self.cw - 5, lh, it, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(0.8)
        self.ln(1.2)

    def callout(self, title, text, accent=CYAN):
        self.ensure(20)
        y = self.get_y()
        self.set_font("Sans", "", 8.2)
        height = self.n_lines(text, self.cw - 12, 4.3) * 4.3 + 11
        self.set_fill_color(*PANEL)
        self.rect(self.l_margin, y, self.cw, height, style="F")
        self.set_fill_color(*accent)
        self.rect(self.l_margin, y, 2.2, height, style="F")
        self.set_xy(self.l_margin + 6, y + 3.4)
        self.set_font("Sans", "B", 8.4)
        self.set_text_color(*INK)
        self.cell(0, 4.4, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_x(self.l_margin + 6)
        self.set_font("Sans", "", 8.2)
        self.set_text_color(*TXT)
        self.multi_cell(self.cw - 12, 4.3, text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_y(y + height + 3)

    def code(self, text, size=6.9, lh=3.5, fill=(24, 28, 40)):
        lines = text.rstrip("\n").split("\n")
        h = len(lines) * lh + 8
        self.ensure(min(h, 250))
        # bloco pode quebrar entre páginas
        if h > self.h - self.t_margin - 24:
            chunk = int((self.h - self.t_margin - 30) // lh)
            for i in range(0, len(lines), chunk):
                part = "\n".join(lines[i:i + chunk])
                self._code_block(part, size, lh, fill)
                if i + chunk < len(lines):
                    self.body_page(self.cur_orientation, self.cur_margins)
            return
        self._code_block("\n".join(lines), size, lh, fill)

    def _code_block(self, text, size, lh, fill):
        lines = text.split("\n")
        h = len(lines) * lh + 7
        y = self.get_y()
        self.set_fill_color(*fill)
        self.rect(self.l_margin, y, self.cw, h, style="F")
        self.set_fill_color(*AMBER_L)
        self.rect(self.l_margin, y, self.cw, 1.1, style="F")
        self.set_xy(self.l_margin + 4, y + 4.6)
        self.set_font("Mono", "", size)
        self.set_text_color(200, 212, 232)
        for ln in lines:
            self.cell(0, lh, ln, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.set_x(self.l_margin + 4)
        self.set_y(y + h + 3)

    # ------------------------------------------------ tabelas
    def table(self, cols, rows, head_fill=INK, font=6.8, head_font=6.2,
              pad=1.4, zebra=True, align=None, pad_right=1.4):
        """cols: [(titulo, largura_mm, 'L'|'R')]"""
        # tenta manter tabelas pequenas inteiras na página
        avail = self.h - self.t_margin - self.b_margin
        total = 6.4 + sum(
            max(self.n_lines(str(cell), w - 1.2 - (pad_right if al == "R" else 1.2),
                             font * 0.52) for (titulo, w, al), cell in zip(cols, r)) * (font * 0.52)
            + pad * 2
            for r in rows
        )
        if total <= avail:
            self.ensure(total)
        else:
            self.ensure(16)

        def draw_head():
            y = self.get_y()
            self.set_fill_color(*head_fill)
            self.rect(self.l_margin, y, sum(c[1] for c in cols), 6.4, style="F")
            self.set_font("Mono", "B", head_font)
            self.set_text_color(*WHITE)
            x = self.l_margin
            for titulo, w, al in cols:
                pr = pad_right if al == "R" else 1.2
                self.set_xy(x + 1.2, y + 1.9)
                self.cell(w - 1.2 - pr, 3.6, titulo.upper(), align=al)
                x += w
            self.set_y(y + 6.4)

        draw_head()
        self.set_font("Sans", "", font)
        for i, r in enumerate(rows):
            heights = []
            for (titulo, w, al), cell in zip(cols, r):
                pr = pad_right if al == "R" else 1.2
                lines = self.multi_cell(w - 1.2 - pr, font * 0.52, str(cell),
                                        dry_run=True, output="LINES")
                heights.append(len(lines) * (font * 0.52))
            rh = max(heights) + pad * 2
            if self.get_y() + rh > self.h - self.b_margin:
                self.body_page(self.cur_orientation, self.cur_margins)
                draw_head()
                self.set_font("Sans", "", font)
            y = self.get_y()
            if zebra and i % 2 == 1:
                self.set_fill_color(*PANEL)
                self.rect(self.l_margin, y, sum(c[1] for c in cols), rh, style="F")
            x = self.l_margin
            for (titulo, w, al), cell in zip(cols, r):
                pr = pad_right if al == "R" else 1.2
                self.set_xy(x + 1.2, y + pad)
                self.set_text_color(*TXT)
                self.multi_cell(w - 1.2 - pr, font * 0.52, str(cell), align=al,
                                new_x=XPos.RIGHT, new_y=YPos.TOP)
                x += w
            self.set_draw_color(*LINE)
            self.set_line_width(0.15)
            self.line(self.l_margin, y + rh, self.l_margin + sum(c[1] for c in cols), y + rh)
            self.set_y(y + rh)
        if self.get_y() < self.h - self.b_margin - 3:
            self.ln(3)


# ================================================================ páginas
def cover(pdf):
    pdf.set_auto_page_break(False)
    pdf.add_page()
    pdf.set_fill_color(12, 15, 23)
    pdf.rect(0, 0, pdf.w, pdf.h, style="F")

    img = os.path.join(HERE, "cover.png")
    if os.path.exists(img):
        pdf.image(img, x=0, y=0, w=pdf.w)
        himg = pdf.w * 720 / 1280
        pdf.set_fill_color(*AMBER_L)
        pdf.rect(0, himg, pdf.w, 1.6, style="F")
        y = himg + 16
    else:
        y = 40

    pdf.set_xy(18, y)
    pdf.set_font("Mono", "", 7.6)
    pdf.set_text_color(*AMBER_L)
    pdf.cell(0, 4, "P A C O T E   D E   P R O D U Ç Ã O   ·   v 1 . 0",
             new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    y += 9
    pdf.set_xy(18, y)
    pdf.set_font("Mono", "B", 33)
    pdf.set_text_color(*PINK)
    pdf.cell(0, 13, "NÚCLEO ZERO", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_xy(18, y)
    pdf.set_text_color(*AMBER_L)
    pdf.cell(0, 13, "NÚCLEO ZERO", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_xy(17.4, y - 0.4)
    pdf.set_text_color(248, 250, 255)
    pdf.cell(0, 13, "NÚCLEO ZERO", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    y += 17
    pdf.set_xy(18, y)
    pdf.set_font("Sans", "", 10.4)
    pdf.set_text_color(196, 208, 228)
    pdf.multi_cell(174, 5.6,
                   "Prompt mestre + documento de design para um FPS 3D em pixel art "
                   "com ranqueamento competitivo.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    y += 14
    tags = ["60 ARMAS", "50 INIMIGOS", "8 MECÂNICAS DE RECARGA", "7 RANQUES",
            "6 BIOMAS", "RENDER 480×270"]
    x = 18
    for t in tags:
        pdf.set_font("Mono", "", 6.6)
        w = pdf.get_string_width(t) + 6
        if x + w > pdf.w - 18:
            x = 18
            y += 7.5
        pdf.set_draw_color(96, 112, 146)
        pdf.set_line_width(0.25)
        pdf.set_text_color(*CYAN_L)
        pdf.rect(x, y, w, 5.6)
        pdf.set_xy(x, y + 1.5)
        pdf.cell(w, 3, t, align="C")
        x += w + 3

    y += 24
    pdf.set_draw_color(56, 66, 92)
    pdf.set_line_width(0.3)
    pdf.line(18, y, pdf.w - 18, y)
    y += 6
    pdf.set_xy(18, y)
    pdf.set_font("Mono", "", 7.2)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(174, 4.3,
                   "Dentro: prompt mestre completo · ficha das 60 armas · bestiário de 50 inimigos ·\n"
                   "sistema de ranque e RP · 8 mecânicas de recarga · direção de arte 3D pixelada ·\n"
                   "escopo por fases com critérios de aceite.",
                   new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_xy(18, pdf.h - 22)
    pdf.set_font("Mono", "", 6.8)
    pdf.set_text_color(120, 132, 158)
    pdf.cell(0, 4, f"arquivos do pacote: index.html · PROMPT.md · data.js · make_pdf.py", align="L")
    pdf.set_xy(18, pdf.h - 17)
    pdf.cell(0, 4, dt.date.today().strftime("%d/%m/%Y"), align="L")

    # barra inferior
    pdf.set_fill_color(*AMBER_L)
    pdf.rect(0, pdf.h - 5, pdf.w, 5, style="F")
    pdf.set_auto_page_break(True, margin=20)
    pdf.set_y(20)


def toc(pdf, known=None):
    pdf.chapter = "Sumário"
    pdf.body_page()
    pdf.h1("00", "Sumário", "O documento inteiro em ordem de leitura — do conceito ao prompt curto para copiar.")
    entries = [
        ("01", "Contexto e objetivo"),
        ("02", "Pilares de design"),
        ("03", "Arsenal: 60 armas"),
        ("04", "Sistema de recarga: 8 mecânicas"),
        ("05", "Bestiário: 50 inimigos"),
        ("06", "Ranqueamento"),
        ("07", "Biomas e modos"),
        ("08", "Direção de arte 3D pixelada"),
        ("09", "Áudio, UI e stack técnica"),
        ("10", "Entrega em fases"),
        ("11", "Restrições"),
        ("12", "Prompt curto (copiar e colar)"),
    ]
    pdf.ln(3)
    for num, title in entries:
        pg = (known or {}).get(title, "—")
        y = pdf.get_y()
        pdf.set_font("Mono", "B", 8.4)
        pdf.set_text_color(*AMBER)
        pdf.cell(9, 9, num)
        pdf.set_font("Sans", "B", 10)
        pdf.set_text_color(*INK)
        tw = pdf.get_string_width(title)
        pdf.cell(tw + 1, 9, title)
        pdf.set_font("Mono", "", 8)
        pdf.set_text_color(*MUTED)
        pw = pdf.get_string_width(str(pg)) + 2
        x0 = pdf.get_x()
        dots_w = pdf.cw - 9 - tw - pw - 3
        n = max(0, int(dots_w // 2.0))
        pdf.set_text_color(196, 203, 218)
        pdf.cell(dots_w, 9, "." * n)
        pdf.set_text_color(*TXT)
        pdf.cell(pw, 9, str(pg), align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_draw_color(238, 241, 248)
        pdf.set_line_width(0.2)
        pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
    pdf.ln(6)
    pdf.callout("Como usar",
                "Cole o prompt da seção 01 (ou o prompt curto da seção 12) em um agente de código e "
                "peça a implementação por fases, entregando também o arquivo data.js. As tabelas das "
                "seções 03 e 05 são a especificação numérica de balanceamento — se o agente mudar um "
                "números, o balanceamento muda.",
                accent=AMBER_L if False else CYAN)


def s_contexto(pdf):
    pdf.chapter = "01 · Contexto"
    pdf.body_page()
    pdf.h1("01", "Contexto e objetivo",
           "O jogo que este prompt descreve: FPS 3D em pixel art, competitivo, com progressão ranqueada.")
    pdf.para("Crie NÚCLEO ZERO, um FPS 3D em primeira pessoa com estética pixel art, focado em "
             "partidas rápidas 5v5 e progressão ranqueada. O jogo deve ser legível como um jogo "
             "competitivo de verdade — silhuetas claras, feedback imediato, nenhum dano impossível "
             "de prever — mas com a identidade visual de um jogo 3D de 32 bits: geometria low-poly, "
             "texturas pequenas, render interno em baixa resolução e upscale nearest-neighbor, "
             "sem suavização.")
    pdf.h2("Premissas")
    pdf.bullets([
        "Partida padrão de 8 a 15 minutos, 5v5, com respawn em Escolta e Domínio.",
        "60 FPS como meta mínima em hardware modesto e no navegador.",
        "Primeira build jogável de verdade no fim da Fase 1, não no fim do projeto.",
        "Toda vantagem competitiva é conquistada jogando; a loja vende apenas cosmético.",
        "60 armas, 50 inimigos, 8 mecânicas de recarga e 7 tiers de ranque são escopo, não extras.",
    ])
    pdf.callout("Decisão de produto",
                "Um jogo de tiro com 60 armas morre pelo excesso, não pela falta. O prompt resolve isso "
                "obrigando cada arma a ter um papel declarado e um custo: nenhuma domina todas as faixas "
                "de distância. O mesmo vale para os 50 inimigos: cada um precisa ensinar uma resposta nova.")


def s_pilares(pdf):
    pdf.chapter = "02 · Pilares"
    pdf.body_page()
    pdf.h1("02", "Pilares de design", "Seis regras que decidem qualquer dúvida de implementação.")
    pdf.numbered([
        "Leitura clara acima de realismo. Tudo que importa (inimigo, classe, perigo, janela de recarga) "
        "é identificável em 0,3 s por silhueta, cor e animação. Nada de camuflagem que esconde inimigos.",
        "A recarga é uma decisão, não uma espera. O sistema de recarga é a mecânica-assinatura: recarga "
        "tática, cancelamento por troca, timing ativo, overheat. Quem domina a recarga tem vantagem mensurável.",
        "60 armas, 60 identidades. Nenhuma arma é a melhor. Cada uma ganha em uma faixa e perde em outra; "
        "se duas têm os mesmos números, uma delas é cortada.",
        "50 inimigos, 50 problemas. Cada inimigo ensina algo: flanquear, esperar, mirar no ponto fraco. "
        "Nada de reskin com vida maior.",
        "Ranque honesto. RP mede resultado e desempenho, nunca tempo jogado. MMR separado do RP impede "
        "inflação e farming.",
        "Arte com orçamento. Paleta limitada, atlas único por bioma, animação a 12–18 FPS com poses "
        "exageradas. Pixel art não é desculpa para asset genérico.",
    ])


def s_armas(pdf):
    pdf.chapter = "03 · Arsenal"
    pdf.body_page()
    pdf.h1("03", "Arsenal: 60 armas",
           "Nove famílias, cada uma com um papel claro no meta. Nenhuma arma é boa em tudo.")
    pdf.table(
        [("Família", 40, "L"), ("Qtde", 14, "R"), ("Papel", pdf.cw - 54, "L")],
        FAMILIAS, font=8, head_font=6.2,
    )
    pdf.h2("Regras de balanceamento obrigatórias")
    pdf.bullets([
        "Orçamento de poder: 100 pontos distribuídos entre dano, cadência, precisão, mobilidade e "
        "tempo de recarga. Nada acima de 100 sem pagar em outro atributo.",
        "TTK alvo: 0,25–0,45 s em curta distância; 0,5–0,9 s em média; 0,9–1,6 s em longa.",
        "Custo de recarga: maior DPS sustentado exige recarga mais longa e maior penalidade de "
        "mobilidade durante ela.",
        "Desbloqueio: distribuição por ranque (Bronze a Lendário). Nenhuma arma exclusiva de compra.",
        "Modificadores são trocas (pente estendido custa recarga mais lenta), nunca bônus puros; "
        "no máximo 20% de redução de tempo de recarga.",
        "Toda arma precisa matar em até um pente cheio — senão o pente ou o dano estão errados.",
    ])
    pdf.ln(1)
    pdf.para("Ficha completa na página seguinte (formato paisagem). Recarga e recarga tática em segundos; "
             "precisão e mobilidade de 0 a 100.", size=8, color=MUTED)

    # tabela paisagem
    pdf.chapter = "03 · Ficha das 60 armas"
    pdf.body_page(orientation="L", margins=(13, 17))
    pdf.h1("03b", "Ficha das 60 armas",
           "Números de referência do balanceamento: dano por projétil, cadência, pente, reserva, recarga e desbloqueio.")
    cols = [("ID", 12, "L"), ("Arma", 31, "L"), ("Família", 25, "L"), ("Munição", 18, "L"),
            ("Dano", 10, "R"), ("RPM", 12, "R"), ("Pente", 10, "R"), ("Reserva", 13, "R"),
            ("Recarga", 13, "R"), ("Tática", 12, "R"), ("Prec.", 10, "R"), ("Mob.", 10, "R"),
            ("Desbloqueio", 22, "L"), ("Nota de design", pdf.cw - 198, "L")]
    rows = []
    for w in WEAPONS:
        rows.append([
            w["id"], w["nome"], familia_de(w["id"]), w["municao"], w["dano"], w["rpm"],
            w["pente"] or "—", w["reserva"] or "—",
            f'{w["recarga"]:.1f}s' if w["recarga"] else "overheat",
            f'{w["tatica"]:.1f}s' if w["tatica"] else "—",
            w["precisao"], w["mob"], w["unlock"], w["nota"],
        ])
    pdf.table(cols, rows, font=6.5, head_font=5.9, pad=1.1)

    pdf.chapter = "03 · Arsenal"


def s_recarga(pdf):
    pdf.chapter = "04 · Recarga"
    pdf.body_page()
    pdf.h1("04", "Sistema de recarga: 8 mecânicas",
           "A mecânica-assinatura do jogo: munição creditada no fim da animação, com checkpoints, e "
           "uma decisão disponível em todos os momentos.")

    for i, r in enumerate(RELOAD):
        self_h = pdf.get_y()
        risk = (r["risco"] or "").lower()
        rc = RED if risk.startswith("alto") else AMBER if risk.startswith("méd") else GREEN if risk.startswith("baixo") else MUTED
        blocks = [("Regra", r["regra"]), ("Quando usar", r["uso"])]
        body = "\n".join(f"{k}: {v}" for k, v in blocks)
        lines = pdf.n_lines(r["regra"], pdf.cw - 10, 4.0) + pdf.n_lines(r["uso"], pdf.cw - 10, 4.0)
        h = lines * 4.1 + 15
        pdf.ensure(h + 4)
        y = pdf.get_y()
        pdf.set_fill_color(*(PANEL if i % 2 == 0 else (248, 250, 254)))
        pdf.rect(pdf.l_margin, y, pdf.cw, h, style="F")
        pdf.set_fill_color(*rc)
        pdf.rect(pdf.l_margin, y, 1.8, h, style="F")
        pdf.set_xy(pdf.l_margin + 5, y + 3)
        pdf.set_font("Mono", "B", 7)
        pdf.set_text_color(*MUTED)
        pdf.cell(9, 4, f"{i+1:02d}")
        pdf.set_font("Sans", "B", 9.6)
        pdf.set_text_color(*INK)
        pdf.cell(0, 4, r["nome"], new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font("Mono", "", 6.6)
        pdf.set_text_color(*AMBER)
        pdf.cell(0, 4, f'  [{r["tecla"]}]', align="R", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_xy(pdf.l_margin + 5, y + 8)
        pdf.set_font("Mono", "", 6.9)
        pdf.set_text_color(*CYAN)
        risco_txt = f'  ·  risco {r["risco"]}' if r["risco"] else ""
        pdf.multi_cell(pdf.cw - 10, 3.8, f'{r["tempo"]}{risco_txt}',
                       new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_x(pdf.l_margin + 5)
        pdf.set_font("Sans", "", 8.2)
        pdf.set_text_color(*TXT)
        pdf.multi_cell(pdf.cw - 10, 4.0, r["regra"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_x(pdf.l_margin + 5)
        pdf.set_font("Sans", "", 8.0)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(pdf.cw - 10, 4.0, "▸ " + r["uso"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_y(y + h + 2.6)

    pdf.ln(4)
    pdf.h2("Máquina de estados da arma")
    pdf.code(
        "IDLE\n"
        " ├─ fire + munição > 0 .............. FIRE → IDLE\n"
        " ├─ fire + munição = 0 .............. EMPTY (clique seco, +0,15 s)\n"
        " ├─ R (pente > 0) .................. RELOAD_TACTICAL\n"
        " ├─ R (pente = 0) .................. RELOAD_FULL\n"
        " ├─ R R (duplo toque) .............. RELOAD_EMERGENCY\n"
        " ├─ troca de arma .................. SWAP (salva progresso 6 s)\n"
        " └─ calor 100% (energia) ........... OVERHEAT (1,8–2,6 s)\n"
        "\n"
        "RELOAD_*: checkpoints de animação\n"
        "  0.0 s — arma abaixa, som de pente saindo\n"
        "  0.6 s — pente novo entra   ◀ janela de recarga ativa\n"
        "  1.0 s — ferrolho / câmara\n"
        "  fim   — munição creditada AQUI (não no início)"
    )
    pdf.h2("Regras de ouro")
    pdf.bullets([
        "Munição entra no fim: cancelar após o checkpoint do pente concede a munição; antes, não.",
        "Tudo é cancelável, exceto a recarga de emergência (compromisso total).",
        "Progresso salvo por 6 s ao trocar de arma: recompensa a gestão dos dois slots.",
        "Feedback total: som único por arma, barra segmentada no HUD, 1 px de screen shake ao finalizar.",
        "Inimigos também recarregam — e essa é a janela de ataque do jogador.",
        "Sem recarga gratuita: nenhum perk zera o tempo.",
    ])


def s_inimigos(pdf):
    pdf.chapter = "05 · Bestiário"
    pdf.body_page()
    pdf.h1("05", "Bestiário: 50 inimigos",
           "Seis famílias em seis biomas. Todos têm telegrafia antes do dano alto e janela de vulnerabilidade clara.")
    fams = [("Infantaria", 12), ("Precisão", 8), ("Pesados / blindados", 8),
            ("Mutantes", 8), ("Drones", 8), ("Chefes", 6)]
    descr = {
        "Infantaria": "Corpo de base, pressão, cobertura, chamada de reforço",
        "Precisão": "Punem exposição, obrigam movimentação constante",
        "Pesados / blindados": "Rompem posição, exigem flanco ou explosivo",
        "Mutantes": "Pressão em espaço fechado, enxames, área negada",
        "Drones": "Suporte, marcação e negação de área",
        "Chefes": "Marcos de PvE e o chefe final com as 60 armas",
    }
    pdf.table([("Família", 42, "L"), ("Qtde", 14, "R"), ("Função", pdf.cw - 58, "L")],
              [(f, str(n), descr[f]) for f, n in fams], font=8)
    pdf.para("Cada ficha traz vida, dano, velocidade, bioma, comportamento de IA legível e fraqueza. "
             "RP é a recompensa em modo Sobrevivência.", size=8, color=MUTED)

    pdf.chapter = "05 · Bestiário completo"
    pdf.body_page(orientation="L", margins=(13, 17))
    pdf.h1("05b", "Bestiário completo",
           "Todos os 50 inimigos com vida, dano, velocidade, comportamento e fraqueza.")
    cols = [("ID", 12, "L"), ("Inimigo", 34, "L"), ("Família", 20, "L"), ("Bioma", 22, "L"),
            ("Vida", 9, "R"), ("Dano", 9, "R"), ("Velocidade", 24, "L"),
            ("Comportamento de IA", pdf.cw - 192, "L"), ("Fraqueza", 28, "L"), ("RP", 9, "R")]
    rows = [[e["id"], e["nome"], e["tipo"], e["bioma"], e["hp"], e["dano"],
             e["vel"], e["ia"], e["fraqueza"], e["rp"]] for e in ENEMIES]
    pdf.table(cols, rows, font=6.5, head_font=5.9, pad=1.1)

    pdf.chapter = "05 · Bestiário"


def s_ranque(pdf):
    pdf.chapter = "06 · Ranque"
    pdf.body_page()
    pdf.h1("06", "Ranqueamento",
           "Sete tiers, RP transparente e MMR escondido para matchmaking. O ranque mede habilidade — nunca tempo jogado.")

    # cards de tier
    for r in RANKS:
        pdf.ensure(14)
        y = pdf.get_y()
        col = tuple(int(r["cor"][i:i + 2], 16) for i in (1, 3, 5))
        rp = f'RP {r["rpMin"]}+' if r["rpMax"] is None else f'RP {r["rpMin"]}–{r["rpMax"]}'
        pdf.set_fill_color(*PANEL)
        pdf.rect(pdf.l_margin, y, pdf.cw, 13, style="F")
        pdf.set_fill_color(*col)
        pdf.rect(pdf.l_margin, y, 1.8, 13, style="F")
        pdf.set_xy(pdf.l_margin + 6, y + 2.4)
        pdf.set_font("Sans", "B", 9.6)
        pdf.set_text_color(*(INK if sum(col) < 520 else MUTED))
        pdf.cell(30, 4.6, r["tier"].upper())
        pdf.set_font("Mono", "", 6.8)
        pdf.set_text_color(*CYAN)
        pdf.cell(28, 4.6, rp)
        pdf.set_text_color(*MUTED)
        pdf.cell(30, 4.6, " · ".join(r["divisoes"]))
        pdf.set_font("Sans", "", 8.2)
        pdf.set_text_color(*TXT)
        pdf.multi_cell(pdf.cw - 92, 4.0, r["premio"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_y(y + 14.5)

    pdf.ln(3)
    pdf.h2("Fórmula")
    pdf.code("RP final = base(resultado) + desempenho + objetivo + bônus − penalidade\n"
             "         × multi(MMR)     // ±30% conforme a força dos adversários\n"
             "         × multi(tier)    // ajuste de curva por tier")
    pdf.h2("Tabela de RP")
    rp_rows = [
        ("Vitória", "+25"), ("Derrota", "−20"), ("Eliminação", "+2"),
        ("Assistência", "+1"), ("Objetivo / captura", "+5"), ("MVP da partida", "+8"),
        ("Sequência de 5 eliminações", "+3"), ("Bônus de dupla acima do MMR", "+10% (limitado)"),
        ("Abandono / AFK", "−30 e fila de 15 min"),
        ("Desempenho muito abaixo do MMR", "até −5 extra"),
    ]
    pdf.table([("Evento", pdf.cw - 55, "L"), ("RP", 55, "R")], rp_rows, font=8)
    pdf.h2("Regras competitivas")
    pdf.bullets([
        "Colocação: 5 partidas definem o tier inicial, com teto de Ouro III.",
        "Divisões: Bronze a Mestre têm III, II e I. Lendário é faixa única com leaderboard global.",
        "Proteção de divisão: duas derrotas protegidas logo após subir.",
        "Decaimento: a partir de Diamante, −25 RP por semana sem jogar (limite de 1 tier).",
        "Reset de temporada: suave, queda máxima de 1 tier e 5 partidas de recolocação.",
        "Antiabuso: MMR separado do RP; grupos com mais de 2 tiers de diferença bloqueados.",
        "Transparência: a tela pós-partida mostra a origem de cada ponto de RP.",
        "Recompensas: cosmético e acesso a torneios. Nunca vantagem competitiva.",
    ])


def s_biomas(pdf):
    pdf.chapter = "07 · Biomas e modos"
    pdf.body_page()
    pdf.h1("07", "Biomas e modos",
           "Seis biomas com identidade visual e leitura de gameplay próprias; quatro modos.")
    bio = [
        ("Docas", "Azul-aço, contêineres, água rasa, guindastes", "Verticalidade média, flanco pela água"),
        ("Ferro-Velho", "Ferrugem, sucata, corredores estreitos", "Emboscada, curta distância dominante"),
        ("Refinaria", "Laranja de fogo, tanques, passarelas", "Áreas abertas perigosas, explosões em cadeia"),
        ("Estufa", "Verde saturado, névoa de esporos", "Visibilidade curta, mutantes em enxame"),
        ("Cristal", "Violeta, reflexos, vãos verticais", "Precisão e luz revelam posições"),
        ("Órbita", "Branco-azulado, estação espacial", "Gravidade baixa em setores, simetria competitiva"),
    ]
    pdf.table([("Bioma", 28, "L"), ("Identidade visual", 78, "L"), ("Leitura de gameplay", pdf.cw - 106, "L")],
              bio, font=8)
    pdf.h2("Modos")
    pdf.bullets([
        "Escolta (5v5) — carga móvel em três pontos, respawn ativo.",
        "Domínio (5v5) — três zonas, placar por tempo.",
        "Eliminação (5v5) — rounds de 90 s, sem respawn.",
        "Sobrevivência (PvE) — 12 ondas usando o bestiário completo.",
    ])


def s_arte(pdf):
    pdf.chapter = "08 · Arte"
    pdf.body_page()
    pdf.h1("08", "Direção de arte 3D pixelada",
           "3D de verdade e pixel art de verdade: geometria low-poly, texturas pequenas, render interno "
           "em baixa resolução e zero suavização.")
    for i, a in enumerate(ART, 1):
        pdf.ensure(16)
        y = pdf.get_y()
        pdf.set_font("Mono", "B", 7)
        pdf.set_text_color(*PINK)
        pdf.cell(9, 4.2, f"{i:02d}")
        pdf.set_font("Sans", "B", 8.8)
        pdf.set_text_color(*INK)
        pdf.multi_cell(pdf.cw - 9, 4.2, a["titulo"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_x(pdf.l_margin + 9)
        pdf.set_font("Sans", "", 8.2)
        pdf.set_text_color(*TXT)
        pdf.multi_cell(pdf.cw - 9, 4.2, a["texto"], new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_draw_color(*LINE)
        pdf.set_line_width(0.15)
        pdf.line(pdf.l_margin + 9, pdf.get_y() + 1.2, pdf.w - pdf.r_margin, pdf.get_y() + 1.2)
        pdf.set_y(pdf.get_y() + 3.2)

    # ---- página de arte: tabela do que pode e do que não pode ----
    if pdf.h - pdf.b_margin - pdf.get_y() < 150:
        pdf.body_page()
    pdf.ln(2)
    pdf.h2("Pode / não pode")
    pares = [
        ("Render interno em 480×270 (ou 320×180) com upscale Point/Nearest; UI na resolução nativa em escala inteira.",
         "Motion blur, bloom pesado, TAA, aberração cromática ou grain de filme."),
        ("Texturas de 32×32 a 64×64, atlas único por bioma, paleta quantizada.",
         "Texturas acima de 128 px ou shading PBR realista."),
        ("Sombras em blocos, shadow map de 256–512 px, sem blur, três tons por material.",
         "Filtro bilinear no mundo, sombras suaves, reflexos realistas."),
        ("Animação stepped a 12–18 FPS para personagens e armas; câmera e movimento a 60 FPS.",
         "Interpolação suave nas animações, que quebra a leitura pixelada."),
        ("Partículas quadradas, hitmarker de 3 px, números de dano em fonte bitmap.",
         "HUD vetorial suave, blur de interface, ícones anti-aliasados."),
        ("Acessibilidade desde o primeiro commit: alto contraste, contorno configurável, escala de HUD, remapeamento de teclas.",
         "Esconder informação essencial só em áudio ou só em cor."),
    ]
    pdf.table([("Faça", pdf.cw / 2, "L"), ("Não faça", pdf.cw / 2, "L")],
              pares, font=7.6, pad=1.6)

    # ---- paleta ----
    pal = [("#10121a", (16, 18, 26)), ("#1d2233", (29, 34, 51)), ("#2c3550", (44, 53, 80)),
           ("#41507a", (65, 80, 122)), ("#5f79a8", (95, 121, 168)), ("#8fb3d9", (143, 179, 217)),
           ("#cfe4f2", (207, 228, 242)), ("#e8b93f", (232, 185, 63)), ("#d4623c", (212, 98, 60)),
           ("#8b3a3a", (139, 58, 58)), ("#3f8f6a", (63, 143, 106)), ("#ff6b8b", (255, 107, 139))]
    pdf.ensure(30)
    bw = pdf.cw / 12
    y = pdf.get_y()
    pdf.set_font("Sans", "B", 10.2)
    pdf.set_text_color(*INK)
    pdf.set_xy(pdf.l_margin, y)
    pdf.cell(0, 6, "Paleta base — bioma Docas", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    y = pdf.get_y() + 1.5
    pdf.set_auto_page_break(False)
    for i, (hexv, rgb) in enumerate(pal):
        x = pdf.l_margin + i * bw
        pdf.set_fill_color(*rgb)
        pdf.rect(x, y, bw, 11, style="F")
        pdf.set_xy(x, y + 12)
        pdf.set_font("Mono", "", 5.2)
        pdf.set_text_color(*MUTED)
        pdf.cell(bw, 3, hexv, align="C")
    pdf.set_auto_page_break(True, margin=20)
    pdf.set_y(y + 18)

    pdf.callout("Regra do orçamento de arte",
                "Um bioma inteiro deve caber em 24 cores, um atlas de textura e 40 mil triângulos na cena. "
                "Se não cabe, o problema é a escala do cenário, não a paleta. Essa restrição é o que faz o "
                "jogo parecer pixel art de 32 bits em vez de 3D com filtro de pixel por cima.",
                accent=PINK_L)


def s_tecnico(pdf):
    pdf.chapter = "09 · Áudio, UI e técnica"
    pdf.body_page()
    pdf.h1("09", "Áudio, UI e stack técnica",
           "O mínimo obrigatório para o jogo parecer finalizado: som informativo, HUD legível e dados separados da lógica.")
    pdf.h2("Áudio")
    pdf.bullets([
        "Tiro, recarga (pente saindo, pente entrando, ferrolho), passo, dano recebido, hitmarker, "
        "headshot e morte.",
        "Cada família de arma tem timbre próprio; a recarga é o som mais informativo do jogo — inimigo "
        "recarregando é oportunidade.",
        "Música por bioma em loop curto (chiptune/industrial), com camada extra nos últimos 60 s da partida.",
    ])
    pdf.h2("HUD")
    pdf.bullets([
        "Munição pente/reserva em fonte bitmap grande e barra segmentada de recarga com zona de timing ativo.",
        "Minimapa circular, indicador de ranque/RP, quatro slots de arma e ícone de calor nas armas de energia.",
        "Tela pós-partida com a origem de cada RP, MMR estimado e próximo tier.",
    ])
    pdf.h2("Stack e estrutura de projeto")
    pdf.para("Three.js + Vite (navegador primeiro, build desktop depois) ou Godot 4 com viewport 480×270 e "
             "filtro nearest. Armas e inimigos ficam em arquivos de conteúdo, fora da lógica.", size=8.4)
    pdf.code(
        "nucleo-zero/\n"
        "├─ index.html\n"
        "├─ src/\n"
        "│  ├─ main.js            # bootstrap, loop, cenas\n"
        "│  ├─ engine/            # render pixelado, input, áudio\n"
        "│  ├─ systems/\n"
        "│  │  ├─ weaponState.js  # máquina de estados + recarga\n"
        "│  │  ├─ damage.js\n"
        "│  │  ├─ ai.js           # comportamentos de inimigo\n"
        "│  │  └─ rank.js         # RP/MMR (funções puras + testes)\n"
        "│  ├─ data/\n"
        "│  │  ├─ weapons.js      # 60 armas\n"
        "│  │  ├─ enemies.js      # 50 inimigos\n"
        "│  │  └─ maps.js         # 6 biomas × 2 mapas\n"
        "│  ├─ ui/                # HUD pixelado, menus, tela de ranque\n"
        "│  └─ art/               # modelos low-poly, texturas 32–64 px\n"
        "└─ tests/"
    )
    pdf.h2("Performance")
    pdf.bullets([
        "Um draw call por material compartilhado e atlas único por bioma.",
        "IA com atualização em LOD (longe = 4 Hz) e limite de 20 inimigos ativos na cena de teste.",
        "Meta: 60 FPS com 20 inimigos simultâneos, em 480×270 com upscale.",
    ])


def s_fases(pdf):
    pdf.chapter = "10 · Fases"
    pdf.body_page()
    pdf.h1("10", "Entrega em fases",
           "Cinco entregas, cada uma rodando ao final. Nada de projeto que só funciona no último dia.")
    fases = [
        ("Fase 1 — Fundação jogável",
         "Projeto, cena de tiro ao alvo, movimentação, 3 armas (Bandeirante, Berrante, Sabiá) e HUD mínimo.",
         "Atirar, matar alvo, recarregar e trocar de arma funcionam a 60 FPS."),
        ("Fase 2 — Recarga completa",
         "As 8 mecânicas, máquina de estados com checkpoints, animação e som por família, barra com timing ativo.",
         "Cancelar após o checkpoint concede munição; antes, não. Recarga tática vale +1. Overheat funciona."),
        ("Fase 3 — Ranque",
         "Módulo rank.js testável, tiers, divisões, colocações, decaimento, tela de progresso e pós-partida.",
         "Todos os eventos da tabela alteram o RP como especificado; tier atualiza em tempo real; testes verdes."),
        ("Fase 4 — Conteúdo",
         "As 60 armas e os 50 inimigos vindos de dados, galeria navegável, 2 mapas de Docas e ondas de Sobrevivência.",
         "Galeria lista 60/50; cada inimigo tem comportamento próprio e telegrafia; spawn por bioma."),
        ("Fase 5 — Arte e polimento",
         "Passe de arte 3D pixelada nos 6 biomas, feedback de impacto, acessibilidade, áudio completo e 5v5 em Escolta.",
         "Render interno 480×270 verificável, paleta limitada, sombras em blocos, acessibilidade funcionando."),
    ]
    for titulo, entrega, aceite in fases:
        pdf.ensure(30)
        y = pdf.get_y()
        pdf.set_fill_color(*PANEL)
        pdf.rect(pdf.l_margin, y, pdf.cw, 2)
        pdf.set_y(y + 4)
        pdf.set_font("Sans", "B", 9.8)
        pdf.set_text_color(*INK)
        pdf.cell(0, 5, titulo, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("Sans", "", 8.2)
        pdf.set_text_color(*TXT)
        pdf.multi_cell(pdf.cw, 4.2, "Entregar: " + entrega, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_font("Sans", "", 8.2)
        pdf.set_text_color(*GREEN)
        pdf.multi_cell(pdf.cw, 4.2, "Aceite: " + aceite, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(3)


def s_restricoes(pdf):
    pdf.chapter = "11 · Restrições"
    pdf.body_page()
    pdf.h1("11", "Restrições",
           "O que não fazer. Cada item aqui evita um erro clássico de escopo ou de design.")
    items = [
        "Não usar assets realistas, PBR ou pós-processamento pesado.",
        "Não criar arma boa em tudo nem reskin com números maiores.",
        "Não transformar ranque em XP por tempo jogado.",
        "Não vender vantagem competitiva.",
        "Não usar recarga como tempo morto: sempre deve existir uma decisão.",
        "Não deixar inimigo sem telegrafia.",
        "Não esconder informação essencial só em efeito sonoro (jogo acessível).",
        "Não usar loot box com conteúdo que altere gameplay.",
    ]
    pdf.bullets(items, mark="×", mark_color=RED, size=8.8, lh=4.4)


def s_short(pdf):
    pdf.chapter = "12 · Prompt curto"
    pdf.body_page()
    pdf.h1("12", "Prompt curto (copiar e colar)",
           "Versão compacta para chats que limitam tamanho. A versão longa está nas seções 01 a 11.")
    pdf.code(
        "Crie um FPS 3D em pixel art chamado NÚCLEO ZERO. 3D low-poly com render interno em\n"
        "480x270 e upscale nearest-neighbor, 60 FPS, 5v5 competitivo.\n"
        "\n"
        "Obrigatório:\n"
        "1. 60 armas em 9 famílias, cada uma com dano, RPM, pente, reserva, recarga completa,\n"
        "   recarga tática, precisão, mobilidade, alcance, recuo e desbloqueio por ranque.\n"
        "   Nenhuma arma domina todas as faixas.\n"
        "2. 8 mecânicas de recarga: completa, tática (+1 na câmara, 25% mais rápida), emergência\n"
        "   (descarta o pente), timing ativo (janela de 0,25s = -25% tempo e +15% cadência por\n"
        "   3s), cancelamento por troca (progresso salvo por 6s), velocidade por classe, overheat\n"
        "   para armas de energia e recarga bago a bago para escopetas/revólveres. Munição\n"
        "   creditada no fim da animação, com checkpoints. Animação e som próprios por arma.\n"
        "3. 50 inimigos em 6 famílias (12 infantaria, 8 precisão, 8 pesados, 8 mutantes, 8 drones,\n"
        "   6 chefes), com IA legível, telegrafia e fraqueza. Um chefe final usa as 60 armas.\n"
        "4. Ranque com 7 tiers (Bronze, Prata, Ouro, Platina, Diamante, Mestre, Lendário), divisões\n"
        "   III/II/I até Mestre, RP por kill/assist/objetivo/MVP/resultado, 5 partidas de colocação,\n"
        "   MMR escondido, decaimento a partir de Diamante, proteção de divisão e reset suave.\n"
        "5. 6 biomas e 4 modos (Escolta, Domínio, Eliminação, Sobrevivência PvE).\n"
        "\n"
        "Arte: paleta de 24 cores por bioma, texturas 32-64px, iluminação flat com vertex color,\n"
        "sombras em blocos, animação stepped a 12-18 FPS, partículas quadradas, hitmarker de 3px,\n"
        "HUD pixelado. Sem motion blur, sem bloom, sem filtro bilinear. Acessibilidade desde o\n"
        "primeiro commit.\n"
        "\n"
        "Stack: Three.js + Vite (ou Godot 4), dados de armas/inimigos em arquivos de conteúdo,\n"
        "rank.js como módulo testável, 60 FPS com 20 inimigos na cena de teste.\n"
        "\n"
        "Entregue em fases rodando ao final de cada uma:\n"
        "1) fundação + 3 armas + tiro ao alvo; 2) recarga completa; 3) ranque; 4) 60 armas e\n"
        "50 inimigos; 5) arte pixelada, áudio e polimento.",
        size=6.6, lh=3.3,
    )
    pdf.ln(2)
    pdf.callout("Próximo passo",
                "Entregue este PDF junto com o arquivo data.js ao agente de código e comece pela Fase 1. "
                "A cada fase, cobre o critério de aceite antes de seguir — é o que impede o projeto de "
                "virar uma demo que nunca fecha.", accent=AMBER_L)


def render(known=None, record=False):
    pdf = Doc()
    pdf.record_toc = record
    cover(pdf)
    toc(pdf, known)
    for fn in (s_contexto, s_pilares, s_armas, s_recarga, s_inimigos, s_ranque,
               s_biomas, s_arte, s_tecnico, s_fases, s_restricoes, s_short):
        fn(pdf)
    return pdf


if __name__ == "__main__":
    probe = render(record=True)          # passagem 1: coleta as páginas das seções
    pages = dict(probe.toc_pages)
    final = render(known=pages)          # passagem 2: sumário preenchido
    final.output(OUT)
    print(f"OK -> {OUT}  ({final.page_no()} paginas, {os.path.getsize(OUT)/1024:.0f} KB)")
