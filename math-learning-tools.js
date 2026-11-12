/* 每日一题：按题型（章节）出题，题目取自已整理的期中真题与同难度自拟题。 */
(function () {
  const COURSES_OK = ['calculus', 'algebra'];
  const DAY_FMT = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' });
  const WEEK_FMT = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', weekday: 'long' });
  const dayKey = () => DAY_FMT.format(new Date());
  const dataKey = (course, day) => `mathDaily3:${course}:${day}`;
  const scopeKey = course => `mathDailyScope:${course}`;
  const levelKey = course => `mathDailyLevel:${course}`;

  function cleanName(chapter) {
    return chapter
      .replace(/^\d+\s*·\s*/, '')
      .replace(/^第[一二三四五六七八九十]+章\s*·\s*/, '')
      .replace(/^(期中|后续|体系衔接|拓展)\s*[｜|]\s*/, '');
  }
  function scopeOf(chapter) {
    if (chapter.includes('期中')) return '期中相关';
    if (chapter.includes('体系衔接')) return '体系衔接';
    if (chapter.includes('后续')) return '后续拓展';
    return '通识';
  }
  const typeCache = {};
  function typesFor(course) {
    if (typeCache[course]) return typeCache[course];
    const order = (typeof MATH_STUDY_ORDER !== 'undefined' && MATH_STUDY_ORDER[course]) || [];
    typeCache[course] = order.map(([chapter]) => ({
      id: practiceHash(course + '|' + chapter),
      title: cleanName(chapter),
      chapter,
      scope: scopeOf(chapter),
      lessons: LESSONS.filter(l => l.course === course && l.chapter === chapter && PRACTICE_TOPICS.has(l.id)).map(l => l.id)
    })).filter(t => t.lessons.length);
    return typeCache[course];
  }
  function readScope(course) {
    const all = typesFor(course).map(t => t.id);
    try {
      const raw = JSON.parse(localStorage.getItem(scopeKey(course)));
      if (Array.isArray(raw)) { const kept = raw.filter(id => all.includes(id)); if (kept.length) return kept; }
    } catch (e) { /* 使用默认全选 */ }
    return all;
  }
  function readLevel(course) {
    const v = localStorage.getItem(levelKey(course));
    return ['1', '2', '3'].includes(v) ? v : 'all';
  }
  function readDay(course, day) {
    let data = null;
    try { data = JSON.parse(localStorage.getItem(dataKey(course, day))); } catch (e) { data = null; }
    if (!data || typeof data !== 'object' || !data.types || typeof data.types !== 'object') data = { types: {}, created: day };
    return data;
  }
  function writeDay(course, day, data) {
    try { localStorage.setItem(dataKey(course, day), JSON.stringify(data)); } catch (e) { /* 空间不足时保留内存状态 */ }
  }
  function validQ(q) {
    return q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 5
      && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length && typeof q.explanation === 'string';
  }
  function bankQuestion(item) {
    return {
      question: item.prompt,
      options: [...item.options],
      answer: item.answer,
      explanation: item.steps.join('　'),
      key: 'bank-' + item.id,
      lessonId: item.terms[0],
      origin: item.source.label,
      source: item.source,
      level: item.level,
      kind: item.kind,
      bankId: item.id
    };
  }
  function generated(course, type, seedPart) {
    const rng = practiceRng(parseInt(practiceHash(seedPart), 36) >>> 0);
    for (const lessonId of rng.shuffle(type.lessons)) {
      try {
        const set = makePracticeSet(lessonId, parseInt(practiceHash(seedPart + ':' + lessonId), 36) >>> 0);
        const q = set.questions[parseInt(practiceHash(seedPart + '#' + lessonId), 36) % 3];
        return { ...q, lessonId, origin: '按本知识点生成的变式题' };
      } catch (e) { /* 换下一个知识点 */ }
    }
    return null;
  }
  function poolFor(course, type, level, usedIds) {
    const all = mathBankChapter(course, type.chapter);
    const filtered = level === 'all' ? all : all.filter(item => String(item.level) === level);
    const pool = filtered.length ? filtered : all;
    const unused = pool.filter(item => !usedIds.includes(item.id));
    return unused.length ? unused : pool;
  }
  function pickQuestion(course, type, day, level, usedIds) {
    const pool = poolFor(course, type, level, usedIds);
    if (pool.length) return bankQuestion(pool[parseInt(practiceHash(day + '|' + type.id + '|' + usedIds.length), 36) % pool.length]);
    return generated(course, type, day + '|' + type.id + '|' + usedIds.length);
  }
  function slotOf(data, type, course, day, level) {
    let slot = data.types[type.id];
    if (!slot || !slot.first || !validQ(slot.first.q)) {
      const q = pickQuestion(course, type, day, level, []);
      if (!q) return null;
      slot = data.types[type.id] = { first: { q, choice: null }, extra: [] };
    }
    if (!Array.isArray(slot.extra)) slot.extra = [];
    slot.extra = slot.extra.filter(item => item && validQ(item.q));
    return slot;
  }

  function sourceHTML(q) {
    const s = q.source;
    if (!s) return '';
    let links;
    if (s.mode === 'exam' && s.paper) {
      const paper = MATH_PAPERS.find(p => p.id === s.paper);
      const prefix = (paper && paper.course === 'calculus') ? 'calc' : 'alg';
      const year = paper ? paper.year + ' 期中 · ' : '';
      links = `<span class="trace-label">${escapeHTML(year + s.number)}</span> <a href="#math-paper/${prefix}-paper@${s.page}">原题 PDF 第 ${s.page} 页</a> · <a href="#math-paper/${prefix}-answer@${s.answerPage}">解析第 ${s.answerPage} 页</a>`;
    } else {
      links = `<span class="trace-label">${escapeHTML(s.label)}</span>`;
      if (s.refPaper) {
        const paper = MATH_PAPERS.find(p => p.id === s.refPaper);
        if (paper) links += ` · <a href="#math-paper/${paper.course === 'calculus' ? 'calc' : 'alg'}-paper@${paper.qFrom}">对照 ${paper.year} 期中卷</a>`;
      }
    }
    return `<p class="daily-trace">溯源：${links}</p>`;
  }
  function questionHTML(type, item, index, label) {
    const q = item.q, answered = item.choice != null, right = item.choice === q.answer;
    return `<article class="daily-question" id="daily-q-${type.id}-${index}">
      <div class="daily-q-head"><span class="condition">${label}</span><span class="condition">${escapeHTML(q.kind || '')}${q.level ? ' · 难度 ' + ['', '基础', '期中', '拔高'][q.level] : ''}</span></div>
      <h3>${escapeHTML(q.question)}</h3>
      ${sourceHTML(q)}
      <div class="daily-options">${q.options.map((o, i) => `<button class="choice ${answered && item.choice === i ? 'selected' : ''}" data-daily-type="${type.id}" data-daily-index="${index}" data-daily-choice="${i}" ${answered ? 'disabled' : ''}>${String.fromCharCode(65 + i)}　${escapeHTML(o)}</button>`).join('')}</div>
      ${answered ? `<div class="feedback ${right ? 'correct' : ''}"><strong>${right ? '✓ 回答正确' : '再想一想'} · 正确答案：${String.fromCharCode(65 + q.answer)}</strong><p>${escapeHTML(q.explanation)}</p>${q.lessonId ? `<a href="#lesson/${q.lessonId}">看对应知识点：${escapeHTML(getItem(q.lessonId)?.title || '')} →</a>` : ''}</div>` : ''}
    </article>`;
  }

  function daily(course) {
    if (!COURSES_OK.includes(course)) return notFound();
    const day = dayKey(), types = typesFor(course), data = readDay(course, day);
    const scope = readScope(course), level = readLevel(course);
    const active = types.filter(t => scope.includes(t.id));
    for (const type of active) slotOf(data, type, course, day, level);
    writeDay(course, day, data);

    const total = active.length;
    const finished = active.filter(t => data.types[t.id]?.first?.choice != null).length;
    const extraDone = active.reduce((n, t) => n + (data.types[t.id]?.extra || []).filter(e => e.choice != null).length, 0);
    const extraTotal = active.reduce((n, t) => n + (data.types[t.id]?.extra || []).length, 0);
    const correct = active.reduce((n, t) => {
      const slot = data.types[t.id]; if (!slot) return n;
      return n + [slot.first, ...(slot.extra || [])].filter(i => i && i.choice === i.q.answer).length;
    }, 0);
    const answered = finished + extraDone;

    const scopePanel = `<section class="panel daily-scope"><div class="daily-scope-head"><h2>考察范围与难度</h2><span class="condition">勾选要练的题型；每个选中的题型每天至少一题。</span></div>
      <div class="daily-scope-list">${types.map(t => `<label class="daily-scope-item"><input type="checkbox" data-scope-type="${t.id}" ${scope.includes(t.id) ? 'checked' : ''}> <span>${escapeHTML(t.title)}</span><em>${escapeHTML(t.scope)}</em></label>`).join('')}</div>
      <div class="daily-scope-actions"><label>难度 <select id="dailyLevel">${MATH_DAILY_LEVELS.map(l => `<option value="${l.id}" ${level === l.id ? 'selected' : ''}>${l.name}</option>`).join('')}</select></label><button class="btn secondary" id="scopeAll" type="button">全选</button><button class="btn secondary" id="scopeNone" type="button">全不选</button><button class="btn" id="scopeApply" type="button">应用范围</button></div>
      <p class="condition">切换范围只影响之后新出现的题，已作答记录保留；没有对应难度的题型会自动回退到全部难度。</p></section>`;

    const cards = active.map((type, index) => {
      const slot = data.types[type.id];
      if (!slot) return '';
      const done = slot.first.choice != null;
      return `<section class="panel daily-type" id="daily-type-${type.id}">
        <div class="daily-type-head"><span class="daily-index">${String(index + 1).padStart(2, '0')}</span><h2>${escapeHTML(type.title)}</h2><span class="pill">${escapeHTML(type.scope)}</span>${done ? '<span class="daily-done">✓ 今日已完成</span>' : ''}</div>
        ${questionHTML(type, slot.first, 0, '今日题 · 必做')}
        ${(slot.extra || []).map((item, i) => questionHTML(type, item, i + 1, '加练第 ' + (i + 1) + ' 题')).join('')}
        <div class="actions"><button class="btn secondary" data-daily-more="${type.id}">再来一题（${escapeHTML(type.title)}）</button><a class="condition" href="#lesson/${slot.first.q.lessonId || type.lessons[0]}">先看这个知识点的讲解 →</a></div>
      </section>`;
    }).join('');

    shell(`<p class="eyebrow">DAILY PRACTICE · ${escapeHTML(course === 'calculus' ? 'CALCULUS' : 'LINEAR ALGEBRA')}</p><h1>每日一题</h1>${mathTabs(course)}<nav class="course-tabs" aria-label="切换每日一题学科"><a href="#math-daily/calculus" ${course === 'calculus' ? 'aria-current="page" class="selected"' : ''}>高等数学</a><a href="#math-daily/algebra" ${course === 'algebra' ? 'aria-current="page" class="selected"' : ''}>线性代数</a></nav><p class="course-description">${WEEK_FMT.format(new Date())} · 题目按往年期中真题的考法与难度选取，答完可以继续加练；每个题型每天至少一道。同一天保留作答，次日自动换题。</p>
      <div class="panel daily-progress"><div class="daily-progress-top"><strong>今日进度</strong><span>完成 ${finished} 个 · 共 ${total} 个题型 · 已答 ${answered} 题 · 答对 ${correct} 题</span></div><div class="progress"><span style="width:${total ? finished / total * 100 : 0}%"></span></div>
      <p class="condition">${total === 0 ? '还没有选题型，请在下面的“考察范围”里至少勾一个。' : finished === total ? '今天的题型全部做完了，可以点任意题型的“再来一题”继续加练。' : `还有 ${total - finished} 个题型没做；答错会自动进入错题集。`} ${extraTotal ? `今日加练 ${extraTotal} 题，完成 ${extraDone} 题。` : ''}</p></div>
      ${scopePanel}
      ${cards || '<section class="panel"><p>当前范围没有可练的题型。</p></section>'}`, COURSES[course].title);

    document.querySelectorAll('[data-daily-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const typeId = button.dataset.dailyType, index = Number(button.dataset.dailyIndex), choice = Number(button.dataset.dailyChoice);
        const slot = data.types[typeId];
        if (!slot) return;
        const item = index === 0 ? slot.first : slot.extra[index - 1];
        if (!item || item.choice != null) return;
        if (!Number.isInteger(choice) || choice < 0 || choice >= item.q.options.length) return;
        item.choice = choice;
        trackChoice(`daily:${course}:${typeId}:${day}:${index}`, item.q, choice);
        writeDay(course, day, data);
        save();
        daily(course);
        document.getElementById(`daily-q-${typeId}-${index}`)?.scrollIntoView({ block: 'center' });
      });
    });
    document.querySelectorAll('[data-daily-more]').forEach(button => {
      button.addEventListener('click', () => {
        const typeId = button.dataset.dailyMore, type = types.find(t => t.id === typeId), slot = data.types[typeId];
        if (!type || !slot) return;
        const used = [slot.first.q.bankId, ...(slot.extra || []).map(i => i.q.bankId)].filter(Boolean);
        const q = pickQuestion(course, type, day, level, used);
        if (!q) { alert('这个题型暂时没能出新题，换一个题型试试。'); return; }
        slot.extra.push({ q, choice: null });
        writeDay(course, day, data);
        daily(course);
        document.getElementById(`daily-q-${typeId}-${slot.extra.length}`)?.scrollIntoView({ block: 'center' });
      });
    });
    document.querySelectorAll('[data-scope-type]').forEach(box => {
      box.addEventListener('change', () => {
        const chosen = [...document.querySelectorAll('[data-scope-type]')].filter(x => x.checked).map(x => x.dataset.scopeType);
        if (!chosen.length) { box.checked = true; alert('至少保留一个题型。'); return; }
      });
    });
    document.getElementById('scopeAll')?.addEventListener('click', () => document.querySelectorAll('[data-scope-type]').forEach(x => x.checked = true));
    document.getElementById('scopeNone')?.addEventListener('click', () => document.querySelectorAll('[data-scope-type]').forEach(x => x.checked = false));
    document.getElementById('scopeApply')?.addEventListener('click', () => {
      const chosen = [...document.querySelectorAll('[data-scope-type]')].filter(x => x.checked).map(x => x.dataset.scopeType);
      if (!chosen.length) { alert('至少选择一个题型。'); return; }
      localStorage.setItem(scopeKey(course), JSON.stringify(chosen));
      localStorage.setItem(levelKey(course), document.getElementById('dailyLevel').value);
      daily(course);
    });
    document.querySelectorAll('#app a[href^="#lesson/"]').forEach(link => {
      link.addEventListener('click', () => sessionStorage.setItem('dailyReturn', course));
    });
    typesetTextbook(document.getElementById('app'));
  }

  if (typeof route !== 'function' || typeof mathTabs !== 'function' || typeof makePracticeSet !== 'function') return;

  const tabs = mathTabs;
  mathTabs = function (course, selected) {
    return tabs(course, selected) + `<nav class="course-tabs"><a href="#math-daily/${course}">每日一题</a><a href="#review/${course}">本学科错题集</a></nav>`;
  };

  const oldRoute = route;
  window.removeEventListener('hashchange', oldRoute);
  route = function () {
    const parts = location.hash.slice(1).split('/');
    if (parts[0] === 'math-daily') daily(parts[1]);
    else oldRoute();
    const back = sessionStorage.getItem('dailyReturn');
    if (parts[0] === 'lesson' && back) {
      const link = document.createElement('a');
      link.className = 'btn secondary';
      link.href = '#math-daily/' + back;
      link.textContent = '← 返回每日一题';
      document.getElementById('app').prepend(link);
    }
  };
  window.addEventListener('hashchange', route);
  route();
})();
