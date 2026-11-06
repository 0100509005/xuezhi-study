/* 计算机基础图解：把存储结构、数据结构和常见顺序画出来。 */
(function baseTable() {
  const rows = [];
  for (let i = 0; i <= 15; i++) {
    const bin = i.toString(2).padStart(4, '0'), oct = i.toString(8), hex = i.toString(16).toUpperCase();
    rows.push(`<tr><th scope="row">${i}</th><td>${bin}</td><td>${oct}</td><td>${hex}</td></tr>`);
  }
  visual('cs-base', {
    title: '0—15：二进制、八进制、十进制、十六进制对照',
    kind: '对照表',
    table: `<table class="visual-table"><caption>四位二进制刚好对应一位十六进制</caption><thead><tr><th>十进制</th><th>二进制（4 位）</th><th>八进制</th><th>十六进制</th></tr></thead><tbody>${rows.join('')}</tbody></table>`,
    read: [
      '二进制每一位的位权是 2 的幂：从右往左依次 1、2、4、8、16……例如 1011 = 8 + 2 + 1 = 11。',
      '八进制一位对应三位二进制，十六进制一位对应四位二进制，所以这两种进制只是二进制的简写。',
      '十六进制的 A—F 分别表示 10—15；写地址、颜色值时常见 0x 前缀，0x1F = 31。'
    ]
  });
})();

(function twosComplementTable() {
  visual('cs-twos', {
    title: '补码：让减法变成加法',
    kind: '对照表',
    table: `<table class="visual-table"><caption>8 位整数的原码、反码与补码</caption><thead><tr><th>真值</th><th>原码</th><th>反码（负数逐位取反）</th><th>补码（反码加 1）</th></tr></thead><tbody>
      <tr><th scope="row">+5</th><td>0000 0101</td><td>0000 0101</td><td>0000 0101</td></tr>
      <tr><th scope="row">−5</th><td>1000 0101</td><td>1111 1010</td><td>1111 1011</td></tr>
      <tr><th scope="row">+127</th><td>0111 1111</td><td>0111 1111</td><td>0111 1111</td></tr>
      <tr><th scope="row">−127</th><td>1111 1111</td><td>1000 0000</td><td>1000 0001</td></tr>
      <tr><th scope="row">−128</th><td>无法用原码表示</td><td>—</td><td>1000 0000</td></tr>
      <tr><th scope="row">−1</th><td>1000 0001</td><td>1111 1110</td><td>1111 1111</td></tr>
    </tbody></table>`,
    read: [
      '最高位是符号位：0 表示非负数，1 表示负数；其余位是数值部分。',
      '正数的三种码相同；负数要先把数值位取反再加 1。补码把 −5 变成 1111 1011，5 + (−5) 相加正好溢出得到 0。',
      '8 位补码的范围是 −128 到 +127，负数比正数多一个——因为 1000 0000 被用来表示 −128。'
    ]
  });
})();

(function arrayVisual() {
  const uid = 'vis-array', startX = 96, y = 132, w = 68, h = 50, gap = 6;
  const cells = ['17', '42', '8', '95', '23', '61'];
  let body = '';
  cells.forEach((v, i) => {
    const x = startX + i * (w + gap);
    body += svgBox(x, y, w, h, { fill: i % 2 ? '#f4f7ef' : '#fff', stroke: SVIS.soft });
    body += svgText(x + w / 2, y + h / 2 + 6, v, { size: 16, fill: SVIS.ink, math: true });
    body += svgText(x + w / 2, y - 12, `a[${i}]`, { size: 11, fill: SVIS.green, math: true });
    body += svgText(x + w / 2, y + h + 20, '0x' + (0x1000 + i * 4).toString(16).toUpperCase(), { size: 11.5, fill: SVIS.muted, math: true });
  });
  const first = startX + w / 2, last = startX + 5 * (w + gap) + w / 2;
  body += svgLine(first, y + h + 34, last, y + h + 34, { stroke: SVIS.warm, w: 1.4, marker: `${uid}-g` });
  body += svgLine(last, y + h + 34, first, y + h + 34, { stroke: SVIS.warm, w: 1.4, marker: `${uid}-g` });
  body += svgText((first + last) / 2, y + h + 52, '每格 4 字节，地址连续递增', { size: 11, fill: SVIS.warm });
  body += svgText(startX, y - 78, '数组名 a 就是第 0 个元素的地址', { size: 12, fill: SVIS.muted, anchor: 'start' });
  body += svgText(startX, y - 56, 'a[i] 的地址 = 首地址 + i × 元素大小', { size: 12, fill: SVIS.green, anchor: 'start' });
  visual('cs-array', {
    title: '数组：元素挨着放，靠下标算地址',
    kind: '存储示意',
    figure: svgSvg(uid, 640, 260, '一维数组在内存中连续存放，每个元素占固定字节数，地址按下标线性计算', body),
    caption: '数组把同类型元素连续排在一块内存里。知道首地址和每个元素的大小，就能用一次乘法直接算出任意元素的地址，所以按下标访问很快。',
    read: [
      '上面一排是下标 a[0]…a[5]，下面是它们在内存里的实际地址。',
      '地址公式是“首地址 + 下标 × 元素大小”；本图假设 int 占 4 字节，所以每格差 0x4。',
      '连续存放带来快速随机访问，代价是插入、删除要挪动后面的元素，而且数组长度通常要预先确定。'
    ]
  });
})();

(function listTable() {
  visual('cs-list', {
    title: '顺序表与链表：存取快慢的取舍',
    kind: '对比表',
    table: `<table class="visual-table"><caption>两种线性表存储结构</caption><thead><tr><th>对比项</th><th>顺序表（数组）</th><th>链表</th></tr></thead><tbody>
      <tr><th scope="row">存储方式</th><td>连续存放</td><td>结点分散，用指针相连</td></tr>
      <tr><th scope="row">按下标访问</th><td class="ok">O(1)，直接算地址</td><td class="no">O(n)，要从头顺着找</td></tr>
      <tr><th scope="row">插入 / 删除</th><td class="no">平均 O(n)，要挪元素</td><td class="ok">已知位置时 O(1)，只改指针</td></tr>
      <tr><th scope="row">空间开销</th><td>可能要预留容量，浪费空间</td><td>每个结点多存指针</td></tr>
      <tr><th scope="row">典型用途</th><td>频繁按下标读取、长度稳定</td><td>频繁插入删除、长度变化大</td></tr>
    </tbody></table>`,
    read: [
      '顺序表的核心优势是“算地址”，链表的核心优势是“改指针”。',
      '链表按位置查找仍然是 O(n)：改指针快，前提是已经拿到了那个位置的结点。',
      '选择时先问自己：读得多还是改得多？读多选顺序表，改多选链表。'
    ]
  });
})();

(function stackVisual() {
  const uid = 'vis-stack', x = 262, y = 128, w = 124, h = 40, values = ['5', '8', '3'];
  let body = svgText(x + w + 14, y + 25, '← top 栈顶', { size: 12, fill: SVIS.gold, anchor: 'start' });
  for (let i = 0; i < 5; i++) {
    const cy = y + i * h;
    const filled = i < values.length;
    body += svgBox(x, cy, w, h, { fill: filled ? SVIS.accent : '#fff', stroke: SVIS.soft, rx: 0 });
    if (filled) body += svgText(x + w / 2, cy + h / 2 + 6, values[i], { size: 16, fill: SVIS.ink, math: true });
  }
  body += svgText(x + w / 2, y + 5 * h + 24, '栈底 bottom', { size: 12, fill: SVIS.muted });
  body += svgLine(x + 30, y - 46, x + 30, y - 6, { stroke: SVIS.gold, w: 2, marker: `${uid}-g` });
  body += svgText(x + 22, y - 24, 'push', { size: 11.5, fill: SVIS.gold, anchor: 'end' });
  body += svgLine(x + w - 30, y - 6, x + w - 30, y - 46, { stroke: SVIS.warm, w: 2, marker: `${uid}-a` });
  body += svgText(x + w - 22, y - 24, 'pop', { size: 11.5, fill: SVIS.warm, anchor: 'start' });
  body += svgText(64, y + 40, '后进', { size: 14, fill: SVIS.muted, anchor: 'start' });
  body += svgText(64, y + 64, '先出', { size: 14, fill: SVIS.muted, anchor: 'start' });
  body += svgText(64, y + 104, 'LIFO', { size: 13, fill: SVIS.green, anchor: 'start' });
  visual('cs-stack', {
    title: '栈：只能在顶端进出',
    kind: '结构示意',
    figure: svgSvg(uid, 640, 340, '栈的示意：元素从栈顶压入，也从栈顶弹出，后进先出', body),
    caption: '栈只允许在一端（栈顶）插入和删除。最后压进去的元素最先被弹出，这就是“后进先出”。',
    read: [
      'push 把新元素放到栈顶，top 指针上移；pop 取走栈顶元素，top 下移。',
      '图中依次压入 3、8、5，栈顶是 5；此时出栈得到 5，再是 8，最后才是 3。',
      '函数调用、括号匹配、表达式求值、撤销操作都靠栈；栈空时再 pop 叫“下溢”，栈满再 push 叫“上溢”。'
    ]
  });
})();

(function queueVisual() {
  const uid = 'vis-queue', cx = 320, cy = 158, r = 90, slots = 8;
  let body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${SVIS.grid}" stroke-width="1.4"/>`;
  for (let i = 0; i < slots; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / slots;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    const filled = [2, 3, 4].includes(i);
    body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="17" fill="${filled ? SVIS.accent : '#fff'}" stroke="${i === 2 ? SVIS.gold : i === 5 ? SVIS.warm : SVIS.soft}" stroke-width="${i === 2 || i === 5 ? 2.6 : 1.2}"/>`;
    body += svgText(x.toFixed(1), y + 4, String(i), { size: 11, fill: filled || i === 5 ? SVIS.ink : SVIS.muted, math: true });
  }
  body += svgText(cx, cy - 4, '循环队列', { size: 13, fill: SVIS.ink });
  body += svgText(cx, cy + 18, '容量 8', { size: 11, fill: SVIS.muted });
  body += `<circle cx="150" cy="300" r="7" fill="${SVIS.accent}" stroke="${SVIS.gold}" stroke-width="2.4"/>`;
  body += svgText(166, 305, 'front：队头，从这里出队', { size: 11.5, fill: SVIS.gold, anchor: 'start' });
  body += `<circle cx="150" cy="322" r="7" fill="#fff" stroke="${SVIS.warm}" stroke-width="2.4"/>`;
  body += svgText(166, 327, 'rear：下一个空位，从这里入队', { size: 11.5, fill: SVIS.warm, anchor: 'start' });
  visual('cs-queue', {
    title: '循环队列：队尾绕回开头',
    kind: '结构示意',
    figure: svgSvg(uid, 640, 340, '循环队列把数组首尾相接，front 指向队头，rear 指向下一个空位', body),
    caption: '队列先进先出，只允许队尾入队、队头出队。把数组首尾接成一个环，出队留下的空位就能被后面的元素循环利用。',
    read: [
      '金色圈出的 2 是队头 front，橙色圈出的 5 是下一个可写入的位置 rear；2—4 是当前排队的元素。',
      'rear 到达数组末尾后不是溢出，而是回到下标 0：(rear + 1) % 容量。',
      '为了区分“队空”和“队满”，通常牺牲一个空位：当 (rear + 1) % 容量 == front 时判满。'
    ]
  });
})();

(function treeVisual() {
  const uid = 'vis-tree';
  const node = (x, y, label, accent) => `<circle cx="${x}" cy="${y}" r="18" fill="${accent ? SVIS.accent : '#fff'}" stroke="${SVIS.mid}" stroke-width="1.6"/>` + svgText(x, y + 5, label, { size: 13, fill: SVIS.ink });
  const edge = (x1, y1, x2, y2) => svgLine(x1, y1 + 18, x2, y2 - 18, { stroke: SVIS.soft, w: 1.6 });
  const body = [
    edge(320, 66, 210, 146), edge(320, 66, 440, 146),
    edge(210, 146, 148, 226), edge(210, 146, 272, 226), edge(440, 146, 512, 226),
    node(320, 66, 'A', true), node(210, 146, 'B'), node(440, 146, 'C'), node(148, 226, 'D'), node(272, 226, 'E'), node(512, 226, 'F'),
    svgText(320, 40, '根结点', { size: 11, fill: SVIS.muted }),
    svgText(120, 270, '先序：A · B · D · E · C · F', { size: 12.5, fill: SVIS.green, anchor: 'start' }),
    svgText(120, 292, '中序：D · B · E · A · C · F', { size: 12.5, fill: SVIS.warm, anchor: 'start' }),
    svgText(120, 314, '后序：D · E · B · F · C · A', { size: 12.5, fill: SVIS.gold, anchor: 'start' })
  ].join('');
  visual('cs-tree', {
    title: '二叉树的三种遍历顺序',
    kind: '结构示意',
    figure: svgSvg(uid, 640, 340, '一棵二叉树及其先序、中序、后序遍历序列', body),
    caption: '遍历就是按固定规则把每个结点访问一遍。先序“根左右”，中序“左根右”，后序“左右根”，区别只在访问根结点的时机。',
    read: [
      '先序：先访问 A，再整棵左子树（B、D、E），最后右子树（C、F）。',
      '中序：先走完左子树，再访问根。对二叉搜索树来说，中序序列正好是从小到大排序。',
      '后序：左右子树都访问完才轮到根，适合先算子树、再合并结果的场景（如释放内存）。'
    ]
  });
})();

(function binarySearchVisual() {
  const uid = 'vis-search', data = [3, 8, 12, 19, 25, 31, 40, 47, 56, 63];
  const startX = 92, cellW = 44, gap = 2, rowH = 82, top = 66, steps = [
    { low: 0, high: 9, mid: 4, note: 'a[4] = 25 < 40，目标只可能在右半边 → low 移到 mid + 1' },
    { low: 5, high: 9, mid: 7, note: 'a[7] = 47 > 40，目标只可能在左半边 → high 移到 mid − 1' },
    { low: 5, high: 6, mid: 5, note: 'a[5] = 31 < 40，继续往右 → low 移到 6' },
    { low: 6, high: 6, mid: 6, note: 'a[6] = 40，与目标相等，查找结束' }
  ];
  let body = '';
  steps.forEach((s, row) => {
    const y = top + row * rowH;
    body += svgText(30, y + 25, `第 ${row + 1} 次`, { size: 11.5, fill: SVIS.muted, anchor: 'start' });
    data.forEach((v, i) => {
      const x = startX + i * (cellW + gap);
      const isMid = i === s.mid, inRange = i >= s.low && i <= s.high;
      body += svgBox(x, y, cellW, 38, { fill: isMid ? SVIS.accent : inRange ? '#fff' : '#f3f4f0', stroke: isMid ? SVIS.green : SVIS.soft, rx: 3, w: isMid ? 2 : 1 });
      body += svgText(x + cellW / 2, y + 25, String(v), { size: 11.5, fill: inRange ? SVIS.ink : SVIS.muted, math: true });
      if (row === 0) body += svgText(x + cellW / 2, y - 8, `[${i}]`, { size: 9, fill: SVIS.soft, math: true });
    });
    body += svgText(startX, y + 58, s.note, { size: 11.5, fill: row === 3 ? SVIS.green : SVIS.muted, anchor: 'start' });
  });
  visual('cs-search', {
    title: '二分查找：每次砍掉一半',
    kind: '过程示意',
    figure: svgSvg(uid, 640, 400, '在有序数组中查找 40，四次比较逐步缩小范围', body),
    caption: '二分查找要求数据有序。每次比较中间元素，就能排除一半；范围缩到只剩一个元素时结束，因此最多比较约 log₂n 次。',
    read: [
      '浅灰格是已经被排除的元素，白格是当前还在找的范围，绿格是本次比较的中间元素。',
      '第 1 次取中点 25，比 40 小，说明目标只可能在右半边；范围立刻从 10 个缩到 5 个。',
      '每次范围减半，所以 1000 个元素最多约 10 次比较；但若数据无序，只能顺序查找，最坏要看完全部。'
    ]
  });
})();

(() => {
  visual('cs-complexity', {
    title: '数据变多，代价怎样增长',
    kind: '数量级对照',
    table: `<table class="visual-table"><caption>不同复杂度在 n = 10、100、1000 时的操作次数（量级）</caption><thead><tr><th>复杂度</th><th>n = 10</th><th>n = 100</th><th>n = 1000</th><th>典型例子</th></tr></thead><tbody>
      <tr><th scope="row">O(1)</th><td>1</td><td>1</td><td>1</td><td>数组按下标取值、哈希查找</td></tr>
      <tr><th scope="row">O(log n)</th><td>约 3</td><td>约 7</td><td>约 10</td><td>二分查找、平衡树查找</td></tr>
      <tr><th scope="row">O(n)</th><td>10</td><td>100</td><td>1000</td><td>顺序查找、一趟遍历</td></tr>
      <tr><th scope="row">O(n log n)</th><td>约 33</td><td>约 664</td><td>约 10⁴</td><td>快速排序、归并排序（平均）</td></tr>
      <tr><th scope="row">O(n²)</th><td>100</td><td>10⁴</td><td>10⁶</td><td>冒泡、选择、插入排序</td></tr>
      <tr><th scope="row">O(2ⁿ)</th><td>约 10³</td><td>约 10³⁰</td><td>天文数字</td><td>穷举子集、朴素递归</td></tr>
    </tbody></table>`,
    read: [
      '大 O 只保留增长最快的项、忽略常数：3n² + 5n + 7 记作 O(n²)。',
      '看表时关注“n 放大 10 倍，操作次数放大几倍”：线性是 10 倍，平方是 100 倍，指数则直接不可算。',
      '实际选算法时，数据规模小差别不大；规模一大，复杂度低一个量级就是决定性优势。'
    ]
  });
  visual('cs-sort', {
    title: '几种排序：思路与代价',
    kind: '对比表',
    table: `<table class="visual-table"><caption>常见排序算法对比（n 个元素）</caption><thead><tr><th>算法</th><th>基本思路</th><th>平均时间</th><th>最坏时间</th><th>额外空间</th><th>稳定</th></tr></thead><tbody>
      <tr><th scope="row">冒泡排序</th><td>相邻两两比较，大的往后换</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td class="ok">稳定</td></tr>
      <tr><th scope="row">选择排序</th><td>每轮选出最小者放到前面</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td class="no">不稳定</td></tr>
      <tr><th scope="row">插入排序</th><td>把新元素插进已排好的序列</td><td>O(n²)</td><td>O(n²)</td><td>O(1)</td><td class="ok">稳定</td></tr>
      <tr><th scope="row">快速排序</th><td>选基准，分成小于和大于两半</td><td>O(n log n)</td><td>O(n²)</td><td>O(log n)</td><td class="no">不稳定</td></tr>
      <tr><th scope="row">归并排序</th><td>分成两半分别排好再合并</td><td>O(n log n)</td><td>O(n log n)</td><td>O(n)</td><td class="ok">稳定</td></tr>
    </tbody></table>`,
    read: [
      '“稳定”指相等的元素排完后相对次序不变，按多关键字排序时会用到。',
      '快排最坏退化成 O(n²)，通常发生在基准选得极偏（如已有序数据取第一个元素）时。',
      '冒泡、插入在数据接近有序时很快；归并稳定但要额外空间，属于“用空间换稳定”。'
    ]
  });
})();
