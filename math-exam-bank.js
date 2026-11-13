/* 期中真题库：已录入真题 + 按真题考法自拟的同难度题，供每日一题与练习溯源使用。 */
const MATH_EXAM_BANK = [];
const MATH_DAILY_LEVELS = [
  { id: 'adaptive', name: '智能自适应（做对升档 / 做错降档）' },
  { id: 'all', name: '全部难度' },
  { id: '1', name: '基础' },
  { id: '2', name: '期中' },
  { id: '3', name: '拔高' }
];

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

  /* —— 期末考点冲刺：补全各题型 L1 基础与 L3 拔高阶梯 —— */
  /* 高数题型梯度补齐 */
  add({
    key: 'c1-base', course: 'calculus', terms: ['sequence'], level: 1, kind: '计算',
    prompt: '数列 aₙ = (2n + 1)/(3n − 2) 当 n → ∞ 时的极限是？',
    options: ['2/3', '1/3', '1', '不存在'], answer: 0,
    steps: ['分子分母同除以最高次项 n。', '原式 = lim (2 + 1/n)/(3 − 2/n) = (2 + 0)/(3 − 0) = 2/3。']
  });
  add({
    key: 'c1-adv', course: 'calculus', terms: ['squeeze', 'limit'], level: 3, kind: '计算',
    prompt: '求极限 lim(n→∞) [1/√(n² + 1) + 1/√(n² + 2) + ⋯ + 1/√(n² + n)]。',
    options: ['1', '0', '1/2', '2'], answer: 0,
    steps: ['每一项放大为 1/√(n² + 1)，缩小为 1/√(n² + n)。', '下界 = n/√(n² + n) = 1/√(1 + 1/n) → 1。', '上界 = n/√(n² + 1) = 1/√(1 + 1/n²) → 1。', '由夹逼定理，原极限为 1。']
  });
  add({
    key: 'c2-adv', course: 'calculus', terms: ['discontinuity', 'continuity-root'], level: 3, kind: '选择',
    prompt: '方程 x·2ˣ = 1 在区间 (0, 1) 内实根的个数为？',
    options: ['恰好 1 个', '0 个', '2 个', '无穷多个'], answer: 0,
    steps: ['设 f(x) = x·2ˣ − 1，f 在 [0, 1] 连续。', '端点值 f(0) = −1 < 0，f(1) = 1 > 0，由零点存在定理在 (0, 1) 至少有 1 个根。', '导数 f′(x) = 2ˣ(1 + x ln 2) > 0（x ∈ (0, 1)），f 严格单调递增，故实根唯一。']
  });
  add({
    key: 'c3-base', course: 'calculus', terms: ['derivative-rules'], level: 1, kind: '计算',
    prompt: '设 f(x) = ln(x² + 1)，求导数 f′(x)。',
    options: ['2x/(x² + 1)', '1/(x² + 1)', 'x/(x² + 1)', '2/(x² + 1)'], answer: 0,
    steps: ['复合函数求导（链式法则）：外层 (ln u)′ = 1/u，内层 u′ = 2x。', '相乘得 f′(x) = 2x/(x² + 1)。']
  });
  add({
    key: 'c3-adv', course: 'calculus', terms: ['implicit', 'differential'], level: 3, kind: '计算',
    prompt: '曲线 y = f(x) 由 x² + 2xy + y³ = 4 确定，求在点 (1, 1) 处的切线方程。',
    options: ['4x + 5y − 9 = 0', '4x − 5y + 1 = 0', '2x + 3y − 5 = 0', 'x + y − 2 = 0'], answer: 0,
    steps: ['两边对 x 求导：2x + 2(y + xy′) + 3y²y′ = 0。', '将 (x, y) = (1, 1) 代入：2 + 2(1 + y′) + 3y′ = 0，解得 y′ = −4/5。', '切线方程为 y − 1 = −4/5(x − 1)，整理得 4x + 5y − 9 = 0。']
  });
  add({
    key: 'c4-base', course: 'calculus', terms: ['lhopital'], level: 1, kind: '计算',
    prompt: '求未定式极限 lim(x→0) (tan x − x)/x³ 的值。',
    options: ['1/3', '1/2', '1', '0'], answer: 0,
    steps: ['x → 0 为 0/0 型，使用泰勒展开。', 'tan x = x + x³/3 + o(x³)，分子为 x³/3 + o(x³)。', '除以 x³ 后极限为 1/3。']
  });
  add({
    key: 'c5-base', course: 'calculus', terms: ['concavity'], level: 1, kind: '计算',
    prompt: '函数 f(x) = x³ − 3x² 的拐点坐标是？',
    options: ['(1, −2)', '(0, 0)', '(2, −4)', '(1, 0)'], answer: 0,
    steps: ['求二阶导数：f′(x) = 3x² − 6x，f″(x) = 6x − 6。', '令 f″(x) = 0 得 x = 1；两侧 f″ 变号，故 x = 1 对应拐点。', '代入原函数得 y = 1 − 3 = −2，拐点为 (1, −2)。']
  });
  add({
    key: 'c5-adv', course: 'calculus', terms: ['asymptote', 'auxiliary-function'], level: 3, kind: '计算',
    prompt: '曲线 y = (x² + 2x − 1)/(x − 1) 的斜渐近线方程是？',
    options: ['y = x + 3', 'y = x + 2', 'y = x − 1', 'y = x + 1'], answer: 0,
    steps: ['多项式除法：(x² + 2x − 1) = (x − 1)(x + 3) + 2。', '即 y = x + 3 + 2/(x − 1)。', '当 x → ±∞ 时，2/(x − 1) → 0，因此斜渐近线为 y = x + 3。']
  });
  add({
    key: 'c6-base', course: 'calculus', terms: ['antiderivative'], level: 1, kind: '计算',
    prompt: '不定积分 ∫ x/(1 + x²) dx 等于？',
    options: ['½ ln(1 + x²) + C', 'ln(1 + x²) + C', 'arctan x + C', '2 ln(1 + x²) + C'], answer: 0,
    steps: ['凑微分：x dx = ½ d(1 + x²)。', '原式 = ½ ∫ 1/(1 + x²) d(1 + x²) = ½ ln(1 + x²) + C。']
  });
  add({
    key: 'c6-area', course: 'calculus', terms: ['integral'], level: 2, kind: '计算',
    prompt: '抛物线 y = x² 与直线 y = 2x 所围成平面图形的面积为？',
    options: ['4/3', '2/3', '2', '1'], answer: 0,
    steps: ['求交点：x² = 2x 得 x = 0 或 x = 2。', '在 [0, 2] 上直线在上，面积 S = ∫₀² (2x − x²) dx。', '= [x² − x³/3]₀² = 4 − 8/3 = 4/3。']
  });
  add({
    key: 'c6-ode2', course: 'calculus', terms: ['ode'], level: 3, kind: '计算',
    prompt: '微分方程 y″ − 3y′ + 2y = 0 的通解为（C₁、C₂ 为任意常数）？',
    options: ['y = C₁eˣ + C₂e^(2x)', 'y = C₁e^(−x) + C₂e^(−2x)', 'y = (C₁ + C₂x)eˣ', 'y = C₁ cos x + C₂ sin(2x)'], answer: 0,
    steps: ['写出特征方程：r² − 3r + 2 = 0，即 (r − 1)(r − 2) = 0。', '特征根为两个不相等的实根：r₁ = 1，r₂ = 2。', '对应的通解为 y = C₁eˣ + C₂e^(2x)。']
  });
  add({
    key: 'c7-base', course: 'calculus', terms: ['partial'], level: 1, kind: '计算',
    prompt: '设 z = e^(2x + 3y)，求一阶偏导数 ∂z/∂x。',
    options: ['2e^(2x + 3y)', '3e^(2x + 3y)', 'e^(2x + 3y)', '6e^(2x + 3y)'], answer: 0,
    steps: ['把 y 视为常数对 x 求导。', '内层 2x + 3y 对 x 的导数为 2，故 ∂z/∂x = 2e^(2x + 3y)。']
  });
  add({
    key: 'c7-adv', course: 'calculus', terms: ['series'], level: 3, kind: '计算',
    prompt: '幂级数 Σₙ₌₁^∞ (x − 1)ⁿ / (n · 2ⁿ) 的收敛半径 R 为？',
    options: ['2', '1', '1/2', '4'], answer: 0,
    steps: ['系数 aₙ = 1 / (n · 2ⁿ)。', '比较相邻比值：lim |aₙ/aₙ₊₁| = lim [(n+1)·2ⁿ⁺¹] / [n·2ⁿ] = 2 · lim (1 + 1/n) = 2。', '所以收敛半径 R = 2。']
  });

  /* 线代题型梯度补齐 */
  add({
    key: 'a1-adv', course: 'algebra', terms: ['vandermonde', 'determinant'], level: 3, kind: '计算',
    prompt: '设 3 阶范德蒙行列式 D = |1 1 1; x 2 3; x² 4 9| = 0，则实数 x 的所有可能值为？',
    options: ['2 或 3', '仅 2', '仅 3', '0 或 1'], answer: 0,
    steps: ['按范德蒙行列式公式：D = (3 − 2)(3 − x)(2 − x) = (3 − x)(2 − x)。', '令 D = 0，解得 x = 2 或 x = 3。']
  });
  add({
    key: 'a2-adv', course: 'algebra', terms: ['adjugate', 'inverse'], level: 3, kind: '计算',
    prompt: '设 A 是 3 阶方阵，|A| = 2，求 |(A*)*| 的值。',
    options: ['16', '8', '32', '64'], answer: 0,
    steps: ['|A*| = |A|^(n−1) = 2² = 4。', '利用伴随矩阵的伴随公式：(A*)* = |A|^(n−2) A = 2¹ A = 2A。', '所以 |(A*)*| = |2A| = 2³|A| = 8 × 2 = 16。']
  });
  add({
    key: 'a3-adv', course: 'algebra', terms: ['basis', 'rank-relations'], level: 3, kind: '计算',
    prompt: '向量组 α₁ = (1, 2, 3)ᵀ，α₂ = (2, 3, 4)ᵀ，α₃ = (3, 4, t)ᵀ 线性相关，则 t 等于？',
    options: ['5', '4', '6', '0'], answer: 0,
    steps: ['3 个 3 维向量线性相关的充要条件是其构成的行列式为 0。', 'det [1 2 3; 2 3 4; 3 4 t] = 0。', '经初等行变换得第 2 行 (1, 1, 1)，第 3 行 (1, 1, t−4)；成比例要求 t − 4 = 1，解得 t = 5。']
  });
  add({
    key: 'a4-base', course: 'algebra', terms: ['homogeneous'], level: 1, kind: '选择',
    prompt: '齐次线性方程组 Ax = 0 仅有零解的充分必要条件是？',
    options: ['系数矩阵 A 的列向量组线性无关', '系数矩阵 A 的行向量组线性无关', 'r(A) < 未知数个数 n', '常数项全为 0'], answer: 0,
    steps: ['Ax = x₁α₁ + ⋯ + xₙαₙ = 0。', '仅有零解等价于不存在非零标量使列向量组合为 0，即列向量组线性无关。']
  });
  add({
    key: 'a4-adv', course: 'algebra', terms: ['inhomogeneous', 'homogeneous'], level: 3, kind: '选择',
    prompt: '设 η₁、η₂、η₃ 是非齐次方程组 Ax = b 的三个解，r(A) = 3，n = 4。若 η₁ + η₂ = 2η₃，则通解为？',
    options: ['η₃ + c(η₁ − η₂)', 'η₁ + c(η₂ + η₃)', 'c(η₁ − η₂)', 'η₂ + c(η₁ + η₂)'], answer: 0,
    steps: ['基础解系向量个数 = n − r(A) = 4 − 3 = 1。', '两个特解之差 η₁ − η₂ 是导出组 Ax = 0 的解向量。', '由条件可知 η₁ − η₂ 可作为基础解系，故通解为特解加导出组通解：η₃ + c(η₁ − η₂)。']
  });
  add({
    key: 'a5-adv', course: 'algebra', terms: ['plane', 'cross'], level: 3, kind: '计算',
    prompt: '过点 M₀(1, 0, −1) 且同时平行于 a = (2, 1, 1) 和 b = (1, −1, 0) 的平面方程是？',
    options: ['x + y − 3z − 4 = 0', 'x − y + 3z + 2 = 0', 'x + y + 3z + 2 = 0', '2x + y − z − 3 = 0'], answer: 0,
    steps: ['法向量 n = a × b = (1, 1, −3)。', '点法式方程：1·(x − 1) + 1·(y − 0) − 3·(z + 1) = 0。', '整理得 x + y − 3z − 4 = 0。']
  });
  add({
    key: 'a6-adv', course: 'algebra', terms: ['symmetric-diagonal', 'orthogonal'], level: 3, kind: '选择',
    prompt: '设实对称矩阵 A = [[1, 2], [2, 1]]，正交矩阵 Q 使 QᵀAQ 为对角阵，则 Q 可取为？',
    options: ['[[1/√2, 1/√2], [1/√2, −1/√2]]', '[[1, 0], [0, 1]]', '[[1, 2], [2, 1]]', '[[2, 1], [1, 2]]'], answer: 0,
    steps: ['特征多项式 (1 − λ)² − 4 = 0，解得 λ₁ = 3，λ₂ = −1。', '对应的单位特征向量分别为 (1/√2, 1/√2)ᵀ 与 (1/√2, −1/√2)ᵀ。', '排成正交矩阵 Q = [[1/√2, 1/√2], [1/√2, −1/√2]]。']
  });
  add({
    key: 'a7-base', course: 'algebra', terms: ['positive-definite'], level: 1, kind: '选择',
    prompt: '若二次型 f(x₁, x₂, x₃) = x₁² + tx₂² + 2x₃² + 2x₁x₂ 正定，则参数 t 的取值范围是？',
    options: ['t > 1', 't > 0', 't < 1', 't > 2'], answer: 0,
    steps: ['二次型矩阵 A = [[1, 1, 0], [1, t, 0], [0, 0, 2]]。', '二阶顺序主子式 Δ₂ = t − 1 > 0，故 t > 1。', '三阶顺序主子式 Δ₃ = 2(t − 1) > 0，同样要求 t > 1。']
  });
  add({
    key: 'a7-adv', course: 'algebra', terms: ['congruence', 'quadratic'], level: 3, kind: '选择',
    prompt: '二次型 f(x₁, x₂, x₃) = x₁² + 4x₂² + 4x₃² + 2x₁x₂ − 4x₂x₃ 的规范形是？',
    options: ['y₁² + y₂² + y₃²', 'y₁² + y₂²', 'y₁² − y₂² + y₃²', 'y₁² + y₂² − y₃²'], answer: 0,
    steps: ['配方得 (x₁ + x₂)² + 3(x₂ − ⅔x₃)² + ⁸⁄₃x₃²。', '正惯性指数 p = 3，负惯性指数 q = 0。', '故规范形为 y₁² + y₂² + y₃²。']
  });
  add({
    key: 'a8-adv', course: 'algebra', terms: ['surface'], level: 3, kind: '选择',
    prompt: '方程 x² + 2y² − 3z² = 0 表示的空间曲面是？',
    options: ['椭圆锥面', '单叶双曲面', '双叶双曲面', '双曲柱面'], answer: 0,
    steps: ['三个二次项两正一负，且常数项为 0。', '这是顶点在原点的二次锥面（椭圆锥面）标准方程。']
  });


  /* 3. 从历年卷抽取的选择题：按题干关键词归入章节，作为真题池 */
  (function () {
    if (typeof MATH_PAPER_QUESTIONS === 'undefined') return;
    const CHAPTERS = course => ((typeof MATH_STUDY_ORDER !== 'undefined' && MATH_STUDY_ORDER[course]) || []).map(([c]) => c);
    const RULES = {
      calculus: [
        [/极限|数列|收敛|无穷小|等价|夹逼|洛必达|连续|间断/, 0],
        [/连续|间断|零点|一致连续/, 1],
        [/导数|可导|微分|切线|隐函数|高阶导/, 2],
        [/中值|罗尔|泰勒|拉格朗日|柯西/, 3],
        [/单调|极值|凹|凸|拐点|渐近线/, 4],
        [/积分|原函数|微分方程/, 5],
        [/偏导|二重积分|级数|多元/, 6]
      ],
      algebra: [
        [/行列式|余子式|代数余子式|范德蒙|克莱姆/, 0],
        [/矩阵|逆|伴随|秩|初等|分块|迹/, 1],
        [/向量|点积|叉积|投影|线性相关|基/, 2],
        [/方程组|解系|通解|特解/, 3],
        [/平面|直线|空间|距离|对称/, 4],
        [/特征值|特征向量|对角化|正交/, 5],
        [/二次型|正定|合同|惯性/, 6],
        [/曲面|椭球|双曲|抛物/, 7]
      ]
    };
    for (const q of MATH_PAPER_QUESTIONS) {
      const chapters = CHAPTERS(q.course);
      const rule = (RULES[q.course] || []).find(([re]) => re.test(q.prompt));
      if (!rule || !chapters[rule[1]]) continue;
      MATH_EXAM_BANK.push({
        id: 'paper-' + q.id,
        course: q.course,
        terms: [],
        chapter: chapters[rule[1]],
        level: 2,
        kind: '选择',
        source: { mode: 'paper', year: q.year, page: q.page, answerPage: null, number: q.number, label: `${q.year} 期中 · ${q.number}（原卷转录）` },
        prompt: q.prompt,
        options: [...q.options],
        answer: q.answer,
        steps: ['本题为原卷文字转录，完整推导见解析册对应页。']
      });
    }
  })();

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
