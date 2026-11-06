// Presentation only. Stored questions, answers and program examples keep their source text.
function formatStudyNotation(root) {
 if (!root) return;
 const chemistry = location.hash.startsWith('#chem-') || location.hash==='#course/chemistry';
 const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode()) {
  const node=walker.currentNode;
  if(node.parentElement.closest('math,svg,script,style,pre,code,input,textarea,select,option,[data-study-notation],.source-text'))continue;
  if(/[₀-₉ᵢⱼₓᵧ⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/.test(node.nodeValue) || chemistry&&/[σπ]\*?[12][sp]/.test(node.nodeValue))nodes.push(node);
 }
 const lower={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ᵢ':'i','ⱼ':'j','ₓ':'x','ᵧ':'y'};
 const upper={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'−'};
 for(const node of nodes) {
  let html=escapeHTML(node.nodeValue);
  if(chemistry)html=html.replace(/([σπ])(\*)?([12][sp])([xyz])?/g,(_,type,star,shell,axis)=>type+(star?'<sup>∗</sup>':'')+'<sub>'+shell+(axis||'')+'</sub>');
  html=html.replace(/[₀-₉ᵢⱼₓᵧ]+/g,s=>'<sub>'+[...s].map(c=>lower[c]).join('')+'</sub>').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g,s=>'<sup>'+[...s].map(c=>upper[c]).join('')+'</sup>');
  const span=document.createElement('span');span.dataset.studyNotation='';span.innerHTML=html;node.replaceWith(span);
 }
}
const notationRoot=typeof document==='undefined'?null:document.getElementById('app');
if(notationRoot)new MutationObserver(()=>formatStudyNotation(notationRoot)).observe(notationRoot,{childList:true,subtree:true});
