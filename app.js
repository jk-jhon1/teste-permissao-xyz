const researchData = [
  ["3ª série", "Sim", "Não", "Não compartilhar"],
  ["2ª série", "Não", "Não", "Conferir a fonte"],
  ["1ª série", "Sim", "Sim", "Conferir a fonte"],
  ["3ª série", "Não", "Sim", "Compartilhar"],
  ["3ª série", "Sim", "Sim", "Perguntar a alguém"],
  ["2ª série", "Não", "Sim", "Não compartilhar"],
  ["1ª série", "Sim", "Sim", "Não compartilhar"],
  ["1ª série", "Sim", "Sim", "Conferir a fonte"],
  ["3ª série", "Não", "Não", "Não compartilhar"],
  ["3ª série", "Sim", "Não", "Compartilhar"],
  ["2ª série", "Não", "Sim", "Compartilhar"],
  ["2ª série", "Sim", "Sim", "Compartilhar"],
  ["2ª série", "Sim", "Não", "Não compartilhar"],
  ["3ª série", "Sim", "Sim", "Perguntar a alguém"],
  ["3ª série", "Não", "Não", "Perguntar a alguém"],
  ["3ª série", "Não", "Não", "Não compartilhar"],
  ["1ª série", "Não", "Sim", "Compartilhar"],
  ["1ª série", "Sim", "Sim", "Não compartilhar"],
  ["1ª série", "Não", "Sim", "Conferir a fonte"],
  ["1ª série", "Não", "Não", "Conferir a fonte"],
  ["3ª série", "Sim", "Sim", "Não compartilhar"],
  ["2ª série", "Não", "Sim", "Compartilhar"],
  ["2ª série", "Não", "Sim", "Não compartilhar"],
  ["3ª série", "Sim", "Sim", "Compartilhar"],
  ["1ª série", "Sim", "Não", "Compartilhar"],
  ["1ª série", "Não", "Não", "Compartilhar"],
  ["1ª série", "Sim", "Sim", "Não compartilhar"],
].map(([serie,verificou_fonte,identificou_sinais,acao])=>({serie,verificou_fonte,identificou_sinais,acao}));

const ACTIONS = ['Conferir a fonte','Perguntar a alguém','Não compartilhar','Compartilhar'];
const ACTION_COLORS = ['#20d1c1','#158cff','#ffd05a','#59677e'];
let data = researchData;
let isImportedData = true;
let toastTimer;
let savedRowCount = null;
let jsonpCounter = 0;
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
  const gap= yes.n&&no.n ? Math.round((yes.yes/yes.n-no.yes/no.n)*100):null;
  $('#metric-total').innerHTML=`${total}<span> respostas</span>`;
  $('#metric-total-note').textContent= isImportedData?'Dados do CSV enviado':'Amostra demonstrativa';
  $('#metric-detect').innerHTML=`${fmtRate(detected,total)}<span> do grupo</span>`;
  $('#metric-gap').innerHTML=`${gap===null?'—':`${gap>0?'+':''}${gap}`}<span> p.p.</span>`;
  $('#metric-grades').innerHTML=`${new Set(rows.map(r=>r.serie)).size}<span> ${new Set(rows.map(r=>r.serie)).size===1?'série':'séries'}</span>`;
}
function getGradeBreakdown(rows){
  return ['1ª série','2ª série','3ª série'].map(grade=>{
    const checked=rows.filter(r=>r.serie===grade&&r.verificou_fonte==='Sim');
    const unchecked=rows.filter(r=>r.serie===grade&&r.verificou_fonte==='Não');
    const checkedYes=checked.filter(r=>r.identificou_sinais==='Sim').length;
    const uncheckedYes=unchecked.filter(r=>r.identificou_sinais==='Sim').length;
    return {grade,checkedN:checked.length,checkedYes,uncheckedN:unchecked.length,uncheckedYes,
      checkedRate:pct(checkedYes,checked.length),uncheckedRate:pct(uncheckedYes,unchecked.length)};
  }).filter(g=>g.checkedN&&g.uncheckedN);
}
function buildResearchConclusion(rows,y,n,gap){
  const source=isImportedData?'CSV fornecido':'amostra de demonstração';
  if(!y.n||!n.n)return `A ${source} contém ${rows.length} respostas neste recorte, mas faltam respostas em um dos grupos para comparar a hipótese. Aumente a coleta antes de tirar uma conclusão.`;
  const checkedPhrase=`${y.yes} de ${y.n} que verificaram a fonte (${pct(y.yes,y.n)}%)`;
  const uncheckedPhrase=`${n.yes} de ${n.n} que não verificaram (${pct(n.yes,n.n)}%)`;
  let conclusion=`No ${source}, ${checkedPhrase} identificaram sinais de manipulação, contra ${uncheckedPhrase} no outro grupo — diferença de ${Math.abs(gap)} pontos percentuais.`;
  if(selectedGrade()==='todas'){
    const grades=getGradeBreakdown(rows);
    if(grades.length){
      const detail=grades.map(g=>`${g.grade}: ${g.checkedYes}/${g.checkedN} (${g.checkedRate}%) vs. ${g.uncheckedYes}/${g.uncheckedN} (${g.uncheckedRate}%)`).join('; ');
      conclusion+=` Por série, a comparação foi: ${detail}.`;
    }
    const actions=ACTIONS.map(action=>({action,count:rows.filter(r=>r.acao===action).length}));
    const notShare=actions.find(item=>item.action==='Não compartilhar')?.count||0;
    const share=actions.find(item=>item.action==='Compartilhar')?.count||0;
    conclusion+=` Sobre a primeira atitude, ${notShare}/${rows.length} escolheram “não compartilhar” e ${share}/${rows.length} escolheram “compartilhar”.`;
  }
  conclusion+=' Como são respostas autorrelatadas e os grupos por série são pequenos, o padrão não prova causalidade nem deve ser generalizado para todos os estudantes.';
  return conclusion;
}
function renderInterpretation(rows){
  const y=rate(rows,'identificou_sinais','Sim'),n=rate(rows,'identificou_sinais','Não');
  const yesP=y.n?pct(y.yes,y.n):0,noP=n.n?pct(n.yes,n.n):0,gap=y.n&&n.n?Math.round((y.yes/y.n-n.yes/n.n)*100):0;
  const scope=selectedGrade()==='todas'?'no recorte atual':`na ${selectedGrade()}`;
  if(!rows.length){
    $('#finding-status').innerHTML='<span class="status-dot"></span> SEM DADOS NO RECORTE';
    $('#finding-title').textContent='Não há respostas para este filtro.';
    $('#finding-text').textContent='Escolha outra série ou importe um CSV válido para explorar as evidências.';
    $('#research-conclusion').textContent='Sem respostas neste recorte, não é possível avaliar a hipótese.';
    $('#comparison-insight').innerHTML='<span class="insight-arrow">↗</span><span>Sem dados suficientes para comparar os grupos.</span>';
    $('#ai-reading').textContent='Não há dados neste recorte para produzir uma leitura.';
    $('#ai-support').textContent='Selecione outra série ou importe respostas.';
    $('#finding-footnote').textContent='NENHUMA RESPOSTA NO FILTRO';
    return;
  }
  const grades=selectedGrade()==='todas'?getGradeBreakdown(rows):[];
  const reversedGrade=grades.find(g=>g.checkedRate<g.uncheckedRate);
  let status,title,text,trend;
  if(!y.n||!n.n){
    status='COMPARAÇÃO INCOMPLETA';title='Ainda não dá para comparar os dois grupos.';
    text=`${y.n?'Há respostas de quem verificou a fonte, mas nenhuma de quem não verificou.':'Há respostas de quem não verificou a fonte, mas nenhuma de quem verificou.'} Amplie a coleta para testar a hipótese ${scope}.`;
    trend='Um dos grupos não tem respostas neste recorte.';
  }else if(rows.length<5){
    status='AMOSTRA MUITO PEQUENA';title='Um sinal inicial — ainda sem base para concluir.';
    text=`Neste recorte (${rows.length} ${rows.length===1?'resposta':'respostas'}), ${yesP}% de quem verificou a fonte e ${noP}% de quem não verificou identificaram sinais. O número de respostas é baixo demais para sustentar uma conclusão.`;
    trend=`${yesP}% vs. ${noP}% identificaram sinais, mas o recorte tem apenas ${rows.length} respostas.`;
  }else if(gap>5){
    status=reversedGrade?'APOIO PARCIAL':'HIPÓTESE APOIADA';
    title=reversedGrade?'A tendência geral apoia a hipótese, mas varia por série.':'Neste recorte, verificar a fonte acompanha mais identificação de sinais.';
    text=`${yesP}% (${y.yes}/${y.n}) de quem verificou a fonte identificou sinais, contra ${noP}% (${n.yes}/${n.n}) de quem não verificou: diferença de ${gap} pontos percentuais ${scope}. ${reversedGrade?`O padrão se inverte na ${reversedGrade.grade}; por isso, o apoio à hipótese é parcial.`:'O padrão é compatível com a hipótese, mas não prova causa.'}`;
    trend=`${yesP}% identificaram sinais entre quem verificou, contra ${noP}% entre quem não verificou.`;
  }else if(gap< -5){
    status='HIPÓTESE NÃO APOIADA';title='Neste recorte, o padrão observado vai contra a hipótese.';
    text=`${noP}% de quem não verificou a fonte identificou sinais, contra ${yesP}% de quem verificou. A diferença de ${Math.abs(gap)} pontos percentuais ${scope} não apoia a aposta inicial. Refutar uma hipótese também é resultado científico.`;
    trend=`O grupo que não verificou a fonte identificou mais sinais: ${noP}% vs. ${yesP}%.`;
  }else{
    status='RESULTADO INCONCLUSIVO';title='Os grupos ficaram próximos neste recorte.';
    text=`${yesP}% de quem verificou e ${noP}% de quem não verificou identificaram sinais: diferença de apenas ${Math.abs(gap)} pontos percentuais ${scope}. A hipótese não foi claramente confirmada nem refutada pelos dados disponíveis.`;
    trend=`Diferença de ${Math.abs(gap)} p.p. entre os grupos; resultado inconclusivo.`;
  }
  $('#finding-status').innerHTML=`<span class="status-dot"></span> ${status}`;
  $('#finding-title').textContent=title;
  $('#finding-text').textContent=text;
  $('#research-conclusion').textContent=buildResearchConclusion(rows,y,n,gap);
  $('#finding-footnote').textContent=`CONCLUSÃO ATUALIZADA · ${rows.length} RESPOSTAS`;
  $('#comparison-insight').innerHTML=`<span class="insight-arrow">↗</span><span>${esc(trend)}</span>`;
  $('#ai-reading').textContent=`${y.n&&n.n?`Estudantes que verificaram a fonte identificaram sinais em ${yesP}% dos casos observados, enquanto o grupo que não verificou identificou em ${noP}%. ${gap>5?'Isso é compatível com a hipótese de associação.':gap< -5?'O padrão observado não acompanha a hipótese inicial.':'A diferença é pequena e não aponta uma associação clara.'}`:'O filtro atual não contém os dois grupos necessários para comparar a hipótese.'} ${isImportedData?'Esta é uma leitura exploratória do conjunto recebido.':'Lembre-se: os registros exibidos são sintéticos, criados apenas para demonstrar a visualização.'}`;
  $('#ai-support').textContent=y.n&&n.n?`No recorte, ${y.yes} de ${y.n} que verificaram a fonte e ${n.yes} de ${n.n} que não verificaram identificaram sinais. A diferença observada é de ${Math.abs(gap)} p.p.`:'Precisamos observar os dois grupos — quem verificou e quem não verificou — para comparar as proporções.';
}
function update(){const rows=currentRows();renderMetrics(rows);renderComparison(rows);renderActions(rows);renderInterpretation(rows);}

function fetchSavedResponses(){
  const base=endpoint();
  if(!base)return Promise.resolve(null);
  return new Promise(resolve=>{
    const callbackName=`__maklynRead_${Date.now()}_${++jsonpCounter}`;
    const script=document.createElement('script');
    let finished=false;
    let timer;
    const finish=rows=>{
      if(finished)return;
      finished=true;
      clearTimeout(timer);
      delete window[callbackName];
      script.remove();
      resolve(Array.isArray(rows)?rows:null);
    };
    window[callbackName]=rows=>{
      const clean=Array.isArray(rows)?rows.filter(row=>row&&['1ª série','2ª série','3ª série'].includes(row.serie)&&['Sim','Não'].includes(row.verificou_fonte)&&['Sim','Não'].includes(row.identificou_sinais)&&ACTIONS.includes(row.acao)):[];
      savedRowCount=clean.length;
      if(clean.length){
        data=clean;
        isImportedData=true;
        $('#dataset-title').textContent='Respostas recebidas';
        $('#dataset-description').textContent=`${clean.length} respostas anônimas salvas na planilha`;
        update();
      }
      const status=$('#survey-status');
      status.classList.remove('error');
      status.classList.add('success');
      status.textContent=clean.length?`${clean.length} respostas encontradas na planilha.`:'Planilha conectada; ainda não há respostas registradas.';
      finish(clean);
    };
    script.onerror=()=>{
      const status=$('#survey-status');
      status.classList.remove('success');
      status.classList.add('error');
      status.textContent='Não consegui acessar a planilha. Confira se o Apps Script está implantado como app da Web, executado por você e acessível a qualquer pessoa.';
      finish(null);
    };
    const url=new URL(base);
    url.searchParams.set('action','list');
    url.searchParams.set('callback',callbackName);
    url.searchParams.set('v',Date.now());
    script.src=url.toString();
    document.head.appendChild(script);
    timer=setTimeout(()=>{
      const status=$('#survey-status');
      status.classList.remove('success');
      status.classList.add('error');
      status.textContent='A planilha não respondeu. Confira a implantação e atualize a versão do app da Web no Apps Script.';
      finish(null);
    },8000);
  });
}

$('#grade-filter').addEventListener('change',update);
$('#survey-form').addEventListener('submit',async event=>{
  event.preventDefault();
  const status=$('#survey-status'),button=$('.survey-submit'),form=event.currentTarget,formData=new FormData(form);
  if(String(formData.get('website_extra')||'').trim())return;
  const url=endpoint();
  if(!url){status.textContent='Envio não ativado: configure a URL do Apps Script em config.js.';status.classList.add('error');return;}
  status.classList.remove('error','success');
  status.textContent='Enviando e conferindo a resposta na planilha…';
  button.disabled=true;
  const payload=new URLSearchParams();
  ['serie','verificou_fonte','identificou_sinais','acao','consentimento','website_extra'].forEach(key=>payload.set(key,String(formData.get(key)||'')));
  try{
    let before=savedRowCount;
    if(before===null){
      const initial=await fetchSavedResponses();
      if(!Array.isArray(initial))throw new Error('A planilha não respondeu. Confira implantação, acesso e URL em config.js.');
      before=initial.length;
    }
    await fetch(url,{method:'POST',mode:'no-cors',body:payload,redirect:'follow'});
    let latest=null;
    for(let attempt=0;attempt<4;attempt++){
      await new Promise(resolve=>setTimeout(resolve,700));
      latest=await fetchSavedResponses();
      if(Array.isArray(latest)&&latest.length>before)break;
      if(!Array.isArray(latest))break;
    }
    if(Array.isArray(latest)&&latest.length>before){
      status.textContent='Resposta gravada na planilha. Obrigado por participar!';
      status.classList.add('success');
      form.reset();
    }else{
      status.textContent='Não confirmei a gravação. Reimplante a versão mais recente do Apps Script e confira se o acesso está como “Qualquer pessoa”.';
      status.classList.add('error');
    }
  }catch(error){
    status.textContent=error.message||'Falha ao enviar. Confira a conexão e tente novamente.';
    status.classList.add('error');
  }finally{
    button.disabled=false;
  }
});
$('#csv-input').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const text=await file.text();const parsed=parseCSV(text);data=parsed;isImportedData=true;$('#dataset-title').textContent='Respostas do CSV';$('#dataset-description').textContent=`${parsed.length} registros anônimos · arquivo fornecido`;update();showToast(`${parsed.length} registros carregados. Para a pesquisa, use 20+ respostas reais e anônimas.`)}catch(err){showToast(err.message)}finally{event.target.value=''}});
$('#download-csv').addEventListener('click',()=>{const rows=currentRows();const csv=['serie,verificou_fonte,identificou_sinais,acao',...rows.map(r=>[r.serie,r.verificou_fonte,r.identificou_sinais,r.acao].map(v=>`"${v.replaceAll('"','""')}"`).join(','))].join('\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));link.download='dados-anonimos-dashboard.csv';link.click();URL.revokeObjectURL(link.href);showToast(`${rows.length} respostas exportadas em CSV.`)});
$('#copy-consent').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#consent-text').textContent);showToast('Aviso de consentimento copiado.')}catch{showToast('Não foi possível copiar automaticamente. Selecione o texto do aviso.')}});
update();
fetchSavedResponses();
