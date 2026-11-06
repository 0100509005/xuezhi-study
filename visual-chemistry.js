/* 化学图解：把“看不见的微观结构”和“曲线趋势”画出来。 */
(function quantumNumbersTable() {
  visual('quantum-numbers', {
    title: '四个量子数各管什么',
    kind: '取值对照',
    table: `<table class="visual-table"><caption>n、l、mₗ、mₛ 的取值与能容纳的电子数</caption><thead><tr><th>主量子数 n</th><th>亚层（l 的取值）</th><th>mₗ 的取值个数</th><th>轨道数</th><th>该层最多电子数 2n²</th></tr></thead><tbody>
      <tr><th scope="row">n = 1（K 层）</th><td>1s（l = 0）</td><td>1 个：0</td><td>1</td><td>2</td></tr>
      <tr><th scope="row">n = 2（L 层）</th><td>2s（l = 0）、2p（l = 1）</td><td>1 + 3 = 4 个</td><td>4</td><td>8</td></tr>
      <tr><th scope="row">n = 3（M 层）</th><td>3s、3p、3d（l = 0, 1, 2）</td><td>1 + 3 + 5 = 9 个</td><td>9</td><td>18</td></tr>
      <tr><th scope="row">n = 4（N 层）</th><td>4s、4p、4d、4f（l = 0…3）</td><td>1 + 3 + 5 + 7 = 16 个</td><td>16</td><td>32</td></tr>
    </tbody></table>`,
    read: [
      'n 决定第几层，也大致决定能量高低；l 决定亚层形状（s、p、d、f）。',
      'mₗ 的取值个数是 2l + 1，也就是该亚层的轨道数；每个轨道最多放 2 个自旋相反的电子。',
      'mₛ 只有 ±1/2 两个取值。四个量子数确定后，一个电子的状态就唯一确定了（泡利不相容）。'
    ]
  });
})();

(function radialDistributionVisual() {
  const uid = 'vis-radial', box = { x0: 80, x1: 580, y0: 54, y1: 262 }, xd = [0, 20], yd = [0, 1.18];
  const map = svgMap(box, xd, yd);
  const f1 = r => r * r * Math.exp(-2 * r);
  const f2 = r => r * r * (2 - r) ** 2 * Math.exp(-r);
  const f3 = r => r * r * (27 - 18 * r + 2 * r * r) ** 2 * Math.exp(-2 * r / 3);
  const norm = f => { let m = 0; for (let i = 1; i <= 500; i++) m = Math.max(m, f(20 * i / 500)); return x => f(x) / m; };
  const body = [
    svgLine(...map(0, 0), ...map(20, 0), { stroke: SVIS.soft, w: 1.3, marker: `${uid}-a` }),
    svgLine(...map(0, 0), ...map(0, 1.12), { stroke: SVIS.soft, w: 1.3, marker: `${uid}-a` }),
    svgPlot(norm(f1), 0.02, 12, 160, map, { stroke: SVIS.green, w: 2.4 }),
    svgPlot(norm(f2), 0.02, 19, 220, map, { stroke: SVIS.warm, w: 2.2 }),
    svgPlot(norm(f3), 0.02, 20, 300, map, { stroke: SVIS.gold, w: 2 }),
    svgLine(map(2, 0)[0], map(2, 0)[1], map(2, 0.32)[0], map(2, 0.32)[1], { stroke: SVIS.warm, w: 1, dash: '3 4' }),
    svgText(map(2.35, 0.42)[0], map(2.35, 0.42)[1], '2s 的节点（r = 2）', { size: 11.5, fill: SVIS.warm, anchor: 'start' }),
    svgText(map(1.15, 1.02)[0], map(1.15, 1.02)[1], '1s', { math: true, size: 12, fill: SVIS.green }),
    svgText(map(6.4, 0.98)[0], map(6.4, 0.98)[1], '2s', { math: true, size: 12, fill: SVIS.warm }),
    svgText(map(15.2, 0.88)[0], map(15.2, 0.88)[1], '3s', { math: true, size: 12, fill: SVIS.gold }),
    svgText(map(20, 0)[0] + 6, map(20, 0)[1] + 18, 'r', { math: true, italic: true, size: 13, fill: SVIS.muted }),
    svgText(map(0, 1.12)[0] + 10, map(0, 1.12)[1], '径向分布函数', { size: 11, fill: SVIS.muted, anchor: 'start' })
  ].join('');
  visual('radial-distribution', {
    title: '径向分布：电子最常出现的距离',
    kind: '曲线示意',
    figure: svgSvg(uid, 640, 300, '1s、2s、3s 的径向分布函数随距离变化，2s 在 r=2 处有一个节点', body),
    caption: '径向分布函数表示“以原子核为球心、半径 r 的薄球壳里找到电子的概率”。峰值位置就是最可能出现的距离；曲线落到零的地方是节点。',
    read: [
      '每条曲线的峰值对应电子出现概率最大的半径：1s 最靠近核，3s 主峰最远。',
      '2s 在 r = 2 处先降到零再起来，这个零点是节点（该处没有电子出现）。',
      '为便于看形状，图中三条曲线都缩放到相近高度；真实情况下 3s 的峰更矮更宽。'
    ]
  });
})();

(function sigmaPiVisual() {
  const uid = 'vis-sigma', panel = (cx, title, sub) => [
    svgText(cx, 44, title, { size: 12.5, fill: SVIS.ink, weight: '600' }),
    svgText(cx, 262, sub, { size: 11, fill: SVIS.muted })
  ].join('');
  const cy = 150;
  const body = [
    /* s-s σ */
    `<circle cx="118" cy="${cy}" r="27" fill="${SVIS.accent}" fill-opacity=".85" stroke="${SVIS.soft}" stroke-width="1.6"/>`,
    `<circle cx="184" cy="${cy}" r="27" fill="${SVIS.accent}" fill-opacity=".85" stroke="${SVIS.soft}" stroke-width="1.6"/>`,
    svgDot(118, cy, { r: 3, fill: SVIS.mid }), svgDot(184, cy, { r: 3, fill: SVIS.mid }),
    svgLine(118, cy, 184, cy, { stroke: SVIS.gold, w: 2.4, dash: '5 4' }),
    svgText(151, cy - 12, 'σ', { math: true, size: 15, fill: SVIS.gold }),
    panel(151, 's 与 s：头碰头', '绕键轴旋转，形状不变'),
    /* p-p σ */
    `<ellipse cx="300" cy="${cy}" rx="30" ry="17" fill="${SVIS.accent}" stroke="${SVIS.soft}" stroke-width="1.5"/>`,
    `<ellipse cx="362" cy="${cy}" rx="30" ry="17" fill="${SVIS.accent}" stroke="${SVIS.soft}" stroke-width="1.5"/>`,
    svgDot(300, cy, { r: 3, fill: SVIS.mid }), svgDot(362, cy, { r: 3, fill: SVIS.mid }),
    svgLine(300, cy, 362, cy, { stroke: SVIS.gold, w: 2.4, dash: '5 4' }),
    svgText(331, cy - 14, 'σ', { math: true, size: 15, fill: SVIS.gold }),
    panel(331, 'p 与 p：沿键轴重叠', '电子云集中在两核之间'),
    /* p-p π */
    `<ellipse cx="466" cy="${cy - 26}" rx="26" ry="16" fill="${SVIS.pale}" fill-opacity=".9" stroke="${SVIS.soft}" stroke-width="1.4"/>`,
    `<ellipse cx="514" cy="${cy - 26}" rx="26" ry="16" fill="${SVIS.pale}" fill-opacity=".9" stroke="${SVIS.soft}" stroke-width="1.4"/>`,
    `<ellipse cx="466" cy="${cy + 26}" rx="26" ry="16" fill="${SVIS.pale}" fill-opacity=".9" stroke="${SVIS.soft}" stroke-width="1.4"/>`,
    `<ellipse cx="514" cy="${cy + 26}" rx="26" ry="16" fill="${SVIS.pale}" fill-opacity=".9" stroke="${SVIS.soft}" stroke-width="1.4"/>`,
    svgDot(466, cy, { r: 3, fill: SVIS.mid }), svgDot(514, cy, { r: 3, fill: SVIS.mid }),
    svgLine(430, cy, 550, cy, { stroke: SVIS.gold, w: 2, dash: '5 4' }),
    svgText(490, cy - 52, 'π', { math: true, size: 15, fill: SVIS.gold }),
    panel(490, 'p 与 p：肩并肩重叠', '键轴处是节点，不能自由旋转')
  ].join('');
  visual('sigma-pi', {
    title: 'σ 键与 π 键：重叠方式不同',
    kind: '轨道示意',
    figure: svgSvg(uid, 640, 290, '三种重叠方式：s-s 头碰头、p-p 沿轴、p-p 侧向形成 π 键', body),
    caption: 'σ 键沿两核连线方向“头碰头”重叠，电子云在两核之间最密；π 键是两个 p 轨道“肩并肩”侧向重叠，电子云分布在键轴上下两侧。',
    read: [
      '左：两个球形 s 轨道重叠成 σ 键，绕键轴转任意角度形状都不变。',
      '中：两个 p 轨道沿轴端对端重叠，也是 σ 键；单键一律是 σ 键。',
      '右：侧向重叠成 π 键，键轴本身是节点；π 键不能绕键轴自由旋转，双键、三键因此有顺反异构。'
    ]
  });
})();

(function hybridVisual() {
  const uid = 'vis-hybrid', cy = 150;
  const lobe = (cx, angle, len, wid, fill) => `<ellipse cx="${cx}" cy="${cy - len / 2 - 10}" rx="${wid}" ry="${len / 2}" fill="${fill}" stroke="${SVIS.soft}" stroke-width="1.4" transform="rotate(${angle} ${cx} ${cy})"/>`;
  const center = cx => `<circle cx="${cx}" cy="${cy}" r="10" fill="${SVIS.ink}"/>`;
  const angles = { sp: [0, 180], sp2: [-90, 30, 150], sp3: [-90, 30, 150] };
  const rows = [
    { key: 'sp', cx: 120, title: 'sp 杂化', angle: '180°', shape: '直线形' },
    { key: 'sp2', cx: 320, title: 'sp² 杂化', angle: '120°', shape: '平面三角形' },
    { key: 'sp3', cx: 520, title: 'sp³ 杂化', angle: '109.5°', shape: '正四面体（投影）' }
  ];
  const body = rows.map(row => {
    const parts = angles[row.key].map((deg, i) => lobe(row.cx, deg, 54, 13, i % 2 ? SVIS.pale : SVIS.accent));
    const extra = row.key === 'sp3'
      ? `<ellipse cx="${row.cx + 4}" cy="${cy + 30}" rx="10" ry="18" fill="${SVIS.accent}" fill-opacity=".5" stroke="${SVIS.soft}" stroke-width="1.2" stroke-dasharray="4 3" transform="rotate(18 ${row.cx + 4} ${cy + 30})"/>` + svgText(row.cx - 52, cy + 82, '第 4 个伸向纸面外', { size: 11, fill: SVIS.soft, anchor: 'start' })
      : '';
    return [
      center(row.cx),
      ...parts,
      extra,
      svgText(row.cx, 44, row.title, { size: 12.5, fill: SVIS.ink, weight: '600' }),
      svgText(row.cx, 258, row.angle, { size: 12, fill: SVIS.warm }),
      svgText(row.cx, 276, row.shape, { size: 11, fill: SVIS.muted })
    ].join('');
  }).join('');
  visual('hybrid-orbital', {
    title: 'sp、sp²、sp³：杂化轨道的空间取向',
    kind: '构型示意',
    figure: svgSvg(uid, 640, 290, 'sp 直线、sp2 平面三角、sp3 四面体的轨道取向与键角', body),
    caption: '杂化把能量相近的原子轨道重新组合成一组等价的新轨道，让成键方向尽量分散、排斥最小。参与杂化的轨道数等于生成的杂化轨道数。',
    read: [
      'sp：两个轨道呈 180°，对应直线形，如 BeCl₂、乙炔的碳。',
      'sp²：三个轨道在同一平面内互成 120°，对应平面三角形，如 BF₃、乙烯的碳。',
      'sp³：四个轨道指向正四面体顶点，夹角 109.5°，如 CH₄、NH₃、H₂O 中的中心原子（后两者有孤对，键角略小）。'
    ]
  });
})();

(function electronDomainTable() {
  visual('electron-domain', {
    title: '先数电子域，再定分子构型',
    kind: '构型对照',
    table: `<table class="visual-table"><caption>电子域数、孤对数与分子构型（VSEPR）</caption><thead><tr><th>电子域数</th><th>孤对电子数</th><th>电子域构型</th><th>分子构型</th><th>理想键角</th><th>例子</th></tr></thead><tbody>
      <tr><th scope="row">2</th><td>0</td><td>直线</td><td>直线</td><td>180°</td><td>BeCl₂、CO₂</td></tr>
      <tr><th scope="row">3</th><td>0</td><td>平面三角</td><td>平面三角</td><td>120°</td><td>BF₃</td></tr>
      <tr><th scope="row">3</th><td>1</td><td>平面三角</td><td>V 形（角形）</td><td>&lt; 120°</td><td>SO₂</td></tr>
      <tr><th scope="row">4</th><td>0</td><td>四面体</td><td>正四面体</td><td>109.5°</td><td>CH₄</td></tr>
      <tr><th scope="row">4</th><td>1</td><td>四面体</td><td>三角锥</td><td>&lt; 109.5°</td><td>NH₃（107°）</td></tr>
      <tr><th scope="row">4</th><td>2</td><td>四面体</td><td>V 形</td><td>&lt; 109.5°</td><td>H₂O（104.5°）</td></tr>
      <tr><th scope="row">5</th><td>0</td><td>三角双锥</td><td>三角双锥</td><td>90°、120°</td><td>PCl₅</td></tr>
      <tr><th scope="row">6</th><td>0</td><td>八面体</td><td>八面体</td><td>90°</td><td>SF₆</td></tr>
    </tbody></table>`,
    read: [
      '电子域包括成键电子对和孤对电子，双键、三键都只算一个电子域。',
      '先由电子域数定“电子域构型”，再把孤对去掉，才得到“分子构型”。',
      '孤对电子占的位置排斥更大，会把成键角压小：NH₃ 与 H₂O 的键角都小于 109.5°。'
    ]
  });
})();

(function phaseDiagramVisual() {
  const uid = 'vis-phase', box = { x0: 96, x1: 566, y0: 48, y1: 266 }, xd = [-20, 160], yd = [0, 2.2];
  const map = svgMap(box, xd, yd);
  const tp = map(0, 0.16), cp = map(140, 1.7);
  const meltTop = map(-13, 2.1);
  const body = [
    svgLine(...map(-20, 0), ...map(160, 0), { stroke: SVIS.soft, w: 1.3, marker: `${uid}-a` }),
    svgLine(...map(-20, 0), ...map(-20, 2.15), { stroke: SVIS.soft, w: 1.3, marker: `${uid}-a` }),
    svgPath(`M${map(-20, 0.02)[0]},${map(-20, 0.02)[1]} L${tp[0]},${tp[1]}`, { stroke: SVIS.blue, w: 2 }),
    svgPath(`M${tp[0]},${tp[1]} Q${map(60, 0.85)[0]},${map(60, 0.85)[1]} ${cp[0]},${cp[1]}`, { stroke: SVIS.green, w: 2.2 }),
    svgPath(`M${tp[0]},${tp[1]} L${meltTop[0]},${meltTop[1]}`, { stroke: SVIS.warm, w: 2.2 }),
    svgDot(...tp, { r: 4.2, fill: SVIS.ink }),
    svgDot(...cp, { r: 4.2, fill: SVIS.green, stroke: 'none' }),
    svgText(tp[0] + 10, tp[1] - 10, '三相点', { size: 11, fill: SVIS.ink, anchor: 'start' }),
    svgText(cp[0] - 8, cp[1] - 10, '临界点', { size: 11, fill: SVIS.green, anchor: 'end' }),
    svgText(map(-15, 0.62)[0], map(-15, 0.62)[1], '固', { size: 16, fill: SVIS.muted }),
    svgText(map(40, 1.02)[0], map(40, 1.02)[1], '液', { size: 16, fill: SVIS.muted }),
    svgText(map(96, 0.42)[0], map(96, 0.42)[1], '气', { size: 16, fill: SVIS.muted }),
    svgText(map(160, 0)[0], map(160, 0)[1] + 20, 'T / ℃', { size: 11.5, fill: SVIS.muted }),
    svgText(map(-20, 2.15)[0] - 30, map(-20, 2.15)[1], 'p', { math: true, italic: true, size: 13, fill: SVIS.muted }),
    svgText(map(-12, 0.24)[0], map(-12, 0.24)[1] - 8, '升华', { size: 11.5, fill: SVIS.blue, anchor: 'start' }),
    svgText(map(102, 1.52)[0], map(102, 1.52)[1], '汽化', { size: 11.5, fill: SVIS.green, anchor: 'start' }),
    svgText(map(-5.5, 2.0)[0], map(-5.5, 2.0)[1], '熔化', { size: 11.5, fill: SVIS.warm, anchor: 'start' })
  ].join('');
  visual('phase-diagram', {
    title: '一张图看懂固、液、气：相图',
    kind: '相图示意',
    figure: svgSvg(uid, 640, 300, '温度—压力相图，三条平衡线把平面分成固、液、气三个相区', body),
    caption: '相图用温度和压力做坐标：线是两相共存，交点是三相共存，区域内部是单一相。水的熔化线向左倾斜，这是水的一个反常之处。',
    read: [
      '三条线分别对应升华、熔化、汽化平衡；线上两相共存，自由度少一个。',
      '三相点是三条线唯一交点：此时固、液、气三相同时存在，温度和压力都固定。',
      '越过临界点后液、气不再分界，成为超临界流体。注意水的熔化线斜率是负的（冰比水轻的后果）。'
    ]
  });
})();

(function galvanicCellVisual() {
  const uid = 'vis-cell';
  const body = [
    /* 左烧杯 */
    `<path d="M70 130 L70 240 Q70 258 88 258 L192 258 Q210 258 210 240 L210 130" fill="none" stroke="${SVIS.soft}" stroke-width="2"/>`,
    `<rect x="76" y="150" width="128" height="96" fill="${SVIS.accent}" opacity=".75"/>`,
    `<rect x="136" y="96" width="14" height="120" fill="${SVIS.mid}" opacity=".85"/>`,
    svgText(120, 116, 'Zn', { size: 12, fill: SVIS.mid, anchor: 'end' }),
    svgText(140, 228, 'ZnSO₄', { size: 11, fill: SVIS.muted }),
    /* 右烧杯 */
    `<path d="M430 130 L430 240 Q430 258 448 258 L552 258 Q570 258 570 240 L570 130" fill="none" stroke="${SVIS.soft}" stroke-width="2"/>`,
    `<rect x="436" y="150" width="128" height="96" fill="${SVIS.accent}" opacity=".75"/>`,
    `<rect x="496" y="96" width="14" height="120" fill="${SVIS.warm}" opacity=".9"/>`,
    svgText(526, 116, 'Cu', { size: 12, fill: SVIS.warm, anchor: 'start' }),
    svgText(500, 228, 'CuSO₄', { size: 11, fill: SVIS.muted }),
    /* 盐桥 */
    svgPath(`M210 160 Q320 108 430 160`, { stroke: SVIS.mid, w: 12, opacity: 0.25 }),
    svgPath(`M210 160 Q320 108 430 160`, { stroke: SVIS.mid, w: 2 }),
    svgText(320, 112, '盐桥（KCl）', { size: 11, fill: SVIS.mid }),
    /* 导线 */
    svgPath(`M143 96 L143 56 L503 56 L503 96`, { stroke: SVIS.ink, w: 2 }),
    svgLine(300, 56, 346, 56, { stroke: SVIS.gold, w: 3, marker: `${uid}-g` }),
    svgText(322, 42, 'e⁻', { math: true, size: 13, fill: SVIS.gold }),
    svgText(322, 76, '电子由负极流向正极', { size: 11.5, fill: SVIS.muted }),
    svgText(143, 286, '负极 · 阳极 · 氧化', { size: 11, fill: SVIS.mid }),
    svgText(503, 286, '正极 · 阴极 · 还原', { size: 11, fill: SVIS.warm }),
    svgText(320, 286, '外电路：电子导电｜内电路：离子导电', { size: 11.5, fill: SVIS.muted })
  ].join('');
  visual('galvanic-cell', {
    title: '原电池：把氧化还原拆成两半',
    kind: '装置示意',
    figure: svgSvg(uid, 640, 320, '锌铜原电池装置，电子经外电路从锌流向铜，盐桥构成内电路', body),
    caption: '把氧化反应和还原反应分在两个半电池里，电子就只能走外电路，于是产生电流。盐桥让内电路闭合，同时保持两边电中性。',
    read: [
      '左：Zn 失电子被氧化，是负极（阳极）；右：Cu²⁺ 得电子被还原，是正极（阴极）。',
      '外电路靠电子导电，方向由负极到正极；内电路靠离子迁移，方向与电子相反。',
      '没有盐桥（或离子通路断开）时，电荷堆积会立刻让反应停下。注意“阳极/阴极”按反应类型分，“正极/负极”按电势高低分。'
    ]
  });
})();

(function firstOrderVisual() {
  const uid = 'vis-first';
  const left = { x0: 82, x1: 300, y0: 60, y1: 250 }, right = { x0: 388, x1: 590, y0: 60, y1: 250 };
  const m1 = svgMap(left, [0, 5], [0, 1.05]), m2 = svgMap(right, [0, 5], [-2.4, 0.25]);
  const c = t => Math.exp(-0.693 * t), lnc = t => -0.693 * t;
  const body = [
    svgLine(...m1(0, 0), ...m1(5, 0), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...m1(0, 0), ...m1(0, 1), { stroke: SVIS.soft, w: 1.2 }),
    svgPlot(c, 0, 4.8, 90, m1, { stroke: SVIS.green, w: 2.4 }),
    svgLine(m1(1, 0)[0], m1(1, 0)[1], m1(1, c(1))[0], m1(1, c(1))[1], { stroke: SVIS.warm, w: 1, dash: '3 4' }),
    svgLine(m1(2, 0)[0], m1(2, 0)[1], m1(2, c(2))[0], m1(2, c(2))[1], { stroke: SVIS.warm, w: 1, dash: '3 4' }),
    svgText(m1(1, 0)[0] + 4, m1(0, 0)[1] + 18, 't½', { math: true, size: 11.5, fill: SVIS.warm, anchor: 'start' }),
    svgText(m1(2, 0)[0] + 4, m1(0, 0)[1] + 18, '2t½', { math: true, size: 11.5, fill: SVIS.warm, anchor: 'start' }),
    svgText(m1(4.6, 0)[0], m1(4.6, 0)[1] + 18, 't', { math: true, italic: true, size: 12, fill: SVIS.muted }),
    svgText(m1(0, 1)[0] - 16, m1(0, 1)[1] + 4, 'c', { math: true, italic: true, size: 12, fill: SVIS.muted }),
    svgText(190, 42, '浓度随时间指数衰减', { size: 11.5, fill: SVIS.muted }),

    svgLine(...m2(0, -2.4), ...m2(5, -2.4), { stroke: SVIS.soft, w: 1.2, marker: `${uid}-a` }),
    svgLine(...m2(0, 0.1), ...m2(0, -2.4), { stroke: SVIS.soft, w: 1.2 }),
    svgPlot(lnc, 0, 3, 20, m2, { stroke: SVIS.gold, w: 2.4 }),
    svgText(m2(3, 0)[0] + 6, m2(3, -2.2)[1], 't', { math: true, italic: true, size: 12, fill: SVIS.muted }),
    svgText(m2(0, 0)[0] - 18, m2(0, -0.2)[1], 'ln c', { math: true, size: 12, fill: SVIS.gold }),
    svgText(489, 42, '取对数后变成直线', { size: 11.5, fill: SVIS.muted })
  ].join('');
  visual('first-order', {
    title: '一级反应：每过一个半衰期剩一半',
    kind: '曲线示意',
    figure: svgSvg(uid, 640, 300, '一级反应的浓度随时间指数衰减，取自然对数后为直线，斜率为负的反应速率常数', body),
    caption: '一级反应的速率只与反应物浓度的一次方成正比，因此浓度按指数规律下降。取对数后得到直线，斜率就是 −k。',
    read: [
      '左图：每经过一个半衰期 t½，浓度减半，再减半；半衰期与初始浓度无关，这是“一级”的标志。',
      '右图：ln c 对 t 作图是一条直线，斜率为 −k，截距为 ln c₀。',
      '判断级数时不要只看“曲线像不像指数”，要用 ln c–t、1/c–t 等线性检验来确认。'
    ]
  });
})();

(function gibbsTable() {
  visual('gibbs', {
    title: 'ΔG 的正负决定反应方向',
    kind: '判据对照',
    table: `<table class="visual-table"><caption>ΔG = ΔH − TΔS 的四种组合</caption><thead><tr><th>ΔH</th><th>ΔS</th><th>ΔG</th><th>自发性</th><th>温度的影响</th></tr></thead><tbody>
      <tr><th scope="row">−</th><td>+</td><td>−</td><td class="ok">任何温度都自发</td><td>低温高温都自发</td></tr>
      <tr><th scope="row">+</th><td>−</td><td>+</td><td class="no">任何温度都不自发</td><td>低温高温都不自发</td></tr>
      <tr><th scope="row">−</th><td>−</td><td>低温 −、高温 +</td><td class="warn">低温自发</td><td>升温后变得不自发</td></tr>
      <tr><th scope="row">+</th><td>+</td><td>低温 +、高温 −</td><td class="warn">高温自发</td><td>存在转变温度 T = ΔH/ΔS</td></tr>
    </tbody></table>`,
    read: [
      'ΔG &lt; 0 表示在给定条件下过程自发；ΔG = 0 是平衡；ΔG &gt; 0 不自发（逆过程自发）。',
      '“自发”只说明热力学方向，不说明快慢——速率由活化能决定，两者别混。',
      'ΔG 随温度变化，是因为 TΔS 项里带着温度；判断时用的必须是该温度下的 ΔG，不能只查 298 K 的数据。'
    ]
  });
})();
