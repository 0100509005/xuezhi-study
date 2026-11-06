/* 高等数学与线性代数的图解。图形按概念手绘，坐标只用于示意，不当作精确比例。 */

/* ── 高数 ─────────────────────────────────────────────── */
(function derivativeVisual() {
  const uid = 'vis-deriv', box = { x0: 84, x1: 556, y0: 40, y1: 278 }, xd = [-0.45, 2.75], yd = [-0.9, 6.8];
  const map = svgMap(box, xd, yd), f = x => x * x, a = 1, h = 1.2, b = a + h;
  const [ax, ay] = map(a, f(a)), [bx, by] = map(b, f(b)), axisY = map(0, 0)[1];
  const secSlope = (f(b) - f(a)) / (b - a), tanSlope = 2 * a;
  const at = (x, slope) => map(x, f(a) + slope * (x - a));
  const body = [
    svgLine(...map(0, yd[0]), ...map(0, yd[1]), { stroke: SVIS.soft, w: 1.2 }),
    svgLine(...map(xd[0], 0), ...map(xd[1], 0), { stroke: SVIS.soft, w: 1.2 }),
    svgText(map(xd[1], 0)[0] + 14, axisY + 4, 'x', { math: true, italic: true, size: 14, fill: SVIS.muted }),
    svgText(map(0, yd[1])[0] - 14, map(0, yd[1])[1] + 4, 'y', { math: true, italic: true, size: 14, fill: SVIS.muted }),
    svgPlot(f, 0, 2.6, 80, map),
    svgText(map(2.55, f(2.55))[0] - 8, map(2.55, f(2.55))[1] - 12, 'f(x) = x²', { math: true, size: 13, fill: SVIS.green, anchor: 'end' }),
    svgLine(...at(0.6, secSlope), ...at(2.5, secSlope), { stroke: SVIS.mid, w: 2.2, dash: '8 5' }),
    svgText(at(2.5, secSlope)[0] + 6, at(2.5, secSlope)[1] - 8, '割线 PQ', { size: 12, fill: SVIS.mid, anchor: 'start' }),
    svgLine(...at(0.5, tanSlope), ...at(2.45, tanSlope), { stroke: SVIS.gold, w: 2.4 }),
    svgText(at(2.45, tanSlope)[0] + 4, at(2.45, tanSlope)[1] + 20, '切线', { size: 12, fill: SVIS.gold, anchor: 'start' }),
    svgLine(ax, ay, bx, ay, { stroke: SVIS.warm, w: 1.3, dash: '4 4' }),
    svgLine(bx, ay, bx, by, { stroke: SVIS.warm, w: 1.3, dash: '4 4' }),
    svgText((ax + bx) / 2, ay + 18, 'Δx = h = 1.2', { size: 11.5, fill: SVIS.warm, math: true }),
    svgText(bx + 7, (ay + by) / 2 + 4, 'Δy', { size: 11.5, fill: SVIS.warm, math: true, anchor: 'start' }),
    svgLine(ax, ay, ax, axisY, { stroke: SVIS.pale, w: 1, dash: '3 4' }),
    svgDot(ax, ay, { r: 4.2 }),
    svgDot(bx, by, { r: 4, fill: SVIS.paper, stroke: SVIS.muted }),
    svgText(ax - 12, axisY + 18, 'a', { math: true, italic: true, size: 13 }),
    svgText(bx + 2, axisY + 18, 'a + h', { math: true, size: 12 })
  ].join('');
  visual('derivative', {
    title: '割线转到切线：导数是切线斜率',
    kind: '几何示意',
    figure: svgSvg(uid, 640, 330, '函数曲线上的割线 PQ 与 a 点的切线，三角形给出差商', body),
    caption: '曲线上取 P(a, f(a)) 与 Q(a+h, f(a+h))，割线 PQ 的斜率就是差商：纵向改变量 Δy 除以横向改变量 Δx。让 Q 沿曲线滑向 P（h→0），割线绕 P 转动的极限位置就是切线，它的斜率就是导数 f′(a)。',
    read: [
      '实心点是 P（横坐标 a），空心点是 Q（横坐标 a + h）。',
      '橙色虚线三角形给出差商：横边 Δx = h，竖边 Δy = f(a+h) − f(a)。',
      '金色切线只由 a 点决定，与 h 无关；割线随 h 变化，h→0 时向切线靠拢。',
      '导数为负时切线向右下倾斜，这只说明“输入增加、输出减少”，不代表函数值是负的。'
    ]
  });
})();

(function integralVisual() {
  const uid = 'vis-integral', box = { x0: 76, x1: 592, y0: 46, y1: 268 }, xd = [-0.25, 4.45], yd = [0, 5.3];
  const map = svgMap(box, xd, yd), f = x => 2.8 + 1.7 * Math.sin(1.3 * x), n = 8, dx = 4 / n;
  const [base] = [map(0, 0)[1]];
  let rects = '', marks = '';
  for (let i = 0; i < n; i++) {
    const left = i * dx, mid = left + dx / 2, top = f(mid);
    const [x1] = map(left, 0), [x2] = map(left + dx, 0), [, yTop] = map(left, top);
    rects += svgBox(x1, yTop, x2 - x1, base - yTop, { fill: SVIS.accent, stroke: SVIS.pale, opacity: 0.72, rx: 0 });
    marks += svgDot((x1 + x2) / 2, yTop, { r: 2.4, fill: SVIS.mid });
  }
  const body = [
    svgLine(...map(0, 0), ...map(4.4, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...map(0, 0), ...map(0, 5.1), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    rects,
    svgPlot(f, 0, 4, 120, map),
    svgText(map(4.4, 0)[0], map(4.4, 0)[1] + 20, 'x', { math: true, italic: true, size: 14, fill: SVIS.muted }),
    svgText(map(0, 5.1)[0] - 14, map(0, 5.1)[1], 'y', { math: true, italic: true, size: 14, fill: SVIS.muted }),
    svgText(map(0, 0)[0] - 4, map(0, 0)[1] + 22, 'a', { math: true, italic: true, size: 13 }),
    svgText(map(4, 0)[0], map(4, 0)[1] + 22, 'b', { math: true, italic: true, size: 13 }),
    svgLine(map(1.5, 0.55)[0], map(1.5, 0.55)[1], map(2, 0.55)[0], map(2, 0.55)[1], { stroke: SVIS.warm, w: 1.4 }),
    svgLine(map(1.5, 0.4)[0], map(1.5, 0.4)[1], map(1.5, 0.7)[0], map(1.5, 0.7)[1], { stroke: SVIS.warm, w: 1.4 }),
    svgLine(map(2, 0.4)[0], map(2, 0.4)[1], map(2, 0.7)[0], map(2, 0.7)[1], { stroke: SVIS.warm, w: 1.4 }),
    svgText(map(1.75, 0.28)[0], map(1.75, 0.28)[1], 'Δx', { math: true, size: 12, fill: SVIS.warm }),
    svgText(map(0.15, 4.85)[0], map(0.15, 4.85)[1], '每个矩形 ≈ f(ξᵢ) · Δx', { size: 12, fill: SVIS.green, anchor: 'start' })
  ].join('');
  visual('integral', {
    title: '把区域切成小条再累加：定积分',
    kind: '面积示意',
    figure: svgSvg(uid, 640, 320, '曲线下方用八个小矩形近似面积，矩形越窄近似越好', body),
    caption: '把 [a, b] 分成 n 个小段，每段宽 Δx，用一个矩形代表这一小段的高度 f(ξᵢ)。所有矩形面积相加，再把 Δx 压到 0，就得到定积分。',
    read: [
      '绿色曲线是 f(x)；每个浅绿色矩形是一个“小份贡献”，高度取该小段内某点的函数值。',
      '分得越细（n 变大、Δx 变小），矩形总和越接近曲线下的真实面积。',
      '曲线落到 x 轴下方时，函数值为负，这一段的“面积”按负数累加——所以定积分算的是代数和，不自动等于几何面积。'
    ]
  });
})();

(function fundamentalVisual() {
  const uid = 'vis-fund', box = { x0: 76, x1: 590, y0: 44, y1: 266 }, xd = [-0.2, 5.4], yd = [0, 4.4];
  const map = svgMap(box, xd, yd), f = x => 1 + 1.25 * Math.sin(0.85 * x) + 0.22 * x;
  const a = 1, x = 3.5, strip = 0.32;
  const areaPts = [`${map(a, 0)[0].toFixed(1)},${map(a, 0)[1].toFixed(1)}`];
  for (let i = 0; i <= 90; i++) { const t = a + (x - a) * i / 90; areaPts.push(`${map(t, 0)[0].toFixed(1)},${map(t, f(t))[1].toFixed(1)}`); }
  areaPts.push(`${map(x, 0)[0].toFixed(1)},${map(x, 0)[1].toFixed(1)}`);
  const stripPts = [`${map(x, 0)[0].toFixed(1)},${map(x, 0)[1].toFixed(1)}`];
  for (let i = 0; i <= 8; i++) { const t = x + strip * i / 8; stripPts.push(`${map(t, 0)[0].toFixed(1)},${map(t, f(t))[1].toFixed(1)}`); }
  stripPts.push(`${map(x + strip, 0)[0].toFixed(1)},${map(x + strip, 0)[1].toFixed(1)}`);
  const body = [
    svgLine(...map(0, 0), ...map(5.4, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...map(0, 0), ...map(0, 4.2), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgPoly(areaPts.join(' '), { stroke: SVIS.soft, w: 1.2, fill: SVIS.accent, opacity: 0.85 }),
    svgPoly(stripPts.join(' '), { stroke: SVIS.green, w: 1.4, fill: SVIS.pale }),
    svgPlot(f, 0, 5, 140, map),
    svgText(map(0, 0)[0] - 4, map(0, 0)[1] + 20, 'a', { math: true, size: 13 }),
    svgText(map(x, 0)[0], map(x, 0)[1] + 20, 'x', { math: true, size: 13 }),
    svgText(map(5.4, 0)[0], map(5.4, 0)[1] + 20, 't', { math: true, size: 13, fill: SVIS.muted }),
    svgText(map(2.2, 0.9)[0], map(2.2, 0.9)[1], 'A(x)', { math: true, size: 15, fill: SVIS.green }),
    svgText(map(3.98, 2.35)[0], map(3.98, 2.35)[1], '新增窄条 ≈ f(x)Δx', { size: 11.5, fill: SVIS.deep, anchor: 'start' }),
    svgLine(map(3.94, 2.28)[0], map(3.94, 2.28)[1], map(3.83, f(3.83))[0], map(3.83, f(3.83))[1], { stroke: SVIS.deep, w: 1, dash: '3 3' }),
    svgText(map(0.3, 3.9)[0], map(0.3, 3.9)[1], 'A(x) = ∫ f(t) dt', { math: true, size: 13, fill: SVIS.muted, anchor: 'start' })
  ].join('');
  visual('fundamental', {
    title: '面积函数怎样长出来：A′(x) = f(x)',
    kind: '面积示意',
    figure: svgSvg(uid, 640, 320, '从 a 到 x 的变上限面积函数，x 增加一小段时新增面积近似为高度乘宽度', body),
    caption: '从 a 累积到 x 的面积记作 A(x)。让 x 再向右挪一小段 Δx，新增的窄条面积约等于 f(x)·Δx，所以 A 的增长速度正好是被积函数 f。',
    read: [
      '整块浅绿色区域是 A(x)；右侧深色窄条是 x 再增加 Δx 时新加进来的部分。',
      '窄条越高（f(x) 越大），A 涨得越快——这就是 A′(x) = f(x) 的含义。',
      '有了这个关系，累加（求积分）就能用原函数的端点值来算：∫ₐᵇ f = F(b) − F(a)。'
    ]
  });
})();

(function rolleVisual() {
  const uid = 'vis-rolle', box = { x0: 76, x1: 588, y0: 50, y1: 262 }, xd = [-0.4, 3.4], yd = [-0.6, 3.2];
  const map = svgMap(box, xd, yd), f = x => 2.6 - (x - 1.5) ** 2, level = 0.35;
  const [ax, ay] = map(0, level), [bx, by] = map(3, level), [px, py] = map(1.5, 2.6);
  const body = [
    svgLine(...map(0, 0), ...map(3.4, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgPlot(f, -0.1, 3.1, 90, map),
    svgLine(ax, ay, bx, ay, { stroke: SVIS.warm, w: 1.6, dash: '6 5' }),
    svgLine(map(0.9, 2.6)[0], py, map(2.1, 2.6)[0], py, { stroke: SVIS.gold, w: 2.2 }),
    svgLine(px, py, px, map(1.5, 0)[1], { stroke: SVIS.pale, w: 1, dash: '3 4' }),
    svgDot(ax, ay), svgDot(bx, by), svgDot(px, py, { fill: SVIS.gold }),
    svgText(ax - 2, ay - 10, 'f(a)', { math: true, size: 12, fill: SVIS.warm, anchor: 'end' }),
    svgText(bx + 2, by - 10, 'f(b)', { math: true, size: 12, fill: SVIS.warm, anchor: 'start' }),
    svgText(px, py - 12, 'f′(ξ) = 0', { math: true, size: 12, fill: SVIS.gold }),
    svgText(map(0, 0)[0] - 4, map(0, 0)[1] + 20, 'a', { math: true, size: 13 }),
    svgText(map(3, 0)[0], map(3, 0)[1] + 20, 'b', { math: true, size: 13 }),
    svgText(map(1.5, 0)[0], map(1.5, 0)[1] + 20, 'ξ', { math: true, size: 13, fill: SVIS.gold })
  ].join('');
  visual('rolle', {
    title: '两端等高，中间必有一处水平切线',
    kind: '定理示意',
    figure: svgSvg(uid, 640, 316, '两端函数值相等时，曲线最高点处的切线水平，导数为零', body),
    caption: '罗尔定理的三个条件：闭区间连续、开区间可导、两端函数值相等。结论是内部至少存在一点 ξ，使 f′(ξ) = 0。',
    read: [
      '橙色虚线把两端连起来，它水平，说明 f(a) = f(b)。',
      '金色实线是 ξ 处的切线，水平就是“导数为零”。',
      '“至少一点”不等于“恰好一点”：曲线若有多个峰谷，可以有多处导数为零。缺了可导条件，尖点处可能没有水平切线。'
    ]
  });
})();

(function meanValueVisual() {
  const uid = 'vis-mvt', box = { x0: 76, x1: 588, y0: 50, y1: 262 }, xd = [0.2, 2.8], yd = [0, 7.4];
  const map = svgMap(box, xd, yd), f = x => x * x, a = 0.6, b = 2.4, xi = 1.5;
  const slope = 3;
  const body = [
    svgLine(...map(0.2, 0), ...map(2.8, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgPlot(f, 0.35, 2.65, 70, map),
    svgLine(...map(a, f(a)), ...map(b, f(b)), { stroke: SVIS.warm, w: 2, dash: '7 5' }),
    svgLine(...map(xi - 0.55, f(xi) - slope * 0.55), ...map(xi + 0.55, f(xi) + slope * 0.55), { stroke: SVIS.gold, w: 2.2 }),
    svgLine(...map(a, 0), ...map(a, f(a)), { stroke: SVIS.pale, w: 1, dash: '3 4' }),
    svgLine(...map(b, 0), ...map(b, f(b)), { stroke: SVIS.pale, w: 1, dash: '3 4' }),
    svgDot(...map(a, f(a))), svgDot(...map(b, f(b))), svgDot(...map(xi, f(xi)), { fill: SVIS.gold }),
    svgText(map(a, 0)[0], map(a, 0)[1] + 20, 'a', { math: true, size: 13 }),
    svgText(map(b, 0)[0], map(b, 0)[1] + 20, 'b', { math: true, size: 13 }),
    svgText(map(xi, 0)[0], map(xi, 0)[1] + 20, 'ξ', { math: true, size: 13, fill: SVIS.gold }),
    svgText(map(1.62, 5.4)[0], map(1.62, 5.4)[1], '切线斜率 = 割线斜率', { size: 12, fill: SVIS.gold, anchor: 'start' })
  ].join('');
  visual('mean-value', {
    title: '割线与某条切线平行：拉格朗日中值定理',
    kind: '定理示意',
    figure: svgSvg(uid, 640, 316, '区间两端连成割线，内部存在一点的切线与之平行', body),
    caption: '连续且可导的曲线上，区间两端的割线斜率是平均变化率。拉格朗日中值定理保证：内部至少有一点的瞬时变化率等于这个平均值。',
    read: [
      '橙色虚线是割线，斜率 [f(b) − f(a)]/(b − a) 就是这段区间的平均变化率。',
      '金色实线在 ξ 处与割线平行，说明 f′(ξ) 等于平均变化率。',
      '它把“整体平均”和“某点瞬时”接了起来，因此常用来证明不等式、估计增量：f(b) − f(a) = f′(ξ)(b − a)。'
    ]
  });
})();

(function squeezeVisual() {
  const uid = 'vis-squeeze', box = { x0: 96, x1: 560, y0: 44, y1: 274 }, xd = [0, 0.32], yd = [-0.115, 0.115];
  const map = svgMap(box, xd, yd), osc = x => x * x * Math.sin(1 / x);
  const body = [
    svgLine(...map(0, 0), ...map(0.62, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgPlot(x => x * x, 0, 0.31, 60, map, { stroke: SVIS.warm, w: 1.6, dash: '6 4' }),
    svgPlot(x => -x * x, 0, 0.31, 60, map, { stroke: SVIS.warm, w: 1.6, dash: '6 4' }),
    svgPlot(osc, 0.002, 0.31, 1600, map, { stroke: SVIS.green, w: 1.6 }),
    svgText(map(0.27, 0.074)[0] + 8, map(0.27, 0.074)[1] - 4, 'y = x²', { math: true, size: 12, fill: SVIS.warm, anchor: 'start' }),
    svgText(map(0.27, -0.074)[0] + 8, map(0.27, -0.074)[1] + 14, 'y = −x²', { math: true, size: 12, fill: SVIS.warm, anchor: 'start' }),
    svgText(map(0.16, 0.045)[0], map(0.16, 0.045)[1], 'y = x² sin(1/x)', { math: true, size: 12, fill: SVIS.green }),
    svgText(map(0.1, -0.08)[0], map(0.1, -0.08)[1], '越靠 0 振荡越密', { size: 11, fill: SVIS.muted, anchor: 'start' }),
    svgDot(map(0, 0)[0], map(0, 0)[1], { r: 4, fill: SVIS.paper, stroke: SVIS.muted })
  ].join('');
  visual('squeeze', {
    title: '夹在两条曲线之间：夹逼定理',
    kind: '函数示意',
    figure: svgSvg(uid, 640, 320, '振荡函数被两条抛物线夹住，两条包络都趋于零', body),
    caption: 'y = x² sin(1/x) 在 0 附近疯狂振荡，没有单独的极限可看；但它始终被 y = x² 与 y = −x² 夹住，而这两条包络都趋于 0，所以它也只能趋于 0。',
    read: [
      '绿色曲线就是振荡的函数，越靠近 0 振荡越密集。',
      '两条橙色虚线是它的“天花板”和“地板”，曲线始终越不出去。',
      '夹逼的用法是：先找两个好算的上下界，再证上下界趋于同一个数。乘无穷小的有界量（如 sin 有界）也走这个思路。'
    ]
  });
})();

(function taylorVisual() {
  const uid = 'vis-taylor', box = { x0: 104, x1: 596, y0: 44, y1: 268 }, xd = [-3.3, 3.3], yd = [-3.7, 3.7];
  const map = svgMap(box, xd, yd);
  const t1 = x => x, t3 = x => x - x ** 3 / 6, t5 = x => x - x ** 3 / 6 + x ** 5 / 120;
  const legend = (y, color, dash, label) => [
    svgLine(120, y, 148, y, { stroke: color, w: 2.6, dash }),
    svgText(156, y + 4, label, { math: true, size: 12, fill: color, anchor: 'start' })
  ].join('');
  const body = [
    svgLine(...map(0, -3.5), ...map(0, 3.5), { stroke: SVIS.soft, w: 1.2 }),
    svgLine(...map(-3.3, 0), ...map(3.3, 0), { stroke: SVIS.soft, w: 1.2 }),
    svgPlot(t1, -3.2, 3.2, 20, map, { stroke: SVIS.muted, w: 1.8, dash: '6 4' }),
    svgPlot(t3, -3.15, 3.15, 60, map, { stroke: SVIS.warm, w: 1.8, dash: '6 4' }),
    svgPlot(t5, -3.2, 3.2, 80, map, { stroke: SVIS.gold, w: 2.2 }),
    svgPlot(Math.sin, -3.3, 3.3, 220, map, { stroke: SVIS.green, w: 2.6 }),
    svgText(map(3.3, 0)[0] + 10, map(3.3, 0)[1] + 20, 'x', { math: true, italic: true, size: 13, fill: SVIS.muted }),
    legend(64, SVIS.green, null, 'sin x'),
    legend(88, SVIS.muted, '5 4', 'T₁ = x'),
    legend(112, SVIS.warm, '5 4', 'T₃ = x − x³/6'),
    legend(136, SVIS.gold, null, 'T₅ 再加 x⁵/120')
  ].join('');
  visual('taylor', {
    title: '用多项式一段段贴合曲线',
    kind: '近似示意',
    figure: svgSvg(uid, 640, 320, '正弦曲线与一次、三次、五次泰勒多项式的贴合程度', body),
    caption: '泰勒展开在原点的邻域里用多项式模仿函数：多看一阶导数就多贴一段。次数越高，贴合的范围越大，但离展开点越远误差通常越大。',
    read: [
      '绿色曲线是 sin x；灰、橙、金三条折线分别是 1 次、3 次、5 次多项式。',
      '展开点（原点）附近几条线几乎重合，说明低阶近似在很小范围内就够用。',
      '越往两端，多项式迅速偏离——所以泰勒公式必须写清“在哪个点展开、用在什么范围”，并保留余项估计误差。'
    ]
  });
})();

(function concavityVisual() {
  const uid = 'vis-concave', box = { x0: 90, x1: 570, y0: 48, y1: 268 }, xd = [-2.1, 2.1], yd = [-1.9, 1.9];
  const map = svgMap(box, xd, yd), f = x => x ** 3 / 3 - x;
  const body = [
    svgLine(...map(-2.1, 0), ...map(2.1, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...map(0, -1.9), ...map(0, 1.9), { stroke: SVIS.soft, w: 1.2 }),
    svgPlot(f, -2.05, 2.05, 120, map),
    svgLine(...map(-0.9, 0.9), ...map(0.9, -0.9), { stroke: SVIS.gold, w: 1.8, dash: '6 5' }),
    svgDot(...map(0, 0), { fill: SVIS.gold }),
    svgText(map(-0.35, 1.35)[0], map(-0.35, 1.35)[1], '凸：f″ < 0', { size: 12, fill: SVIS.muted }),
    svgText(map(1.2, -1.1)[0], map(1.2, -1.1)[1], '凹：f″ > 0', { size: 12, fill: SVIS.muted }),
    svgText(map(0, 0)[0] + 8, map(0, 0)[1] + 18, '拐点', { size: 12, fill: SVIS.gold, anchor: 'start' })
  ].join('');
  visual('concavity', {
    title: '凹凸看弯曲方向，拐点是分界',
    kind: '形态示意',
    figure: svgSvg(uid, 640, 316, '曲线在拐点两侧弯曲方向相反，拐点处二阶导数为零', body),
    caption: '二阶导数描述斜率本身在增大还是减小：f″ > 0 时曲线向上弯（凹），f″ < 0 时向下弯（凸）。弯曲方向改变的位置是拐点。',
    read: [
      '左侧向下弯、右侧向上弯，箭头方向就是“切线斜率在变小还是变大”。',
      '金色点是拐点，此例 f″ 在这一点由负变正；拐点处二阶导数为零，但二阶导数为零不一定是拐点。',
      '判别极值用一阶导数，判别凹凸用二阶导数，两件事不要混。'
    ]
  });
})();

(function sequenceVisual() {
  const uid = 'vis-seq', box = { x0: 90, x1: 590, y0: 60, y1: 230 }, xd = [0.62, 1.66], yd = [0, 1];
  const map = svgMap(box, xd, yd), lineY = map(0, 0.5)[1];
  const X = v => map(v, 0.5)[0];
  let ticks = '', dots = '';
  for (let i = 7; i <= 16; i++) {
    const v = i / 10;
    ticks += svgLine(X(v), lineY - 5, X(v), lineY + 5, { stroke: SVIS.soft, w: 1.2 });
    ticks += svgText(X(v), lineY + 24, v.toFixed(1), { size: 11.5, fill: SVIS.muted, math: true });
  }
  for (let n = 2; n <= 16; n++) {
    const v = 1 + (-1) ** n / n, inside = v > 0.9 && v < 1.1;
    dots += svgLine(X(v), lineY, X(v), lineY - 30 - n * 4, { stroke: SVIS.pale, w: 1 });
    dots += svgDot(X(v), lineY - 30 - n * 4, { r: 3.4, fill: inside ? SVIS.green : SVIS.warm });
    if (n <= 3) dots += svgText(X(v), lineY - 40 - n * 4, `a${['₂','₃'][n - 2]}`, { math: true, size: 11, fill: SVIS.muted });
  }
  const body = [
    svgLine(X(0.62), lineY, X(1.66), lineY, { stroke: SVIS.mid, w: 1.4, marker: `${uid}-a` }),
    svgBox(X(0.9), lineY - 104, X(1.1) - X(0.9), 112, { fill: SVIS.accent, stroke: 'none', opacity: 0.55, rx: 0 }),
    svgLine(X(0.9), lineY - 104, X(0.9), lineY + 6, { stroke: SVIS.pale, w: 1.2, dash: '4 4' }),
    svgLine(X(1.1), lineY - 104, X(1.1), lineY + 6, { stroke: SVIS.pale, w: 1.2, dash: '4 4' }),
    ticks, dots,
    svgLine(X(1), lineY - 120, X(1), lineY + 12, { stroke: SVIS.warm, w: 1.5, dash: '4 4' }),
    svgText(X(1), lineY - 128, 'L = 1', { math: true, size: 12, fill: SVIS.warm }),
    svgText(X(1), lineY + 46, 'ε 邻域（允许误差）', { size: 11.5, fill: SVIS.muted }),
    svgText(X(1.62), lineY - 110, 'n 越大，点越挤向 1', { size: 11.5, fill: SVIS.green, anchor: 'end' })
  ].join('');
  visual('sequence', {
    title: '数轴上的点越挤越近：数列收敛',
    kind: '数轴示意',
    figure: svgSvg(uid, 640, 280, '数列的点随着 n 增大逐渐集中到极限值附近', body),
    caption: '把每一项画成数轴上的点。收敛的意思是：任给一个误差范围 ε，从某一项以后，所有点都落进这条带子里，不再跑出去。',
    read: [
      '橙色竖线是极限 L，浅色带子是允许的误差范围（ε 邻域）。',
      '每根细线上的圆点对应一个 aₙ，位置随 n 变化。',
      '收敛要求“某一项之后全部落入”，而不是“有无穷多个点落入”；在带子外只允许有有限个点。'
    ]
  });
})();

(() => {
  visual('lhopital', {
    title: '哪些式子能用洛必达：先认未定式',
    kind: '规则对照',
    table: `<table class="visual-table"><caption>洛必达法则的适用与转换</caption><thead><tr><th>形式</th><th>能否直接用</th><th>先做的处理</th></tr></thead><tbody>
      <tr><th scope="row">0/0</th><td class="ok">可以</td><td>分子分母分别求导，再取极限</td></tr>
      <tr><th scope="row">∞/∞</th><td class="ok">可以</td><td>同上；也要检查求导后的极限是否存在</td></tr>
      <tr><th scope="row">0 · ∞</th><td class="no">不能</td><td>改写成分数：0 · ∞ = 0/(1/∞) 或 ∞/(1/0)</td></tr>
      <tr><th scope="row">∞ − ∞</th><td class="no">不能</td><td>通分、有理化或提出公因子，化成商</td></tr>
      <tr><th scope="row">1^∞、0^0、∞^0</th><td class="no">不能</td><td>取对数，把指数形式化成 0 · ∞，再化成商</td></tr>
      <tr><th scope="row">不是未定式</th><td class="no">不能用</td><td>直接代入或按四则运算求极限</td></tr>
    </tbody></table>`,
    read: [
      '先判断形式再动手：只有 0/0 与 ∞/∞ 是“直接可换”的两种。',
      '其余形式都要先变形，变形的目标始终是把式子写成商。',
      '洛必达是充分条件不是必要条件：求导后的极限不存在，并不等于原极限不存在，要换方法。'
    ]
  });
})();

/* ── 线代 ─────────────────────────────────────────────── */
(function determinantVisual() {
  const uid = 'vis-det', ox = 172, oy = 262, scale = 78, a = 2, b = 0.4, c = 0.6, d = 1.6;
  const P = (x, y) => [ox + x * scale, oy - y * scale];
  const O = P(0, 0), U = P(a, c), V = P(b, d), W = P(a + b, c + d);
  const body = [
    svgLine(...P(-0.4, 0), ...P(3.4, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...P(0, -0.4), ...P(0, 2.6), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgBox(ox, oy - scale, scale, scale, { fill: SVIS.accent, stroke: SVIS.mid, dash: '5 4' }),
    `<path d="M${O[0]},${O[1]} L${U[0]},${U[1]} L${W[0]},${W[1]} L${V[0]},${V[1]} Z" fill="${SVIS.pale}" fill-opacity=".55" stroke="${SVIS.green}" stroke-width="2"/>`,
    svgLine(...O, ...U, { stroke: SVIS.deep, w: 2.2, marker: `${uid}-a` }),
    svgLine(...O, ...V, { stroke: SVIS.deep, w: 2.2, marker: `${uid}-a` }),
    svgText(ox - 14, oy + 42, '虚线方块：原来的单位正方形', { size: 11, fill: SVIS.muted, anchor: 'start' }),
    svgText(452, 116, 'det A = ad − bc', { math: true, size: 15, fill: SVIS.green, anchor: 'start' }),
    svgText(452, 146, '= 2 × 1.6 − 0.4 × 0.6', { math: true, size: 12, fill: SVIS.ink, anchor: 'start' }),
    svgText(452, 176, '= 2.96', { math: true, size: 13, fill: SVIS.ink, anchor: 'start' }),
    svgText(452, 204, '= 平行四边形的面积', { size: 12, fill: SVIS.muted, anchor: 'start' }),
    svgText(452, 232, '第 1 列 (a, c)，第 2 列 (b, d)', { size: 11.5, fill: SVIS.deep, anchor: 'start' }),
    svgText(452, 258, '行列式为 0 时压成一条线段，', { size: 11, fill: SVIS.muted, anchor: 'start' }),
    svgText(452, 274, '面积变成 0，矩阵不可逆', { size: 11, fill: SVIS.muted, anchor: 'start' })
  ].join('');
  visual('determinant', {
    title: '行列式就是面积被放大（或压扁）的倍数',
    kind: '几何示意',
    figure: svgSvg(uid, 640, 316, '单位正方形经矩阵变换成平行四边形，其面积等于行列式的绝对值', body),
    caption: '二阶矩阵的两列可以看成两个箭头。把单位正方形按这两列拉成平行四边形，它的面积就是 |ad − bc|；符号表示是否翻转了方向。',
    read: [
      '虚线小方块是原来的单位正方形，面积 1。',
      '绿色平行四边形是变换后的图形，它的两条边就是矩阵的两列。',
      '面积为 0（两条边共线）时矩阵不可逆，对应“空间被压扁”，行列式就是 0。'
    ]
  });
})();

(function matrixTransformVisual() {
  const uid = 'vis-matrix', scale = 40, A = [[1.5, 0.8], [0.25, 1.35]];
  const boxA = { ox: 140, oy: 242 }, boxB = { ox: 432, oy: 242 };
  const PA = (x, y) => [boxA.ox + x * scale, boxA.oy - y * scale];
  const PB = (x, y) => [boxB.ox + x * scale, boxB.oy - y * scale];
  const apply = (x, y) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
  let gridA = '', gridB = '';
  for (let i = -1; i <= 2; i++) {
    gridA += svgLine(...PA(i, -1), ...PA(i, 2), { stroke: SVIS.grid, w: 1 });
    gridA += svgLine(...PA(-1, i), ...PA(2, i), { stroke: SVIS.grid, w: 1 });
    gridB += svgLine(...PB(...apply(i, -1)), ...PB(...apply(i, 2)), { stroke: SVIS.grid, w: 1 });
    gridB += svgLine(...PB(...apply(-1, i)), ...PB(...apply(2, i)), { stroke: SVIS.grid, w: 1 });
  }
  const body = [
    gridA, gridB,
    svgLine(...PA(-1, 0), ...PA(2, 0), { stroke: SVIS.soft, w: 1.4 }), svgLine(...PA(0, -1), ...PA(0, 2), { stroke: SVIS.soft, w: 1.4 }),
    svgLine(...PB(...apply(-1, 0)), ...PB(...apply(2, 0)), { stroke: SVIS.grid, w: 1 }), svgLine(...PB(...apply(0, -1)), ...PB(...apply(0, 2)), { stroke: SVIS.grid, w: 1 }),
    svgLine(...PA(0, 0), ...PA(...apply(1, 0)), { stroke: SVIS.gold, w: 2.4, marker: `${uid}-g` }),
    svgLine(...PA(0, 0), ...PA(0, 1), { stroke: SVIS.soft, w: 2.4, marker: `${uid}-a` }),
    svgLine(...PB(0, 0), ...PB(...apply(1, 0)), { stroke: SVIS.gold, w: 2.4, marker: `${uid}-g` }),
    svgLine(...PB(0, 0), ...PB(...apply(0, 1)), { stroke: SVIS.deep, w: 2.4, marker: `${uid}-a` }),
    svgText(PA(1, 0)[0], PA(1, 0)[1] + 20, 'e₁', { math: true, size: 12, fill: SVIS.gold }),
    svgText(PA(0, 1)[0] - 14, PA(0, 1)[1], 'e₂', { math: true, size: 12, fill: SVIS.mid }),
    svgText(PB(...apply(1, 0))[0] + 16, PB(...apply(1, 0))[1] + 16, 'Ae₁', { math: true, size: 12, fill: SVIS.gold, anchor: 'start' }),
    svgText(PB(...apply(0, 1))[0] + 8, PB(...apply(0, 1))[1] - 10, 'Ae₂', { math: true, size: 12, fill: SVIS.deep, anchor: 'start' }),
    svgText(140, 284, '原来：正交的网格', { size: 12, fill: SVIS.muted }),
    svgText(432, 284, '变换后：被拉斜的网格', { size: 12, fill: SVIS.muted }),
    svgLine(268, 150, 312, 150, { stroke: SVIS.mid, w: 1.6, marker: `${uid}-a` }),
    svgText(290, 136, '乘 A', { size: 12, fill: SVIS.mid }),
    svgText(432, 40, 'A = [[1.5, 0.8], [0.25, 1.35]]', { math: true, size: 12, fill: SVIS.muted })
  ].join('');
  visual('matrix', {
    title: '矩阵把网格拉成另一张网格',
    kind: '变换示意',
    figure: svgSvg(uid, 640, 316, '单位网格经矩阵乘法后变成倾斜的网格，两条基向量随之改变', body),
    caption: '把矩阵看成“动作”：它把每个点按固定规则搬到新位置。原先横平竖直的网格，会被拉斜、拉长或压扁；两条基向量变换后的位置就是矩阵的两列。',
    read: [
      '左图是最容易读的参照：横竖两组网格线，两条基向量互相垂直。',
      '右图是同一个网格经过 A 之后的样子。注意原来两条互相垂直的线不再垂直，网格也被拉斜了。',
      '矩阵乘法不可交换，就是因为“先做哪个动作”会得到不同结果：AB 与 BA 的顺序不同。'
    ]
  });
})();

(function eigenVisual() {
  const uid = 'vis-eigen', ox = 200, oy = 258, scale = 86, v = [1, 1], w = [1, 0], Av = [2.2, 2.2], Aw = [1.6, 0.6];
  const P = (p) => [ox + p[0] * scale, oy - p[1] * scale];
  const body = [
    svgLine(60, oy, 470, oy, { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(ox, 300, ox, 66, { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...P([-0.6, -0.6]), ...P([2.9, 2.9]), { stroke: SVIS.pale, w: 1.4, dash: '6 5' }),
    svgLine(ox, oy, ...P(Av), { stroke: SVIS.gold, w: 2.4, marker: `${uid}-g` }),
    svgLine(ox, oy, ...P(v), { stroke: SVIS.gold, w: 2.4, opacity: 0.55, dash: '4 3' }),
    svgLine(ox, oy, ...P(Aw), { stroke: SVIS.deep, w: 2.2, marker: `${uid}-a` }),
    svgLine(ox, oy, ...P(w), { stroke: SVIS.soft, w: 2.2, dash: '4 3' }),
    svgDot(...P(v), { fill: SVIS.gold, r: 3 }), svgDot(...P(Av), { fill: SVIS.gold }),
    svgDot(...P(w), { fill: SVIS.mid, r: 3 }), svgDot(...P(Aw), { fill: SVIS.deep }),
    svgText(P(v)[0] + 4, P(v)[1] + 20, 'v', { math: true, italic: true, size: 13, fill: SVIS.gold }),
    svgText(P(Av)[0] + 10, P(Av)[1] - 8, 'Av = 2.2 v', { math: true, size: 12, fill: SVIS.gold, anchor: 'start' }),
    svgText(P(w)[0] + 2, P(w)[1] + 20, 'w', { math: true, italic: true, size: 13, fill: SVIS.muted }),
    svgText(P(Aw)[0] + 10, P(Aw)[1] - 8, 'Aw 转了方向', { size: 11, fill: SVIS.deep, anchor: 'start' }),
    svgText(P([1.9, 1.9])[0] + 26, P([1.9, 1.9])[1] - 12, '特征方向：直线不变', { size: 11, fill: SVIS.muted, anchor: 'start' })
  ].join('');
  visual('eigen', {
    title: '特征向量：变换后仍留在同一条直线上',
    kind: '方向示意',
    figure: svgSvg(uid, 640, 316, '特征向量经矩阵变换后方向不变，只改变长度；普通向量会转出原来的直线', body),
    caption: '大多数向量被矩阵一转就换了方向；少数特殊方向只会被拉长、缩短或反向。这些方向就是特征向量，伸缩的倍数就是特征值。',
    read: [
      '金色实线与金色虚线重合在一条直线上：Av 与 v 同向，只是更长，所以 λ > 0。',
      '深绿色的 Aw 明显偏离了 w 所在的直线——它不是特征向量。',
      '负特征值意味着反向，λ = 0 意味着这个方向被压到原点（矩阵不可逆）。零向量总是满足 Av = λv，因此定义中特意排除 v = 0。'
    ]
  });
})();

(function projectionVisual() {
  const uid = 'vis-proj', ox = 130, oy = 272, scale = 68;
  const b = [3.6, 1.0], a = [1.5, 2.6];
  const k = (a[0] * b[0] + a[1] * b[1]) / (b[0] * b[0] + b[1] * b[1]), proj = [b[0] * k, b[1] * k];
  const perp = [a[0] - proj[0], a[1] - proj[1]];
  const P = p => [ox + p[0] * scale, oy - p[1] * scale];
  const body = [
    svgLine(...P([-0.2, 0]), ...P([4.4, 0]), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(ox, oy, ...P(b), { stroke: SVIS.deep, w: 2.4, marker: `${uid}-a` }),
    svgLine(ox, oy, ...P(a), { stroke: SVIS.green, w: 2.2, marker: `${uid}-a` }),
    svgLine(...P(a), ...P(proj), { stroke: SVIS.warm, w: 1.6, dash: '5 4' }),
    svgLine(ox, oy, ...P(proj), { stroke: SVIS.gold, w: 5, opacity: 0.65 }),
    svgBox(P(proj)[0] - 10, P(proj)[1] - 10, 10, 10, { fill: 'none', stroke: SVIS.warm, w: 1.2, rx: 0 }),
    svgText(P(b)[0] + 6, P(b)[1] + 18, 'b', { math: true, italic: true, size: 14, fill: SVIS.deep, anchor: 'start' }),
    svgText(P(a)[0] - 6, P(a)[1] - 8, 'a', { math: true, italic: true, size: 14, fill: SVIS.green, anchor: 'end' }),
    svgText(P(proj)[0] + 8, P(proj)[1] + 22, '投影 proj_b a', { size: 12, fill: SVIS.gold, anchor: 'start' }),
    svgText((P(a)[0] + P(proj)[0]) / 2 + 10, (P(a)[1] + P(proj)[1]) / 2, '垂直分量', { size: 11, fill: SVIS.warm, anchor: 'start' }),
    svgText(400, 120, 'proj_b a = (a·b / b·b) b', { math: true, size: 13, fill: SVIS.green, anchor: 'start' }),
    svgText(400, 150, 'a = 投影 + 垂直分量', { size: 12, fill: SVIS.muted, anchor: 'start' })
  ].join('');
  visual('projection', {
    title: '一束影子：向量投影把 a 拆成两段',
    kind: '分解示意',
    figure: svgSvg(uid, 640, 316, '向量 a 沿 b 方向的投影与垂直分量构成直角三角形', body),
    caption: '把 a 沿 b 的方向“打一束光”，投在 b 所在直线上的影子就是投影。它与 a 剩下的垂直分量相加，正好回到 a。',
    read: [
      '金色粗线是投影，长度由 a 与 b 的夹角余弦决定：a·b = ‖a‖‖b‖cos θ。',
      '橙色虚线是垂直分量，它与 b 的方向垂直（图中小方角）。',
      'b 必须是非零向量；投影是一个向量，而 a·b / ‖b‖ 是一个数，两者不要混。'
    ]
  });
})();

(function positiveDefiniteVisual() {
  const uid = 'vis-pd', w = 640, h = 300;
  const panel = (cx, cy, title, draw) => [
    svgLine(cx - 78, cy, cx + 78, cy, { stroke: SVIS.soft, w: 1.1 }),
    svgLine(cx, cy - 78, cx, cy + 78, { stroke: SVIS.soft, w: 1.1 }),
    draw(cx, cy),
    svgText(cx, cy + 106, title, { size: 12, fill: SVIS.muted })
  ].join('');
  const ellipse = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="58" ry="36" fill="none" stroke="${SVIS.green}" stroke-width="2"/>` + svgDot(cx, cy, { r: 3 });
  const hyperbola = (cx, cy) => svgPath(`M${cx - 56},${cy - 62} Q${cx - 20},${cy} ${cx - 56},${cy + 62}`, { stroke: SVIS.warm, w: 2 }) + svgPath(`M${cx + 56},${cy - 62} Q${cx + 20},${cy} ${cx + 56},${cy + 62}`, { stroke: SVIS.warm, w: 2 }) + svgDot(cx, cy, { r: 3, fill: SVIS.warm });
  const degenerate = (cx, cy) => svgLine(cx - 56, cy - 42, cx + 56, cy - 42, { stroke: SVIS.mid, w: 2 }) + svgLine(cx - 56, cy + 42, cx + 56, cy + 42, { stroke: SVIS.mid, w: 2 }) + svgLine(cx - 60, cy, cx + 60, cy, { stroke: SVIS.pale, w: 1, dash: '3 4' });
  const body = [panel(120, 140, '正定：闭合椭圆', ellipse), panel(320, 140, '不定：双曲线', hyperbola), panel(520, 140, '半正定：退化成平行线', degenerate)].join('') +
    svgText(120, 52, '各方向 q > 0', { size: 11, fill: SVIS.green }) + svgText(320, 52, '有正有负', { size: 11, fill: SVIS.warm }) + svgText(520, 52, '某个方向为 0', { size: 11, fill: SVIS.mid });
  visual('positive-definite', {
    title: '二次型的等值线：椭圆、双曲线还是平行线',
    kind: '分类示意',
    figure: svgSvg(uid, 640, 280, '正定二次型的等值线是椭圆，不定型是双曲线，半正定退化为平行线', body),
    caption: '二次型 q(x) = xᵀAx 的正负，决定了等值线 q = 常数的形状。看形状就能判断正定、不定还是半正定。',
    read: [
      '椭圆围住原点：任何非零方向都使 q > 0，这就是正定。',
      '双曲线：有的方向 q > 0，有的方向 q < 0，函数值有正有负，所以不定。',
      '两条平行线：某个非零方向上 q = 0，矩阵不满秩，属于半正定；判定时顺序主子式要“各阶都大于零”才是正定。'
    ]
  });
})();

(() => {
  visual('rank', {
    title: '秩决定方程组有多少解',
    kind: '判据对照',
    table: `<table class="visual-table"><caption>r(A) 与 r([A|b]) 的比较</caption><thead><tr><th>比较结果</th><th>解的情况</th><th>几何理解</th></tr></thead><tbody>
      <tr><th scope="row">r(A) &lt; r([A|b])</th><td class="no">无解</td><td>约束互相矛盾，没有公共交点</td></tr>
      <tr><th scope="row">r(A) = r([A|b]) = n</th><td class="ok">唯一解</td><td>n 个未知数被 n 个独立约束定死</td></tr>
      <tr><th scope="row">r(A) = r([A|b]) &lt; n</th><td class="warn">无穷多解</td><td>有 n − r(A) 个自由变量，解空间是一条线或一个面</td></tr>
    </tbody></table>`,
    read: [
      '先分别算出系数矩阵与增广矩阵的秩，再比较，不要只看系数矩阵。',
      '“有解”只看两个秩是否相等；“解是否唯一”再看它是否等于未知数个数 n。',
      '齐次方程组右边全为 0，永远有零解；它有非零解当且仅当 r(A) &lt; n。'
    ]
  });
  visual('elimination', {
    title: '三种行变换，解集不变',
    kind: '操作对照',
    table: `<table class="visual-table"><caption>初等行变换对解的影响</caption><thead><tr><th>操作</th><th>对方程组</th><th>对行列式</th></tr></thead><tbody>
      <tr><th scope="row">交换两行</th><td>解的集合不变</td><td>变号，D′ = −D</td></tr>
      <tr><th scope="row">某行乘非零常数 k</th><td>解的集合不变</td><td>乘以 k，D′ = kD</td></tr>
      <tr><th scope="row">某行加上另一行的 k 倍</th><td>解的集合不变</td><td>不变，D′ = D</td></tr>
    </tbody></table>`,
    read: [
      '高斯消元只允许这三类操作，因为它们都不改变方程组的解。',
      '把矩阵化成阶梯形后，主元个数就是秩，回代即可求解。',
      '行列式只对“交换”和“倍乘”敏感；而整个 n 阶矩阵乘以 k，行列式要乘 kⁿ 而不是 k。'
    ]
  });
  visual('surface', {
    title: '二次曲面：从方程认出形状',
    kind: '分类对照',
    table: `<table class="visual-table"><caption>常见二次曲面的标准方程</caption><thead><tr><th>名称</th><th>标准方程</th><th>怎样认</th></tr></thead><tbody>
      <tr><th scope="row">椭球面</th><td>x²/a² + y²/b² + z²/c² = 1</td><td>三项全加、右边为 1</td></tr>
      <tr><th scope="row">单叶双曲面</th><td>x²/a² + y²/b² − z²/c² = 1</td><td>一项为负；水平截痕是椭圆</td></tr>
      <tr><th scope="row">双叶双曲面</th><td>x²/a² − y²/b² − z²/c² = 1</td><td>两项为负；只有一个方向能取到</td></tr>
      <tr><th scope="row">椭圆抛物面</th><td>z = x²/a² + y²/b²</td><td>一次项单独在一边，截面开口向上或向下</td></tr>
      <tr><th scope="row">双曲抛物面（马鞍面）</th><td>z = x²/a² − y²/b²</td><td>两项一正一负，一个方向弯上、一个方向弯下</td></tr>
      <tr><th scope="row">圆锥面</th><td>x²/a² + y²/b² − z²/c² = 0</td><td>右边为 0，且有一项为负</td></tr>
    </tbody></table>`,
    read: [
      '先数清平方项的正负号，再决定用哪一行对照。',
      '最稳的办法是截痕法：用平行于坐标面的平面去截，看截出来的是椭圆、双曲线还是抛物线。',
      '标准方程里分母为正；把方程整理成这种形式再判断，不要直接看原始系数。'
    ]
  });
})();
