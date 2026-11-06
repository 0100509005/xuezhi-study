const $=s=>document.querySelector(s);
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ALL_ITEMS=[...LESSONS,...CHEM_TERM_LESSONS,...EXERCISES];
const getItem=id=>ALL_ITEMS.find(item=>item.id===id);
const itemURL=item=>item.studyKind==='chem-point'?`#chem-point/${item.termId}`:`#${item.kind?'exercise':'lesson'}/${item.id}`;
let state={answers:{},review:[],last:null,chemRead:[],chemFocusLast:null,examAnswers:{},completeExamAnswers:{},examLast:{},mathAnswers:{},mathLast:{},computerTrack:'all',studyMode:'brief',practice:normalizePractice(null)},storageOK=true;
try{
 const saved=JSON.parse(localStorage.getItem('xuezhi-v1')||'null');
 if(saved&&typeof saved==='object'){
  state.answers=saved.answers&&typeof saved.answers==='object'?saved.answers:{};
  state.review=Array.isArray(saved.review)?saved.review.filter(id=>getItem(id)):[];
  state.studyMode=normalizeStudyMode(saved.studyMode);state.mathAnswers=normalizeMathAnswers(saved.mathAnswers);state.mathLast=normalizeMathLast(saved.mathLast);state.last=saved.last;state.chemFocusLast=normalizeChemFocusLast(saved.chemFocusLast);state.examAnswers=normalizeExamAnswers(saved.examAnswers);state.completeExamAnswers=normalizeCompleteAnswers(saved.completeExamAnswers);state.examLast=normalizeExamLast(saved.examLast);state.chemRead=normalizeChemRead(saved.chemRead);
  state.computerTrack=['all','a','b'].includes(saved.computerTrack)?saved.computerTrack:'all';
  state.practice=normalizePractice(saved.practice);
 }
}catch{storageOK=false;}
state.choiceMistakes=normalizeChoiceMistakes((()=>{try{return JSON.parse(localStorage.getItem('xuezhi-v1')||'null')?.choiceMistakes;}catch{return null;}})());
function restoreChoiceBankRound(){
 try{
  const raw=JSON.parse(localStorage.getItem('xuezhi-v1')||'null')?.choiceBankRound;
  if(!raw||!Array.isArray(raw.items)||!raw.items.length||!raw.answers)return null;
  const items=raw.items.filter(item=>item&&typeof item.key==='string'&&validPracticeQuestion(item.q));
  if(items.length!==raw.items.length||new Set(items.map(item=>item.key)).size!==items.length)return null;
  const answers=Object.create(null);
  for(const item of items){
   const choice=raw.answers[item.key];
   if(Number.isInteger(choice)&&choice>=0&&choice<item.q.options.length)answers[item.key]=choice;
  }
  return {items,answers,subject:raw.subject||''};
 }catch{return null;}
}
state.choiceBankRound=restoreChoiceBankRound();
restoreCompleteMistakes();
function done(id){const summary=state.practice.summaries[id];return summary?summary.passed:state.answers[id]?.correct===true;}
function stats(course){if(course==='chemistry')return{total:CHEM_TERM_LESSONS.length,count:state.chemRead.length};const list=LESSONS.filter(l=>l.course===course);return{total:list.length,count:list.filter(l=>done(l.id)).length};}
function syncNav(){
 const [page,id]=location.hash.slice(1).split('/');
 const key=page==='chem-paper'||page==='chem-drill'?'chem-exams':page==='chem-guide'?'chem-priorities':page==='chem-point'||page==='chem-core'?'chemistry':page==='course'?id:['lesson','exercise'].includes(page)?getItem(id)?.course:page==='practice'?'practice':page==='corrections'?'materials':page||'home';
 document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.dataset.nav===key));
 $('#reviewCount').textContent=Object.keys(state.choiceMistakes).length+Object.keys(state.completeMistakes||{}).length;
}
function save(){try{localStorage.setItem('xuezhi-v1',JSON.stringify(state));}catch{storageOK=false;}syncNav();}
function shell(body,label='学习总览'){
 const date=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
 $('#app').innerHTML=`<div class="topline"><span>我的学习空间 / ${escapeHTML(label)}</span><span>${date}</span></div>${body}${!storageOK?'<p class="condition">当前浏览器无法保存进度；本次学习仍可继续，关闭页面后记录可能丢失。</p>':''}`;syncNav();if(isTextbookRoute())typesetTextbook($('#app'));
}
function computerTabs(selected){return `<nav class="course-tabs" aria-label="计算机学习栏目">${[['concept','course/computer','概念学习'],['practice','practice/computer','原题与程序练习'],['materials','materials','资料索引'],['corrections','corrections','核对说明']].map(([key,url,label])=>`<a href="#${url}" ${key===selected?'aria-current="page" class="selected"':''}>${label}</a>`).join('')}</nav>`;}
function card(id){const c=COURSES[id],s=stats(id);return `<a class="course-card ${s.total?'':'waiting'}" href="#course/${id}"><div class="card-top"><span class="symbol">${c.symbol}</span><span class="badge">${s.total?(id==='computer'?'按课件整理':'可开始学习'):'等待教材'}</span></div><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.desc)}</p>${s.total?`<div class="progress"><span style="width:${s.count/s.total*100}%"></span></div>`:''}<div class="card-foot"><span>${s.total?`${s.total} 个${id==='chemistry'?'知识点 · 已学':'核心概念 · 已通过'} ${s.count} 个`:'内容暂未填充'}</span><span>${s.total?'进入学习':'查看说明'} ↗</span></div></a>`;}
function home(){
 const last=getItem(state.last),open=Object.keys(COURSES).filter(id=>stats(id).total).length;
 shell(`<div class="hero"><div><p class="eyebrow">LESS, BUT CLEARER</p><h1>把知识，<br>一点点学明白。</h1><p>从一句话理解概念，用一张地图连接知识，<br>再用一组小题，确认自己真的懂了。</p><a class="btn" href="${last?itemURL(last):'#course/calculus'}">${last?'继续学习 · '+escapeHTML(last.title.split('：')[0]):'从高等数学开始'} →</a></div><div class="hero-art" aria-label="曲线与切线的数学示意图"><svg viewBox="0 0 450 240" fill="none" aria-hidden="true"><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" stroke="#b7c8ab" stroke-opacity=".35"/></pattern></defs><rect width="450" height="240" fill="url(#grid)"/><path d="M45 174H405M100 210V30" stroke="#9bb28e"/><path d="M60 190 Q200 205 335 45" stroke="#42775d" stroke-width="2.5"/><path d="M125 213L354 74" stroke="#9aa87a" stroke-width="1.5" stroke-dasharray="6 6"/><circle cx="242" cy="142" r="5" fill="#42775d"/><text x="310" y="41" fill="#42775d" font-size="23" font-family="serif" font-style="italic">f(x)</text><text x="265" y="167" fill="#728366" font-size="17" font-family="serif">Δy / Δx</text></svg><span class="art-label">变化有迹可循，理解有路可走。</span></div></div><div class="section-head"><h2>选择你的学科</h2><span>4 个学习入口 · ${open} 科已开放</span></div><div class="cards">${Object.keys(COURSES).map(card).join('')}</div><a class="update-strip" href="#math-library/calculus"><span class="pill">本次更新</span><span>高数与线代已按资料重排，新增独立知识点、期中真题、解析及考点练习。</span><span>去学习 →</span></a><div class="principle"><span>01　先懂概念，再记公式</span><span>02　连接前后，建立框架</span><span>03　小题检验，及时回看</span></div>`);
}
function row(l,i){return `<a class="lesson-row" href="${itemURL(l)}"><span class="lesson-number">${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHTML(l.title)}</strong><p>${escapeHTML(l.core||l.sourceLabel||'')}</p></div><span class="state">${l.kind==='guided'?'程序思路 →':state.review.includes(l.id)?'↺ 待巩固':done(l.id)?'✓ 已通过':state.answers[l.id]?'↺ 待巩固':'学习 →'}</span></a>`;}
function course(id){
 if(id==='chemistry')return chemistryCourse();
 if(MATH_STUDY_ORDER[id])return mathCourse(id);
 const c=COURSES[id];if(!c)return notFound();
 const list=LESSONS.filter(l=>l.course===id),isCS=id==='computer';
 if(!list.length){shell(`<div class="crumb"><a href="#home">← 返回总览</a></div><div class="panel empty"><div class="symbol">${c.symbol}</div><span class="pill">等待教材目录</span><h1 style="font-size:30px;margin-top:20px">${escapeHTML(c.title)}</h1><p>这个学习入口已经准备好，内容暂时留空。<br>之后把教材目录或课程索引发到聊天里，我们再按你的课程填充知识框架、概念与练习。</p><a class="btn secondary" href="#home">先学习其他学科 →</a></div>`,c.title);return;}
 const s=stats(id);
 shell(`<div class="crumb"><a href="#home">← 返回总览</a></div><p class="eyebrow">${c.tag}</p><h1>${escapeHTML(c.title)}</h1><p class="course-description">${escapeHTML(c.desc)}</p>${isCS?computerTabs('concept'):''}<div class="panel" style="padding:20px 24px"><span class="label">学习主线</span><p style="margin:9px 0 13px">${escapeHTML(c.path)}</p><div class="progress"><span style="width:${s.count/s.total*100}%"></span></div><span class="condition">已通过 ${s.count} / ${s.total} 个概念的小题 · ${escapeHTML(c.note||'通用基础版，后续可按教材调整')}</span></div>${isCS?`<div class="scope-filter" role="group" aria-label="选择课件范围">${[['all','全部资料'],['a','按课件 1'],['b','按课件 2']].map(([value,label])=>`<button data-track="${value}" aria-pressed="${state.computerTrack===value}" class="chip ${state.computerTrack===value?'selected':''}">${label}</button>`).join('')}<span class="condition">同名章节按知识点合并，不混用原章号。</span></div>`:''}<div class="tools"><input id="search" type="search" placeholder="搜索概念，如：${escapeHTML(c.search||(id==='calculus'?'导数、极限':'矩阵、向量'))}" aria-label="搜索本学科概念"><span id="filterCount" class="condition"></span></div><div id="lessonList"></div>`,c.title);
 function filter(){
  const term=$('#search').value.trim().toLowerCase();
  const filtered=list.filter(l=>(!isCS||state.computerTrack==='all'||l.track===state.computerTrack||l.track==='both')&&(l.title+l.core+l.chapter+l.formula).toLowerCase().includes(term));
  $('#filterCount').textContent=`显示 ${filtered.length} 个概念 · 可按主线学习，也可直接查看`;
  $('#lessonList').innerHTML=[...new Set(filtered.map(l=>l.chapter))].map(ch=>`<section class="chapter"><div class="chapter-title">${escapeHTML(ch)}</div>${c.chapters?.[ch]?`<p class="chapter-desc">${escapeHTML(c.chapters[ch])}</p>`:''}${filtered.filter(l=>l.chapter===ch).map(l=>row(l,list.indexOf(l))).join('')}</section>`).join('')||'<p class="no-result">没有匹配的概念，试试更短的关键词，或切换课件范围。</p>';
 }
 $('#search').addEventListener('input',filter);
 document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{state.computerTrack=b.dataset.track;save();document.querySelectorAll('[data-track]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b));});filter();}));filter();
}
function sourceLabel(ref){
 const s=MATERIALS.find(s=>s.id===ref.id);if(!s)return '来源未找到';
 const unit=s.format==='.docx'?'文档':`${s.unitLabel} ${ref.from}${ref.to!==ref.from?'–'+ref.to:''}`;
 return `${s.collection} · ${s.name} · ${unit}`;
}
function sourcesHTML(sources){return sources?.length?`<div class="source-links"><span class="label">回到原资料</span>${sources.map(ref=>`<a href="#${ref.id.startsWith('chem-')?'chem-materials':'materials'}/${ref.id}">${escapeHTML(sourceLabel(ref))} ↗</a>`).join('')}<p class="condition">页码按原文件顺序计数；文档练习以题号定位。讲解为整理改写，图片与公式细节以原件为准。</p></div>`:'';}
function sidePanel(item,prereq){return `<div class="right-panel"><div class="panel"><span class="label">学习坐标</span><p>${item.kind?'先理解题意，再看解析。':'先理解，再练习。<br>约 3–5 分钟 / 概念'}</p><hr><strong>${item.kind?'相关概念':'先备知识'}</strong>${prereq.length?prereq.map(id=>{const x=getItem(id);return `<a href="${itemURL(x)}">${escapeHTML(x.title.split('：')[0])} ↗</a>`;}).join(''):'<p>从这里开始即可。</p>'}<hr><button class="btn secondary" id="reviewToggle" style="width:100%"></button><p>想多看一遍，就留到复习里。</p><a href="#course/${item.course}">查看知识地图 →</a>${item.course==='computer'?'<a href="#practice/computer">练习与程序思路 →</a>':item.course==='chemistry'?'<a href="#chem-practice">化学课堂练习 →</a>':''}</div></div>`;}
function bindReview(item){
 function update(){$('#reviewToggle').textContent=state.review.includes(item.id)?'✓ 已加入复习 · 移除':'＋ 加入复习';}
 $('#reviewToggle').addEventListener('click',()=>{state.review=state.review.includes(item.id)?state.review.filter(x=>x!==item.id):[...state.review,item.id];save();update();});update();return update;
}
function quizHTML(item){if(!item.kind&&PRACTICE_TOPICS.has(item.id))return lessonPracticeHTML(item);return `<section class="panel" id="quiz"><span class="label">${item.kind?'先自己试一试':'一道小题，检验理解'}</span><h3 style="margin-top:12px">${escapeHTML(item.question)}</h3>${item.hint?`<details><summary>给我一点提示</summary><p>${escapeHTML(item.hint)}</p></details>`:''}<div>${item.options.map((o,i)=>`<button class="choice" data-choice="${i}" aria-pressed="false">${String.fromCharCode(65+i)}　${escapeHTML(o)}</button>`).join('')}</div><div id="feedback" aria-live="polite"></div><button type="button" class="btn secondary" id="retrySingleChoice" hidden></button><p class="condition">${escapeHTML(item.quizOrigin||'题目按原资料整理或改编；题干与实现约定已在上方说明。')} · 提交后锁定。答错自动加入错题集。</p></section>`;}
function bindQuiz(item,updateReview){
 if(!item.kind&&PRACTICE_TOPICS.has(item.id))return bindLessonPractice(item,updateReview);
 function result(choice,restore=false){
  if(!restore&&state.answers[item.id])return;
  document.querySelectorAll('#quiz [data-choice]').forEach(b=>{b.disabled=true;const selected=Number(b.dataset.choice)===choice;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});
  const correct=choice===item.answer;
  $('#feedback').innerHTML=`<div class="feedback ${correct?'correct':''}"><strong>${correct?'✓ 理解正确':'再想一想'}</strong><div>${escapeHTML(item.explanation)}</div>${correct?'':`<div style="margin-top:6px">正确答案：${String.fromCharCode(65+item.answer)}。</div>`}</div>`;
  const next=$('#retrySingleChoice');next.hidden=false;next.textContent=correct?'开始下一轮':'开始订正';
  if(!restore){trackChoice('single:'+item.id,item,choice);state.answers[item.id]={choice,correct};if(correct)state.review=state.review.filter(x=>x!==item.id);else if(!state.review.includes(item.id))state.review.push(item.id);save();updateReview();}
 }
 document.querySelectorAll('#quiz [data-choice]').forEach(b=>b.addEventListener('click',()=>result(Number(b.dataset.choice))));
 $('#retrySingleChoice').addEventListener('click',()=>{
  if(!state.answers[item.id])return;
  delete state.answers[item.id];
  save();route();
 });
 const old=state.answers[item.id];if(old&&Number.isInteger(old.choice)&&old.choice>=0&&old.choice<item.options.length)result(old.choice,true);
}
function showLesson(id,focus=false){
 const l=LESSONS.find(l=>l.id===id);if(!l||(focus&&(!l.mathStudy||l.scope==='later')))return notFound();state.last=id;save();
 const c=COURSES[l.course],list=LESSONS.filter(a=>a.course===l.course&&(!focus||a.scope!=='later')),index=list.indexOf(l),next=list[index+1],prev=list[index-1];
 shell(`<div class="crumb"><a href="#course/${l.course}">← ${escapeHTML(c.title)}</a> / ${escapeHTML(l.chapter)}</div><p class="eyebrow">CONCEPT ${String(index+1).padStart(2,'0')} / ${list.length}</p><h1 style="font-size:32px">${escapeHTML(l.title)}</h1><div class="lesson-layout"><div>${l.mathStudy?mathTabs(l.course,focus?'review':'study'):''}${studyModeToolbar()}${studyVisualHTML(l.id)}${beginnerGuideHTML(l)}${studyDetailHTML(l)}${quizHTML(l)}${mathDailyHTML(l)}<div class="actions">${prev?`<a class="btn secondary" href="#${focus?'math-focus':'lesson'}/${prev.id}">← 上一个概念</a>`:''}<a class="btn" href="#${next?(focus?'math-focus/':'lesson/')+next.id:(focus?'math-review/':'course/')+l.course}">${next?'下一个概念 →':'返回知识地图 →'}</a></div></div>${sidePanel(l,l.prereq)}</div>`,c.title);
 bindQuiz(l,bindReview(l));bindMathDaily(l);
}
function practice(){
 const list=EXERCISES.filter(x=>x.course==='computer'),choices=list.filter(x=>x.kind==='choice'),guided=list.filter(x=>x.kind==='guided');
 shell(`<div class="crumb"><a href="#course/computer">← 大学计算机基础</a></div><p class="eyebrow">PRACTICE & THINK</p><h1>把会的，做出来。</h1><p class="course-description">从上传的题目中选择可核对内容，补清前提，保留题号。每题都能回看相关概念。</p>${computerTabs('practice')}<div class="summary-strip"><span><strong>${choices.length}</strong> 道单选 / 改编题</span><span><strong>${guided.length}</strong> 道程序思路</span><span>单选已通过 <strong>${choices.filter(x=>done(x.id)).length}</strong></span></div><p class="condition">程序题提供思路、参考代码与边界样例，暂不提供在线编译或自动判题。历史题目不代表当前考试范围。</p><div class="tools"><input id="exerciseSearch" type="search" placeholder="搜索题目，如：栈、补码、字符串" aria-label="搜索练习"><select id="exerciseKind" aria-label="选择题型"><option value="all">全部题型</option><option value="choice">单选与改编题</option><option value="guided">程序思路</option></select></div><div id="exerciseList"></div>`,'计算机练习');
 function filter(){const term=$('#exerciseSearch').value.trim().toLowerCase(),kind=$('#exerciseKind').value;const found=list.filter(l=>(kind==='all'||l.kind===kind)&&(l.title+l.question+l.sourceLabel).toLowerCase().includes(term));$('#exerciseList').innerHTML=found.map(l=>row(l,list.indexOf(l))).join('')||'<p class="no-result">没有匹配的题目，试试其他关键词。</p>';}
 $('#exerciseSearch').addEventListener('input',filter);$('#exerciseKind').addEventListener('change',filter);filter();
}
function showExercise(id){
 const item=EXERCISES.find(x=>x.id===id);if(!item)return notFound();if(item.course==='chemistry')return chemistryExercise(item);state.last=id;save();
 const guided=item.kind==='guided',index=EXERCISES.indexOf(item),next=EXERCISES[index+1];
 shell(`<div class="crumb"><a href="#practice/computer">← 计算机原题与程序练习</a></div><p class="eyebrow">${guided?'PROGRAMMING GUIDE':'PRACTICE'} ${index+1} / ${EXERCISES.length}</p><h1 style="font-size:30px">${escapeHTML(item.title)}</h1><p class="source-origin">${escapeHTML(item.sourceLabel)}</p><div class="lesson-layout"><div>${guided?`<section class="panel"><span class="label">先读清任务</span><p class="concept-lead">${escapeHTML(item.question)}</p><p class="condition">下方代码以有效参数和足够的可访问存储为前提。输入读取由调用方负责。</p><details><summary>查看解题步骤与参考代码</summary><ol class="steps">${item.steps.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ol><pre><code>${escapeHTML(item.code)}</code></pre></details><h3 style="margin-top:24px">用这些边界样例自查</h3><div class="table-wrap"><table><thead><tr><th>输入 / 场景</th><th>预期结果</th></tr></thead><tbody>${item.checks.map(([a,b])=>`<tr><td>${escapeHTML(a)}</td><td>${escapeHTML(b)}</td></tr>`).join('')}</tbody></table></div><p class="condition">这里提供参考与自查，不自动标记为通过。代码使用 C 语法，需在自己的开发环境编译运行。</p></section>`:quizHTML(item)}<section class="panel">${sourcesHTML(item.sources)}</section><div class="actions"><a class="btn secondary" href="#practice/computer">返回练习列表</a>${next?`<a class="btn" href="#exercise/${next.id}">下一题 →</a>`:''}</div></div>${sidePanel(item,item.related)}</div>`,'计算机练习');
 const update=bindReview(item);if(!guided)bindQuiz(item,update);
}
function review(){
 const list=state.review.map(getItem).filter(Boolean).filter(x=>!reviewSubject()||x.course===reviewSubject());
 shell(`<h1>错题集与薄弱点</h1>${subjectReviewLinks()}${webProgressHTML()}${mistakeBankHTML()}${completeMistakeHTML()}<section class="panel"><h2>待巩固知识点</h2>${list.length?list.map(row).join(''):'<p>暂时没有待巩固知识点。</p>'}</section>`,'错题集');
 bindMistakeBank();bindCompleteMistakes();bindWebProgress();
}
/* 网页版没有桌面菜单：进度用浏览器下载与本地文件导入，字段校验与桌面版一致。 */
function webProgressHTML(){
 if(window.studyDesktop)return '';
 return `<section class="panel" id="webProgress"><h2>学习进度</h2><p class="condition">网页版把进度保存在当前浏览器的本地存储中：换浏览器、换电脑或清理缓存都会丢失，建议定期导出备份。</p><div class="actions"><button class="btn secondary" id="progressExport" type="button">导出学习进度</button><label class="btn secondary" for="progressImport" role="button" tabindex="0">导入学习进度</label><input id="progressImport" type="file" accept=".json,application/json" hidden></div><p class="condition">导出得到 JSON 文件，可在别的浏览器或用桌面版导入。</p></section>`;
}
function applyImportedProgress(imported){
 if(!imported||typeof imported!=='object'||!imported.answers||typeof imported.answers!=='object'||!Array.isArray(imported.review))throw new Error('Invalid data');
 const ids=new Set(ALL_ITEMS.map(item=>item.id));state.answers=Object.fromEntries(Object.entries(imported.answers).filter(([id,v])=>ids.has(id)&&v&&typeof v.correct==='boolean'));state.studyMode=normalizeStudyMode(imported.studyMode);state.practice=normalizePractice(imported.practice);state.mathAnswers=normalizeMathAnswers(imported.mathAnswers);state.mathLast=normalizeMathLast(imported.mathLast);state.examAnswers=normalizeExamAnswers(imported.examAnswers);state.examLast=normalizeExamLast(imported.examLast);state.chemRead=normalizeChemRead(imported.chemRead);state.chemFocusLast=normalizeChemFocusLast(imported.chemFocusLast);
 state.review=imported.review.filter(id=>ids.has(id));state.last=ids.has(imported.last)?imported.last:null;save();
}
function bindWebProgress(){
 if(window.studyDesktop)return;
 const exp=$('#progressExport'),imp=$('#progressImport');if(!exp||!imp)return;
 exp.addEventListener('click',()=>{
  const stamp=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).replace(/\//g,'');
  const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=`学知学习进度-${stamp}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
 });
 imp.addEventListener('change',async()=>{
  const file=imp.files&&imp.files[0];if(!file)return;
  try{if(file.size>1_000_000)throw new Error('too large');applyImportedProgress(JSON.parse(await file.text()));alert('学习进度已导入。');route();}
  catch{alert('未能导入进度，请选择学知导出的 JSON 文件。');}
  finally{imp.value='';}
 });
}
function materialCard(s){
 return `<article class="panel material-card" id="${s.id}"><div class="material-top"><span class="pill">${escapeHTML(s.collection)}</span><span class="condition">${s.format.slice(1).toUpperCase()} · ${s.units} ${s.unitLabel}</span></div><h3>${escapeHTML(s.name)}</h3><p>${escapeHTML(s.note)}</p>${openMaterialButton(s)}${window.studyDesktop?`<details><summary>原文件位置</summary><p class="condition">桌面版附带原件；来源文件未改写。</p><input readonly class="file-path" aria-label="${escapeHTML(s.name)} 原文件路径" value="${escapeHTML(s.file)}"></details>`:''}</article>`;
}
function materials(focus){
 const pool=MATERIALS.filter(s=>!s.id.startsWith('chem-')&&!s.id.startsWith('math-'));
 shell(`<div class="crumb"><a href="#course/computer">← 大学计算机基础</a></div><p class="eyebrow">YOUR COURSE MATERIALS</p><h1>资料有出处，知识有来路。</h1><p class="course-description">已建立 ${pool.length} 份资料索引：14 份课件、3 份 PDF、3 份 Word 文档。课件共 ${pool.filter(s=>['.ppt','.pptx'].includes(s.format)).reduce((n,s)=>n+s.units,0)} 张幻灯片；当前软件提供核心导学与选择性练习整理。</p>${computerTabs('materials')}<div class="notice">两套课件的章节顺序不同，页面中的模块号是整理后的学习顺序。答案表缺少题干的部分保留对照，不自动匹配其他版本题目。<a href="#corrections">查看已发现的核对事项 →</a></div><div class="tools"><input id="materialSearch" type="search" aria-label="搜索资料" placeholder="搜索资料文件名或文件夹"></div><div id="materialsList"></div>`,'计算机资料索引');
 function filter(){const term=$('#materialSearch').value.trim().toLowerCase();const found=pool.filter(s=>(s.name+s.collection+s.note).toLowerCase().includes(term));$('#materialsList').innerHTML=found.map(materialCard).join('')||'<p class="no-result">没有匹配的资料。</p>';}
 $('#materialSearch').addEventListener('input',filter);filter();
 if(focus){const target=document.getElementById(focus);if(target){target.classList.add('source-focus');target.scrollIntoView({block:'start'});}}
}
function corrections(){shell(`<div class="crumb"><a href="#course/computer">← 大学计算机基础</a></div><p class="eyebrow">CHECK & CLARIFY</p><h1>把容易混淆的地方说清楚。</h1><p class="course-description">这些是整理时已确认的错误、缺失或边界问题。它们说明了采用的处理方式，不表示所有原题都已逐一核验。</p>${computerTabs('corrections')}${MATERIAL_CORRECTIONS.map(n=>`<article class="panel"><span class="label">${escapeHTML(n.location)}</span><h2 style="margin-top:12px">${escapeHTML(n.title)}</h2><p><strong>原资料：</strong>${escapeHTML(n.original)}</p><div class="notice"><strong>本软件采用：</strong>${escapeHTML(n.corrected)}</div><p class="condition">${escapeHTML(n.reason)}</p>${n.related?`<a class="btn secondary" href="#lesson/${n.related}">回看对应概念 →</a>`:''}${sourcesHTML(n.sources)}</article>`).join('')}`,'资料核对说明');}
function notFound(){shell('<div class="panel empty"><h2>没有找到这个学习页面</h2><a class="btn" href="#home">返回学习总览</a></div>');}
function route(){
 chemExamDrillRefresh=null;
 const [page,id]=location.hash.slice(1).split('/');window.scrollTo(0,0);
 if(page==='choice-round')showFixedChoiceRound(id);else if(page==='chem-unit-test')chemistryUnitTest();else if(page==='chem-quick')chemistryQuickReview();else if(page==='math-library')mathLibrary(id);else if(page==='math-paper')mathPaper(id);else if(page==='math-drill')mathDrill(id);else if(page==='math-review')mathCourse(id,true);else if(page==='math-focus')showLesson(id,true);else if(page==='chem-exam-review'){if(id)showChemPoint(id,true);else chemistryExamReview();}else if(page==='chem-exams')chemistryExams();else if(page==='chem-paper')chemistryPaper(id);else if(page==='chem-drill')chemistryExamDrill(id);else if(page==='chem-priorities')chemistryReviewPriorities();else if(page==='chem-guide')chemistryGuide(id);else if(page==='chem-point')showChemPoint(id);else if(page==='chem-core')chemistryCourseLegacy();else if(page==='chem-terms')chemistryTerms(id);else if(page==='chem-practice')chemistryPractice();else if(page==='chem-materials')chemistryMaterials(id);else if(page==='chem-answers')chemistryAnswers();else if(page==='chem-notes')chemistryNotes();else if(page==='course')course(id);else if(page==='lesson')showLesson(id);else if(page==='exercise')showExercise(id);else if(page==='practice'&&id==='computer')practice();else if(page==='review')review();else if(page==='materials')materials(id);else if(page==='corrections')corrections();else if(!page||page==='home')home();else notFound();
}
initStudyModeEvents();initChemExamEvents();window.addEventListener('hashchange',route);route();
