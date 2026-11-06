/* 图解层：离线 SVG 示意图与对照表。只负责呈现，不保存学习记录。 */
const SVIS = {
  ink: '#233d37', green: '#256956', deep: '#1d5647', mid: '#42775d', soft: '#9bb28e',
  pale: '#c9d6c2', grid: '#e8ece3', paper: '#fbfcf8', gold: '#b99557', warm: '#bd7a3c',
  accent: '#dfead8', muted: '#68736b', danger: '#a03627', blue: '#4a6f86'
};
const STUDY_VISUALS = new Map();
function visual(id, spec) { STUDY_VISUALS.set(id, spec); return spec; }
const visEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function svgText(x, y, text, o = {}) {
  const family = o.math ? "'Cambria Math','Times New Roman',serif" : "'Microsoft YaHei','PingFang SC',sans-serif";
  return `<text x="${x}" y="${y}" fill="${o.fill || SVIS.ink}" font-size="${o.size || 13}" text-anchor="${o.anchor || 'middle'}" font-family="${family}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.italic ? ' font-style="italic"' : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}>${visEscape(text)}</text>`;
}
function svgLine(x1, y1, x2, y2, o = {}) {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || SVIS.mid}" stroke-width="${o.w || 1.4}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round"${o.opacity ? ` opacity="${o.opacity}"` : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}/>`;
}
function svgPath(d, o = {}) {
  return `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.stroke || SVIS.green}" stroke-width="${o.w || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"${o.opacity ? ` opacity="${o.opacity}"` : ''}${o.marker ? ` marker-end="url(#${o.marker})"` : ''}/>`;
}
function svgPoly(points, o = {}) {
  return `<polyline points="${points}" fill="${o.fill || 'none'}" stroke="${o.stroke || SVIS.green}" stroke-width="${o.w || 2}" stroke-linejoin="round" stroke-linecap="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}/>`;
}
function svgBox(x, y, w, h, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 4}" fill="${o.fill || 'none'}" stroke="${o.stroke || SVIS.pale}" stroke-width="${o.w || 1.2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.opacity ? ` opacity="${o.opacity}"` : ''}/>`;
}
function svgDot(x, y, o = {}) {
  return `<circle cx="${x}" cy="${y}" r="${o.r || 3.6}" fill="${o.fill || SVIS.green}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="1.4"` : ''}/>`;
}
function svgSvg(uid, w, h, label, body) {
  return `<svg class="study-figure" viewBox="0 0 ${w} ${h}" role="img" aria-label="${visEscape(label)}"><defs><marker id="${uid}-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${SVIS.mid}"/></marker><marker id="${uid}-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="${SVIS.gold}"/></marker></defs>${body}</svg>`;
}
/* 用直线连接采样点，绘制函数曲线。map 把 (x, y) 映射成画布坐标。 */
function svgPlot(fn, from, to, steps, map, o = {}) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const x = from + (to - from) * i / steps, [px, py] = map(x, fn(x));
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return svgPoly(points.join(' '), { w: 2.2, ...o });
}
/* 折线图通用坐标变换：带边距的绘图区。 */
function svgMap(box, xd, yd) {
  return (x, y) => [
    box.x0 + (x - xd[0]) / (xd[1] - xd[0]) * (box.x1 - box.x0),
    box.y1 - (y - yd[0]) / (yd[1] - yd[0]) * (box.y1 - box.y0)
  ];
}
function studyVisualHTML(id) {
  const v = STUDY_VISUALS.get(id);
  if (!v) return '';
  const figure = v.figure ? `<figure class="visual-figure">${v.figure}${v.caption ? `<figcaption>${v.caption}</figcaption>` : ''}</figure>` : '';
  const table = v.table ? `<div class="table-wrap visual-table-wrap">${v.table}</div>` : '';
  const read = v.read && v.read.length
    ? `<div class="visual-read"><p class="visual-read-title">怎么读这张${v.figure ? '图' : '表'}</p><ol>${v.read.map(s => `<li>${s}</li>`).join('')}</ol></div>`
    : '';
  return `<div class="study-visual" role="group" aria-label="${visEscape(v.title)}"><p class="visual-kicker">图解 · ${visEscape(v.kind || '示意')}</p><h2 class="visual-title">${visEscape(v.title)}</h2>${figure}${table}${read}</div>`;
}
function studyVisualIds() { return [...STUDY_VISUALS.keys()]; }
