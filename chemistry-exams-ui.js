let chemFillMode='choice';
let chemExamDrillRefresh=null;
function examPaperTitle(p){return `${p.year}学年${p.semester}${p.type}考试`;}
function examPaperURL(p,page=p.from){return `#chem-paper/${p.id}@${page}`;}
function examQuestionsFor(lesson){
 const ids=lesson.studyKind==='chem-point'?[lesson.termId]:(CHEM_LESSON_TERMS[lesson.id]||[]);
 return CHEM_EXAM_QUESTIONS.filter(q=>q.terms.some(id=>ids.includes(id)));
}
function examQuestionHTML(q){
 const p=CHEM_EXAM_PAPERS.find(p=>p.id===q.paper),a=state.examAnswers[q.id],answered=!!a,correct=answered&&a.choice===q.answer;
 return `<article class="exam-question" id="exam-q-${q.id}"><div class="exam-source-label"><span class="pill">${q.adapted?'真题改编':'原题整理'}</span><span>${escapeHTML(p.year+' '+p.type)} · ${q.number.startsWith('J')?'判断':q.number.startsWith('F')?'填空改编':'选择'}第${q.number.slice(1)}题</span></div><h3>${escapeHTML(q.prompt)}</h3>${q.adapted?`<p class="condition">改编说明：${escapeHTML(q.adapted)}</p>`:''}${chemFillMode==='text'&&q.number.startsWith('F')&&location.hash.startsWith('#chem-drill/fill-')?`<div class="exam-choices"><input id="fill-${q.id}" aria-label="填写第${q.number.slice(1)}题答案" placeholder="填写答案，与参考答案使用相同单位" ${answered?'disabled':''}><button class="btn secondary" data-fill-submit="${q.id}" ${answered?'disabled':''}>提交答案</button><p class="condition">按参考答案的单位填写。格式匹配存在局限，可在解析中核对。</p></div>`:`<div class="exam-choices">${q.options.map((text,i)=>`<button class="choice ${a?.choice===i?'selected':''}" data-exam-choice="${i}" data-exam-q="${q.id}" aria-pressed="${a?.choice===i}" ${answered?'disabled':''}>${q.options.length===2?'':String.fromCharCode(65+i)+'　'}${escapeHTML(text)}</button>`).join('')}</div>`}<div class="exam-feedback" id="exam-feedback-${q.id}" tabindex="-1" aria-live="polite">${answered?`<div class="feedback ${correct?'correct':''}"><strong>${correct?'✓ 回答正确':'再巩固一下'} · 正确答案：${escapeHTML(q.options[q.answer])}</strong><p>${escapeHTML(q.explanation)}</p>${q.terms.map(id=>`<a class="btn secondary" data-chem-question-point href="#chem-point/${id}">${escapeHTML(chemistryPoint(id).title)}</a>`).join('')}<a href="${examPaperURL(p,q.answerPage)}">核对原参考答案 · PDF第${q.answerPage}页 →</a>${isChemChoice(q)?'':`<button class="text-button" data-exam-retry="${q.id}">重新作答</button>`}</div>`:''}</div>${isChemChoice(q)?fixedRoundControls('chem',q):''}<div class="exam-source-links"><a href="${examPaperURL(p,q.page)}">看原题 · PDF第${q.page}页 ↗</a></div></article>`;
}
function chemDailyExamHTML(lesson){
 const qs=examQuestionsFor(lesson);if(!qs.length)return '';
 const ranked=[...qs].sort((a,b)=>{const rank=q=>state.examAnswers[q.id]?(state.examAnswers[q.id].choice===q.answer?2:0):1;return rank(a)-rank(b);});
 return `<section class="panel daily-exam" aria-label="本知识点历年题练习"><span class="label">从概念走到考题</span><h2>历年题检验</h2><p class="condition">本页关联 ${qs.length} 题，先练其中 ${Math.min(2,qs.length)} 题；解析为软件核对整理。真题作答单独保存，不改变上方随机练习的通过记录。</p>${ranked.slice(0,2).map(examQuestionHTML).join('')}<a class="btn secondary" href="#chem-drill/${lesson.studyKind==='chem-point'?lesson.termId:lesson.id}">查看本知识点全部关联真题 →</a></section>`;
}
function chemistryExams(){
 shell(`<p class="eyebrow">PAST EXAMS · ORIGINAL PAGES</p><h1>历年期中、期末题</h1><p class="course-description">5 套期中、3 套期末，试卷与参考答案分别阅读。完整原图保留公式、题号和计算题。</p>${chemistryTabs('exams')}${chemPositionButton('exam')}<div class="actions"><a class="btn" href="#chem-drill">按知识点做真题 →</a><a class="btn secondary" href="#chem-priorities">按治学集重点复习 →</a>${openMaterialButton(CHEM_EXAM_MATERIALS.find(s=>s.id==='chem-exams'))}</div><div class="tools"><input id="examSearch" type="search" aria-label="搜索历年试卷" placeholder="学年，例如 2015"><select id="examType" aria-label="选择考试类型"><option value="all">期中与期末</option><option>期中</option><option>期末</option></select></div><p class="condition">五套期中选择题 67 道、填空大题 40 道已全部支持逐题作答，请使用下方期中题型入口；计算和简答题在纸上作答。“按知识点做真题”中的 ${CHEM_EXAM_QUESTIONS.length} 道已核对题支持直接作答。原资料不是学校官方答案，已发现的笔误另有说明。</p>${chemistryJudgmentLinks()}<div id="examPapers" class="exam-paper-grid"></div><details class="panel"><summary>已发现的原资料笔误与核对说明</summary>${CHEM_SOURCE_ISSUES.filter(i=>i.kind==='exam').map(i=>`<p><a href="${examPaperURL(CHEM_EXAM_PAPERS.find(p=>i.page>=p.from&&i.page<=p.answerTo),i.page)}">PDF第${i.page}页</a>：${escapeHTML(i.text)}</p>`).join('')}</details>`,'大学化学 · 历年真题');
 function filter(){const q=$('#examSearch').value.trim(),type=$('#examType').value;$('#examPapers').innerHTML=CHEM_EXAM_PAPERS.filter(p=>(type==='all'||p.type===type)&&examPaperTitle(p).includes(q)).map(p=>`<article class="panel exam-paper-card"><span class="pill">${p.type}</span><h2>${escapeHTML(p.year)} 学年</h2><p>${p.semester} · ${p.to-p.from+1} 页试卷<br><span class="condition">原题 PDF第${p.from}—${p.to}页 · 答案第${p.answerFrom}—${p.answerTo}页</span></p><div class="actions"><a class="btn" href="${examPaperURL(p)}">读试卷 →</a><a class="btn secondary" href="${examPaperURL(p,p.answerFrom)}">参考答案 →</a>${state.examLast[p.id]?`<a href="${examPaperURL(p,state.examLast[p.id])}">接着看第${state.examLast[p.id]}页 →</a>`:''}</div></article>`).join('')||'<p>没有匹配的试卷。</p>';}
 $('#examSearch').addEventListener('input',filter);$('#examType').addEventListener('change',filter);filter();
}
function chemistryPaper(raw){
 const [id,value]=String(raw||'').split('@'),p=CHEM_EXAM_PAPERS.find(p=>p.id===id);if(!p)return notFound();
 const page=Number(value||p.from);if(!Number.isInteger(page)||page<p.from||page>p.answerTo)return notFound();
 const answer=page>=p.answerFrom,start=answer?p.answerFrom:p.from,end=answer?p.answerTo:p.to;
 state.examLast[p.id]=page;save();
 const controls=`<nav class="paper-pagination" aria-label="试卷页码导航">${page>start?`<a class="btn secondary" href="${examPaperURL(p,page-1)}">← 上一页</a>`:'<span>本部分第一页</span>'}<span>${answer?'参考答案':'原试卷'} ${page-start+1} / ${end-start+1} · PDF第${page}页</span>${page<end?`<a class="btn" href="${examPaperURL(p,page+1)}">下一页 →</a>`:`<a class="btn secondary" href="${answer?'#chem-exams':examPaperURL(p,p.answerFrom)}">${answer?'返回试卷目录':'查看参考答案'} →</a>`}</nav>`;
 const issues=p.imageFolder?(NEW_EXAM_NOTES[p.id]?.[page]||[]).map(text=>({text})):CHEM_SOURCE_ISSUES.filter(i=>i.kind==='exam'&&i.page===page);
 shell(`<div class="crumb"><a href="#chem-exams">← 历年试卷</a></div><h1>${escapeHTML(examPaperTitle(p))}</h1>${chemistryTabs('exams')}<div class="actions"><a class="btn ${answer?'secondary':''}" href="${examPaperURL(p)}">原试卷</a><a class="btn ${answer?'':'secondary'}" href="${examPaperURL(p,p.answerFrom)}">参考答案（主动打开）</a><a class="btn secondary" href="#chem-drill">按考点练习</a></div><p class="condition">${answer?'下面是资料原参考答案，已知笔误会单独提示。':'当前仅显示原试卷，不提前显示答案。'} 所有页码按原 PDF 顺序。</p>${issues.map(i=>`<div class="notice"><strong>此页核对说明：</strong>${escapeHTML(i.text)}</div>`).join('')}<div class="tools"><label for="paperJump">跳页：</label><select id="paperJump" aria-label="跳到试卷或答案页">${Array.from({length:p.answerTo-p.from+1},(_,i)=>p.from+i).map(n=>`<option value="${n}" ${n===page?'selected':''}>${n>=p.answerFrom?'参考答案':'试卷'} · PDF第${n}页</option>`).join('')}</select><button class="btn secondary" id="paperZoom" aria-pressed="false">放大页面</button></div>${controls}<div class="paper-image-wrap" id="paperImageWrap"><img class="paper-image" src="${p.imageFolder?`chemistry-pdfs/${p.imageFolder}/page-${page}.jpg`:`chemistry-pdfs/exam/${String(page).padStart(2,'0')}.jpg`}" alt="${escapeHTML(examPaperTitle(p))}${answer?'参考答案':'试卷'}，原PDF第${page}页"></div>${controls}`,'大学化学 · 历年原卷');
 $('#paperJump').addEventListener('change',()=>{location.hash=examPaperURL(p,Number($('#paperJump').value));});
 $('#paperZoom').addEventListener('click',()=>{const zoom=$('#paperImageWrap').classList.toggle('zoomed');$('#paperZoom').setAttribute('aria-pressed',String(zoom));$('#paperZoom').textContent=zoom?'恢复适合宽度':'放大页面';});
}
function chemistryJudgmentLinks(){
 return ['mid','final'].map((exam,i)=>`<section class="panel"><h2>${i?'期末复习':'期中复习'}</h2><nav class="actions" aria-label="${i?'期末':'期中'}题型">${[['judge','概念辨析'],['choice','选择题'],['fill','填空题']].map(([kind,label])=>`<a class="btn secondary" href="#chem-drill/${kind}-${exam}">${label}</a>`).join('')}</nav></section>`).join('');
}
function fullMidtermSections(kind){
 if(!['C','F'].includes(kind))return '';
 const ranges=kind==='C'?{mid2024:[1,2],mid2023:[1,2],mid2020:[2,3,4],mid2018:[13,14],mid2015:[24,25]}:{mid2024:[2,3],mid2023:[2,3],mid2020:[4,5],mid2018:[14],mid2015:[25,26]};
 return `<section class="panel"><h2>五套期中完整${kind==='C'?'选择':'填空'}原题</h2><p>逐卷展开查看完整原题。页面保留相邻题型和原题号。旧卷中有多选题，请按卷面要求作答。下方交互练习为已核对录入部分。</p>${Object.entries(ranges).map(([id,pages])=>{const p=CHEM_EXAM_PAPERS.find(p=>p.id===id);return `<details><summary>${escapeHTML(p.year)} · 完整原题</summary>${pages.map(n=>`<figure><figcaption>原 PDF 第 ${n} 页</figcaption><img style="width:100%;height:auto" loading="lazy" src="${p.imageFolder?`chemistry-pdfs/${p.imageFolder}/page-${n}.jpg`:`chemistry-pdfs/exam/${String(n).padStart(2,'0')}.jpg`}" alt="${escapeHTML(p.year)}原题第${n}页"></figure>`).join('')}<a href="${examPaperURL(p,p.answerFrom)}">打开本卷参考解析 →</a></details>`;}).join('')}</section>`;
}
function chemistryExamDrill(focus){
 if(focus==='choice-mid'||focus==='fill-mid')return chemistryCompleteDrill(focus.split('-')[0]);
 const unit=String(focus||'').match(/^(judge|choice|fill)-(mid|final)$/);
 const judgmentType=unit?(unit[2]==='mid'?'期中':'期末'):null;
 const questionPrefix=unit?{judge:'J',choice:'C',fill:'F'}[unit[1]]:null;
 const unitTitle=unit?{judge:'概念辨析正误判断',choice:'选择题',fill:'填空题'}[unit[1]]:'';
 const point=chemistryPoint(focus),legacy=LESSONS.find(l=>l.id===focus&&l.course==='chemistry'),related=point||legacy,base=judgmentType?CHEM_EXAM_QUESTIONS.filter(q=>q.number.startsWith(questionPrefix)&&CHEM_EXAM_PAPERS.find(p=>p.id===q.paper)?.type===judgmentType):related?examQuestionsFor(related):[...CHEM_EXAM_QUESTIONS];
 shell(`<div class="crumb"><a href="#chem-exams">← 历年试卷</a>${related?` / <a href="${itemURL(related)}">${escapeHTML(related.title)}</a>`:''}</div><h1>${judgmentType?judgmentType+' · '+unitTitle:related?'本知识点关联真题':'按知识点做历年题'}</h1>${chemistryTabs('exams')}${chemistryJudgmentLinks()}<p class="course-description">${related?escapeHTML(related.title)+' · ':''}${base.length} ${judgmentType?' 道已录入的'+unitTitle+'。作答后查看解析与原卷出处。':' 道已核对的判断、选择或填空改编题。'}</p><div class="tools"><input id="examDrillSearch" aria-label="搜索真题考点" placeholder="量子数、渗透压、缓冲、学年…"><select id="examDrillStatus" aria-label="筛选真题作答状态"><option value="all">全部题目</option><option value="unanswered">尚未作答</option><option value="wrong">只看错题</option></select><select ${judgmentType?'hidden':''} id="examDrillType" aria-label="筛选真题类型"><option value="all">期中与期末</option><option>期中</option><option>期末</option></select></div>${judgmentType==='期中'?fullMidtermSections(questionPrefix):''}<p class="condition" id="examDrillCount"></p><div id="examDrillList"></div><nav class="paper-pagination" aria-label="真题练习分页"><button class="btn secondary" id="drillPrev">← 上一组</button><span id="drillPageCount"></span><button class="btn" id="drillNext">下一组 →</button></nav>${related?'<a href="#chem-drill">查看全部考点真题 →</a>':''}`,'大学化学 · 考点真题');
 let page=0,total=0;
 const controls=document.createElement('div');controls.className='actions';
 controls.innerHTML='<button class="btn secondary" id="examReset">重新练习本模块</button><button class="btn secondary" id="examShuffle">打乱题目顺序</button>'+(questionPrefix==='F'?'<label>填空方式 <select id="fillMode"><option value="choice">选项作答</option><option value="text">直接填空</option></select></label>':'');
 $('#examDrillCount').before(controls);
 $('#examReset').onclick=()=>{for(const q of base)delete state.examAnswers[q.id];save();$('#examDrillStatus').value='all';filter(true);};
 $('#examShuffle').onclick=()=>{for(let i=base.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[base[i],base[j]]=[base[j],base[i]];}filter(true);};
 if($('#fillMode')){$('#fillMode').value=chemFillMode;$('#fillMode').onchange=()=>{chemFillMode=$('#fillMode').value;filter();};}
 function filter(reset=false){if(reset)page=0;const query=$('#examDrillSearch').value.trim().toLowerCase(),status=$('#examDrillStatus').value,type=$('#examDrillType').value,found=base.filter(q=>{const p=CHEM_EXAM_PAPERS.find(p=>p.id===q.paper),a=state.examAnswers[q.id];return(type==='all'||p.type===type)&&(status==='all'||status==='unanswered'&&!a||status==='wrong'&&a&&a.choice!==q.answer)&&[q.prompt,p.year,...q.terms.map(id=>chemistryPoint(id).title)].join(' ').toLowerCase().includes(query);});page=chemResumePage(found,8)??page;total=Math.ceil(found.length/8);page=Math.max(0,Math.min(page,total-1));$('#examDrillCount').textContent=`匹配 ${found.length} 题 · 已作答 ${base.filter(q=>state.examAnswers[q.id]).length} / ${base.length} 题`;
 $('#examDrillList').innerHTML=found.slice(page*8,page*8+8).map(examQuestionHTML).join('')||'<p class="no-result">没有匹配题目。</p>';$('#drillPrev').disabled=page===0;$('#drillNext').disabled=page+1>=total;$('#drillPageCount').textContent=total?`第 ${page+1} / ${total} 组`:'0 组';}
 for(const id of ['examDrillSearch','examDrillStatus','examDrillType'])$('#'+id).addEventListener(id==='examDrillSearch'?'input':'change',()=>filter(true));
 $('#drillPrev').addEventListener('click',()=>{page--;filter();$('#examDrillCount').scrollIntoView({block:'start'});});$('#drillNext').addEventListener('click',()=>{page++;filter();$('#examDrillCount').scrollIntoView({block:'start'});});chemExamDrillRefresh=filter;filter();
}
function chemistryReviewPriorities(){
 const high=CHEM_TERM_LESSONS.filter(p=>chemPriority(p.id)?.level===2),secondary=CHEM_TERM_LESSONS.filter(p=>chemPriority(p.id)?.level===1),unset=CHEM_TERM_LESSONS.length-high.length-secondary.length;
 shell(`<p class="eyebrow">REVIEW GUIDE · SOURCE BASED</p><h1>按治学集划重点</h1>${chemistryTabs('priorities')}<p class="course-description">最重要 ${high.length} 个 · 次重点 ${secondary.length} 个 · 其余 ${unset} 个不设等级。</p><section class="panel"><p><span class="review-priority priority-2">最重要</span> 正文明确标“重点”的内容，或明确“重点是……”所指的具体内容。<br><span class="review-priority priority-1">次重点</span> 正文实际提到，但未明确标重点的内容。</p><p>复合知识点只对注明的部分定级。未标等级不等于不考，也不按出现次数推测重点。治学集八章与课程九章按主题对应。</p><div class="actions"><a class="btn" href="#chem-guide/3">阅读治学集原页 →</a>${openMaterialButton(CHEM_EXAM_MATERIALS.find(s=>s.id==='chem-guide'))}</div></section><div class="tools"><input id="prioritySearch" aria-label="搜索复习重点" placeholder="知识点或依据中的关键词"><select id="priorityLevel" aria-label="筛选重点等级"><option value="2">最重要</option><option value="1">次重点</option><option value="0">未设等级</option><option value="all">全部知识点</option></select></div><p id="priorityCount" class="condition"></p><div id="priorityList"></div>`,'大学化学 · 复习重点');
 function filter(){const level=$('#priorityLevel').value,q=$('#prioritySearch').value.trim().toLowerCase(),list=CHEM_TERM_LESSONS.filter(p=>{const priority=chemPriority(p.id);return(level==='all'||Number(level)===(priority?.level||0))&&[p.title,...(priority?.evidence||[]).map(e=>e.focus+e.quote)].join(' ').toLowerCase().includes(q);});$('#priorityCount').textContent=`显示 ${list.length} 个知识点`;$('#priorityList').innerHTML=list.map(p=>`<article class="panel"><h2><a href="#chem-point/${p.termId}">${escapeHTML(p.title)}</a> ${chemPriorityBadge(p.id)}</h2>${chemPriorityListEvidence(p.id)||'<p class="condition">治学集正文未找到明确对应内容，暂不设定重点等级。</p>'}<a href="#chem-point/${p.termId}">进入知识点学习 →</a></article>`).join('')||'<p>没有匹配知识点。</p>';}
 $('#prioritySearch').addEventListener('input',filter);$('#priorityLevel').addEventListener('change',filter);filter();
}
function chemistryGuide(raw){
 const page=Number(raw||3);if(!Number.isInteger(page)||page<1||page>36)return notFound();
 const points=CHEM_TERM_LESSONS.filter(p=>chemPriority(p.id)?.evidence.some(e=>page>=e.from&&page<=e.to)),issues=CHEM_SOURCE_ISSUES.filter(i=>i.kind==='guide'&&i.page===page);
 shell(`<div class="crumb"><a href="#chem-priorities">← 复习重点与依据</a></div><h1>治学集 · 原PDF第${page}页</h1>${chemistryTabs('priorities')}<p class="condition">原文仅作资料对照；知识点讲解中的错误订正与适用条件另行说明。</p>${issues.map(i=>`<div class="notice"><strong>此页核对说明：</strong>${escapeHTML(i.text)}</div>`).join('')}<div class="tools"><label for="guideJump">跳页：</label><select id="guideJump" aria-label="跳到治学集页码">${Array.from({length:36},(_,i)=>i+1).map(n=>`<option value="${n}" ${n===page?'selected':''}>PDF第${n}页</option>`).join('')}</select></div><nav class="paper-pagination" aria-label="复习资料页码导航">${page>1?`<a class="btn secondary" href="#chem-guide/${page-1}">← 上一页</a>`:''}<span>${page} / 36 页</span>${page<36?`<a class="btn" href="#chem-guide/${page+1}">下一页 →</a>`:''}</nav>${points.length?`<section class="panel"><strong>此页对应的知识点：</strong><div class="term-index">${points.map(p=>`<a href="#chem-point/${p.termId}">${escapeHTML(p.title)} · ${chemPriority(p.id).level===2?'最重要':'次重点'}</a>`).join('')}</div></section>`:''}<div class="paper-image-wrap"><img class="paper-image" src="chemistry-pdfs/guide/${String(page).padStart(2,'0')}.jpg" alt="治学集原PDF第${page}页，包含原文重点标记"></div>`,'大学化学 · 治学集原页');
 $('#guideJump').addEventListener('change',()=>{location.hash='chem-guide/'+$('#guideJump').value;});
}
function initChemExamEvents(){
 document.addEventListener('click',event=>{
  const answer=event.target.closest('[data-exam-choice]'),retry=event.target.closest('[data-exam-retry]');if(!answer&&!retry)return;
  const id=answer?.dataset.examQ||retry.dataset.examRetry,q=CHEM_EXAM_QUESTIONS.find(q=>q.id===id);if(!q)return;
  if(answer){const choice=Number(answer.dataset.examChoice);if(state.examAnswers[id]||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return;state.examAnswers[id]={choice};if(isChemChoice(q))trackChoice('chem:'+id,q,choice);}else if(!isChemChoice(q))delete state.examAnswers[id];else return;
  save();document.getElementById('exam-q-'+id).outerHTML=examQuestionHTML(q);if(chemExamDrillRefresh)chemExamDrillRefresh();if(answer)document.getElementById('exam-feedback-'+id)?.focus({preventScroll:true});
 });
}

function normalizeChemFill(value){
 const sub='₀₁₂₃₄₅₆₇₈₉',sup='⁰¹²³⁴⁵⁶⁷⁸⁹';
 return String(value).normalize('NFKC').replace(/[₀-₉]/g,c=>sub.indexOf(c)).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g,c=>sup.indexOf(c)).replace(/[−–]/g,'-').replace(/\s+/g,'').replace(/[·⋅]/g,'').toLowerCase();
}
if(typeof document!=='undefined')document.addEventListener('click',event=>{
 const button=event.target.closest('[data-fill-submit]');if(!button)return;
 const q=CHEM_EXAM_QUESTIONS.find(q=>q.id===button.dataset.fillSubmit);if(!q||state.examAnswers[q.id])return;
 const value=document.getElementById('fill-'+q.id).value.trim();if(!value)return;
 const correct=normalizeChemFill(value)===normalizeChemFill(q.options[q.answer]);
 state.examAnswers[q.id]={choice:correct?q.answer:(q.answer+1)%q.options.length};trackChoice('chem:'+q.id,q,state.examAnswers[q.id].choice);save();
 document.getElementById('exam-q-'+q.id).outerHTML=examQuestionHTML(q);
 const box=document.getElementById('exam-feedback-'+q.id),note=document.createElement('p');note.textContent='你的填写：'+value;box.prepend(note);
});
