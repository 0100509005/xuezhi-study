const CHEM_LESSON_TERMS={
 'ch-orbital':['atomic-models','ground-excited','spectrum','photon','wave-particle','uncertainty','wavefunction','spherical-coordinates','bohr-radius','quantum-numbers','probability-density','radial-distribution','orbital-node','degeneracy'],
 'ch-occupation':['degeneracy','electron-configuration','quantum-numbers','shielding','penetration'],
 'ch-periodic':['shielding','penetration','atomic-radius','ionization-energy','electron-affinity','electronegativity'],
 'ch-vsepr':['lewis-structure','electron-domain','bond-parameters'],
 'ch-hybrid':['valence-bond','hybrid-orbital','sigma-pi','molecular-orbital','bond-order'],
 'ch-forces':['dipole','intermolecular-forces','hydrogen-bond','viscosity','vapor-pressure','volatility'],
 'ch-ideal':['ideal-gas','gas-laws','speed-distribution','characteristic-speeds','kinetic-energy','real-gas','critical-point','supercritical'],
 'ch-partial':['partial-pressure','partial-volume','mole-fraction','vapor-pressure','dynamic-equilibrium'],
 'ch-colligative':['solution','mass-fraction','mole-fraction','molality','molarity','evaporation','dynamic-equilibrium','vapor-pressure','volatility','phase','phase-equilibrium','boiling-point','melting-freezing','colligative-properties','raoult','boiling-elevation','semipermeable','osmotic-pressure','vanthoff-factor'],
 'ch-energy':['system-environment','system-types','state-function','extensive-intensive','thermo-process','reversible','heat-work','internal-energy','enthalpy','reaction-extent'],
 'ch-entropy':['phase','phase-equilibrium','latent-heat','state-function','entropy-microstates','entropy-laws','clausius','spontaneity'],
 'ch-gibbs':['enthalpy','entropy-laws','standard-state','reaction-extent','gibbs','formation-combustion','hess','reaction-free-energy'],
 'ch-quotient':['activity','chemical-equilibrium','equilibrium-constant','kp-kc','reaction-free-energy'],
 'ch-shift':['chemical-equilibrium','partial-pressure','equilibrium-shift','vanthoff-equilibrium'],
 'ch-standard':['standard-state','reaction-free-energy','equilibrium-constant','kp-kc','conversion','transition-temperature','nitrogen-fixation'],
 'ch-acid':['electrolyte','acid-base-theories','conjugate-pair','water-ion-product','ph-p-operator','activity','weak-dissociation','polyprotic-acid','analytical-concentration'],
 'ch-buffer':['weak-dissociation','common-ion','buffer','titration','endpoint','acid-indicator','analytical-concentration'],
 'ch-solubility':['solubility','solubility-product','fractional-precipitation','argentometry','coordinate-bond','ligand','coordination-number','complex-equilibrium','edta','metal-indicator'],
 'ch-redox':['oxidation-state','half-reaction','redox-titration','disproportionation'],
 'ch-cell':['galvanic-cell','electrode-names','cell-notation','electrode-types','electrode-potential','reference-electrode','emf','battery-types'],
 'ch-nernst':['activity','electrical-free-energy','nernst','electrolysis','polarization','polarization-types','electrolysis-products','electroplating','electroprocessing','corrosion','corrosion-types','corrosion-protection'],
 'ch-rate':['reaction-rate','elementary-mechanism','rate-law','zero-order','second-order'],
 'ch-firstorder':['reaction-rate','first-order','zero-order','second-order','radioactive-activity'],
 'ch-arrhenius':['collision','activation-energy','arrhenius','catalysis','photochemistry','intermediate-steady','enzyme'],
 'ch-surface':['interface-specific-area','surface-energy','wetting','laplace-pressure','capillary'],
 'ch-adsorption':['adsorption','adsorbent','adsorption-types','langmuir','surface-excess','surfactant','non-surface-active','micelle'],
 'ch-colloid':['dispersion','colloid-types','polymer','colloidal-structure','sol-preparation','brownian-diffusion','light-scattering','double-layer','zeta','electrokinetics','solvation','aggregation','specific-ion','sensitization']
};
const chemTermById=id=>CHEM_TERMS.find(t=>t.id===id);
function chemistryTermLink(t){return `<a class="chem-term-link" href="#chem-point/${t.id}" title="${escapeHTML(t.meaning)}">${escapeHTML(t.name)}</a>`;}
function chemistryLessonTerms(l){
 const explicit=CHEM_LESSON_TERMS[l.id]||[];
 const g=BEGINNER_GUIDES.get(l.id),text=[l.core,l.condition,l.purpose,g?.meaning,g?.bridge,...(g?.origin||[]),...(g?.example||[]),g?.pitfall].join(' ');
 const inferred=CHEM_TERMS.filter(t=>[t.name,...t.aliases].some(a=>a.length>=2&&text.includes(a))).map(t=>t.id);
 return [...new Set([...explicit,...inferred])].map(chemTermById).filter(Boolean);
}
function chemistryFoundationHTML(l){
 if(l.course!=='chemistry')return '';
 const terms=chemistryLessonTerms(l);
 return `<section class="chem-foundation" aria-label="本页先备定义"><h2>读到这些新词，先明白它们</h2><p class="condition">定义直接列在这里；点名称可看完整的由来、公式、例子和对应课件页。</p><dl>${terms.map(t=>`<div class="foundation-term"><dt>${chemistryTermLink(t)}</dt><dd>${escapeHTML(t.meaning)}</dd></div>`).join('')}</dl><a class="btn secondary" href="#chem-terms">查阅九章全部 ${CHEM_TERMS.length} 组定义 →</a></section>`;
}
function chemistryTermCard(t){return `<article class="panel chemistry-term-card" id="term-${t.id}"><p class="eyebrow">第 ${t.chapter} 章 · 定义与辨析</p><h2>${escapeHTML(t.name)}</h2><p class="term-meaning">${escapeHTML(t.meaning)}</p><p><strong>怎样理解：</strong>${escapeHTML(t.why)}</p>${chemistryTermTeachingHTML(t)}${t.formula?`<div class="formula">${escapeHTML(t.formula)}</div>`:''}${t.symbols.length?`<div class="table-wrap"><table class="notation-table"><caption>符号、单位与约定</caption><thead><tr><th scope="col">符号</th><th scope="col">解释</th></tr></thead><tbody>${t.symbols.map(([s,d])=>`<tr><th scope="row">${escapeHTML(s)}</th><td>${escapeHTML(d)}</td></tr>`).join('')}</tbody></table></div>`:''}<div class="term-example"><strong>小例子：</strong>${escapeHTML(t.example)}</div><p class="misconception"><strong>别混淆：</strong>${escapeHTML(t.caution)}</p>${sourcesHTML(t.sources)}</article>`;}
function chemistryTerms(focus){
 if(chemTermById(focus))return showChemPoint(focus);
 const chapter=focus?.startsWith('chapter-')?Number(focus.slice(8)):null;
 shell(`<div class="crumb"><a href="#course/chemistry">← 大学化学</a></div><p class="eyebrow">ONE CONCEPT AT A TIME</p><h1>化学知识点目录</h1><p class="course-description">按九章顺序逐个学习；点名称进入独立学习页，页尾可接着看下一点。</p>${chemistryTabs('terms')}<div class="tools term-tools"><input id="chemTermSearch" type="search" aria-label="搜索化学术语" placeholder="蒸气压、配位数、临界温度…"><select id="chemTermChapter" aria-label="选择术语章节"><option value="all">九章全部</option>${CHEMISTRY_CHAPTERS.map(c=>`<option value="${c.chapter}" ${chapter===c.chapter?'selected':''}>第 ${c.chapter} 章 · ${escapeHTML(c.title)}</option>`).join('')}</select></div><p class="condition" id="chemTermCount" aria-live="polite"></p><div id="chemTermResults"></div>`,'化学知识点目录');
 function filter(){const q=$('#chemTermSearch').value.trim().toLowerCase(),ch=$('#chemTermChapter').value,found=CHEM_TERM_LESSONS.filter(p=>(ch==='all'||String(p.chapterNumber)===ch)&&[p.title,...p.aliases,p.meaning,p.formula].join(' ').toLowerCase().includes(q));$('#chemTermCount').textContent=`找到 ${found.length} 个知识点；配套练习另有标记，重点等级以治学集为依据。`;$('#chemTermResults').innerHTML=found.map(p=>chemPointRow(p,CHEM_TERM_LESSONS.indexOf(p))).join('')||'<p class="no-result">没有匹配的知识点，试试其他名称或切换章节。</p>';}
 $('#chemTermSearch').addEventListener('input',filter);$('#chemTermChapter').addEventListener('change',filter);filter();
}
