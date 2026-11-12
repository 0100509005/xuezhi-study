/* Offline, seeded template generation. No network, eval, or AI service is required. */
const PRACTICE_TOPICS=new Map();
function practiceRng(seed){let x=seed>>>0;return{next(){x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;},int(a,b){return a+Math.floor(this.next()*(b-a+1));},pick(a){return a[this.int(0,a.length-1)];},shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=this.int(0,i);[b[i],b[j]]=[b[j],b[i]];}return b;}};}
function practiceHash(text){let h=2166136261;for(const ch of text)h=Math.imul(h^ch.charCodeAt(0),16777619);return(h>>>0).toString(36);}
const pretty=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(6)));
function question(prompt,right,wrong,explanation,skill='应用变式'){
 const options=[String(right),...wrong.map(String)];
 if(options.length<3||new Set(options).size!==options.length)throw new Error('Invalid options: '+prompt);
 return{question:prompt,options,answer:0,explanation,skill};
}
function numericQuestion(prompt,right,explanation,skill='计算应用',unit=''){
 const answer=pretty(right)+unit,wrong=[];
 for(const n of [right+1,right-1,right+2,right*2+3,right+5]){const value=pretty(n)+unit;if(value!==answer&&!wrong.includes(value))wrong.push(value);if(wrong.length===2)break;}
 return question(prompt,answer,wrong,explanation,skill);
}
function variants(...cases){const factory=rng=>{const [p,a,b,c,e]=rng.pick(cases);return question(p,a,[b,c],e,'理解辨析');};factory.kind='concept';return factory;}
function topic(id,purpose,intuition,method,factories,extra={}){
 const lesson=LESSONS.find(l=>l.id===id);if(!lesson)throw new Error('Unknown lesson '+id);
 Object.assign(lesson,{purpose,method,simple:intuition,...extra});
 PRACTICE_TOPICS.set(id,{factories});
}
function makePracticeSet(lessonId,seed,avoid=[]){
 const lesson=LESSONS.find(l=>l.id===lessonId)||(typeof CHEM_TERM_LESSONS!=='undefined'?CHEM_TERM_LESSONS.find(l=>l.id===lessonId):null),entry=PRACTICE_TOPICS.get(lessonId);
 if(!lesson||!entry)throw new Error('Missing practice coverage: '+lessonId);
 const rng=practiceRng(seed);
 const factories=entry.factories,concepts=factories.filter(factory=>factory.kind==='concept');let best=null;
 for(let attempt=0;attempt<30;attempt++){
  const examConcepts=concepts.filter(f=>f.examConcept),concept=examConcepts.length?rng.pick(examConcepts):concepts.length?rng.pick(concepts):null;
  const selected=concept?[concept,...rng.shuffle(factories.filter(f=>f!==concept)).slice(0,2)]:rng.shuffle(factories).slice(0,3),seen=new Set(),questions=[];
  for(const factory of selected){const q=factory(rng);const key=practiceHash(q.question+'|'+q.options[q.answer]);if(seen.has(key))break;seen.add(key);
   const correct=q.options[q.answer],options=rng.shuffle(q.options);questions.push({...q,options,answer:options.indexOf(correct),key,...(lesson.mathStudy?{knowledgePoint:lessonId,requires:[...(MATH_DEPENDENCIES[lessonId]||[])],curriculumRevision:MATH_CURRICULUM_REVISION}:{})});}
  if(questions.length!==3)continue;
  const fresh=questions.filter(q=>!avoid.includes(q.key)).length;
  if(!best||fresh>best.fresh)best={questions,fresh};if(fresh===3)break;
 }
 if(!best)throw new Error('Could not create unique questions: '+lessonId);
 return{version:1,lessonId,...(lesson.mathStudy?{curriculumRevision:MATH_CURRICULUM_REVISION}:{}),seed:seed>>>0,id:lessonId+'-'+(seed>>>0).toString(36),questions:best.questions,answers:[null,null,null]};
}
function validPracticeQuestion(q,minOptions=3){return q&&typeof q.question==='string'&&q.question.length<3000&&Array.isArray(q.options)&&q.options.length>=minOptions&&q.options.length<=5&&q.options.every(o=>typeof o==='string'&&o.length<2000)&&new Set(q.options).size===q.options.length&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length&&typeof q.explanation==='string'&&q.explanation.length<5000&&typeof q.key==='string';}
function normalizeCofactorQuestion(id,q){
 if(!['cofactor','adjugate'].includes(id))return q;
 const fix=s=>typeof s==='string'?s.replace(/C([₀-₉ᵢⱼ]+)/g,'A$1'):s;
 return {...q,question:fix(q.question),options:q.options.map(fix),explanation:fix(q.explanation)};
}
function normalizePractice(raw){
 const clean={version:1,batches:{},history:{},mistakes:[],summaries:{}};if(!raw||typeof raw!=='object')return clean;
 for(const [id,b] of Object.entries(raw.batches||{})){
  if(!PRACTICE_TOPICS.has(id)||b?.version!==1||b.lessonId!==id||typeof b.id!=='string'||!Array.isArray(b.questions)||b.questions.length!==3||!b.questions.every(validPracticeQuestion)||!Array.isArray(b.answers)||b.answers.length!==3)continue;
  const answers=b.answers.map((a,i)=>a&&(a.choice===null||Number.isInteger(a.choice)&&a.choice>=0&&a.choice<b.questions[i].options.length)&&typeof a.firstCorrect==='boolean'?{choice:a.choice,correct:a.choice===null?null:a.choice===b.questions[i].answer,firstCorrect:a.firstCorrect,tries:Number.isInteger(a.tries)?Math.max(1,Math.min(a.tries,1000)):1}:null);
  clean.batches[id]={version:1,lessonId:id,curriculumRevision:b.curriculumRevision||0,id:b.id.slice(0,150),seed:b.seed>>>0,questions:b.questions.map(q=>normalizeCofactorQuestion(id,q)),answers,counted:b.counted===true};
 }
 for(const [id,keys] of Object.entries(raw.history||{}))if(PRACTICE_TOPICS.has(id)&&Array.isArray(keys))clean.history[id]=keys.filter(k=>typeof k==='string'&&k.length<30).slice(-18);
 for(const [id,s] of Object.entries(raw.summaries||{}))if(PRACTICE_TOPICS.has(id)&&s&&typeof s.passed==='boolean'&&Number.isInteger(s.firstScore)&&s.firstScore>=0&&s.firstScore<=3)clean.summaries[id]={passed:s.passed,firstScore:s.firstScore,completed:Number.isInteger(s.completed)?Math.max(0,Math.min(s.completed,100000)):1};
 if(Array.isArray(raw.mistakes))clean.mistakes=raw.mistakes.filter(m=>m&&PRACTICE_TOPICS.has(m.lessonId)&&validPracticeQuestion(m.q)&&Number.isInteger(m.choice)&&m.choice>=0&&m.choice<m.q.options.length).slice(-100).map(m=>({...m,q:normalizeCofactorQuestion(m.lessonId,m.q)}));
 return clean;
}

/* Choice rounds share a persistent mistake bank across practice and exams. */
function choiceSnapshot(question){
 return {question:question.question||question.prompt,options:[...question.options],answer:question.answer,explanation:question.explanation||(question.steps||[]).join(' '),key:question.key||question.id};
}
function trackChoice(key,q,choice){
 const old=state.choiceMistakes[key];
 if(choice!==q.answer)state.choiceMistakes[key]={q:choiceSnapshot(q),choice,streak:0};
 else if(old){
  old.streak++;
  if(old.streak>=3)delete state.choiceMistakes[key];
 }
}
function validMistakeQuestion(key,q){
 return validPracticeQuestion(q,key.startsWith('chem:')?2:3);
}
function normalizeChoiceMistakes(saved,restoreMissedChemistry=false){
 const bank=Object.create(null);
 if(saved&&typeof saved==='object'){
  for(const [key,m] of Object.entries(saved)){
   if(key.length<200&&m&&validMistakeQuestion(key,m.q)&&Number.isInteger(m.choice)&&m.choice>=0&&m.choice<m.q.options.length&&Number.isInteger(m.streak)&&m.streak>=0&&m.streak<3)bank[key]=m;
  }
  if(restoreMissedChemistry){
   for(const q of CHEM_EXAM_QUESTIONS.filter(q=>!isChemChoice(q))){
    const choice=state.examAnswers[q.id]?.choice;
    const key='chem:'+q.id;
    if(!bank[key]&&Number.isInteger(choice)&&choice>=0&&choice<q.options.length&&choice!==q.answer){
     bank[key]={q:choiceSnapshot(q),choice,streak:0};
    }
   }
  }
  return bank;
 }
 for(const m of state.practice.mistakes)bank['practice:'+m.lessonId+':'+m.q.key]={q:m.q,choice:m.choice,streak:0};
 for(const [kind,questions,answers] of [['chem',CHEM_EXAM_QUESTIONS,state.examAnswers],['math',MATH_EXAM_QUESTIONS,state.mathAnswers],['single',ALL_ITEMS.filter(q=>Array.isArray(q.options)&&q.options.length>=3),state.answers]]){
  for(const q of questions){
   const a=answers[q.id];
   if(a&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<q.options.length&&a.choice!==q.answer)bank[kind+':'+q.id]={q:choiceSnapshot(q),choice:a.choice,streak:0};
  }
 }
 return bank;
}
function isChemChoice(q){return q.options.length>=3&&!q.number.startsWith('J');}
function fixedChoiceSet(kind,paper){
 return kind==='chem'?CHEM_EXAM_QUESTIONS.filter(q=>q.paper===paper&&isChemChoice(q)):kind==='math'?MATH_EXAM_QUESTIONS.filter(q=>q.paper===paper):[];
}
function fixedAnswers(kind){return kind==='chem'?state.examAnswers:state.mathAnswers;}
function fixedRoundStatus(kind,paper){
 const questions=fixedChoiceSet(kind,paper),answers=fixedAnswers(kind);
 const remaining=questions.filter(q=>!answers[q.id]).length;
 const wrong=questions.filter(q=>answers[q.id]&&answers[q.id].choice!==q.answer);
 return {questions,answers,remaining,wrong};
}
function advanceFixedRound(kind,paper){
 const {questions,answers,remaining,wrong}=fixedRoundStatus(kind,paper);
 if(!questions.length||remaining)return false;
 for(const q of wrong.length?wrong:questions)delete answers[q.id];
 save();
 return true;
}
function fixedRoundControls(kind,q){
 const {remaining,wrong}=fixedRoundStatus(kind,q.paper), key=kind+'@'+q.paper;
 return `<p class="condition">本套选择题${remaining?`还剩 ${remaining} 题未作答，提交后锁定。`:wrong.length?'本轮已交完，可以统一订正。':'本套选择题已全部作对。'} <a href="#choice-round/${encodeURIComponent(key)}">打开本套选择题 →</a></p>`;
}
function showFixedChoiceRound(raw){
 let key;
 try{key=decodeURIComponent(raw||'');}catch{return notFound();}
 const [kind,paper]=key.split('@');
 const {questions,remaining,wrong}=fixedRoundStatus(kind,paper);
 if(!questions.length)return notFound();
 shell(`<h1>本套选择题</h1><p class="condition">先做完本轮。错题自动加入错题集，全部作对才解锁下一轮。</p><div id="fixedChoiceRound"></div>`,'选择题作答');
 const refresh=()=>{
  const st=fixedRoundStatus(kind,paper),root=$('#fixedChoiceRound');
  root.innerHTML=`<p>未作答 ${st.remaining} · 当前答错 ${st.wrong.length}</p><button class="btn" id="advanceChoiceRound" ${st.remaining?'disabled':''}>${st.wrong.length?'开始统一订正':'开始下一轮'}</button> <a href="#review">打开错题集 →</a><div>${st.questions.map(kind==='chem'?examQuestionHTML:mathExamCard).join('')}</div>`;
  $('#advanceChoiceRound').addEventListener('click',()=>{if(advanceFixedRound(kind,paper))refresh();});
  if(kind==='math'){typesetTextbook(root);bindMathExam(root,refresh);}
 };
 if(kind==='chem')chemExamDrillRefresh=refresh;
 refresh();
}
function canReviewMistake(key){
 const [kind,id,questionKey]=key.split(':');
 if(kind==='practice'){
  const batch=state.practice.batches[id];
  return !batch?.questions.some(q=>q.key===questionKey)||batch.answers.every(a=>a?.correct);
 }
 if(kind==='chem'||kind==='math'){
  const questions=kind==='chem'?CHEM_EXAM_QUESTIONS:MATH_EXAM_QUESTIONS;
  const q=questions.find(q=>q.id===id);
  if(q&&(kind!=='chem'||isChemChoice(q))){
   const status=fixedRoundStatus(kind,q.paper);
   return !status.remaining&&!status.wrong.length;
  }
 }
 return kind!=='single'||state.answers[id]?.correct===true;
}
function mistakeBankHTML(){
 const entries=Object.entries(state.choiceMistakes).filter(([key])=>!reviewSubject()||mistakeSubject(key)===reviewSubject()),round=state.choiceBankRound?.subject===reviewSubject()?state.choiceBankRound:null;
 if(!entries.length&&!round)return '<section class="panel"><h2>错题集</h2><p>暂时没有错题。</p></section>';
 const remaining=round?round.items.filter(item=>!Object.hasOwn(round.answers,item.key)).length:0;
 const available=entries.filter(([key])=>canReviewMistake(key)).length;
 const wrong=round?round.items.filter(item=>Object.hasOwn(round.answers,item.key)&&round.answers[item.key]!==item.q.answer):[];
 return `<section class="panel" id="choiceBank"><h2>错题集 · ${entries.length} 道</h2><p class="condition">每题答错时重新计数，连续答对满 3 次移出。本轮答案提交后锁定。</p>
 ${!round?`<button class="btn" id="advanceBank" ${available?'':'disabled'}>开始复习</button>${available<entries.length?'<p>有错题仍在原练习中。先做完并订正原练习，再来复习。</p>':''}`:`<p>本轮还有 ${remaining} 道未作答。</p><button class="btn" id="advanceBank" ${remaining?'disabled':''}>${wrong.length?'开始统一订正':'开始下一轮复习'}</button>
 ${round.items.map(({key,q},index)=>{
  const answered=Object.hasOwn(round.answers,key),choice=round.answers[key],locked=!canReviewMistake(key);
  return `<article class="exam-question"><h3>${escapeHTML(q.question)}</h3><p class="condition">${state.choiceMistakes[key]?'连对 '+state.choiceMistakes[key].streak+' / 3':'已移出错题集'}</p>
  ${q.options.map((o,i)=>`<button class="choice ${answered&&choice===i?'selected':''}" data-bank-index="${index}" data-bank-choice="${i}" ${answered||locked?'disabled':''}>${String.fromCharCode(65+i)}　${escapeHTML(o)}</button>`).join('')}
  ${locked&&!answered?'<p>请先完成这道题的原练习。</p>':''}${answered?`<p class="feedback ${choice===q.answer?'correct':''}">${choice===q.answer?'✓ 答对':'正确答案：'+escapeHTML(q.options[q.answer])}　${escapeHTML(q.explanation)}</p>`:''}</article>`;
 }).join('')}`}
 ${entries.length?`<details><summary>查看错题及连对次数</summary><ul>${entries.map(([,m])=>`<li>${escapeHTML(m.q.question)} · 连对 ${m.streak} / 3</li>`).join('')}</ul></details>`:''}</section>`;
}
function bindMistakeBank(){
 const root=$('#choiceBank');
 if(!root)return;
 root.addEventListener('click',event=>{
  const round=state.choiceBankRound?.subject===reviewSubject()?state.choiceBankRound:null;
  if(event.target.closest('#advanceBank')){
   if(round&&round.items.some(item=>!Object.hasOwn(round.answers,item.key)))return;
   const wrong=round?.items.filter(item=>round.answers[item.key]!==item.q.answer)||[];
   const items=wrong.length?wrong:Object.entries(state.choiceMistakes).filter(([key])=>(!reviewSubject()||mistakeSubject(key)===reviewSubject())&&canReviewMistake(key)).map(([key,m])=>({key,q:m.q}));
   state.choiceBankRound=items.length?{items,answers:{},subject:reviewSubject()}:null;
  }else{
   const button=event.target.closest('[data-bank-choice]');
   if(!button||!round)return;
   const item=round.items[Number(button.dataset.bankIndex)],choice=Number(button.dataset.bankChoice);
   if(!item||!canReviewMistake(item.key)||Object.hasOwn(round.answers,item.key)||!Number.isInteger(choice)||choice<0||choice>=item.q.options.length)return;
   round.answers[item.key]=choice;
   trackChoice(item.key,item.q,choice);
  }
  save();review();
 });
}
