function newPracticeSeed(){
 try{const a=new Uint32Array(1);globalThis.crypto.getRandomValues(a);return a[0];}catch{return(Math.floor(Math.random()*0x100000000)^Date.now())>>>0;}
}
function ensurePractice(lesson,replace=false){
 let batch=state.practice.batches[lesson.id];
 if(!batch||replace||(lesson.mathStudy&&batch.curriculumRevision!==MATH_CURRICULUM_REVISION)){
  const avoid=batch?batch.questions.map(q=>q.key):[];
  let best=null,bestFresh=-1;
  for(let attempt=0;attempt<8;attempt++){
   const next=makePracticeSet(lesson.id,newPracticeSeed(),avoid),fresh=next.questions.filter(q=>!avoid.includes(q.key)).length;
   if(fresh>bestFresh){best=next;bestFresh=fresh;}if(!avoid.length||fresh===3)break;
  }
  batch=best;state.practice.batches[lesson.id]=batch;
  state.practice.history[lesson.id]=[...(state.practice.history[lesson.id]||[]),...batch.questions.map(q=>q.key)].slice(-18);
  save();
 }
 return batch;
}
function practiceContents(lesson){
 const batch=ensurePractice(lesson),answered=batch.answers.filter(a=>a&&a.choice!==null).length,complete=answered===3;
 const firstScore=complete?batch.answers.filter(a=>a.firstCorrect).length:null;
 const passed=complete&&batch.answers.every(a=>a.correct);
 return `<div class="practice-heading"><div><span class="label">一组练习 · 3 道题</span><h2>用不同角度检验理解</h2><p class="condition">本轮已提交 ${answered} / 3 题。全部提交后才能订正，全对后才能换组。</p></div><button type="button" class="btn secondary" id="newPractice" ${passed?'':'disabled'}>开始下一轮</button>${complete&&!passed?'<button type="button" class="btn secondary" id="correctPractice">开始统一订正</button>':''}</div><p class="practice-hint">数值题会更换参数；概念题从有限的场景题中抽取，练习时仍可能重复。</p><div class="practice-questions">${batch.questions.map((q,i)=>{
  const a=batch.answers[i],hasAnswer=a&&a.choice!==null;
  return `<article class="practice-question" data-practice-question="${i}"><div class="practice-number">${String(i+1).padStart(2,'0')} <span>${escapeHTML(q.skill||'理解与应用')}</span></div><h3>${escapeHTML(q.question)}</h3>${q.options.map((option,j)=>`<button type="button" class="choice ${hasAnswer&&a.choice===j?'selected':''}" data-practice-choice="${j}" data-practice-index="${i}" aria-pressed="${hasAnswer&&a.choice===j}" ${hasAnswer?'disabled':''}>${String.fromCharCode(65+j)}　${escapeHTML(option)}</button>`).join('')}<div class="practice-feedback" id="practice-feedback-${i}" aria-live="polite" tabindex="-1">${hasAnswer?`<div class="feedback ${a.correct?'correct':''}"><strong>${a.correct?'✓ 回答正确':'再看一步'}</strong><div>${escapeHTML(q.explanation)}</div>${a.correct?'':`<div>正确答案：${String.fromCharCode(65+q.answer)} · ${escapeHTML(q.options[q.answer])}</div>`}</div>`:''}</div></article>`;
 }).join('')}</div><div id="practiceResult" aria-live="polite">${complete?`<div class="practice-result ${passed?'passed':''}"><strong>${passed?'本组通过':'等待订正'}</strong> · 首次答对 ${firstScore} / 3 题。${passed?'已全部作对，可以开启下一轮。':'本轮已提交，可以统一订正错题。'}</div>`:''}</div>${lesson.mathStudy&&typeof mathTraceHTML==='function'?mathTraceHTML(lesson):''}<p><a href="#review">打开错题集 →</a></p>`;
}
function lessonPracticeHTML(lesson){return `<section class="panel practice-panel" id="quiz" aria-label="知识点练习">${practiceContents(lesson)}</section>${lesson.course==='chemistry'&&lesson.studyKind!=='chem-point'?chemDailyExamHTML(lesson):''}`;}
function bindLessonPractice(lesson,updateReview){
 const panel=$('#quiz');
 function refresh(focusIndex){panel.innerHTML=practiceContents(lesson);if(lesson.mathStudy)typesetTextbook(panel);updateReview();if(Number.isInteger(focusIndex))document.getElementById('practice-feedback-'+focusIndex)?.focus({preventScroll:true});}
 panel.addEventListener('click',event=>{
  if(event.target.closest('#newPractice')){
   if(!state.practice.batches[lesson.id].answers.every(a=>a?.correct))return;
   ensurePractice(lesson,true);refresh();panel.scrollIntoView({block:'start',behavior:'smooth'});return;
  }
  if(event.target.closest('#correctPractice')){
   const answers=state.practice.batches[lesson.id].answers;
   if(!answers.every(a=>a&&a.choice!==null))return;
   for(const a of answers)if(!a.correct){a.choice=null;a.correct=null;}
   save();refresh();return;
  }
  const button=event.target.closest('[data-practice-choice]');if(!button)return;
  const i=Number(button.dataset.practiceIndex),choice=Number(button.dataset.practiceChoice),batch=state.practice.batches[lesson.id],q=batch?.questions[i],previous=batch?.answers[i];
  if(!q||!Number.isInteger(choice)||choice<0||choice>=q.options.length||(previous&&previous.choice!==null))return;
  const correct=choice===q.answer,firstCorrect=previous?previous.firstCorrect:correct;
  batch.answers[i]={choice,correct,firstCorrect,tries:(previous?.tries||0)+1};
  trackChoice('practice:'+lesson.id+':'+q.key,q,choice);
  if(!correct&&!state.review.includes(lesson.id))state.review.push(lesson.id);
  if(batch.answers.every(a=>a&&a.choice!==null)){
   const score=batch.answers.filter(a=>a.firstCorrect).length,old=state.practice.summaries[lesson.id];
   state.practice.summaries[lesson.id]={passed:batch.answers.every(a=>a.correct),firstScore:score,completed:(old?.completed||0)+(batch.counted?0:1)};
   batch.counted=true;
   if(batch.answers.every(a=>a.correct))state.review=state.review.filter(id=>id!==lesson.id);else if(!state.review.includes(lesson.id))state.review.push(lesson.id);
  }
  save();refresh(i);
 });
}
