// Explicit topic-to-passage mapping; no keyword or exam-frequency promotion.
const CHEM_REVIEW_EVIDENCE=[];
function reviewEvidence(level,ids,from,to,quote,focus){
 for(const id of ids.split(' ')){
  if(!CHEM_TERMS.some(t=>t.id===id))throw new Error('Unknown review topic '+id);
  CHEM_REVIEW_EVIDENCE.push({id,level,from,to,quote,focus:focus||quote.replace(/[（(]重点[)）]/g,'')});
 }
}
reviewEvidence(2,'quantum-numbers',4,4,'1.四个量子数（重点）','四个量子数及取值');
reviewEvidence(2,'ionic-bond ionic-polarization',6,6,'5.离子键（重点）','离子键、晶格能及离子极化');
reviewEvidence(2,'valence-bond sigma-pi bond-parameters hybrid-orbital covalent-polarity',6,7,'6.共价键与分子构型（重点）','共价键特点、类型、键参数与杂化');
reviewEvidence(2,'dipole',7,7,'6.共价键与分子构型（重点）：d) 键矩','该重点小节下的键矩（键偶极矩）；整体分子极性的其他内容另见第11页');
reviewEvidence(2,'molecular-orbital bond-order homonuclear',7,8,'7.分子轨道（重点）','分子轨道、键级及所列双原子分子');
reviewEvidence(2,'electron-domain molecular-shapes',8,9,'8）价层电子对互斥理论（重点）','电子对计数与分子构型');
reviewEvidence(2,'intermolecular-forces',11,11,'3.分子间作用力的特点（重点）','三种分子间力的组成与特点');
reviewEvidence(2,'hydrogen-bond',11,12,'4.氢键（重点）','氢键形成条件、类型与性质影响');
reviewEvidence(2,'ideal-gas',12,12,'1.理想气体状态方程（重点）','理想气体模型与状态方程');
reviewEvidence(2,'partial-pressure',12,12,'4. 分压定律（重点）','分压及其与摩尔分数的关系');
reviewEvidence(2,'colligative-properties raoult',15,15,'4. 难挥发非电解质稀溶液的依数性（重点）','依数性与蒸气压降低');
reviewEvidence(2,'boiling-elevation',15,15,'2）溶液的沸点升高和凝固点下降（重点）','沸点升高、凝固点降低');
reviewEvidence(2,'osmotic-pressure',15,15,'3）溶液的渗透压（重点）','渗透压公式及单位');
reviewEvidence(2,'crystal',16,16,'晶体是内部质点在三维空间成周期性重复排列的固体(重点)','晶体定义与所列特征');
reviewEvidence(2,'crystal-types',16,16,'2.晶体的基本类型(重点)','四类晶体及其作用力');
reviewEvidence(2,'state-function extensive-intensive',17,17,'2．状态和状态函数（重点）','状态函数特征；该小节下的容量、强度性质');
reviewEvidence(2,'thermochemical',20,20,'2、热化学方程式（重点）','热化学方程式的书写与计量');
reviewEvidence(2,'formation-combustion',20,20,'5.标准反应焓（重点）','用生成焓、燃烧焓计算反应焓；本条为重点覆盖部分');
reviewEvidence(2,'entropy-laws',22,22,'4．化学反应的熵变(重点)','标准摩尔熵与反应熵变计算；不将整页所有第三定律知识都算重点');
reviewEvidence(2,'gibbs',22,22,'3．Gibbs函数判据(重点)','恒温恒压等条件下的自由能判据');
reviewEvidence(2,'reaction-free-energy',23,25,'标准生成Gibbs函数变(重点)；化学反应的Gibbs函数变的计算(重点)','生成自由能、反应自由能与非标准组成修正');
reviewEvidence(2,'equilibrium-constant',24,26,'反应商：(重点)；标准平衡常数(重点)','反应商、标准平衡常数及与标准自由能的关系');
reviewEvidence(2,'equilibrium-shift',26,27,'浓度、压强及温度对化学平衡的影响(重点)','扰动、反应商比较与平衡方向');
reviewEvidence(2,'kp-kc',27,27,'2.多重平衡法则(重点)','反应倒写、倍乘、加减与平衡常数；Kp/Kc 定义本身另见第24页');
reviewEvidence(2,'vanthoff-equilibrium',26,27,'4.范特霍夫方程式(重点)','温度与平衡常数的计算');
reviewEvidence(2,'conversion weak-dissociation',28,28,'2.解离度 (重点)；6.弱酸、弱碱的解离平衡(重点)','解离度与一元弱酸弱碱平衡；转化率的一般内容未单列重点');
reviewEvidence(2,'polyprotic-acid',28,28,'6.弱酸、弱碱的解离平衡(重点)：2)多元弱酸碱','多元弱酸碱逐级解离；盐水解未在此单独强调');
reviewEvidence(2,'electrode-potential emf',30,30,'3、电极电势(重点)','电极电势与电池电动势之差；负载端电压不是该标记的范围');
reviewEvidence(2,'nernst',30,31,'4、能斯特方程(重点)','非标准电势与组成影响');
reviewEvidence(2,'electrical-free-energy',31,31,'5、计算标准电动势公式与推导(重点)','电动势、自由能、平衡常数与电子计量数');
reviewEvidence(2,'electrolysis-products',31,31,'7、电解物的判断(重点)','电极材料与电解产物判断');
reviewEvidence(2,'corrosion-protection',31,31,'8、电化学保护法(重点)','牺牲阳极、外加电流与钝化保护');
reviewEvidence(2,'rate-law',32,32,'质量作用定律与反应速率方程式(重点)；反应级数 (重点)','速率式及反应级数的含义');
reviewEvidence(2,'zero-order first-order second-order',32,33,'3）反应级数 (重点)','零、一、二级的定义与判定；资料另列零、一级计算，未列一般二级积分计算');
reviewEvidence(2,'arrhenius activation-energy',33,34,'阿仑尼乌斯(Arrhenius)公式(重点)；5）计算(重点)','阿伦尼乌斯式及 Ea、k 的计算；不将所有过渡态理论都算重点');
reviewEvidence(2,'colloidal-structure double-layer electrokinetics',35,36,'重点是溶胶问题和张力问题，其他部分考的内容并不多','第35页溶胶结构、紧密/扩散层与电泳方向；不扩展到本页未讲的其他电动现象');
reviewEvidence(2,'surface-energy wetting laplace-pressure capillary',35,36,'重点是溶胶问题和张力问题，其他部分考的内容并不多','第35—36页表面张力、杨氏方程、附加压强和毛细管现象');

reviewEvidence(1,'wavefunction probability-density',4,4,'2.原子轨道：1）电子云；2）原子轨道的形状','波函数、电子云与概率密度；未明确标重点');
reviewEvidence(1,'degeneracy',4,5,'等价轨道；3）多电子原子轨道能级','等价轨道和能级；未独立标重点');
reviewEvidence(1,'shielding penetration electron-configuration atomic-radius',5,5,'屏蔽效应；钻穿效应；电子排布与周期性；原子半径','正文分别提及，未标重点');
reviewEvidence(1,'ionization-energy electron-affinity electronegativity oxidation-state',5,6,'电离能；电子亲和能；原子电负性；氧化值','正文分别提及，未标重点');
reviewEvidence(1,'dipole',7,11,'键矩；分子的极性；三类分子偶极','分子极性和偶极描述；未独立标重点');
reviewEvidence(1,'coordinate-bond ligand coordination-number',9,10,'9）配合物：组成、配位体、配位数、配离子电荷','配合物组成及计数；未标重点');
reviewEvidence(1,'gas-laws',12,12,'2.化合体积定律；3.阿伏伽德罗定律','上述两条气体规律；并未提到本知识点的所有气体定律');
reviewEvidence(1,'partial-volume speed-distribution kinetic-energy',13,13,'5.分体积定律；6.速率分布与能量分布','正文提及对应主题；未标重点');
reviewEvidence(1,'evaporation vapor-pressure boiling-point melting-freezing supercooling phase-diagram triple-point critical-point',13,13,'2.3 液体：液化、蒸发、蒸气压、沸腾、凝固、水的相图','正文提及这些液体、相图概念；未标重点');
reviewEvidence(1,'dynamic-equilibrium',13,13,'蒸发速率与蒸气的凝结速率相等时，气、液两相达到平衡','相变平衡语境，未单列重点');
reviewEvidence(1,'dispersion phase solution mass-fraction mole-fraction molality molarity',14,14,'2.4 溶液：分散系统、相、溶液、浓度的表示方法','正文分别定义或提及，未标重点');
reviewEvidence(1,'vanthoff-factor',15,15,'5.电解质溶液的依数性：需要乘一个校正系数','校正因子这一部分被提及，未标重点');
reviewEvidence(1,'unit-cell',16,16,'排列在晶格结点上','只提及晶格；晶胞参数和晶系没有在资料中展开');
reviewEvidence(1,'system-environment system-types thermo-process reversible',17,17,'系统与环境；过程与途径；恒温、恒压、恒容、可逆过程','正文分别提及，未标重点');
reviewEvidence(1,'internal-energy heat-work enthalpy',18,19,'热力学第一定律；功和热；焓与Hess定律','相关定义与计算关系，未标重点');
reviewEvidence(1,'standard-state',19,20,'1、热力学标准态','正文定义并强调温度另行给出，未标重点');
reviewEvidence(1,'hess spontaneity entropy-microstates',21,21,'6.Hess定律；自发过程；混乱度与熵','对应正文主题，未标重点');
reviewEvidence(1,'transition-temperature',23,23,'Gibbs函数的应用：3.估计反应进行的温度','应用中提及温度估计，未标重点');
reviewEvidence(1,'chemical-equilibrium',24,24,'1、了解化学平衡的基本特征','化学平衡与动态特征，未标重点');
reviewEvidence(1,'electrolyte ionic-strength acid-base-theories',28,28,'影响电解质溶液导电能力的因素；离子强度；酸碱理论','正文提及，未标重点');
reviewEvidence(1,'common-ion buffer titration acid-indicator argentometry solubility',28,29,'同离子效应；缓冲溶液；酸碱滴定；沉淀滴定与盐效应','相关部分被提及，未标重点；未自动覆盖所有沉淀和溶度积公式');
reviewEvidence(1,'half-reaction electrode-types cell-notation reference-electrode',30,30,'半反应的配平；电极的种类；参考氢电极','正文定义或示例中出现，未独立标重点');
reviewEvidence(1,'electrolysis',31,31,'7、电解物的判断','提及电解这一过程；分解电压和超电势未在此列为重点');
reviewEvidence(1,'reaction-rate reaction-extent elementary-mechanism',32,32,'化学反应速率的概念；反应进度公式；基元反应','正文提及，未独立标重点');
reviewEvidence(1,'collision',33,33,'1）自由碰撞理论','碰撞与活化分子描述，未标重点');
reviewEvidence(1,'catalysis photochemistry',34,34,'催化剂对反应速率的影响；几种特殊化学反应：链反应、光化学反应','正文提及，未标重点');
reviewEvidence(1,'ground-excited',5,6,'基态气相原子','电离能定义中提及基态；氢样能级模型未在资料中独立展开');
reviewEvidence(1,'lewis-structure',9,9,'中心原子的孤电子对数','提及孤电子对计数；未展开路易斯结构或八隅体');
reviewEvidence(1,'viscosity latent-heat',11,12,'粘度、溶解度、表面张力、气化热等理化性质','在性质影响列表中提到黏度、气化热；未将热容等本页其他内容列为重点');
reviewEvidence(1,'metal-band',16,16,'金属晶体是通过金属键形成的晶体','只提及金属键；能带、价带、导带没有在资料中展开');
reviewEvidence(1,'galvanic-cell electrode-names',31,31,'牺牲阳极法（原电池，保护阴极材料）','保护方法中提及原电池、阳极和阴极；这些独立概念未另行标重点');

const CHEM_REVIEW_PRIORITY=new Map();
for(const evidence of CHEM_REVIEW_EVIDENCE){
 const old=CHEM_REVIEW_PRIORITY.get(evidence.id);
 if(!old||evidence.level>old.level)CHEM_REVIEW_PRIORITY.set(evidence.id,{level:evidence.level,evidence:[evidence]});
 else if(evidence.level===old.level)old.evidence.push(evidence);
}
function chemPriority(id){return CHEM_REVIEW_PRIORITY.get(id?.replace(/^ct-/,''));}
function chemPriorityBadge(id){const p=chemPriority(id);return p?`<span class="review-priority priority-${p.level}">${p.level===2?'最重要':'次重点'}</span>`:'';}
function chemPriorityHTML(id){const p=chemPriority(id);return p?`<section class="review-evidence" aria-label="复习重点依据">${chemPriorityBadge(id)}<p>${p.level===2?'治学集明确标为重点的覆盖内容':'治学集正文提及、未明确标为重点的覆盖内容'}：</p>${p.evidence.map(e=>`<p><strong>${escapeHTML(e.focus)}</strong><br><span class="condition">依据：“${escapeHTML(e.quote)}” · <a href="#chem-guide/${e.from}">PDF第${e.from}${e.to!==e.from?'—'+e.to:''}页 ↗</a></span></p>`).join('')}<p class="condition">等级仅针对以上覆盖内容；本页其他扩展内容不自动升级。未标等级不等于不考。</p></section>`:'';}
function chemPriorityListEvidence(id){const p=chemPriority(id);return p?p.evidence.map(e=>`<p class="priority-focus">${escapeHTML(e.focus)}<br><span class="condition">依据：${escapeHTML(e.quote)} · <a href="#chem-guide/${e.from}">PDF第${e.from}${e.to!==e.from?'—'+e.to:''}页 ↗</a></span></p>`).join(''):'';}
