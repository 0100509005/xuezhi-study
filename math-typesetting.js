/* Offline native MathML. Plain text remains the stored source of questions/progress. */
const mx=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mi=s=>`<mi>${mx(s)}</mi>`,mo=s=>`<mo>${mx(s)}</mo>`,mt=s=>`<mtext>${mx(s)}</mtext>`,mr=(...s)=>`<mrow>${s.join('')}</mrow>`;
const mf=(a,b)=>`<mfrac>${a}${b}</mfrac>`,ms=(a,b)=>`<msup>${a}${b}</msup>`,mb=(a,b)=>`<msub>${a}${b}</msub>`;
const fence=(s,left='(',right=')')=>mr(mo(left),s,mo(right));
const matrixML=(rows,bars=false)=>fence(`<mtable rowspacing="0.35em" columnspacing="1em">${rows.map(row=>`<mtr>${row.map(cell=>`<mtd>${mathExpressionML(String(cell))}</mtd>`).join('')}</mtr>`).join('')}</mtable>`,bars?'|':'(',bars?'|':')');
const SMALL_SUB={'₀':'0','₁':'1','₂':'2','₃':'3','₄':'4','₅':'5','₆':'6','₇':'7','₈':'8','₉':'9','ₐ':'a','ₑ':'e','ₕ':'h','ᵢ':'i','ⱼ':'j','ₖ':'k','ₗ':'l','ₘ':'m','ₙ':'n','ₒ':'o','ₚ':'p','ᵣ':'r','ₛ':'s','ₜ':'t','ₓ':'x','₊':'+','₋':'−','₌':'=','₍':'(','₎':')'};
const SMALL_SUP={'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁺':'+','⁻':'−','⁼':'=','⁽':'(','⁾':')','ᵃ':'a','ᵇ':'b','ᶜ':'c','ᵈ':'d','ᵉ':'e','ᶠ':'f','ᵍ':'g','ʰ':'h','ⁱ':'i','ʲ':'j','ᵏ':'k','ˡ':'l','ᵐ':'m','ⁿ':'n','ᵒ':'o','ᵖ':'p','ʳ':'r','ˢ':'s','ᵗ':'t','ᵘ':'u','ᵛ':'v','ʷ':'w','ˣ':'x','ʸ':'y','ᶻ':'z','ᵀ':'T'};
function mathTokens(source){
 const chars=Array.from(source.replace(/−|–/g,'-')),tokens=[];let i=0;
 while(i<chars.length){const c=chars[i];if(/\s/.test(c)){i++;continue;}
  if(source.length>5000)throw Error('formula too long');
  if(SMALL_SUB[c]!==undefined||SMALL_SUP[c]!==undefined){const type=SMALL_SUB[c]!==undefined?'sub':'sup',dict=type==='sub'?SMALL_SUB:SMALL_SUP;let value='';while(i<chars.length&&dict[chars[i]]!==undefined)value+=dict[chars[i++]];tokens.push({type,value});continue;}
  if(/\d/.test(c)){let value='';while(i<chars.length&&/[\d.]/.test(chars[i]))value+=chars[i++];tokens.push({type:'number',value});continue;}
  const rest=chars.slice(i).join(''),named=rest.match(/^(?:arcsin|arccos|arctan|rank|diag|span|proj|det|lim|sin|cos|tan|cot|sec|ln|log|tr|min|max|adj)(?![a-z])/);
  if(named){tokens.push({type:'name',value:named[0]});i+=named[0].length;continue;}
  if(/[A-Za-zΑ-Ωα-ωℝℕℤ]/.test(c)){tokens.push({type:'id',value:c});i++;continue;}
  tokens.push({type:'op',value:c==='-'?'−':c});i++;
 }return tokens;
}
function mathExpressionML(source){
 const tokens=mathTokens(String(source));let at=0;const peek=()=>tokens[at];
 const atom=()=>{
  const t=tokens[at++];if(!t)return mr();let base;
  if(t.value==='−'||t.value==='+')base=mr(mo(t.value),atom());
  else if(t.value==='√')base=`<msqrt>${atom()}</msqrt>`;
  else if(['(','[','{'].includes(t.value)){
   const end={'(':')','[':']','{':'}'}[t.value],parts=[];
   while(at<tokens.length&&peek().value!==end){const old=at;parts.push(expr(0));if(peek()?.value===','){at++;parts.push(mo(','));}if(at===old)parts.push(mo(tokens[at++].value));}
   if(peek()?.value===end)at++;base=fence(mr(...parts),t.value,end);
  }else if(t.type==='number')base=`<mn>${mx(t.value)}</mn>`;
  else if(t.type==='id')base=mi(t.value);
  else if(t.type==='name'){
   base=`<mi mathvariant="normal">${mx(t.value)}</mi>`;
   if(t.value==='diag'&&peek()?.value==='('){const saved=at;at++;const cells=[];let cell='',depth=0;while(at<tokens.length){const v=tokens[at++].value;if(v===')'&&depth===0){cells.push(cell);break;}if(v===','&&depth===0){cells.push(cell);cell='';continue;}if(v==='(')depth++;if(v===')')depth--;cell+=v;}if(cells.length>=2&&cells.length<=5&&cells.every(c=>c&&!/[⋯…]/.test(c)))base=matrixML(cells.map((c,i)=>cells.map((_,j)=>i===j?c:'0')));else at=saved;}
   if(t.value==='lim'&&peek()?.value==='('){at++;const below=[];while(at<tokens.length&&peek().value!==')')below.push(tokens[at++].value);if(peek()?.value===')')at++;base=`<munder>${base}${mathExpressionML(below.join(''))}</munder>`;}
  }else base=mo(t.value);
  let lower=null,upper=null;
  while(peek()&&(peek().type==='sub'||peek().type==='sup'||['^','_','′','!'].includes(peek().value)||(peek().value==='*'&&(!tokens[at+1]||['=','≠',',',')'].includes(tokens[at+1].value))))){const n=tokens[at++];if(n.value==='′'||n.value==='!'){base=mr(base,mo(n.value));continue;}if(n.value==='*'){upper=mo('*');continue;}const content=n.type==='sub'||n.type==='sup'?mathExpressionML(n.value):atom();if(n.type==='sub'||n.value==='_')lower=content;else upper=content;}
  if(lower&&upper)base=`<msubsup>${base}${lower}${upper}</msubsup>`;else if(lower)base=mb(base,lower);else if(upper)base=ms(base,upper);
  return base;
 };
 const prec=t=>t?.type==='op'?({'=':1,'≠':1,'<':1,'>':1,'≤':1,'≥':1,'→':1,'⇒':1,'⇔':1,'∈':1,'≈':1,'∼':1,':':1,'+':2,'−':2,'×':3,'·':3,'*':3,'/':3})[t.value]:undefined;
 const expr=min=>{let left=atom();while(at<tokens.length){const t=peek();if([',',')',']','}'].includes(t.value))break;const p=prec(t);if(p===undefined){if(t.type==='sub'||t.type==='sup')break;left=mr(left,atom());continue;}if(p<min)break;at++;const right=expr(p+1);left=t.value==='/'?mf(left,right):mr(left,mo(t.value==='*'?'·':t.value),right);}return left;};
 const parts=[];while(at<tokens.length){const old=at;parts.push(expr(0));if(at===old)parts.push(mo(tokens[at++].value));else if(peek()?.value===','){at++;parts.push(mo(','));}}
 return mr(...parts);
}
function nativeMath(source,block=false,body){return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${block?'block':'inline'}" aria-label="${mx(source)}">${body||mathExpressionML(source)}</math>`;}
function matrixFromText(raw){
 const content=raw.slice(2,-2);return content.split(/\]\s*,\s*\[/).map(row=>row.split(',').map(x=>x.trim()));
}
function textbookText(text){
 // Matrices first: preserve row/column order exactly, never interpret source as HTML.
 const source=String(text??''),parts=[];let at=0;
 const matrices=[...source.matchAll(/\[\[[^\[\]\n]+\](?:\s*,\s*\[[^\[\]\n]+\])*\]/g)];
 if(matrices.length){let from=0;for(const m of matrices){parts.push(textbookText(source.slice(from,m.index)));parts.push(nativeMath(m[0],false,matrixML(matrixFromText(m[0]))));from=m.index+m[0].length;}parts.push(textbookText(source.slice(from)));return parts.join('');}
 const pattern=/[A-Za-zΑ-Ωα-ωℝℕℤ0-9(\[−∫∬Σ∏√∞∂Δ‖|][A-Za-zΑ-Ωα-ωℝℕℤ0-9₀-₉ₐₑₕᵢⱼₖₗₘₙₒₚᵣₛₜₓ₊₋₌₍₎⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᵀ=+−\-*/^_().,\[\]<>∫∬Σ∏√∞∂Δ‖|′×·→⇒⇔≈∼≤≥≠∈ ]*/g;
 for(const match of source.matchAll(pattern)){
  const raw=match[0],trimmed=raw.trimEnd(),space=raw.slice(trimmed.length);parts.push(mx(source.slice(at,match.index)));
  if(trimmed.startsWith('[[')){const rows=matrixFromText(trimmed);parts.push(nativeMath(trimmed,false,matrixML(rows)));}
  else if((/[=+−\-*/^_<>∫∬Σ∏√∂Δ‖|′×·→⇒⇔≈∼≤≥≠∈₀-₉²³⁻¹ⁿᵀ]/.test(trimmed)||/\bdiag\s*\(/.test(trimmed))&&!/^[-\d]+$/.test(trimmed)){
   try{parts.push(nativeMath(trimmed));}catch{parts.push(mx(trimmed));}
  }else parts.push(mx(trimmed));parts.push(mx(space));at=match.index+raw.length;
 }parts.push(mx(source.slice(at)));return parts.join('');
}
const TEXTBOOK_FORMULAS=new Map();
function TM(id,source,body){TEXTBOOK_FORMULAS.set(id,{source,body});}
const em=mathExpressionML;
const vec=s=>`<mover accent="true">${mi(s)}${mo('→')}</mover>`;
TM('matrix','矩阵及矩阵乘列向量',mr(mi('A'),mo('='),matrixML([['a₁₁','a₁₂','⋯','a₁ₙ'],['a₂₁','a₂₂','⋯','a₂ₙ'],['⋮','⋮','⋱','⋮'],['aₘ₁','aₘ₂','⋯','aₘₙ']]),mo('，'),mi('y'),mo('='),mi('A'),mi('x')));
TM('matrix-basic','矩阵转置',mr(mi('A'),mo('='),matrixML([['1','2'],['3','4']]),mo('，'),ms(mi('A'),mi('T')),mo('='),matrixML([['1','3'],['2','4']])));
TM('determinant','二阶行列式等于 ad−bc',mr(matrixML([['a','b'],['c','d']],true),mo('='),em('ad−bc')));
TM('inverse','二阶逆矩阵，ad−bc不等于零',mr(ms(mi('A'),em('−1')),mo('='),mf(em('1'),em('ad−bc')),matrixML([['d','−b'],['−c','a']]),mo('，'),em('ad−bc≠0')));
TM('cofactor','余子式与按行展开',mr(em('Aᵢⱼ=(−1)^(i+j)Mᵢⱼ'),mo('，'),mo('|'),mi('A'),mo('|'),mo('='),`<munderover>${mo('∑')}${em('j=1')}${mi('n')}</munderover>`,em('aᵢⱼAᵢⱼ')));
TM('adjugate','伴随矩阵',mr(ms(mi('A'),mo('*')),mo('='),matrixML([['A₁₁','A₂₁','⋯','Aₙ₁'],['A₁₂','A₂₂','⋯','Aₙ₂'],['⋮','⋮','⋱','⋮'],['A₁ₙ','A₂ₙ','⋯','Aₙₙ']]),mo('，'),em('AA*=|A|I')));
TM('cramer','克莱姆法则',mr(mb(mi('x'),mi('i')),mo('='),mf(mb(mi('D'),mi('i')),mi('D')),mo('，'),em('D=|A|≠0')));
TM('matrix-product','矩阵乘法的行乘列规则',mr(mb(mi('c'),em('ij')),mo('='),`<munderover>${mo('∑')}${em('k=1')}${mi('n')}</munderover>`,em('aᵢₖbₖⱼ')));
TM('det-properties','行列式的初等行变换规则',`<mtable columnalign="left"><mtr><mtd>${mt('交换两行：')}${em('D′=−D')}</mtd></mtr><mtr><mtd>${mt('一行乘 k：')}${em('D′=kD')}</mtd></mtr><mtr><mtd>${mt('一行加另一行的 k 倍：')}${em('D′=D')}</mtd></mtr><mtr><mtd>${mt('整个 n 阶矩阵乘 k：')}${em('|kA|=kⁿ|A|')}</mtd></mtr></mtable>`);
TM('derivative','导数的差商极限',mr(em('f′(a)'),mo('='),`<munder><mi mathvariant="normal">lim</mi>${em('h→0')}</munder>`,mf(em('f(a+h)−f(a)'),mi('h'))));
TM('limit','函数极限',mr(`<munder><mi mathvariant="normal">lim</mi>${em('x→a')}</munder>`,em('f(x)=L')));
TM('continuity','连续的条件',mr(`<munder><mi mathvariant="normal">lim</mi>${em('x→a')}</munder>`,em('f(x)=f(a)')));
TM('antiderivative','原函数与不定积分',em('F′(x)=f(x)⇒∫f(x)dx=F(x)+C'));
TM('integral','定积分',mr(`<msubsup>${mo('∫')}${mi('a')}${mi('b')}</msubsup>`,em('f(x)dx'),mo('='),`<munder><mi mathvariant="normal">lim</mi>${em('max Δxᵢ→0')}</munder>`,`<munderover>${mo('∑')}${em('i=1')}${mi('n')}</munderover>`,em('f(ξᵢ)Δxᵢ')));
TM('fundamental','牛顿—莱布尼茨公式',mr(`<msubsup>${mo('∫')}${mi('a')}${mi('b')}</msubsup>`,em('f(x)dx=F(b)−F(a)'),mo('，'),em('F′(x)=f(x)')));
TM('partial','偏导数定义',mr(mf(em('∂f'),em('∂x')),mo('='),`<munder><mi mathvariant="normal">lim</mi>${em('h→0')}</munder>`,mf(em('f(x+h,y)−f(x,y)'),mi('h'))));
TM('double','薄板质量的二重积分',mr(em('M='),mb(mo('∬'),mi('D')),em('ρ(x,y)dA')));
TM('taylor','有限泰勒公式及余项',mr(em('f(x)='),`<munderover>${mo('∑')}${em('k=0')}${mi('n')}</munderover>`,mf(mr(ms(mi('f'),fence(mi('k'))),fence(mi('a'))),mr(mi('k'),mo('!'))),ms(fence(em('x−a')),mi('k')),em('+Rₙ(x)')));
TM('series','等比级数',mr(mb(mi('S'),mi('N')),mo('='),`<munderover>${mo('∑')}${em('n=0')}${mi('N')}</munderover>`,em('qⁿ'),mo('='),mf(em('1−q^(N+1)'),em('1−q')),mo('，'),em('q≠1')));
TM('dot','向量数量积',mr(vec('a'),mo('·'),vec('b'),mo('='),`<munderover>${mo('∑')}${em('i=1')}${mi('n')}</munderover>`,em('aᵢbᵢ=‖a‖‖b‖cos θ')));
TM('cross','向量积的行列式写法',mr(vec('a'),mo('×'),vec('b'),mo('='),fence(`<mtable rowspacing="0.35em" columnspacing="1em"><mtr>${['i','j','k'].map(v=>`<mtd>${vec(v)}</mtd>`).join('')}</mtr>${[['a₁','a₂','a₃'],['b₁','b₂','b₃']].map(row=>`<mtr>${row.map(v=>`<mtd>${em(v)}</mtd>`).join('')}</mtr>`).join('')}</mtable>`,'|','|')));
TM('mixed-product','混合积与平行六面体体积',mr(fence(mr(vec('a'),mo('×'),vec('b'))),mo('·'),vec('c'),mo('='),matrixML([['a₁','a₂','a₃'],['b₁','b₂','b₃'],['c₁','c₂','c₃']],true)));
TM('projection','沿非零向量的向量投影',mr(mb(`<mi mathvariant="normal">proj</mi>`,vec('b')),vec('a'),mo('='),mf(mr(vec('a'),mo('·'),vec('b')),mr(vec('b'),mo('·'),vec('b'))),vec('b'),mo('，'),em('b≠0')));
TM('chain','链式法则',mr(mf(em('dy'),em('dx')),mo('='),mf(em('dy'),em('du')),mf(em('du'),em('dx')),em('=f′(g(x))g′(x)')));
TM('mean-value','拉格朗日中值定理',mr(em('f′(ξ)'),mo('='),mf(em('f(b)−f(a)'),em('b−a')),mo('，'),em('a<ξ<b')));
TM('lhopital','洛必达法则',mr(`<munder><mi mathvariant="normal">lim</mi>${em('x→a')}</munder>`,mf(em('f(x)'),em('g(x)')),mo('='),`<munder><mi mathvariant="normal">lim</mi>${em('x→a')}</munder>`,mf(em('f′(x)'),em('g′(x)'))));
TM('rank','方程组有解与秩的关系',mr(em('Ax=b'),mt(' 有解 '),em('⇔r(A)=r([A|b])')));
TM('eigen','特征值与特征向量',mr(em('Av=λv'),mo('，'),em('v≠0'),mo('；'),fence(em('A−λI'),'|','|'),em('=0')));
TM('diagonal','相似对角化',mr(em('P⁻¹AP='),matrixML([['λ₁','0','⋯','0'],['0','λ₂','⋯','0'],['⋮','⋮','⋱','⋮'],['0','0','⋯','λₙ']])));
TM('plane','空间直线与平面',`<mtable columnalign="left"><mtr><mtd>${mt('直线：')}${em('r=r₀+tv')}</mtd></mtr><mtr><mtd>${mt('平面：')}${em('n·(r−r₀)=0')}</mtd></mtr></mtable>`);
TM('space-distance','点到平面的距离',mr(em('d='),mf(fence(em('Ax₀+By₀+Cz₀+D'),'|','|'),`<msqrt>${em('A²+B²+C²')}</msqrt>`)));
TM('quadratic','二次型',mr(em('q(x)='),matrixML([['x₁','x₂']]),matrixML([['a','b'],['b','c']]),matrixML([['x₁'],['x₂']]),em('=ax₁²+2bx₁x₂+cx₂²')));
TM('surface','椭球面方程',mr(mf(em('x²'),em('a²')),mo('+'),mf(em('y²'),em('b²')),mo('+'),mf(em('z²'),em('c²')),em('=1'),mo('，'),em('a,b,c>0')));
TM('block-matrix','分块矩阵及其逆矩阵',mr(ms(matrixML([['0','A'],['B','0']]),em('−1')),mo('='),matrixML([['0','B⁻¹'],['A⁻¹','0']])));
TM('vector','向量与长度',mr(em('v='),fence(em('v₁,…,vₙ')),mo('，'),em('‖v‖='),`<msqrt>${em('v₁²+⋯+vₙ²')}</msqrt>`));
const formulaRows=(...rows)=>`<mtable columnalign="left" rowspacing="0.7em">${rows.map(r=>`<mtr><mtd>${r}</mtd></mtr>`).join('')}</mtable>`;
TM('matrix-basic','转置示例、元素规则及对称与反对称',formulaRows(TEXTBOOK_FORMULAS.get('matrix-basic').body,em('(Aᵀ)ᵢⱼ=aⱼᵢ'),mr(mt('对称：'),em('Aᵀ=A'),mo('；'),mt('反对称：'),em('Aᵀ=−A'))));
TM('block-matrix','块对角矩阵与非对角分块矩阵求逆',formulaRows(mr(ms(matrixML([['A','0'],['0','B']]),em('−1')),mo('='),matrixML([['A⁻¹','0'],['0','B⁻¹']])),TEXTBOOK_FORMULAS.get('block-matrix').body));
TM('matrix','矩阵、输入输出及行乘列',formulaRows(TEXTBOOK_FORMULAS.get('matrix').body,mr(em('yᵢ='),`<munderover>${mo('∑')}${em('j=1')}${mi('n')}</munderover>`,em('aᵢⱼxⱼ'))));
TM('fundamental','积分上限函数与牛顿—莱布尼茨公式',formulaRows(mr(em('A(x)='),`<msubsup>${mo('∫')}${mi('a')}${mi('x')}</msubsup>`,em('f(t)dt'),mo('，'),em('A′(x)=f(x)')),TEXTBOOK_FORMULAS.get('fundamental').body));
TM('double','二重积分与矩形区域上的累次积分',formulaRows(TEXTBOOK_FORMULAS.get('double').body,mr(mt('矩形区域：'),em('M='),`<msubsup>${mo('∫')}${mi('a')}${mi('b')}</msubsup>`,fence(mr(`<msubsup>${mo('∫')}${mi('c')}${mi('d')}</msubsup>`,em('ρ(x,y)dy')),'[',']'),em('dx'))));
TM('series','等比级数的有限和与收敛后的无穷和',formulaRows(TEXTBOOK_FORMULAS.get('series').body,mr(`<munderover>${mo('∑')}${em('n=0')}${mo('∞')}</munderover>`,em('qⁿ='),mf(em('1'),em('1−q')),mo('，'),em('|q|<1'))));
TM('mean-value','拉格朗日与柯西中值定理',formulaRows(TEXTBOOK_FORMULAS.get('mean-value').body,mr(mt('柯西形式：'),em('Δf·g′(ξ)=Δg·f′(ξ)'))));
TM('rank','方程组有解和唯一解的秩判据',formulaRows(TEXTBOOK_FORMULAS.get('rank').body,mr(mt('唯一解：'),em('r(A)=r([A|b])=n'))));
TM('cross','向量积的行列式记法、分量与模',formulaRows(TEXTBOOK_FORMULAS.get('cross').body,mr(vec('a'),mo('×'),vec('b'),mo('='),matrixML([['a₂b₃−a₃b₂'],['a₃b₁−a₁b₃'],['a₁b₂−a₂b₁']])),em('‖a×b‖=‖a‖‖b‖sin θ')));
TM('mixed-product','混合积与体积',formulaRows(TEXTBOOK_FORMULAS.get('mixed-product').body,em('V=|[a,b,c]|')));
function textbookFormula(l,g){const f=TEXTBOOK_FORMULAS.get(l.id);if(f)return nativeMath(f.source,true,f.body);return textbookText(g.expression);}
function applyTextbookNotation(){
 for(const id of ['cofactor','adjugate']){const g=BEGINNER_GUIDES.get(id);g.expression=g.expression.replaceAll('Cᵢⱼ','Aᵢⱼ');g.symbols=g.symbols.map(([s,d])=>[s==='Cᵢⱼ'?'Aᵢⱼ':s,d.replace('有的资料记作 Aᵢⱼ','其他资料也可能记作 Cᵢⱼ')]);g.example=g.example.map(s=>s.replaceAll('C₁₂','A₁₂'));}
 BEGINNER_GUIDES.get('cross').symbols.push(['i、j、k（上带箭头）','沿 x、y、z 三轴正方向的单位向量；用行列式记法展开时，第一行的向量保留为结果方向。']);
 LESSONS.find(l=>l.id==='dot').title='数量积（点积）与夹角';LESSONS.find(l=>l.id==='cross').title='向量积（叉积）与面积';
 BEGINNER_GUIDES.get('rank').symbols.push(['r(A)','矩阵 A 的秩，与 rank A 含义相同；本课试卷常用 r(A)。']);
 BEGINNER_GUIDES.get('lhopital').symbols.push(['a','公式中输入趋近的位置；若讨论无穷远，应把趋近方向相应改成正无穷或负无穷。']);
 BEGINNER_GUIDES.get('vector').symbols.push(['|v|（v 上带箭头）','试卷中常用来表示向量的模，也就是本页的长度 ‖v‖；与方阵两侧竖线表示行列式的语境不同。']);
 BEGINNER_GUIDES.get('basis').symbols.push(['极大线性无关组','从给定向量组中选出线性无关的一部分，且其余原向量都能由这一部分表示；它构成原向量组张成空间的一组基。']);
}
function mathWritingNote(l){
 if(['determinant','cofactor'].includes(l.id))return `<div class="math-writing-note">两侧竖线表示行列式，结果是一个数。小写 ${nativeMath('aᵢⱼ')} 是第 i 行第 j 列的元素。${l.id==='cofactor'?`大写 ${nativeMath('Aᵢⱼ')} 是该元素的代数余子式。`:''}</div>`;
 if(l.id==='matrix-basic')return '<div class="math-writing-note">本页先读行数、列数和元素位置。m×n 表示 m 行 n 列，共有 mn 个元素。</div>';
 if(l.id==='matrix-addition')return '<div class="math-writing-note">加法和减法按对应位置计算；数乘把每个元素乘同一个数。</div>';
 if(l.id==='matrix-transpose')return `<div class="math-writing-note">转置 ${nativeMath('Aᵀ')} 把行列位置互换，元素数值不变。这是位置重排，不是矩阵乘法。</div>`;
 if(!['determinant','matrix-basic','matrix','cofactor','adjugate','inverse'].includes(l.id))return '';
 return `<div class="math-writing-note"><strong>试卷上的写法：</strong>${nativeMath('矩阵 A',false,mr(mi('A'),mo('='),matrixML([['a','b'],['c','d']])))} 是矩阵；${nativeMath('行列式 |A|',false,mr(mo('|'),mi('A'),mo('|'),mo('='),matrixML([['a','b'],['c','d']],true)))} 是它的行列式，算出的是一个数。小写 ${nativeMath('a下标ij',false,mb(mi('a'),em('ij')))} 表示元素，大写 ${nativeMath('A下标ij',false,mb(mi('A'),em('ij')))} 常表示该元素的代数余子式；${nativeMath('A星',false,ms(mi('A'),mo('*')))} 表示伴随矩阵，${nativeMath('A转置',false,ms(mi('A'),mi('T')))} 表示转置。</div>`;
}
function typesetTextbook(root){
 if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
 while(walker.nextNode()){const node=walker.currentNode;if(!node.nodeValue?.trim()||node.parentElement?.closest('math,svg,script,style,pre,code,select,option,input,textarea,.source-links,.source-note,.crumb,.topline,.eyebrow,.practice-heading,.practice-hint,.practice-number,.practice-result,.label,.pill,.badge,.course-tabs,.paper-image-wrap'))continue;nodes.push(node);}
 for(const node of nodes){const raw=node.nodeValue,html=textbookText(raw);if(!html.includes('<math'))continue;const template=document.createElement('template');template.innerHTML=html;node.replaceWith(template.content);}
}
function isTextbookRoute(){const [page,id]=location.hash.slice(1).split('/');return page.startsWith('math-')||page==='course'&&['calculus','algebra'].includes(id)||['lesson','math-focus'].includes(page)&&LESSONS.some(l=>l.id===id&&l.mathStudy);}
