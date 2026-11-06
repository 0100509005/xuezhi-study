// Common-misconception distractors. Each numerical alternative represents a named mistake.
const DISTRACTOR_REVISION=1;
function misconceptionQuestion(prompt,right,errors,explanation,skill='计算应用'){
 const correct=String(right),seen=new Set([correct]),wrong=[];
 for(const [value,reason] of errors){const text=String(value);if(!seen.has(text)){seen.add(text);wrong.push([text,reason]);}}
 if(wrong.length<2)throw Error('Not enough distinct misconception choices: '+prompt);
 const chosen=wrong.slice(0,3);return {...question(prompt,correct,chosen.map(x=>x[0]),explanation+' 常见误区：'+chosen.map(([value,reason])=>`${value}：${reason}`).join('；')+'。',skill),distractorRevision:DISTRACTOR_REVISION};
}
const mq=(p,a,errors,e)=>misconceptionQuestion(p,pretty(a),errors.map(([v,why])=>[pretty(v),why]),e);
function replaceFactory(id,index,fn){const entry=PRACTICE_TOPICS.get(id);if(!entry)throw Error('Unknown practice point '+id);entry.factories[index]=fn;}
for(const [index,k] of [[1,2],[2,3]])replaceFactory('det-properties',index,r=>{const d=r.int(2,15);return mq(`二阶行列式 D=${d}，全部元素都乘 ${k} 后，新行列式为多少？`,k*k*d,[[k*d,'只按一行乘倍数处理'],[d,'误认为所有数同比例变化不影响行列式'],[-k*k*d,'误把数乘当成交换两行']],`两行都乘 ${k}，总倍率为 ${k}²，所以新值为 ${k*k}×${d}=${k*k*d}。`);});
replaceFactory('determinant',1,r=>{const a=r.int(2,5),b=r.int(1,3),c=r.int(1,3),d=r.int(6,9),ad=a*d,bc=b*c;return mq(`计算二阶行列式 |[[${a},${b}],[${c},${d}]]|。`,ad-bc,[[ad+bc,'把对角线两项相减误写成相加'],[bc-ad,'把相减顺序颠倒'],[ad,'漏掉另一条对角线的乘积']],`按左上乘右下减右上乘左下：${a}×${d}−${b}×${c}=${ad-bc}。`);});
replaceFactory('limit',0,r=>{const a=r.int(2,9);return mq(`当 x→${a} 时，(x²−${a*a})/(x−${a}) 的极限是多少？`,2*a,[[a,'约分后漏掉一个常数项'],[0,'把分子趋于零当作整个商趋于零'],[a*a,'只代入分子中的平方项']],`x≠${a} 时约为 x+${a}，趋近 ${a} 时得 ${2*a}；0/0 本身不表示极限为 0。`);});
replaceFactory('derivative',0,r=>{const a=r.int(2,6),x=r.int(2,5),b=r.int(1,6),correct=2*a*x;return mq(`f(x)=${a}x²+${b}，求 f′(${x})。`,correct,[[a*x,'求导时漏乘原指数 2'],[correct+b,'误把常数项的导数当作常数本身'],[2*a,'求出导函数后漏代入指定点']],`f′(x)=${2*a}x；常数项导数为 0，代入 x=${x} 得 ${correct}。`);});
replaceFactory('chain',1,r=>{const a=r.int(2,8);return mq(`y=(${a}x+1)³，求 y′(0)。`,3*a,[[3,'漏乘内层导数'],[a,'只求内层导数'],[a*a*3,'把内层导数多乘一次']],`y′=3(${a}x+1)²·${a}，代入 0 得 ${3*a}。`);});
replaceFactory('integral',1,r=>{const a=r.int(2,7),w=r.int(2,6),v=a*w;return mq(`速度保持 ${a} 米/秒，持续 ${w} 秒，位移是多少米？`,v,[[a,'只写速度，漏乘时间'],[w,'只写时间，漏乘速度'],[a*w/2,'误将恒定速度当成从零线性增长'],[a*w*w,'把时间重复乘了一次']],`恒定速度的位移=速度×时间=${a}×${w}=${v} 米。`);});
replaceFactory('fundamental',0,r=>{const a=r.int(2,5),b=a+r.int(1,5),answer=b*b-a*a;return mq(`∫_${a}^${b} 2x dx 等于多少？`,answer,[[a*a-b*b,'把上下限代入顺序颠倒'],[b*b,'只代上限，漏减下限'],[b*b+a*a,'误将上下限结果相加']],`原函数为 x²，必须用上限值减下限值，即 ${b}²−${a}²=${answer}。`);});
replaceFactory('ct-quantum-numbers',2,r=>{const n=r.int(3,6),l=r.int(1,n-1),orb=2*l+1;return mq(`某亚层 n=${n}、l=${l}，最多容纳多少电子？`,2*orb,[[orb,'只数轨道，忘记每个轨道可容纳两个电子'],[2*n*n,'误用整个电子层容量'],[2*l+1+2,'把每轨道两个电子误加而非相乘']],`该亚层有 2l+1=${orb} 个轨道，每个最多容纳两个电子，因此为 ${2*orb}。`);});
replaceFactory('ct-bond-order',1,r=>{const nb=r.int(6,10)*2,na=r.int(1,4)*2;return mq(`分子轨道模型有 ${nb} 个成键电子、${na} 个反键电子，键级为？`,(nb-na)/2,[[nb-na,'忘记除以 2'],[(nb+na)/2,'把成键和反键电子数相加'],[nb/2,'漏减反键电子']],`键级=(成键电子数−反键电子数)/2=(${nb}−${na})/2=${(nb-na)/2}。`);});
replaceFactory('ct-molality',2,r=>{const n=r.int(2,6)/10,kg=.5;return mq(`${n} mol 溶质溶于 500 g 水，质量摩尔浓度 b 为多少 mol/kg？`,n/kg,[[n/500,'把 500 g 当成 500 kg 使用'],[n,'误用 1 kg 作溶剂质量'],[n*kg,'把物质的量与溶剂质量相乘']],`b=n溶质/m溶剂；500 g=0.500 kg，所以 b=${n}/0.500=${pretty(n/kg)} mol/kg。`);});
replaceFactory('ct-osmotic-pressure',1,r=>{const i=r.int(2,3),c=r.int(2,5),base=8.314*300,v=i*c*base;return mq(`理想稀溶液 i=${i}、c=${c} mol/m³、T=300 K，R=8.314 J/(mol·K)，渗透压约多少 Pa？`,v,[[c*base,'漏乘范特霍夫因子 i'],[i*base,'漏乘浓度 c'],[v/1000,'把 Pa 的数值换成 kPa 后仍标为 Pa']],`π=icRT=${i}×${c}×8.314×300=${pretty(v)} Pa。`);});
replaceFactory('ct-boiling-elevation',2,r=>{const d=r.int(1,8)/10;return mq(`同外压纯水凝固点 0 ℃，溶液凝固点降低 ${d} K，溶液凝固点为多少 ℃？`,-d,[[d,'误把降低量加到原凝固点'],[0,'将降低量忽略'],[273.15-d,'得到开尔文读数却误标为摄氏度']],`溶液凝固点=0−${d}=${-d} ℃；温差 1 K 等于温差 1 ℃。`);});
replaceFactory('ct-partial-pressure',1,r=>{const p=r.int(10,20)*10,x=r.pick([.2,.3,.4]);return mq(`理想混合气总压 ${p} kPa，某组分摩尔分数 ${x}，其分压多少 kPa？`,p*x,[[p*(1-x),'误用其他组分的摩尔分数'],[p,'把总压直接当成该组分分压'],[p/x,'将相乘误写成相除']],`道尔顿分压定律：pᵢ=xᵢp总=${x}×${p}=${pretty(p*x)} kPa。`);});
replaceFactory('cs-units',0,r=>{const n=r.int(3,15);return mq(`${n} Byte 等于多少 bit？`,8*n,[[n,'误认为 1 Byte 等于 1 bit'],[n/8,'把字节转位的方向写反'],[n*1024,'混淆 Byte 与 KiB 的换算']],`1 Byte=8 bit，${n} Byte=${8*n} bit。`);});
replaceFactory('cs-units',1,r=>{const n=r.int(2,16);return mq(`理想传输速率 ${n*8} Mb/s，忽略开销，等于多少 MB/s？`,n,[[n*8,'忽略 bit 与 Byte 的大小写'],[n*64,'将位速率换成字节速率时误乘 8'],[n/8,'重复除以 8']],`1 Byte=8 bit，所以 ${n*8} Mb/s÷8=${n} MB/s。`);});
replaceFactory('cs-twos',1,r=>{const n=r.int(4,8),v=2**(n-1);return mq(`${n} 位补码可表示的最小整数是多少？`,-v,[[1-v,'把最小值误当作最大值的相反数'],[-(2**n),'没有给符号留出位宽'],[-v+2,'误认为还有正负两个零占据范围']],`${n} 位补码范围为 −2^(${n}−1) 至 2^(${n}−1)−1；最小值为 −${v}。`);});
replaceFactory('ct-quantum-numbers',0,variants(['下列对量子数的描述，哪一项正确？','n 标记电子层，l 标记亚层，mₗ 区分轨道状态','n 决定轨道形状，l 决定电子层','mₗ 只有正负两个取值，表示自旋方向','n 是主量子数，l 是角量子数，mₗ 是磁量子数；自旋投影由 mₛ 标记。'],['已知 n=2，角量子数 l 可以取哪些值？','0、1','1、2','0、1、2','l 取 0 到 n−1 的整数；n=2 时不能取 2。']));
replaceFactory('ct-molality',0,variants(['质量摩尔浓度 b 的定义是什么？','溶质的物质的量除以溶剂质量（kg）','溶质的物质的量除以溶液体积（L）','溶质质量除以溶液总质量','b=n溶质/m溶剂，常用 mol/kg；另外两项分别对应物质的量浓度和质量分数。']));
replaceFactory('ct-osmotic-pressure',0,variants(['理想稀溶液的渗透压 π=icRT 中，c 通常表示什么？','溶质的物质的量浓度','溶质质量分数','溶剂的质量摩尔浓度','这里 c 是溶质物质的量除以溶液体积；代入 R 时需配套单位。']));
replaceFactory('ct-hybrid-orbital',0,variants(['关于杂化前后的轨道数，哪项正确？','参与杂化的原子轨道数等于产生的杂化轨道数','产生的杂化轨道数等于参与杂化的电子数','只要含一个 s 轨道就只能得到一个杂化轨道','例如一个 s 与三个 p 轨道产生四个 sp³ 杂化轨道。']));
replaceFactory('ct-partial-pressure',0,variants(['理想混合气的某组分分压如何计算？','该组分摩尔分数乘总压','该组分质量分数乘总压','总压除以该组分摩尔分数','pᵢ=xᵢp总，其中 xᵢ 是物质的量分数，不是质量分数。']));
