# Maklyn/Jhon Dashboard — Investigação Interativa

Dashboard demonstrativo para a Fase 2 · Nível 3 da Maratona Tech 2026. O projeto transforma os requisitos do guia em uma investigação interativa: tema, pergunta, hipótese testável, variáveis, dois gráficos complementares, filtro por série, conclusão baseada nos dados e verificação crítica da leitura da IA.

## Executar

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Não há dependências ou build.

## Questionário e salvamento permanente no Google Planilhas

A planilha de respostas foi criada aqui: [Maklyn/Jhon Dashboard — Respostas da Pesquisa](https://docs.google.com/spreadsheets/d/1zLpRhCdzw2Rum7NoRF-qyIsRy0uDqurJXy9Lbiu4yAo/edit). O formulário só salva permanentemente depois de configurar e publicar o endpoint do Apps Script:

1. Abra a planilha e selecione **Extensões → Apps Script**.
2. Copie o conteúdo de `google-apps-script/Code.gs` para o editor e salve o projeto.
3. Selecione **Implantar → Nova implantação → App da Web**. Execute como sua conta e permita acesso de pessoas com o link (**Qualquer pessoa**), para que os estudantes possam responder sem editar a planilha.
4. Autorize o script e copie a URL da implantação que termina em `/exec`.
5. Cole essa URL em `config.js`, na variável `window.MAKLYN_APPS_SCRIPT_URL`.
6. Publique novamente o site. Faça um envio de teste e confirme que uma nova linha apareceu na aba **Respostas**.

O Apps Script grava cinco campos anônimos e não coleta nome, e-mail, telefone ou texto livre. A implantação pública permite enviar respostas e ler somente esses campos anônimos; mantenha a própria planilha privada e não coloque dados pessoais nela. Não publique a URL do Apps Script antes de revisar o aviso de consentimento. Até configurar o endpoint, o formulário informa que o envio está desativado e nenhum dado é salvo pelo site.

## Dados e rigor da investigação

O dashboard vem com **56 respostas sintéticas, apenas para demonstração**. Elas não são respostas de pessoas reais e não devem ser apresentadas como pesquisa concluída. Para cumprir a coleta descrita no guia, obtenha pelo menos 20 respostas reais com consentimento, sem nome/e-mail/telefone e sem coletar dados desnecessários. Depois, use **Importar CSV** para carregar as respostas anônimas.

O CSV deve conter exatamente estas colunas: `serie,verificou_fonte,identificou_sinais,acao`. Valores aceitos:

- `serie`: `1ª série`, `2ª série` ou `3ª série` (também aceita `1`, `2`, `3`)
- `verificou_fonte`: `Sim` ou `Não`
- `identificou_sinais`: `Sim` ou `Não`
- `acao`: `Conferir a fonte`, `Perguntar a alguém`, `Não compartilhar` ou `Compartilhar`

O envio do questionário usa o Apps Script configurado em `config.js` para gravar as respostas na planilha. A importação de CSV continua local e substitui os dados do dashboard apenas durante a sessão. Verifique e remova qualquer informação pessoal antes de importar. O aviso de consentimento aparece junto ao formulário.

## Estrutura

- `index.html` — conteúdo semântico da investigação
- `styles.css` — layout responsivo e identidade visual
- `app.js` — filtro, importação de dados, gráficos SVG e conclusões dinâmicas

## Zona de Conflito — FPS de sobrevivência (`fps.html`)

Jogo de tiro em primeira pessoa com arena de sobrevivência por ondas, construído em Three.js (vendido em `vendor/three.module.js`, sem dependências externas). Abra `fps.html` no navegador ou sirva a pasta com qualquer servidor estático.

### Recursos

- **60 armas** (pistolas, submetralhadoras, espingardas, fuzis de assalto, snipers e metralhadoras) com dano, cadência, carregador, munição de reserva, dispersão, recuo, raridade, preço e nível de desbloqueio próprios.
- **Sistema de recarga**: pressione **R** para recarregar; a arma fica indisponível durante o tempo de recarga e recarrega automaticamente quando o carregador esvazia ao atirar.
- **50 tipos de inimigos** em 5 tiers (zumbis, cães robóticos, drones, ciborgues, demônios, chefes…) que escalam vida, velocidade e dano conforme a onda avança.
- **Ranqueamento**: elimine inimigos para ganhar XP e dinheiro, suba de nível e avance nas patentes (Ferro → Desafiante). O progresso (armas compradas, dinheiro, patente, nível) fica salvo no `localStorage`.
- **Loadout**: compre e equipe até 6 armas nos slots 1–6.
- **Controles**: WASD mover · Shift correr · Espaço pular · Mouse mirar e atirar · R recarregar · 1–6 trocar arma · ESC pausa.

### Executar

Abra `fps.html` diretamente ou sirva a repo, por exemplo:

```
python3 -m http.server 8765 --bind 0.0.0.0
# então acesse http://localhost:8765/fps.html
```
