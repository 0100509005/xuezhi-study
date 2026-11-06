// Local explanations assume high-school background, not prior university terminology.
const SUBJECT_CLARITY_UPDATES=new Set();
function clarifyGuide(id,notation,teaching){
 const g=BEGINNER_GUIDES.get(id);if(!g)throw new Error('Unknown guide '+id);
 const symbols=notation.split('\n').map(row=>{const at=row.indexOf('｜');if(at<1)throw new Error('Missing notation separator '+id);return[row.slice(0,at),row.slice(at+1)];});
 Object.assign(g,{symbols,teaching});SUBJECT_CLARITY_UPDATES.add(id);
}
function subjectClarityHTML(g){return g.teaching?.length?`<section class="subject-clarity" aria-label="先把术语与含义讲清楚"><h2>先把这些话讲清楚</h2>${g.teaching.map(([title,text])=>`<div class="clarity-step"><h3>${escapeHTML(title)}</h3><p>${escapeHTML(text)}</p></div>`).join('')}</section>`:'';}
