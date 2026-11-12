/* 期中真题库：已录入真题 + 按真题考法自拟的同难度题，供每日一题与练习溯源使用。 */
const MATH_EXAM_BANK = [];
const MATH_DAILY_LEVELS = [{ id: 'all', name: '全部难度' }, { id: '1', name: '基础' }, { id: '2', name: '期中' }, { id: '3', name: '拔高' }];

(function () {
  const paperOf = id => (typeof MATH_PAPERS !== 'undefined' ? MATH_PAPERS.find(p => p.id === id) : null);
  const chapterOf = id => (LESSONS.find(l => l.id === id) || {}).chapter || '';
  const seedIndex = (text, n) => parseInt(practiceHash(text), 36) % n;

  /* 1. 已整理的历年真题（原题整理，带原页与解析页） */
  for (const q of MATH_EXAM_QUESTIONS) {
    const paper = paperOf(q.paper);
    MATH_EXAM_BANK.push({
      id: 'ex-' + q.id,
      course: q.course,
      terms: [...q.terms],
      chapter: chapterOf(q.terms[0]),
      level: q.number.startsWith('算') ? 3 : 2,
      kind: q.number.startsWith('算') ? '计算' : q.number.startsWith('填') ? '填空' : '选择',
      source: { mode: 'exam', paper: q.paper, page: q.page, answerPage: q.answerPage, number: q.number, label: `${paper ? paper.year : ''} 期中 · ${q.number}` },
      prompt: q.prompt,
      options: [...q.options],
      answer: q.answer,
      steps: [...q.steps]
    });
  }

  /* 2. 按真题考法自拟的同难度题（标注“自拟”，注明参照的章节考法） */
  const auth = {
    course: '', terms: [], level: 2, kind: '计算', ref: '', prompt: '', options: [], answer: 0, steps: []
  };
  const add = o => {
    const paper = o.refPaper ? paperOf(o.refPaper) : null;
    MATH_EXAM_BANK.push({
      id: 'auth-' + o.key,
      course: o.course,
      terms: o.terms,
      chapter: chapterOf(o.terms[0]),
      level: o.level || 2,
      kind: o.kind || '计算',
      source: {
        mode: 'authored',
        refPaper: o.refPaper || '',
        refLabel: paper ? `${paper.year} 期中卷考法` : '',
        label: o.refPaper ? `自拟 · 参照 ${paper ? paper.year + ' 期中' : ''}同题型` : '自拟 · 按课程要求同难度'
      },
      prompt: o.prompt,
      options: o.options,
      answer: o.answer,
      steps: o.steps
    });
  };

  /* —— 高数：积分与微分方程 —— */
  add({
    key: 'c6-1', course: 'calculus', terms: ['integral'], level: 2, kind: '计算',
    prompt: '计算 ∫₀¹ x·e^(x²) dx 的值。',
    options: ['(e − 1)/2', 'e − 1', 'e/2', '(e + 1)/2'], answer: 0,
    steps: ['令 u = x²，则 du = 2x dx，x 从 0 到 1 对应 u 从 0 到 1。', '原式 = ½∫₀¹ eᵘ du = ½(e − 1)。']
  });
  add({
    key: 'c6-2', course: 'calculus', terms: ['fundamental'], level: 2, kind: '计算',
    prompt: '设 F(x) = ∫₀^(x²) sin t dt，求 F′(x)。',
    options: ['2x·sin(x²)', 'sin(x²)', '2x·sin x', 'x²·sin(x²)'], answer: 0,
    steps: ['变上限积分求导：F′(x) = sin(上限)·(上限的导数)。', '上限为 x²，导数为 2x，所以 F′(x) = 2x·sin(x²)。']
  });
  add({
    key: 'c6-3', course: 'calculus', terms: ['ode'], level: 3, kind: '计算',
    prompt: '微分方程 y′ + y = e^(−x) 满足 y(0) = 1，求 y(x)。',
    options: ['(x + 1)e^(−x)', 'e^(−x)', '(1 − x)e^(−x)', 'x·e^(−x)'], answer: 0,
    steps: ['积分因子为 eˣ，两边乘 eˣ 得 (eˣy)′ = 1。', '积分得 eˣy = x + C，即 y = (x + C)e^(−x)。', '由 y(0) = 1 得 C = 1，所以 y = (x + 1)e^(−x)。']
  });

  /* —— 高数：多元与级数 —— */
  add({
    key: 'c7-1', course: 'calculus', terms: ['partial'], level: 2, kind: '计算',
    prompt: '设 z = x²y + y³，求 ∂²z/∂x∂y 在点 (1, 1) 处的值。',
    options: ['2', '1', '3', '0'], answer: 0,
    steps: ['先对 x 求偏导：∂z/∂x = 2xy。', '再对 y 求偏导：∂²z/∂x∂y = 2x。', '代入 (1, 1) 得 2。']
  });
  add({
    key: 'c7-2', course: 'calculus', terms: ['series'], level: 2, kind: '选择',
    prompt: '级数 Σₙ₌₁^∞ (−1)ⁿ/√n 的敛散性是？',
    options: ['条件收敛', '绝对收敛', '发散', '无法判断'], answer: 0,
    steps: ['这是交错级数，1/√n 单调递减趋于 0，由莱布尼茨判别法收敛。', '取绝对值后 Σ1/√n 是 p = 1/2 的 p 级数，发散。', '所以原级数条件收敛。']
  });
  add({
    key: 'c7-3', course: 'calculus', terms: ['double'], level: 2, kind: '计算',
    prompt: '计算 ∬_D (x + y) dA，其中 D 为 0 ≤ x ≤ 1、0 ≤ y ≤ 1 的正方形。',
    options: ['1', '1/2', '3/2', '2'], answer: 0,
    steps: ['拆分：∬_D x dA + ∬_D y dA。', '两项都等于 ½，所以结果为 1。']
  });

  /* —— 高数：补足已有章节的考法 —— */
  add({
    key: 'c3-1', course: 'calculus', terms: ['implicit'], level: 2, kind: '计算',
    prompt: '参数方程 x = t² + 1，y = t³ − t，求 t = 2 处的 dy/dx。',
    options: ['11/4', '3', '11/2', '5/2'], answer: 0,
    steps: ['dx/dt = 2t，dy/dt = 3t² − 1。', 'dy/dx = (3t² − 1)/(2t)。', 't = 2 时得 (12 − 1)/4 = 11/4。']
  });
  add({
    key: 'c5-1', course: 'calculus', terms: ['extrema'], level: 2, kind: '选择',
    prompt: '函数 f(x) = x³ − 3x 的极大值是？',
    options: ['2', '−2', '0', '1'], answer: 0,
    steps: ['f′(x) = 3x² − 3 = 3(x − 1)(x + 1)，驻点为 x = ±1。', 'x = −1 时 f″ = 6x < 0，取极大值 f(−1) = −1 + 3 = 2。']
  });
  add({
    key: 'c1-1', course: 'calculus', terms: ['equivalent', 'lhopital'], level: 3, kind: '计算',
    prompt: '求极限 lim(x→0) (eˣ − 1 − x)/x²。',
    options: ['1/2', '1', '0', '不存在'], answer: 0,
    steps: ['用泰勒展开：eˣ = 1 + x + x²/2 + o(x²)。', '分子 = x²/2 + o(x²)，除以 x² 后极限为 1/2。']
  });
  add({
    key: 'c2-1', course: 'calculus', terms: ['continuity'], level: 1, kind: '计算',
    prompt: '设 f(x) = sin(3x)/x（x ≠ 0），f(0) = a。要使 f 在 x = 0 处连续，a 应取何值？',
    options: ['3', '1', '0', '1/3'], answer: 0,
    steps: ['连续性要求 a = lim(x→0) sin(3x)/x。', 'lim sin(3x)/x = 3·lim sin(3x)/(3x) = 3，所以 a = 3。']
  });

  /* —— 线代：线性方程组 —— */
  add({
    key: 'a4-1', course: 'algebra', terms: ['homogeneous'], level: 2, kind: '选择',
    prompt: '设 A 是 4×5 矩阵，r(A) = 3，则齐次方程组 Ax = 0 的基础解系含有几个向量？',
    options: ['2', '3', '1', '4'], answer: 0,
    steps: ['未知数个数 n = 5，系数矩阵秩 r = 3。', '基础解系所含向量个数为 n − r = 5 − 3 = 2。']
  });
  add({
    key: 'a4-2', course: 'algebra', terms: ['inhomogeneous'], level: 2, kind: '选择',
    prompt: '设 A 为 3×4 矩阵，r(A) = 2，增广矩阵 r([A|b]) = 3，则 Ax = b 的解的情况是？',
    options: ['无解', '唯一解', '无穷多解', '无法判断'], answer: 0,
    steps: ['比较系数矩阵与增广矩阵的秩。', 'r(A) < r([A|b]) 说明出现矛盾方程，方程组无解。']
  });

  /* —— 线代：特征值与对角化 —— */
  add({
    key: 'a6-1', course: 'algebra', terms: ['eigen'], level: 2, kind: '计算',
    prompt: '矩阵 A = [[2, 1], [1, 2]] 的特征值是？',
    options: ['1 和 3', '2 和 2', '0 和 4', '−1 和 5'], answer: 0,
    steps: ['特征方程 |A − λI| = (2 − λ)² − 1 = 0。', '即 (2 − λ)² = 1，λ = 1 或 λ = 3。']
  });
  add({
    key: 'a6-2', course: 'algebra', terms: ['diagonal'], level: 2, kind: '选择',
    prompt: '3 阶矩阵 A 有三个互不相同的特征值，则 A 是否可以对角化？',
    options: ['一定可以', '不一定', '一定不可以', '只有实对称矩阵才可以'], answer: 0,
    steps: ['不同特征值对应的特征向量线性无关。', '三个互不相同的特征值给出三个线性无关的特征向量，构成可逆矩阵 P，使 P⁻¹AP 为对角阵。']
  });

  /* —— 线代：二次型 —— */
  add({
    key: 'a7-1', course: 'algebra', terms: ['positive-definite'], level: 2, kind: '选择',
    prompt: '实对称矩阵 A = [[2, 1], [1, 2]] 对应的二次型是？',
    options: ['正定', '半正定', '负定', '不定'], answer: 0,
    steps: ['顺序主子式：Δ₁ = 2 > 0，Δ₂ = |A| = 4 − 1 = 3 > 0。', '各阶顺序主子式都大于 0，所以正定。']
  });
  add({
    key: 'a7-2', course: 'algebra', terms: ['quadratic'], level: 2, kind: '选择',
    prompt: '二次型 f(x, y) = x² + 2xy + y² 的秩为？',
    options: ['1', '2', '0', '3'], answer: 0,
    steps: ['f = (x + y)²，只有 1 个非零平方项。', '化成标准形后非零项个数为 1，所以秩为 1（半正定）。']
  });

  /* —— 线代：二次曲面 —— */
  add({
    key: 'a8-1', course: 'algebra', terms: ['surface'], level: 1, kind: '选择',
    prompt: '方程 x²/4 + y²/9 + z² = 1 表示的曲面是？',
    options: ['椭球面', '单叶双曲面', '椭圆抛物面', '圆锥面'], answer: 0,
    steps: ['三个平方项系数都为正，且右边为 1。', '这是椭球面的标准方程。']
  });
  add({
    key: 'a8-2', course: 'algebra', terms: ['surface'], level: 2, kind: '选择',
    prompt: '方程 z = x² − y² 表示的曲面是？',
    options: ['双曲抛物面（马鞍面）', '椭圆抛物面', '圆锥面', '单叶双曲面'], answer: 0,
    steps: ['两个平方项一正一负，另有一次项 z。', '这是双曲抛物面的标准方程，形状像马鞍。']
  });

  /* —— 线代：补足已有章节的考法 —— */
  add({
    key: 'a1-1', course: 'algebra', terms: ['determinant', 'det-properties'], level: 1, kind: '计算',
    prompt: '设 A 为 4 阶方阵，|A| = 3，则 |2A| = ？',
    options: ['48', '24', '6', '96'], answer: 0,
    steps: ['n 阶矩阵数乘 k 后，行列式乘以 kⁿ。', '|2A| = 2⁴|A| = 16 × 3 = 48。']
  });
  add({
    key: 'a2-1', course: 'algebra', terms: ['matrix-basic'], level: 1, kind: '计算',
    prompt: '矩阵 A = [[1, 2], [3, 4]]，求 |A|。',
    options: ['−2', '2', '10', '−10'], answer: 0,
    steps: ['二阶行列式等于主对角乘积减去副对角乘积。', '|A| = 1×4 − 2×3 = −2。']
  });
  add({
    key: 'a3-1', course: 'algebra', terms: ['dot'], level: 1, kind: '选择',
    prompt: '已知 |a| = 2，|b| = 3，a·b = 3，则 a 与 b 的夹角为？',
    options: ['60°', '30°', '90°', '120°'], answer: 0,
    steps: ['cos θ = (a·b)/(|a||b|) = 3/(2×3) = 1/2。', '所以 θ = 60°。']
  });

  /* —— 补充：薄题型的题量与基础难度 —— */
  add({
    key: 'c4-1', course: 'calculus', terms: ['rolle'], level: 1, kind: '选择',
    prompt: 'f 在 [a, b] 上连续、在 (a, b) 内可导，且 f(a) = f(b)，则一定存在 ξ ∈ (a, b) 使？',
    options: ['f′(ξ) = 0', 'f(ξ) = 0', 'f″(ξ) = 0', 'f′(ξ) = 1'], answer: 0,
    steps: ['这是罗尔定理的条件与结论。', '两端函数值相等时，区间内部至少有一点的导数为零，即切线水平。']
  });
  add({
    key: 'c4-2', course: 'calculus', terms: ['mean-value'], level: 2, kind: '计算',
    prompt: 'f(x) = x² 在 [0, 2] 上满足拉格朗日中值定理，其中的 ξ 等于？',
    options: ['1', '0.5', '1.5', '2'], answer: 0,
    steps: ['平均变化率 = (f(2) − f(0))/(2 − 0) = 4/2 = 2。', 'f′(x) = 2x，令 2x = 2 得 ξ = 1，落在 (0, 2) 内。']
  });
  add({
    key: 'c2-2', course: 'calculus', terms: ['discontinuity'], level: 1, kind: '选择',
    prompt: '函数 f(x) = sin x / x 在 x = 0 处（不补充定义时）属于哪类间断点？',
    options: ['可去间断点', '跳跃间断点', '第二类间断点', '连续点'], answer: 0,
    steps: ['x → 0 时 sin x / x → 1，极限存在。', '只是该点没有定义，补充 f(0) = 1 即可连续，因此是可去间断点。']
  });
  add({
    key: 'c3-2', course: 'calculus', terms: ['higher-derivative'], level: 2, kind: '计算',
    prompt: '设 y = x·eˣ，求 y‴。',
    options: ['(x + 3)eˣ', '(x + 2)eˣ', 'x·eˣ', '(x + 1)eˣ'], answer: 0,
    steps: ['y′ = eˣ + x·eˣ = (x + 1)eˣ。', 'y″ = (x + 2)eˣ，y‴ = (x + 3)eˣ。']
  });
  add({
    key: 'a1-2', course: 'algebra', terms: ['determinant'], level: 2, kind: '计算',
    prompt: '计算三阶行列式 |1 2 3; 0 1 4; 5 6 0| 的值。',
    options: ['1', '−1', '0', '2'], answer: 0,
    steps: ['按第一行展开：1×(1×0 − 4×6) − 2×(0×0 − 4×5) + 3×(0×6 − 1×5)。', '= −24 + 40 − 15 = 1。']
  });
  add({
    key: 'a5-1', course: 'algebra', terms: ['space-distance'], level: 2, kind: '计算',
    prompt: '点 (1, 2, 3) 到平面 x + 2y + 2z − 6 = 0 的距离是？',
    options: ['5/3', '5', '1/3', '3'], answer: 0,
    steps: ['点到平面距离 d = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²)。', '代入得 |1 + 4 + 6 − 6| / √(1 + 4 + 4) = 5/3。']
  });
  add({
    key: 'a5-2', course: 'algebra', terms: ['space-relations'], level: 1, kind: '选择',
    prompt: '直线的方向向量为 (1, 2, −1)，平面的法向量为 (2, 4, −2)，则直线与平面的位置关系是？',
    options: ['平行或在平面内', '垂直', '相交但不垂直', '无法判断'], answer: 0,
    steps: ['两个向量成比例：(2, 4, −2) = 2×(1, 2, −1)，方向向量与法向量平行。', '方向向量垂直于法向量，说明直线与平面平行，或整条直线落在平面内。']
  });
  add({
    key: 'a6-3', course: 'algebra', terms: ['eigen'], level: 1, kind: '计算',
    prompt: '3 阶矩阵 A 的特征值为 1、2、3，则 |A| = ？',
    options: ['6', '0', '5', '11'], answer: 0,
    steps: ['行列式等于全部特征值之积。', '|A| = 1 × 2 × 3 = 6。']
  });

  /* 按日期稳定打乱，同一天同一题型取到同一题。 */
  MATH_EXAM_BANK.forEach((item, index) => {
    item.order = index;
    item.chapter = item.chapter || chapterOf(item.terms[0]);
  });
  MATH_EXAM_BANK.sort((a, b) => a.course.localeCompare(b.course) || a.order - b.order);
})();

function mathBankChapter(course, chapter) {
  return MATH_EXAM_BANK.filter(item => item.course === course && item.chapter === chapter);
}
function mathBankByTerms(lessonId) {
  return MATH_EXAM_BANK.filter(item => item.terms.includes(lessonId));
}
/* 练习页的真题溯源：该知识点直接关联的已录入真题。 */
function mathExamRefs(lessonId, limit = 3) {
  const list = (typeof MATH_EXAM_QUESTIONS === 'undefined' ? [] : MATH_EXAM_QUESTIONS).filter(q => q.terms.includes(lessonId));
  return list.slice(0, limit);
}
function mathPaperLink(course, kind, page) {
  const file = (course === 'calculus' ? 'calc' : 'alg') + '-' + kind;
  return `#math-paper/${file}@${page}`;
}
function mathTraceHTML(lesson, limit = 3) {
  if (!lesson || !lesson.mathStudy) return '';
  const refs = mathExamRefs(lesson.id, limit);
  const bank = mathBankByTerms(lesson.id).filter(item => item.source.mode === 'authored').slice(0, 1);
  if (!refs.length && !bank.length) {
    return `<div class="practice-trace"><strong>真题溯源</strong><p class="condition">本知识点暂无已录入的期中真题；这类考法可先在资料区按页翻看整套试卷，或在“按考点练真题”里按章节筛选。</p></div>`;
  }
  const rows = refs.map(q => {
    const paper = MATH_PAPERS.find(p => p.id === q.paper);
    const label = `${paper ? paper.year + ' 期中' : ''} · ${q.number}`;
    return `<li><span class="trace-label">${escapeHTML(label)}</span> <a href="${mathPaperLink(lesson.course, 'paper', q.page)}">原题 PDF 第 ${q.page} 页</a> · <a href="${mathPaperLink(lesson.course, 'answer', q.answerPage)}">解析第 ${q.answerPage} 页</a></li>`;
  }).join('');
  const bankRows = bank.map(item => `<li><span class="trace-label">自拟同难度题</span> ${escapeHTML(item.source.label)}</li>`).join('');
  return `<div class="practice-trace"><strong>真题溯源</strong><p class="condition">上面的随机练习按下列真题的考法与难度生成，数值和选项会变，考点不变。</p><ul>${rows}${bankRows}</ul></div>`;
}
