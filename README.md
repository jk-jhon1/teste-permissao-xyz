# Maklyn/Jhon Dashboard — Investigação Interativa

Dashboard demonstrativo para a Fase 2 · Nível 3 da Maratona Tech 2026. O projeto transforma os requisitos do guia em uma investigação interativa: tema, pergunta, hipótese testável, variáveis, dois gráficos complementares, filtro por série, conclusão baseada nos dados e verificação crítica da leitura da IA.

## Executar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências ou build.

## Dados e rigor da investigação

O dashboard vem com **56 respostas sintéticas, apenas para demonstração**. Elas não são respostas de pessoas reais e não devem ser apresentadas como pesquisa concluída. Para cumprir a coleta descrita no guia, obtenha pelo menos 20 respostas reais com consentimento, sem nome/e-mail/telefone e sem coletar dados desnecessários. Depois, use **Importar CSV** para carregar as respostas anônimas.

O CSV deve conter exatamente estas colunas: `serie,verificou_fonte,identificou_sinais,acao`. Valores aceitos:

- `serie`: `1ª série`, `2ª série` ou `3ª série` (também aceita `1`, `2`, `3`)
- `verificou_fonte`: `Sim` ou `Não`
- `identificou_sinais`: `Sim` ou `Não`
- `acao`: `Conferir a fonte`, `Perguntar a alguém`, `Não compartilhar` ou `Compartilhar`

A página não envia dados para nenhum servidor: o CSV é lido localmente no navegador e os dados ficam apenas na sessão atual. Verifique e remova qualquer informação pessoal antes da importação. O texto de consentimento sugerido está no próprio dashboard.

## Estrutura

- `index.html` — conteúdo semântico da investigação
- `styles.css` — layout responsivo e identidade visual
- `app.js` — filtro, importação de dados, gráficos SVG e conclusões dinâmicas
