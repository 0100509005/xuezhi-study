/* 历年真题中心：按年份列出试卷、原页与解析页，并可逐题做选择题。 */
const MATH_PAPER_STATE_PREFIX = 'mathPaperState:';

function mathPaperQuestions(course, year) {
  const curated = (typeof MATH_EXAM_QUESTIONS === 'undefined' ? [] : MATH_EXAM_QUESTIONS)
    .filter(q => q.course === course && q.paper === `${course}-${year}`)
    .map(q => ({
      id: q.id,
      prompt: q.prompt,
      options: [...q.options],
      answer: q.answer,
      steps: [...q.steps],
      page: q.page,
      answerPage: q.answerPage,
      number: q.number,
      kind: '整理',
      label: `${year} 期中 · ${q.number}`
    }));
  const extracted = (typeof MATH_PAPER_QUESTIONS === 'undefined' ? [] : MATH_PAPER_QUESTIONS)
    .filter(q => q.course === course && q.year === year)
    .filter(q => !curated.some(c => c.prompt.slice(0, 24) === q.prompt.slice(0, 24)))
    .map(q => ({
      id: q.id,
      prompt: q.prompt,
      options: [...q.options],
      answer: q.answer,
      steps: [],
      page: q.page,
      answerPage: null,
      number: q.number,
      kind: '转录',
      label: `${year} 期中 · ${q.number}`
    }));
  return [...curated, ...extracted];
}
function mathPaperQuestionCount(course, year) {
  return mathPaperQuestions(course, year).length;
}
function mathPaperStateKey(course, year) { return MATH_PAPER_STATE_PREFIX + course + ':' + year; }
function readPaperState(course, year) {
  try {
    const raw = JSON.parse(localStorage.getItem(mathPaperStateKey(course, year)));
    if (raw && typeof raw === 'object') return raw;
  } catch (e) { /* 首次打开 */ }
  return { answers: {}, order: null };
}
function writePaperState(course, year, data) {
  try { localStorage.setItem(mathPaperStateKey(course, year), JSON.stringify(data)); } catch (e) { /* 空间不足 */ }
}

function mathExamCenter(course) {
  if (!['calculus', 'algebra'].includes(course)) return notFound();
  const papers = MATH_PAPERS.filter(p => p.course === course).sort((a, b) => b.year - a.year);
  const rows = papers.map(p => {
    const count = mathPaperQuestionCount(course, p.year);
    const state = readPaperState(course, p.year);
    const answered = Object.keys(state.answers || {}).length;
    const right = Object.values(state.answers || {}).filter(v => v && v.correct).length;
    const prefix = course === 'calculus' ? 'calc' : 'alg';
    const card = `<article class="panel paper-card">
      <div class="paper-card-head"><span class="pill">${p.year} 期中</span><span class="condition">原题 PDF 第 ${p.qFrom}—${p.qTo} 页 · 解析第 ${p.aFrom}—${p.aTo} 页</span></div>
      <div class="actions">
        <a class="btn secondary" href="#math-paper/${prefix}-paper@${p.qFrom}">读原题</a>
        <a class="btn secondary" href="#math-paper/${prefix}-answer@${p.aFrom}">看解析</a>
        ${count ? `<a class="btn" href="#math-exam/${course}/${p.year}">做本卷选择题（${count} 题）</a>` : '<span class="condition">本卷暂未录入可作答题目，先读原页。</span>'}
      </div>
      ${count ? `<p class="condition">已作答 ${answered} 题 · 共 ${count} 题${answered ? ` · 正确 ${right} 题` : ''}</p>` : ''}
    </article>`;
    return card;
  }).join('');
  shell(`<p class="eyebrow">PAST PAPERS · ${escapeHTML(course === 'calculus' ? 'CALCULUS' : 'LINEAR ALGEBRA')}</p><h1>历年真题</h1>${mathTabs(course, 'papers')}<p class="course-description">${papers.length} 套期中卷，按年份从新到旧。先读原题页，再做已录入的选择题；解析与答案分别对应解析册页码。公式以原件为准。</p>
    <div class="panel"><h2>怎么用</h2><p class="condition">每套卷子都有“读原题”和“看解析”两个入口，原页保留题号、公式和图形。录入的选择题可逐题作答、自动记错题；文字转录题只保证题干与选项，复杂公式请对照原页。</p></div>
    <div class="paper-grid">${rows}</div>`, COURSES[course].title);
}

function mathExamPaper(raw) {
  const [course, yearText] = String(raw || '').split('/');
  const year = Number(yearText);
  if (!['calculus', 'algebra'].includes(course) || !Number.isInteger(year)) return notFound();
  const paper = MATH_PAPERS.find(p => p.course === course && p.year === year);
  if (!paper) return notFound();
  const questions = mathPaperQuestions(course, year);
  const state = readPaperState(course, year);
  const prefix = course === 'calculus' ? 'calc' : 'alg';
  const answered = Object.keys(state.answers || {}).length;
  const right = Object.values(state.answers || {}).filter(v => v && v.correct).length;
  const only = state.onlyWrong ? questions.filter(q => state.answers[q.id] && !state.answers[q.id].correct) : questions;
  const order = state.order && state.order.length === questions.length ? state.order : questions.map(q => q.id);
  const byId = new Map(questions.map(q => [q.id, q]));
  const list = (only.length ? only : questions).slice().sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  const cards = list.map(q => {
    const answer = state.answers[q.id];
    const chosen = answer ? answer.choice : null;
    const done = chosen != null;
    return `<article class="exam-question" id="paper-q-${q.id}">
      <div class="exam-source-label"><span class="pill">${q.kind === '整理' ? '原题整理' : '原题转录'}</span><span>${escapeHTML(q.label)} · 原题 PDF 第 ${q.page} 页</span></div>
      <h3>${escapeHTML(q.prompt)}</h3>
      <div class="exam-choices">${q.options.map((text, i) => `<button class="choice ${done && chosen === i ? 'selected' : ''}" data-paper-choice="${i}" data-paper-id="${q.id}" ${done ? 'disabled' : ''}>${String.fromCharCode(65 + i)}　${escapeHTML(text)}</button>`).join('')}</div>
      ${done ? `<div class="feedback ${answer.correct ? 'correct' : ''}"><strong>${answer.correct ? '✓ 回答正确' : '正确答案：' + String.fromCharCode(65 + q.answer)}</strong>
        ${q.steps.length ? `<ol>${q.steps.map(s => `<li>${escapeHTML(s)}</li>`).join('')}</ol>` : '<p>本题为原卷文字转录，完整推导见解析册对应页。</p>'}
        <p><a href="#math-paper/${prefix}-answer@${q.answerPage || paper.aFrom}">对照解析册第 ${q.answerPage || paper.aFrom} 页 →</a> · <a href="#math-paper/${prefix}-paper@${q.page}">看原题页第 ${q.page} 页 →</a></p></div>` : ''}
    </article>`;
  }).join('');

  shell(`<div class="crumb"><a href="#math-exams/${course}">← 历年真题</a> / ${year} 期中</div><h1>${year} 期中卷 · 选择题</h1><p class="condition">已答 ${answered} 题 · 共 ${questions.length} 题${answered ? ` · 正确 ${right} 题` : ''}。作答后自动写入错题集；可以按原顺序或打乱重做。</p>
    <div class="actions"><a class="btn secondary" href="#math-paper/${prefix}-paper@${paper.qFrom}">读本卷原题</a><a class="btn secondary" href="#math-paper/${prefix}-answer@${paper.aFrom}">看本卷解析</a><button class="btn secondary" id="paperShuffle">打乱顺序</button><button class="btn secondary" id="paperReset">清空本卷作答</button><button class="btn secondary" id="paperOnlyWrong">${state.onlyWrong ? '显示全部题目' : '只看错题'}</button></div>
    ${cards || '<section class="panel"><p>本卷还没有可作答的选择题，请先读原页。</p></section>'}`, `${year} 期中真题`);

  document.querySelectorAll('[data-paper-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.paperId, choice = Number(button.dataset.paperChoice);
      const q = byId.get(id);
      if (!q || state.answers[id] || !Number.isInteger(choice) || choice < 0 || choice >= q.options.length) return;
      state.answers[id] = { choice, correct: choice === q.answer };
      trackChoice(`paper:${course}:${year}:${id}`, { ...q, question: q.prompt, explanation: q.steps.join('；') || '见解析册' }, choice);
      writePaperState(course, year, state);
      save();
      mathExamPaper(`${course}/${year}`);
    });
  });
  document.getElementById('paperShuffle')?.addEventListener('click', () => {
    const ids = questions.map(q => q.id);
    for (let i = ids.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [ids[i], ids[j]] = [ids[j], ids[i]]; }
    state.order = ids;
    writePaperState(course, year, state);
    mathExamPaper(`${course}/${year}`);
  });
  document.getElementById('paperReset')?.addEventListener('click', () => {
    if (!confirm('清空本卷作答并重新开始？')) return;
    state.answers = {}; state.order = null; state.onlyWrong = false;
    writePaperState(course, year, state);
    mathExamPaper(`${course}/${year}`);
  });
  document.getElementById('paperOnlyWrong')?.addEventListener('click', () => {
    state.onlyWrong = !state.onlyWrong;
    writePaperState(course, year, state);
    mathExamPaper(`${course}/${year}`);
  });
  typesetTextbook(document.getElementById('app'));
}

/* 路由与标签：历年真题与解析 -> 真题中心 */
(function () {
  if (typeof route !== 'function' || typeof mathTabs !== 'function') return;
  const tabs = mathTabs;
  mathTabs = function (course, selected) {
    return tabs(course, selected).replace('href="#math-library/' + course + '"', 'href="#math-exams/' + course + '"');
  };
  const old = route;
  window.removeEventListener('hashchange', old);
  route = function () {
    const parts = location.hash.slice(1).split('/');
    if (parts[0] === 'math-exams') mathExamCenter(parts[1]);
    else if (parts[0] === 'math-exam') mathExamPaper(parts.slice(1).join('/'));
    else old();
  };
  window.addEventListener('hashchange', route);
  route();
})();
