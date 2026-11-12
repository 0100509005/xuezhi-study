/* 每日一题：按题型（章节）每天各出至少一道，答完可无限加练。 */
(function () {
  const COURSES_OK = ['calculus', 'algebra'];
  const DAY_FMT = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' });
  const WEEK_FMT = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', weekday: 'long' });
  const dayKey = () => DAY_FMT.format(new Date());
  const dataKey = (course, day) => `mathDaily2:${course}:${day}`;

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
    const order = MathStudyOrderOf(course);
    typeCache[course] = order.map(([chapter]) => ({
      id: practiceHash(course + '|' + chapter),
      title: cleanName(chapter),
      chapter,
      scope: scopeOf(chapter),
      lessons: LESSONS.filter(l => l.course === course && l.chapter === chapter && PRACTICE_TOPICS.has(l.id)).map(l => l.id)
    })).filter(t => t.lessons.length);
    return typeCache[course];
  }
  function MathStudyOrderOf(course) {
    return typeof MATH_STUDY_ORDER !== 'undefined' && MATH_STUDY_ORDER[course] ? MATH_STUDY_ORDER[course] : [];
  }

  function examForType(course, type) {
    return (typeof MATH_EXAM_QUESTIONS === 'undefined' ? [] : MATH_EXAM_QUESTIONS).filter(q => q.course === course && q.terms.length && q.terms.every(id => type.lessons.includes(id)));
  }
  function examSnapshot(q) {
    return {
      question: q.prompt,
      options: [...q.options],
      answer: q.answer,
      explanation: (q.steps || []).join('；'),
      key: 'exam-' + q.id,
      lessonId: q.terms[0],
      origin: '真题整理 · ' + q.paper.split('-').pop() + ' ' + q.number,
      examId: q.id
    };
  }
  function generated(course, type, seedPart) {
    const rng = practiceRng(parseInt(practiceHash(seedPart), 36) >>> 0);
    const order = rng.shuffle(type.lessons);
    for (const lessonId of order) {
      try {
        const set = makePracticeSet(lessonId, parseInt(practiceHash(seedPart + ':' + lessonId), 36) >>> 0);
        const q = set.questions[parseInt(practiceHash(seedPart + '#' + lessonId), 36) % 3];
        return { ...q, lessonId, origin: '按本知识点生成的变式题' };
      } catch (e) { /* 换下一个知识点 */ }
    }
    return null;
  }
  /* 真题优先：同题型有已录入真题时，约四成天数用真题，其余用生成题，保证题目不重样。 */
  function buildQuestion(course, type, seedPart) {
    const exams = examForType(course, type);
    const rng = practiceRng(parseInt(practiceHash(seedPart), 36) >>> 0);
    if (exams.length && rng.next() < 0.42) {
      const q = examSnapshot(rng.pick(exams));
      if (q.question && q.options.length) return q;
    }
    return generated(course, type, seedPart) || (exams.length ? examSnapshot(exams[0]) : null);
  }

  function loadDay(course, day) {
    const key = dataKey(course, day);
    let data = null;
    try { data = JSON.parse(localStorage.getItem(key)); } catch (e) { data = null; }
    if (!data || typeof data !== 'object' || !data.types || typeof data.types !== 'object') data = { types: {}, created: day };
    const types = typesFor(course);
    let changed = false;
    for (const type of types) {
      const slot = data.types[type.id];
      if (!slot || !slot.first || !validDailyQuestion(slot.first.q)) {
        const q = buildQuestion(course, type, day + '|' + type.id + '|first');
        if (q) { data.types[type.id] = { first: { q, choice: null }, extra: [] }; changed = true; }
        continue;
      }
      if (!Array.isArray(slot.extra)) { slot.extra = []; changed = true; }
      slot.extra = slot.extra.filter(item => item && validDailyQuestion(item.q)).slice(-30);
    }
    if (changed) writeDay(course, day, data);
    return data;
  }
  function writeDay(course, day, data) {
    try { localStorage.setItem(dataKey(course, day), JSON.stringify(data)); } catch (e) { /* 空间不足时保持内存状态 */ }
  }
  function validDailyQuestion(q) {
    return q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 5
      && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length && typeof q.explanation === 'string';
  }

  function questionHTML(course, type, item, index, label) {
    const q = item.q, answered = item.choice != null, right = item.choice === q.answer;
    return `<article class="daily-question" id="daily-q-${type.id}-${index}">
      <div class="daily-q-head"><span class="condition">${label}</span>${q.origin ? `<span class="condition">${escapeHTML(q.origin)}</span>` : ''}</div>
      <h3>${escapeHTML(q.question)}</h3>
      <div class="daily-options">${q.options.map((o, i) => `<button class="choice ${answered && item.choice === i ? 'selected' : ''}" data-daily-type="${type.id}" data-daily-index="${index}" data-daily-choice="${i}" ${answered ? 'disabled' : ''}>${String.fromCharCode(65 + i)}　${escapeHTML(o)}</button>`).join('')}</div>
      ${answered ? `<div class="feedback ${right ? 'correct' : ''}"><strong>${right ? '✓ 回答正确' : '再想一想'} · 正确答案：${String.fromCharCode(65 + q.answer)}</strong><p>${escapeHTML(q.explanation)}</p>${q.lessonId ? `<a href="#lesson/${q.lessonId}">看对应知识点：${escapeHTML(getItem(q.lessonId)?.title || '')} →</a>` : ''}</div>` : ''}
    </article>`;
  }

  function daily(course) {
    if (!COURSES_OK.includes(course)) return notFound();
    const day = dayKey(), types = typesFor(course), data = loadDay(course, day);
    const total = types.length;
    const finished = types.filter(t => data.types[t.id]?.first?.choice != null).length;
    const extraDone = types.reduce((n, t) => n + (data.types[t.id]?.extra || []).filter(e => e.choice != null).length, 0);
    const extraTotal = types.reduce((n, t) => n + (data.types[t.id]?.extra || []).length, 0);
    const correct = types.reduce((n, t) => {
      const slot = data.types[t.id]; if (!slot) return n;
      const items = [slot.first, ...(slot.extra || [])];
      return n + items.filter(i => i && i.choice === i.q.answer).length;
    }, 0);
    const answered = finished + extraDone;

    const cards = types.map((type, index) => {
      const slot = data.types[type.id];
      if (!slot) return '';
      const done = slot.first.choice != null;
      return `<section class="panel daily-type" id="daily-type-${type.id}">
        <div class="daily-type-head"><span class="daily-index">${String(index + 1).padStart(2, '0')}</span><h2>${escapeHTML(type.title)}</h2><span class="pill">${escapeHTML(type.scope)}</span>${done ? '<span class="daily-done">✓ 今日已完成</span>' : ''}</div>
        ${questionHTML(course, type, slot.first, 0, '今日题 · 必做')}
        ${(slot.extra || []).map((item, i) => questionHTML(course, type, item, i + 1, '加练第 ' + (i + 1) + ' 题')).join('')}
        <div class="actions"><button class="btn secondary" data-daily-more="${type.id}">再来一题（${escapeHTML(type.title)}）</button><a class="condition" href="#lesson/${slot.first.q.lessonId || type.lessons[0]}">先看这个知识点的讲解 →</a></div>
      </section>`;
    }).join('');

    shell(`<p class="eyebrow">DAILY PRACTICE · ${escapeHTML(course === 'calculus' ? 'CALCULUS' : 'LINEAR ALGEBRA')}</p><h1>每日一题</h1>${mathTabs(course)}<nav class="course-tabs" aria-label="切换每日一题学科"><a href="#math-daily/calculus" ${course === 'calculus' ? 'aria-current="page" class="selected"' : ''}>高等数学</a><a href="#math-daily/algebra" ${course === 'algebra' ? 'aria-current="page" class="selected"' : ''}>线性代数</a></nav><p class="course-description">${WEEK_FMT.format(new Date())} · 按题型各出至少一题，答完可以继续加练。题目来自已整理的历年真题或按知识点生成的同类变式，每天换参数、换考法，同一天保留作答。</p>
      <div class="panel daily-progress"><div class="daily-progress-top"><strong>今日进度</strong><span>${finished} / ${total} 个题型完成 · 已答 ${answered} 题 · 答对 ${correct} 题</span></div><div class="progress"><span style="width:${total ? finished / total * 100 : 0}%"></span></div>
      <p class="condition">${finished === total ? '今天的题型全部做完了，可以点任意题型的“再来一题”继续加练。' : `还有 ${total - finished} 个题型没做；每个题型的“今日题”作答后会记入错题集。`} ${extraTotal ? `今日加练 ${extraTotal} 题，完成 ${extraDone} 题。` : ''}</p></div>
      ${cards}
      <section class="panel"><h2>说明</h2><p class="condition">题型按课程章节划分：${types.map(t => escapeHTML(t.title)).join('、')}。每类题每天至少一道，首次作答后就算完成该题型；同一天同一题型多次作答都会保留，答错自动进入错题集。次日 0 点（北京时间）自动换新题。</p></section>`, COURSES[course].title);

    document.querySelectorAll('[data-daily-choice]').forEach(button => {
      button.addEventListener('click', () => {
        const typeId = button.dataset.dailyType, index = Number(button.dataset.dailyIndex), choice = Number(button.dataset.dailyChoice);
        const type = types.find(t => t.id === typeId), slot = data.types[typeId];
        if (!type || !slot) return;
        const item = index === 0 ? slot.first : slot.extra[index - 1];
        if (!item || item.choice != null) return;
        if (!Number.isInteger(choice) || choice < 0 || choice >= item.q.options.length) return;
        item.choice = choice;
        trackChoice(`daily:${course}:${typeId}:${day}:${index}`, item.q, choice);
        writeDay(course, day, data);
        save();
        daily(course);
        const anchor = document.getElementById(`daily-q-${typeId}-${index}`);
        if (anchor) anchor.scrollIntoView({ block: 'center' });
      });
    });
    document.querySelectorAll('[data-daily-more]').forEach(button => {      button.addEventListener('click', () => {
        const typeId = button.dataset.dailyMore, type = types.find(t => t.id === typeId), slot = data.types[typeId];
        if (!type || !slot) return;
        const n = (slot.extra || []).length + 1;
        const q = buildQuestion(course, type, day + '|' + typeId + '|extra|' + n + '|' + Date.now());
        if (!q) { alert('这个题型暂时没能出新题，换一个题型试试。'); return; }
        slot.extra.push({ q, choice: null });
        writeDay(course, day, data);
        daily(course);
        document.getElementById(`daily-q-${typeId}-${n}`)?.scrollIntoView({ block: 'center' });
      });
    });
    document.querySelectorAll('#app a[href^="#lesson/"]').forEach(link => {
      link.addEventListener('click', () => sessionStorage.setItem('dailyReturn', course));
    });
    typesetTextbook(document.getElementById('app'));
  }

  /* 依赖 app.js 的路由与渲染函数；单独加载（如校验脚本）时安全退出。 */
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
