const chemistryUnitSession={order:[],page:0,chapters:[]};
try{
  const saved=JSON.parse(localStorage.getItem('xuezhi-unit-session'));
  if(Array.isArray(saved?.ids)){
    const bank=new Map(CHEM_UNIT_QUESTIONS.map(q=>[q.id,q]));
    chemistryUnitSession.order=[...new Set(saved.ids)].map(id=>bank.get(id)).filter(Boolean);
    chemistryUnitSession.chapters=[...new Set(chemistryUnitSession.order.map(q=>q.chapter))];
    const max=Math.max(0,Math.ceil(chemistryUnitSession.order.length/6)-1);
    chemistryUnitSession.page=Number.isInteger(saved.page)?Math.max(0,Math.min(max,saved.page)):0;
  }
}catch{}
const chemQuestionStorage='xuezhi-question-position';
let chemPendingQuestion=null,chemPointOrigin=null;
function chemSavedQuestion(module){
  try{return JSON.parse(localStorage.getItem(chemQuestionStorage+module));}catch{return null;}
}
function chemPositionButton(module){
  return `<p><button class="btn secondary" data-chem-resume="${module}" ${chemSavedQuestion(module)?String(): "disabled"}>定位至上次题目</button></p>`;
}
function chemResumeQuestion(position){
  if(!position)return;
  chemPendingQuestion=position.id;
  if(location.hash===position.route)route();
  else location.hash=position.route;
}
function chemResumePage(questions,size){
  if(!chemPendingQuestion)return null;
  const index=questions.findIndex(q=>q.id===chemPendingQuestion);
  if(index<0){chemPendingQuestion=null;return null;}
  const id=chemPendingQuestion;
  chemPendingQuestion=null;
  requestAnimationFrame(()=>{
    const card=document.getElementById('complete-q-'+id)||document.getElementById('exam-q-'+id);
    if(card){
      card.tabIndex=-1;
      card.focus({preventScroll:true});
      card.scrollIntoView({block:'start'});
    }
  });
  return Math.floor(index/size);
}
if(typeof document!=='undefined')document.addEventListener('click',event=>{
  const resume=event.target.closest('[data-chem-resume]');
  if(resume){chemResumeQuestion(chemSavedQuestion(resume.dataset.chemResume));return;}
  const back=event.target.closest('[data-chem-back-question]');
  if(back){chemResumeQuestion(chemPointOrigin);return;}
},true);
function chemRecordQuestion(event){
  const card=event.target.closest('[data-complete-q],article[id^="exam-q-"]');
  const route=location.hash;
  if(!card||!/^#chem-(unit-test|drill|paper)(?:\/|$)/.test(route))return;
  const module=route==='#chem-unit-test'?'unit':'exam';
  const position={route,id:card.dataset.completeQ||card.id.slice(7)};
  try{localStorage.setItem(chemQuestionStorage+module,JSON.stringify(position));document.querySelector(`[data-chem-resume="${module}"]`)?.removeAttribute("disabled");}catch{}
  const link=event.target.closest('a[data-chem-question-point]');
  if(link)chemPointOrigin={...position,point:link.hash};
}
if(typeof document!=='undefined')document.addEventListener('click',chemRecordQuestion,true);
if(typeof document!=='undefined')document.addEventListener('input',chemRecordQuestion,true);
function chemPointReturn(){
  return chemPointOrigin?.point===location.hash?'<p><button class="btn secondary" data-chem-back-question>← 返回刚才的题目</button></p>':'';
}
function chemistryUnitTest(){
  chemExamDrillRefresh=null;
  let {order,page}=chemistryUnitSession;
  shell(`<h1>大学化学 · 单元检测</h1>${chemistryTabs('unit')}${chemPositionButton('unit')}
    <fieldset><legend>选择一个或多个章节</legend>
    ${CHEM_UNIT_CHAPTERS.map(([id,title])=>`<label class="choice"><input type="checkbox" name="unit-chapter" value="${id}" ${chemistryUnitSession.chapters.includes(id)?'checked':''}> 第 ${id} 章 · ${title}（${CHEM_UNIT_QUESTIONS.filter(q=>q.chapter===id).length} 题）</label>`).join('')}</fieldset>
    <div class="actions"><button class="btn" id="unitStart" disabled>开始新测验</button><button class="btn secondary" id="unitShuffle" disabled>打乱题序</button><button class="btn secondary" id="unitReset" disabled>重置本卷</button>
    <label>填空方式 <select id="unitMode"><option value="choice">选项作答</option><option value="text">直接填空</option></select></label></div>
    <p id="completeCount" aria-live="polite">勾选章节后开始。每卷包含所选章节的全部题目。</p>
    <div id="unitList"></div><nav class="paper-pagination"><button class="btn secondary" id="unitPrev" disabled>上一组</button><span id="unitPage"></span><button class="btn" id="unitNext" disabled>下一组</button></nav>
    ${chemistryUnitSources()}`,'大学化学 · 单元检测');
  const selected=()=>[...document.querySelectorAll('input[name="unit-chapter"]:checked')].map(input=>Number(input.value));
  function counter(){
    const done=order.filter(q=>state.completeExamAnswers[q.id]?.submitted);
    const right=done.filter(q=>completeAllCorrect(q,state.completeExamAnswers[q.id]));
    $('#completeCount').textContent=`第 ${[...new Set(order.map(q=>q.chapter))].sort((a,b)=>a-b).join('、')} 章 · 共 ${order.length} 题 · 已完成 ${done.length} · 全对 ${right.length}`;
  }
  function render(){
    page=chemResumePage(order,6)??page;
    Object.assign(chemistryUnitSession,{order,page,chapters:selected()});
    try{localStorage.setItem('xuezhi-unit-session',JSON.stringify({ids:order.map(q=>q.id),page}));}catch{}
    const pages=Math.ceil(order.length/6);
    $('#unitList').innerHTML=order.slice(page*6,page*6+6).map(completeQuestionHTML).join('');
    $('#unitPrev').disabled=page===0;
    $('#unitNext').disabled=page+1>=pages;
    $('#unitPage').textContent=`${page+1} / ${pages}`;
    counter();
  }
  function reset(){
    for(const q of order){
      delete state.completeExamAnswers[q.id];
      q.blanks?.forEach((_,i)=>delete completeOrders[q.id+'-'+i]);
    }
    save();
    page=0;
    render();
  }
  for(const input of document.querySelectorAll('input[name="unit-chapter"]')){
    input.onchange=()=>{$('#unitStart').disabled=!selected().length;};
  }
  $('#unitStart').onclick=()=>{
    const chapters=selected();
    if(!chapters.length)return;
    order=completeShuffle(CHEM_UNIT_QUESTIONS.filter(q=>chapters.includes(q.chapter)));
    $('#unitReset').disabled=$('#unitShuffle').disabled=false;
    reset();
  };
  $('#unitReset').onclick=reset;
  $('#unitShuffle').onclick=()=>{order=completeShuffle(order);page=0;render();};
  $('#unitPrev').onclick=()=>{page--;render();$('#completeCount').scrollIntoView();};
  $('#unitNext').onclick=()=>{page++;render();$('#completeCount').scrollIntoView();};
  $('#unitMode').value=completeMode;
  $('#unitMode').onchange=()=>{completeMode=$('#unitMode').value;if(order.length)render();};
  completeRefresh=counter;
  $('#unitStart').disabled=!selected().length;
  if(order.length){
    $('#unitReset').disabled=$('#unitShuffle').disabled=false;
    render();
  }
}
function chemistryUnitSources(){
  return `<details><summary>原题资料与参考答案</summary>
    <p>原页保留题目、图表和计算题。组卷题数以已录入的可判分题为准。</p>
    ${CHEM_UNIT_CHAPTERS.map(([id,title])=>`<p>第 ${id} 章 ${title} · ${Object.entries(CHEM_UNIT_PHOTOS[id]||{}).map(([page,photo])=>`<a href="materials/unit-test/${photo}.jpg">第 ${page} 页</a>`).join(' · ')}</p>`).join('')}
    <p><a href="materials/unit-test/practice.pdf">大学化学练习题及答案（3 套）</a></p>
  </details>`;
}
