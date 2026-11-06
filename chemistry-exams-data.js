const CHEM_EXAM_PAPERS=[
 {id:'mid2020',year:'2020—2021',semester:'第二学期',type:'期中',from:2,to:6,answerFrom:7,answerTo:12},
 {id:'mid2018',year:'2018—2019',semester:'第一学期',type:'期中',from:13,to:18,answerFrom:19,answerTo:23},
 {id:'mid2015',year:'2015—2016',semester:'第一学期',type:'期中',from:24,to:30,answerFrom:31,answerTo:35},
 {id:'final2016',year:'2016—2017',semester:'第一学期',type:'期末',from:36,to:43,answerFrom:44,answerTo:50},
 {id:'final2015',year:'2015—2016',semester:'第一学期',type:'期末',from:51,to:60,answerFrom:61,answerTo:67},
 {id:'final2014',year:'2014—2015',semester:'第一学期',type:'期末',from:68,to:74,answerFrom:75,answerTo:80}
];
const CHEM_SOURCE_ISSUES=[
 {kind:'guide',page:4,text:'角量子数一段写成“n值决定电子角动量”，这里应辨认 l；n 与 l 的作用在软件中分开解释。'},
 {kind:'guide',page:8,text:'F₂ 一行写“不含单电子”却又写“顺磁性”，相互矛盾；基态 F₂ 电子配对，应为抗磁性。'},
 {kind:'guide',page:30,text:'法拉第常数单位应为 C/mol，不是 ℃/mol；−nFE 中 n 是所写反应的电子计量数，无量纲。'},
 {kind:'exam',page:46,text:'填空第1题的 n=2 对应第二电子层（L 层），原答案写成 M 层有误；应以 n 的定义判定。'},
 {kind:'exam',page:77,text:'选择第10题参考答案字母与解析不一致：析氢、吸氧是阴极还原过程，原题应选 B；不按原答案 C 自动判分。'},
 {kind:'exam',page:78,text:'填空第6题 ΔT_f=1.86 K；水的凝固点基准约 0℃，故溶液为 −1.86℃，原答案 98.14℃ 误用了 100℃。题干未说明电解质，本软件改编题明确按难挥发非电解质计算。'}
];
const CHEM_EXAM_QUESTIONS=[];
function examChoice(paper,page,answerPage,number,terms,prompt,options,answer,explanation,adapted=''){
 const id=paper+'-'+number.replace(/[^a-z0-9]/gi,'');
 if(CHEM_EXAM_QUESTIONS.some(q=>q.id===id))throw new Error('Duplicate exam question '+id);
 CHEM_EXAM_QUESTIONS.push({id,paper,page,answerPage,number,terms:terms.split(' '),prompt,options,answer,explanation,adapted});
}
function examJudge(paper,page,answerPage,n,terms,prompt,right,why,adapted=''){
 examChoice(paper,page,answerPage,'J'+n,terms,prompt,['正确','错误'],right?0:1,why,adapted);
}
examJudge('mid2020',2,7,1,'osmotic-pressure vanthoff-factor electrolyte','Na₂SO₄ 溶液是强电解质溶液，不会产生渗透压。',false,'强电解质同样产生渗透压；稀溶液可用有效粒子浓度修正后的 π=icRT 理解。');
examJudge('mid2020',2,7,3,'intermolecular-forces covalent-polarity','CO₂ 分子间只存在色散力。',true,'按本课程常用分子间力分类，CO₂ 是非极性分子，其分子间不计永久偶极取向力；注意每个 C=O 键仍有极性。');
examJudge('mid2020',2,7,4,'standard-state formation-combustion entropy-laws','298 K、100 kPa 下，石墨的标准摩尔生成焓、标准摩尔生成吉布斯能和标准摩尔熵均为零。',false,'参考态单质的前两种生成量按约定为零，但常温标准摩尔熵不为零；第三定律的零熵基准不能搬到 298 K。');
examJudge('mid2020',2,7,5,'crystal-types','分子晶体由非极性分子组成，因此具有较低的熔点和沸点。',false,'分子晶体也可由极性分子组成；“分子晶体”按组成粒子与主要作用力分类，不等于“非极性分子”。');
examJudge('mid2020',2,7,6,'quantum-numbers','根据量子力学理论，原子核外电子的运动状态须由 n、l、m、mₛ 四个量子数确定。',true,'按课程原子轨道模型，前三个标记空间轨道，mₛ 再标记自旋状态。原题 m 指磁量子数 mₗ，不是质量。');
examChoice('mid2020',2,7,'C1','system-types','下列属于封闭体系的是？',['试管内进行的 CO 还原 CuO 反应','烧杯内进行的锌与盐酸反应','密闭容器中进行的金属腐蚀反应','敞口保温瓶中进行的硫升华反应'],2,'封闭体系不与环境交换物质，但可以交换能量；此题按原卷容器描述判断，密闭容器符合。');
examJudge('mid2018',13,19,4,'dipole covalent-polarity','通过极性键构成的多原子分子一定是极性分子。',false,'CO₂ 的两条极性键按直线对称排布，键偶极可抵消；要看整个分子的电荷分布和几何。');
examJudge('mid2018',13,19,5,'quantum-numbers','量子数 n 与 l 决定了原子轨道的能量与取向。',false,'空间状态还要用 mₗ 区分，不能用 n、l 两个编号包办取向；氢样模型能量仅由 n 决定。');
examJudge('mid2018',13,19,6,'standard-state','气体物质的标准状态是该气体处于 298 K 和 100 kPa 下的状态。',false,'标准压力通常为 100 kPa，标准态的温度另行指定，不能自动固定 298 K。');
examJudge('mid2018',13,19,7,'entropy-laws','298 K 时，完美晶体的标准摩尔熵值为 0。',false,'第三定律的零熵基准对应完美晶体在 0 K 的条件，而不是 298 K。');
examJudge('mid2015',24,31,3,'ground-excited degeneracy','对氢原子来说，其原子能级顺序为 1s<2s<2p<3s<3p<4s<3d。',false,'简单氢样模型中同 n 的能级等能：2s=2p，3s=3p=3d；不能把多电子原子的近似填充顺序套给氢。');
examJudge('mid2015',24,31,5,'raoult mole-fraction','同温下，难挥发非电解质的理想稀溶液蒸气压降低量与溶质摩尔分数成正比。',true,'拉乌尔关系 p_A=x_Ap_A*，二元溶液 x_A=1−x_B，故 Δp=p_A*x_B。','由原判断第5题补足理想稀溶液、难挥发非电解质及同温条件。');
examJudge('mid2015',24,31,6,'boiling-elevation molality','在同重量的两份水中，分别加入等物质的量的甘油和蔗糖形成两份稀溶液，则这两份溶液的沸点一定相同。',true,'在题设稀溶液依数性近似下，两种溶质都按非电解质处理，溶质 mol 数与溶剂 kg 数相同，b 相同，沸点升高量相同。此结论有稀溶液模型条件。');
examJudge('mid2015',24,31,7,'entropy-laws formation-combustion','稳定单质在 100 kPa、298.15 K 时的标准摩尔生成焓和标准摩尔熵均为 0。',false,'参考态单质的标准生成焓可按约定取零，标准摩尔熵通常不为零，不能混用两种量。');
examJudge('mid2015',24,31,8,'gibbs reaction-free-energy','等温等压条件下，用标准摩尔反应吉布斯能 ΔrG° 可判断任何实际组成下反应自发进行的方向。',false,'实际方向看 ΔrG=ΔrG°+RTlnQ；只有相应标准组成等条件下，才能不加组成修正直接用标准值。','将原题符号明确排为 ΔrG°，并把“任何反应”展开为实际组成条件。');
examChoice('mid2015',24,31,'C1','electron-domain molecular-shapes','价层电子对互斥理论认为，SF₄ 分子的空间构型是？',['变形四面体（跷跷板形）','三角锥形','平面三角形','正四面体'],0,'中心硫有五个电子域，四个成键方向加一对孤电子；从三角双锥电子域布局去掉孤对方向，得到跷跷板形。');
examJudge('final2016',36,44,2,'atomic-radius','C、Mg、Si 按原子半径由大到小排列，顺序是 Mg>Si>C。',true,'按常见周期趋势，同周期从左向右半径总体减小，同族向下总体增大；此组给出的次序符合。');
examJudge('final2016',36,44,4,'osmotic-pressure','土壤中 NaCl 含量高时植物难以生存，这与稀溶液的蒸气压下降性质有关。',false,'此题要辨认渗透：外部盐溶液渗透压过高，细胞难以吸水甚至失水，不能把直接机制说成蒸气压下降。');
examJudge('final2016',36,44,5,'colloid-types aggregation','憎液溶胶是多相分散的热力学稳定体系。',false,'憎液溶胶通常热力学不稳定，可以因聚集障碍而在观察期内动力学稳定；两种“稳定”不同。','原判断第5题的“溶胶”明确为本课程讨论的憎液溶胶。');
examJudge('final2016',36,44,6,'state-function heat-work','G、H、W、V 均为状态函数。',false,'G、H、V 是状态函数；功 W 是过程中的能量传递，取决于途径。');
examJudge('final2016',36,44,8,'catalysis equilibrium-constant','催化剂能改变化学反应速率，但不能改变化学反应的标准平衡常数。',true,'同温度下，催化剂改变反应路径与快慢，不改变相同反应的热力学平衡常数。');
examJudge('final2016',36,44,9,'activation-energy arrhenius','化学反应的活化能是指生成物分子的平均能量与反应物分子的平均能量之差。',false,'反应物与生成物的能量差描述反应能量变化；活化能联系越过反应障碍及速率的温度依赖，不是这两种平均能量之差。');
examJudge('final2016',36,44,10,'weak-dissociation common-ion ph-p-operator','在氨水中加入 NH₄Cl 或 OH⁻ 后，均会导致氨的解离度降低、pH 减小。',false,'两者都可抑制 NH₃·H₂O 的解离，但加入 NH₄Cl 可使 pH 减小，加入 OH⁻ 却使溶液更碱，不能说两者 pH 都减小。');
examChoice('final2016',36,45,'C1','quantum-numbers electron-configuration','描述基态 C 原子中两个 2p 单电子的合理量子数组合是？',['(2,1,−1,+1/2) 与 (2,1,−1,−1/2)','(2,1,0,+1/2) 与 (2,1,−1,−1/2)','(2,1,1,−1/2) 与 (2,1,1,−1/2)','(2,1,0,+1/2) 与 (2,1,1,+1/2)'],3,'基态碳的两个 2p 电子按洪特规则分占不同等能轨道且自旋平行：mₗ 不同，mₛ 相同；还要遵守泡利原理。');
examChoice('final2016',37,45,'C5','corrosion corrosion-protection electrode-potential','为防止铁腐蚀，表面镀锌或锡。已知标准还原电势 E°(Sn²⁺/Sn)>E°(Fe²⁺/Fe)>E°(Zn²⁺/Zn)，镀层破坏后哪种铁皮更易受腐蚀？',['镀锡铁皮','镀锌铁皮','二者同样容易','二者都不会'],0,'破损处形成局部电池：锡比铁更难氧化，铁成为易溶解的阳极；锌则可作牺牲阳极优先氧化。','保留原题条件，将选项短句统一表述。');
examChoice('final2016',37,45,'C6','buffer conjugate-pair','能对少量外加酸或碱起缓冲作用的溶液是？',['HCl 和 NaCl 混合溶液','NaAc 和 HAc 混合溶液','NaOH 和 NH₃·H₂O 混合溶液','HAc 和 NaCl 混合溶液'],1,'HAc 是醋酸，Ac⁻ 是醋酸根；弱酸和其共轭碱同时存在，分别消耗外加碱与酸。');
examChoice('final2016',37,45,'C7','acid-indicator endpoint titration','酸碱滴定选择指示剂时，可以不考虑哪一因素？',['滴定突跃的范围','指示剂的变色范围','指示剂的颜色变化','指示剂分子量的大小'],3,'变色范围应与滴定突跃匹配，色变还应易观察；此题比较的四项中，分子量不是选择指示剂的直接判据。');
examChoice('final2016',38,45,'C10','zeta double-layer','胶体粒子的 ζ 电势是指？',['固体真实表面与本体溶液之间的电势差','固定以紧密层、扩散层分界为唯一测量面时的电势差','整个扩散层只有一个相同的电势','固液间可相对移动的剪切面与本体溶液之间的电势差'],3,'ζ 从剪切面定义，不能直接当真实表面电势；剪切面是随粒子移动液层与外部液体相对滑动的理想边界。','原单选第10题按剪切面定义改写选项，以避免把不同理论分界当成同一个面。');
examJudge('final2015',51,61,1,'ground-excited quantum-numbers','类氢原子的核外电子能量与主量子数 n 和角量子数 l 有关。',false,'在此课程的非相对论氢样模型中，对给定核电荷数 Z，能量仅随 n 变化，同 n 的不同 l 简并。');
examJudge('final2015',51,61,2,'wave-particle wavefunction','原子中核外电子的运动具有波粒二象性，没有经典式的轨道，并需要用统计规律来描述。',true,'现代轨道描述的是量子状态及概率分布，不是电子小球的确定运动路线。');
examJudge('final2015',51,61,5,'hydrogen-bond intermolecular-forces','H₂O 的熔点比 HF 高，所以 O—H···O 氢键的键能比 F—H···F 氢键的键能大。',false,'熔点由整体结构与多种作用共同决定；不能只由熔点排序反推出单个氢键强度。水的氢键网络与数量也重要。');
examJudge('final2015',51,61,6,'heat-work state-function','热和功是系统与环境交换或传递的能量，受过程制约，不是系统自身的性质，所以不是状态函数。',true,'相同初末态可经过不同途径，热和功可不同；系统具有内能，不是“含有一份热和功”。');
examJudge('final2015',51,61,7,'standard-state','在化学热力学中所谓标准条件，是指在 298.15 K 下，各气体分压为标准压力或各溶质浓度为标准浓度。',false,'温度要另行指定；标准态还包含理想性、纯相等具体约定，不能一律限定 298.15 K。');
examJudge('final2015',51,61,8,'enthalpy internal-energy','Q_p、Q_V 之间的换算只适合气相反应，不适合有凝聚相参与的反应。',false,'有凝聚相参与并不自动禁止换算；在相应封闭、仅有体积功及气体理想等近似下，差值中的气相计量变化仍可计算。');
examJudge('final2015',51,61,9,'gibbs entropy-laws','对于一定温反应，如果 ΔH_m>ΔG_m，则该反应必是熵增反应。',true,'恒温关系 ΔG=ΔH−TΔS 给出 ΔH−ΔG=TΔS；在 T>0 且单位、计量一致时，左边为正意味着 ΔS>0。');
examJudge('final2015',51,61,10,'chemical-equilibrium activation-energy','化学平衡是系统中正、逆反应活化能相等的状态。',false,'化学平衡要求正逆反应速率相等，不要求正逆活化能相等。');
examJudge('final2014',68,75,1,'wavefunction atomic-models','原子轨道是指核外电子绕核高速运动时的运动轨迹。',false,'原子轨道是空间量子状态，可用于计算概率分布；“轨迹”是经典小球运动的概念。');
examJudge('final2014',68,75,2,'ground-excited degeneracy','所有原子的原子轨道能级都是主量子数和角量子数共同决定的。',false,'“所有”不成立：简单氢样单电子模型中，对给定 Z 能量仅由 n 决定，同 n 不同 l 等能。');
examJudge('final2014',68,75,3,'ionization-energy','一般说来，第一电离能越大的元素，其金属性越强。',false,'第一电离能越大，移走最易移除的电子越费能；这不支持“金属性越强”，通常趋势反而相反。');
examJudge('final2014',68,75,4,'electron-configuration quantum-numbers','每个原子轨道最多只允许两个电子存在。',true,'同一空间轨道固定 n、l、mₗ，只剩两种 mₛ；泡利原理要求两电子自旋相反。');
examJudge('final2014',68,75,6,'standard-state','热力学标准态是温度 298.15 K、气体分压 100.0 kPa、溶液浓度 1.0 mol/L 的状态。',false,'标准态不固定温度；给出标准压力或标准浓度也不等于已经说清所有标准态约定。');
examJudge('final2014',68,75,7,'sigma-pi valence-bond','p 电子与 p 电子配对形成的化学键可以是 π 键，也可以是 σ 键。',true,'合适取向的 p 轨道可沿键轴端对端形成 σ 键，也可侧向重叠形成 π 键。');
examJudge('final2014',68,75,10,'intermolecular-forces','色散力既存在于非极性分子之间，也存在于极性分子之间。',true,'色散作用来自瞬时电子分布涨落及其相关性，不要求分子有永久偶极。');
examJudge('final2014',68,75,12,'hybrid-orbital electron-domain','NH₃ 分子中采取的是 sp³ 杂化，且四个杂化轨道具有相同的能量。',false,'按该课程的局部杂化模型，三个成键方向与一个孤对方向并不等价，用不等性 sp³ 描述；不能说四个方向全部等价。');
examChoice('final2014',69,77,'C6','kp-kc equilibrium-constant','同温度下，若反应(3)=反应(1)−2×反应(2)，其平衡常数 K₃ 为？',['K₁^(2K₂)','K₁K₂²','K₁/K₂²','K₂²√K₁'],2,'反应(2)先倍乘 2，常数平方；再倒写，取倒数；与反应(1)相加，常数相乘，所以 K₃=K₁/K₂²。');
examChoice('final2014',69,77,'C9','electrode-potential electrical-free-energy','按题设，Sn⁴⁺+2e⁻→Sn²⁺ 的 E°=+1.51 V。反应改为 1/2Sn⁴⁺+e⁻→1/2Sn²⁺，E° 应为多少？',['+0.755 V','+3.02 V','+4.53 V','仍为 +1.51 V'],3,'电势是强度性质，不随反应式系数倍乘而变化。ΔrG° 与电子计量数 n 会同比例变化，−ΔrG°/(nF) 保持不变。1.51 V 仅沿用题给数据。','将原单选第9题化为一个明确的半反应倍乘问题；保留原题给定电势。');
examChoice('final2014',70,77,'F4','first-order','某一级反应的半衰期为 30 天，反应完成 90% 约需多少天？（取整数）',['27 天','60 天','90 天','100 天'],3,'完成 90% 即剩 10%；t=30×ln10/ln2≈99.66 天，取整数为 100 天。','由原填空第4题改为单选，数值未改。');
examChoice('final2014',70,78,'F6','boiling-elevation molality','将 3.0 g、摩尔质量 60.0 g/mol 的难挥发非电解质溶于 50.0 g 水，K_f=1.86 K·kg/mol，按稀溶液模型凝固点约为多少？',['−1.86℃','+1.86℃','98.14℃','0℃'],0,'n=3.0/60.0=0.050 mol；m溶剂=0.0500 kg；b=1.00 mol/kg；ΔT_f=1.86 K。纯水凝固点约 0℃，所以 T_f=0−1.86=−1.86℃。原参考答案用 100−1.86 得 98.14℃，基准有误。','由原填空第6题补明非电解质假设并转为单选；纠正原答案凝固点基准错误。');
function normalizeExamAnswers(raw){
 const clean={};if(!raw||typeof raw!=='object'||Array.isArray(raw))return clean;
 for(const q of CHEM_EXAM_QUESTIONS){const a=raw[q.id];if(a&&Number.isInteger(a.choice)&&a.choice>=0&&a.choice<q.options.length)clean[q.id]={choice:a.choice};}return clean;
}
function normalizeExamLast(raw){
 if(!raw||typeof raw!=='object')return {};
 return Object.fromEntries(CHEM_EXAM_PAPERS.filter(p=>Number.isInteger(raw[p.id])&&raw[p.id]>=p.from&&raw[p.id]<=p.answerTo).map(p=>[p.id,raw[p.id]]));
}

// 新增试卷页码均按各自 PDF 编号。
CHEM_EXAM_PAPERS.unshift({id:'mid2024',year:'2024—2025',semester:'',type:'期中',from:1,to:3,answerFrom:4,answerTo:7,imageFolder:'mid2024'},{id:'mid2023',year:'2023—2024',semester:'',type:'期中',from:1,to:3,answerFrom:4,answerTo:6,imageFolder:'mid2023'});
const NEW_EXAM_NOTES={mid2023:{6:['简答第1题：PF₃ 为四个电子域、三键对一孤对，常用 sp³ 杂化描述；原解析写 sp²，需订正。','计算第3题给出的第三条反应物态和焓值与常见碳还原反应不一致，直接计算不能当作已核实的实际反应；需要向老师核对题面。','计算第4题中 93、40、214 对应的熵单位应为 J/(mol·K)；按 ΔH≈178 kJ/mol、ΔS≈161 J/(mol·K) 估算转变温度约 1106 K。','填空第7题：沸点处可逆汽化时 ΔS=ΔH/T；以气体近似理想并忽略液体体积时，2 mol 的体积功约 −6.20 kJ（采用对体系做功为正）。']},mid2024:{5:['选择第11题题干印为 π2p 与 σ2s 比较，所有列出的分子通常均满足，单选及原答案 D 无法由印刷题干唯一推出；可能原题意是与 σ2p 比较，须向老师核对。'],6:['计算第1题气体名称的印刷字形容易混淆；请对照原卷与原解析核对种类。若忽略反应并按 1∶2∶1 mol 理想气体计算，总压约 149.65 kPa，三种气体的分压依次约 37.4、74.8、37.4 kPa。','计算第2题未给出温度，不能唯一求渗透压；若另假定 298 K 且按题目近似取体积 2 L，π≈13.8 MPa（约 13760 kPa），不是原解析的 13.75 kPa。25% 尿素溶液并不稀，稀溶液公式只作题设近似。'],7:['计算第3题：300 K、p°=100 kPa 时 Q=0.1²/(0.5×1.5³)≈0.00593；ΔrG≈−45.55 kJ/mol。原解析代入式分母括号的位置容易误读，以反应计量数为准。']}};
