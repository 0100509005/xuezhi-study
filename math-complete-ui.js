// 数学整卷练题：判分内核 + 题单页 + 错题集成。结构参照 chemistry-midterm-complete.js。
function mathNormalize(value){
 let s=String(value??'');
 // 上下标必须在 NFKC 之前转成 ^n / _n，否则 ² 会被 NFKC 拉平成普通 2。
 s=s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>'^'+'⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c)).replace(/[₀₁₂₃₄₅₆₇₈₉]/g,c=>'_'+'₀₁₂₃₄₅₆₇₈₉'.indexOf(c));
 s=s.normalize('NFKC').toLowerCase();
 s=s.replace(/[−–—]/g,'-').replace(/[～〜]/g,'~').replace(/√/g,'sqrt').replace(/π/g,'pi').replace(/∞/g,'inf')
  .replace(/÷/g,'/').replace(/[·⋅]/g,'*').replace(/≤/g,'<=').replace(/≥/g,'>=').replace(/∗/g,'*').replace(/⁄/g,'/');
 // 括号不参与判等：sqrt(2) 与 √2、e^(-x) 与 e^-x 互相认可；区间与集合靠 [] {} 区分。
 s=s.replace(/[()（）\s]/g,'');
 return s;
}
function mathParseNumber(value){
 const n=mathNormalize(value);
 let m=n.match(/^([+-]?\d+)\/(\d+)$/);if(m)return m[2]==='0'?null:Number(m[1])/Number(m[2]);
 m=n.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)$/);
 return m?Number(m[0]):null;
}
function mathBlankCorrect(b,value){
 const n=mathNormalize(value);if(!n)return false;
 if(b.numeric){
  const m=n.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?(?:\/\d+)?)(.*)$/);if(!m)return false;
  if(m[2]&&!mathNormalize(b.label).includes(m[2]))return false;
  const got=mathParseNumber(m[1]),want=mathParseNumber(b.answer);
  if(got===null||want===null)return false;
  return Math.abs(got-want)<=(b.tolerance??0.005)+1e-9;
 }
 if([b.answer,...(b.aliases||[])].some(x=>mathNormalize(x)===n))return true;
 if(b.set){const sorted=x=>mathNormalize(x).split(/[、,，;；和与及]+/).filter(Boolean).sort().join('|');if([b.answer,...(b.aliases||[])].some(x=>sorted(x)===sorted(value)))return true;}
 if(b.keywords&&!/[不无没]|较弱|更弱|弱于/.test(n))return b.keywords.every(group=>group.some(k=>n.includes(mathNormalize(k))));
 return false;
}
function mathCompleteResult(q,a){
 if(!a?.submitted)return null;
 if(q.blanks)return q.blanks.map((b,i)=>mathBlankCorrect(b,a.values[i]));
 return [Array.isArray(a.values)&&a.values.length===q.answers.length&&q.answers.every(i=>a.values.includes(i))];
}
function mathCompleteAllCorrect(q,a){const r=mathCompleteResult(q,a);return !!r&&r.every(Boolean);}
function normalizeMathCompleteAnswers(raw){
 const out={};if(!raw||typeof raw!=='object')return out;
 for(const q of MATH_COMPLETE){
  const a=raw[q.id];if(!a||!Array.isArray(a.values))continue;
  if(q.blanks){const values=a.values.slice(0,q.blanks.length).map(v=>typeof v==='string'?v.slice(0,1500):'');if(values.length!==q.blanks.length)continue;out[q.id]={values,submitted:a.submitted===true,mode:a.mode==='text'?'text':'choice'};}
  else if(q.answers){out[q.id]={values:[...new Set(a.values.filter(v=>Number.isInteger(v)&&v>=0&&v<q.options.length))],submitted:a.submitted===true,mode:'choice'};}
 }
 return out;
}
function mathCompleteShuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let mathCompleteMode='choice',mathCompleteOrders={},mathCompleteRefresh=null;
function mathCompleteQuestionHTML(q){
 const a=state.mathCompleteAnswers[q.id],done=!!a?.submitted,results=mathCompleteResult(q,a),e=escapeHTML;
 const mode=done?a.mode:mathCompleteMode;
 const kindLabel={choice:'选择',fill:'填空',solve:'解答转填空',proof:'证明'}[q.kind];
 const pill=q.kind==='choice'?(q.answers.length>1?'不定项选择（选全再提交）':'单选'):q.kind==='proof'?'纸上作答':`${q.blanks.length} 空`;
 const head=`<div class="exam-source-label">${e(q.year)} 年 · ${kindLabel} 第 ${e(q.number.slice(1))} 题 <span class="pill">${e(pill)}</span></div><h3>${e(q.prompt)}</h3>${q.note?`<p class="notice">${done?'原题说明：'+e(q.note):'本题已按原卷补充说明，具体内容随解析显示。'}</p>`:''}`;
 const sourceLinks=`<div class="exam-source-links"><a href="${mathPaperLink(q.course,'paper',q.page)}">核对原题 · PDF 第 ${q.page} 页</a></div>`;
 if(q.kind==='proof')return `<article class="exam-question complete-question" id="complete-q-${q.id}" data-mcq="${q.id}">${head}<div class="feedback"><strong>纸上作答 · 不计入自动判分</strong><p>${e(q.explanation)}</p><a href="${mathPaperLink(q.course,'answer',q.answerPage)}">查看原参考解析 · PDF 第 ${q.answerPage} 页</a></div>${sourceLinks}</article>`;
 const inputs=q.blanks?q.blanks.map((b,i)=>{
  const value=a?.values[i]??'',key=q.id+'-'+i;
  mathCompleteOrders[key]??=mathCompleteShuffle(b.options);
  const displayOptions=value&&!mathCompleteOrders[key].includes(value)?[value,...mathCompleteOrders[key]]:mathCompleteOrders[key];
  const answer=done?`<p class="${results[i]?'complete-pass':'complete-miss'}">${results[i]?'✓ 正确':'需核对'} · 你的答案：${e(value)}<br>参考答案：${e(b.answer)}</p>`:'';
  return `<div class="complete-blank"><label for="math-complete-${key}">${i+1}. ${e(b.label)}</label>${mode==='text'?`<input id="math-complete-${key}" data-mc-blank="${i}" autocomplete="off" value="${e(value)}" ${done?'disabled':''} placeholder="填写本空；数值可写分数或小数">`:`<select id="math-complete-${key}" data-mc-blank="${i}" ${done?'disabled':''}><option value="">请选择</option>${displayOptions.map(x=>`<option value="${e(x)}" ${x===value?'selected':''}>${e(x)}</option>`).join('')}</select>`}${answer}</div>`;
 }).join(''):`<div class="exam-choices">${q.options.map((o,i)=>`<label class="choice complete-option"><input type="${q.answers.length>1?'checkbox':'radio'}" name="math-complete-${q.id}" data-mc-option="${i}" ${a?.values.includes(i)?'checked':''} ${done?'disabled':''}> <span>${String.fromCharCode(65+i)}. ${e(o)}</span></label>`).join('')}</div>`;
 const correctText=q.blanks?`答对 ${results?.filter(Boolean).length||0} / ${q.blanks.length} 空`:`正确选项：${q.answers.map(i=>String.fromCharCode(65+i)).join('、')}`;
 return `<article class="exam-question complete-question" id="complete-q-${q.id}" data-mcq="${q.id}">${head}${inputs}<p class="complete-validation" aria-live="polite"></p><div class="actions">${done?`<button class="btn secondary" data-mc-retry>重新做本题</button>`:`<button class="btn" data-mc-submit>提交本题</button>`}</div>${done?`<div class="feedback ${results.every(Boolean)?'correct':''}" tabindex="-1"><strong>${results.every(Boolean)?'✓ 回答正确':'再巩固一下'} · ${correctText}</strong><p>${e(q.explanation)}</p><a href="${mathPaperLink(q.course,'answer',q.answerPage)}">查看原参考解析 · PDF 第 ${q.answerPage} 页</a></div>`:''}${sourceLinks}</article>`;
}
function mathCompleteDrill(raw){
 const [course,kind]=String(raw||'').split('@');
 if(!['calculus','algebra'].includes(course)||!['choice','fill','solve'].includes(kind))return notFound();
 const kindNames={choice:'选择题',fill:'填空题',solve:'解答转填空'};
 const match=q=>q.course===course&&(kind==='solve'?q.kind==='solve'||q.kind==='proof':q.kind===kind);
 let order=MATH_COMPLETE.filter(match).sort((a,b)=>b.year-a.year||(a.kind==='proof')-(b.kind==='proof')||Number(a.number.slice(1))-Number(b.number.slice(1)));
 const papers=MATH_PAPERS.filter(p=>p.course===course);
 let page=0,found=[];
 const condition=kind==='choice'?'不定项选择按卷面要求选全后提交；提交后显示解析与原卷页码。':kind==='fill'?'每空单独作答、单独判分。切换方式保留已填内容，选项顺序随机。':'解答题按关键步骤拆成若干空逐空判分；证明题只在“全部题目”里列出，对照解析在纸上完成。';
 shell(`<div class="crumb"><a href="#math-library/${course}">← 历年真题与解析</a></div><h1>${escapeHTML(COURSES[course].title)} · 整卷练题 · ${kindNames[kind]}</h1>${mathTabs(course,'complete')}<section class="panel"><h2>题型</h2><nav class="actions" aria-label="整卷练题题型">${[['choice','选择题'],['fill','填空题'],['solve','解答转填空']].map(([k,label])=>`<a class="btn ${k===kind?'':'secondary'}" href="#math-complete/${course}@${k}">${label}</a>`).join('')}</nav></section><p class="course-description">${order.length} 道${kindNames[kind]}${kind==='choice'?'':`，共 ${order.filter(q=>q.blanks).reduce((n,q)=>n+q.blanks.length,0)} 空`}${kind==='solve'?`；其中 ${order.filter(q=>q.kind==='proof').length} 道证明题保留纸上作答`:''}。提交后显示解析，可按年份筛选。</p><div class="tools"><select id="mathCompletePaper" aria-label="按年份筛选"><option value="all">全部年份 · 从新到旧</option>${papers.map(p=>`<option value="${p.year}">${p.year} 年 · ${order.filter(q=>q.year===p.year).length} 题</option>`).join('')}</select><select id="mathCompleteStatus" aria-label="作答状态"><option value="all">全部题目</option><option value="new">未完成</option><option value="wrong">只看错题</option></select><input id="mathCompleteSearch" type="search" aria-label="搜索题目" placeholder="搜索题干、考点、年份"></div><div class="actions"><button class="btn secondary" id="mathCompleteReset">重置当前年份本题型</button><button class="btn secondary" id="mathCompleteShuffle">打乱题目顺序</button>${kind==='choice'?'':'<label>填空方式 <select id="mathCompleteMode" aria-label="填空方式"><option value="choice">选项作答</option><option value="text">直接填空</option></select></label>'}</div><p class="condition">${condition} 重置清除所选年份该题型的作答；乱序保留进度。</p><p id="mathCompleteCount" aria-live="polite"></p><div id="mathCompleteList"></div><nav class="paper-pagination"><button id="mathCompletePrev" class="btn secondary">← 上一组</button><span id="mathCompletePages"></span><button id="mathCompleteNext" class="btn">下一组 →</button></nav>`,COURSES[course].title);
 function selected(){return order.filter(q=>$('#mathCompletePaper').value==='all'||q.year===Number($('#mathCompletePaper').value));}
 function counter(){const qs=selected(),done=qs.filter(q=>state.mathCompleteAnswers[q.id]?.submitted),right=done.filter(q=>mathCompleteAllCorrect(q,state.mathCompleteAnswers[q.id]));$('#mathCompleteCount').textContent=`本年份范围：${qs.length} 题 · 已完成 ${done.length} · 全对 ${right.length} · 当前筛选 ${found.length} 题`+(kind==='choice'?'':` · 已答对 ${done.reduce((s,q)=>s+(q.blanks?mathCompleteResult(q,state.mathCompleteAnswers[q.id]).filter(Boolean).length:0),0)} / ${qs.reduce((s,q)=>s+(q.blanks?.length||0),0)} 空`);}
 function render(reset=false){if(reset)page=0;const status=$('#mathCompleteStatus').value,query=$('#mathCompleteSearch').value.trim().toLowerCase();found=selected().filter(q=>{const a=state.mathCompleteAnswers[q.id];if(q.kind==='proof')return status==='all';return(status==='all'||status==='new'&&!a?.submitted||status==='wrong'&&a?.submitted&&!mathCompleteAllCorrect(q,a))&&[q.prompt,q.explanation,q.year,...(q.blanks||[]).map(b=>b.label)].join(' ').toLowerCase().includes(query);});page=chemResumePage(found,6)??page;const pages=Math.ceil(found.length/6);page=Math.max(0,Math.min(page,pages-1));$('#mathCompleteList').innerHTML=found.slice(page*6,page*6+6).map(mathCompleteQuestionHTML).join('')||'<p>没有符合筛选条件的题目。</p>';$('#mathCompletePrev').disabled=page===0;$('#mathCompleteNext').disabled=page+1>=pages;$('#mathCompletePages').textContent=pages?`${page+1} / ${pages}`:'0 / 0';counter();}
 for(const id of ['mathCompletePaper','mathCompleteStatus','mathCompleteSearch'])$('#'+id).addEventListener(id==='mathCompleteSearch'?'input':'change',()=>render(true));
 $('#mathCompletePrev').onclick=()=>{page--;render();$('#mathCompleteCount').scrollIntoView();};$('#mathCompleteNext').onclick=()=>{page++;render();$('#mathCompleteCount').scrollIntoView();};
 $('#mathCompleteShuffle').onclick=()=>{order=mathCompleteShuffle(order);render(true);};
 $('#mathCompleteReset').onclick=()=>{for(const q of selected()){delete state.mathCompleteAnswers[q.id];for(let i=0;i<(q.blanks?.length||0);i++)delete mathCompleteOrders[q.id+'-'+i];}save();$('#mathCompleteStatus').value='all';render(true);};
 if($('#mathCompleteMode')){$('#mathCompleteMode').value=mathCompleteMode;$('#mathCompleteMode').onchange=()=>{mathCompleteMode=$('#mathCompleteMode').value;render();};}
 mathCompleteRefresh=counter;render();
}
function mathCompleteReadCard(q,card){return q.blanks?[...card.querySelectorAll('[data-mc-blank]')].map(x=>x.value):[...card.querySelectorAll('[data-mc-option]:checked')].map(x=>Number(x.dataset.mcOption));}
function restoreMathCompleteMistakes(){state.mathCompleteMistakes={};try{const raw=JSON.parse(localStorage.getItem('xuezhi-v1')||'null');for(const q of MATH_COMPLETE){const m=raw?.mathCompleteMistakes?.[q.id];if(m&&Number.isInteger(m.streak)&&m.streak>=0&&m.streak<3)state.mathCompleteMistakes[q.id]={streak:m.streak};else if(!raw?.mathCompleteMistakes&&state.mathCompleteAnswers[q.id]?.submitted&&!mathCompleteAllCorrect(q,state.mathCompleteAnswers[q.id]))state.mathCompleteMistakes[q.id]={streak:0};}}catch{}}
function trackMathCompleteMistake(q){const a=state.mathCompleteAnswers[q.id];if(!mathCompleteAllCorrect(q,a))state.mathCompleteMistakes[q.id]={streak:0};else if(state.mathCompleteMistakes[q.id]&&++state.mathCompleteMistakes[q.id].streak>=3)delete state.mathCompleteMistakes[q.id];}
function mathCompleteMistakeHTML(){const subject=reviewSubject();if(subject&&!['calculus','algebra'].includes(subject))return '';const qs=MATH_COMPLETE.filter(q=>q.kind!=='proof'&&state.mathCompleteMistakes[q.id]&&(!subject||q.course===subject));return `<section class="panel"><h2>数学整卷错题 · ${qs.length} 题</h2><p>任一空或选项答错即收录；整题连续答对 3 次移出，答错重新计数。先提交本轮全部题目，再开始下一轮。</p><button class="btn secondary" id="mathCompleteMistakeRound" ${!qs.length||qs.some(q=>!state.mathCompleteAnswers[q.id]?.submitted)?'disabled':''}>开始下一轮复习</button><label>填空方式 <select id="mathMistakeFillMode"><option value="choice">选项作答</option><option value="text" ${mathCompleteMode==='text'?'selected':''}>直接填空</option></select></label>${qs.map(q=>`<p>连对 ${state.mathCompleteMistakes[q.id].streak} / 3</p>`+mathCompleteQuestionHTML(q).replace(/<button[^>]*data-mc-retry[^>]*>.*?<\/button>/g,'')).join('')||'<p>暂时没有此类错题。</p>'}</section>`;}
function bindMathCompleteMistakes(){const b=$('#mathCompleteMistakeRound');if(!b)return;b.onclick=()=>{for(const q of MATH_COMPLETE.filter(q=>state.mathCompleteMistakes[q.id]))delete state.mathCompleteAnswers[q.id];save();review();};const m=$('#mathMistakeFillMode');if(m)m.onchange=()=>{mathCompleteMode=m.value;review();};}
if(typeof document!=='undefined'){
 document.addEventListener('input',event=>{const card=event.target.closest('[data-mcq]');if(!card)return;const q=MATH_COMPLETE.find(q=>q.id===card.dataset.mcq);if(!q||state.mathCompleteAnswers[q.id]?.submitted)return;state.mathCompleteAnswers[q.id]={values:mathCompleteReadCard(q,card),submitted:false,mode:mathCompleteMode};save();});
 document.addEventListener('click',event=>{
  const button=event.target.closest('[data-mc-submit],[data-mc-retry]');if(!button)return;const card=button.closest('[data-mcq]'),q=MATH_COMPLETE.find(q=>q.id===card.dataset.mcq);if(!q)return;
  if(button.hasAttribute('data-mc-retry'))delete state.mathCompleteAnswers[q.id];
  else{const values=mathCompleteReadCard(q,card);if(!values.length||q.blanks&&values.some(v=>!v.trim())){card.querySelector('.complete-validation').textContent=q.blanks?'请完成每一空后提交。':'请至少选择一个选项。';return;}state.mathCompleteAnswers[q.id]={values,submitted:true,mode:mathCompleteMode};}
  if(button.hasAttribute('data-mc-submit'))trackMathCompleteMistake(q);
  save();card.outerHTML=mathCompleteQuestionHTML(q);if($('#mathCompleteCount'))mathCompleteRefresh?.();document.getElementById('complete-q-'+q.id)?.querySelector('.feedback')?.focus({preventScroll:true});
  if(location.hash.startsWith('#review'))review();
 });
}
