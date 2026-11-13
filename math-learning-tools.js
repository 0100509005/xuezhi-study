/* 每日一题：按题型（章节）出题，题目取自已整理的期中真题与同难度自拟题。 */
(function () {
  const COURSES_OK = ['calculus', 'algebra'];
  const DAY_FMT = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai' });
  const WEEK_FMT = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric', weekday: 'long' });
  const dayKey = () => DAY_FMT.format(new Date());
  const dataKey = (course, day) => `mathDaily3:${course}:${day}`;
  const scopeKey = course => `mathDailyScope:${course}`;
  const levelKey = course => `mathDailyLevel:${course}`;
  const seenKey = course => `mathDailySeen:${course}`;
  function readSeen(course) { try { const raw = JSON.parse(localStorage.getItem(seenKey(course))); return Array.isArray(raw) ? raw : []; } catch (e) { return []; } }
  function addSeen(course, id) { if (!id) return; const list = readSeen(course); if (list.includes(id)) return; list.push(id); if (list.length > 240) list.splice(0, list.length - 240); try { localStorage.setItem(seenKey(course), JSON.stringify(list)); } catch (e) { /* 空间不足 */ } }
  const adaptiveMapKey = course => `mathDailyAdaptiveLevel:${course}`;
  const LEVEL_NAMES = ['', '基础', '期中', '拔高'];

  function readAdaptiveMap(course) {
    try {
      const raw = JSON.parse(localStorage.getItem(adaptiveMapKey(course)));
      if (raw && typeof raw === 'object') return raw;
    } catch (e) { }
    return {};
  }
  function writeAdaptiveLevel(course, typeId, lvl) {
    const map = readAdaptiveMap(course);
    map[typeId] = lvl;
    try { localStorage.setItem(adaptiveMapKey(course), JSON.stringify(map)); } catch (e) { }
  }
  function currentTypeLevel(course, typeId, slot, levelSetting) {
    if (levelSetting && levelSetting !== 'adaptive' && levelSetting !== 'all') {
      return Number(levelSetting) || 2;
    }
    if (slot && slot.adaptiveLevel) return slot.adaptiveLevel;
    const map = readAdaptiveMap(course);
    return Number(map[typeId]) || 2;
  }

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
    return ['adaptive', 'all', '1', '2', '3'].includes(v) ? v : 'adaptive';
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
  function poolFor(course, type, level, usedIds, seen) {
    const all = mathBankChapter(course, type.chapter);
    const filtered = level === 'all' ? all : all.filter(item => String(item.level) === level);
    const base = filtered.length ? filtered : all;
    const unused = base.filter(item => !usedIds.includes(item.id));
    const fresh = unused.filter(item => !(seen || []).includes(item.id));
    return { list: fresh.length ? fresh : unused.length ? unused : base, fresh: fresh.length > 0 };
  }
  /* 先出没做过的题；全部做过一轮后，按上次出现的先后从最久远的开始，避免连续循环。 */
  function pickQuestion(course, type, day, level, usedIds) {
    const seen = readSeen(course);
    const picked = poolFor(course, type, level, usedIds, seen);
    if (!picked.list.length) return generated(course, type, day + '|' + type.id + '|' + usedIds.length);
    let pool = picked.list;
    if (!picked.fresh) pool = pool.slice().sort((a, b) => seen.indexOf(a.id) - seen.indexOf(b.id));
    const item = pool[parseInt(practiceHash(day + '|' + type.id + '|' + usedIds.length), 36) % pool.length];
    addSeen(course, item.id);
    return bankQuestion(item);
  }
  function slotOf(data, type, course, day, level) {
    let slot = data.types[type.id];
    const curLvl = currentTypeLevel(course, type.id, slot, level);
    const reqLevel = (level === 'adaptive') ? String(curLvl) : level;
    if (!slot || !slot.first || !validQ(slot.first.q)) {
      const q = pickQuestion(course, type, day, reqLevel, []);
      if (!q) return null;
      slot = data.types[type.id] = { first: { q, choice: null }, extra: [], adaptiveLevel: curLvl };
    }
    if (!slot.adaptiveLevel) slot.adaptiveLevel = curLvl;
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
    const shiftHTML = (answered && item.shiftInfo)
      ? `<div class="adaptive-shift-badge ${item.shiftInfo.right ? 'up' : 'down'}"><span class="shift-icon">${item.shiftInfo.right ? '📈' : '📉'}</span> ${escapeHTML(item.shiftInfo.msg)}</div>`
      : '';
    return `<article class="daily-question" id="daily-q-${type.id}-${index}">
      <div class="daily-q-head"><span class="condition">${label}</span><span class="condition">${escapeHTML(q.kind || '')}${q.level ? ' · 难度 ' + ['', '基础', '期中', '拔高'][q.level] : ''}</span></div>
      <h3>${escapeHTML(q.question)}</h3>
      ${sourceHTML(q)}
      <div class="daily-options">${q.options.map((o, i) => `<button class="choice ${answered && item.choice === i ? 'selected' : ''}" data-daily-type="${type.id}" data-daily-index="${index}" data-daily-choice="${i}" ${answered ? 'disabled' : ''}>${String.fromCharCode(65 + i)}　${escapeHTML(o)}</button>`).join('')}</div>
      ${answered ? `<div class="feedback ${right ? 'correct' : ''}"><strong>${right ? '✓ 回答正确' : '再想一想'} · 正确答案：${String.fromCharCode(65 + q.answer)}</strong><p>${escapeHTML(q.explanation)}</p>${shiftHTML}${q.lessonId ? `<a href="#lesson/${q.lessonId}">看对应知识点：${escapeHTML(getItem(q.lessonId)?.title || '')} →</a>` : ''}</div>` : ''}
    </article>`;
  }

  function cheatsheetHTML(course) {
    if (course === 'calculus') {
      return `<details class="panel daily-cheatsheet"><summary>📚 期末高频考点与公式避坑手册（高等数学 · 点击展开）</summary>
        <div class="cheatsheet-content">
          <div class="cheatsheet-grid">
            <div class="cheat-card">
              <h4>常用等价无穷小 (x → 0)</h4>
              <ul>
                <li>sin x ~ x，tan x ~ x，arcsin x ~ x，arctan x ~ x</li>
                <li>eˣ − 1 ~ x，ln(1 + x) ~ x，(1 + x)ᵃ − 1 ~ ax</li>
                <li>1 − cos x ~ ½x²，x − ln(1 + x) ~ ½x²</li>
                <li><em>避坑：</em>加减法慎用等价代换，首选泰勒展开防止主项相消！</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>二阶常系数齐次微分方程</h4>
              <ul>
                <li>方程：y″ + py′ + qy = 0，特征方程：r² + pr + q = 0</li>
                <li>Δ > 0：两不等实根 → y = C₁e^(r₁x) + C₂e^(r₂x)</li>
                <li>Δ = 0：两相等实根 → y = (C₁ + C₂x)e^(rx)（<em>重根别漏乘 x</em>）</li>
                <li>Δ < 0：共轭复根 α±iβ → y = e^(αx)(C₁ cos βx + C₂ sin βx)</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>核心麦克劳林展开 (x → 0)</h4>
              <ul>
                <li>eˣ = 1 + x + x²/2! + x³/3! + o(x³)</li>
                <li>sin x = x − x³/3! + x⁵/5! + o(x⁵)</li>
                <li>cos x = 1 − x²/2! + x⁴/4! + o(x⁴)</li>
                <li>ln(1 + x) = x − x²/2 + x³/3 − x⁴/4 + o(x⁴)</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>定积分与级数审敛核心</h4>
              <ul>
                <li>变上限积分求导：d/dx ∫_a^(φ(x)) f(t)dt = f(φ(x))·φ′(x)</li>
                <li>旋转体体积：绕 x 轴 V = π∫ y² dx；绕 y 轴 V = 2π∫ x|y| dx</li>
                <li>p-级数：Σ 1/nᵖ，p > 1 收敛，p ≤ 1 发散</li>
                <li>莱布尼茨判据：交错级数 uₙ 单调递减且 lim uₙ = 0 则收敛</li>
              </ul>
            </div>
          </div>
        </div>
      </details>`;
    }
    if (course === 'algebra') {
      return `<details class="panel daily-cheatsheet"><summary>📚 期末高频考点与公式避坑手册（线性代数 · 点击展开）</summary>
        <div class="cheatsheet-content">
          <div class="cheatsheet-grid">
            <div class="cheat-card">
              <h4>矩阵运算与伴随矩阵</h4>
              <ul>
                <li>(AB)ᵀ = BᵀAᵀ，(AB)⁻¹ = B⁻¹A⁻¹，(Aᵀ)⁻¹ = (A⁻¹)ᵀ</li>
                <li>|kA| = kⁿ|A|（<em>提取标量必带阶数 n 次方</em>）</li>
                <li>AA* = A*A = |A|I，A* = |A|A⁻¹（|A| ≠ 0）</li>
                <li>|A*| = |A|ⁿ⁻¹，(A*)* = |A|ⁿ⁻² A</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>矩阵的秩核心不等式</h4>
              <ul>
                <li>r(AB) ≤ min(r(A), r(B))</li>
                <li>若 AB = O，则 r(A) + r(B) ≤ n（A的列数/B的行数）</li>
                <li>r(A + B) ≤ r(A) + r(B)</li>
                <li>初等变换、左/右乘可逆矩阵均不改变矩阵的秩</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>特征值与正交相似对角化</h4>
              <ul>
                <li>tr A = Σ aᵢᵢ = Σ λᵢ；|A| = ∏ λᵢ</li>
                <li>实对称矩阵不同特征值的特征向量天然互相正交</li>
                <li>重特征值对应的特征向量必须做<em>施密特正交化</em></li>
                <li>正交矩阵 Q 的列向量为单位正交特征向量，QᵀAQ = 对角阵</li>
              </ul>
            </div>
            <div class="cheat-card">
              <h4>线性方程组与二次型正定</h4>
              <ul>
                <li>Ax = 0 基础解系含有 n − r(A) 个线性无关向量</li>
                <li>Ax = b 有解充要条件：r(A) = r([A|b])</li>
                <li>A 正定 ⇔ 全部特征值 λᵢ > 0 ⇔ 各阶顺序主子式全大于 0</li>
                <li><em>避坑：</em>半正定不能仅由顺序主子式非负判定，需全部主子式非负</li>
              </ul>
            </div>
          </div>
        </div>
      </details>`;
    }
    return '';
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
      const curLvl = slot.adaptiveLevel || 2;
      const adaptivePill = (level === 'adaptive')
        ? `<span class="pill adaptive-pill level-${curLvl}">难度：${LEVEL_NAMES[curLvl]} (自适应)</span>`
        : '';
      return `<section class="panel daily-type" id="daily-type-${type.id}">
        <div class="daily-type-head"><span class="daily-index">${String(index + 1).padStart(2, '0')}</span><h2>${escapeHTML(type.title)}</h2><span class="pill">${escapeHTML(type.scope)}</span>${adaptivePill}${done ? '<span class="daily-done">✓ 今日已完成</span>' : ''}</div>
        ${questionHTML(type, slot.first, 0, '今日题 · 必做')}
        ${(slot.extra || []).map((item, i) => questionHTML(type, item, i + 1, '加练第 ' + (i + 1) + ' 题')).join('')}
        <div class="actions"><button class="btn secondary" data-daily-more="${type.id}">再来一题（${escapeHTML(type.title)}）</button><a class="condition" href="#lesson/${slot.first.q.lessonId || type.lessons[0]}">先看这个知识点的讲解 →</a></div>
      </section>`;
    }).join('');

    shell(`<p class="eyebrow">DAILY PRACTICE · ${escapeHTML(course === 'calculus' ? 'CALCULUS' : 'LINEAR ALGEBRA')}</p><h1>每日一题</h1>${mathTabs(course)}<nav class="course-tabs" aria-label="切换每日一题学科"><a href="#math-daily/calculus" ${course === 'calculus' ? 'aria-current="page" class="selected"' : ''}>高等数学</a><a href="#math-daily/algebra" ${course === 'algebra' ? 'aria-current="page" class="selected"' : ''}>线性代数</a></nav><p class="course-description">${WEEK_FMT.format(new Date())} · 题目按往年期中真题的考法与难度选取，答完可以继续加练；每个题型每天至少一道。同一天保留作答，次日自动换题。</p>
      <div class="panel daily-progress"><div class="daily-progress-top"><strong>今日进度</strong><span>完成 ${finished} 个 · 共 ${total} 个题型 · 已答 ${answered} 题 · 答对 ${correct} 题</span></div><div class="progress"><span style="width:${total ? finished / total * 100 : 0}%"></span></div>
      <p class="condition">${total === 0 ? '还没有选题型，请在下面的“考察范围”里至少勾一个。' : finished === total ? '今天的题型全部做完了，可以点任意题型的“再来一题”继续加练。' : `还有 ${total - finished} 个题型没做；答错会自动进入错题集。`} ${extraTotal ? `今日加练 ${extraTotal} 题，完成 ${extraDone} 题。` : ''}</p></div>
      ${cheatsheetHTML(course)}
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
        const isRight = choice === item.q.answer;

        // 动态自适应难度：做对升一档，做错降一档
        const curLvl = Number(slot.adaptiveLevel) || (item.q.level ? Number(item.q.level) : 2);
        let nextLvl = curLvl;
        if (isRight) {
          nextLvl = Math.min(3, curLvl + 1);
        } else {
          nextLvl = Math.max(1, curLvl - 1);
        }
        slot.adaptiveLevel = nextLvl;
        writeAdaptiveLevel(course, typeId, nextLvl);
        item.shiftInfo = {
          right: isRight,
          from: curLvl,
          to: nextLvl,
          msg: isRight
            ? (nextLvl > curLvl ? `回答正确！下一题难度升至【${LEVEL_NAMES[nextLvl]}】↑` : `已连续答对，保持最高难度【${LEVEL_NAMES[nextLvl]}】`)
            : (nextLvl < curLvl ? `再想一想（已加入错题集）。下次出题难度降为【${LEVEL_NAMES[nextLvl]}】基础题巩固 ↓` : `已处于【${LEVEL_NAMES[nextLvl]}】基础难度，重点弄清概念`)
        };

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
        const reqLevel = (level === 'adaptive') ? String(slot.adaptiveLevel || 2) : level;
        const q = pickQuestion(course, type, day, reqLevel, used);
        if (!q) { alert('这个题型暂时没能出新题，换一个题型试试。'); return; }
        slot.extra.push({ q, choice: null });
        addSeen(course, q.bankId);
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

  if (typeof globalThis !== 'undefined') {
    globalThis.__dailyTest = { typesFor, readDay, writeDay, slotOf, pickQuestion, readAdaptiveMap, writeAdaptiveLevel, poolFor };
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
