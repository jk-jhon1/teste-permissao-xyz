const sampleData = [
  ['1ª série','Sim','Sim','Conferir a fonte'],['1ª série','Sim','Sim','Não compartilhar'],['1ª série','Sim','Sim','Perguntar a alguém'],['1ª série','Sim','Não','Conferir a fonte'],['1ª série','Sim','Sim','Conferir a fonte'],['1ª série','Sim','Sim','Não compartilhar'],['1ª série','Sim','Não','Perguntar a alguém'],['1ª série','Sim','Sim','Conferir a fonte'],
  ['1ª série','Não','Não','Compartilhar'],['1ª série','Não','Sim','Perguntar a alguém'],['1ª série','Não','Não','Compartilhar'],['1ª série','Não','Não','Não compartilhar'],['1ª série','Não','Sim','Conferir a fonte'],['1ª série','Não','Não','Compartilhar'],['1ª série','Não','Não','Perguntar a alguém'],['1ª série','Não','Sim','Não compartilhar'],
  ['2ª série','Sim','Sim','Conferir a fonte'],['2ª série','Sim','Sim','Perguntar a alguém'],['2ª série','Sim','Não','Conferir a fonte'],['2ª série','Sim','Sim','Não compartilhar'],
  ['2ª série','Não','Não','Compartilhar'],['2ª série','Não','Não','Perguntar a alguém'],
  ['3ª série','Sim','Sim','Conferir a fonte'],['3ª série','Não','Sim','Não compartilhar'],
  // Registros sintéticos extras para demonstrar a variação nos filtros e gráficos.
  ['1ª série','Sim','Sim','Não compartilhar'],['1ª série','Sim','Sim','Conferir a fonte'],['1ª série','Sim','Não','Perguntar a alguém'],['1ª série','Sim','Sim','Perguntar a alguém'],['1ª série','Sim','Sim','Não compartilhar'],
  ['1ª série','Não','Não','Compartilhar'],['1ª série','Não','Não','Perguntar a alguém'],['1ª série','Não','Sim','Não compartilhar'],['1ª série','Não','Não','Compartilhar'],['1ª série','Não','Não','Conferir a fonte'],
  ['2ª série','Sim','Sim','Conferir a fonte'],['2ª série','Sim','Sim','Não compartilhar'],['2ª série','Sim','Sim','Perguntar a alguém'],['2ª série','Sim','Não','Conferir a fonte'],['2ª série','Sim','Sim','Não compartilhar'],['2ª série','Sim','Sim','Conferir a fonte'],
  ['2ª série','Não','Não','Compartilhar'],['2ª série','Não','Sim','Perguntar a alguém'],['2ª série','Não','Não','Compartilhar'],['2ª série','Não','Não','Não compartilhar'],['2ª série','Não','Sim','Conferir a fonte'],
  ['3ª série','Sim','Sim','Conferir a fonte'],['3ª série','Sim','Sim','Perguntar a alguém'],['3ª série','Sim','Não','Não compartilhar'],['3ª série','Sim','Sim','Conferir a fonte'],['3ª série','Sim','Sim','Não compartilhar'],['3ª série','Sim','Sim','Perguntar a alguém'],
  ['3ª série','Não','Não','Compartilhar'],['3ª série','Não','Sim','Não compartilhar'],['3ª série','Não','Não','Perguntar a alguém'],['3ª série','Não','Não','Compartilhar'],['3ª série','Não','Sim','Conferir a fonte']
].map(([serie,verificou_fonte,identificou_sinais,acao])=>({serie,verificou_fonte,identificou_sinais,acao}));

const ACTIONS = ['Conferir a fonte','Perguntar a alguém','Não compartilhar','Compartilhar'];
const ACTION_COLORS = ['#20d1c1','#158cff','#ffd05a','#59677e'];
let data = sampleData;
let isRealData = false;
let toastTimer;
const $ = (selector) => document.querySelector(selector);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = (n,d) => d ? Math.round((n/d)*100) : 0;
const selectedGrade = () => $('#grade-filter').value;
const currentRows = () => data.filter(row => selectedGrade()==='todas' || row.serie===selectedGrade());
const rate = (rows, field, value) => { const group=rows.filter(r=>r.verificou_fonte===value); return {n:group.length, yes:group.filter(r=>r[field]==='Sim').length}; };
const fmtRate = (n,d) => d ? `${pct(n,d)}%` : '—';
const endpoint = () => String(window.MAKLYN_APPS_SCRIPT_URL || '').trim();
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3200)}

function renderComparison(rows){
  const groups=[{label:'Verificaram fonte',value:'Sim',color:'#158cff'},{label:'Não verificaram',value:'Não',color:'#34435a'}];
  const width=520,height=208,left=50,right=18,top=18,bottom=51,plotW=width-left-right,plotH=height-top-bottom;
  if(!rows.length){$('#comparison-chart').innerHTML='<div class="empty-chart">Sem respostas para este filtro.</div>';return}
  let svg=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Proporção que identificou sinais de manipulação, comparando estudantes que verificaram a fonte e estudantes que não verificaram.">`;
  [0,25,50,75,100].forEach(v=>{const y=top+plotH-(v/100)*plotH;svg+=`<line x1="${left}" y1="${y}" x2="${width-right}" y2="${y}" stroke="#26344a" stroke-width="1"/><text x="${left-9}" y="${y+3}" text-anchor="end" fill="#77869b" font-size="19" font-family="DM Mono,monospace">${v}%</text>`});
  const centers=[left+plotW*.31,left+plotW*.73],barW=72;
  groups.forEach((g,i)=>{
    const result=rate(rows,'identificou_sinais',g.value), yesPct=pct(result.yes,result.n),x=centers[i]-barW/2,y=top+plotH-(yesPct/100)*plotH,h=(yesPct/100)*plotH;
    svg+=`<rect x="${x}" y="${top}" width="${barW}" height="${plotH}" rx="4" fill="#28364b"/>`;
    if(h>0)svg+=`<rect x="${x}" y="${y}" width="${barW}" height="${h}" rx="4" fill="${g.color}" opacity=".94"/>`;
    svg+=`<text x="${centers[i]}" y="${Math.max(22,y-8)}" text-anchor="middle" fill="#f0f5fc" font-size="19" font-weight="700" font-family="DM Sans,sans-serif">${result.n?yesPct+'%':'—'}</text>`;
    svg+=`<text x="${centers[i]}" y="${height-32}" text-anchor="middle" fill="#aab7c9" font-size="21" font-family="DM Sans,sans-serif">${esc(g.label)}</text>`;
    svg+=`<text x="${centers[i]}" y="${height-8}" text-anchor="middle" fill="#718198" font-size="19" font-family="DM Mono,monospace">n = ${result.n}</text>`;
  });
  svg+='</svg>';$('#comparison-chart').innerHTML=svg;
}
function renderActions(rows){
  const chart=$('#action-chart'),legend=$('#action-legend');
  if(!rows.length){chart.innerHTML='<div class="empty-chart">Sem respostas para este filtro.</div>';legend.innerHTML='';return}
  const values=ACTIONS.map((action,i)=>({action,i,count:rows.filter(r=>r.acao===action).length}));
  const width=540,height=194,left=210,right=40,top=15,rowH=42,barH=18,barW=width-left-right,max=Math.max(1,...values.map(v=>v.count));
  let svg=`<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Distribuição das primeiras ações diante de um vídeo suspeito, em ${rows.length} respostas.">`;
  values.forEach((v,i)=>{const y=top+i*rowH,w=(v.count/Math.max(rows.length,max))*barW,percent=pct(v.count,rows.length);svg+=`<text x="${left-10}" y="${y+16}" text-anchor="end" fill="#aab7c9" font-size="21" font-family="DM Sans,sans-serif">${esc(v.action)}</text>`;svg+=`<rect x="${left}" y="${y}" width="${barW}" height="${barH}" rx="3" fill="#25334a"/>`;if(v.count)svg+=`<rect x="${left}" y="${y}" width="${Math.max(4,w)}" height="${barH}" rx="3" fill="${ACTION_COLORS[v.i]}"/>`;svg+=`<text x="${width-4}" y="${y+15}" text-anchor="end" fill="#dce5f1" font-size="21" font-family="DM Mono,monospace">${percent}%</text>`});
  svg+='</svg>';chart.innerHTML=svg;
  legend.innerHTML=values.map(v=>`<span><i style="background:${ACTION_COLORS[v.i]}"></i>${esc(v.action)} · ${v.count}</span>`).join('');
}
function renderMetrics(rows){
  const total=rows.length,detected=rows.filter(r=>r.identificou_sinais==='Sim').length,yes=rate(rows,'identificou_sinais','Sim'),no=rate(rows,'identificou_sinais','Não');
  const gap= yes.n&&no.n ? pct(yes.yes,yes.n)-pct(no.yes,no.n):null;
  $('#metric-total').innerHTML=`${total}<span> respostas</span>`;
  $('#metric-total-note').textContent= isRealData?'No conjunto recebido':'Amostra demonstrativa';
  $('#metric-detect').innerHTML=`${fmtRate(detected,total)}<span> do grupo</span>`;
  $('#metric-gap').innerHTML=`${gap===null?'—':`${gap>0?'+':''}${gap}`}<span> p.p.</span>`;
  $('#metric-grades').innerHTML=`${new Set(rows.map(r=>r.serie)).size}<span> ${new Set(rows.map(r=>r.serie)).size===1?'série':'séries'}</span>`;
}
function renderInterpretation(rows){
  const y=rate(rows,'identificou_sinais','Sim'),n=rate(rows,'identificou_sinais','Não');
  const yesP=y.n?pct(y.yes,y.n):0,noP=n.n?pct(n.yes,n.n):0,gap=yesP-noP;
  const scope=selectedGrade()==='todas'?'no recorte atual':`na ${selectedGrade()}`;
  const suffix=isRealData?'':' nesta amostra sintética';
  if(!rows.length){
    $('#finding-status').innerHTML='<span class="status-dot"></span> SEM DADOS NO RECORTE';
    $('#finding-title').textContent='Não há respostas para este filtro.';$('#finding-text').textContent='Escolha outra série ou importe um CSV válido para explorar as evidências.';$('#comparison-insight').innerHTML='<span class="insight-arrow">↗</span><span>Sem dados suficientes para comparar os grupos.</span>';$('#ai-reading').textContent='Não há dados neste recorte para produzir uma leitura.';$('#ai-support').textContent='Selecione outra série ou importe respostas.';$('#finding-footnote').textContent='NENHUMA RESPOSTA NO FILTRO';return;
  }
  let status,title,text,trend;
  if(!y.n||!n.n){status='COMPARAÇÃO INCOMPLETA';title='Ainda não dá para comparar os dois grupos.';text=`${y.n?'Há respostas de quem verificou a fonte, mas nenhuma de quem não verificou.':'Há respostas de quem não verificou a fonte, mas nenhuma de quem verificou.'} Amplie a coleta para testar a hipótese ${scope}.`;trend='Um dos grupos não tem respostas neste recorte.';}
  else if(rows.length<5){status='AMOSTRA MUITO PEQUENA';title='Um sinal inicial — ainda sem base para concluir.';text=`Neste recorte (${rows.length} ${rows.length===1?'resposta':'respostas'}), ${yesP}% de quem verificou a fonte e ${noP}% de quem não verificou identificaram sinais. O número de respostas é baixo demais para sustentar uma conclusão.`;trend=`${yesP}% vs. ${noP}% identificaram sinais, mas o recorte tem apenas ${rows.length} respostas.`;}
  else if(gap>5){status='HIPÓTESE APOIADA';title='Neste recorte, verificar a fonte acompanha mais identificação de sinais.';text=`${yesP}% de quem verificou a fonte identificou sinais, contra ${noP}% de quem não verificou — diferença de ${gap} pontos percentuais ${scope}${suffix}. O padrão apoia a hipótese, mas não prova que verificar a fonte causou essa diferença.`;trend=`Grupo que verificou a fonte: ${yesP}% identificaram sinais (${y.yes}/${y.n}); grupo que não verificou: ${noP}% (${n.yes}/${n.n}).`;}
  else if(gap< -5){status='HIPÓTESE NÃO APOIADA';title='Neste recorte, o padrão observado vai contra a hipótese.';text=`${noP}% de quem não verificou a fonte identificou sinais, contra ${yesP}% de quem verificou. A diferença de ${Math.abs(gap)} pontos percentuais ${scope} não apoia a aposta inicial. Refutar uma hipótese também é resultado científico.`;trend=`O grupo que não verificou a fonte identificou mais sinais: ${noP}% vs. ${yesP}%.`}
  else{status='RESULTADO INCONCLUSIVO';title='Os grupos ficaram próximos neste recorte.';text=`${yesP}% de quem verificou e ${noP}% de quem não verificou identificaram sinais: diferença de apenas ${Math.abs(gap)} pontos percentuais ${scope}. A hipótese não foi claramente confirmada nem refutada pelos dados disponíveis.`;trend=`Diferença de ${Math.abs(gap)} p.p. entre os grupos; resultado inconclusivo.`;}
  $('#finding-status').innerHTML=`<span class="status-dot"></span> ${status}`;$('#finding-title').textContent=title;$('#finding-text').textContent=text;$('#finding-footnote').textContent=`CONCLUSÃO ATUALIZADA · ${rows.length} RESPOSTAS`;
  $('#comparison-insight').innerHTML=`<span class="insight-arrow">↗</span><span>${esc(trend)}</span>`;
  $('#ai-reading').textContent=`${y.n&&n.n?`Estudantes que verificaram a fonte identificaram sinais em ${yesP}% dos casos observados, enquanto o grupo que não verificou identificou em ${noP}%. ${gap>5?'Isso é compatível com a hipótese de associação.':gap< -5?'O padrão observado não acompanha a hipótese inicial.':'A diferença é pequena e não aponta uma associação clara.'}`:'O filtro atual não contém os dois grupos necessários para comparar a hipótese.'} ${isRealData?'Esta é uma leitura exploratória do conjunto recebido.':'Lembre-se: os registros exibidos são sintéticos, criados apenas para demonstrar a visualização.'}`;
  $('#ai-support').textContent=y.n&&n.n?`No recorte, ${y.yes} de ${y.n} que verificaram a fonte e ${n.yes} de ${n.n} que não verificaram identificaram sinais. A diferença observada é de ${Math.abs(gap)} p.p.`:'Precisamos observar os dois grupos — quem verificou e quem não verificou — para comparar as proporções.';
}
function update(){const rows=currentRows();renderMetrics(rows);renderComparison(rows);renderActions(rows);renderInterpretation(rows);}

function fetchSavedResponses(){
  const base=endpoint();
  if(!base)return Promise.resolve(null);
  return new Promise(resolve=>{
    const callbackName='__maklynReceiveResponses';
    const script=document.createElement('script');
    let finished=false;
    const finish=rows=>{if(finished)return;finished=true;delete window[callbackName];script.remove();resolve(Array.isArray(rows)?rows:null)};
    window[callbackName]=rows=>{
      const clean=Array.isArray(rows)?rows.filter(row=>row&&['1ª série','2ª série','3ª série'].includes(row.serie)&&['Sim','Não'].includes(row.verificou_fonte)&&['Sim','Não'].includes(row.identificou_sinais)&&ACTIONS.includes(row.acao)):[];
      if(clean.length){data=clean;isRealData=true;$('#dataset-title').textContent='Respostas recebidas';$('#dataset-description').textContent=`${clean.length} respostas anônimas salvas na planilha`;update();}
      finish(clean);
    };
    script.onerror=()=>finish(null);
    const url=new URL(base);url.searchParams.set('action','list');url.searchParams.set('callback',callbackName);url.searchParams.set('v',Date.now());
    script.src=url.toString();document.head.appendChild(script);
    setTimeout(()=>finish(null),12000);
  });
}

$('#grade-filter').addEventListener('change',update);
$('#survey-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const status=$('#survey-status'),button=$('.survey-submit'),form=event.currentTarget,formData=new FormData(form);
  if(String(formData.get('website')||'').trim())return;
  const url=endpoint();
  if(!url){status.textContent='Envio ainda não ativado. O responsável precisa publicar o Apps Script e configurar config.js.';status.classList.add('error');return;}
  status.classList.remove('error','success');status.textContent='Enviando sua resposta…';button.disabled=true;
  const payload=new URLSearchParams();
  ['serie','verificou_fonte','identificou_sinais','acao','consentimento','website'].forEach(key=>payload.set(key,String(formData.get(key)||'')));
  try{
    await fetch(url,{method:'POST',mode:'no-cors',body:payload,redirect:'follow'});
    status.textContent='Resposta enviada. Obrigado por participar!';status.classList.add('success');form.reset();
    setTimeout(()=>fetchSavedResponses(),1200);
  }catch(error){status.textContent='Não foi possível enviar. Confira a conexão e tente novamente.';status.classList.add('error');}
  finally{button.disabled=false;}
});
$('#csv-input').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const text=await file.text();const parsed=parseCSV(text);data=parsed;isRealData=true;$('#dataset-title').textContent=file.name;$('#dataset-description').textContent=`${parsed.length} registros importados nesta sessão · confira anonimização e origem real`;update();showToast(`${parsed.length} registros carregados. Para a pesquisa, use 20+ respostas reais e anônimas.`)}catch(err){showToast(err.message)}finally{event.target.value=''}});
$('#download-csv').addEventListener('click',()=>{const rows=currentRows();const csv=['serie,verificou_fonte,identificou_sinais,acao',...rows.map(r=>[r.serie,r.verificou_fonte,r.identificou_sinais,r.acao].map(v=>`"${v.replaceAll('"','""')}"`).join(','))].join('\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));link.download='dados-anonimos-dashboard.csv';link.click();URL.revokeObjectURL(link.href);showToast(`${rows.length} respostas exportadas em CSV.`)});
$('#copy-consent').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#consent-text').textContent);showToast('Aviso de consentimento copiado.')}catch{showToast('Não foi possível copiar automaticamente. Selecione o texto do aviso.')}});
update();
fetchSavedResponses();
