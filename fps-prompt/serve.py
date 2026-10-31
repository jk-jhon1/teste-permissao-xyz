#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Servidor estático do pacote NÚCLEO ZERO, com download forçado do PDF.

  python3 serve.py            # porta 8000 em 0.0.0.0
  /download                   → baixa o PDF (Content-Disposition: attachment)
  /zip                        → baixa o ZIP com o PDF + todo o pacote
  /NUCLEO-ZERO-pacote.zip     → idem, direto pelo nome do arquivo

Feito para o ambiente de preview (o browser do usuário está fora do sandbox,
então nada de localhost: o servidor só devolve os arquivos deste diretório).
"""
import os
import posixpath
import urllib.parse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
PDF = "NUCLEO-ZERO-prompt.pdf"
ZIP = "NUCLEO-ZERO-pacote.zip"
PORT = int(os.environ.get("PORT", 8000))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    # ------------------------------------------------ rotas
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = urllib.parse.unquote(posixpath.basename(parsed.path))
        query = urllib.parse.parse_qs(parsed.query)

        def flag(*names):
            return any(n in query for n in names)

        # ZIP primeiro (nome do arquivo, /zip ou ?zip)
        if path == ZIP or parsed.path.rstrip("/") in ("/zip", "/baixar-zip") or flag("zip"):
            return self.send_file(ZIP, "application/zip", attachment=True)

        # PDF
        if path == PDF or parsed.path.rstrip("/") in ("/download", "/baixar") or flag("download", "baixar"):
            return self.send_file(PDF, "application/pdf", attachment=True)

        return super().do_GET()

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        name = urllib.parse.unquote(posixpath.basename(parsed.path))
        route = parsed.path.rstrip("/")
        if name == ZIP or route in ("/zip", "/baixar-zip"):
            self.send_file(ZIP, "application/zip", attachment=True, head_only=True)
            return
        if name == PDF or route in ("/download", "/baixar", ""):
            self.send_file(PDF, "application/pdf", attachment=True, head_only=True)
            return
        return super().do_HEAD()

    # ------------------------------------------------ arquivos
    def send_file(self, filename, ctype, attachment=True, head_only=False):
        full = os.path.join(ROOT, filename)
        if not os.path.exists(full):
            self.send_error(404, f"{filename} não encontrado")
            return
        size = os.path.getsize(full)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        disp = "attachment" if attachment else "inline"
        self.send_header("Content-Disposition", f'{disp}; filename="{filename}"')
        self.send_header("Content-Length", str(size))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        if head_only:
            return
        with open(full, "rb") as f:
            while chunk := f.read(64 * 1024):
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return

    # logs mais limpos
    def log_message(self, fmt, *args):
        print("%s - %s" % (self.address_string(), fmt % args), flush=True)


if __name__ == "__main__":
    os.chdir(ROOT)
    srv = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"NÚCLEO ZERO em http://0.0.0.0:{PORT}  (ZIP: /zip · PDF: /download)", flush=True)
    srv.serve_forever()
