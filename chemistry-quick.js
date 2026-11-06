const CHEM_BOOK_QUICK_NOTES = {
 'wavefunction': '波函数 ψ 描述量子状态。归一化后，|ψ|² 是概率密度；要得到电子在某区域出现的概率，须在该区域对 |ψ|² 积分。',
 'quantum-numbers': '主量子数 n 标记电子所在的主能层：n=1 是第一层（K 层），n=2 是第二层（L 层），n=3 是第三层（M 层），n=4 是第四层（N 层），依此类推。n 只取正整数。氢样原子的轨道能量由 n 决定，多电子原子中同一主能层的不同亚层能量也可能不同。角量子数 l 标记亚层，取 0 到 n−1，0、1、2、3 分别对应 s、p、d、f。磁量子数 mₗ 取 −l 到 +l 的整数，标记轨道角动量沿所选轴的投影。自旋磁量子数 mₛ 取 ±1/2，区分电子的两种自旋投影。例如 3d 中，3 表示第三主能层，d 表示 l=2，因此 mₗ 可取 −2、−1、0、+1、+2，对应五个空间轨道。'
};
function chemistryQuickDetails(term){
 if(['molecular-orbital','bond-order'].includes(term.id))return chemistryOrbitalTable(term.id);
 const symbols=term.symbols.map(([name,meaning])=>
  `<dt><strong>${escapeHTML(name)}</strong></dt><dd>${escapeHTML(meaning)}</dd>`
 ).join('');
 return [
  symbols && `<h3>符号、单位与约定</h3><dl>${symbols}</dl>`,
  term.example && `<p><strong>例子：</strong>${escapeHTML(term.example)}</p>`,
  term.caution && `<p><strong>适用条件与易错点：</strong>${escapeHTML(term.caution)}</p>`
 ].filter(Boolean).join('');
}
function chemistryQuickReview(){
 shell(`<p class="eyebrow">QUICK REVIEW</p><h1>化学名词速览</h1><p class="course-description">先看名词；想不起来时点击展开概念与解释。</p>${chemistryTabs('quick')}<div class="actions"><button class="btn secondary" data-open-material="chem-review-book">打开南洋学辅大学化学复习宝典（33页） ↗</button></div><div class="tools"><input id="quickSearch" type="search" aria-label="搜索化学名词" placeholder="搜索名词，例如蒸气压、量子数"><select id="quickChapter" aria-label="筛选章节"><option value="all">全部章节</option>${CHEMISTRY_CHAPTERS.map(c=>`<option value="${c.chapter}">${escapeHTML(c.title)}</option>`).join('')}</select></div><p id="quickCount" class="condition"></p><div id="quickList"></div>`,'大学化学 · 名词速览');
 function filter(){const q=$('#quickSearch').value.trim().toLowerCase(),ch=$('#quickChapter').value,list=CHEM_TERM_LESSONS.filter(p=>(ch==='all'||String(p.chapterNumber)===ch)&&[p.title,...p.aliases].join(' ').toLowerCase().includes(q));$('#quickCount').textContent=`显示 ${list.length} / ${CHEM_TERM_LESSONS.length} 个名词`;$('#quickList').innerHTML=list.map(p=>{const t=chemTermById(p.termId);return `<details class="panel"><summary>${escapeHTML(p.title)} ${chemPriorityBadge(p.id)}</summary><p><strong>概念：</strong>${escapeHTML(t.meaning)}</p><p><strong>理解：</strong>${escapeHTML(t.why)}</p>${t.formula?`<p><strong>公式：</strong>${escapeHTML(t.formula)}</p>`:''}${CHEM_BOOK_QUICK_NOTES[p.termId]?`<p><strong>宝典第 4 页校注：</strong>${escapeHTML(CHEM_BOOK_QUICK_NOTES[p.termId])}</p>`:''}${chemistryQuickDetails(t)}<a href="#chem-point/${p.termId}">进入完整讲解与练习 →</a></details>`;}).join('')||'<p>没有匹配的名词。</p>';}
 $('#quickSearch').addEventListener('input',filter);$('#quickChapter').addEventListener('change',filter);filter();
}
