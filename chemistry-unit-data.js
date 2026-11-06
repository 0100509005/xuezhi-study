const CHEM_UNIT_CHAPTERS=[[1,'原子结构'],[2,'分子结构'],[3,'宏观物质及其聚集状态'],[4,'化学热力学基础']];
const CHEM_UNIT_PHOTOS={
  1:{6:'104509',7:'104514',8:'104520',9:'104524'},
  2:{17:'104543',18:'104550',19:'104553',20:'104601'},
  3:{33:'104614',34:'104622',35:'104625',36:'104631'},
  4:{49:'104644',50:'104649',51:'104652',52:'104657',53:'104659',54:'104704'}
};
const CHEM_UNIT_QUESTIONS=[];
function addUnit(chapter,page,number,prompt,body,explanation){
  const answerPage=({1:9,2:19,3:35,4:53})[chapter];
  CHEM_UNIT_QUESTIONS.push({id:`unit-${chapter}-${number}`,chapter,number,prompt,explanation,
    sourceTitle:`第 ${chapter} 章 · 教材自测`,page,answerPage,
    sourceURL:`materials/unit-test/${CHEM_UNIT_PHOTOS[chapter][page]}.jpg`,
    answerURL:`materials/unit-test/${CHEM_UNIT_PHOTOS[chapter][answerPage]}.jpg`,...body});
}
function unitJudgments(chapter,page,first,rows){
  rows.trim().split('\n').forEach((row,i)=>{
    const [key,prompt,explanation]=row.split('|');
    addUnit(chapter,page,'J'+(first+i),prompt,{options:['正确','错误'],answers:[key==='+'?0:1]},explanation);
  });
}
function unitChoice(chapter,page,n,prompt,options,key,explanation){
  addUnit(chapter,page,'C'+n,prompt,{options:options.split('|'),answers:[...key].map(c=>c.charCodeAt(0)-65),multiple:true},explanation);
}
function unitFill(chapter,page,n,prompt,blanks,explanation){
  addUnit(chapter,page,'F'+n,prompt,{blanks},explanation);
}
unitJudgments(1,6,1,`
+|主量子数相同的原子轨道不一定属于同一能级组。|多电子原子中，轨道能量还与角量子数有关。
-|3d⁵ 的上标 5 表示轨道数。|上标表示电子数。3d 亚层恰好也有 5 个轨道，这是由 2l+1 决定的。
-|原子形成阳离子时，失电子顺序总与填充顺序相反。|过渡金属通常先失去最外层 ns 电子，例如铁先失去 4s 电子。
-|空间轨道波函数由 n、l、m、mₛ 四个量子数决定。|空间部分只用 n、l、m，自旋另由 mₛ 标记。
+|在本章的轨道模型中，可以用四个量子数标记一个电子的状态。|前三个标记轨道，第四个标记自旋投影。
-|s 区元素除最后填充的 ns 外，其余各电子层都填满。|例如 Na 的 L 层填满，但 K 的 M 层 3d 仍空着。
+|P³⁻、S²⁻、Cl⁻ 的半径依次减小。|三者均有 18 个电子，核电荷依次增大，电子被拉得更紧。
`);
unitJudgments(1,7,8,`
-|原子序数为 28 的基态原子在 M 层有 18 个电子。|Ni 的 M 层为 3s²3p⁶3d⁸，共 16 个。
+|忽略精细结构时，同一种单电子原子或离子的轨道能量只由 n 决定，n 越大能量越高。|能量与 −1/n² 成正比的写法应理解为 E=−常数/n²，因此越接近零越高。
-|n=2 时，角量子数 l 只能取 1。|l 从 0 到 n−1，所以可以取 0 或 1。
-|电子云图记录的是电子走过的路线。|点的疏密反映概率密度。
-|每个电子层最多容纳两个自旋相反的电子。|每个轨道最多两个，整个第 n 层最多 2n² 个。
-|含有 d 电子的元素都属于副族。|例如 Ga 属主族，但内层有 3d 电子。
+|电负性描述成键原子吸引共用电子的能力。|电负性越大，通常越能吸引共用电子。
-|氢原子 1s 的概率密度在核处最大，所以电子距核最可能为零。|求距离分布还要考虑球壳体积。1s 径向概率密度在非零距离取最大值。
-|频率固定时，入射光越强，光电子最大动能越大。|最大动能由光子能量减逸出功决定，光强主要影响电子数。
-|能引发光电效应的光被挡去 90% 后，一定不能再引发光电效应。|剩余光的频率不变，仍可超过阈频。
-|不确定性原理说明任何物理量都不能准确测量。|它限制位置与动量等一对物理量的联合精度。
+|量子力学用概率分布描述电子的位置。|可以预测测量结果的概率。
+|单个光子的能量与频率成正比。|E=hν，h 为普朗克常量。
-|3s 和 4s 的电子云界面完全一样。|两者都呈球对称，但径向节点和分布范围不同。
-|任意原子的 4s 轨道都比 3d 轨道能量低。|能量次序随原子和电子占据情况变化。
-|H 和 He 都有 1s 电子，因此两者的 1s 能量相同。|核电荷和电子间相互作用不同。
-|基态原子一定严格按鲍林近似能级表填充。|近似顺序存在例外，例如 Cr。
-|只有 f 区元素含有 f 电子。|例如 Au 有填满的 4f 内层。
`);
unitChoice(1,7,1,'哪些量子数 (n, l, m, mₛ) 组合允许出现？','(2, 3, 1, +½)|(2, 1, −1, −½)|(1, 0, 0, +½)|(3, 1, 2, +½)','BC','先检查 0≤l<n，再检查 −l≤m≤l，最后检查 mₛ=±½。');
unitChoice(1,7,4,'n=4 的电子层一共有多少个空间轨道？','32|16|8|4','B','s、p、d、f 亚层分别有 1、3、5、7 个轨道，加起来是 16。');
unitChoice(1,7,7,'哪些亚层允许存在？','3p|2d|4f|3f','AC','d 对应 l=2，至少 n=3。f 对应 l=3，至少 n=4。');
unitFill(1,9,6,'固定主量子数 n=4，一个电子有多少种可能的状态？',[cb('状态数','32','16|8|4')],'16 个空间轨道，每个有两种自旋投影。');
unitFill(1,9,13,'由主量子数 n 和角量子数 l 写出亚层符号。',[cb('n=3，l=2','3d','3p|2d|3f'),cb('n=4，l=0','4s','4p|3s|4d')],'数字来自 n，字母由 l 决定，0、1、2、3 分别对应 s、p、d、f。');
unitJudgments(2,17,1,`
-|中心原子采用 sp³ 杂化时，分子一定为正四面体。|孤电子对也占据方向，例如 NH₃ 为三角锥形。
-|AB₂ 型分子的中心原子一定只有两个电子域。|H₂O 还有两对孤电子，合计四个电子域。
-|两个 p 轨道重叠成键时一定形成 π 键。|沿核间轴头碰头重叠可形成 σ 键。
-|C=C 的键能等于 C—C 单键键能的两倍。|双键的 σ 和 π 贡献不同。
-|HgCl₂ 和 XeF₂ 都呈直线形，因此两者中心原子都是 sp 杂化。|XeF₂ 是 AX₂E₃，中心还有三个孤电子对。
-|键级大小为 O₂⁻ > O₂ > O₂⁺。|它们的键级分别为 1.5、2、2.5。
-|取 z 为键轴时，两个原子的 2pₓ 和 2pᵧ 可有效重叠形成 π 轨道。|两个轨道的对称性不匹配，净重叠为零。
-|IF₅ 有六个电子域，所以分子构型为八面体。|电子域是八面体，去掉孤对所在位置后是四方锥。
+|按本章的局域成键模型，杂化轨道主要形成 σ 键或容纳孤对电子。|π 键通常由未参与杂化的 p 轨道侧向重叠形成。
+|在常见局域成键模型中，共价键有方向性和饱和性。|轨道沿合适方向重叠，每个原子的可用成键电子与轨道有限。
-|非极性分子一定没有极性键。|例如 CO₂ 的两根极性键方向相反，偶极抵消。
-|CO₂ 中心 C 有两个双键，所以 VSEPR 计四个电子域。|每个双键只占一个方向。
-|只有阴离子的电子云能够变形。|阳离子也有可极化性。
-|[Co(en)₃]³⁺ 的配位数是 3。|每个 en 有两个配位原子，配位数为 6。
-|电子只排在成键分子轨道上。|电子也可占据反键和非键轨道。
-|丙二烯中心碳为 sp 杂化，整分子为平面结构。|中心碳的两个未杂化 p 轨道相互垂直，两端 CH₂ 平面也相互垂直。
-|CH₄ 的杂化由 H 的 1s 和 C 的三个 p 轨道组合而来。|C 用自身的一个 2s 和三个 2p 杂化，随后与 H 的 1s 成键。
-|SCN⁻ 只能通过 N 配位。|它是两可配体，S 和 N 均可作为配位端。
-|O₂ 的基态为抗磁性。|两个简并 π* 轨道各有一个未成对电子，所以 O₂ 顺磁。
+|杂化轨道可因更有利的方向性而增强成键重叠。|杂化后形成的轨道可以朝向成键对象。
`);
unitChoice(2,17,1,'按教材杂化模型，中心原子采用 sp³ 杂化的是哪些？','NH₄⁺|H₂O|CH₂Cl₂|BF₃','ABC','前三者中心均有四个电子域，BF₃ 有三个。');
unitChoice(2,17,3,'哪些化合物的正、负离子都与 Ne 等电子？','NaCl|MgO|NaF|CaCl₂','BC','Mg²⁺、O²⁻、Na⁺、F⁻ 各有 10 个电子，Cl⁻ 有 18 个。');
unitFill(2,18,3,'等性 sp³ 杂化轨道中，s 和 p 的成分各占多少？',[cb('s 成分','1/4','1/3|1/2|3/4',['25%']),cb('p 成分','3/4','1/3|1/2|1/4',['75%'])],'一个 s 和三个 p 平均分到四个等价的杂化轨道中。');
unitFill(2,19,14,'原子轨道沿核间轴头碰头、在核间轴两侧肩并肩重叠，各形成什么键？',[cb('头碰头','σ','π|δ',['sigma','σ键']),cb('肩并肩','π','σ|δ',['pi','π键'])],'σ 重叠沿轴，π 重叠分布在轴两侧。');
unitJudgments(3,33,1,`
-|由不同元素组成的分子一定是极性分子。|CO₂ 的键偶极对称抵消。
-|NF₃、PCl₃、BCl₃ 的偶极矩均大于零。|BCl₃ 为对称平面三角形，键偶极抵消。
+|I₂ 溶于 CCl₄ 时，分子之间主要是色散力。|二者均无永久偶极。
+|正戊烷的沸点高于异戊烷。|正戊烷的链较伸展，分子接触更充分，色散作用更强。
+|HF 水溶液中可有氢键，而 CH₄ 和 CS₂ 之间通常没有氢键。|HF 和 H₂O 都可以参与形成常见氢键。
-|氢键没有方向性和饱和性。|典型氢键偏好接近直线的供体—H···受体排列。
+|HF 分子间比 HCl 分子间更容易形成典型氢键。|F 电负性大、体积小，H—F 键高度极化。
+|邻硝基苯酚较容易形成分子内氢键。|邻位基团距离近，可以在同一个分子内形成氢键。
+|理想稀溶液近似下，相同质量水中加入等物质的量的甘油和蔗糖，沸点升高近似相同。|两者均近似不解离，质量摩尔浓度相同。
-|足够稀时，等物质的量浓度的乙二醇水溶液和甘油水溶液的凝固点一定明显不同。|稀水溶液中 b 与 c 的数值可近似相等，两者均为非电解质。
-|表面规则光滑的固体一定是晶体。|外观不足以判断，例如玻璃也可以加工得很光滑。
+|普通晶体的内部微粒排列具有长程周期性。|晶胞沿三个方向重复形成晶格。
-|晶胞的大小直接决定整块晶体的大小。|宏观尺寸还取决于晶胞的重复数和生长条件。
-|仅凭外形不规则就可以判断固体为非晶体。|需要看内部结构，多晶材料的外形也可以不规则。
+|晶体粒子之间的作用力会影响晶体性质。|例如离子间静电作用会影响熔点。
-|理想稀溶液的蒸气压降低，是溶质挡住溶剂分子扩散和沉降所致。|拉乌尔定律用溶剂摩尔分数解释平衡蒸气压，不能把它归因于机械阻挡。
-|NaF、NaCl、NaBr、NaI 中，NaI 的晶格解离能最大。|同电荷下离子间距越小吸引越强，NaF 最大。
`);
unitChoice(3,34,4,'质量摩尔浓度的定义是哪一项？','每 100 g 溶剂所含溶质的物质的量|每 1 g 溶剂所含溶质的物质的量|每 1 kg 溶剂所含溶质的物质的量|溶质质量占溶液质量的百分数','C','b=n(溶质)/m(溶剂)，单位 mol·kg⁻¹。');
unitChoice(3,34,10,'按本章的晶体分类，哪些说法正确？','离子晶体中可能含共价键|离子晶体中不可能含共价键|典型分子晶体的分子之间不以离子键形成晶格|典型分子晶体的分子之间以离子键形成晶格','AC','例如硫酸钠中硫酸根内部有共价键。分子晶体的晶格由分子间作用维系。');
unitFill(3,33,8,'哪类离子的电荷数对胶体聚沉影响最大？电荷数增大时，聚沉能力怎样变化？',[cb('与胶粒电荷的关系','相反','相同|无关',['异号']),cb('电荷数越大，聚沉能力','越强','越弱|不变',['增强'])],'反号离子削弱胶粒之间的静电排斥，使其容易聚集。');
unitJudgments(4,49,1,`
-|ΔU=W+Q，因此 W 和 Q 也是状态函数。|只有两者的和等于状态函数 U 的变化。
+|热和功描述能量如何跨越系统边界。|它们取决于经历的过程。
-|常温下所有单质的标准摩尔生成焓均为零。|只有元素的参考态单质按约定为零。
-|298 K 的完整晶体标准摩尔熵为零。|热力学第三定律的零熵基准对应 0 K 的完美晶体。
+|298 K 下 H₂(g) 的标准摩尔燃烧焓等于 H₂O(l) 的标准摩尔生成焓。|二者对应相同反应 H₂(g)+½O₂(g)→H₂O(l)。
-|封闭系统与环境既不交换物质，也不交换能量。|封闭系统可以交换能量。
-|标准状态一定要在 298 K。|温度需另外说明，298 K 是常用数据温度。
-|物质的聚集状态相同，组成的系统一定是单相。|油和水都是液体，但通常分为两相。
-|盖斯定律说明任意条件下反应热都与路径无关。|可相加的是同一始末态之间的焓变，等压且仅做体积功时它等于反应热。
+|碘由固态升华为气态时熵增加。|气态可利用的微观状态更多。
-|ΔᵣG°(298 K)>0 意味着反应在任何条件下都不能正向自发。|实际方向还取决于温度和组成。
+|封闭体系等压且没有非体积功时，Qₚ 等于 ΔH。|把体积功代入 ΔU=Q+W，再使用 H=U+pV 即可得到。
+|同一物质同一相在定压升温时，熵通常增大。|定压下 dS=CₚdT/T。
-|封闭系统的熵总是增加。|封闭系统可能向外放热并输出熵。
+|通常约定 H⁺(aq) 的标准摩尔生成焓、生成吉布斯能和标准摩尔熵为零。|这是水溶液中单离子热力学量的基准约定。
-|只知道 KNO₃ 的溶解度与所加物质的量，就能断定溶解过程 ΔG>0。|还需要水量和组成。不饱和时固体溶解在热力学上可正向发生。
+|忽略凝聚相体积变化时，同温同反应进度下，铁与盐酸反应产生 H₂，Qₚ>Qᵥ。|只做体积功时，Qₚ−Qᵥ≈Δn(g)RT，生成气体使差值为正。
-|给定始末态后，ΔG 与途径无关，因此任何途径的非体积功都等于 ΔG。|等温等压下，仅可逆过程达到最大非体积功。
`);
unitChoice(4,51,10,'键焓 H—H 为 436、Cl—Cl 为 239、H—Cl 为 431 kJ·mol⁻¹。估算 H₂(g)+Cl₂(g)→2HCl(g) 的反应焓。','−224 kJ·mol⁻¹|−187 kJ·mol⁻¹|224 kJ·mol⁻¹|187 kJ·mol⁻¹','B','断键吸热、成键放热，所以是 436+239−2×431=−187。');
unitChoice(4,51,17,'同一系统经两条途径由 A 到 B。若 W 表示环境对系统做功，哪项必然成立？','Q₁=Q₂ 且 W₁=W₂|Q₁>Q₂ 且 W₁>W₂|Q₁<Q₂ 且 W₁<W₂|Q₁+W₁=Q₂+W₂','D','两条途径的 ΔU 相同，各自都等于 Q+W。原参考答案误标为 B。');
unitFill(4,52,2,'已知 2H₂O(g)→2H₂(g)+O₂(g) 的标准反应焓为 +483.6 kJ·mol⁻¹，求 H₂O(g) 的标准摩尔生成焓。',[cb('生成焓（kJ·mol⁻¹）','−241.8','241.8|−483.6|483.6')],'先逆转反应换符号，再把各系数与焓变除以 2，得到生成 1 mol 水蒸气的焓变。');
unitFill(4,52,8,'热力学能的变化由哪两个状态决定，与什么无关？',[cb('除终态外还需要','始态','中间态|过渡态',['初态']),cb('与什么无关','途径','始态|终态',['路径','过程'])],'U 是状态函数，ΔU=U终−U始。');
unitChoice(1,7,2,"第 5、6 周期的同族过渡元素（如 Zr 和 Hf）性质非常相近，主要原因是什么？","s 区元素的影响|p 区元素的影响|ds 区元素的影响|镧系收缩","D","4f 电子屏蔽较弱，第六周期相应元素的半径因镧系收缩而接近第五周期。");
unitChoice(1,7,3,"某中性原子在基态时，被电子占据的轨道中最大 n=3。它含哪些类型的电子？","只有 s|有 s 和 p|只有 p|有 s、p 和 d","B","对应第三周期 Na 至 Ar，3d 尚未开始填充。");
unitChoice(1,7,5,"忽略精细结构时，同一单电子原子中哪些轨道对等能？","2s 和 3s|2s 和 2pₓ|3d 和 4s|2pₓ 和 2pᵧ","BD","同一单电子原子内，n 相同则等能。");
unitChoice(1,7,6,"在近似能级图中，3d 的能量高于 4s。这属于什么现象？","镧系收缩|能量最低原理|能级交错|同层能级分裂","C","主量子数较小的 3d 在这张图中排在 4s 上面，属于不同电子层的能级交错。");
unitChoice(1,8,14,"He⁺ 的电子位于 n=2 时，能量是多少？","−3.4 eV|−13.6 eV|−6.8 eV|无法计算","B","类氢离子 E=−13.6Z²/n² eV，He⁺ 的核电荷数 Z=2。");
unitChoice(1,8,19,"按鲍林电负性，哪些从小到大排序正确？","S＜O＜N＜F|Si＜Na＜Mg＜Al|S＜N＜O＜F|Na＜Si＜S＜Cl","CD","N 的电负性低于 O，Na 低于 Si。原参考答案误标为 A。");
unitChoice(2,17,2,"按教材杂化模型，NCl₃ 的 N 原子采用哪种杂化？","sp|不等性 sp³|sp²|dsp²","B","三个成键域加一个孤电子对，分子为三角锥形。");
unitChoice(2,18,5,"哪种卤离子最易被极化？","F⁻|Cl⁻|Br⁻|I⁻","D","同族同电荷时，I⁻ 最大，外层电子云最容易变形。");
unitChoice(2,18,7,"SO₄²⁻ 的空间构型是什么？","平面四边形|四面体形|T 形|无法判断","B","中心 S 有四个成键域，无孤对电子。");
unitChoice(2,18,12,"哪些分子的空间构型为三角锥形？","H₂Se|NF₃|PCl₃|SiH₄","BC","NF₃、PCl₃ 均为 AX₃E，H₂Se 为 V 形，SiH₄ 为四面体。");
unitChoice(2,18,13,"ClO₃⁻ 的空间构型是什么？","直线形|T 形|三角锥形|平面三角形","C","三个成键域加一个孤对，原子骨架为三角锥。");
unitChoice(2,18,14,"NaCl 晶体中每个 Cl⁻ 的最近邻 Na⁺ 数目是多少？","1|4|6|8","C","六个最近邻沿三个相互垂直的轴分布在正负方向。");
unitChoice(3,34,2,"I₂ 与 CCl₄ 分子之间主要是哪种作用？","色散力|取向力|取向力和诱导力|氢键","A","二者均为非极性分子，瞬时偶极产生色散作用。");
unitChoice(3,34,3,"按本章分类，H₂O 与甲醇之间有哪些分子间作用？","色散力和氢键|诱导力、色散力和氢键|色散力、诱导力、取向力和氢键|色散力和诱导力","C","两种分子均有永久偶极，也可形成氢键。");
unitChoice(3,34,6,"10.0 g 非电解质溶于 100 g 水，凝固点降低 0.116 K。Kf=1.86 K·kg·mol⁻¹，相对分子质量约为多少？","1603|342|862|160","A","b=0.116/1.86，再用 0.100 kg 溶剂换算溶质物质的量。");
unitChoice(3,34,8,"同温、同为 0.1 mol·L⁻¹ 的水溶液，哪种渗透压最低？","蔗糖|NaHCO₃|NaCl|H₂SO₄","A","蔗糖基本不解离，同物质的量浓度下溶质粒子最少。");
unitChoice(4,51,7,"298 K、100 kPa 下，哪种物质的标准摩尔生成吉布斯能为零？","CO₂(g)|Br₂(g)|I₂(g)|O₂(g)","D","只有参考态单质按约定取零，常温下 Br₂、I₂ 的参考态分别为液态和固态。");
unitChoice(4,51,9,"CO₂(g) 的标准摩尔生成焓等于哪一项？","金刚石的标准燃烧焓|石墨的标准燃烧焓|CO(g) 的标准燃烧焓|碳酸钙的标准燃烧焓","B","碳的参考态是石墨，它完全燃烧恰好生成 CO₂。");
unitChoice(4,51,12,"同温下，按理想气体近似，2NH₃(g)→N₂(g)+3H₂(g) 的 ΔU° 与 ΔH° 关系如何？","ΔU°＜ΔH°|ΔU°＞ΔH°|ΔU°＝ΔH°|无法判断","A","ΔH°−ΔU°≈Δn(g)RT，气体计量数增加 2。");
unitChoice(4,52,18,"给定始末态时，哪一项与过程途径无关？","系统所做的功|系统吸收的热|系统热力学能的变化|前三项均有关","C","热力学能 U 是状态函数，热和功分别随路径变化。");

unitJudgments(4,50,20,`
-|盖斯定律只适用于可逆反应。|焓是状态函数，给定始末态即可相加。
+|若反应焓始终小于零且反应熵始终大于零，则在标准状态下任意正温度的标准反应吉布斯能均为负。|ΔᵣG°=ΔᵣH°−TΔᵣS°，两项都使结果变小。
-|热力学标准状态限定温度为 298 K。|标准状态可以在不同温度下规定，需单独说明温度。
-|Qₚ−Qᵥ≈Δn(g)RT 只适用于所有物质都是气体的反应。|当凝聚相体积项可忽略且气体近似理想时，有固体或液体也可以用。
+|同温下若 ΔH＞ΔG，系统的熵变为正。|由 ΔG=ΔH−TΔS 得 TΔS＞0。
-|等温过程必然不交换热量。|例如液体在沸点汽化可以吸热而保持温度。
-|任意条件下，反应焓变都等于反应热。|常见成立条件为封闭系统、等压、无非体积功。
+|在正向为吸热的温区内，对已达平衡的体系恒压升温，平衡趋向正向。|升温使吸热反应的平衡常数增大。这里明确了原题所需的平衡条件。
-|298 K 时，参考态气体单质的标准生成焓、标准生成吉布斯能及标准摩尔熵均为零。|前两项按约定为零，标准摩尔熵通常大于零。
+|孤立系统内，自发的不可逆过程使总熵增大。|孤立系统与外界无物质或能量交换，熵产生为正。
-|298 K 时，参考态单质的标准生成焓和标准摩尔熵均为零。|标准生成焓的零点约定不适用于熵。
`);
CHEM_UNIT_QUESTIONS.sort((a,b)=>a.chapter-b.chapter||'JCF'.indexOf(a.number[0])-'JCF'.indexOf(b.number[0])||Number(a.number.slice(1))-Number(b.number.slice(1)));

unitChoice(1,7,8,"关于原子轨道，哪些说法正确？","l 决定轨道形状类型|仅凭 l 就能确定轨道的空间取向|整个原子只有 2l+1 个轨道|波函数描述电子的确定轨迹","A","固定 n 和 l 的亚层才有 2l+1 个空间轨道。");
unitChoice(1,8,10,"给定某原子的 n、l、m 后，仍不能知道什么？","该轨道实际占有的电子数|轨道的形状类型|在教材轨道模型中该轨道所属的能级|这一组量子数指定几个空间轨道","A","空间轨道可以是空的，也可以装一个或两个电子。");
unitChoice(1,8,13,"关于屏蔽和钻穿，哪项不正确？","屏蔽使电子感受到的有效核电荷减小|屏蔽越强，其他条件相同时电子能量越低|钻穿较强的电子可对其他电子产生更强屏蔽|其他条件相同时屏蔽常数越大，电子能量越高","B","有效核电荷降低会使束缚变弱，轨道能量升高。原参考答案多标了 D。");
unitChoice(1,8,15,"N、P、S、O 中哪种元素的鲍林电负性最大？","N|P|S|O","D","这四种元素中 O 吸引成键电子的能力最强。");
unitChoice(1,8,16,"最早提出能量量子化假设的是谁？","德布罗意|爱因斯坦|普朗克|薛定谔","C","普朗克用离散的能量交换解释黑体辐射。");
unitChoice(1,8,17,"谁提出电子等实物粒子也有波动性？","德布罗意|爱因斯坦|普朗克|薛定谔","A","德布罗意关系为 λ=h/p，p 是粒子的动量。");
unitChoice(1,8,18,"在非相对论氢原子模型中，给定 n 时同能量的空间轨道有多少个？","n²|2(l+1)|2l+1|n−1","A","将 l 从 0 到 n−1 的 2l+1 个轨道相加即得 n²。");
unitChoice(1,8,20,"传统 IVB 族的典型价电子构型是什么？","ns²nd²|ns¹nd³|(n−1)d³ns¹|(n−1)d²ns²","D","例如 Ti 的价电子为 3d²4s²。");
unitChoice(2,18,6,"哪种离子晶体熔点最高？","NaCl|CaCl₂|MgO|BaO","C","Mg²⁺ 与 O²⁻ 电荷较高且离子间距小，晶格相互作用强。");
unitChoice(2,18,8,"关于分子轨道，哪些说法错误？","可用原子轨道线性组合表示|能量相近、对称性匹配且重叠较大有利于有效组合|杂化轨道就是分子轨道|任一反键轨道都比任一成键轨道能量高","CD","杂化轨道属于原子轨道模型。反键高于对应成键轨道，不能跨组一概比较。");
unitChoice(2,18,9,"关于教材中的杂化模型，哪些说法错误？","杂化轨道属于分子轨道|乙烯用杂化轨道侧向重叠形成 π 键|乙烯中 C 可用 sp² 杂化描述|乙烯用杂化轨道形成 σ 键","AB","杂化发生在同一原子上。乙烯的 π 键由未杂化的 p 轨道形成。");
unitChoice(2,18,11,"按离子极化模型，哪组离子性由强到弱排列合理？","CsF＞RbCl＞KBr＞NaI|RbBr＞CsI＞NaF＞KCl|KCl＞NaF＞CsI＞RbBr|CsF＞RbBr＞KCl＞NaF","A","阳离子越小越能极化阴离子，阴离子越大越容易变形，两者均会提高共价性。");
unitChoice(2,18,15,"在下列等电子阳离子中，哪一种极化能力最强？","K⁺|Ca²⁺|Ti⁴⁺|Sc³⁺","C","四者均有 18 个电子，Ti⁴⁺ 电荷最大、半径最小。");
unitChoice(3,33,1,"关于键极性与分子极性，哪些说法正确？","极性分子可以有非极性键|极性分子内所有键均为极性键|非极性分子可以有极性键|非极性分子内所有键均为非极性键","AC","例如 H₂O₂ 有非极性 O—O 键，CO₂ 有极性 C=O 键但总偶极为零。");
unitChoice(3,34,5,"同一温度下 A 的饱和蒸气压比 B 高。若两条蒸气压曲线在比较的温区内不交叉，哪些结论成立？","同一外压下 A 的沸点较低|同一外压下 A 的沸点较高|此温度下 A 更易挥发|此温度下 A 更难挥发","AC","沸腾需要蒸气压达到外压。较高的蒸气压对应较强的挥发倾向。");
unitChoice(3,34,9,"按完全解离和稀溶液近似，等物质的量浓度的哪种水溶液沸点最高？","甘油|NaCl|AlCl₃|蔗糖","C","AlCl₃ 每式量单位近似形成 4 个粒子，i 最大。");
unitChoice(3,34,12,"关于稀溶液依数性，哪项错误？","难挥发溶质的理想溶液中 p=p°x溶剂|难挥发溶质可使水溶液沸点升高、凝固点降低|可通过凝固点降低估算非电解质的摩尔质量|等质量的乙醇和丁醇分别配成等体积稀溶液，渗透压一定相同","D","两者摩尔质量不同，所以等质量并不对应等物质的量。");
unitChoice(4,50,1,"已知 CO+H₂O→CO₂+H₂、CO+H₂→C+H₂O、CO+3H₂→CH₄+H₂O 的反应焓依次为 −40.8、−131.3、−206.1 kJ·mol⁻¹。求 CH₄+CO₂→2C+2H₂O 的反应焓。","509.5|−509.5|−15.7|15.7","C","目标反应等于第二式乘 2，再减第一、第三式，得到 −15.7 kJ·mol⁻¹。");
unitChoice(4,50,3,"标准状态下某反应 298 K 不自发而高温自发。近似认为 ΔH°、ΔS° 不随温度变化，符号如何？","均负|焓正熵负|焓负熵正|均正","D","ΔG° 随升温降低，所以 ΔS°＞0。低温处 ΔG° 为正，要求 ΔH°＞0。");
unitChoice(4,51,8,"298 K 下 C₁₀H₈(s)+12O₂(g)→4H₂O(g)+10CO₂(g)，理想气体近似下 Qᵥ−Qₚ 约为多少？","−4.95 kJ·mol⁻¹|4.95 kJ·mol⁻¹|−2.48 kJ·mol⁻¹|2.48 kJ·mol⁻¹","A","气体计量数净增 2，所以 Qᵥ−Qₚ≈−2RT。");
unitChoice(4,51,15,"下列哪个反应的标准反应熵小于零？","2CO(g)+O₂(g)→2CO₂(g)|2NH₄NO₃(s)→2N₂(g)+4H₂O(g)+O₂(g)|2O₃(g)→3O₂(g)|F₂(g)→2F(g)","A","A 的气体物质的量减少，其他三项均增加。");
unitChoice(4,51,16,"关于反应焓和热效应，哪项正确？","焓本身等于等压反应热|封闭体系等压且只有体积功时，焓变等于反应热|只有等压过程才有反应热|所有单质的标准生成焓都为零","B","ΔH 是变化量。等压且无非体积功时 ΔH=Qₚ。");
unitFill(1,8,3,'写出 Zn²⁺ 基态电子排布的稀有气体简写。',[cb('电子排布','[Ar]3d¹⁰','[Ar]3d⁸4s²|[Ar]3d¹⁰4s²|[Ar]3d⁸',['[Ar]3d10'])],'Zn 先失去两个最外层 4s 电子。');
unitFill(1,9,7,'忽略精细结构时，氢原子从 1s 激发到 2s 或 2p 所需的能量有何关系？',[cb('所需能量','相等','不同|无法判断',['一样','相同'])],'两种末态的 n 同为 2，能量相同。');
unitFill(1,9,9,'He⁺ 的电子从 n=2 激发到 n=3，需要多少 eV？保留两位小数。',[cb('能量（eV）','7.56','−7.56|5.44|13.60')],'ΔE=13.6×4×(1/4−1/9)≈7.56 eV。');
unitFill(1,9,10,'可以用什么函数表示微观粒子的量子态？',[cb('函数名称','波函数','概率密度函数|径向分布函数|轨迹函数')],'波函数 ψ 描述量子态，其模方给出位置概率密度。');
unitFill(2,19,5,'尿素 CO(NH₂)₂ 中羰基碳采用什么杂化？',[cb('杂化类型','sp²','sp|sp³|dsp²',['sp2','sp^2'])],'羰基碳与 O 和两个 N 分别成键，共三个电子域。');
unitFill(2,19,7,'比较 [Co(en)₂Cl₂]⁺ 和 [Ni(en)₂]Cl₂ 的配位数与配体数，再写出 EDTA 通常能提供几个配位原子。',[cb('Co 的配位数','6','2|4|8'),cb('Co 的配体数','4','2|6|8'),cb('Ni 的配位数','4','2|6|8'),cb('Ni 的配体数','2','4|6|8'),cb('EDTA 提供的配位原子数','6','2|4|8')],'en 是双齿配体。方括号外的 Cl⁻ 不计入配位。EDTA 通常是六齿配体。');
unitFill(2,19,10,'N₂⁺ 的键级为多少？',[cb('键级','2.5','1.5|2|3')],'N₂ 的键级为 3。从最高占据的成键轨道移走一个电子，键级降低 0.5。');
unitFill(3,33,3,'0.911 g 非电解质溶于 50.00 g 苯，凝固点降低 0.603 K。Kf=5.12 K·kg·mol⁻¹，求相对分子质量，保留一位小数。',[cb('相对分子质量','154.7','15.5|77.4|309.4')],'先用 ΔTf/Kf 算质量摩尔浓度，再乘溶剂质量 0.05000 kg 求溶质的物质的量。');
unitFill(3,33,7,'0.400 g 高分子配成 1.00 L 溶液，298 K 时渗透压 0.500 kPa。R=8.314 kPa·L·mol⁻¹·K⁻¹，求相对分子质量，取整数。',[cb('相对分子质量','1982','198|991|4955')],'先用 n=πV/(RT) 算溶质的物质的量，再用质量除以物质的量。');
unitFill(4,52,4,'用系统自身的熵增判断自发方向，要求系统属于哪一类？',[cb('系统类型','孤立系统','封闭系统|敞开系统|恒压系统',['隔离系统','孤立','隔离'])],'孤立系统与环境不交换能量或物质，所以系统的熵变就是总熵变。');
unitFill(4,52,9,'理想气体的标准态取什么压力？',[cb('压力（kPa）','100','101.325|1|298',['100kPa'])],'化学热力学标准压力为 100 kPa，温度需另行给定。');
const CHEM_UNIT_POINT_IDS=[
  {
    "J": "degeneracy quantum-numbers electron-configuration wavefunction quantum-numbers electron-configuration atomic-radius electron-configuration ground-excited quantum-numbers probability-density quantum-numbers electron-configuration electronegativity radial-distribution photon photon uncertainty wave-particle photon orbital-node penetration shielding electron-configuration electron-configuration",
    "C": "quantum-numbers shielding electron-configuration quantum-numbers degeneracy penetration quantum-numbers quantum-numbers degeneracy quantum-numbers quantum-numbers quantum-numbers shielding ground-excited electronegativity photon wave-particle degeneracy electronegativity electron-configuration",
    "F": "electron-configuration electron-configuration electron-configuration electron-configuration electron-configuration quantum-numbers degeneracy wave-particle ground-excited wavefunction photon shielding quantum-numbers atomic-radius radial-distribution"
  },
  {
    "J": "hybrid-orbital electron-domain sigma-pi bond-parameters electron-domain bond-order sigma-pi electron-domain hybrid-orbital valence-bond covalent-polarity electron-domain ionic-polarization coordination-number molecular-orbital hybrid-orbital hybrid-orbital ligand bond-order hybrid-orbital",
    "C": "hybrid-orbital hybrid-orbital electron-configuration ionic-polarization ionic-polarization ionic-bond electron-domain molecular-orbital hybrid-orbital coordinate-bond ionic-polarization electron-domain electron-domain packing ionic-polarization",
    "F": "hybrid-orbital molecular-shapes hybrid-orbital sigma-pi hybrid-orbital coordination-spheres coordination-number ionic-bond lewis-structure bond-order bond-parameters ligand ligand sigma-pi metal-band"
  },
  {
    "J": "dipole dipole intermolecular-forces intermolecular-forces hydrogen-bond hydrogen-bond hydrogen-bond hydrogen-bond boiling-elevation colligative-properties crystal crystal unit-cell crystal crystal-types raoult ionic-bond",
    "C": "dipole intermolecular-forces intermolecular-forces molality vapor-pressure boiling-elevation semipermeable osmotic-pressure vanthoff-factor crystal-types colloid colligative-properties",
    "F": "crystal-types partial-pressure boiling-elevation intermolecular-forces hydrogen-bond crystal-types osmotic-pressure colloid",
    "N": "osmotic-pressure boiling-elevation boiling-elevation molality raoult"
  },
  {
    "J": "internal-energy heat-work formation-combustion entropy-laws formation-combustion system-types standard-state phase hess entropy-laws reaction-free-energy enthalpy entropy-laws entropy-laws standard-state reaction-free-energy enthalpy gibbs phase-equilibrium hess gibbs standard-state enthalpy gibbs thermo-process enthalpy gibbs standard-state entropy-laws entropy-laws",
    "C": "hess formation-combustion gibbs reaction-extent state-function formation-combustion reaction-free-energy enthalpy formation-combustion bond-parameters formation-combustion enthalpy entropy-microstates hess entropy-laws enthalpy internal-energy state-function",
    "F": "enthalpy formation-combustion gibbs entropy-laws hess entropy-laws gibbs state-function standard-state",
    "N": "transition-temperature transition-temperature bond-parameters hess transition-temperature formation-combustion transition-temperature phase-equilibrium transition-temperature transition-temperature"
  }
];
for(const q of CHEM_UNIT_QUESTIONS){
  q.pointId=CHEM_UNIT_POINT_IDS[q.chapter-1]?.[q.number[0]]?.split(' ')[Number(q.number.slice(1))-1];
}
function chemistryUnitPointLink(q){
  const point=chemistryPoint(q.pointId);
  return point?`<p><a class="btn secondary" data-chem-question-point href="${chemStudyURL(point)}">知识点讲解 · ${escapeHTML(point.title)} →</a></p>`:'';
}
addUnit(3,34,'N1',"298 K 时，6.6 g 非电解质配成约 1.00 L 水溶液，π=248 kPa，水质量约 1.00 kg，Kb=0.52 K·kg·mol⁻¹。求相对分子质量和正常沸点。",{blanks:[numBlank("相对分子质量",66,"6.6|132|660",0.3),numBlank("沸点（℃）",100.052,"100.52|99.948|100.0052",0.001)]},"由 πV=nRT 得约 0.100 mol，再由 ΔTb=Kb·b 得 0.052 K。");
addUnit(3,34,'N2',"0.322 g 非电解质溶于 80 g 苯，凝固点由 5.50 ℃ 降到 5.34 ℃。Kf=5.12 K·kg·mol⁻¹，求相对分子质量。",{blanks:[numBlank("相对分子质量",128.8,"12.88|64.4|257.6",0.15)]},"用 ΔTf=Kf·b，溶剂质量要用 0.080 kg。");
addUnit(3,34,'N3',"3.00 g 尿素溶于 50.0 g 水，尿素 M=60.0 g·mol⁻¹，水的 Kb=0.512、Kf=1.86。求常压下沸点与凝固点。",{blanks:[numBlank("沸点（℃）",100.512,"99.488|100.0512|101.86",0.005),numBlank("凝固点（℃）",-1.86,"1.86|-0.512|-0.186",0.01)]},"尿素 0.0500 mol，b=1.00 mol·kg⁻¹，沸点加 ΔTb，凝固点减 ΔTf。");
addUnit(3,35,'N4',"100 g 质量分数 95.0% 的硫酸溶液加入 400 g 水，密度 1.13 g·cm⁻³，硫酸摩尔质量 98.0 g·mol⁻¹。按配制量计算各浓度。",{blanks:[numBlank("质量百分数（填数字）",19.0,"23.75|18.8|95",0.05),numBlank("物质的量浓度（mol/L）",2.19,"2.39|1.94|0.219",0.01),numBlank("质量摩尔浓度（mol/kg）",2.39,"2.19|1.94|0.239",0.01),numBlank("硫酸摩尔分数",0.0413,"0.19|0.9587|0.413",0.0001)]},"溶质质量 95 g，溶剂 405 g，溶液体积 500/1.13 mL。摩尔分数用硫酸和水的形式物质的量计算。");
addUnit(3,35,'N5',"按题给数据，等物质的量的 CHCl₃ 与 CCl₄ 形成理想溶液。两纯组分蒸气压分别 199.1 与 114.5 Pa，摩尔质量分别 119.5 与 154 g/mol。求总蒸气压和蒸气中 CHCl₃ 的质量百分数。",{blanks:[numBlank("总蒸气压（Pa）",156.8,"313.6|99.55|114.5",0.1),numBlank("质量百分数（填数字）",57.43,"63.49|50|42.57",0.06)]},"两液相摩尔分数各为 0.5，先乘纯组分蒸气压求分压，再按分压乘摩尔质量求蒸气质量比。");
addUnit(4,52,'N1',"WI₂(s)→W(s)+I₂(g)。三者按 WI₂、W、I₂ 顺序的标准生成焓为 −8.37、0、62.24 kJ/mol，标准摩尔熵为 250.4、33.5、260.0 J/(mol·K)。估算标准态下的分解临界温度。",{blanks:[numBlank("临界温度（K）",1638,"16.38|609|777.5",1)]},"产物减反应物得 ΔH°=70.61 kJ/mol、ΔS°=43.1 J/(mol·K)，令 ΔG°=0 求临界温度。");
addUnit(4,52,'N2',"CaCO₃(s)→CaO(s)+CO₂(g)。依次给出三物质标准生成焓 −1206.9、−635.1、−393.51 kJ/mol，标准摩尔熵 92.9、39.75、213.64 J/(mol·K)。求反应焓和分解临界温度。",{blanks:[numBlank("反应焓（kJ/mol）",178.29,"-178.29|130.46|160.49",0.02),numBlank("临界温度（K）",1110.9,"298|777.5|1638",1)]},"反应焓和熵用生成物减反应物，ΔS°=160.49 J/(mol·K)，统一单位后用 T=ΔH°/ΔS°。");
addUnit(4,52,'N3',"生成 1 mol NH₃(g) 放热 46.2 kJ，已知 N≡N、H—H 键能为 946、436 kJ/mol，估算 N—H 键能。",{blanks:[numBlank("键能（kJ/mol）",391.1,"345|782.2|436",0.1)]},"½N₂+1½H₂→NH₃，断键耗能 1127 kJ，形成三根 N—H，故 1127−3D=−46.2。");
addUnit(4,53,'N6',"葡萄糖(s)、CO₂(g)、H₂O(l) 标准生成焓分别为 −1260、−393.5、−285.8 kJ/mol，求葡萄糖的标准摩尔燃烧焓。",{blanks:[numBlank("燃烧焓（kJ/mol）",-2816,"2816|-4076|-1260",1)]},"每 mol 葡萄糖完全燃烧生成 6 mol CO₂ 和 6 mol 水，反应焓为 6×(−393.5−285.8)−(−1260)。");
addUnit(4,53,'N8',"乙醇在 298 K 的汽化焓为 42.55 kJ/mol，汽化熵为 121.6 J/(mol·K)。用这些数据估算 100 kPa 下沸点。",{blanks:[numBlank("沸点（℃）",76.8,"349.9|25|121.6",0.2)]},"汽液平衡时 ΔG=0，T≈ΔH/ΔS=349.9 K，再减 273.15。");
for(const q of CHEM_UNIT_QUESTIONS){
  q.pointId=CHEM_UNIT_POINT_IDS[q.chapter-1]?.[q.number[0]]?.split(' ')[Number(q.number.slice(1))-1];
  if(q.pointId==='colloid')q.pointId=q.number[0]==='F'?'specific-ion':'colloidal-structure';
  if(q.number.startsWith('N'))q.answerPage=q.chapter===3?(Number(q.number.slice(1))===1?35:36):54;
  q.answerURL='materials/unit-test/'+CHEM_UNIT_PHOTOS[q.chapter][q.answerPage]+'.jpg';
}
function addUnitPDF(chapter,set,number,page,pointId,prompt,body,explanation){
  const url='materials/unit-test/pdf-'+String(page).padStart(2,'0')+'.jpg';
  CHEM_UNIT_QUESTIONS.push({id:`unit-pdf-${set}-${number}`,chapter,number,page,answerPage:page,sourceTitle:`第 ${chapter} 章 · 练习卷 ${set}`,
    sourceURL:url,answerURL:url,pointId,prompt,explanation,...body});
}
function pdfUnitJudge(chapter,set,n,page,pointId,prompt,correct,explanation){
  addUnitPDF(chapter,set,'J'+n,page,pointId,prompt,{options:['正确','错误'],answers:[correct?0:1]},explanation);
}
pdfUnitJudge(4,1,1,1,'enthalpy','恒温恒压时，无论有没有非体积功，反应热都等于焓变。',false,'还要求没有非体积功。');
pdfUnitJudge(4,1,3,1,'reaction-free-energy','实际组成下 ΔᵣG＜0，就能推出 ΔᵣG°＜0。',false,'ΔᵣG=ΔᵣG°+RT ln Q，实际组成影响反应方向。');
pdfUnitJudge(8,1,4,1,'arrhenius','适当的催化剂能加快正、逆反应，但不改变平衡组成。',true,'催化剂改变反应路径，不改变始末态的热力学量。');
pdfUnitJudge(4,1,6,1,'reaction-extent','反应进度增加 1 mol，所有生成物都一定增加 1 mol。',false,'各生成物的增量是它的计量数乘反应进度变化。');
pdfUnitJudge(1,1,10,1,'wavefunction','原子轨道就是电子出现概率最大的那块空间。',false,'原子轨道是空间波函数。等概率或包含指定概率的界面图只是画法。');
pdfUnitJudge(1,1,11,1,'electron-configuration','同一空间轨道的两个电子自旋投影相反，简并轨道按洪德规则先单占。',true,'同轨道满足泡利原理，简并轨道优先平行自旋单占。');
pdfUnitJudge(2,2,2,4,'metal-band','按能带模型，金属有可供电子在电场下跃迁的近邻空态。',true,'部分填充能带或能带重叠可提供能量相近的空态。');
pdfUnitJudge(4,2,5,4,'standard-state','可以在 500 K 指定纯物质的标准态，标准压力仍取 100 kPa。',true,'标准态需要指定温度，298 K 是常用温度。');
pdfUnitJudge(2,2,10,5,'molecular-orbital','异号重叠就一定说明原子轨道的对称性不匹配。',false,'异号重叠可以形成反键组合。要判断对称性是否允许净重叠。');
pdfUnitJudge(4,3,1,7,'enthalpy','任何条件下，反应焓变都等于反应热。',false,'封闭系统等压、没有非体积功时才有 Qₚ=ΔH。');
pdfUnitJudge(1,3,3,7,'wavefunction','原子轨道是原子运动的轨迹。',false,'原子轨道用空间波函数描述电子状态。');
pdfUnitJudge(4,3,4,7,'state-function','因为特定条件下 ΔH=Qₚ，所以 Q 也总是状态函数。',false,'焓是状态函数，热是过程量。');
pdfUnitJudge(4,3,6,7,'reaction-extent','反应进度增加 1 mol 的含义是一定得到 1 mol 产物。',false,'产物增加量取决于该产物的计量数。');
pdfUnitJudge(1,3,9,7,'electron-configuration','第三周期有 8 种元素，因为第三电子层最多只能装 8 个电子。',false,'第三层最多 18 个电子。第三周期基态主要填充 3s 和 3p。');
addUnitPDF(2,1,'C2',2,'bond-order','按分子轨道键级，O₂、O₂⁺、O₂⁻ 的键强趋势如何？',{options:['O₂＞O₂⁻＞O₂⁺','O₂＞O₂⁺＞O₂⁻','O₂⁺＞O₂＞O₂⁻'],answers:[2]},'移走一个反键电子使键级由 2 增至 2.5，加入一个则降至 1.5。');
addUnitPDF(2,2,'C5',6,'electron-domain','XeF₄ 的分子构型是什么？',{options:['四面体','四方锥','平面正方形'],answers:[2]},'XeF₄ 为 AX₄E₂，两个孤对占八面体的相对顶点。原卷误标为四方锥。');
addUnitPDF(2,3,'C3',8,'bond-order','按本章简单键级模型，N₂、O₂、B₂ 的键强趋势如何？',{options:['O₂＞N₂＞B₂','B₂＞O₂＞N₂','N₂＞B₂＞O₂','N₂＞O₂＞B₂'],answers:[3]},'三者键级分别为 3、2、1。');
addUnitPDF(4,2,'N2',6,'formation-combustion','CH₄(g)+2O₂(g)→CO₂(g)+2H₂O(g)。CH₄、CO₂、H₂O(g) 的标准生成焓依次为 −74.85、−393.5、−241.82 kJ/mol。求标准反应焓。',{blanks:[numBlank('反应焓（kJ/mol）',-802.29,'802.29|-560.47|-952.0',.05)]},'−393.5+2×(−241.82)−(−74.85)=−802.29。原卷漏写负号。');
CHEM_UNIT_CHAPTERS.push([8,'化学反应动力学']);
