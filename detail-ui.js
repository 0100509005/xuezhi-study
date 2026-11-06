const VIDEO_GUIDES={
 function:['video-calc'],sequence:['video-calc'],limit:['video-calc'],'limit-laws':['video-calc'],squeeze:['video-calc'],equivalent:['video-calc'],continuity:['video-calc'],derivative:['video-calc'],'derivative-rules':['video-calc'],chain:['video-calc'],extrema:['video-calc'],antiderivative:['video-calc'],integral:['video-calc'],
 determinant:['video-det'],'det-properties':['video-det-properties'],cofactor:['video-cofactor'],cramer:['video-cramer'],'matrix-basic':['video-matrix'],'matrix-addition':['video-matrix-add'],'matrix-product':['video-matrix-product'],'matrix-transpose':['video-linear'],inverse:['video-linear'],elimination:['video-linear'],vector:['video-vectors'],dot:['video-linear'],basis:['video-linear'],eigen:['video-linear']
};
function studyVideoHTML(item){const ids=VIDEO_GUIDES[item.id]||[];return ids.length?`<div class="detail-references"><strong>视频延伸学习</strong><p>点击后在浏览器打开；视频需要联网。课程顺序可能不同，请按本知识点选择对应选集。</p>${ids.map(id=>{const ref=DETAIL_SOURCES[id];return `<a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer" data-detail-reference="${escapeHTML(id)}">${escapeHTML(ref.title)} · ${escapeHTML(ref.language)} ↗</a>`;}).join('')}</div>`:'';}
function studyModeToolbar(){
 const detailed=state.studyMode==='detailed';
 return `<div class="study-mode" role="group" aria-label="讲解详略"><span class="study-mode-label">讲解模式</span><button type="button" data-study-mode="brief" aria-pressed="${!detailed}" class="${!detailed?'selected':''}">简略</button><button type="button" data-study-mode="detailed" aria-pressed="${detailed}" class="${detailed?'selected':''}">详细</button><span class="study-mode-hint">切换只改变讲解详略</span></div>`;
}
function studyDetailHTML(item){
 const content=DETAIL_EXPLANATIONS.get(item.id),hidden=state.studyMode!=='detailed';
 if(!content)return `<section class="panel study-detail study-detail-pending" data-detail-panel ${hidden?'hidden':''}><span class="label">详细模式</span><h2>本点详细拓展正在整理</h2><p>当前先显示上方已有的概念、符号、例题和练习。遇到不明白的地方，可先查看本页的先备知识和原资料。</p>${studyVideoHTML(item)}</section>`;
 const refs=content.source.map(id=>DETAIL_SOURCES[id]).filter(Boolean);
 return `<section class="panel study-detail" data-detail-panel ${hidden?'hidden':''} aria-label="详细讲解"><span class="label">详细模式 · 逐步理解</span><h2>再往下讲清楚</h2>${content.steps.map(([heading,body],i)=>`<div class="detail-step"><span class="detail-step-number">${String(i+1).padStart(2,'0')}</span><div><h3>${escapeHTML(heading)}</h3><p>${item.mathStudy?textbookText(body):escapeHTML(body)}</p></div></div>`).join('')}${refs.length?`<div class="detail-references"><strong>延伸阅读</strong><p>以下为在线参考资料，正文用中文重新整理；阅读原文需要联网。</p>${content.source.map(id=>{const ref=DETAIL_SOURCES[id];return ref?`<a href="${escapeHTML(ref.url)}" target="_blank" rel="noopener noreferrer" data-detail-reference="${escapeHTML(id)}">${escapeHTML(ref.title)} · ${escapeHTML(ref.language)} ↗</a>`:'';}).join('')}</div>`:''}${studyVideoHTML(item)}</section>`;
}
function normalizeStudyMode(value){return value==='detailed'?'detailed':'brief';}
function initStudyModeEvents(){
 document.addEventListener('click',async event=>{
  const btn=event.target.closest('[data-study-mode]');
  if(btn){const mode=normalizeStudyMode(btn.dataset.studyMode);state.studyMode=mode;save();document.querySelectorAll('[data-study-mode]').forEach(b=>{const selected=b.dataset.studyMode===mode;b.setAttribute('aria-pressed',String(selected));b.classList.toggle('selected',selected);});document.querySelectorAll('[data-detail-panel]').forEach(p=>{p.hidden=mode!=='detailed';});return;}
  const link=event.target.closest('[data-detail-reference]');
  if(link&&window.studyDesktop?.openReference){event.preventDefault();try{const message=await window.studyDesktop.openReference(link.dataset.detailReference);if(message)alert('打开参考资料失败：'+message);}catch{alert('无法打开在线参考资料，请检查网络与默认浏览器。');}}
 });
}
